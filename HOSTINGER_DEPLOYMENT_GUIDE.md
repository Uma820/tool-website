# Hostinger Shared Hosting Deployment & Setup Guide

**Project:** Free Online Tools (Static Client-Side Web Utility Suite)  
**Target Platform:** Hostinger Shared Hosting (Single, Premium, Business, or Cloud Shared Plans)  
**Deliverable Archive:** `free-online-tools-v1.0.0-production.zip` (and `free-online-tools.zip`)  
**Package Type:** Pre-built, upload-ready static website files (HTML5, Modern CSS, Vanilla JS, self-hosted libraries). **No Node.js, npm, compilers, or database servers are required on your host.**

---

## 1. What is Inside the Production Archive

The deployment package `free-online-tools-v1.0.0-production.zip` contains the complete, self-contained website organized for direct extraction into Hostinger's `public_html` directory:

```
public_html/
├── .htaccess                     # Apache/LiteSpeed web server rules (caching, compression, 404 routing)
├── index.html                    # English Canonical Homepage & Interactive Tools Directory
├── 404.html                      # Custom Helpful 404 Error Page (noindex, nofollow)
├── robots.txt                    # Search crawler indexing rules
├── sitemap.xml                   # XML Sitemap with 94 verified public URLs
├── assets/
│   ├── css/style.css             # Main responsive stylesheet (Dark/Light themes, RTL layout)
│   ├── js/app.js                 # Global app script (theme toggle, search, router, copy helper)
│   ├── js/tools-data.js          # Central metadata registry for all 28 canonical tools
│   └── vendor/pdf-lib.min.js     # Standalone self-hosted PDF engine (MIT License)
├── tools/                        # 28 Canonical Tool Workspaces (100% Client-Side)
├── pages/                        # 5 Canonical Informational Pages (About, Contact, Privacy, Terms, Disclaimer)
├── bn/                           # Complete Localized Bengali Experience (Home + 6 Tools + 5 Info Pages)
├── hi/                           # Complete Localized Hindi Experience (Home + 6 Tools + 5 Info Pages)
├── es/                           # Complete Localized Spanish Experience (Home + 6 Tools + 5 Info Pages)
├── fr/                           # Complete Localized French Experience (Home + 6 Tools + 5 Info Pages)
├── ar/                           # Complete Localized Arabic Experience with RTL Layout (Home + 6 Tools + 5 Info Pages)
├── docs/                         # Project manifests, capability guides, and test audits
└── scripts/
    └── configure-production-domain.js  # Production domain configuration helper CLI
```

> **Development Files Excluded:** Testing suites (`tests/`), temporary development scripts (`scratch/`), local dev servers (`server.js`), and development logs are strictly excluded from the package to minimize file size and protect internal testing notes.

---

## 2. Pre-Upload Configuration (Required Owner Facts)

Before publishing to the public internet, customize your domain name and contact information:

### Step A: Configure Your Live Production Domain
The package currently uses the safe placeholder `https://[YOUR_PRODUCTION_DOMAIN]`. To set your real domain across `sitemap.xml`, `robots.txt`, and canonical tags:

- **Option 1 (Automated - Recommended):** On your computer with Node.js installed, open terminal in the project directory and run:
  ```bash
  node scripts/configure-production-domain.js https://your-actual-domain.com
  ```
- **Option 2 (Manual Text Editor):** If editing directly on Hostinger or in Notepad, open `sitemap.xml` and `robots.txt`, and replace `https://[YOUR_PRODUCTION_DOMAIN]` with your live URL (e.g. `https://myfreetools.com`). In `robots.txt`, uncomment the `Sitemap:` line.

### Step B: Fill In Owner Contact Information
Open [`pages/about.html`](file:///c:/Users/dasum/OneDrive/Desktop/ALL-IN-ONE%20FREE%20ONLINE%20TOOLS%20WEBSITE/pages/about.html) and [`pages/contact.html`](file:///c:/Users/dasum/OneDrive/Desktop/ALL-IN-ONE%20FREE%20ONLINE%20TOOLS%20WEBSITE/pages/contact.html) in any text editor:
- Replace `[CONFIGURED_OWNER_OR_ORGANIZATION_NAME]` with your name, publisher brand, or company name.
- Replace `[CONFIGURED_CONTACT_EMAIL]` with your working support or administrative email address.

---

## 3. Step-by-Step Deployment to Hostinger File Manager

This is the fastest, beginner-friendly method. No FTP client is required.

### Step 1: Sign in to Hostinger hPanel
1. Open your browser and navigate to [https://hpanel.hostinger.com/](https://hpanel.hostinger.com/).
2. Enter your email and password to log in.
3. On the main dashboard, locate the **Websites** section.
4. Find the domain name you want to use and click the **Manage** button next to it.

### Step 2: Open File Manager
1. In the left navigation menu, click **Files** &rarr; **File Manager** (or type "File Manager" in the top search bar).
2. Choose **Access files of [your-domain]**.
3. The File Manager interface will open in a new tab.
4. Double-click the **`public_html`** folder to open it.
   *(Official Guide: [How to Use Hostinger File Manager](https://support.hostinger.com/en/articles/1583271-how-to-use-hostinger-file-manager))*

### Step 3: Clean Default Hostinger Placeholder Files
If Hostinger created default temporary placeholder files (such as `default.php` or a placeholder `index.php`), select them and click the **Delete** (trash can) icon in the top toolbar.

### Step 4: Upload the Production ZIP
1. In the File Manager top toolbar, click the **Upload** icon (arrow pointing upwards).
2. Select **File** and choose `free-online-tools-v1.0.0-production.zip` (or `free-online-tools.zip`) from your computer.
3. Wait for the upload progress bar to reach 100%.

### Step 5: Extract Files Directly into `public_html` (Avoid Nesting!)
1. Right-click the uploaded ZIP file inside `public_html` and choose **Extract**.
2. A modal dialog will appear asking for the destination path:
   > ⚠️ **CRITICAL STEP:** Ensure the extraction destination is set to **`public_html`** or **`.`** (current folder). **Do NOT enter a new folder name like `free-online-tools`**, or your site will end up nested in a subfolder!
3. Click **Extract**.
4. Once extraction completes, verify that `index.html`, `404.html`, `.htaccess`, `assets/`, `tools/`, and `pages/` are sitting directly under `public_html`.
5. Right-click the uploaded ZIP file and click **Delete** to free up your hosting storage.

---

## 4. Alternate Deployment Method: Using FTP (FileZilla)

If you prefer uploading using standard FTP:
1. In Hostinger hPanel, search for **FTP Accounts**. Note your **FTP Host (IP)**, **Username**, **Password**, and **Port (21)**.
2. Download and launch [FileZilla Client](https://filezilla-project.org/).
3. Enter your Hostinger FTP credentials into the Quickconnect bar and click **Quickconnect**.
4. In the right pane (**Remote Site**), open the **`public_html`** folder.
5. In the left pane (**Local Site**), navigate to your extracted project folder.
6. Select all items (`index.html`, `.htaccess`, `assets`, `tools`, `pages`, `bn`, `hi`, `es`, `fr`, `ar`, etc.) and drag them into the remote `public_html` directory.
7. Wait for the transfer queue to finish with 0 failed transfers.

---

## 5. Enable Free SSL (HTTPS) on Hostinger

Modern browser security features (such as `crypto.randomUUID()` and Web Crypto API cryptographic hashes) require a secure **HTTPS** connection to operate.

1. In Hostinger hPanel, navigate to **Security** &rarr; **SSL** (or search "SSL" in the search bar).
2. Hostinger provides free Let's Encrypt SSL certificates automatically on all plans. If not already active, click **Install SSL**.
3. Once active, toggle **Force HTTPS** (or **Enforce HTTPS**) to **ON**. This automatically redirects all visitors from `http://` to `https://`.
   *(Official Guide: [How to Install SSL on Hostinger](https://support.hostinger.com/en/articles/1583236-how-to-install-an-ssl-certificate-on-hostinger))*

---

## 6. Post-Upload Verification Checklist

After extraction, test your live website to confirm proper deployment:

- [ ] **Homepage Verification:** Open `https://your-domain.com/`. Confirm the page loads cleanly with header, search bar, category tabs, and tool cards.
- [ ] **Live Search Test:** Type "word" or "pdf" into the search bar. Confirm filtering works instantly.
- [ ] **Dark / Light Theme Toggle:** Click the theme toggle icon in the header. Confirm colors switch smoothly and your preference persists across page reloads.
- [ ] **Canonical Tool Functionality:** Open at least three distinct tools and verify operations:
  - Text: `https://your-domain.com/tools/word-counter.html` (Paste sample text, confirm real-time metrics).
  - Code: `https://your-domain.com/tools/json-formatter-validator.html` (Paste JSON, format and test Copy).
  - PDF: `https://your-domain.com/tools/pdf-merger.html` (Upload 2 test PDFs, merge and download).
- [ ] **Language Selector Test:** Select "বাংলা (Bengali)", "हिन्दी (Hindi)", or "العربية (Arabic)" from the language dropdown. Confirm localized pages load with proper RTL layout on Arabic.
- [ ] **404 Error Page Test:** Visit `https://your-domain.com/random-test-page-xyz`. Confirm the custom 404 page loads rather than a generic server error.
- [ ] **SEO Asset Verification:**
  - Visit `https://your-domain.com/robots.txt` and confirm directives are visible.
  - Visit `https://your-domain.com/sitemap.xml` and confirm valid XML output.
- [ ] **Mobile Usability Check:** Open `https://your-domain.com/` on a smartphone or browser responsive mode (375px width). Confirm no horizontal overflow.

---

## 7. How to Update the Site in the Future

When updating tools or content in future versions:

1. **Backup Existing Files:** In Hostinger File Manager, select all files in `public_html` &rarr; click **Download** or **Archive** to save a dated backup.
2. **Upload New Package:** Upload the updated release ZIP to `public_html` and extract. Choose "Overwrite existing files" when prompted.
3. **Purge Browser Cache:** The `.htaccess` file sets `ExpiresByType text/html "access plus 0 seconds"`, so visitors receive updated HTML immediately. If you updated CSS or JS, perform a hard-refresh (`Ctrl + F5` on Windows or `Cmd + Shift + R` on Mac).

---

## 8. Common Troubleshooting Guide

### Issue 1: "403 Forbidden" or Hostinger Default "Website Under Construction" Page
- **Cause:** Your files were extracted inside a subfolder (e.g. `public_html/free-online-tools/index.html`) rather than directly in `public_html/index.html`.
- **Solution:** Open File Manager &rarr; go into the subfolder &rarr; select all files &rarr; click **Move** in the top toolbar &rarr; choose `/public_html` as destination &rarr; click **Move**.

### Issue 2: CSS Styles, Icons, or Scripts are Missing
- **Cause:** The `assets/` folder was not extracted, or permissions prevent reading.
- **Solution:** Verify `public_html/assets/css/style.css` exists. Ensure folder permissions are set to `755` and file permissions to `644` (Hostinger's standard defaults).

### Issue 3: 404 Error on Direct Links to Tools
- **Cause:** The `.htaccess` file was omitted during upload (hidden files can be skipped by some FTP clients).
- **Solution:** Check if `.htaccess` exists in `public_html`. In File Manager settings (gear icon), enable "Show Hidden Files". If missing, upload `.htaccess` from the package.

### Issue 4: "Crypto API Unavailable" or Password Generator Fails
- **Cause:** Site is running over insecure HTTP (`http://`).
- **Solution:** Enable SSL in Hostinger hPanel and turn **Force HTTPS** ON.

---

## 9. Official Hostinger Support Resources
- [Hostinger Knowledge Base Home](https://support.hostinger.com/)
- [Hostinger File Manager Tutorial](https://support.hostinger.com/en/articles/1583271-how-to-use-hostinger-file-manager)
- [How to Set Up Free SSL on Hostinger](https://support.hostinger.com/en/articles/1583236-how-to-install-an-ssl-certificate-on-hostinger)
- [How to Use FTP on Hostinger](https://support.hostinger.com/en/articles/1583231-how-to-set-up-and-use-ftp-on-hostinger)
