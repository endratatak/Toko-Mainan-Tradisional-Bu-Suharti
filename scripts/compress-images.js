const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'images/products';
const outputDir = 'images/products';

const files = fs.readdirSync(inputDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

(async () => {
  for (const file of files) {
    const input = path.join(inputDir, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const output = path.join(outputDir, outputName);
    await sharp(input)
      .resize(600, 450, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(output);
    const before = fs.statSync(input).size;
    const after = fs.statSync(output).size;
    console.log(`${file} → ${outputName} | ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB`);
  }
  console.log('Selesai!');
})();
