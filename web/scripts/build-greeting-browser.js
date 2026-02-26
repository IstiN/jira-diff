/**
 * Build script - generates greeting-browser.js from greeting.js for browser use.
 */
const fs = require('fs');
const path = require('path');

const greeting = require('../js/greeting.js');

const browserScript = `(function(){
window.getGreeting=function(){return ${JSON.stringify(greeting.getGreeting())}};
window.getPageTitle=function(){return ${JSON.stringify(greeting.getPageTitle())}};
})();
`;

const outPath = path.join(__dirname, '../js/greeting-browser.js');
fs.writeFileSync(outPath, browserScript, 'utf-8');
