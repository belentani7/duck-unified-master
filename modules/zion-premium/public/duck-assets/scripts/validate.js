/**
 * DUCK PROD - HTML Validator
 * Valida estrutura HTML básica
 */

const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, '..', 'index.html');

function validate() {
  console.log('🔍 DUCK PROD - HTML Validator\n');

  const html = fs.readFileSync(HTML_FILE, 'utf8');
  const issues = [];

  // Verificar meta tags essenciais
  const checks = [
    { name: 'DOCTYPE', test: html.includes('<!DOCTYPE html>'), critical: true },
    { name: 'lang attribute', test: html.includes('lang="pt-BR"'), critical: true },
    { name: 'charset', test: html.includes('charset="UTF-8"'), critical: true },
    { name: 'viewport', test: html.includes('viewport'), critical: true },
    { name: 'title', test: html.includes('<title>'), critical: true },
    { name: 'meta description', test: html.includes('meta name="description"'), critical: true },
    { name: 'Open Graph', test: html.includes('og:title'), critical: false },
    { name: 'favicon', test: html.includes('rel="icon"'), critical: false },
    { name: 'Skip navigation', test: html.includes('skip-link') || html.includes('Skip to'), critical: false },
    { name: 'ARIA labels', test: html.includes('aria-label'), critical: false },
    { name: 'Semantic HTML', test: html.includes('<main') || html.includes('<section'), critical: false },
    { name: 'Preconnect fonts', test: html.includes('preconnect'), critical: false },
  ];

  let passed = 0;
  let failed = 0;

  checks.forEach((check) => {
    const status = check.test ? '✅' : (check.critical ? '❌' : '⚠️');
    console.log(`  ${status} ${check.name}`);
    if (check.test) passed++;
    else {
      failed++;
      if (check.critical) issues.push(check.name);
    }
  });

  console.log(`\n📊 Resultado: ${passed}/${checks.length} verificações passaram`);

  if (issues.length > 0) {
    console.log(`\n🚨 Problemas críticos: ${issues.join(', ')}`);
    process.exit(1);
  }

  console.log('\n✅ Validação completa!');
}

validate();
