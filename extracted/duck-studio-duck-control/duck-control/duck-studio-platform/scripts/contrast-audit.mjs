const hexToRgb = (hex) => {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255);
};

const blend = (foreground, background, alpha) => foreground.map((value, index) => value * alpha + background[index] * (1 - alpha));

const luminance = (rgb) => rgb.reduce((total, value, index) => {
  const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  return total + linear * [0.2126, 0.7152, 0.0722][index];
}, 0);

const contrast = (a, b) => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
};

const background = hexToRgb("#03130f");
const checks = [
  ["Texto principal", hexToRgb("#f4fff8"), 1],
  ["Texto de destaque", hexToRgb("#7effc2"), 1],
  ["Texto secundário", hexToRgb("#dcffed"), 0.6],
];

let failed = false;
for (const [label, color, alpha] of checks) {
  const ratio = contrast(alpha === 1 ? color : blend(color, background, alpha), background);
  const passed = ratio >= 4.5;
  failed ||= !passed;
  console.log(`${label}: ${ratio.toFixed(2)}:1 ${passed ? "PASSOU" : "FALHOU"}`);
}
if (failed) process.exitCode = 1;
