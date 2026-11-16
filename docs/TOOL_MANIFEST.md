# Free Online Tools — Master Tool Inventory & Capability Manifest

**Project:** Free Online Tools (Static Browser-Based Utility Suite)  
**Target Host:** Hostinger Shared Hosting (Static deployment in `public_html`)  
**Architecture:** HTML5, Modern CSS, Vanilla JavaScript, and Self-Hosted `pdf-lib`  
**Current Catalog:** **63 Implemented Canonical Tools** + 6 Informational/Legal Pages (Localized into 6 Languages)  
**Last Updated:** Browser-Based Tools Expansion (35 Newly Added Tools Verified)  

---

## 1. Capability Tiers Overview

Each tool is assigned a capability tier based on browser platform feasibility, performance, and hosting constraints:

- **Tier 1 (Pure Browser APIs & Vanilla JS):** 100% client-side, zero external library dependencies, instant execution, lightweight, privacy-preserving.
- **Tier 2 (Free Client-Side Libraries):** Uses vetted open-source client-side JavaScript/WASM libraries (e.g. `pdf-lib`, `jspdf`, `marked`) when browser APIs alone are insufficient.
- **Tier 3 (External API / Server / Backend Required):** Requires server-side binaries (like headless LibreOffice for real PPTX rendering, ffmpeg server) or paid third-party APIs. Not viable on pure static hosting without a dedicated backend.
- **Tier 4 (Unsupported / Impractical on Static Shared Hosting):** Violates budget, privacy, or technical constraints (e.g., live Google SERP rank scrapers without paid proxies, fake AI watermark removers, simulated internet speed tests). Marked as unsupported with realistic alternatives.

---

## 2. Phase 5 Informational Pages & Technical SEO System (Implemented & Checked)

### Canonical Informational Pages
| # | Page | Canonical URL | Category | Status | Details & Verification |
|---|------|---------------|----------|--------|------------------------|
| 1 | **About Us** | `/pages/about.html` | Informational | **Implemented & Checked** | Explains client-side architecture, 4 capability tiers, no-database design, and owner configuration placeholder. JSON-LD `AboutPage`. |
| 2 | **Contact Us** | `/pages/contact.html` | Informational | **Implemented & Checked** | Zero non-functional forms or dummy `mailto` links; step-by-step bug reporting guidelines; owner contact placeholders. JSON-LD `ContactPage`. |
| 3 | **Privacy Policy** | `/pages/privacy.html` | Legal / Policy | **Implemented & Checked** | 100% code-verified: documents `fot_user_theme` localStorage key, zero tracking/ad cookies, browser RAM processing, standard web server access logs, and self-hosted `pdf-lib`. JSON-LD `WebPage`. |
| 4 | **Terms and Conditions** | `/pages/terms.html` | Legal / Policy | **Implemented & Checked** | General informational draft outlining acceptable use, as-is warranty, liability limits, and explicit notice for owner legal review. JSON-LD `WebPage`. |
| 5 | **Disclaimer** | `/pages/disclaimer.html` | Legal / Policy | **Implemented & Checked** | Informational draft outlining financial/tax advice disclaimers, Web Crypto entropy boundaries, and absence of SEO/traffic guarantees. JSON-LD `WebPage`. |
| 6 | **Helpful 404 Page** | `/404.html` | System / Error | **Implemented & Checked** | `<meta name="robots" content="noindex, nofollow">`, search guidance, direct category links, and returns HTTP 404 status code on local server and `.htaccess`. |

### Localized Informational Pages (25 Files)
All 5 informational pages (`about`, `contact`, `privacy`, `terms`, `disclaimer`) are localized into 5 languages:
- **Bengali (`bn`):** `/bn/pages/about.html`, `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html`
- **Hindi (`hi`):** `/hi/pages/about.html`, `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html`
- **Spanish (`es`):** `/es/pages/about.html`, `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html`
- **French (`fr`):** `/fr/pages/about.html`, `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html`
- **Arabic (`ar`):** `/ar/pages/about.html`, `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html` (with `dir="rtl"` and LTR protected placeholders)

---

## 3. Implemented Tools Catalog (63 Canonical Tools)

### Section A: Canonical PDF Suite (11 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Library / Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|------------------|---------------------------|
| 1 | **PDF Merger** | `/tools/pdf-merger.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Merge multiple PDFs in chosen sequence; memory bounded. |
| 2 | **PDF Splitter** | `/tools/pdf-splitter.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Extract ranges/pages with 1-based numbering. |
| 3 | **PDF Page Extractor** | `/tools/pdf-page-extractor.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Custom page order preservation (`3, 1, 2`). |
| 4 | **PDF Page Deleter** | `/tools/pdf-page-deleter.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Remove unwanted pages; empty-output prevention guard. |
| 5 | **PDF Page Rotator** | `/tools/pdf-page-rotator.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Rotate selected pages in 90&deg; increments. |
| 6 | **PDF Page Counter & Analyzer** | `/tools/pdf-page-counter.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Audit page count, byte footprint, and `/Info` dictionary. |
| 7 | **Image to PDF Converter** | `/tools/pdf-converter.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Convert JPG/PNG images to paginated PDF with margin controls. |
| 8 | **Sign PDF Document** | `/tools/sign-pdf.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Draw, type, or upload signatures and stamp permanently on any page. |
| 9 | **PDF Visual Annotation Editor** | `/tools/pdf-editor.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Add text overlays, yellow highlights, and blackout redaction boxes. |
| 10 | **Text & Markdown to PDF Maker** | `/tools/pdf-maker.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Paginated text/Markdown document generator with styling. |
| 11 | **PDF Text Stream Extractor** | `/tools/pdf-text-extractor.html` | Tier 2 | Implemented & Checked | `pdf-lib` v1.17.1 | Extracts text streams, keyword filtering, and `.txt` export. |

### Section B: Text & Content Processing (15 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 12 | **Word and Character Counter** | `/tools/word-counter.html` | Tier 1 | Implemented & Checked | Vanilla JS | Words, chars, sentences, paragraphs, reading level. |
| 13 | **Text Case Converter** | `/tools/case-converter.html` | Tier 1 | Implemented & Checked | Vanilla JS | UPPER, lower, Sentence, Title, camel, snake, kebab. |
| 14 | **Remove Extra Spaces** | `/tools/remove-extra-spaces.html` | Tier 1 | Implemented & Checked | Vanilla JS | Collapse spaces, trim line edges, replace tabs. |
| 15 | **Remove Empty Lines** | `/tools/remove-empty-lines.html` | Tier 1 | Implemented & Checked | Vanilla JS | Strip blank/whitespace-only lines safely. |
| 16 | **Duplicate Line Remover** | `/tools/duplicate-line-remover.html` | Tier 1 | Implemented & Checked | Vanilla JS | Deduplicate lines preserving first appearance. |
| 17 | **Text Reverser** | `/tools/text-reverser.html` | Tier 1 | Implemented & Checked | `Intl.Segmenter` | Reverse chars, words, lines with Unicode/emoji safety. |
| 18 | **Find and Replace** | `/tools/find-and-replace.html` | Tier 1 | Implemented & Checked | Vanilla JS | Literal and regex find/replace with match counts. |
| 19 | **Text Sorter** | `/tools/text-sorter.html` | Tier 1 | Implemented & Checked | Vanilla JS | Alphabetical A-Z, Z-A, and natural numeric sort. |
| 20 | **Text to Slug Converter** | `/tools/slug-converter.html` | Tier 1 | Implemented & Checked | Vanilla JS | Clean URL slugs with NFD diacritic stripping. |
| 21 | **Reading Time Estimator** | `/tools/reading-time-estimator.html` | Tier 1 | Implemented & Checked | Vanilla JS | Approximate reading and speaking duration at customizable WPM. |
| 22 | **Text Separator & Delimiter** | `/tools/text-separator.html` | Tier 1 | Implemented & Checked | Vanilla JS | Split/join lines by comma, pipe, semicolon, custom delimiter. |
| 23 | **Text Diff Checker** | `/tools/text-diff-checker.html` | Tier 1 | Implemented & Checked | Vanilla JS (LCS) | Side-by-side and unified diff with inline change highlights. |
| 24 | **Email Address Extractor** | `/tools/email-extractor.html` | Tier 1 | Implemented & Checked | RFC 5322 regex | Extract, sort, and deduplicate emails from messy text. |
| 25 | **URL & Link Extractor** | `/tools/url-extractor.html` | Tier 1 | Implemented & Checked | URI regex parser | Scrape HTTP/HTTPS links and domains from text or HTML. |
| 26 | **Text Byte Size Calculator** | `/tools/text-size-calculator.html` | Tier 1 | Implemented & Checked | `TextEncoder` | Byte size across UTF-8, UTF-16, ASCII with binary bits. |

### Section C: Developer & Code Utilities (6 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 27 | **JSON Formatter and Validator** | `/tools/json-formatter-validator.html` | Tier 1 | Implemented & Checked | `JSON.parse` | 2/4/tab indentation, actionable syntax error traps. |
| 28 | **JSON Minifier** | `/tools/json-minifier.html` | Tier 1 | Implemented & Checked | `JSON.stringify` | Minify payloads, validation guard, byte savings metric. |
| 29 | **URL Encoder and Decoder** | `/tools/url-encoder-decoder.html` | Tier 1 | Implemented & Checked | `encodeURIComponent` | Component vs full URL encoding with percent-escape guards. |
| 30 | **Base64 Text Encoder/Decoder** | `/tools/base64-encoder-decoder.html` | Tier 1 | Implemented & Checked | UTF-8 byte stream | Unicode and emoji safe Base64 roundtripping. |
| 31 | **UUID Generator** | `/tools/uuid-generator.html` | Tier 1 | Implemented & Checked | `crypto.randomUUID` | RFC 4122 v4 UUID batch generator (1-100). |
| 32 | **Markdown to HTML Previewer** | `/tools/markdown-previewer.html` | Tier 1 | Implemented & Checked | Embedded Parser | Split-screen Markdown editor with DOMPurify sanitization. |

### Section D: Security & Cryptography (2 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 33 | **Cryptographic Hash Generator** | `/tools/hash-generator.html` | Tier 1 | Implemented & Checked | Web Crypto API | Hardware SHA-256, SHA-512, SHA-384, SHA-1 calculations. |
| 34 | **Strong Password Generator** | `/tools/password-generator.html` | Tier 1 | Implemented & Checked | CSPRNG | Cryptographically unguessable passwords with Shannon entropy. |

### Section E: Calculators & Mathematics (7 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 35 | **Percentage & Discount Calculator** | `/tools/percentage-calculator.html` | Tier 1 | Implemented & Checked | Math engine | Percentages, ratio calculations, and retail sales discounts. |
| 36 | **Age & Date Difference Calculator** | `/tools/age-calculator.html` | Tier 1 | Implemented & Checked | Gregorian Date API | Exact age in years/months/days, days between dates. |
| 37 | **Grade & Weighted GPA Calculator** | `/tools/grade-calculator.html` | Tier 1 | Implemented & Checked | Math engine | Weighted assignment grading, GPA scale, final exam planner. |
| 38 | **Age Difference Calculator** | `/tools/age-difference-calculator.html` | Tier 1 | Implemented & Checked | Gregorian Date API | Compare exact age difference between two individuals. |
| 39 | **Birthday Countdown Calculator** | `/tools/birthday-calculator.html` | Tier 1 | Implemented & Checked | Gregorian Date API | Days to birthday, day of birth, half-birthday, zodiac. |
| 40 | **YouTube Revenue & CPM Estimator** | `/tools/youtube-money-calculator.html` | Tier 1 | Implemented & Checked | Formula engine | Daily/monthly/yearly creator ad estimates (disclosed bounds). |
| 41 | **Phone Number Syntax Validator** | `/tools/phone-number-validator.html` | Tier 1 | Implemented & Checked | ITU-T E.164 parser | International syntax checker, country dial code detection. |

### Section F: Image Tools (6 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 42 | **Online Canvas Image Editor** | `/tools/image-editor.html` | Tier 1 | Implemented & Checked | HTML5 Canvas 2D | Crop, rotate, flip, adjust brightness, contrast, saturation. |
| 43 | **Image Format Converter** | `/tools/image-converter.html` | Tier 1 | Implemented & Checked | Canvas `.toBlob` | Convert PNG, JPEG, WebP with custom quality compression. |
| 44 | **Image Compressor & Optimizer** | `/tools/image-compressor.html` | Tier 1 | Implemented & Checked | Canvas 2D | Downscale resolution, adjust lossy quality, byte savings. |
| 45 | **EXIF Reader & Privacy Scrubber** | `/tools/exif-reader.html` | Tier 1 | Implemented & Checked | Binary parser | Parse camera tags, GPS coordinates; scrub EXIF privacy tool. |
| 46 | **Favicon Generator & Packager** | `/tools/favicon-generator.html` | Tier 1 | Implemented & Checked | Canvas 2D | 16x16, 32x32, 48x48, 180x180 icons + HTML link snippets. |
| 47 | **Custom QR Code Generator** | `/tools/qr-code-generator.html` | Tier 1 | Implemented & Checked | Embedded QR engine | High-density QR codes for URLs, text, Wi-Fi; PNG/SVG export. |

### Section G: Social Media & Link Tools (5 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 48 | **YouTube Thumbnail Downloader** | `/tools/youtube-thumbnail-downloader.html` | Tier 1 | Implemented & Checked | YT image CDN | Direct extraction of HD (1280x720), SD, and default covers. |
| 49 | **WhatsApp Direct Link Generator** | `/tools/whatsapp-link-generator.html` | Tier 1 | Implemented & Checked | wa.me URI builder | Pre-filled URL-encoded message generator with live preview. |
| 50 | **Mailto Link Generator** | `/tools/mailto-link-generator.html` | Tier 1 | Implemented & Checked | URI builder | RFC 6068 mailto builder with CC, BCC, subject, and body. |
| 51 | **Instagram Font Generator** | `/tools/instagram-font-generator.html` | Tier 1 | Implemented & Checked | Unicode maps | Mathematical alphanumeric symbols (gothic, cursive, bold). |
| 52 | **PayPal Payment Link Generator** | `/tools/paypal-link-generator.html` | Tier 1 | Implemented & Checked | paypal.me builder | Clean payment links with fixed currency and custom amounts. |

### Section H: Website & SEO Tools (6 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 53 | **User Agent Parser & Inspector** | `/tools/user-agent-parser.html` | Tier 1 | Implemented & Checked | Regex parser | Detects browser, version, OS, architecture, device family. |
| 54 | **Meta Tags Toolkit** | `/tools/meta-tags-toolkit.html` | Tier 1 | Implemented & Checked | DOM parser | Generates SEO, OG, Twitter meta tags; inspects pasted HTML. |
| 55 | **Google SERP Snippet Simulator** | `/tools/serp-preview-tool.html` | Tier 1 | Implemented & Checked | DOM simulator | Accurate Google desktop/mobile SERP pixel width preview. |
| 56 | **Open Graph & Share Previewer** | `/tools/open-graph-previewer.html` | Tier 1 | Implemented & Checked | DOM simulator | Facebook, Twitter/X, and LinkedIn social card previewer. |
| 57 | **SEO Content & Density Analyzer** | `/tools/seo-content-analyzer.html` | Tier 1 | Implemented & Checked | NLP tokenizer | Word frequency, 1-3 N-grams, heading hierarchy, Flesch score. |
| 58 | **SEO Content Comparison Tool** | `/tools/seo-compare.html` | Tier 1 | Implemented & Checked | NLP comparison | Side-by-side keyword overlap, density, and readability. |

### Section I: Video & Audio Tools (3 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 59 | **Extract Audio from Video** | `/tools/extract-audio-from-video.html` | Tier 1 | Implemented & Checked | Web Audio API | Decodes video audio track to uncompressed 16-bit PCM WAV. |
| 60 | **Video to Animated GIF Converter** | `/tools/video-to-gif.html` | Tier 1 | Implemented & Checked | Canvas + NeuQuant | Video frame seeking with embedded color quantizer to GIF. |
| 61 | **Video Transcoder & Downscaler** | `/tools/video-converter.html` | Tier 1 | Implemented & Checked | Canvas + MediaRecorder | Downscales video resolution (1080p, 720p, 480p) to WebM/MP4. |

### Section J: Converters & UI Utilities (2 Tools)
| # | Tool Name | Canonical URL | Tier | Status | Engine | Key Capabilities & Limits |
|---|-----------|---------------|------|--------|--------|---------------------------|
| 62 | **Universal Unit Converter** | `/tools/unit-converter.html` | Tier 1 | Implemented & Checked | Conversion factors | Length, Mass, Temperature, Area, and Digital Storage units. |
| 63 | **Color Converter & Contrast Checker** | `/tools/color-converter.html` | Tier 1 | Implemented & Checked | Color math | HEX, RGB, HSL conversion + WCAG 2.1 AA/AAA contrast ratios. |

---

## 4. Technical Boundaries & Explicitly Omitted Items

### Omitted Item: Internet Speed Test (Strictly Tier 4)
- **Status:** **Omitted & Not Implemented**.
- **Reasoning:** Accurate network speed tests (measuring download/upload throughput and latency) require multi-megabyte or gigabyte bidirectional byte streams against dedicated, geographically distributed high-bandwidth WebSocket or TCP edge servers.
- **Static Hosting Constraint:** On pure static shared web hosting (e.g. Hostinger `public_html`), there are no dedicated socket servers or data streaming daemons.
- **Ethical & Quality Mandate:** Generating a simulated fake speed test (such as an animated speedometer with pseudo-random numbers) is dishonest, misleads users, violates web standards, and is strictly prohibited by project principles. Therefore, Internet Speed Test is honestly omitted from the static client-side suite.

### Omitted Presentation Converters (Tier 3)
- **PPT / PPTX to PDF Converter:** Requires native server-side headless LibreOffice or Microsoft Office rendering engines to parse binary/XML slide layouts with true visual fidelity. Pure browser JavaScript cannot perform faithful PPTX-to-PDF layout synthesis without external APIs.

### Omitted AI Watermark Removers (Tier 4)
- **AI Watermark Remover:** Requires multi-gigabyte deep neural network inpainting weights and dedicated GPU server infrastructure. Fake client-side blur or content-aware stamp approximations provide unacceptable results and are prohibited.

---

## 5. Architectural Integrity Summary

- **Total Canonical Tools:** 63 implemented and verified tools.
- **Server Dependencies:** 0 (zero backend endpoints, zero databases, zero cloud storage).
- **External Paid APIs:** 0 (no Google, OpenAI, AWS, or subscription keys required).
- **User Privacy:** 100% in-browser processing. All files (PDFs, images, videos, audio, text) remain in client RAM.
- **Hosting Compatibility:** 100% compatible with Hostinger shared hosting and any standard Apache/Nginx static file host.
