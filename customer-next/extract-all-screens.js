const fs = require('fs');
const code = fs.readFileSync('scratch-page-bundle.js', 'utf8');

// Function to extract between markers
function extractSection(startMarker, endMarker) {
  const start = code.indexOf(startMarker);
  if (start === -1) return null;
  const end = endMarker ? code.indexOf(endMarker, start) : start + 3000;
  return code.substring(start, end);
}

// Let's print Screen 2 (Menu)
console.log('--- SCREEN 2 MENU ---');
const s2 = extractSection('let D=()=>', 'let P=()=>');
fs.writeFileSync('scratch-screen2.js', s2 || '');
console.log('Saved scratch-screen2.js, length:', s2 ? s2.length : 0);

// Screen 3 (Item Detail)
const s3 = extractSection('let P=()=>', 'let S=()=>');
fs.writeFileSync('scratch-screen3.js', s3 || '');
console.log('Saved scratch-screen3.js, length:', s3 ? s3.length : 0);

// Screen 4 (Cart)
const s4 = extractSection('let S=()=>', 'let G=()=>');
fs.writeFileSync('scratch-screen4.js', s4 || '');
console.log('Saved scratch-screen4.js, length:', s4 ? s4.length : 0);

// Screen 5 (Tracking)
const s5 = extractSection('let G=()=>', 'let q=()=>');
fs.writeFileSync('scratch-screen5.js', s5 || '');
console.log('Saved scratch-screen5.js, length:', s5 ? s5.length : 0);

// Screen 6 (Summary)
const s6 = extractSection('let q=()=>', 'let K=()=>');
fs.writeFileSync('scratch-screen6.js', s6 || '');
console.log('Saved scratch-screen6.js, length:', s6 ? s6.length : 0);

// Screen 7 (Payment)
const s7 = extractSection('let K=()=>', 'let Z=()=>');
fs.writeFileSync('scratch-screen7.js', s7 || '');
console.log('Saved scratch-screen7.js, length:', s7 ? s7.length : 0);

// Screen 8 (Confirmation)
const s8 = extractSection('let Z=()=>', 'let er=()=>');
fs.writeFileSync('scratch-screen8.js', s8 || '');
console.log('Saved scratch-screen8.js, length:', s8 ? s8.length : 0);

// Screen 9 (Bill)
const s9 = extractSection('let er=()=>', 'let ed=()=>');
fs.writeFileSync('scratch-screen9.js', s9 || '');
console.log('Saved scratch-screen9.js, length:', s9 ? s9.length : 0);

// Screen 10 (Call Waiter)
const s10 = extractSection('let ed=()=>', 'function ex()');
fs.writeFileSync('scratch-screen10.js', s10 || '');
console.log('Saved scratch-screen10.js, length:', s10 ? s10.length : 0);
