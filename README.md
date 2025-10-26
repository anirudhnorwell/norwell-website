# Norwell Website - Premium Steel Products

A modern, responsive website showcasing Norwell's premium steel product collection including bottles, dustbins, combo sets, and lunch boxes.

## Project Structure

```
Website/
├── index.html          # Main homepage
├── bottles.html        # Bottles category page
├── dustbin.html        # Dustbins category page
├── combo.html          # Combo sets page
├── lunchbox.html       # Lunch boxes page
├── style.css           # Main stylesheet
├── script.js           # JavaScript functionality
└── images/             # Product images
    ├── Bottles/
    │   ├── Classic/
    │   ├── Curvy/
    │   ├── Flora/
    │   └── Sports/
    ├── Combo/
    ├── Dustbin/
    │   ├── Closed Pedal/
    │   ├── Perforated/
    │   ├── Perforated With Pedal/
    │   └── Swing/
    └── LunchBox/
```

## Features

### Homepage
- Modern gradient background design
- Category cards with hover effects
- "Get Quote" modal with contact options
- Responsive grid layout
- Features section highlighting product benefits

### Category Pages
- Horizontal scrolling image galleries
- Touch-friendly mobile navigation
- Product subcategories with detailed images
- Consistent navigation between categories
- Modal contact forms

### Interactive Features
- Smooth horizontal scrolling galleries
- Modal popup for contact/quotes
- Responsive design for all devices
- Image lazy loading
- Scroll animations
- Touch/drag support for galleries

### Contact Integration
- WhatsApp direct messaging
- Email links
- Phone number integration
- Category-specific contact messages

## Technologies Used
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript
- Responsive Design
- CSS Backdrop Filters
- Intersection Observer API

## Deployment Steps

### 1. GitHub Repository Setup
1. Create a new repository on GitHub
2. Upload all files maintaining the folder structure
3. Ensure images folder structure is preserved

### 2. GitHub Pages Deployment
1. Go to repository Settings
2. Navigate to Pages section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Save the settings
6. Your site will be available at: `https://yourusername.github.io/repository-name`

### 3. Custom Domain (norwell.co.in)
1. Add a CNAME file to your repository root with content: `norwell.co.in`
2. In GitHub Pages settings, add your custom domain
3. Configure DNS settings with your domain provider:
   - Add CNAME record pointing to: `yourusername.github.io`
   - Or add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

### 4. Alternative Hosting Options

#### Netlify
1. Connect GitHub repository to Netlify
2. Auto-deployment on every push
3. Custom domain configuration available

#### Vercel
1. Import GitHub repository
2. Automatic deployments
3. Easy custom domain setup

#### Traditional Web Hosting
1. Upload files via FTP/cPanel
2. Maintain folder structure
3. Configure domain pointing

## Customization

### Contact Information
Update contact details in:
- All HTML files (WhatsApp numbers, email addresses)
- Phone numbers in footer and modal

### Styling
- Modify `style.css` for color scheme changes
- Update gradient backgrounds in CSS variables
- Adjust responsive breakpoints as needed

### Content
- Replace product images in respective folders
- Update product descriptions in HTML files
- Modify company information in headers/footers

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations
- Image lazy loading
- CSS/JS minification ready
- Optimized image galleries
- Smooth scrolling implementation
- Efficient CSS animations

## SEO Ready
- Semantic HTML structure
- Meta tags for each page
- Alt text for all images
- Proper heading hierarchy
- Mobile-friendly design

## License
All rights reserved - Norwell Steel Products 2025