# Free Online Tools — Deployment & Production Configuration Guide

**Target Host:** Hostinger Shared Hosting (Apache / LiteSpeed Web Server)  
**Deployment Target Directory:** `public_html/`  
**Package:** `free-online-tools.zip`  
**Phase:** Phase 5 (Technical SEO & Informational Architecture)  

---

## 1. Pre-Deployment Configuration Checklist

Before uploading the site to Hostinger shared hosting, the site owner must configure three key items:

### A. Production Domain Origin
In accordance with technical SEO requirements, this codebase uses the explicit placeholder `https://[YOUR_PRODUCTION_DOMAIN]` to prevent emitting fabricated domains or indexing dummy URLs.

To set your actual production domain, run the helper utility:
```bash
node scripts/configure-production-domain.js https://your-actual-domain.com
```
This single command safely updates:
- `<link rel="canonical">` tags across all HTML files.
- `hreflang` alternative language links.
- JSON-LD structured data (`WebSite`, `WebApplication`, `AboutPage`, `ContactPage`).
- `<loc>` entries in `sitemap.xml` (all 94 verified public URLs).
- Activates the `Sitemap:` directive in `robots.txt`.

*(To revert back to the safe placeholder state, run `node scripts/configure-production-domain.js --reset`)*.

---

### B. Owner & Administrative Contact Placeholders
Search and replace the following configuration placeholders in `pages/*.html` and `{lang}/pages/*.html`:
- `[CONFIGURED_OWNER_OR_ORGANIZATION_NAME]`: Your official name, organization, or project title.
- `[CONFIGURED_CONTACT_CHANNEL_OR_EMAIL]`: Your verified support email, dedicated contact endpoint, or public issue tracker.
- `[GOVERNING_JURISDICTION_AND_APPLICABLE_LAW]`: The legal jurisdiction governing your project terms (e.g., *State of Delaware, United States* or *England and Wales*).

---

### C. Legal & Policy Reviews
The documents `pages/terms.html` and `pages/disclaimer.html` are provided as **general informational drafts**. They must be reviewed by qualified legal counsel prior to formal commercial reliance.

---

## 2. Deploying to Hostinger Shared Hosting

1. **Build the Zip Bundle:**
   ```powershell
   Compress-Archive -Path index.html, 404.html, .htaccess, robots.txt, sitemap.xml, assets, tools, pages, bn, hi, es, fr, ar, docs, tests -DestinationPath free-online-tools.zip -Force
   ```
2. **Log into Hostinger hPanel:**
   - Navigate to **Websites** &rarr; **File Manager** (or connect via FTPS / FileZilla).
   - Open the website's root directory: `public_html/`.
3. **Upload and Extract:**
   - Upload `free-online-tools.zip`.
   - Right-click the zip file in File Manager and choose **Extract**. Extract directly into `public_html/`.
   - Delete `free-online-tools.zip` from the server once extracted.
4. **Verify File Permissions:**
   - Folders: `755` (`drwxr-xr-x`)
   - Files: `644` (`-rw-r--r--`)

---

## 3. Server Configuration & `.htaccess` Verification

The included `.htaccess` file is pre-configured for Hostinger's LiteSpeed / Apache server:
- **Error Handling:** `ErrorDocument 404 /404.html` ensures invalid routes display the custom 404 page with a 404 HTTP status code.
- **MIME Types & Charset:** `AddDefaultCharset UTF-8` prevents character encoding issues in Arabic, Bengali, and Hindi scripts.
- **Security Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Performance Caching:** 1-month browser caching for static assets (CSS, JS, images, self-hosted `pdf-lib`).
- **Directory Protection:** `Options -Indexes` prevents public directory browsing.

---

## 4. Post-Deployment Verification Steps

1. Visit your domain: `https://your-domain.com/` (check light and dark theme toggle).
2. Visit an unknown route: `https://your-domain.com/non-existent-page` (verify 404 page displays).
3. Test a PDF tool: `https://your-domain.com/tools/pdf-merger.html` (verify client-side merging works without errors).
4. Verify localized routes: `https://your-domain.com/ar/tools/word-counter.html` (verify RTL layout).
5. Verify `robots.txt` and `sitemap.xml`:
   - `https://your-domain.com/robots.txt`
   - `https://your-domain.com/sitemap.xml`
