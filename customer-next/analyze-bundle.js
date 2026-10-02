const fs = require('fs');
const code = fs.readFileSync('scratch-page-bundle.js', 'utf8');

const regex = /screenNumber:\s*(\d+),\s*screenTitle:\s*("[^"]+")/g;
let match;
while ((match = regex.exec(code)) !== null) {
  console.log(`Screen ${match[1]}: ${match[2]}`);
}
