/**
 * DUCK PROD - Image Optimizer Script
 * Converte imagens para WebP e redimensiona
 *
 * Requer: npm install sharp
 * Uso: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const OUTPUT_DIR = path.join(__dirname, '..', 'images', 'optimized');

const SIZES = {
  hero: { width: 1920, height: 1080 },
  cover: { width: 400, height: 400 },
  studio: { width: 1440, height: 960 },
  thumbnail: { width: 256, height: 256 },
};

const QUALITY = 80;

async function optimizeImages() {
  console.log('🖼️  DUCK PROD - Image Optimizer\n');

  // Verificar se sharp está instalado
  try {
    require('sharp');
  } catch {
    console.log('❌ Sharp não encontrado. Instale com: npm install sharp');
    process.exit(1);
  }

  const sharp = require('sharp');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(IMAGES_DIR).filter((f) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
  );

  console.log(`📁 ${files.length} imagens encontradas\n`);

  for (const file of files) {
    const inputPath = path.join(IMAGES_DIR, file);
    const name = path.parse(file).name;

    // Converter para WebP
    const webpPath = path.join(OUTPUT_DIR, `${name}.webp`);
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const stats = fs.statSync(webpPath);
    console.log(`  ✓ ${name}.webp (${(stats.size / 1024).toFixed(1)}KB)`);

    // Criar versão otimizada para cover
    if (file.includes('cover') || file.includes('track')) {
      const coverPath = path.join(OUTPUT_DIR, `${name}-400.webp`);
      await sharp(inputPath)
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: QUALITY })
        .toFile(coverPath);
      console.log(`    → ${name}-400.webp (cover)`);
    }
  }

  console.log(`\n✅ Imagens otimizadas em ${OUTPUT_DIR}`);
}

optimizeImages().catch(console.error);
