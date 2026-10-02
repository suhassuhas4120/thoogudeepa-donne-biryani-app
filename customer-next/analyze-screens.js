const fs = require('fs');
const code = fs.readFileSync('scratch-page-bundle.js', 'utf8');

const idx = code.indexOf('switch(e){case 1:default:return(0,a.jsx)(m,{});case 2:');
console.log('App Page Root Component:\n', code.substring(idx - 600, idx + 300));
