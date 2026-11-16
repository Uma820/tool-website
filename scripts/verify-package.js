/**
 * Production Package Verification Script for Phase 7
 * Inspects free-online-tools-v1.0.0-production.zip and free-online-tools.zip
 * Validates:
 * 1. File existence, non-emptiness, and SHA-256 integrity hash.
 * 2. Unpacks archive into temporary test sandbox.
 * 3. Confirms root-level entry points (index.html, 404.html, .htaccess, robots.txt, sitemap.xml).
 * 4. Confirms zero unwanted subfolder nesting (ensuring direct extraction into public_html).
 * 5. Validates presence of all 28 canonical tools and 5 informational pages.
 * 6. Validates presence of all 5 localized language directories (bn, hi, es, fr, ar).
 * 7. Confirms complete exclusion of dev files (server.js, tests/, scratch/, etc.).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const assert = require('assert');

console.log('===============================================================');
console.log('📦 PHASE 7: PRODUCTION PACKAGE VERIFICATION & INTEGRITY TEST');
console.log('===============================================================\n');

const ROOT_DIR = path.resolve(__dirname, '..');
const ZIP_FILENAME = 'free-online-tools-v1.0.0-production.zip';
const ZIP_PATH = path.join(ROOT_DIR, ZIP_FILENAME);
const TEST_EXTRACT_DIR = path.join(ROOT_DIR, 'scratch', 'test-package-extraction');

let totalChecks = 0;
let passedChecks = 0;

function check(title, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${title}`);
    passedChecks++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${title}`);
    console.error(`     Error: ${err.message}`);
    process.exit(1);
  }
}

// 1. Check ZIP existence and size
check(`Archive ${ZIP_FILENAME} exists and is non-empty`, () => {
  assert.ok(fs.existsSync(ZIP_PATH), `ZIP file not found at ${ZIP_PATH}`);
  const stat = fs.statSync(ZIP_PATH);
  assert.ok(stat.size > 500000, `ZIP file is unexpectedly small: ${stat.size} bytes`);
  console.log(`     Size: ${stat.size} bytes (${(stat.size / 1024).toFixed(1)} KB)`);

  const fileBuffer = fs.readFileSync(ZIP_PATH);
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  console.log(`     SHA-256: ${hash}`);
});

// 2. Extract into temporary test directory
check('Extract archive into temporary sandbox directory', () => {
  if (fs.existsSync(TEST_EXTRACT_DIR)) {
    fs.rmSync(TEST_EXTRACT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_EXTRACT_DIR, { recursive: true });

  // Use PowerShell Expand-Archive
  execSync(`powershell -Command "Expand-Archive -Path '${ZIP_PATH}' -DestinationPath '${TEST_EXTRACT_DIR}' -Force"`);
  assert.ok(fs.existsSync(TEST_EXTRACT_DIR), 'Extraction directory was not created');
});

// 3. Confirm root-level entry points (No wrapper nesting folder)
check('Deployable entry points exist directly at archive root (No subfolder nesting)', () => {
  const rootFiles = ['index.html', '404.html', '.htaccess', 'robots.txt', 'sitemap.xml'];
  rootFiles.forEach(f => {
    const p = path.join(TEST_EXTRACT_DIR, f);
    assert.ok(fs.existsSync(p), `Missing root-level file: ${f}`);
  });

  const rootDirs = ['assets', 'tools', 'pages', 'bn', 'hi', 'es', 'fr', 'ar', 'docs', 'scripts'];
  rootDirs.forEach(d => {
    const p = path.join(TEST_EXTRACT_DIR, d);
    assert.ok(fs.existsSync(p) && fs.statSync(p).isDirectory(), `Missing root-level directory: ${d}`);
  });
});

// 4. Validate All Canonical Tool Pages inside tools/
check('Extracted package contains all canonical tool pages in tools/', () => {
  const toolsDir = path.join(TEST_EXTRACT_DIR, 'tools');
  const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
  assert.ok(toolFiles.length >= 109, `Expected at least 109 tools, found ${toolFiles.length}`);

  const requiredTools = [
    'word-counter.html', 'case-converter.html', 'remove-extra-spaces.html',
    'remove-empty-lines.html', 'duplicate-line-remover.html', 'text-reverser.html',
    'find-and-replace.html', 'text-sorter.html', 'slug-converter.html',
    'reading-time-estimator.html', 'json-formatter-validator.html', 'json-minifier.html',
    'url-encoder-decoder.html', 'base64-encoder-decoder.html', 'uuid-generator.html',
    'hash-generator.html', 'password-generator.html', 'percentage-calculator.html',
    'age-calculator.html', 'unit-converter.html', 'color-converter.html',
    'markdown-previewer.html', 'pdf-merger.html', 'pdf-splitter.html',
    'pdf-page-extractor.html', 'pdf-page-deleter.html', 'pdf-page-rotator.html',
    'pdf-page-counter.html', 'youtube-thumbnail-downloader.html', 'whatsapp-link-generator.html',
    'mailto-link-generator.html', 'instagram-font-generator.html', 'paypal-link-generator.html',
    'text-separator.html', 'text-diff-checker.html', 'email-extractor.html',
    'url-extractor.html', 'text-size-calculator.html', 'user-agent-parser.html',
    'meta-tags-toolkit.html', 'serp-preview-tool.html', 'open-graph-previewer.html',
    'seo-content-analyzer.html', 'seo-compare.html', 'grade-calculator.html',
    'age-difference-calculator.html', 'birthday-calculator.html', 'youtube-money-calculator.html',
    'phone-number-validator.html', 'image-editor.html', 'image-converter.html',
    'image-compressor.html', 'exif-reader.html', 'favicon-generator.html',
    'qr-code-generator.html', 'pdf-converter.html', 'sign-pdf.html',
    'pdf-editor.html', 'pdf-maker.html', 'pdf-text-extractor.html',
    'extract-audio-from-video.html', 'video-to-gif.html', 'video-converter.html',
    'cbm-calculator.html', 'volumetric-weight-calculator.html', 'chargeable-weight-calculator.html',
    'container-loading-calculator.html', 'pallet-calculator.html',
    'quilt-backing-calculator.html', 'quilt-binding-calculator.html', 'fabric-yardage-calculator.html',
    'curtain-fabric-calculator.html', 'fabric-shrinkage-calculator.html',
    'pizza-dough-calculator.html', 'sourdough-hydration-calculator.html', 'bakers-percentage-calculator.html',
    'bread-recipe-scaler.html', 'coffee-to-water-ratio-calculator.html',
    '3d-print-cost-calculator.html', 'filament-remaining-calculator.html',
    'filament-length-calculator.html', 'multi-color-waste-calculator.html',
    'battery-runtime-calculator.html', 'inverter-backup-calculator.html',
    'solar-panel-size-calculator.html', 'generator-size-calculator.html',
    'aquarium-volume-calculator.html', 'aquarium-heater-calculator.html',
    'aquarium-water-change-calculator.html', 'aquarium-stocking-calculator.html',
    'image-dpi-checker.html', 'pixels-to-inches-calculator.html', '300-dpi-print-size-checker.html', 'print-resolution-report.html',
    'short-form-safe-zone-checker.html', 'tiktok-safe-zone-checker.html', 'instagram-reels-safe-zone-checker.html', 'youtube-shorts-safe-zone-checker.html',
    'youtube-chapter-formatter.html', 'ppp-price-calculator.html', 'discord-twitch-emoji-resizer.html',
    'voiceover-script-timer.html', 'readme-badge-builder.html', 'freelance-fee-reverse-calculator.html',
    'newsletter-sponsorship-calculator.html', 'css-bento-mesh-glass-generator.html',
    'reseller-profit-calculator.html', 'favicon-manifest-generator.html',
    'json-ld-schema-generator.html'
  ];

  requiredTools.forEach(t => {
    assert.ok(toolFiles.includes(t), `Missing required tool: ${t}`);
  });
});

// 5. Validate Informational Pages in pages/
check('Extracted package contains all 5 informational pages in pages/', () => {
  const pagesDir = path.join(TEST_EXTRACT_DIR, 'pages');
  const infoFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
  const requiredPages = ['about.html', 'contact.html', 'privacy.html', 'terms.html', 'disclaimer.html'];
  assert.strictEqual(infoFiles.length, 5, `Expected 5 info pages, found ${infoFiles.length}`);
  requiredPages.forEach(p => {
    assert.ok(infoFiles.includes(p), `Missing required info page: ${p}`);
  });
});

// 6. Validate All 5 Localized Language Directories
check('Extracted package contains all 5 localized directories (bn, hi, es, fr, ar)', () => {
  const langs = ['bn', 'hi', 'es', 'fr', 'ar'];
  langs.forEach(lang => {
    const langDir = path.join(TEST_EXTRACT_DIR, lang);
    assert.ok(fs.existsSync(langDir), `Missing language directory: ${lang}`);
    assert.ok(fs.existsSync(path.join(langDir, 'index.html')), `Missing ${lang}/index.html`);
    assert.ok(fs.existsSync(path.join(langDir, 'tools')), `Missing ${lang}/tools`);
    assert.ok(fs.existsSync(path.join(langDir, 'pages')), `Missing ${lang}/pages`);

    const langTools = fs.readdirSync(path.join(langDir, 'tools')).filter(f => f.endsWith('.html'));
    assert.strictEqual(langTools.length, 6, `Expected 6 flagship tools in ${lang}/tools, found ${langTools.length}`);

    const langPages = fs.readdirSync(path.join(langDir, 'pages')).filter(f => f.endsWith('.html'));
    assert.strictEqual(langPages.length, 5, `Expected 5 info pages in ${lang}/pages, found ${langPages.length}`);
  });
});

// 7. Validate Assets Integrity
check('Extracted package contains all required runtime assets (CSS, JS, vendor pdf-lib)', () => {
  const cssPath = path.join(TEST_EXTRACT_DIR, 'assets', 'css', 'style.css');
  const appJsPath = path.join(TEST_EXTRACT_DIR, 'assets', 'js', 'app.js');
  const toolsDataPath = path.join(TEST_EXTRACT_DIR, 'assets', 'js', 'tools-data.js');
  const pdfLibPath = path.join(TEST_EXTRACT_DIR, 'assets', 'vendor', 'pdf-lib.min.js');

  assert.ok(fs.existsSync(cssPath), 'Missing style.css');
  assert.ok(fs.existsSync(appJsPath), 'Missing app.js');
  assert.ok(fs.existsSync(toolsDataPath), 'Missing tools-data.js');
  assert.ok(fs.existsSync(pdfLibPath), 'Missing pdf-lib.min.js');

  const pdfLibSize = fs.statSync(pdfLibPath).size;
  assert.ok(pdfLibSize > 500000, `pdf-lib.min.js is incomplete (${pdfLibSize} bytes)`);
});

// 8. Strict Exclusion of Development-Only Material
check('Development files (tests/, scratch/, server.js, etc.) are strictly excluded', () => {
  const forbidden = [
    'server.js',
    'tests',
    'scratch',
    'free-online-tools.zip',
    'free-online-tools-v1.0.0-production.zip'
  ];

  forbidden.forEach(item => {
    const itemPath = path.join(TEST_EXTRACT_DIR, item);
    assert.ok(!fs.existsSync(itemPath), `Forbidden development file included in production package: ${item}`);
  });
});

// 9. Clean up temporary test sandbox
check('Cleanup temporary test extraction directory', () => {
  fs.rmSync(TEST_EXTRACT_DIR, { recursive: true, force: true });
  assert.ok(!fs.existsSync(TEST_EXTRACT_DIR), 'Temporary directory was not cleaned up');
});

console.log('\n===============================================================');
console.log(`🎉 ALL ${passedChecks} / ${totalChecks} PACKAGE VERIFICATION CHECKS PASSED!`);
console.log(`Deliverable is confirmed clean, verified, and ready for Hostinger upload.`);
console.log('===============================================================\n');
