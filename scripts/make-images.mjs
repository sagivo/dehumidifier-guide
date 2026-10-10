// Generates social/brand PNGs in public/ from inline SVG. Run: node scripts/make-images.mjs
import sharp from "sharp";

const mark = (s = 1) => `
  <g transform="scale(${s})">
    <rect width="32" height="32" rx="8" fill="url(#g)"/>
    <rect x="4" y="14" width="18" height="9" rx="4.5" fill="#fff"/>
    <circle cx="10" cy="25" r="3.4" fill="#fff"/><circle cx="20" cy="25" r="3.4" fill="#fff"/>
    <path d="M22 12l4-4" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="27" cy="6.5" r="1.8" fill="#b8e62e"/>
  </g>`;
const defs = `<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f9e44"/><stop offset="1" stop-color="#14331b"/></linearGradient>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e2413"/><stop offset=".6" stop-color="#14331b"/><stop offset="1" stop-color="#1d4a26"/></linearGradient>
</defs>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${defs}
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="-40" r="420" fill="#2c7a3f" opacity=".35"/>
  <path d="M0,540 C240,500 480,580 720,540 C960,500 1100,560 1200,530 L1200,630 L0,630 Z" fill="#2f9e44" opacity=".55"/>
  <path d="M0,580 C260,555 520,605 780,580 C1040,555 1140,600 1200,585 L1200,630 L0,630 Z" fill="#40b955" opacity=".6"/>
  <g transform="translate(80,80)">${mark(2.2)}</g>
  <text x="170" y="134" font-family="Helvetica, Arial, sans-serif" font-size="36" font-weight="800" fill="#fff">Robot Lawn Mower Guide</text>
  <text x="80" y="290" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="800" fill="#fff">Wire-free robot</text>
  <text x="80" y="375" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="800" fill="#b8e62e">lawn mower guides</text>
  <text x="80" y="450" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#cfe3d2">Reviews · Comparisons · Sizing &amp; cost calculators</text>
  <g transform="translate(860,250)">
    <rect x="0" y="40" width="240" height="100" rx="50" fill="#2f9e44"/>
    <rect x="0" y="40" width="240" height="40" rx="20" fill="#40b955"/>
    <circle cx="120" cy="60" r="14" fill="#0e2413"/><circle cx="120" cy="60" r="6" fill="#b8e62e"/>
    <circle cx="55" cy="150" r="40" fill="#0b1a0f"/><circle cx="55" cy="150" r="16" fill="#5c6f60"/>
    <circle cx="185" cy="150" r="40" fill="#0b1a0f"/><circle cx="185" cy="150" r="16" fill="#5c6f60"/>
    <g stroke="#b8e62e" stroke-width="7" fill="none" stroke-linecap="round"><path d="M200 0a60 60 0 0 1 40 -20"/><path d="M215 25a90 90 0 0 1 60 -30" opacity=".6"/></g>
  </g>
</svg>`;

const square = (size, pad) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">${defs}
  ${pad ? `<rect width="32" height="32" fill="#14331b"/>` : ""}${mark(1)}</svg>`;

await sharp(Buffer.from(og)).png().toFile("public/og-default.png");
await sharp(Buffer.from(square(512, false))).resize(512, 512).png().toFile("public/logo.png");
await sharp(Buffer.from(square(180, true))).resize(180, 180).png().toFile("public/apple-touch-icon.png");
console.log("wrote public/og-default.png, logo.png, apple-touch-icon.png");
