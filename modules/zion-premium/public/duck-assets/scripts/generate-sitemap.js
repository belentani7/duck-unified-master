/**
 * DUCK PROD - Sitemap Generator
 * Gera sitemap.xml automaticamente
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://duckmusic.com.br';
const OUTPUT = path.join(__dirname, '..', 'sitemap.xml');
const TODAY = new Date().toISOString().split('T')[0];

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/#sobre', priority: '0.8', changefreq: 'monthly' },
  { path: '/#portfolio', priority: '0.9', changefreq: 'weekly' },
  { path: '/#estudio', priority: '0.7', changefreq: 'monthly' },
  { path: '/#instrumentos', priority: '0.6', changefreq: 'monthly' },
  { path: '/#contato', priority: '0.8', changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

fs.writeFileSync(OUTPUT, sitemap);
console.log(`✅ sitemap.xml gerado com ${pages.length} URLs`);
console.log(`📄 ${OUTPUT}`);
