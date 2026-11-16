/**
 * GitHub README & Notion Badge Builder Utilities
 * Generates Shields.io badge URLs, Markdown, HTML, Unicode progress bars,
 * and aesthetic GitHub / Notion callout blocks.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BadgeUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Popular Tech & Brand Logos supported by SimpleIcons on Shields.io
  const POPULAR_LOGOS = [
    { id: 'react', name: 'React', color: '61DAFB' },
    { id: 'javascript', name: 'JavaScript', color: 'F7DF1E' },
    { id: 'typescript', name: 'TypeScript', color: '3178C6' },
    { id: 'nodedotjs', name: 'Node.js', color: '5FA04E' },
    { id: 'python', name: 'Python', color: '3776AB' },
    { id: 'nextdotjs', name: 'Next.js', color: '000000' },
    { id: 'vuedotjs', name: 'Vue.js', color: '4FC08D' },
    { id: 'tailwindcss', name: 'Tailwind CSS', color: '06B6D4' },
    { id: 'html5', name: 'HTML5', color: 'E34F26' },
    { id: 'css3', name: 'CSS3', color: '1572B6' },
    { id: 'go', name: 'Go', color: '00ADD8' },
    { id: 'rust', name: 'Rust', color: '000000' },
    { id: 'docker', name: 'Docker', color: '2496ED' },
    { id: 'kubernetes', name: 'Kubernetes', color: '326CE5' },
    { id: 'amazonwebservices', name: 'AWS', color: '232F3E' },
    { id: 'googlecloud', name: 'Google Cloud', color: '4285F4' },
    { id: 'github', name: 'GitHub', color: '181717' },
    { id: 'git', name: 'Git', color: 'F05032' },
    { id: 'postgresql', name: 'PostgreSQL', color: '4169E1' },
    { id: 'mongodb', name: 'MongoDB', color: '47A248' },
    { id: 'mysql', name: 'MySQL', color: '4479A1' },
    { id: 'redis', name: 'Redis', color: 'FF4438' },
    { id: 'graphql', name: 'GraphQL', color: 'E10098' },
    { id: 'flutter', name: 'Flutter', color: '02569B' },
    { id: 'swift', name: 'Swift', color: 'F05138' },
    { id: 'kotlin', name: 'Kotlin', color: '7F52FF' },
    { id: 'android', name: 'Android', color: '34A853' },
    { id: 'apple', name: 'Apple', color: '000000' },
    { id: 'linux', name: 'Linux', color: 'FCC624' },
    { id: 'visualstudiocode', name: 'VS Code', color: '007ACC' },
    { id: 'figma', name: 'Figma', color: 'F24E1E' },
    { id: 'notion', name: 'Notion', color: '000000' },
    { id: 'discord', name: 'Discord', color: '5865F2' },
    { id: 'x', name: 'X / Twitter', color: '000000' },
    { id: 'linkedin', name: 'LinkedIn', color: '0A66C2' },
    { id: 'youtube', name: 'YouTube', color: 'FF0000' },
    { id: 'npm', name: 'npm', color: 'CB3837' }
  ];

  // Quick Preset Badges for READMEs
  const QUICK_PRESETS = [
    { label: 'License', message: 'MIT', color: 'yellow', style: 'flat' },
    { label: 'Build', message: 'Passing', color: 'success', style: 'flat' },
    { label: 'PRs', message: 'Welcome', color: 'brightgreen', style: 'flat' },
    { label: 'Version', message: 'v1.0.0', color: 'blue', style: 'flat' },
    { label: 'Coverage', message: '98%', color: 'green', style: 'flat' },
    { label: 'Discord', message: 'Join Chat', color: '5865F2', logo: 'discord', style: 'for-the-badge' },
    { label: 'Next.js', message: '15', color: 'black', logo: 'nextdotjs', style: 'for-the-badge' },
    { label: 'React', message: '19', color: '20232A', logo: 'react', logoColor: '61DAFB', style: 'for-the-badge' },
    { label: 'TypeScript', message: '5.x', color: '3178C6', logo: 'typescript', style: 'for-the-badge' },
    { label: 'Maintenance', message: 'Active', color: 'blue', style: 'flat-square' }
  ];

  // Unicode Progress Bar Fill Characters
  const PROGRESS_STYLES = {
    blocks: { filled: '█', empty: '░', name: 'Solid Blocks (████░░)' },
    squares: { filled: '■', empty: '□', name: 'Squares (■■■□□)' },
    dots: { filled: '●', empty: '○', name: 'Circles / Dots (●●●○○)' },
    shades: { filled: '▓', empty: '░', name: 'Shaded Blocks (▓▓▓░░)' },
    pipes: { filled: '|', empty: '-', name: 'Pipes (||||--)' },
    arrows: { filled: '▶', empty: '▷', name: 'Arrows (▶▶▶▷▷)' }
  };

  /**
   * Escape label/message for Shields.io URL path
   * Shields.io dash delimiter rules:
   *  - "-" must be escaped as "--"
   *  - "_" must be escaped as "__"
   */
  function escapeShields(str) {
    if (!str) return '';
    return encodeURIComponent(
      str.replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_')
    );
  }

  /**
   * Clean hex color string (removes '#' if present)
   */
  function cleanColor(color) {
    if (!color) return 'blue';
    return color.replace(/^#/, '');
  }

  /**
   * Generate Shields.io Badge URL
   */
  function generateBadgeUrl(options = {}) {
    const label = (options.label || '').trim();
    const message = (options.message || '').trim() || 'badge';
    const color = cleanColor(options.color || 'blue');
    const labelColor = options.labelColor ? cleanColor(options.labelColor) : null;
    const style = options.style || 'flat'; // flat, flat-square, for-the-badge, plastic, social
    const logo = options.logo ? options.logo.toLowerCase() : null;
    const logoColor = options.logoColor ? cleanColor(options.logoColor) : null;

    let path = '';
    if (label) {
      path = `${escapeShields(label)}-${escapeShields(message)}-${color}`;
    } else {
      path = `${escapeShields(message)}-${color}`;
    }

    const params = new URLSearchParams();
    if (style && style !== 'flat') params.set('style', style);
    if (labelColor) params.set('labelColor', labelColor);
    if (logo) params.set('logo', logo);
    if (logoColor) params.set('logoColor', logoColor);

    const queryStr = params.toString();
    return `https://img.shields.io/badge/${path}${queryStr ? '?' + queryStr : ''}`;
  }

  /**
   * Generate Markdown Badge string with optional link
   */
  function generateMarkdownBadge(options = {}, linkUrl = '') {
    const badgeUrl = generateBadgeUrl(options);
    const alt = options.label ? `${options.label} - ${options.message}` : options.message;

    if (linkUrl && linkUrl.trim()) {
      return `[![${alt}](${badgeUrl})](${linkUrl.trim()})`;
    }
    return `![${alt}](${badgeUrl})`;
  }

  /**
   * Generate HTML <img> tag with optional <a> wrapper
   */
  function generateHtmlBadge(options = {}, linkUrl = '') {
    const badgeUrl = generateBadgeUrl(options);
    const alt = options.label ? `${options.label} - ${options.message}` : options.message;

    if (linkUrl && linkUrl.trim()) {
      return `<a href="${linkUrl.trim()}"><img src="${badgeUrl}" alt="${alt}" /></a>`;
    }
    return `<img src="${badgeUrl}" alt="${alt}" />`;
  }

  /**
   * Generate Unicode Progress Bar
   * @param {number} percentage 0 to 100
   * @param {Object} options Bar configuration
   */
  function generateUnicodeProgressBar(percentage, options = {}) {
    let pct = parseFloat(percentage);
    if (isNaN(pct)) pct = 0;
    pct = Math.max(0, Math.min(100, pct));

    const totalBars = parseInt(options.length, 10) || 10;
    const styleKey = options.style || 'blocks';
    const style = PROGRESS_STYLES[styleKey] || PROGRESS_STYLES.blocks;

    const filledCount = Math.round((pct / 100) * totalBars);
    const emptyCount = Math.max(0, totalBars - filledCount);

    const barStr = style.filled.repeat(filledCount) + style.empty.repeat(emptyCount);

    const showPercentage = options.showPercentage !== false;
    const prefix = options.prefix ? options.prefix.trim() + ' ' : '';
    const suffix = options.suffix ? ' ' + options.suffix.trim() : '';

    const pctStr = showPercentage ? ` ${Math.round(pct)}%` : '';

    return `${prefix}[${barStr}]${pctStr}${suffix}`;
  }

  /**
   * Generate GitHub Markdown Alert Block
   * @param {'NOTE'|'TIP'|'IMPORTANT'|'WARNING'|'CAUTION'} type 
   * @param {string} content 
   */
  function generateGitHubAlert(type = 'NOTE', content = '') {
    const validTypes = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'];
    const alertType = validTypes.includes(type.toUpperCase()) ? type.toUpperCase() : 'NOTE';
    const text = content.trim() || 'Your message or alert content goes here.';

    const lines = text.split(/\r?\n/).map(line => `> ${line}`);
    return `> [!${alertType}]\n${lines.join('\n')}`;
  }

  /**
   * Generate Notion Callout Block formatted text
   */
  function generateNotionCallout(emoji = '💡', text = '') {
    const cleanText = text.trim() || 'Key insight or takeaway block for your Notion workspace.';
    return `> ${emoji} **${cleanText}**`;
  }

  return {
    POPULAR_LOGOS,
    QUICK_PRESETS,
    PROGRESS_STYLES,
    generateBadgeUrl,
    generateMarkdownBadge,
    generateHtmlBadge,
    generateUnicodeProgressBar,
    generateGitHubAlert,
    generateNotionCallout
  };
}));
