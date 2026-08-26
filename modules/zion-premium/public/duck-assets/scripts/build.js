/**
 * DUCK PROD - Build Script
 * Minifica CSS e JS para produção
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'dist');

// Criar diretório de build
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Lista de arquivos CSS para concatenar
const cssFiles = [
  'css/tokens.css',
  'css/tokens-premium.css',
  'css/base.css',
  'css/utilities.css',
  'css/accessibility.css',
  'css/navigation.css',
  'css/hero.css',
  'css/sections.css',
  'css/instruments.css',
  'css/components.css',
  'css/buttons.css',
  'css/buttons-premium.css',
  'css/cards.css',
  'css/cards-premium.css',
  'css/forms.css',
  'css/modals.css',
  'css/animations-premium.css',
  'css/cursor.css',
  'css/responsive.css',
];

// Lista de arquivos JS para concatenar
const jsFiles = [
  'data.js',
  'js/animations.js',
  'js/hover-effects.js',
  'js/micro-interactions.js',
  'js/particles.js',
  'js/main.js',
];

function concatFiles(files, ext) {
  let content = '';
  files.forEach((file) => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      content += fs.readFileSync(filePath, 'utf8') + '\n';
      console.log(`  ✓ ${file}`);
    } else {
      console.log(`  ✗ ${file} (not found)`);
    }
  });
  return content;
}

console.log('🔨 DUCK PROD - Build\n');

// Concatenar CSS
console.log('📦 Concatenando CSS...');
const cssContent = concatFiles(cssFiles, '.css');
fs.writeFileSync(path.join(BUILD_DIR, 'styles.min.css'), cssContent);
console.log(`  → dist/styles.min.css (${(cssContent.length / 1024).toFixed(1)}KB)\n`);

// Concatenar JS
console.log('📦 Concatenando JS...');
const jsContent = concatFiles(jsFiles, '.js');
fs.writeFileSync(path.join(BUILD_DIR, 'app.min.js'), jsContent);
console.log(`  → dist/app.min.js (${(jsContent.length / 1024).toFixed(1)}KB)\n`);

// Copiar index.html
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const optimizedHtml = indexHtml
  .replace(/<!-- Modular CSS \(dependency order\)-->/g, '<link rel="stylesheet" href="dist/styles.min.css">')
  .replace(/<!-- Modular JS \(dependency order\)-->/g, '<script src="dist/app.min.js" defer></script>')
  .replace(/<link rel="stylesheet" href="css\/[^"]*">\s*/g, '')
  .replace(/<script src="[^"]*\.js" defer><\/script>\s*/g, '');

fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), optimizedHtml);
console.log('📄 dist/index.html otimizado\n');

console.log('✅ Build completo! Arquivos em /dist');
