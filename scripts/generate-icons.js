import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Create a simple PWA icon with gradient background
async function generateIcon(size, filename) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">PWA</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(publicDir, filename));

  console.log(`Generated ${filename}`);
}

// Generate mask icon (monochrome SVG)
async function generateMaskIcon() {
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="76.8" fill="black"/>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="204.8" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">PWA</text>
    </svg>
  `;

  const { writeFileSync } = await import('fs');
  writeFileSync(join(publicDir, 'mask-icon.svg'), svg.trim());
  console.log('Generated mask-icon.svg');
}

async function main() {
  await generateIcon(192, 'pwa-192x192.png');
  await generateIcon(512, 'pwa-512x512.png');
  await generateIcon(180, 'apple-touch-icon.png');
  await generateMaskIcon();
  console.log('All icons generated successfully!');
}

main().catch(console.error);
