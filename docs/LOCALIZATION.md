# Free Online Tools — Localization Architecture & Review Status Manifest

**Project:** Free Online Tools (Static Multilingual Browser Utility Suite)  
**Phase:** Phase 4 — Educational Content & Localization System  
**Last Updated:** Phase 4 Delivery  

---

## 1. Localization Architecture & Routing Strategy

The localization architecture follows a zero-backend, search-engine-friendly static directory structure suitable for deployment on Hostinger shared hosting:

- **Canonical English Root:**
  - Homepage: `/index.html` (or `/`)
  - Tool Pages: `/tools/{tool-id}.html`
- **Localized Language Roots:**
  - Homepage: `/{lang}/index.html` (or `/{lang}/`)
  - Tool Pages: `/{lang}/tools/{tool-id}.html`
  - Planned Target Languages:
    - Bengali: `bn` (`/bn/index.html`, `/bn/tools/...`)
    - Hindi: `hi` (`/hi/index.html`, `/hi/tools/...`)
    - Spanish: `es` (`/es/index.html`, `/es/tools/...`)
    - French: `fr` (`/fr/index.html`, `/fr/tools/...`)
    - Arabic: `ar` (`/ar/index.html`, `/ar/tools/...` with `dir="rtl"`)

### Language Switcher & Fallback Behavior
- Every page header features a standardized `<select class="lang-selector">` synced to `<html lang="...">`.
- When a user changes the language on a tool page:
  - If the equivalent localized page exists in the target language (e.g., Flagship Batch), the user is navigated immediately to `/{targetLang}/tools/{tool-id}.html`.
  - If the translation for that specific tool is in draft/review (e.g. Phase 5 batch), a polite toast notification alerts the user:  
    *"{Language} translation for this tool is scheduled in upcoming batches. You are viewing the English version."*  
    The selector resets back to the active page language to maintain strict UI state honesty.
  - If switched on the homepage, the user is navigated directly to `/{targetLang}/index.html`.

---

## 2. Review Status Definitions

In adherence to project constraints, translation states are documented honestly without unsupported claims:
- **Verified Native / Professional Review:** Human native speaker or certified translator has audited meaning, idioms, and technical terms.
- **Automated Draft with Structural Audit:** Machine-translated draft verified by developer for DOM integrity, token preservation, non-breaking formatting, and RTL alignment; pending native human review.
- **Draft / In-Progress:** Partial or pending translation scheduled for upcoming release batches.
- **Untranslated / English Fallback:** Not yet generated in this target language; falls back cleanly to the canonical English page.

---

## 3. Language Matrix & Implementation Status

| Language | ISO Code | Script & Direction | Phase 4 Release Status | Review Level | RTL Layout |
|----------|----------|--------------------|------------------------|--------------|------------|
| **English** | `en` | Latin (LTR) | **Complete (All 28 Tools + Homepage)** | Canonical Source | N/A |
| **Bengali (বাংলা)** | `bn` | Bengali (LTR) | **Flagship Batch (6 Tools + Homepage)** | Automated Draft with Structural Audit (Pending Native Review) | No |
| **Hindi (हिन्दी)** | `hi` | Devanagari (LTR) | **Flagship Batch (6 Tools + Homepage)** | Automated Draft with Structural Audit (Pending Native Review) | No |
| **Spanish (Español)** | `es` | Latin (LTR) | **Flagship Batch (6 Tools + Homepage)** | Automated Draft with Structural Audit (Pending Native Review) | No |
| **French (Français)** | `fr` | Latin (LTR) | **Flagship Batch (6 Tools + Homepage)** | Automated Draft with Structural Audit (Pending Native Review) | No |
| **Arabic (العربية)** | `ar` | Arabic (RTL) | **Flagship Batch (6 Tools + Homepage)** | Automated Draft with Structural Audit (Pending Native Review) | Yes (`dir="rtl"`, LTR for code) |

---

## 4. Master Tool Localization Status (28 Implemented Tools)

| # | Tool Name | Slug (`tool-id`) | Category | Tier | English (`en`) | Bengali (`bn`) | Hindi (`hi`) | Spanish (`es`) | French (`fr`) | Arabic (`ar`) |
|---|-----------|------------------|----------|------|----------------|----------------|--------------|----------------|---------------|---------------|
| 1 | **Word & Character Counter** | `word-counter` | Text Tools | Tier 1 | **Complete** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** |
| 2 | **Text Case Converter** | `case-converter` | Text Tools | Tier 1 | **Complete** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** |
| 3 | **JSON Formatter & Validator** | `json-formatter-validator` | Developer | Tier 1 | **Complete** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** |
| 4 | **Strong Password Generator** | `password-generator` | Security | Tier 1 | **Complete** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** |
| 5 | **Percentage & Discount Calculator** | `percentage-calculator` | Calculators | Tier 1 | **Complete** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** |
| 6 | **PDF Merger** | `pdf-merger` | PDF Tools | Tier 2 | **Complete** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** | **Complete (Batch 1)** |
| 7 | Remove Extra Spaces | `remove-extra-spaces` | Text Tools | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 8 | Remove Empty Lines | `remove-empty-lines` | Text Tools | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 9 | Duplicate Line Remover | `duplicate-line-remover` | Text Tools | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 10 | Text Reverser | `text-reverser` | Text Tools | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 11 | Find and Replace | `find-and-replace` | Text Tools | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 12 | Text Sorter | `text-sorter` | Text Tools | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 13 | Text to Slug Converter | `slug-converter` | Text Tools | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 14 | Reading Time Estimator | `reading-time-estimator` | Text Tools | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 15 | JSON Minifier | `json-minifier` | Developer | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 16 | URL Encoder and Decoder | `url-encoder-decoder` | Developer | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 17 | Base64 Text Encoder & Decoder | `base64-encoder-decoder` | Developer | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 18 | UUID Generator | `uuid-generator` | Developer | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 19 | Markdown to HTML Previewer | `markdown-previewer` | Developer | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 20 | Cryptographic Hash Generator | `hash-generator` | Security | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 21 | Age & Date Difference Calculator | `age-calculator` | Calculators | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 22 | Universal Unit Converter | `unit-converter` | Converters | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 23 | Color Converter & Contrast Checker | `color-converter` | Web / UI | Tier 1 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 24 | PDF Splitter | `pdf-splitter` | PDF Tools | Tier 2 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 25 | PDF Page Extractor | `pdf-page-extractor` | PDF Tools | Tier 2 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 26 | PDF Page Deleter | `pdf-page-deleter` | PDF Tools | Tier 2 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 27 | PDF Page Rotator | `pdf-page-rotator` | PDF Tools | Tier 2 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |
| 28 | PDF Page Counter & File Analyzer | `pdf-page-counter` | PDF Tools | Tier 2 | **Complete** | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) | Draft (Phase 5) |

---

## 5. Right-to-Left (RTL) Guidelines for Arabic (`ar`)

To ensure right-to-left layout does not break technical tokens, code blocks, or numerical inputs:
1. **Document Level:** `<html lang="ar" dir="rtl">` sets the base text direction and alignment to the right.
2. **CSS Logical Properties:** Stylesheets exclusively use `margin-inline`, `padding-inline`, `inset-inline-start`, and `inset-inline-end`.
3. **Protected LTR Elements:**
   - Preformatted code (`<pre class="example-pre">`, `<code>`) enforces `dir="ltr"` and `text-align: left;`.
   - Technical tokens (JSON keys, regex patterns, RFC numbers, hexadecimal hashes, byte equations) remain untranslated in Latin script.
   - Numeric inputs (`<input type="number">`) and statistic values preserve `dir="ltr"`.

---

## 6. How to Contribute Human Reviews

Native speakers and community contributors can audit localized files:
1. Review the translated files in `{lang}/tools/{tool-id}.html`.
2. Ensure technical terminology remains natural without altering English code tokens or DOM element IDs.
3. Submit edits to update the status in this manifest from **Automated Draft** to **Verified Native Review**.
