/**
 * Free Online Tools - Global Application Script
 * Theme toggle, Homepage live search, Category filtering, Copy-to-clipboard, Toasts
 */

(function () {
  'use strict';

  // --- 1. Theme Management ---
  const THEME_STORAGE_KEY = 'fot_user_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeToggleButtons(initialTheme);

    // Listen for OS scheme changes if user hasn't explicitly set a preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          const newTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          updateThemeToggleButtons(newTheme);
        }
      });
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    updateThemeToggleButtons(nextTheme);
  }

  function updateThemeToggleButtons(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.innerHTML = theme === 'dark' 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    });
  }

  // --- 2. Toast Notifications ---
  let toastElement = null;
  let toastTimeout = null;

  function showToast(message, duration = 3000) {
    if (!toastElement) {
      toastElement = document.createElement('div');
      toastElement.className = 'toast';
      toastElement.setAttribute('role', 'status');
      toastElement.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastElement);
    }

    toastElement.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${escapeHtml(message)}</span>
    `;
    toastElement.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastElement.classList.remove('show');
    }, duration);
  }

  // --- 3. Clipboard Helper ---
  async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    if (!text || text.trim() === '') {
      showToast('Nothing to copy!');
      return false;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-https or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      showToast(successMessage);
      return true;
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      showToast('Could not copy automatically. Please copy manually.');
      return false;
    }
  }

  // --- 4. String Escaping ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- 5. Homepage Tools Directory Engine ---
  function initToolsDirectory() {
    const gridEl = document.getElementById('tools-grid');
    const searchInput = document.getElementById('search-input');
    const categoryTabsContainer = document.getElementById('category-tabs');
    const resultCountEl = document.getElementById('results-count');
    const searchWrapper = document.querySelector('.search-wrapper');

    if (!gridEl || typeof TOOLS_DATABASE === 'undefined') return;

    let activeCategory = 'all';
    let searchQuery = '';
    let selectedSuggestionIndex = -1;
    let currentSuggestions = [];

    // Helper: Category Icons
    function getToolCategoryIcon(category) {
      switch (category) {
        case 'pdf':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
        case 'text':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>';
        case 'developer':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
        case 'calculators':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/></svg>';
        case 'security':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
        case 'web-ui':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20z"/></svg>';
        case 'converters':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
        case 'images':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
        case 'social':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
        case 'seo':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
        case 'video':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>';
        case 'logistics':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
        case 'crafts':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>';
        case 'food':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>';
        case 'printing':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
        case 'solar':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        case 'pod':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';
        case 'aquarium':
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6z"/><path d="M18 12l4-4v8l-4-4z"/><circle cx="10" cy="11" r="1"/></svg>';
        default:
          return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';
      }
    }

    // Helper: Badge Classes
    function getBadgeClass(badge) {
      if (!badge) return 'badge-editorial';
      const b = badge.toLowerCase();
      if (b === 'popular') return 'badge-popular';
      if (b === 'essential') return 'badge-essential';
      return 'badge-editorial';
    }

    // 1. Render Accessible Category Filter Tabs with Counts
    if (categoryTabsContainer && typeof TOOL_CATEGORIES !== 'undefined') {
      const counts = { all: TOOLS_DATABASE.length };
      TOOL_CATEGORIES.forEach(cat => {
        if (cat.id === 'all') return;
        const sub = cat.subcategories || [cat.id];
        const matchCount = TOOLS_DATABASE.filter(t => {
          return sub.includes(t.category) ||
            (Array.isArray(t.categories) && t.categories.some(c => sub.includes(c)));
        }).length;
        counts[cat.id] = matchCount;
      });

      categoryTabsContainer.setAttribute('role', 'tablist');
      categoryTabsContainer.setAttribute('aria-label', 'Tool Categories');

      categoryTabsContainer.innerHTML = TOOL_CATEGORIES.map(cat => {
        const isActive = cat.id === 'all';
        const count = counts[cat.id] || 0;
        return `
          <button 
            type="button" 
            role="tab" 
            id="tab-${cat.id}"
            class="tab-btn ${isActive ? 'active' : ''}" 
            data-category="${cat.id}"
            aria-selected="${isActive ? 'true' : 'false'}"
            aria-controls="tools-grid"
            tabindex="${isActive ? '0' : '-1'}"
          >
            <span>${escapeHtml(cat.name)}</span>
            ${count > 0 ? `<span class="tab-count" aria-hidden="true">${count}</span>` : ''}
          </button>
        `;
      }).join('');

      function selectCategoryTab(btn) {
        if (!btn) return;
        const allTabs = categoryTabsContainer.querySelectorAll('.tab-btn');
        allTabs.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
          b.setAttribute('tabindex', '-1');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
        btn.focus();
        activeCategory = btn.getAttribute('data-category');
        renderFilteredTools();
      }

      categoryTabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (btn) selectCategoryTab(btn);
      });

      // Keyboard navigation for WAI-ARIA tablist
      categoryTabsContainer.addEventListener('keydown', (e) => {
        const tabs = Array.from(categoryTabsContainer.querySelectorAll('.tab-btn'));
        const currentIdx = tabs.indexOf(document.activeElement);
        if (currentIdx === -1) return;

        let nextIdx = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          nextIdx = (currentIdx + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIdx = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIdx = tabs.length - 1;
        }

        if (nextIdx !== -1) {
          selectCategoryTab(tabs[nextIdx]);
        }
      });
    }

    // 2. Render Filtered Tools Grid
    function renderFilteredTools() {
      const q = searchQuery.toLowerCase().trim();
      
      const filtered = TOOLS_DATABASE.filter(tool => {
        let matchesCategory = (activeCategory === 'all');
        if (!matchesCategory) {
          const activeCatObj = TOOL_CATEGORIES.find(c => c.id === activeCategory);
          const sub = (activeCatObj && activeCatObj.subcategories) ? activeCatObj.subcategories : [activeCategory];
          matchesCategory = sub.includes(tool.category) ||
            (Array.isArray(tool.categories) && tool.categories.some(c => sub.includes(c)));
        }
        if (!matchesCategory) return false;

        if (!q) return true;

        const nameMatch = tool.name.toLowerCase().includes(q);
        const descMatch = tool.description.toLowerCase().includes(q);
        const keywordMatch = tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(q));

        return nameMatch || descMatch || keywordMatch;
      });

      if (resultCountEl) {
        resultCountEl.textContent = `Showing ${filtered.length} tool${filtered.length === 1 ? '' : 's'}`;
      }

      const privacyBannerCount = document.getElementById('privacy-tool-count');
      if (privacyBannerCount) {
        privacyBannerCount.textContent = TOOLS_DATABASE.length;
      }

      if (filtered.length === 0) {
        gridEl.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
            <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">No tools found matching "${escapeHtml(searchQuery)}"</p>
            <p style="color: var(--color-text-muted);">Try a different search term or select another category filter.</p>
          </div>
        `;
        return;
      }

      gridEl.innerHTML = filtered.map(tool => {
        const isLive = tool.status === 'implemented';
        const cardTag = isLive ? 'a' : 'div';
        const currentLang = document.documentElement.lang || 'en';
        let toolUrl = tool.url;
        if (currentLang !== 'en' && LOCALIZED_CATALOG[currentLang] && LOCALIZED_CATALOG[currentLang].includes(tool.id)) {
          toolUrl = `/${currentLang}/tools/${tool.id}.html`;
        }
        const hrefAttr = isLive ? `href="${toolUrl}"` : '';
        
        let badgeHtml = '';
        if (tool.badge && tool.badge.trim()) {
          const badgeClass = getBadgeClass(tool.badge);
          badgeHtml = `<span class="tool-badge ${badgeClass}" title="${escapeHtml(tool.badge)}">${escapeHtml(tool.badge)}</span>`;
        } else if (!isLive) {
          badgeHtml = `<span class="tool-badge badge-editorial">Planned</span>`;
        }
        
        return `
          <${cardTag} ${hrefAttr} class="tool-card ${!isLive ? 'tool-card-disabled' : ''}">
            <div class="tool-card-header">
              <div class="tool-icon-wrapper" aria-hidden="true">
                ${getToolCategoryIcon(tool.category)}
              </div>
              ${badgeHtml}
            </div>
            <h2 class="tool-title">${escapeHtml(tool.name)}</h2>
            <p class="tool-desc line-clamp-2">${escapeHtml(tool.description)}</p>
            <div class="tool-footer">
              <span class="tool-privacy-tag" title="Runs client-side in your browser">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>In-Browser</span>
              </span>
              <span class="tool-arrow" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </div>
          </${cardTag}>
        `;
      }).join('');
    }

    // 3. Search Autocomplete & Live Suggestions Dropdown
    let suggestionsEl = document.getElementById('search-suggestions');
    if (!suggestionsEl && searchWrapper) {
      suggestionsEl = document.createElement('div');
      suggestionsEl.id = 'search-suggestions';
      suggestionsEl.className = 'search-suggestions';
      suggestionsEl.setAttribute('role', 'listbox');
      suggestionsEl.setAttribute('aria-label', 'Tool suggestions');
      suggestionsEl.hidden = true;
      searchWrapper.appendChild(suggestionsEl);
    }

    const liveStatusEl = document.getElementById('search-live-status');
    const clearBtn = document.getElementById('search-clear-btn');

    function updateClearButton() {
      if (!clearBtn || !searchInput) return;
      clearBtn.hidden = (searchInput.value.length === 0);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        updateClearButton();
        closeSuggestions();
        renderFilteredTools();
        searchInput.focus();
      });
    }

    function closeSuggestions() {
      if (!suggestionsEl) return;
      suggestionsEl.hidden = true;
      suggestionsEl.innerHTML = '';
      currentSuggestions = [];
      selectedSuggestionIndex = -1;
      if (searchInput) {
        searchInput.setAttribute('aria-expanded', 'false');
        searchInput.removeAttribute('aria-activedescendant');
      }
    }

    // Keyword alias dictionary for rich instant search intent matching
    const KEYWORD_ALIASES = {
      'calc': ['calculator', 'calculators', 'reseller-profit-calculator', '3d-print-cost-calculator', 'solar-panel-size-calculator', 'battery-runtime-calculator', 'cbm-calculator', 'freelance-fee-reverse-calculator', 'newsletter-sponsorship-calculator', 'ppp-price-calculator'],
      'calculator': ['calculators'],
      'calculators': ['calculators'],
      'poshmark': ['reseller-profit-calculator'],
      'mercari': ['reseller-profit-calculator'],
      'ebay': ['reseller-profit-calculator'],
      'depop': ['reseller-profit-calculator'],
      'vinted': ['reseller-profit-calculator'],
      'resell': ['reseller-profit-calculator'],
      'reseller': ['reseller-profit-calculator'],
      'flip': ['reseller-profit-calculator'],
      '3d': ['3d-print-cost-calculator', 'filament-remaining-calculator', 'filament-length-calculator', 'multi-color-waste-calculator'],
      'print': ['3d-print-cost-calculator', '300-dpi-print-size-checker', 'image-dpi-checker', 'pixels-to-inches-calculator'],
      'filament': ['3d-print-cost-calculator', 'filament-remaining-calculator', 'filament-length-calculator', 'multi-color-waste-calculator'],
      'solar': ['solar-panel-size-calculator', 'inverter-backup-calculator', 'battery-runtime-calculator'],
      'battery': ['battery-runtime-calculator', 'inverter-backup-calculator', 'solar-panel-size-calculator'],
      'inverter': ['inverter-backup-calculator', 'battery-runtime-calculator', 'solar-panel-size-calculator'],
      'generator': ['generator-size-calculator'],
      'schema': ['json-ld-schema-generator'],
      'jsonld': ['json-ld-schema-generator'],
      'json-ld': ['json-ld-schema-generator'],
      'rich snippet': ['json-ld-schema-generator'],
      'rich results': ['json-ld-schema-generator'],
      'structured data': ['json-ld-schema-generator'],
      'favicon': ['favicon-manifest-generator', 'favicon-generator'],
      'manifest': ['favicon-manifest-generator'],
      'pwa': ['favicon-manifest-generator'],
      'bento': ['css-bento-mesh-glass-generator'],
      'mesh': ['css-bento-mesh-glass-generator'],
      'glass': ['css-bento-mesh-glass-generator'],
      'glassmorphism': ['css-bento-mesh-glass-generator'],
      'cbm': ['cbm-calculator', 'volumetric-weight-calculator', 'chargeable-weight-calculator', 'container-loading-calculator'],
      'freight': ['cbm-calculator', 'volumetric-weight-calculator', 'chargeable-weight-calculator', 'container-loading-calculator', 'pallet-calculator'],
      'pallet': ['pallet-calculator', 'container-loading-calculator', 'cbm-calculator'],
      'sourdough': ['sourdough-hydration-calculator', 'bakers-percentage-calculator', 'bread-recipe-scaler'],
      'bread': ['sourdough-hydration-calculator', 'bread-recipe-scaler', 'bakers-percentage-calculator'],
      'pizza': ['pizza-dough-calculator'],
      'aquarium': ['aquarium-volume-calculator', 'aquarium-heater-calculator', 'aquarium-water-change-calculator', 'aquarium-stocking-calculator'],
      'fish': ['aquarium-volume-calculator', 'aquarium-heater-calculator', 'aquarium-water-change-calculator', 'aquarium-stocking-calculator'],
      'tank': ['aquarium-volume-calculator', 'aquarium-heater-calculator'],
      'sewing': ['fabric-yardage-calculator', 'quilt-backing-calculator', 'quilt-binding-calculator', 'curtain-fabric-calculator', 'fabric-shrinkage-calculator'],
      'fabric': ['fabric-yardage-calculator', 'curtain-fabric-calculator', 'fabric-shrinkage-calculator'],
      'quilt': ['quilt-backing-calculator', 'quilt-binding-calculator'],
      'cpm': ['newsletter-sponsorship-calculator', 'youtube-money-calculator'],
      'newsletter': ['newsletter-sponsorship-calculator'],
      'sponsor': ['newsletter-sponsorship-calculator'],
      'freelance': ['freelance-fee-reverse-calculator'],
      'fee': ['freelance-fee-reverse-calculator', 'reseller-profit-calculator'],
      'badge': ['readme-badge-builder'],
      'readme': ['readme-badge-builder'],
      'voice': ['voiceover-script-timer'],
      'voiceover': ['voiceover-script-timer'],
      'script': ['voiceover-script-timer'],
      'teleprompter': ['voiceover-script-timer'],
      'emoji': ['discord-twitch-emoji-resizer'],
      'emote': ['discord-twitch-emoji-resizer'],
      'discord': ['discord-twitch-emoji-resizer'],
      'twitch': ['discord-twitch-emoji-resizer'],
      'ppp': ['ppp-price-calculator'],
      'parity': ['ppp-price-calculator'],
      'chapter': ['youtube-chapter-formatter'],
      'timestamp': ['youtube-chapter-formatter'],
      'safe zone': ['short-form-safe-zone-checker', 'tiktok-safe-zone-checker', 'instagram-reels-safe-zone-checker', 'youtube-shorts-safe-zone-checker'],
      'tiktok': ['tiktok-safe-zone-checker', 'short-form-safe-zone-checker'],
      'reels': ['instagram-reels-safe-zone-checker', 'short-form-safe-zone-checker'],
      'shorts': ['youtube-shorts-safe-zone-checker', 'short-form-safe-zone-checker']
    };

    function highlightMatch(text, query) {
      if (!query || !text) return escapeHtml(text || '');
      const escaped = escapeHtml(text);
      const safeQ = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!safeQ) return escaped;
      return escaped.replace(new RegExp(`(${safeQ})`, 'gi'), '<mark>$1</mark>');
    }

    function renderSuggestions(query) {
      if (!suggestionsEl || !searchInput) return;
      const q = query.trim().toLowerCase();

      if (!q) {
        closeSuggestions();
        return;
      }

      // Check for alias matching
      const aliasTargetIds = [];
      for (const [aliasKey, targets] of Object.entries(KEYWORD_ALIASES)) {
        if (q === aliasKey || q.startsWith(aliasKey) || aliasKey.startsWith(q)) {
          targets.forEach(t => {
            if (!aliasTargetIds.includes(t)) aliasTargetIds.push(t);
          });
        }
      }

      // Filter implemented tools
      const implementedTools = TOOLS_DATABASE.filter(t => t.status === 'implemented');
      
      const scored = implementedTools.map(tool => {
        let score = 0;
        const nameLower = tool.name.toLowerCase();
        const descLower = tool.description.toLowerCase();
        const idLower = (tool.id || '').toLowerCase();
        const catLower = (tool.category || '').toLowerCase();
        const categoriesLower = Array.isArray(tool.categories) ? tool.categories.map(c => c.toLowerCase()) : [];

        // Exact & prefix match on name or ID
        if (nameLower === q) score += 150;
        else if (nameLower.startsWith(q)) score += 90;
        else if (nameLower.includes(q)) score += 50;

        if (idLower === q) score += 120;
        else if (idLower.includes(q)) score += 40;

        // Alias match
        if (aliasTargetIds.includes(tool.id) || aliasTargetIds.includes(tool.category)) {
          score += 65;
        }

        // Keywords match
        if (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(q))) {
          score += 35;
        }

        // Category match
        if (catLower.includes(q) || categoriesLower.some(c => c.includes(q))) {
          score += 25;
        }

        // Description match
        if (descLower.includes(q)) {
          score += 15;
        }

        return { tool, score };
      }).filter(item => item.score > 0);

      scored.sort((a, b) => b.score - a.score);
      currentSuggestions = scored.slice(0, 7).map(s => s.tool);
      selectedSuggestionIndex = -1;

      if (currentSuggestions.length === 0) {
        suggestionsEl.innerHTML = `
          <div class="search-empty-state" role="status">
            <p>No tools found matching "<strong>${escapeHtml(query)}</strong>"</p>
            <p class="search-empty-hint">Try keywords like <em>reseller, 3d, solar, battery, schema, or cbm</em></p>
          </div>
        `;
        suggestionsEl.hidden = false;
        searchInput.setAttribute('aria-expanded', 'true');
        searchInput.removeAttribute('aria-activedescendant');
        if (liveStatusEl) liveStatusEl.textContent = `No tools found for ${query}`;
        return;
      }

      const currentLang = document.documentElement.lang || 'en';
      suggestionsEl.innerHTML = currentSuggestions.map((tool, idx) => {
        let toolUrl = tool.url;
        if (currentLang !== 'en' && LOCALIZED_CATALOG[currentLang] && LOCALIZED_CATALOG[currentLang].includes(tool.id)) {
          toolUrl = `/${currentLang}/tools/${tool.id}.html`;
        }
        const catObj = (typeof TOOL_CATEGORIES !== 'undefined') ? TOOL_CATEGORIES.find(c => c.id === tool.category) : null;
        const catName = catObj ? catObj.name : tool.category;

        return `
          <a 
            href="${toolUrl}" 
            class="search-suggestion-item" 
            role="option" 
            id="suggestion-opt-${idx}"
            aria-selected="false"
            data-index="${idx}"
          >
            <div class="suggestion-main">
              <span class="suggestion-title">
                <span>${highlightMatch(tool.name, q)}</span>
                <span class="suggestion-category-tag cat-${tool.category}">${escapeHtml(catName)}</span>
              </span>
              <span class="suggestion-desc">${escapeHtml(tool.description)}</span>
            </div>
            <div class="suggestion-meta">
              <span class="suggestion-tier">Instant</span>
              <span class="suggestion-arrow" aria-hidden="true">&rarr;</span>
            </div>
          </a>
        `;
      }).join('');

      suggestionsEl.hidden = false;
      searchInput.setAttribute('aria-expanded', 'true');
      if (liveStatusEl) {
        liveStatusEl.textContent = `${currentSuggestions.length} tool suggestions available. Use arrow keys to navigate.`;
      }
    }

    function updateSelectedSuggestion() {
      if (!suggestionsEl || !searchInput) return;
      const items = suggestionsEl.querySelectorAll('.search-suggestion-item');
      items.forEach((item, idx) => {
        const isSel = idx === selectedSuggestionIndex;
        item.classList.toggle('is-selected', isSel);
        item.setAttribute('aria-selected', isSel ? 'true' : 'false');
        if (isSel) {
          searchInput.setAttribute('aria-activedescendant', `suggestion-opt-${idx}`);
          item.scrollIntoView({ block: 'nearest' });
        }
      });
      if (selectedSuggestionIndex === -1) {
        searchInput.removeAttribute('aria-activedescendant');
      }
    }

    if (suggestionsEl) {
      // Hovering suggestion updates selection
      suggestionsEl.addEventListener('mousemove', (e) => {
        const item = e.target.closest('.search-suggestion-item');
        if (item) {
          const idx = parseInt(item.getAttribute('data-index'), 10);
          if (!isNaN(idx) && idx !== selectedSuggestionIndex) {
            selectedSuggestionIndex = idx;
            updateSelectedSuggestion();
          }
        }
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper')) {
        closeSuggestions();
      }
    });

    // 4. Search Input Event Listeners
    if (searchInput) {
      // Platform detection for keyboard shortcut hint (Mac: ⌘ K, Win/Linux: Ctrl K)
      const isMac = typeof navigator !== 'undefined' && /(Mac|iPhone|iPad|iPod)/i.test(navigator.userAgent || navigator.platform || '');
      const kbdHint = document.getElementById('search-kbd-hint');
      if (kbdHint) {
        kbdHint.textContent = isMac ? '⌘ K' : 'Ctrl K';
        kbdHint.title = `Press ${isMac ? '⌘ K' : 'Ctrl K'} or / to focus search`;
        kbdHint.setAttribute('aria-label', `Press ${isMac ? 'Command K' : 'Control K'} or forward slash to search`);
      }

      // Live typing
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        updateClearButton();
        renderFilteredTools();
        renderSuggestions(searchQuery);
      });

      // Reopen suggestions on focus if query has text
      searchInput.addEventListener('focus', () => {
        updateClearButton();
        if (searchInput.value.trim().length > 0) {
          renderSuggestions(searchInput.value);
        }
      });

      // Keyboard navigation inside search input (ArrowDown, ArrowUp, Enter, Escape)
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          if (suggestionsEl && suggestionsEl.hidden) {
            if (searchInput.value.trim().length > 0) {
              renderSuggestions(searchInput.value);
            }
            return;
          }
          if (currentSuggestions.length > 0) {
            e.preventDefault();
            selectedSuggestionIndex = (selectedSuggestionIndex + 1) % currentSuggestions.length;
            updateSelectedSuggestion();
          }
        } else if (e.key === 'ArrowUp') {
          if (currentSuggestions.length > 0 && !suggestionsEl.hidden) {
            e.preventDefault();
            selectedSuggestionIndex = selectedSuggestionIndex <= 0 ? currentSuggestions.length - 1 : selectedSuggestionIndex - 1;
            updateSelectedSuggestion();
          }
        } else if (e.key === 'Enter') {
          if (selectedSuggestionIndex >= 0 && suggestionsEl) {
            const selectedAnchor = suggestionsEl.querySelector(`[data-index="${selectedSuggestionIndex}"]`);
            if (selectedAnchor) {
              e.preventDefault();
              selectedAnchor.click();
            }
          }
        } else if (e.key === 'Escape') {
          if (suggestionsEl && !suggestionsEl.hidden) {
            e.preventDefault();
            closeSuggestions();
          }
        }
      });

      // Global keyboard shortcut: Ctrl+K / Cmd+K and '/'
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        if (e.key === '/' && document.activeElement !== searchInput) {
          const tag = document.activeElement ? document.activeElement.tagName : '';
          const isEditable = document.activeElement && (document.activeElement.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag));
          if (!isEditable) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }

    // Initial check for clear button
    updateClearButton();

    // Initial render
    renderFilteredTools();
  }

  // --- 6. Localization & Language Switcher Router ---
  const LOCALIZED_CATALOG = {
    bn: ['word-counter', 'case-converter', 'json-formatter-validator', 'password-generator', 'percentage-calculator', 'pdf-merger'],
    hi: ['word-counter', 'case-converter', 'json-formatter-validator', 'password-generator', 'percentage-calculator', 'pdf-merger'],
    es: ['word-counter', 'case-converter', 'json-formatter-validator', 'password-generator', 'percentage-calculator', 'pdf-merger'],
    fr: ['word-counter', 'case-converter', 'json-formatter-validator', 'password-generator', 'percentage-calculator', 'pdf-merger'],
    ar: ['word-counter', 'case-converter', 'json-formatter-validator', 'password-generator', 'percentage-calculator', 'pdf-merger']
  };

  const LANG_NAMES = {
    en: 'English',
    bn: 'Bengali (বাংলা)',
    hi: 'Hindi (हिन्दी)',
    es: 'Spanish (Español)',
    fr: 'French (Français)',
    ar: 'Arabic (العربية)'
  };

  function initLanguageSelector() {
    const selectors = document.querySelectorAll('.lang-selector, #lang-selector');
    if (!selectors.length) return;

    const currentLang = document.documentElement.lang || 'en';

    selectors.forEach(selector => {
      selector.value = currentLang;

      selector.addEventListener('change', (e) => {
        const targetLang = e.target.value;
        if (targetLang === currentLang) return;

        const path = window.location.pathname;
        const toolMatch = path.match(/(?:^|\/)(?:(bn|hi|es|fr|ar)\/)?tools\/([a-z0-9-]+)\.html$/i);

        if (toolMatch) {
          const toolId = toolMatch[2];
          if (targetLang === 'en') {
            window.location.href = `/tools/${toolId}.html`;
            return;
          }
          if (LOCALIZED_CATALOG[targetLang] && LOCALIZED_CATALOG[targetLang].includes(toolId)) {
            window.location.href = `/${targetLang}/tools/${toolId}.html`;
            return;
          } else {
            showToast(`${LANG_NAMES[targetLang] || targetLang} translation for this tool is scheduled in upcoming batches. You are viewing the English version.`, 4500);
            e.target.value = currentLang;
            return;
          }
        }

        // Check Informational Pages route: /pages/{pageId}.html or /{lang}/pages/{pageId}.html
        const pageMatch = path.match(/(?:^|\/)(?:(bn|hi|es|fr|ar)\/)?pages\/([a-z0-9-]+)\.html$/i);
        if (pageMatch) {
          const pageId = pageMatch[2];
          if (targetLang === 'en') {
            window.location.href = `/pages/${pageId}.html`;
          } else {
            window.location.href = `/${targetLang}/pages/${pageId}.html`;
          }
          return;
        }

        // Homepage or generic root
        if (targetLang === 'en') {
          window.location.href = '/index.html';
        } else {
          window.location.href = `/${targetLang}/index.html`;
        }
      });
    });
  }

  // --- 7. Global Setup & Event Listeners ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguageSelector();

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    initToolsDirectory();

    // Back to Top button listener
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Attach copy buttons
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-copy-target]');
      if (copyBtn) {
        const targetId = copyBtn.getAttribute('data-copy-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const textToCopy = targetEl.value !== undefined ? targetEl.value : targetEl.textContent;
          copyToClipboard(textToCopy);
        }
      }
    });
  });

  // Export functions to global scope
  window.FreeOnlineTools = {
    copyToClipboard,
    showToast,
    escapeHtml,
    toggleTheme
  };
})();
