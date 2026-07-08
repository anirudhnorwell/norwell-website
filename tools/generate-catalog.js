/*
 * generate-catalog.js
 * Walks the images/ folder and emits catalog.js (window.CATALOG), so product
 * image paths always match the real files on disk.
 *
 * Run from repo root:  node tools/generate-catalog.js
 *
 * Structure produced:
 *   CATALOG = [{ id, name, image, subcategories: [{ id, name, image, products }] }]
 *   product = { id, name, image, images: [..] }
 * Categories with no real subcategories expose a single implicit subcategory
 * with id "" so the renderer can treat everything uniformly.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const OUT_FILE = path.join(ROOT, 'catalog.js');

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const EXCLUDE_DIRS = new Set(['Slideshow']);

// Category display order + labels
const CATEGORY_ORDER = ['Bottles', 'Combo', 'Dustbin', 'LunchBox'];
const CATEGORY_NAMES = {
  Bottles: 'Bottles',
  Combo: 'Combo Sets',
  Dustbin: 'Dustbins',
  LunchBox: 'Lunch Boxes',
};

// Pretty display names for known product/folder keys
const NAME_MAP = {
  Classic: 'Classic',
  Curvy: 'Curvy',
  CurvyBSC: 'Curvy BSC',
  FloraBlackLogo: 'Flora',
  Sports: 'Sports',
  CurvyB: 'Curvy Black',
  SportsBlackCap: 'Sports Black Cap',
  'ClimatePro-MattSteel': 'ClimatePro Matt Steel',
  'ClimatePro-Black': 'ClimatePro Black',
  'ClimatePro-Crocodile': 'ClimatePro Crocodile',
  'Dual Core-Military Green': 'Dual Core Military Green',
  'DualCOre-NavyBlue': 'Dual Core Navy Blue',
  'DualCore-Delta': 'Dual Core Delta',
  DustbinPerforated: 'Perforated',
  DustbinPerfWithPeddal: 'Perforated Pedal',
  DustbinSmoothwithpeddal: 'Smooth Pedal',
  Swing: 'Swing Lid',
  TiffinSteellidBlack: 'Tiffin Steel Lid Black',
  TiffinSteellidBlue: 'Tiffin Steel Lid Blue',
  Tiffini30: 'Tiffin 30',
};

// Clean, stable ids for nicer deep-link URLs (defaults to slug of folder/file).
const ID_MAP = {
  FloraBlackLogo: 'flora',
  CurvyB: 'curvy-black',
  SportsBlackCap: 'sports-black-cap',
  DustbinPerforated: 'perforated',
  DustbinPerfWithPeddal: 'perforated-pedal',
  DustbinSmoothwithpeddal: 'smooth-pedal',
  Swing: 'swing',
  TiffinSteellidBlack: 'tiffin-steel-lid-black',
  TiffinSteellidBlue: 'tiffin-steel-lid-blue',
  Tiffini30: 'tiffin-30',
};

function idFor(key) {
  return ID_MAP[key] || slug(key);
}

function pretty(key) {
  if (NAME_MAP[key]) return NAME_MAP[key];
  return key
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

function slug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function listDirs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !EXCLUDE_DIRS.has(d.name))
    .map((d) => d.name)
    .sort(naturalSort);
}

function listImages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && IMAGE_RE.test(d.name))
    .map((d) => d.name)
    .sort(naturalSort);
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

// Put "Main" image first, then the rest naturally sorted.
function orderImages(files) {
  const main = files.filter((f) => /^main\b/i.test(f.replace(IMAGE_RE, '')));
  const rest = files.filter((f) => !main.includes(f));
  return [...main, ...rest];
}

function rel(...parts) {
  return ['images', ...parts].join('/');
}

// Build a product from a subdirectory of images.
function productFromDir(catDir, subPath, dirName) {
  const abs = path.join(IMAGES_DIR, catDir, ...subPath, dirName);
  const imgs = orderImages(listImages(abs));
  if (!imgs.length) return null;
  const images = imgs.map((f) => rel(catDir, ...subPath, dirName, f));
  return {
    id: idFor(dirName),
    name: pretty(dirName),
    image: images[0],
    images,
  };
}

// Build a product from a single loose image file.
function productFromFile(catDir, subPath, fileName) {
  const image = rel(catDir, ...subPath, fileName);
  const key = fileName.replace(IMAGE_RE, '');
  return {
    id: idFor(key),
    name: pretty(key),
    image,
    images: [image],
  };
}

// Loose files that are supporting shots, not standalone products.
const SUPPORT_FILE = /^(main|length|box|package|dimension|features?|open)\b/i;

function productsIn(catDir, subPath) {
  const abs = path.join(IMAGES_DIR, catDir, ...subPath);
  const entries = fs.readdirSync(abs, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory() && !EXCLUDE_DIRS.has(e.name))
    .map((e) => e.name).sort(naturalSort);
  const files = entries.filter((e) => e.isFile() && IMAGE_RE.test(e.name))
    .map((e) => e.name).sort(naturalSort);

  const products = [];
  dirs.forEach((d) => {
    const p = productFromDir(catDir, subPath, d);
    if (p) products.push(p);
  });
  files.forEach((f) => {
    if (SUPPORT_FILE.test(f.replace(IMAGE_RE, ''))) return;
    products.push(productFromFile(catDir, subPath, f));
  });
  return products;
}

function buildCategory(catDir) {
  const abs = path.join(IMAGES_DIR, catDir);
  const subDirs = listDirs(abs);
  const looseFiles = listImages(abs);

  // A category has real subcategories only when its subdirectories themselves
  // contain subdirectories (Bottles). Otherwise subdirs are products.
  const hasSubcats = subDirs.some((d) => listDirs(path.join(abs, d)).length > 0);

  let subcategories;
  if (hasSubcats) {
    subcategories = subDirs.map((sub) => {
      const products = productsIn(catDir, [sub]);
      return {
        id: slug(sub),
        name: pretty(sub),
        image: products.length ? products[0].image : '',
        products,
      };
    }).filter((s) => s.products.length);
  } else {
    // Single implicit subcategory holding all products.
    const products = productsIn(catDir, []);
    subcategories = [{ id: '', name: '', image: products.length ? products[0].image : '', products }];
  }

  const firstImg = subcategories.find((s) => s.image) ;
  return {
    id: slug(catDir),
    name: CATEGORY_NAMES[catDir] || pretty(catDir),
    image: firstImg ? firstImg.image : '',
    subcategories,
  };
}

function main() {
  const catalog = CATEGORY_ORDER
    .filter((c) => fs.existsSync(path.join(IMAGES_DIR, c)))
    .map(buildCategory)
    .filter((c) => c.subcategories.length);

  const banner = '// AUTO-GENERATED by tools/generate-catalog.js — do not edit by hand.\n' +
    '// Regenerate with: node tools/generate-catalog.js\n';
  const body = 'window.CATALOG = ' + JSON.stringify(catalog, null, 2) + ';\n';
  fs.writeFileSync(OUT_FILE, banner + body);

  // Report
  let productCount = 0;
  catalog.forEach((c) => c.subcategories.forEach((s) => { productCount += s.products.length; }));
  console.log('Wrote', path.relative(ROOT, OUT_FILE));
  console.log('Categories:', catalog.length, '| Products:', productCount);
}

main();
