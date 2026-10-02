const fs = require('fs');
const code = fs.readFileSync('scratch-page-bundle.js', 'utf8');

// Find StickyBottomBar
const fIdx = code.indexOf('StickyBottomBar');
console.log('StickyBottomBar search:', fIdx);
if (fIdx === -1) {
  // Look for fixed bottom or sticky bottom
  const bIdx = code.indexOf('sticky bottom-0');
  console.log('sticky bottom-0:\n', code.substring(bIdx - 100, bIdx + 600));
}
