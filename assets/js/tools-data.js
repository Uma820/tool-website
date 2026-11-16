/**
 * Free Online Tools - Master Central Tool Registry
 * Single Source of Truth for tool metadata, search aliases, categories, and capability tiers.
 */

const TOOL_CATEGORIES = [
  { id: 'all', name: 'All Tools', icon: 'grid', description: 'Browse all 109 free, client-side web tools.' },
  { id: 'calculators', name: 'Calculators', icon: 'calculator', subcategories: ['calculators', 'converters', 'logistics', 'solar', 'food', 'crafts', 'printing', 'aquarium'], description: 'Calculators for business, finance, logistics, 3D printing, energy, food, and crafts.' },
  { id: 'pdf', name: 'PDF Tools', icon: 'file-text', subcategories: ['pdf'], description: 'Merge, split, extract, delete, rotate, sign, edit, and create PDF documents in browser.' },
  { id: 'text', name: 'Text & Content', icon: 'type', subcategories: ['text'], description: 'Count words, format text cases, clean whitespace, compare text, and extract data.' },
  { id: 'images', name: 'Images & Design', icon: 'image', subcategories: ['images', 'web-ui', 'pod'], description: 'Resize, crop, convert, compress, read EXIF, test DPI, generate favicons, and design CSS.' },
  { id: 'developer', name: 'Developer & Security', icon: 'code', subcategories: ['developer', 'security'], description: 'Format JSON, minify payloads, encode URLs, generate hashes, passwords, and preview Markdown.' },
  { id: 'seo', name: 'SEO & Social', icon: 'search', subcategories: ['seo', 'social', 'video'], description: 'Inspect User Agents, simulate SERP snippets, generate schema, check safe zones, and style links.' }
];

const TOOLS_DATABASE = [
  // --- Phase 3: 6 Canonical Tier 2 PDF Tools ---
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-merger.html',
    badge: 'Popular',
    description: 'Combine multiple PDF documents into a single organized file in your chosen order.',
    keywords: ['pdf merger', 'merge pdf', 'combine pdf', 'join pdf', 'combine documents']
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-splitter.html',
    badge: 'Essential',
    description: 'Extract custom page ranges or sets of pages into a new PDF with clear 1-based numbering.',
    keywords: ['pdf splitter', 'split pdf', 'extract pdf pages', 'separate pdf', 'pdf range']
  },
  {
    id: 'pdf-page-extractor',
    name: 'PDF Page Extractor',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-page-extractor.html',
    badge: 'PDF Tool',
    description: 'Pick individual PDF pages and compile them into a new document, preserving your selected order.',
    keywords: ['pdf page extractor', 'extract pages', 'reorder pdf pages', 'rearrange pdf']
  },
  {
    id: 'pdf-page-deleter',
    name: 'PDF Page Deleter',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-page-deleter.html',
    badge: 'PDF Tool',
    description: 'Remove unwanted pages or cover sheets from a PDF with empty document protection.',
    keywords: ['pdf page deleter', 'delete pdf pages', 'remove pages', 'delete page from pdf']
  },
  {
    id: 'pdf-page-rotator',
    name: 'PDF Page Rotator',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-page-rotator.html',
    badge: 'PDF Tool',
    description: 'Rotate upside-down or sideways pages by 90-degree increments while preserving other pages.',
    keywords: ['pdf page rotator', 'rotate pdf', 'turn pdf', 'rotate pages', 'orient pdf']
  },
  {
    id: 'pdf-page-counter',
    name: 'PDF Page Counter & File Analyzer',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-page-counter.html',
    badge: 'Inspector',
    description: 'Count PDF pages, analyze file size metrics, and inspect document metadata dictionaries.',
    keywords: ['pdf page counter', 'pdf file size analyzer', 'pdf metadata viewer', 'count pages', 'inspect pdf']
  },

  // --- Phase 2: 15 Canonical Tier 1 Tools ---
  {
    id: 'word-counter',
    name: 'Word and Character Counter',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/word-counter.html',
    badge: 'Popular',
    description: 'Count words, characters with and without spaces, lines, and paragraphs in real time.',
    keywords: ['word count', 'character counter', 'letter counter', 'line counter', 'paragraph counter', 'sentence counter', 'text statistics']
  },
  {
    id: 'case-converter',
    name: 'Text Case Converter',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/case-converter.html',
    badge: 'Essential',
    description: 'Transform text to UPPERCASE, lowercase, sentence case, title case, camelCase, snake_case, and kebab-case.',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'sentence case', 'capitalize text']
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/remove-extra-spaces.html',
    badge: 'Text Tool',
    description: 'Normalize repeated spaces down to a single space and trim line edges with clearly named options.',
    keywords: ['remove extra spaces', 'clean whitespace', 'collapse spaces', 'trim line edges', 'normalize spaces']
  },
  {
    id: 'remove-empty-lines',
    name: 'Remove Empty Lines',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/remove-empty-lines.html',
    badge: 'Text Tool',
    description: 'Strip blank, empty, and whitespace-only lines from text or code while preserving order.',
    keywords: ['remove empty lines', 'delete blank lines', 'strip empty rows', 'remove blank spaces']
  },
  {
    id: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/duplicate-line-remover.html',
    badge: 'Productivity',
    description: 'Deduplicate lines while preserving the first occurrence, with case-sensitive and trim matching.',
    keywords: ['duplicate line remover', 'remove duplicates', 'deduplicate list', 'unique lines']
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/text-reverser.html',
    badge: 'Utility',
    description: 'Reverse characters, words, or line order safely with full Unicode grapheme cluster support.',
    keywords: ['text reverser', 'reverse string', 'reverse lines', 'backwards text', 'flip words']
  },
  {
    id: 'find-and-replace',
    name: 'Find and Replace',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/find-and-replace.html',
    badge: 'Essential',
    description: 'Search and replace literal text or patterns with match-case options and clear validation.',
    keywords: ['find and replace', 'search and replace', 'replace text', 'replace words', 'regex replace']
  },
  {
    id: 'text-sorter',
    name: 'Text Sorter',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/text-sorter.html',
    badge: 'Utility',
    description: 'Sort lines alphabetically (A–Z or Z–A) with case-insensitive and natural numeric sorting.',
    keywords: ['text sorter', 'alphabetical sorter', 'sort lines', 'order lines', 'natural sort']
  },
  {
    id: 'slug-converter',
    name: 'Text to Slug Converter',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/slug-converter.html',
    badge: 'SEO Tool',
    description: 'Generate clean, readable, SEO-optimized URL slugs with accent normalization and symbol handling.',
    keywords: ['slug converter', 'text to slug', 'url slug generator', 'permalink generator', 'clean url']
  },
  {
    id: 'reading-time-estimator',
    name: 'Reading Time Estimator',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/reading-time-estimator.html',
    badge: 'Content',
    description: 'Calculate approximate reading and speaking durations with editable words-per-minute assumptions.',
    keywords: ['reading time estimator', 'reading speed', 'words per minute', 'wpm calculator']
  },
  {
    id: 'json-formatter-validator',
    name: 'JSON Formatter and Validator',
    category: 'developer',
    tier: 1,
    status: 'implemented',
    url: '/tools/json-formatter-validator.html',
    badge: 'Essential',
    description: 'Parse JSON, display actionable syntax errors, and format valid JSON with customizable indentation.',
    keywords: ['json formatter', 'json validator', 'beautify json', 'json lint', 'parse json']
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    category: 'developer',
    tier: 1,
    status: 'implemented',
    url: '/tools/json-minifier.html',
    badge: 'Developer',
    description: 'Minify only valid JSON payloads, report parse errors clearly, and compute compression savings.',
    keywords: ['json minifier', 'compress json', 'shrink json', 'minify json', 'json compact']
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder and Decoder',
    category: 'developer',
    tier: 1,
    status: 'implemented',
    url: '/tools/url-encoder-decoder.html',
    badge: 'Developer',
    description: 'Safely encode and decode URLs and query parameters using component-level percent-encoding.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'uri component', 'decode url']
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Text Encoder and Decoder',
    category: 'developer',
    tier: 1,
    status: 'implemented',
    url: '/tools/base64-encoder-decoder.html',
    badge: 'Developer',
    description: 'Encode and decode Base64 strings with UTF-8 Unicode support for emojis and international scripts.',
    keywords: ['base64 encoder', 'base64 decoder', 'utf-8 base64', 'btoa atob']
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    category: 'developer',
    tier: 1,
    status: 'implemented',
    url: '/tools/uuid-generator.html',
    badge: 'Utility',
    description: 'Generate cryptographically random RFC 4122 Version 4 UUIDs using crypto.randomUUID().',
    keywords: ['uuid generator', 'guid generator', 'random uuid', 'uuid v4']
  },

  // --- Complementary Phase 1 Implemented Tools ---
  {
    id: 'hash-generator',
    name: 'Cryptographic Hash Generator',
    category: 'security',
    tier: 1,
    status: 'implemented',
    url: '/tools/hash-generator.html',
    badge: 'Security',
    description: 'Generate secure SHA-256, SHA-512, SHA-384, and SHA-1 hashes client-side via native Web Crypto API.',
    keywords: ['hash generator', 'sha256', 'sha512', 'checksum', 'crypto hash']
  },
  {
    id: 'password-generator',
    name: 'Strong Password Generator',
    category: 'security',
    tier: 1,
    status: 'implemented',
    url: '/tools/password-generator.html',
    badge: 'Popular',
    description: 'Create cryptographically unguessable passwords with custom lengths, symbols, and entropy scoring.',
    keywords: ['password generator', 'strong password', 'secure password', 'csprng password']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage & Discount Calculator',
    category: 'calculators',
    tier: 1,
    status: 'implemented',
    url: '/tools/percentage-calculator.html',
    badge: 'Math',
    description: 'Calculate percentages of values, percentage increases/decreases, and retail sales discounts.',
    keywords: ['percentage calculator', 'discount calculator', 'percent change']
  },
  {
    id: 'age-calculator',
    name: 'Age & Date Difference Calculator',
    category: 'calculators',
    tier: 1,
    status: 'implemented',
    url: '/tools/age-calculator.html',
    badge: 'Popular',
    description: 'Calculate your exact age in years, months, and days, and find the duration between any two dates.',
    keywords: ['age calculator', 'date difference', 'days between dates', 'birthday countdown']
  },
  {
    id: 'unit-converter',
    name: 'Universal Unit Converter',
    category: 'converters',
    tier: 1,
    status: 'implemented',
    url: '/tools/unit-converter.html',
    badge: 'Everyday',
    description: 'Convert between metric and imperial units for Length, Weight, Temperature, Area, and Digital Storage.',
    keywords: ['unit converter', 'metric converter', 'length converter', 'temperature converter']
  },
  {
    id: 'color-converter',
    name: 'Color Converter & WCAG Contrast Checker',
    category: 'web-ui',
    tier: 1,
    status: 'implemented',
    url: '/tools/color-converter.html',
    badge: 'Design',
    description: 'Convert between HEX, RGB, and HSL formats with an interactive WCAG 2.1 AA/AAA contrast checker.',
    keywords: ['color converter', 'hex to rgb', 'contrast checker', 'wcag accessibility']
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown to HTML Previewer',
    category: 'developer',
    tier: 1,
    status: 'implemented',
    url: '/tools/markdown-previewer.html',
    badge: 'Productivity',
    description: 'Interactive Markdown editor with synchronized sanitized HTML rendering and export options.',
    keywords: ['markdown previewer', 'markdown to html', 'md preview', 'html exporter']
  },

  // --- Batch 1: Social Media & Link Tools (5 Tools) ---
  {
    id: 'youtube-thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    category: 'social',
    tier: 1,
    status: 'implemented',
    url: '/tools/youtube-thumbnail-downloader.html',
    badge: 'Popular',
    description: 'Extract and download HD, SD, and max-resolution thumbnail images directly from YouTube video URLs.',
    keywords: ['youtube thumbnail downloader', 'get youtube thumbnail', 'download youtube cover', 'yt thumbnail image']
  },
  {
    id: 'whatsapp-link-generator',
    name: 'WhatsApp Direct Link Generator',
    category: 'social',
    tier: 1,
    status: 'implemented',
    url: '/tools/whatsapp-link-generator.html',
    badge: 'Essential',
    description: 'Generate instant click-to-chat WhatsApp wa.me links with custom pre-filled encoded messages.',
    keywords: ['whatsapp link generator', 'wa me link', 'whatsapp click to chat', 'whatsapp url builder']
  },
  {
    id: 'mailto-link-generator',
    name: 'Mailto Link Generator',
    category: 'social',
    tier: 1,
    status: 'implemented',
    url: '/tools/mailto-link-generator.html',
    badge: 'Utility',
    description: 'Create ready-to-use mailto: URLs and HTML anchor tags with pre-populated subject, body, CC, and BCC.',
    keywords: ['mailto link generator', 'mailto url builder', 'email link generator', 'mailto html code']
  },
  {
    id: 'instagram-font-generator',
    name: 'Instagram Font Generator',
    category: 'social',
    tier: 1,
    status: 'implemented',
    url: '/tools/instagram-font-generator.html',
    badge: 'Social',
    description: 'Transform normal text into Unicode fancy fonts, cursive, gothic, bold, and aesthetic styles for social bios.',
    keywords: ['instagram font generator', 'fancy text', 'cool fonts', 'bio font changer', 'unicode styles']
  },
  {
    id: 'paypal-link-generator',
    name: 'PayPal Payment Link Generator',
    category: 'social',
    tier: 1,
    status: 'implemented',
    url: '/tools/paypal-link-generator.html',
    badge: 'Utility',
    description: 'Generate clean paypal.me payment links with optional pre-filled currency and fixed transaction amounts.',
    keywords: ['paypal link generator', 'paypal me url', 'paypal payment link', 'send money link']
  },

  // --- Batch 2: Text Tools (5 Tools) ---
  {
    id: 'text-separator',
    name: 'Text Separator & Delimiter Tool',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/text-separator.html',
    badge: 'Text Tool',
    description: 'Split or join lists and text lines using commas, pipes, semicolons, tabs, custom delimiters, or prefix/suffix.',
    keywords: ['text separator', 'comma separator', 'delimiter tool', 'join lines', 'split text']
  },
  {
    id: 'text-diff-checker',
    name: 'Text Diff Checker',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/text-diff-checker.html',
    badge: 'Essential',
    description: 'Compare two text snippets side-by-side or line-by-line with inline character additions and deletion highlights.',
    keywords: ['text diff checker', 'compare text', 'diff viewer', 'find differences', 'text comparison']
  },
  {
    id: 'email-extractor',
    name: 'Email Address Extractor',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/email-extractor.html',
    badge: 'Productivity',
    description: 'Extract, deduplicate, and sort unique email addresses from raw text, CSVs, or logs with custom delimiters.',
    keywords: ['email extractor', 'extract emails', 'find email addresses', 'scrape emails from text']
  },
  {
    id: 'url-extractor',
    name: 'URL & Link Extractor',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/url-extractor.html',
    badge: 'SEO Tool',
    description: 'Extract HTTP/HTTPS hyperlinks and domain names from messy text, HTML source code, or server logs.',
    keywords: ['url extractor', 'link extractor', 'extract hyperlinks', 'find urls in text']
  },
  {
    id: 'text-size-calculator',
    name: 'Text Byte Size Calculator',
    category: 'text',
    tier: 1,
    status: 'implemented',
    url: '/tools/text-size-calculator.html',
    badge: 'Developer',
    description: 'Measure exact text byte sizes across UTF-8, UTF-16, and ASCII encodings with bit and character counts.',
    keywords: ['text size calculator', 'byte counter', 'utf8 size', 'string byte length', 'text weight']
  },

  // --- Batch 3: Website & SEO Tools (6 Tools) ---
  {
    id: 'user-agent-parser',
    name: 'User Agent Parser & Inspector',
    category: 'seo',
    tier: 1,
    status: 'implemented',
    url: '/tools/user-agent-parser.html',
    badge: 'Inspector',
    description: 'Detect your browser User-Agent or paste any client string to parse browser name, engine, OS, and device type.',
    keywords: ['user agent parser', 'parse user agent', 'ua lookup', 'browser detection', 'device info']
  },
  {
    id: 'meta-tags-toolkit',
    name: 'Meta Tags Generator & HTML Inspector',
    category: 'seo',
    tier: 1,
    status: 'implemented',
    url: '/tools/meta-tags-toolkit.html',
    badge: 'SEO Tool',
    description: 'Generate search-ready HTML meta tags, Open Graph, and Twitter Cards, or paste source HTML to inspect existing tags.',
    keywords: ['meta tags generator', 'meta tags inspector', 'html head tags', 'seo meta maker']
  },
  {
    id: 'serp-preview-tool',
    name: 'Google SERP Snippet Simulator',
    category: 'seo',
    tier: 1,
    status: 'implemented',
    url: '/tools/serp-preview-tool.html',
    badge: 'Popular',
    description: 'Preview how your web page title, description, and URL will appear in Google desktop and mobile search results.',
    keywords: ['serp preview tool', 'google snippet preview', 'search snippet simulator', 'seo title pixel preview']
  },
  {
    id: 'open-graph-previewer',
    name: 'Open Graph & Social Share Previewer',
    category: 'seo',
    tier: 1,
    status: 'implemented',
    url: '/tools/open-graph-previewer.html',
    badge: 'SEO Tool',
    description: 'Simulate rich card link previews across Facebook, Twitter/X, and LinkedIn by parsing meta tags or custom input.',
    keywords: ['open graph previewer', 'social preview', 'twitter card preview', 'og tags tester']
  },
  {
    id: 'seo-content-analyzer',
    name: 'SEO Content & Keyword Density Analyzer',
    category: 'seo',
    tier: 1,
    status: 'implemented',
    url: '/tools/seo-content-analyzer.html',
    badge: 'Essential',
    description: 'Analyze keyword frequency, N-grams (1-3 words), heading tags, and content readability from pasted text or HTML.',
    keywords: ['seo content analyzer', 'keyword density tool', 'heading structure checker', 'on-page seo analysis']
  },
  {
    id: 'seo-compare',
    name: 'SEO Content Comparison Tool',
    category: 'seo',
    tier: 1,
    status: 'implemented',
    url: '/tools/seo-compare.html',
    badge: 'SEO Tool',
    description: 'Compare two articles or competitor web pages side-by-side across word counts, keyword densities, and reading ease.',
    keywords: ['seo compare', 'competitor content comparison', 'side by side seo', 'keyword comparison']
  },

  // --- Batch 4: Calculator Tools (5 Tools) ---
  {
    id: 'grade-calculator',
    name: 'Grade & Weighted GPA Calculator',
    category: 'calculators',
    tier: 1,
    status: 'implemented',
    url: '/tools/grade-calculator.html',
    badge: 'Academic',
    description: 'Calculate weighted assignment grades, semester GPAs, and compute required scores for final exams.',
    keywords: ['grade calculator', 'gpa calculator', 'weighted grade calculator', 'final grade needed']
  },
  {
    id: 'age-difference-calculator',
    name: 'Age Difference Calculator',
    category: 'calculators',
    tier: 1,
    status: 'implemented',
    url: '/tools/age-difference-calculator.html',
    badge: 'Everyday',
    description: 'Calculate the exact age difference between two people or dates in calendar years, months, weeks, and days.',
    keywords: ['age difference calculator', 'compare ages', 'time difference between birthdays', 'date difference']
  },
  {
    id: 'birthday-calculator',
    name: 'Birthday & Milestone Countdown Calculator',
    category: 'calculators',
    tier: 1,
    status: 'implemented',
    url: '/tools/birthday-calculator.html',
    badge: 'Everyday',
    description: 'Count down to your upcoming birthday, view day of birth, half-birthday, zodiac sign, and age in seconds.',
    keywords: ['birthday calculator', 'birthday countdown', 'days until birthday', 'zodiac calculator', 'day of birth']
  },
  {
    id: 'youtube-money-calculator',
    name: 'YouTube Revenue & CPM Estimator',
    category: 'calculators',
    tier: 1,
    status: 'implemented',
    url: '/tools/youtube-money-calculator.html',
    badge: 'Finance',
    description: 'Estimate daily, monthly, and annual YouTube creator ad earnings based on daily views and CPM/RPM brackets.',
    keywords: ['youtube money calculator', 'youtube earnings estimator', 'cpm calculator', 'youtube ad revenue']
  },
  {
    id: 'phone-number-validator',
    name: 'Phone Number Syntax Validator & Normalizer',
    category: 'calculators',
    tier: 1,
    status: 'implemented',
    url: '/tools/phone-number-validator.html',
    badge: 'Utility',
    description: 'Validate international E.164 and national phone number formatting, strip noise, and detect ITU-T country codes.',
    keywords: ['phone number validator', 'e164 formatter', 'phone format checker', 'international phone cleaner']
  },

  // --- Batch 5: Image Tools (6 Tools) ---
  {
    id: 'image-editor',
    name: 'Online Canvas Image Editor',
    category: 'images',
    tier: 1,
    status: 'implemented',
    url: '/tools/image-editor.html',
    badge: 'Essential',
    description: 'Crop, rotate, flip, and fine-tune brightness, contrast, and saturation directly in browser with PNG/JPG export.',
    keywords: ['online image editor', 'crop image', 'rotate picture', 'canvas photo editor', 'adjust image brightness']
  },
  {
    id: 'image-converter',
    name: 'Image Format Converter',
    category: 'images',
    tier: 1,
    status: 'implemented',
    url: '/tools/image-converter.html',
    badge: 'Popular',
    description: 'Convert images instantly between PNG, JPEG, and WebP formats with adjustable compression quality settings.',
    keywords: ['image converter', 'png to jpg', 'jpg to webp', 'convert photo', 'client-side image converter']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor & Optimizer',
    category: 'images',
    tier: 1,
    status: 'implemented',
    url: '/tools/image-compressor.html',
    badge: 'Popular',
    description: 'Compress and resize JPEG, WebP, and PNG photos to reduce file size with real-time compression savings metrics.',
    keywords: ['image compressor', 'compress photo', 'reduce image size', 'optimize image', 'shrink picture']
  },
  {
    id: 'exif-reader',
    name: 'EXIF Metadata Reader & Privacy Scrubber',
    category: 'images',
    tier: 1,
    status: 'implemented',
    url: '/tools/exif-reader.html',
    badge: 'Security',
    description: 'Inspect camera model, exposure settings, timestamps, and GPS coordinates embedded in photos, or strip metadata.',
    keywords: ['exif reader', 'view exif metadata', 'strip exif', 'remove gps from photo', 'camera info inspector']
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator & HTML Packager',
    category: 'images',
    tier: 1,
    status: 'implemented',
    url: '/tools/favicon-generator.html',
    badge: 'Developer',
    description: 'Generate standard 16x16, 32x32, 48x48, and 180x180 Apple touch icons with ready-to-paste HTML link tags.',
    keywords: ['favicon generator', 'make favicon', 'apple touch icon maker', 'ico png generator']
  },
  {
    id: 'qr-code-generator',
    name: 'Custom QR Code Generator',
    category: 'images',
    tier: 1,
    status: 'implemented',
    url: '/tools/qr-code-generator.html',
    badge: 'Popular',
    description: 'Create customizable QR codes for URLs, text, Wi-Fi networks, and contact vCards with PNG and SVG export.',
    keywords: ['qr code generator', 'make qr code', 'wifi qr code', 'free qr maker', 'svg qr code']
  },

  // --- Batch 6: PDF Tools (5 Tools) ---
  {
    id: 'pdf-converter',
    name: 'Image to PDF Document Converter',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-converter.html',
    badge: 'Popular',
    description: 'Convert multiple JPEG or PNG images into a clean, paginated PDF document with custom margins and orientations.',
    keywords: ['pdf converter', 'jpg to pdf', 'images to pdf', 'convert photo to pdf', 'picture to document']
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF Document Online',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/sign-pdf.html',
    badge: 'Essential',
    description: 'Draw, type, or upload your handwritten signature and permanently stamp it onto any page and coordinates of a PDF.',
    keywords: ['sign pdf', 'add signature to pdf', 'e-sign pdf', 'pdf signature tool', 'stamp pdf']
  },
  {
    id: 'pdf-editor',
    name: 'PDF Visual Annotation & Redaction Editor',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-editor.html',
    badge: 'PDF Tool',
    description: 'Add text annotations, highlight important clauses, and black out private numbers on any PDF page.',
    keywords: ['pdf editor', 'annotate pdf', 'redact pdf', 'black out pdf text', 'add text to pdf']
  },
  {
    id: 'pdf-maker',
    name: 'Text & Markdown to PDF Maker',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-maker.html',
    badge: 'Productivity',
    description: 'Compose formatted text and Markdown documents and generate downloadable paginated PDF files instantly.',
    keywords: ['pdf maker', 'create pdf', 'text to pdf', 'markdown to pdf', 'generate pdf file']
  },
  {
    id: 'pdf-text-extractor',
    name: 'PDF Text Stream Extractor',
    category: 'pdf',
    tier: 2,
    status: 'implemented',
    url: '/tools/pdf-text-extractor.html',
    badge: 'PDF Tool',
    description: 'Extract raw selectable text, filter whitespace, search keywords, and export to TXT from digital PDF files.',
    keywords: ['pdf text extractor', 'extract text from pdf', 'pdf to txt', 'copy text from pdf']
  },

  // --- Batch 7: Video Tools (3 Tools) ---
  {
    id: 'extract-audio-from-video',
    name: 'Extract Audio from Video',
    category: 'video',
    tier: 1,
    status: 'implemented',
    url: '/tools/extract-audio-from-video.html',
    badge: 'Media',
    description: 'Extract high-fidelity uncompressed 16-bit PCM WAV audio tracks from MP4, WebM, and MKV video files in browser.',
    keywords: ['extract audio from video', 'video to wav', 'rip sound from video', 'video audio extractor']
  },
  {
    id: 'video-to-gif',
    name: 'Video to Animated GIF Converter',
    category: 'video',
    tier: 1,
    status: 'implemented',
    url: '/tools/video-to-gif.html',
    badge: 'Popular',
    description: 'Convert short MP4 or WebM video clips into animated GIFs with customizable frame rate, resolution, and quality.',
    keywords: ['video to gif', 'make gif from video', 'mp4 to gif', 'animated gif maker', 'video clip to gif']
  },
  {
    id: 'video-converter',
    name: 'Video Transcoder & Downscaler',
    category: 'video',
    tier: 1,
    status: 'implemented',
    url: '/tools/video-converter.html',
    badge: 'Media',
    description: 'Transcode, re-encode, and downscale videos to 1080p, 720p, or 480p WebM/MP4 using HTML5 Canvas & MediaRecorder.',
    keywords: ['video converter', 'resize video', 'transcode video', 'downscale video', 'webm converter']
  },
  // --- Freight & Shipping Calculator Suite (5 Tools) ---
  {
    id: 'cbm-calculator',
    name: 'CBM Calculator',
    category: 'logistics',
    categories: ['logistics', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/cbm-calculator.html',
    badge: 'Popular',
    description: 'Calculate total Cubic Meters (CBM), Cubic Feet, Gross Weight, and estimated 20ft/40ft container fill % for ocean and air cargo.',
    keywords: ['cbm calculator', 'cubic meter calculator', 'freight cbm', 'cbm to cft', 'cargo volume calculator', 'shipping volume', 'ocean freight cbm', 'logistics']
  },
  {
    id: 'volumetric-weight-calculator',
    name: 'Volumetric Weight Calculator',
    category: 'logistics',
    categories: ['logistics', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/volumetric-weight-calculator.html',
    badge: 'Essential',
    description: 'Calculate dimensional (DIM) weight for Air Freight (IATA 6000), Express Couriers (DHL, FedEx, UPS 5000), and Road Freight.',
    keywords: ['volumetric weight calculator', 'dim weight calculator', 'dimensional weight', 'air freight weight', 'dhl volumetric weight', 'fedex dimensional weight', 'iata dim factor', 'courier weight']
  },
  {
    id: 'chargeable-weight-calculator',
    name: 'Chargeable Weight Calculator',
    category: 'logistics',
    categories: ['logistics', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/chargeable-weight-calculator.html',
    badge: 'Popular',
    description: 'Determine billable freight weight for Air Cargo (Gross vs. Volumetric with 0.5 kg rounding) and Sea Freight (LCL W/M Revenue Tons).',
    keywords: ['chargeable weight calculator', 'billable weight', 'air freight chargeable weight', 'lcl weight or measurement', 'w/m calculator', 'revenue tons', 'gross vs volumetric']
  },
  {
    id: 'container-loading-calculator',
    name: 'Container Loading Calculator',
    category: 'logistics',
    categories: ['logistics', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/container-loading-calculator.html',
    badge: 'Logistics',
    description: 'Estimate cargo volume and payload utilization for 20\'GP, 40\'GP, and 40\'HC shipping containers with packing efficiency buffers.',
    keywords: ['container loading calculator', 'how many boxes fit in a container', '20ft container capacity', '40ft container capacity', 'container volume utilization', 'stuffing calculator']
  },
  {
    id: 'pallet-calculator',
    name: 'Pallet Calculator & 2D Layout',
    category: 'logistics',
    categories: ['logistics', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/pallet-calculator.html',
    badge: 'Logistics',
    description: 'Calculate boxes per pallet, stacking layers, total pallets needed, and render an interactive 2D top-down pallet loading layout diagram.',
    keywords: ['pallet calculator', 'pallet pattern generator', 'pallet layout', 'euro pallet capacity', 'boxes per pallet', 'gma pallet calculator', 'pallet stacking height']
  },
  // --- Quilting & Sewing Calculator Suite (5 Tools) ---
  {
    id: 'quilt-backing-calculator',
    name: 'Quilt Backing Calculator',
    category: 'crafts',
    categories: ['crafts', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/quilt-backing-calculator.html',
    badge: 'Popular',
    description: 'Calculate fabric yardage, compare vertical vs. horizontal pieced seams to minimize waste, and view a 2D cutting diagram.',
    keywords: ['quilt backing calculator', 'quilt backing yardage', 'quilt backing seams', 'how much fabric for quilt back', 'quilt backing cuts', 'quilting calculator', 'sewing yardage', 'crafts']
  },
  {
    id: 'quilt-binding-calculator',
    name: 'Quilt Binding Calculator',
    category: 'crafts',
    categories: ['crafts', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/quilt-binding-calculator.html',
    badge: 'Essential',
    description: 'Calculate total binding length, strips needed for Straight-Grain WOF, or square dimensions for Continuous Bias binding.',
    keywords: ['quilt binding calculator', 'continuous bias binding', 'binding strips', 'quilt binding yardage', 'mitered binding', 'sewing binding', 'crafts']
  },
  {
    id: 'fabric-yardage-calculator',
    name: 'Fabric Yardage Calculator',
    category: 'crafts',
    categories: ['crafts', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/fabric-yardage-calculator.html',
    badge: 'Popular',
    description: 'Calculate total linear fabric yardage for multi-piece pattern cutting layouts with bolt width packing and 2D visual layout.',
    keywords: ['fabric yardage calculator', 'pattern yardage calculator', 'fabric cutting layout', 'how much fabric do i need', 'fabric estimator', 'sewing yardage', 'crafts']
  },
  {
    id: 'curtain-fabric-calculator',
    name: 'Curtain Fabric Calculator',
    category: 'crafts',
    categories: ['crafts', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/curtain-fabric-calculator.html',
    badge: 'Crafts',
    description: 'Calculate fabric yardage and widths for single or paired curtain panels based on rod width, finished drop, fullness, and pattern repeat.',
    keywords: ['curtain fabric calculator', 'drapery fabric calculator', 'curtain yardage', 'curtain fullness calculator', 'how much fabric for curtains', 'curtain drop and hems', 'crafts']
  },
  {
    id: 'fabric-shrinkage-calculator',
    name: 'Fabric Shrinkage Calculator',
    category: 'crafts',
    categories: ['crafts', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/fabric-shrinkage-calculator.html',
    badge: 'Crafts',
    description: 'Calculate fabric shrinkage percentage from test swatches and determine pre-wash yardage allowances to ensure accurate finished sizing.',
    keywords: ['fabric shrinkage calculator', 'calculate fabric shrinkage', 'pre-wash fabric allowance', 'cotton shrinkage percentage', 'linen shrinkage', 'sewing shrinkage', 'crafts']
  },
  // --- Baking & Coffee Calculator Suite (5 Tools) ---
  {
    id: 'pizza-dough-calculator',
    name: 'Pizza Dough Calculator',
    category: 'food',
    categories: ['food', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/pizza-dough-calculator.html',
    badge: 'Popular',
    description: 'Calculate exact pizza dough ingredient weights, hydration %, ball sizes, and baker\'s percentages for Neapolitan, NY, and Detroit styles.',
    keywords: ['pizza dough calculator', 'pizza dough recipe', 'bakers percentage pizza', 'neapolitan pizza dough', 'ny pizza calculator', 'pizza hydration', 'dough ball weight', 'baking']
  },
  {
    id: 'sourdough-hydration-calculator',
    name: 'Sourdough Hydration Calculator',
    category: 'food',
    categories: ['food', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/sourdough-hydration-calculator.html',
    badge: 'Essential',
    description: 'Calculate true total dough hydration, starter flour/water splits, inoculation rate, and salt % for artisan sourdough loaves.',
    keywords: ['sourdough hydration calculator', 'sourdough water percentage', 'bakers percentage sourdough', 'starter hydration split', 'true dough hydration', 'artisan bread calculator']
  },
  {
    id: 'bakers-percentage-calculator',
    name: 'Baker\'s Percentage Calculator',
    category: 'food',
    categories: ['food', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/bakers-percentage-calculator.html',
    badge: 'Popular',
    description: 'Convert recipe weights to Baker\'s Percentages (100% flour base) or compute exact ingredient weights from custom percentages.',
    keywords: ['bakers percentage calculator', 'bakers math', 'flour base percentage', 'bread formula calculator', 'bakers ratio', 'baking percentages']
  },
  {
    id: 'bread-recipe-scaler',
    name: 'Bread Recipe Scaler',
    category: 'food',
    categories: ['food', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/bread-recipe-scaler.html',
    badge: 'Kitchen',
    description: 'Scale bread recipes by multiplier, target loaf count, or available flour weight with an interactive kitchen checklist mode.',
    keywords: ['bread recipe scaler', 'scale baking recipe', 'resize bread recipe', 'loaf batch calculator', 'baking scaler', 'recipe multiplier']
  },
  {
    id: 'coffee-to-water-ratio-calculator',
    name: 'Coffee-to-Water Ratio Calculator',
    category: 'food',
    categories: ['food', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/coffee-to-water-ratio-calculator.html',
    badge: 'Essential',
    description: 'Calculate coffee grounds and water weights for Pour-Over, French Press, AeroPress, Cold Brew, and Espresso with step-by-step bloom guides.',
    keywords: ['coffee to water ratio calculator', 'coffee brew ratio', 'v60 coffee ratio', 'french press ratio', 'aeropress ratio', 'coffee calculator grams', 'bloom timer']
  },
  // --- 3D Printing Calculator Suite (4 Tools) ---
  {
    id: '3d-print-cost-calculator',
    name: '3D Print Cost Calculator',
    category: 'printing',
    categories: ['printing', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/3d-print-cost-calculator.html',
    badge: 'Popular',
    description: 'Calculate true production costs for 3D prints including multi-material filament, electricity, labor, machine wear, failure buffer, and markup pricing.',
    keywords: ['3d print cost calculator', 'calculate 3d print price', '3d printing pricing calculator', 'filament cost', 'print farm costing', 'etsy 3d print profit', '3d printing']
  },
  {
    id: 'filament-remaining-calculator',
    name: 'Filament Remaining Calculator',
    category: 'printing',
    categories: ['printing', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/filament-remaining-calculator.html',
    badge: 'Essential',
    description: 'Determine leftover filament weight and length on a spool using digital scale tare presets or ruler measurements, with a "Can I Print This?" slicer checker.',
    keywords: ['filament remaining calculator', 'spool weight calculator', 'empty spool tare weight', 'how much filament left', 'can i print this', 'bambu empty spool weight', '3d printing']
  },
  {
    id: 'filament-length-calculator',
    name: 'Filament Length Calculator',
    category: 'printing',
    categories: ['printing', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/filament-length-calculator.html',
    badge: '3D Print',
    description: 'Two-way converter between 3D printing filament weight (grams) and length (meters/feet) for 1.75mm and 2.85mm across all standard polymer densities.',
    keywords: ['filament length calculator', 'filament weight to length', 'meters per kg filament', '1.75mm filament length', 'filament volume to weight', 'pla length per kg', '3d printing']
  },
  {
    id: 'multi-color-waste-calculator',
    name: 'Multi-Color Waste Calculator',
    category: 'printing',
    categories: ['printing', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/multi-color-waste-calculator.html',
    badge: 'Popular',
    description: 'Calculate flush purge waste weight, prime tower volume, and extra cost for multi-color 3D prints (Bambu AMS, Prusa MMU) with batch plate optimization insights.',
    keywords: ['multi color waste calculator', 'bambu ams flush waste', 'purge poop calculator', 'purge tower weight', 'multi material 3d print waste', 'bambu purge waste calculator', '3d printing']
  },
  // --- Solar & Battery Calculator Suite (4 Tools) ---
  {
    id: 'battery-runtime-calculator',
    name: 'Battery Runtime Calculator',
    category: 'solar',
    categories: ['solar', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/battery-runtime-calculator.html',
    badge: 'Popular',
    description: 'Calculate battery backup runtime in hours and minutes for 12V, 24V, and 48V banks across Lead-Acid, AGM, and LiFePO4 chemistries with inverter efficiency.',
    keywords: ['battery runtime calculator', 'how long will battery last', 'inverter battery runtime', '12v battery backup time', 'ah to runtime', 'lifepo4 battery runtime', 'solar']
  },
  {
    id: 'inverter-backup-calculator',
    name: 'Inverter Backup Calculator',
    category: 'solar',
    categories: ['solar', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/inverter-backup-calculator.html',
    badge: 'Essential',
    description: 'Size your home inverter and battery bank based on appliance wattage, desired backup hours, and system voltage with an interactive load builder.',
    keywords: ['inverter backup calculator', 'inverter capacity calculator', 'how many ah battery for inverter', 'home ups calculator', 'inverter va rating', 'solar']
  },
  {
    id: 'solar-panel-size-calculator',
    name: 'Solar Panel Size Calculator',
    category: 'solar',
    categories: ['solar', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/solar-panel-size-calculator.html',
    badge: 'Solar',
    description: 'Calculate required solar system size (kW), number of solar panels, and roof space based on monthly electricity consumption or daily watt-hours.',
    keywords: ['solar panel size calculator', 'how many solar panels do i need', 'solar kw calculator', 'rooftop solar size', 'off grid solar calculator', 'solar']
  },
  {
    id: 'generator-size-calculator',
    name: 'Generator Size Calculator',
    category: 'solar',
    categories: ['solar', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/generator-size-calculator.html',
    badge: 'Power',
    description: 'Determine required generator size (kW and kVA) based on running watts and starting surge wattage of home appliances with motor startup safety margins.',
    keywords: ['generator size calculator', 'what size generator do i need', 'generator wattage calculator', 'running vs surge watts', 'whole house generator size', 'solar']
  },
  // --- Aquarium Calculator Suite (4 Tools) ---
  {
    id: 'aquarium-volume-calculator',
    name: 'Aquarium Volume Calculator',
    category: 'aquarium',
    categories: ['aquarium', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/aquarium-volume-calculator.html',
    badge: 'Popular',
    description: 'Calculate gross and real-world net water volume for rectangular, bowfront, cylinder, hexagonal, and corner fish tanks with filled weight and substrate calculations.',
    keywords: ['aquarium volume calculator', 'fish tank gallon calculator', 'how many gallons is my tank', 'tank water volume liters', 'aquarium weight calculator', 'substrate calculator', 'aquarium', 'pets']
  },
  {
    id: 'aquarium-heater-calculator',
    name: 'Aquarium Heater Calculator',
    category: 'aquarium',
    categories: ['aquarium', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/aquarium-heater-calculator.html',
    badge: 'Essential',
    description: 'Determine required aquarium heater wattage based on tank volume, room ambient temperature, target water temp, and rimless open-top heat loss.',
    keywords: ['aquarium heater calculator', 'fish tank heater size', 'what size heater for aquarium', 'heater wattage calculator', 'aquarium temperature', 'dual heater', 'aquarium', 'pets']
  },
  {
    id: 'aquarium-water-change-calculator',
    name: 'Aquarium Water Change Calculator',
    category: 'aquarium',
    categories: ['aquarium', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/aquarium-water-change-calculator.html',
    badge: 'Care',
    description: 'Calculate exact water change volume, 5-gallon bucket counts, water conditioner dechlorinator dosing (Prime, API), and post-change nitrate levels.',
    keywords: ['aquarium water change calculator', 'how much water to change', 'seachem prime dosage calculator', 'dechlorinator calculator', 'nitrate calculator', 'bucket count', 'aquarium', 'pets']
  },
  {
    id: 'aquarium-stocking-calculator',
    name: 'Aquarium Stocking Calculator',
    category: 'aquarium',
    categories: ['aquarium', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/aquarium-stocking-calculator.html',
    badge: 'Guide',
    description: 'Check fish stocking capacity, bioload percentage, schooling group minimums, and species temperature compatibility across 35+ popular aquarium fish and invertebrates.',
    keywords: ['aquarium stocking calculator', 'how many fish in tank', 'bioload calculator', 'fish compatibility calculator', 'can i add more fish', 'tank stocking guide', 'aquarium', 'pets']
  },
  {
    id: 'image-dpi-checker',
    name: 'Image DPI & Metadata Checker',
    category: 'pod',
    categories: ['pod', 'web-ui', 'images'],
    tier: 1,
    status: 'implemented',
    url: '/tools/image-dpi-checker.html',
    badge: 'Popular',
    description: 'Upload PNG/JPG/WebP images to instantly read pixel dimensions, embedded DPI metadata, transparency/alpha detection, and max sharp print size at 300 DPI. Batch up to 25 files. Fix DPI metadata with one click.',
    keywords: ['image dpi checker', 'check image dpi', 'photo dpi checker', 'print dpi calculator', 'png dpi', 'jpg dpi', 'image resolution checker', 'printful dpi', 'printify dpi', 'pod image checker', 'transparent background checker', 'artwork dpi']
  },
  {
    id: 'pixels-to-inches-calculator',
    name: 'Pixels to Inches & Print Size Calculator',
    category: 'pod',
    categories: ['pod', 'web-ui', 'calculators'],
    tier: 1,
    status: 'implemented',
    url: '/tools/pixels-to-inches-calculator.html',
    badge: 'Essential',
    description: 'Convert pixels to inches, cm, and mm at any DPI, or calculate required pixel canvas dimensions from a target print size. Quick presets for common poster, photo, and POD product sizes.',
    keywords: ['pixels to inches', 'pixels to inches calculator', 'pixels to cm', 'print size calculator', 'dpi calculator', 'canvas size calculator', 'photoshop canvas size', 'procreate canvas size', 'poster pixel dimensions', '300 dpi pixels']
  },
  {
    id: '300-dpi-print-size-checker',
    name: '300 DPI POD Product Readiness Checker',
    category: 'pod',
    categories: ['pod', 'web-ui', 'images'],
    tier: 1,
    status: 'implemented',
    url: '/tools/300-dpi-print-size-checker.html',
    badge: 'Popular',
    description: 'Upload artwork or enter pixel dimensions to instantly check readiness across 20+ POD products (T-shirts, mugs, posters, phone cases). Color-coded DPI badges for Printful, Printify, Merch by Amazon, and Etsy.',
    keywords: ['print on demand checker', 'printful image size checker', 'printify dpi checker', 'merch by amazon image size', 'pod product readiness', '300 dpi check', 't-shirt print size', 'mug wrap size', 'poster dpi check', 'etsy digital download size']
  },
  {
    id: 'print-resolution-report',
    name: 'Print Resolution & Aspect Ratio Report',
    category: 'pod',
    categories: ['pod', 'web-ui', 'images'],
    tier: 1,
    status: 'implemented',
    url: '/tools/print-resolution-report.html',
    badge: 'Guide',
    description: 'Generate a full Etsy wall art audit across all 5 standard printable ratios (2:3, 3:4, 4:5, ISO A-series, 11x14"). Interactive loupe previewer and copyable Etsy listing size chart generator.',
    keywords: ['etsy printable size chart', 'etsy digital download aspect ratio', 'wall art print ratios', 'etsy listing size guide', 'print resolution report', '2:3 ratio print size', 'a4 print size pixels', 'etsy seller print calculator', 'iso a series print size']
  },
  {
    id: 'short-form-safe-zone-checker',
    name: 'All-in-One Short-Form Safe-Zone Checker',
    category: 'social',
    categories: ['social', 'video'],
    tier: 1,
    status: 'implemented',
    url: '/tools/short-form-safe-zone-checker.html',
    badge: 'Popular',
    description: 'Preview short-form video & images against TikTok, Reels, and YouTube Shorts UI overlays. Switch CAD danger zones, test caption overlaps, and download 1080x1920 transparent PNG templates.',
    keywords: ['short form safe zone checker', 'tiktok safe zone', 'reels safe zone', 'shorts safe zone', 'video safe zone template', 'capcut safe zone png', 'premiere pro safe zone 9 16', 'safe area 1080 1920', 'social', 'video']
  },
  {
    id: 'tiktok-safe-zone-checker',
    name: 'TikTok Safe-Zone Preview & Template Generator',
    category: 'social',
    categories: ['social', 'video'],
    tier: 1,
    status: 'implemented',
    url: '/tools/tiktok-safe-zone-checker.html',
    badge: 'Popular',
    description: 'Interactive TikTok 9:16 video simulator with authentic UI HUD, Spark Ad Shop CTA button preview, customizable live captions, and 1080x1920 transparent PNG template export.',
    keywords: ['tiktok safe zone checker', 'tiktok safe area guide', 'tiktok ad safe zone', 'tiktok shop cta safe area', 'tiktok safe zone overlay png', 'tiktok video previewer', 'social', 'video']
  },
  {
    id: 'instagram-reels-safe-zone-checker',
    name: 'Instagram Reels & 4:5 Grid Safe-Zone Checker',
    category: 'social',
    categories: ['social', 'video'],
    tier: 1,
    status: 'implemented',
    url: '/tools/instagram-reels-safe-zone-checker.html',
    badge: 'Essential',
    description: 'Test 9:16 Instagram Reels videos and images against Reels HUD overlays and 4:5 (1080x1350) and 1:1 profile grid crop boxes so your cover titles never get cut off.',
    keywords: ['instagram reels safe zone', 'reels 4 5 grid crop preview', 'reels profile grid safe area', 'instagram safe zone template', 'reels cover safe zone', 'reels overlay png', 'social', 'video']
  },
  {
    id: 'youtube-shorts-safe-zone-checker',
    name: 'YouTube Shorts Safe-Zone Preview',
    category: 'social',
    categories: ['social', 'video'],
    tier: 1,
    status: 'implemented',
    url: '/tools/youtube-shorts-safe-zone-checker.html',
    badge: 'Guide',
    description: 'Test YouTube Shorts videos against authentic mobile full-screen and desktop theater HUD overlays. Check Subscribe button, sound remixes, and download 1080x1920 overlay guides.',
    keywords: ['youtube shorts safe zone', 'shorts safe area template', 'youtube shorts overlay png', 'shorts subscribe button safe zone', 'youtube shorts title safe area', 'social', 'video']
  },
  {
    id: 'youtube-chapter-formatter',
    name: 'YouTube Chapter Formatter & Timestamp Validator',
    category: 'social',
    categories: ['social', 'video'],
    tier: 1,
    status: 'implemented',
    url: '/tools/youtube-chapter-formatter.html',
    badge: 'Popular',
    description: 'Format, validate, and time-shift YouTube chapters. Checks the 0:00 start rule, 3+ chapters, and 10s duration rule with a live interactive YouTube scrubber preview.',
    keywords: ['youtube chapter formatter', 'youtube timestamp generator', 'youtube chapter validator', 'youtube description chapters', 'video timestamp formatter', 'youtube video chapters', 'social', 'video']
  },
  {
    id: 'ppp-price-calculator',
    name: 'Purchasing Power Parity (PPP) SaaS Price Calculator',
    category: 'calculators',
    categories: ['calculators', 'seo', 'developer'],
    tier: 1,
    status: 'implemented',
    url: '/tools/ppp-price-calculator.html',
    badge: 'Popular',
    description: 'Calculate localized purchasing power parity (PPP) prices for SaaS, digital downloads, and courses across 150+ countries with 4-tier regional pricing and 1-click JSON/CSV exports.',
    keywords: ['ppp price calculator', 'purchasing power parity pricing', 'saas ppp calculator', 'parity pricing generator', 'localized pricing tool', 'stripe ppp pricing', 'global pricing calculator', 'calculators', 'business', 'saas']
  },
  {
    id: 'discord-twitch-emoji-resizer',
    name: 'Discord & Twitch Custom Emoji & Emote Resizer',
    category: 'images',
    categories: ['images', 'social'],
    tier: 1,
    status: 'implemented',
    url: '/tools/discord-twitch-emoji-resizer.html',
    badge: 'Essential',
    description: 'Resize, auto-crop, trim transparent margins, add sticker white outlines, and optimize Discord custom emojis (128px), stickers (320px), and Twitch emotes (112/56/28px) with live dark/light chat previews.',
    keywords: ['discord emoji resizer', 'twitch emote resizer', 'custom emote maker', 'discord sticker converter', 'twitch sub badge resizer', 'emoji transparent trim', 'discord chat previewer', 'images', 'social']
  },
  {
    id: 'voiceover-script-timer',
    name: 'Voiceover & Podcast Script Runtime Timer & Rate Calculator',
    category: 'text',
    categories: ['text', 'video'],
    tier: 1,
    status: 'implemented',
    url: '/tools/voiceover-script-timer.html',
    badge: 'Popular',
    description: 'Accurately time voiceover, commercial, and podcast scripts. Accounts for speaking speed (WPM), natural punctuation pauses, and direction tags with a broadcast ad slot checker and client rate calculator.',
    keywords: ['voiceover script timer', 'script duration calculator', 'podcast script timer', 'wpm speech timer', 'script word count timer', 'voice actor rate calculator', 'commercial ad slot timer', 'teleprompter practice', 'text', 'video']
  },
  {
    id: 'readme-badge-builder',
    name: 'GitHub README & Notion Badge Builder',
    category: 'developer',
    categories: ['developer', 'text'],
    tier: 1,
    status: 'implemented',
    url: '/tools/readme-badge-builder.html',
    badge: 'Popular',
    description: 'Create aesthetic GitHub README badges, Notion unicode progress bars, and GitHub alert callouts with 40+ tech stack logos, custom styles, and 1-click Markdown copy.',
    keywords: ['github readme badge generator', 'notion progress bar generator', 'markdown badge maker', 'shields io badge builder', 'github profile readme badges', 'tech stack badge generator', 'notion callout generator', 'developer', 'text']
  },
  {
    id: 'freelance-fee-reverse-calculator',
    name: 'Cross-Border Freelance & Creator Fee Reverse Calculator',
    category: 'calculators',
    categories: ['calculators', 'seo', 'developer'],
    tier: 1,
    status: 'implemented',
    url: '/tools/freelance-fee-reverse-calculator.html',
    badge: 'Popular',
    description: 'Calculate exact cross-border client invoices to guarantee your target take-home pay. Reverse-engineers PayPal, Stripe, Wise, Payoneer, and Gumroad deductions, hidden FX spread markups, and GST/VAT fees.',
    keywords: ['freelance fee reverse calculator', 'paypal fee calculator international', 'stripe international fee calculator', 'wise vs paypal freelance', 'freelancer invoice calculator', 'cross border payment fee calculator', 'creator payout fee reverse calculator', 'calculators', 'business', 'finance']
  },
  {
    id: 'newsletter-sponsorship-calculator',
    name: 'Newsletter Sponsorship & CPM Rate Calculator',
    category: 'calculators',
    categories: ['calculators', 'social', 'seo'],
    tier: 1,
    status: 'implemented',
    url: '/tools/newsletter-sponsorship-calculator.html',
    badge: 'Popular',
    description: 'Calculate fair newsletter ad slot rates based on subscribers, open rates, and niche CPM benchmarks. Includes reverse sponsor offer evaluation, multi-issue bundle discounts, and 1-click media-kit pitch export.',
    keywords: ['newsletter sponsorship calculator', 'newsletter cpm calculator', 'substack ad rate calculator', 'beehiiv sponsorship calculator', 'newsletter rate card generator', 'email ad pricing calculator', 'sponsor pitch snippet generator', 'calculators', 'social', 'marketing']
  },
  {
    id: 'css-bento-mesh-glass-generator',
    name: 'CSS Bento Grid, Mesh Gradient & Glassmorphism Generator',
    category: 'web-ui',
    categories: ['web-ui', 'developer'],
    tier: 1,
    status: 'implemented',
    url: '/tools/css-bento-mesh-glass-generator.html',
    badge: 'Popular',
    description: 'Visually design interactive CSS Bento Grids, multi-layer radial mesh gradients, and glassmorphic UI components with live responsive previews and 1-click Tailwind, CSS & React JSX exports.',
    keywords: ['css bento grid generator', 'mesh gradient generator', 'glassmorphism generator', 'tailwind bento grid', 'glassmorphic css generator', 'radial mesh gradient css', 'react bento grid builder', 'web-ui', 'developer', 'design']
  },
  {
    id: 'reseller-profit-calculator',
    name: 'Reseller Profit & Fee Calculator (Poshmark, Mercari, eBay, Depop & Vinted)',
    category: 'calculators',
    categories: ['calculators', 'social', 'seo'],
    tier: 1,
    status: 'implemented',
    url: '/tools/reseller-profit-calculator.html',
    badge: 'Popular',
    description: 'Calculate net profit, payout, ROI, and profit margins across Poshmark, Mercari, Vinted, eBay, and Depop. Includes reverse target pricing, shipping presets, and side-by-side cross-listing fee comparison.',
    keywords: ['reseller profit calculator', 'poshmark fee calculator', 'mercari profit calculator', 'ebay fee calculator', 'depop fee calculator', 'vinted profit calculator', 'cross listing profit comparison', 'thrift flip calculator', 'calculators', 'business', 'ecommerce']
  },
  {
    id: 'favicon-manifest-generator',
    name: 'Complete Favicon & Web App Manifest Pack Generator',
    category: 'images',
    categories: ['images', 'developer'],
    tier: 1,
    status: 'implemented',
    url: '/tools/favicon-manifest-generator.html',
    badge: 'Essential',
    description: 'Generate complete modern favicon packs: multi-resolution favicon.ico (16/32/48px), Apple Touch icon (180px), Android PWA maskable icons (192/512px), valid site.webmanifest, and ready-to-use ZIP download.',
    keywords: ['favicon generator', 'web manifest generator', 'pwa icon generator', 'apple touch icon generator', 'favicon ico maker', 'maskable icon builder', 'site webmanifest generator', 'images', 'developer']
  },
  {
    id: 'json-ld-schema-generator',
    name: 'JSON-LD Schema Markup Generator for Google Rich Snippets',
    category: 'seo',
    categories: ['seo', 'developer'],
    tier: 1,
    status: 'implemented',
    url: '/tools/json-ld-schema-generator.html',
    badge: 'Popular',
    description: 'Generate structured JSON-LD schema markup for Google Rich Snippets with instant SERP preview and missing-property validation.',
    keywords: ['json ld generator', 'schema markup generator', 'google rich snippets generator', 'faq schema generator', 'local business schema', 'howto schema builder', 'product schema rating', 'breadcrumb schema maker', 'seo structured data', 'seo', 'developer']
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TOOL_CATEGORIES, TOOLS_DATABASE };
}
