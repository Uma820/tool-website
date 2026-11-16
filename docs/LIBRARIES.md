# Project Third-Party Client-Side Libraries

This document tracks all external open-source libraries incorporated into **Free Online Tools**, along with their version, license, source, and intended purpose.

---

## 1. `pdf-lib`

* **Library Name:** `pdf-lib`
* **Version:** `1.17.1`
* **Author / Maintainer:** Andrew Dillon (Hopding)
* **License:** MIT License (Permissive open source; allows distribution, modification, private, and commercial use with attribution).
* **Source Repository:** [https://github.com/Hopding/pdf-lib](https://github.com/Hopding/pdf-lib)
* **Local Location:** `/assets/vendor/pdf-lib.min.js` (Self-hosted locally; zero third-party CDN dependency).
* **Bundle Size:** ~512 KB uncompressed (~130 KB gzipped via `.htaccess`).
* **Loading Policy:** Loaded **only** on specific PDF tool pages (`/tools/pdf-*.html`) that require PDF document manipulation. Never loaded on homepage or text tools.
* **Purpose & Usage in Project:**
  1. **PDF Merger:** Loads input PDFs via `PDFDocument.load(arrayBuffer)`, copies pages via `copyPages()`, and compiles into a single merged PDF.
  2. **PDF Splitter & Page Extractor:** Extracts user-selected page ranges and compiles them into a new document.
  3. **PDF Page Deleter:** Loads documents, removes specified 1-based page indices using `removePage()`, and enforces non-empty output validation.
  4. **PDF Page Rotator:** Adjusts page rotation angles in 90-degree increments (`page.setRotation(degrees(angle))`).
  5. **PDF Page Counter & Analyzer:** Inspects page count (`getPageCount()`), PDF specification version, and metadata dictionaries (`getTitle`, `getAuthor`, `getSubject`, `getCreator`, `getProducer`, creation & modification dates).
* **Limitations & Boundary Handling:**
  - Operates directly in browser memory (`Uint8Array` / `ArrayBuffer`). Extremely large PDFs (e.g. >200MB) are limited by the visitor's available device RAM.
  - Does not support modifying encrypted / password-protected PDFs without the user providing the decryption credentials.
  - Does not perform optical character recognition (OCR) or lossy image re-compression.
