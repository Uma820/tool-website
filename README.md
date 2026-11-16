# Free Online Tools — Fast, Private, Client-Side Web Utilities

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-Modern_Semantic-E34F26.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Variables_%26_Logical_Props-1572B6.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla_ES6+-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**Free Online Tools** is a responsive, accessible, multilingual static website featuring **63 canonical browser-based utilities** for developers, writers, students, designers, marketers, and professionals. 

Everything runs **100% inside the visitor's web browser**. There are **no databases, no server-side processing, no file uploads to third parties, no tracking cookies, and no paid API subscriptions**.

---

## 🌟 Key Features

- 🔒 **100% In-Browser Privacy:** All text transformations, JSON formatting, password generation, hash computations, image manipulations, audio decoding, and PDF operations occur strictly in local device memory (RAM).
- ⚡ **Zero Backend Overhead:** Pure static site architecture designed for effortless deployment on **Hostinger shared hosting (`public_html`)**, GitHub Pages, Cloudflare Pages, Netlify, or Apache/LiteSpeed.
- 🌐 **Multilingual & RTL Support:** Fully localized in **6 languages**:
  - English (`en`) — Canonical primary locale
  - Bengali (`bn`) — বাংলা
  - Hindi (`hi`) — हिन्दी
  - Spanish (`es`) — Español
  - French (`fr`) — Français
  - Arabic (`ar`) — العربية (Right-to-Left layout with bidirectional code protection)
- 🔍 **Instant Search & Autocomplete:** Live keyboard-accessible autocomplete suggestions (`Ctrl+K` / `⌘K` or `/`), WAI-ARIA tablist category filters with dynamic tool counters, and instant client-side filtering.
- 🌓 **Dark & Light Mode:** Built-in theme switcher with automatic OS scheme detection (`prefers-color-scheme`) and persistent single-key `localStorage` caching (`fot_user_theme`).
- 📱 **Mobile-First & Accessible:** Fully responsive down to 375px mobile viewports, WCAG 2.1 AA contrast compliance, semantic headings, visible focus rings, and reduced-motion support.
- 🚀 **Technical SEO Built-In:** Clean XML Sitemap (`sitemap.xml`), robots.txt, schema.org JSON-LD structured data (`WebSite`, `WebApplication`, `AboutPage`, `ContactPage`), canonical tags, and reciprocal `hreflang` attributes.

---

## 🛠️ Canonical Tools Catalog (63 Implemented Tools)

### 1. PDF Suite (11 Tools — Self-Hosted `pdf-lib` v1.17.1)
- **[PDF Merger](tools/pdf-merger.html):** Combine multiple PDF documents in chosen order directly in browser memory (`ArrayBuffer`).
- **[PDF Splitter](tools/pdf-splitter.html):** Extract custom page ranges or sets into a new PDF using 1-based indexing.
- **[PDF Page Extractor](tools/pdf-page-extractor.html):** Reorder and extract specific pages (e.g. `3, 1`) preserving requested order.
- **[PDF Page Deleter](tools/pdf-page-deleter.html):** Remove specified pages with empty document prevention guard (mandates $\ge 1$ page).
- **[PDF Page Rotator](tools/pdf-page-rotator.html):** Rotate selected pages clockwise by 90°, 180°, or 270° while preserving non-targeted pages.
- **[PDF Page Counter & File Analyzer](tools/pdf-page-counter.html):** Inspect page counts, byte sizes, and standard embedded `/Info` metadata (Title, Author, Producer).
- **[Image to PDF Converter](tools/pdf-converter.html):** Convert JPEG and PNG images into a clean, paginated PDF document with customizable margins and orientations.
- **[Sign PDF Document](tools/sign-pdf.html):** Draw, type, or upload your signature and stamp it permanently onto any page and coordinates of a PDF.
- **[PDF Annotation & Redaction Editor](tools/pdf-editor.html):** Add text annotations, highlight important sections, or black out sensitive numbers with redacting rectangles.
- **[Text & Markdown to PDF Maker](tools/pdf-maker.html):** Compose formatted documents in text or Markdown and download paginated, styled PDF documents.
- **[PDF Text Stream Extractor](tools/pdf-text-extractor.html):** Extract raw selectable text streams, filter whitespace, search keywords, and export to `.txt`.

### 2. Text & Content Processing (15 Tools — Pure Browser APIs)
- **[Word & Character Counter](tools/word-counter.html):** Real-time words, characters (with/without spaces), lines, paragraphs, and reading time.
- **[Text Case Converter](tools/case-converter.html):** UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.
- **[Remove Extra Spaces](tools/remove-extra-spaces.html):** Normalize repeated whitespace, convert tabs to spaces, and trim line boundaries.
- **[Remove Empty Lines](tools/remove-empty-lines.html):** Strip blank and whitespace-only lines across CRLF and LF breaks.
- **[Duplicate Line Remover](tools/duplicate-line-remover.html):** Deduplicate list items while preserving original appearance order.
- **[Text Reverser](tools/text-reverser.html):** Reverse characters, lines, or words with `Intl.Segmenter` Unicode grapheme cluster safety.
- **[Find and Replace](tools/find-and-replace.html):** Literal string matching, match-case option, regex mode, and live match counters.
- **[Text Sorter](tools/text-sorter.html):** Sort lines alphabetically (A–Z / Z–A), case-insensitively, or natural numeric sorting.
- **[Text to Slug Converter](tools/slug-converter.html):** Generate clean, URL-safe slugs with Latin diacritics decomposition (`Crème Brûlée` &rarr; `creme-brulee`).
- **[Reading Time Estimator](tools/reading-time-estimator.html):** Calculate estimated reading and speaking duration with adjustable Words-Per-Minute (WPM) assumptions.
- **[Text Separator & Delimiter](tools/text-separator.html):** Split or join lists using commas, pipes, semicolons, tabs, custom delimiters, or prefix/suffix.
- **[Text Diff Checker](tools/text-diff-checker.html):** Compare two texts side-by-side or line-by-line with inline addition and deletion highlights.
- **[Email Address Extractor](tools/email-extractor.html):** Extract, deduplicate, and sort unique email addresses from raw text or logs.
- **[URL & Link Extractor](tools/url-extractor.html):** Extract HTTP/HTTPS links and domains from messy text or HTML markup.
- **[Text Byte Size Calculator](tools/text-size-calculator.html):** Measure exact text byte sizes across UTF-8, UTF-16, and ASCII encodings with binary bit counts.

### 3. Image Tools (6 Tools — HTML5 Canvas 2D)
- **[Online Canvas Image Editor](tools/image-editor.html):** Crop, rotate, flip, and fine-tune brightness, contrast, and saturation with PNG/JPEG export.
- **[Image Format Converter](tools/image-converter.html):** Convert images between PNG, JPEG, and WebP with adjustable quality compression settings.
- **[Image Compressor & Optimizer](tools/image-compressor.html):** Downscale resolution, compress JPEG/WebP files, and view real-time byte savings.
- **[EXIF Reader & Privacy Scrubber](tools/exif-reader.html):** Inspect camera models, shutter settings, and GPS coordinates; scrub EXIF metadata for privacy.
- **[Favicon Generator](tools/favicon-generator.html):** Create standard 16x16, 32x32, 48x48, and 180x180 Apple touch icons with HTML link tags.
- **[Custom QR Code Generator](tools/qr-code-generator.html):** Generate high-density QR codes for URLs, text, Wi-Fi networks, and contact vCards with PNG and SVG export.

### 4. Social Media & Link Tools (5 Tools)
- **[YouTube Thumbnail Downloader](tools/youtube-thumbnail-downloader.html):** Extract and download HD (1080p/720p), SD, and default thumbnail covers from YouTube URLs.
- **[WhatsApp Direct Link Generator](tools/whatsapp-link-generator.html):** Generate instant click-to-chat `wa.me` links with custom pre-filled encoded messages.
- **[Mailto Link Generator](tools/mailto-link-generator.html):** Create ready-to-use `mailto:` URLs and HTML anchor tags with subject, body, CC, and BCC.
- **[Instagram Font Generator](tools/instagram-font-generator.html):** Transform text into Unicode fancy fonts, cursive, gothic, bold, and aesthetic styles for social bios.
- **[PayPal Payment Link Generator](tools/paypal-link-generator.html):** Generate clean `paypal.me` payment links with optional pre-filled currency and transaction amounts.

### 5. Website & SEO Tools (6 Tools)
- **[User Agent Parser & Inspector](tools/user-agent-parser.html):** Detect browser name, engine, OS version, architecture, and device family from any client string.
- **[Meta Tags Toolkit](tools/meta-tags-toolkit.html):** Generate search-ready HTML meta tags, Open Graph, and Twitter Cards; inspect existing page tags.
- **[Google SERP Snippet Simulator](tools/serp-preview-tool.html):** Preview title, snippet, and URL rendering in Google desktop and mobile search results with pixel limits.
- **[Open Graph & Social Share Previewer](tools/open-graph-previewer.html):** Simulate link preview cards across Facebook, Twitter/X, and LinkedIn.
- **[SEO Content & Keyword Density Analyzer](tools/seo-content-analyzer.html):** Analyze keyword frequencies, N-grams (1-3 words), heading structure, and readability scores.
- **[SEO Content Comparison Tool](tools/seo-compare.html):** Compare two articles or competitor pages side-by-side across word counts, keyword density, and readability.

### 6. Calculators & Math (7 Tools)
- **[Percentage & Discount Calculator](tools/percentage-calculator.html):** Multi-mode percentage calculations, ratios, percentage changes, and retail discount math.
- **[Age & Date Difference Calculator](tools/age-calculator.html):** Gregorian calendar age calculations, leap year handling, and elapsed duration between dates.
- **[Grade & Weighted GPA Calculator](tools/grade-calculator.html):** Calculate weighted assignment grades, semester GPAs, and compute required scores for final exams.
- **[Age Difference Calculator](tools/age-difference-calculator.html):** Calculate the exact age difference between two individuals in years, months, weeks, and days.
- **[Birthday Countdown Calculator](tools/birthday-calculator.html):** Count down to upcoming birthdays, calculate day of birth, half-birthday, and zodiac signs.
- **[YouTube Revenue & CPM Estimator](tools/youtube-money-calculator.html):** Estimate daily, monthly, and annual creator ad earnings based on views and CPM/RPM brackets.
- **[Phone Number Syntax Validator](tools/phone-number-validator.html):** Validate international ITU-T E.164 and national phone numbers with dial code identification.

### 7. Developer & Code Utilities (6 Tools)
- **[JSON Formatter & Validator](tools/json-formatter-validator.html):** Syntax validation, line/column error diagnostics, 2/4/tab indentation formatting, copy, and file export.
- **[JSON Minifier](tools/json-minifier.html):** Strip formatting whitespace from valid JSON with byte reduction statistics and error traps.
- **[URL Encoder & Decoder](tools/url-encoder-decoder.html):** Percent-encoding and decoding for full URLs or query parameter components.
- **[Base64 Text Encoder & Decoder](tools/base64-encoder-decoder.html):** UTF-8 safe byte-stream encoding/decoding without Latin-1 crashes.
- **[UUID Generator](tools/uuid-generator.html):** Bulk generation (1–100) of RFC 4122 v4 compliant GUIDs using hardware CSPRNG entropy.
- **[Markdown to HTML Previewer](tools/markdown-previewer.html):** Split-screen live Markdown rendering with script sanitization (XSS-safe) and clean HTML export.

### 8. Security & Cryptography (2 Tools)
- **[Cryptographic Hash Generator](tools/hash-generator.html):** Asynchronous hardware-accelerated SHA-256, SHA-512, SHA-384, and SHA-1 hashing via browser `crypto.subtle`.
- **[Strong Password Generator](tools/password-generator.html):** Customizable character sets (uppercase, lowercase, numbers, symbols), length slider, and NIST entropy bit calculation.

### 9. Video & Audio Tools (3 Tools)
- **[Extract Audio from Video](tools/extract-audio-from-video.html):** Extract uncompressed 16-bit PCM WAV audio tracks from MP4, WebM, and MKV videos via Web Audio API.
- **[Video to Animated GIF Converter](tools/video-to-gif.html):** Convert video clips into animated GIFs with customizable frame rate, resolution, and quality.
- **[Video Transcoder & Downscaler](tools/video-converter.html):** Transcode and downscale videos to 1080p, 720p, or 480p WebM/MP4 using Canvas 2D and MediaRecorder.

### 10. Converters & UI Utilities (2 Tools)
- **[Universal Unit Converter](tools/unit-converter.html):** Metric and imperial conversion for Length, Weight/Mass, Temperature, Area, and Digital Storage.
- **[Color Converter & Contrast Checker](tools/color-converter.html):** Two-way HEX, RGB, and HSL conversions with live WCAG 2.1 AA/AAA contrast ratio auditing.

---

## 📂 Project Directory Structure

```
.
├── .htaccess                     # Apache/LiteSpeed web server configuration (compression, caching, 404)
├── index.html                    # English Canonical Homepage & Interactive Tools Directory
├── 404.html                      # Custom Helpful 404 Error Page (noindex, nofollow)
├── README.md                     # Project documentation (this file)
├── HOSTINGER_DEPLOYMENT_GUIDE.md # Beginner-friendly step-by-step Hostinger deployment guide
├── robots.txt                    # Search crawler indexing directives
├── sitemap.xml                   # XML Sitemap with 94 verified public canonical URLs
├── server.js                     # Lightweight local development HTTP server
│
├── assets/
│   ├── css/
│   │   └── style.css             # Main responsive stylesheet (Dark/Light themes, RTL layout)
│   ├── js/
│   │   ├── app.js                # Global application logic (theme, search, autocomplete, router)
│   │   └── tools-data.js         # Central registry of tool metadata, keywords, and categories
│   └── vendor/
│       └── pdf-lib.min.js        # Self-hosted open-source PDF engine (MIT License, 525 KB)
│
├── tools/                        # 28 Canonical Tool HTML workspaces (English)
│   ├── word-counter.html
│   ├── case-converter.html
│   ├── json-formatter-validator.html
│   ├── pdf-merger.html
│   └── ... (24 additional tools)
│
├── pages/                        # 5 Canonical Informational & Policy Pages (English)
│   ├── about.html                # Project architecture & capability tiers
│   ├── contact.html              # Responsible bug reporting & configuration guidelines
│   ├── privacy.html              # Code-verified privacy declaration
│   ├── terms.html                # Informational draft terms of service
│   └── disclaimer.html           # Financial, cryptographic, and outcome disclaimers
│
├── bn/                           # Bengali (বাংলা) Localized Suite (Home + 6 Tools + 5 Info Pages)
├── hi/                           # Hindi (हिन्दी) Localized Suite (Home + 6 Tools + 5 Info Pages)
├── es/                           # Spanish (Español) Localized Suite (Home + 6 Tools + 5 Info Pages)
├── fr/                           # French (Français) Localized Suite (Home + 6 Tools + 5 Info Pages)
├── ar/                           # Arabic (العربية) Localized Suite with RTL layout
│
├── docs/                         # Architecture specifications, audit logs, and capability manifests
│   ├── DEPLOYMENT_CONFIG.md      # Domain placeholder configuration guide
│   ├── HOSTINGER_DEPLOYMENT.md   # Deployment options reference
│   ├── LIBRARIES.md              # Vendor libraries & MIT license verification
│   ├── LOCALIZATION.md           # Localization audit & translation roadmap
│   ├── TEST_REPORT.md            # Master quality assurance audit report
│   └── TOOL_MANIFEST.md         # Master tool capability inventory
│
├── scripts/                      # Developer and deployment automation scripts
│   ├── configure-production-domain.js  # CLI to set live production domain across all files
│   └── verify-package.js         # Production archive integrity validation script
│
└── tests/                        # Automated unit, functional, SEO, and regression test suites
    ├── test-suite.js             # Tier 1 tools unit tests
    ├── test-pdf-suite.js         # Tier 2 PDF library operations tests
    ├── test-localization.js      # Localization and RTL layout tests
    ├── test-seo-informational.js # Sitemap, robots, canonicals, and metadata tests
    └── audit-phase6.js           # Comprehensive 37-point site audit across all 96 HTML files
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (used strictly for running local dev server and test scripts; no build or compilation step is required).

### 1. Run the Local Development Server
Open your terminal in the project directory and run:

```bash
node server.js
```

Then visit **`http://localhost:3000/`** in your web browser.

Alternatively, you can use any static HTTP file server:
```bash
# Using Python:
python -m http.server 3000

# Using npx serve:
npx serve .
```

---

## 🧪 Running Automated Tests

The project includes **5 automated test suites** covering unit algorithms, PDF fixtures, localization, SEO integrity, and package verification:

```bash
# 1. Test Tier 1 Tools (15 Canonical Tools)
node tests/test-suite.js

# 2. Test Tier 2 PDF Tools (6 Canonical PDF Tools)
node tests/test-pdf-suite.js

# 3. Test Localization & Arabic RTL Protections
node tests/test-localization.js

# 4. Test SEO, Metadata, Sitemap & Informational Pages
node tests/test-seo-informational.js

# 5. Run Comprehensive 37-Point Site Audit (All 96 Files)
node tests/audit-phase6.js

# 6. Verify Production Deployment Package Integrity
node scripts/verify-package.js
```

All 88+ automated checks pass with **0 failures**.

---

## 🌐 Deploying to Hostinger Shared Hosting

Deploying Free Online Tools to Hostinger shared hosting (Single, Premium, Business, or Cloud) takes less than 5 minutes.

### Step 1: Configure Your Live Production Domain
The files use the safe placeholder `https://[YOUR_PRODUCTION_DOMAIN]`. Set your actual domain name across all canonical tags, sitemap, and robots.txt using the built-in CLI:

```bash
node scripts/configure-production-domain.js https://your-actual-domain.com
```

### Step 2: Upload to Hostinger File Manager
1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com/).
2. Navigate to **Websites** &rarr; **Manage** &rarr; **File Manager**.
3. Open the **`public_html`** folder.
4. Upload `free-online-tools-v1.0.0-production.zip` (or `free-online-tools.zip`).
5. Right-click the uploaded ZIP &rarr; select **Extract** &rarr; extract directly into **`public_html`** (or `.`).
6. Confirm that `index.html`, `.htaccess`, `assets/`, `tools/`, and `pages/` sit directly under `public_html`. Delete the ZIP file.

### Step 3: Enable Free SSL (HTTPS)
1. In hPanel, go to **Security** &rarr; **SSL**.
2. Activate your free Let's Encrypt SSL certificate.
3. Toggle **Force HTTPS** to **ON**.

> 📖 For detailed screenshots, FTP instructions, and troubleshooting, read [`HOSTINGER_DEPLOYMENT_GUIDE.md`](HOSTINGER_DEPLOYMENT_GUIDE.md).

---

## 📦 Production Deliverables

Pre-built deployable archives are generated and verified in the repository:
- **`free-online-tools-v1.0.0-production.zip`** (Clean archive containing strictly deployable files).
- **`free-online-tools.zip`** (Standard distribution alias).

Both archives exclude development test fixtures, temporary scratch directories, and local development servers.

---

## 🛡️ Privacy, Security & Ethics

- **No Remote Telemetry:** The website does not embed tracking scripts, behavioral analytics, or third-party advertising scripts.
- **Local Browser Memory Only:** Submitted files and text drafts are never transmitted over the network; everything is processed in ephemeral browser memory and discarded on tab close.
- **Cryptographic Standards:** Hashes and passwords use the browser's hardware-backed `SubtleCrypto` and `crypto.getRandomValues()` APIs.
- **Truth in Advertising:** We do not generate mock controls, fake progress bars, or unverified claims.

---

## 📄 License & Attributions

This project is licensed under the **MIT License**.

### Third-Party Libraries
- **[`pdf-lib`](https://pdf-lib.js.org/)** (v1.17.1) — Self-hosted in `assets/vendor/pdf-lib.min.js`. Distributed under the MIT License. Copyright (c) 2019 Andrew Dillon.
