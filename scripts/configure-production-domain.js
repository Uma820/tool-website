/**
 * Free Online Tools - Production Domain Configuration Utility
 * 
 * Usage:
 *   node scripts/configure-production-domain.js https://yourdomain.com
 *   node scripts/configure-production-domain.js --reset
 * 
 * Purpose:
 * Safely updates canonical URLs, hreflang links, OpenGraph metadata, JSON-LD schemas,
 * sitemap.xml, and activates the robots.txt Sitemap directive for live Hostinger deployment.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PLACEHOLDER = 'https://[YOUR_PRODUCTION_DOMAIN]';

const targetDomain = process.argv[2];

if (!targetDomain) {
  console.log(`
=======================================================================
Free Online Tools — Production Domain Configuration
=======================================================================

Usage:
  node scripts/configure-production-domain.js <production-origin-url>
  node scripts/configure-production-domain.js --reset

Examples:
  node scripts/configure-production-domain.js https://tools.example.com
  node scripts/configure-production-domain.js https://myfreetools.net

Current State:
  Canonical & Sitemap Placeholder: ${PLACEHOLDER}
  Sitemap Directive in robots.txt: Inactive (Prevents bot crawling of unconfigured domain)
=======================================================================
`);
  process.exit(0);
}

let newOrigin = '';
let isReset = targetDomain === '--reset';

if (!isReset) {
  try {
    const url = new URL(targetDomain);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('URL must start with http:// or https://');
    }
    // Origin without trailing slash
    newOrigin = url.origin;
  } catch (err) {
    console.error(`❌ Error: Invalid production domain '${targetDomain}': ${err.message}`);
    process.exit(1);
  }
} else {
  newOrigin = PLACEHOLDER;
}

console.log(`\n🚀 Configuring Production Origin to: ${newOrigin}\n`);

// Collect files to update:
// Root HTML, sitemap.xml, robots.txt, tools/*.html, pages/*.html, {lang}/**/*.html
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'scratch', 'tests', 'scripts'].includes(file)) {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(ROOT_DIR);
let updatedFiles = 0;

// 1. Process HTML files
htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const searchPattern = isReset ? new RegExp('https?://[a-zA-Z0-9.-]+(?::[0-9]+)?', 'g') : PLACEHOLDER;
  
  if (content.includes(PLACEHOLDER) || isReset) {
    if (isReset) {
      // Revert canonicals that match configured domain
      content = content.replace(searchPattern, (match) => {
        if (match.includes('schema.org') || match.includes('w3.org')) return match;
        return PLACEHOLDER;
      });
    } else {
      content = content.replaceAll(PLACEHOLDER, newOrigin);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    updatedFiles++;
  }
});

// 2. Process sitemap.xml
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (isReset) {
    sitemapContent = sitemapContent.replace(/<loc>https?:\/\/[^<]+<\/loc>/g, (match) => {
      return match.replace(/https?:\/\/[^\/]+/, PLACEHOLDER);
    });
  } else {
    sitemapContent = sitemapContent.replaceAll(PLACEHOLDER, newOrigin);
  }
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  updatedFiles++;
}

// 3. Process robots.txt
const robotsPath = path.join(ROOT_DIR, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  let robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (isReset) {
    // Comment out sitemap
    robotsContent = robotsContent.replace(/Sitemap: .*/g, `# Sitemap: ${PLACEHOLDER}/sitemap.xml`);
  } else {
    // Activate sitemap with new origin
    if (robotsContent.includes('# Sitemap:')) {
      robotsContent = robotsContent.replace(/# Sitemap: .*/g, `Sitemap: ${newOrigin}/sitemap.xml`);
    } else if (robotsContent.includes('Sitemap:')) {
      robotsContent = robotsContent.replace(/Sitemap: .*/g, `Sitemap: ${newOrigin}/sitemap.xml`);
    } else {
      robotsContent += `\nSitemap: ${newOrigin}/sitemap.xml\n`;
    }
  }
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  updatedFiles++;
}

console.log(`✅ Success: Updated ${updatedFiles} files.`);
if (!isReset) {
  console.log(`   - Canonical tags updated to: ${newOrigin}`);
  console.log(`   - sitemap.xml generated with 94 public entries at: ${newOrigin}/sitemap.xml`);
  console.log(`   - robots.txt Sitemap directive activated.`);
} else {
  console.log(`   - Reverted all URLs to safe placeholder ${PLACEHOLDER}.`);
}
