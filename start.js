#!/usr/bin/env node

// Startup script to handle different working directories
const path = require('path');
const fs = require('fs');

// Try to find dist/main.js
const possiblePaths = [
  path.join(__dirname, 'dist', 'main.js'),
  path.join(__dirname, '..', 'dist', 'main.js'),
  path.join(process.cwd(), 'dist', 'main.js'),
  path.join(process.cwd(), '..', 'dist', 'main.js'),
];

let mainPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    mainPath = p;
    break;
  }
}

if (!mainPath) {
  console.error('Error: Could not find dist/main.js');
  console.error('Searched paths:', possiblePaths);
  console.error('Current directory:', process.cwd());
  console.error('__dirname:', __dirname);
  process.exit(1);
}

console.log(`Starting from: ${mainPath}`);
require(mainPath);
