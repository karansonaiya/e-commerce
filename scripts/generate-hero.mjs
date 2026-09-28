import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "public", "images");
mkdirSync(outDir, { recursive: true });

function heroSvg(title, sub, [c1, c2]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="900" viewBox="0 0 1920 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="900" fill="url(#g)"/>
  <circle cx="1550" cy="220" r="260" fill="#ffffff" opacity="0.06"/>
  <circle cx="300" cy="720" r="200" fill="#ffffff" opacity="0.06"/>
  <text x="120" y="420" font-family="Georgia, serif" font-size="96" fill="#fdf6ec" letter-spacing="1">${title}</text>
  <text x="120" y="480" font-family="Arial, sans-serif" font-size="30" fill="#fdf6ec" opacity="0.9">${sub}</text>
</svg>`;
}

const banners = [
  ["hero-1.svg", "Radiance Starts Here", "Premium face wash for glowing, healthy skin", ["#8c0e15", "#b5121b"]],
  ["hero-2.svg", "Serums That Work", "Clinically-inspired formulas for visible results", ["#3a322c", "#1a1512"]],
  ["hero-3.svg", "Hair, Reimagined", "Shampoos crafted for strength & shine", ["#b5121b", "#c8a35a"]],
];

for (const [file, title, sub, palette] of banners) {
  writeFileSync(join(outDir, file), heroSvg(title, sub, palette));
}

const categories = [
  ["category-face-wash.svg", "Face Wash", "", ["#f4d9c6", "#b5121b"]],
  ["category-serum.svg", "Serum", "", ["#f5ead6", "#8c0e15"]],
  ["category-shampoo.svg", "Shampoo", "", ["#e7cba3", "#3a322c"]],
];

function catSvg(title, [c1, c2]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900">
  <defs>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="700" height="900" fill="url(#g2)"/>
  <text x="350" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="#fffdfa">${title}</text>
</svg>`;
}

for (const [file, title, , palette] of categories) {
  writeFileSync(join(outDir, file), catSvg(title, palette));
}

console.log("Hero + category images generated in public/images");
