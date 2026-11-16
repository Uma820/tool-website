const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ZIP_OUTPUT = path.join(ROOT_DIR, 'free-online-tools-v1.0.0-production.zip');
const ZIP_ALIAS = path.join(ROOT_DIR, 'free-online-tools.zip');
const STAGING_DIR = path.join(ROOT_DIR, 'scratch', 'package-staging');

console.log('📦 Building Production Package...');

// 1. Prepare Staging Directory
if (fs.existsSync(STAGING_DIR)) {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
}
fs.mkdirSync(STAGING_DIR, { recursive: true });

// 2. Files and Folders to Copy
const includeFiles = [
  'index.html',
  '404.html',
  '.htaccess',
  'robots.txt',
  'sitemap.xml',
  'README.md',
  'HOSTINGER_DEPLOYMENT_GUIDE.md'
];

const includeDirs = [
  'assets',
  'tools',
  'pages',
  'bn',
  'hi',
  'es',
  'fr',
  'ar',
  'docs',
  'scripts'
];

// Copy files
includeFiles.forEach(f => {
  const src = path.join(ROOT_DIR, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(STAGING_DIR, f));
  }
});

// Copy directories recursively
includeDirs.forEach(d => {
  const srcDir = path.join(ROOT_DIR, d);
  const destDir = path.join(STAGING_DIR, d);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
  }
});

// Remove any unwanted files from staging (e.g. scratch or test files inside scripts)
const testExtracted = path.join(STAGING_DIR, 'scratch');
if (fs.existsSync(testExtracted)) {
  fs.rmSync(testExtracted, { recursive: true, force: true });
}

// 3. Compress Staging into ZIP using PowerShell
if (fs.existsSync(ZIP_OUTPUT)) fs.unlinkSync(ZIP_OUTPUT);
if (fs.existsSync(ZIP_ALIAS)) fs.unlinkSync(ZIP_ALIAS);

console.log('Compressing files into archive...');
execSync(`powershell -Command "Compress-Archive -Path '${STAGING_DIR}\\*' -DestinationPath '${ZIP_OUTPUT}' -Force -CompressionLevel Optimal"`);

// Copy to alias
fs.copyFileSync(ZIP_OUTPUT, ZIP_ALIAS);

// Clean up staging
fs.rmSync(STAGING_DIR, { recursive: true, force: true });

const stat = fs.statSync(ZIP_OUTPUT);
console.log(`✅ Production packages successfully created:`);
console.log(`   - ${ZIP_OUTPUT} (${(stat.size / 1024).toFixed(1)} KB)`);
console.log(`   - ${ZIP_ALIAS} (${(stat.size / 1024).toFixed(1)} KB)`);
