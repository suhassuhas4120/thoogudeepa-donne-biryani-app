const fs = require('fs');
const code = fs.readFileSync('scratch-page-bundle.js', 'utf8');

// List of component variable names:
// m (Screen 1), D (Screen 2), P (Screen 3), S (Screen 4), G (Screen 5), 
// q (Screen 6), K (Screen 7), Z (Screen 8), er (Screen 9), ed (Screen 10)
const components = ['m', 'D', 'P', 'S', 'G', 'q', 'K', 'Z', 'er', 'ed'];

components.forEach((name, i) => {
  const marker = `let ${name}=`;
  const idx = code.indexOf(marker);
  if (idx !== -1) {
    const nextIdx = i < components.length - 1 ? code.indexOf(`let ${components[i+1]}=`) : idx + 3000;
    const len = Math.min(nextIdx - idx, 2500);
    console.log(`\n=================== SCREEN ${i+1} (${name}) ===================`);
    console.log(code.substring(idx, idx + Math.min(len, 600)));
  } else {
    console.log(`Could not find ${marker}`);
  }
});
