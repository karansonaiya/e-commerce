import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "public", "images", "products");
mkdirSync(outDir, { recursive: true });

const palettes = {
  "face-wash": ["#f4d9c6", "#b5121b"],
  serum: ["#f5ead6", "#8c0e15"],
  shampoo: ["#e7cba3", "#3a322c"],
};

function svg(label, sub, [c1, c2]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1100" fill="${c1}"/>
  <rect x="60" y="60" width="780" height="980" rx="24" fill="url(#g)" opacity="0.9"/>
  <rect x="330" y="330" width="240" height="440" rx="28" fill="#fffdfa" opacity="0.92"/>
  <rect x="360" y="380" width="180" height="60" rx="8" fill="${c2}" opacity="0.85"/>
  <text x="450" y="820" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="#fffdfa" letter-spacing="2">WESTORIA</text>
  <text x="450" y="870" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#fffdfa" opacity="0.85">${label}</text>
  <text x="450" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="${c2}">${sub}</text>
</svg>`;
}

const products = {
  "face-wash": ["Glow Foam Cleanser", "Charcoal Detox Wash", "Rose Hydra Wash"],
  serum: ["Vitamin C Radiance Serum", "Hyaluronic Glow Serum", "Niacinamide Clear Serum"],
  shampoo: ["Argan Repair Shampoo", "Volume Boost Shampoo", "Anti-Dandruff Shampoo"],
};

for (const [category, names] of Object.entries(products)) {
  names.forEach((name, i) => {
    const file = `${category}-${i + 1}.svg`;
    writeFileSync(join(outDir, file), svg(name, category.toUpperCase(), palettes[category]));
  });
}

console.log("Placeholder product images generated in public/images/products");
