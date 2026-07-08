// script.js — Norwell futuristic catalog experience
// Everything product-related is driven by window.CATALOG (see catalog.js),
// which is auto-generated from the real images/ folder so paths never break.

'use strict';

/* ─────────────────────────── Boot ─────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  buildNav();
  initNavbarScroll();
  initFAQ();
  handleQuoteForm();
  buildLightbox();

  var shopRoot = document.getElementById('shopRoot');
  if (shopRoot) {
    initShop(shopRoot);
    window.addEventListener('hashchange', function () { syncShopFromHash(); });
  }
});

/* ─────────────────────── Catalog helpers ──────────────────── */
function catalog() { return window.CATALOG || []; }

function findCategory(id) {
  return catalog().find(function (c) { return c.id === id; }) || null;
}
function findSubcategory(cat, id) {
  if (!cat) return null;
  return cat.subcategories.find(function (s) { return s.id === id; }) || cat.subcategories[0] || null;
}
function findProduct(sub, id) {
  if (!sub) return null;
  return sub.products.find(function (p) { return p.id === id; }) || null;
}
function hasRealSubcats(cat) {
  return !(cat.subcategories.length === 1 && cat.subcategories[0].id === '');
}

/* ─────────────────────── Navigation bar ───────────────────── */
function buildNav() {
  var menu = document.querySelector('.nav-menu');
  if (!menu) return;

  var items = [
    { label: 'Home', href: 'index.html#home' },
    { label: 'About', href: 'index.html#about' },
    { label: 'Contact', href: 'index.html#contact' },
    { label: 'FAQ', href: 'index.html#faq' }
  ];

  var html = '';
  html += '<li class="nav-item"><a href="' + items[0].href + '" class="nav-link">Home</a></li>';
  html += '<li class="nav-item"><a href="' + items[1].href + '" class="nav-link">About</a></li>';

  // Products mega dropdown
  html += '<li class="nav-item has-mega" id="navProducts">'
        + '<a href="index.html#shop" class="nav-link">Products <span class="caret">▾</span></a>'
        + '<div class="mega-panel"><div class="mega-inner">' + buildMegaColumns() + '</div></div>'
        + '</li>';

  html += '<li class="nav-item"><a href="' + items[2].href + '" class="nav-link">Contact</a></li>';
  html += '<li class="nav-item"><a href="' + items[3].href + '" class="nav-link">FAQ</a></li>';

  menu.innerHTML = html;

  // Toggle mega on click (mobile) — desktop uses hover via CSS
  var trigger = document.querySelector('#navProducts > .nav-link');
  if (trigger) {
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        document.getElementById('navProducts').classList.toggle('open');
      }
    });
  }

  // Close mobile menu when any real link is clicked
  menu.querySelectorAll('a[href]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (a.closest('.has-mega') && a.getAttribute('href') === 'index.html#shop') return;
      closeMobileMenu();
    });
  });
}

function buildMegaColumns() {
  return catalog().map(function (cat) {
    var links;
    if (hasRealSubcats(cat)) {
      links = cat.subcategories.map(function (sub) {
        return '<a href="index.html#shop=' + cat.id + '/' + sub.id + '">' + sub.name + '</a>';
      }).join('');
    } else {
      links = cat.subcategories[0].products.map(function (p) {
        return '<a href="index.html#shop=' + cat.id + '//' + p.id + '">' + p.name + '</a>';
      }).join('');
    }
    return '<div class="mega-col">'
      + '<a class="mega-head" href="index.html#shop=' + cat.id + '">' + cat.name + '</a>'
      + '<div class="mega-links">' + links + '</div>'
      + '</div>';
  }).join('');
}

function initNavbarScroll() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─────────────────────────── Shop ─────────────────────────── */
var shopState = { root: null, locked: null, catId: null, subId: null };

function initShop(root) {
  shopState.root = root;
  shopState.locked = root.getAttribute('data-category') || null;
  syncShopFromHash(true);
}

// Parse "#shop=cat/sub/prod" (sub or prod may be empty)
function parseShopHash() {
  var h = window.location.hash || '';
  var m = h.match(/^#shop(?:=([^]*))?$/);
  if (!m) return null;
  var parts = (m[1] || '').split('/');
  return { cat: parts[0] || '', sub: parts[1] || '', prod: parts[2] || '' };
}

function syncShopFromHash(initial) {
  var root = shopState.root;
  if (!root) return;

  var parsed = parseShopHash();
  var catId = shopState.locked || (parsed && parsed.cat) || (catalog()[0] && catalog()[0].id);
  var cat = findCategory(catId) || catalog()[0];
  if (!cat) { root.innerHTML = '<p class="shop-empty">Catalog unavailable.</p>'; return; }

  var subId = (parsed && parsed.sub) || cat.subcategories[0].id;
  var sub = findSubcategory(cat, subId);

  shopState.catId = cat.id;
  shopState.subId = sub.id;
  renderShop();

  if (parsed && parsed.prod) {
    var p = findProduct(sub, parsed.prod);
    if (p) openLightbox(p, 0);
  }
  if (!initial && parsed) {
    var section = document.getElementById('shop');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setShopCategory(catId) {
  var cat = findCategory(catId);
  if (!cat) return;
  shopState.catId = catId;
  shopState.subId = cat.subcategories[0].id;
  updateHash();
  renderShop();
  var section = document.getElementById('shop');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setShopSubcategory(subId) {
  shopState.subId = subId;
  updateHash();
  renderShop();
}

function updateHash() {
  if (shopState.locked) return; // locked category pages keep their own URL
  var h = 'shop=' + shopState.catId + '/' + shopState.subId;
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', '#' + h);
  }
}

function renderShop() {
  var root = shopState.root;
  var cat = findCategory(shopState.catId);
  if (!root || !cat) return;
  var sub = findSubcategory(cat, shopState.subId);

  var showCats = !shopState.locked && catalog().length > 1;
  var showSubs = hasRealSubcats(cat);

  var html = '<div class="shop-head">'
    + '<span class="section-badge">Catalogue</span>'
    + '<h2 class="shop-title">' + cat.name + '</h2>'
    + '<p class="shop-subtitle">Browse the collection, then click any product to open a full-screen gallery with zoom.</p>'
    + '</div>';

  html += '<div class="shop-toolbar">';
  if (showCats) {
    html += '<div class="shop-cats" role="tablist">' + catalog().map(function (c) {
      return '<button class="shop-pill' + (c.id === cat.id ? ' active' : '') + '" onclick="setShopCategory(\'' + c.id + '\')">' + c.name + '</button>';
    }).join('') + '</div>';
  }
  if (showSubs) {
    html += buildDropdown(cat, sub);
  }
  html += '</div>';

  html += '<div class="shop-grid">' + sub.products.map(function (p, i) {
    return productCard(cat.id, sub.id, p, i);
  }).join('') + '</div>';

  root.innerHTML = html;

  if (showSubs) wireDropdown();
}

function buildDropdown(cat, sub) {
  var options = cat.subcategories.map(function (s) {
    return '<li role="option" data-val="' + s.id + '"' + (s.id === sub.id ? ' aria-selected="true"' : '') + '>'
      + s.name + '<span class="opt-count">' + s.products.length + '</span></li>';
  }).join('');
  return '<div class="nw-dropdown" id="subDropdown">'
    + '<span class="nw-dropdown-label">Subcategory</span>'
    + '<button type="button" class="nw-dropdown-btn" aria-haspopup="listbox" aria-expanded="false">'
    + '<span class="nw-dropdown-value">' + sub.name + '</span><span class="nw-dropdown-caret">▾</span></button>'
    + '<ul class="nw-dropdown-menu" role="listbox">' + options + '</ul>'
    + '</div>';
}

function wireDropdown() {
  var dd = document.getElementById('subDropdown');
  if (!dd) return;
  var btn = dd.querySelector('.nw-dropdown-btn');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = dd.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  dd.querySelectorAll('li[data-val]').forEach(function (li) {
    li.addEventListener('click', function () {
      setShopSubcategory(li.getAttribute('data-val'));
    });
  });
  document.addEventListener('click', function () { dd.classList.remove('open'); });
}

function productCard(catId, subId, p, i) {
  var count = p.images.length;
  var countBadge = count > 1 ? '<span class="card-count">' + count + ' photos</span>' : '';
  return '<article class="shop-card" style="--i:' + i + '" onclick="openProduct(\'' + catId + '\',\'' + subId + '\',\'' + p.id + '\')">'
    + '<div class="shop-card-media">'
    + '<img src="' + encodeURI(p.image) + '" alt="' + escapeAttr(p.name) + '" loading="lazy" />'
    + '<span class="shop-card-zoom" aria-hidden="true">⤢</span>'
    + countBadge
    + '</div>'
    + '<div class="shop-card-body"><h3>' + p.name + '</h3><span class="shop-card-cta">View gallery</span></div>'
    + '</article>';
}

function openProduct(catId, subId, prodId) {
  var cat = findCategory(catId);
  var sub = findSubcategory(cat, subId);
  var p = findProduct(sub, prodId);
  if (p) openLightbox(p, 0);
}

/* ───────────────────── Lightbox + zoom ────────────────────── */
var lb = { el: null, product: null, index: 0, zoom: 1 };

function buildLightbox() {
  if (document.getElementById('lightbox')) return;
  var el = document.createElement('div');
  el.id = 'lightbox';
  el.className = 'lightbox';
  el.innerHTML =
    '<div class="lightbox-backdrop"></div>'
    + '<div class="lightbox-frame" role="dialog" aria-modal="true">'
    + '<button class="lightbox-close" aria-label="Close">&times;</button>'
    + '<div class="lightbox-main">'
    + '<button class="lightbox-arrow prev" aria-label="Previous">‹</button>'
    + '<div class="lightbox-stage" id="lbStage"><img class="lightbox-img" id="lbImg" alt="" /></div>'
    + '<button class="lightbox-arrow next" aria-label="Next">›</button>'
    + '</div>'
    + '<div class="lightbox-bar">'
    + '<div class="lightbox-meta"><h3 id="lbTitle"></h3><span id="lbCounter" class="lightbox-counter"></span></div>'
    + '<div class="lightbox-zoom">'
    + '<button data-z="out" aria-label="Zoom out">−</button>'
    + '<span id="lbZoomLevel">100%</span>'
    + '<button data-z="in" aria-label="Zoom in">+</button>'
    + '<button data-z="reset" aria-label="Reset zoom">Reset</button>'
    + '</div>'
    + '</div>'
    + '<div class="lightbox-thumbs" id="lbThumbs"></div>'
    + '<p class="lightbox-hint">Scroll or click the image to zoom · move the mouse to pan</p>'
    + '</div>';
  document.body.appendChild(el);

  el.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  el.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
  el.querySelector('.lightbox-arrow.prev').addEventListener('click', function () { stepLightbox(-1); });
  el.querySelector('.lightbox-arrow.next').addEventListener('click', function () { stepLightbox(1); });

  el.querySelectorAll('.lightbox-zoom button').forEach(function (b) {
    b.addEventListener('click', function () {
      var z = b.getAttribute('data-z');
      if (z === 'in') setZoom(lb.zoom + 0.3);
      else if (z === 'out') setZoom(lb.zoom - 0.3);
      else setZoom(1);
    });
  });

  var stage = el.querySelector('#lbStage');
  stage.addEventListener('click', function () { setZoom(lb.zoom > 1 ? 1 : 2.2); });
  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    setZoom(lb.zoom + (e.deltaY < 0 ? 0.25 : -0.25));
  }, { passive: false });
  stage.addEventListener('mousemove', function (e) {
    if (lb.zoom <= 1) return;
    var r = stage.getBoundingClientRect();
    var x = ((e.clientX - r.left) / r.width) * 100;
    var y = ((e.clientY - r.top) / r.height) * 100;
    var img = document.getElementById('lbImg');
    img.style.transformOrigin = x + '% ' + y + '%';
  });

  document.addEventListener('keydown', function (e) {
    if (!el.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') stepLightbox(-1);
    else if (e.key === 'ArrowRight') stepLightbox(1);
  });

  lb.el = el;
}

function openLightbox(product, index) {
  if (!lb.el) buildLightbox();
  lb.product = product;
  lb.index = index || 0;
  document.getElementById('lbTitle').textContent = product.name;

  var thumbs = document.getElementById('lbThumbs');
  thumbs.innerHTML = product.images.map(function (src, i) {
    return '<button class="lb-thumb" data-i="' + i + '"><img src="' + encodeURI(src) + '" alt="" loading="lazy" /></button>';
  }).join('');
  thumbs.querySelectorAll('.lb-thumb').forEach(function (b) {
    b.addEventListener('click', function () { showLightboxImage(parseInt(b.getAttribute('data-i'), 10)); });
  });

  var arrows = product.images.length > 1;
  lb.el.querySelector('.lightbox-arrow.prev').style.display = arrows ? '' : 'none';
  lb.el.querySelector('.lightbox-arrow.next').style.display = arrows ? '' : 'none';

  showLightboxImage(lb.index);
  lb.el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLightboxImage(i) {
  var imgs = lb.product.images;
  lb.index = (i + imgs.length) % imgs.length;
  var img = document.getElementById('lbImg');
  img.src = encodeURI(imgs[lb.index]);
  img.alt = lb.product.name + ' image ' + (lb.index + 1);
  setZoom(1);
  document.getElementById('lbCounter').textContent = (lb.index + 1) + ' / ' + imgs.length;
  lb.el.querySelectorAll('.lb-thumb').forEach(function (b, idx) {
    b.classList.toggle('active', idx === lb.index);
  });
}

function stepLightbox(dir) { showLightboxImage(lb.index + dir); }

function setZoom(z) {
  lb.zoom = Math.min(4, Math.max(1, Math.round(z * 100) / 100));
  var img = document.getElementById('lbImg');
  if (img) {
    img.style.transform = 'scale(' + lb.zoom + ')';
    img.classList.toggle('zoomed', lb.zoom > 1);
    if (lb.zoom === 1) img.style.transformOrigin = 'center center';
  }
  var lvl = document.getElementById('lbZoomLevel');
  if (lvl) lvl.textContent = Math.round(lb.zoom * 100) + '%';
}

function closeLightbox() {
  if (!lb.el) return;
  lb.el.classList.remove('open');
  document.body.style.overflow = '';
}

/* ───────────────────── Quote modal + FAQ ──────────────────── */
function openQuery() {
  var modal = document.getElementById('queryModal');
  if (modal) { modal.style.display = 'block'; document.body.style.overflow = 'hidden'; }
}
function closeQuery() {
  var modal = document.getElementById('queryModal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

function handleQuoteForm() {
  var form = document.getElementById('quoteForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(form));
    var message = 'Hello Norwell,\n\nI would like a quote.\n\n'
      + 'Name: ' + (data.fullName || '') + '\n'
      + 'Email: ' + (data.email || '') + '\n'
      + 'Phone: ' + (data.phone || '') + '\n'
      + 'Company: ' + (data.company || 'N/A') + '\n'
      + 'Product Interest: ' + (data.productInterest || 'N/A') + '\n'
      + 'Quantity: ' + (data.quantity || 'Not specified') + '\n'
      + 'Message: ' + (data.message || 'No additional message');
    window.open('https://wa.me/919999809260?text=' + encodeURIComponent(message), '_blank');
    closeQuery();
  });
}

function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('click', function () { item.classList.toggle('active'); });
  });
}

/* ───────────────────── Mobile menu ────────────────────────── */
function toggleMobileMenu() {
  var menu = document.querySelector('.nav-menu');
  var backdrop = document.querySelector('.mobile-menu-backdrop');
  if (menu) menu.classList.toggle('active');
  if (backdrop) backdrop.classList.toggle('active');
  document.body.style.overflow = (menu && menu.classList.contains('active')) ? 'hidden' : '';
}
function closeMobileMenu() {
  var menu = document.querySelector('.nav-menu');
  var backdrop = document.querySelector('.mobile-menu-backdrop');
  if (menu) menu.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

/* ───────────────────── Misc close handlers ────────────────── */
window.addEventListener('click', function (e) {
  var modal = document.getElementById('queryModal');
  if (e.target === modal) closeQuery();
});

/* ───────────────────────── utils ──────────────────────────── */
function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
