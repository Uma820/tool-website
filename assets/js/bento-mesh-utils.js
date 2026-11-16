/**
 * CSS Bento Grid, Mesh Gradient & Glassmorphism Utilities
 * 100% Client-Side generation engine for Bento CSS Grid, layered radial mesh gradients,
 * glassmorphic surfaces, and Tailwind/React JSX snippets.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BentoMeshUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // 1. Bento Grid Layout Presets
  const BENTO_PRESETS = {
    apple_linear: {
      id: 'apple_linear',
      name: 'Apple / Linear Feature Bento (5 Cards)',
      columns: 4,
      rows: 3,
      gap: 16,
      borderRadius: 20,
      minRowHeight: 160,
      cards: [
        { id: 1, title: 'AI Automation Engine', colSpan: 2, rowSpan: 2, accent: 'glass', tag: 'Featured' },
        { id: 2, title: 'Real-Time Sync', colSpan: 2, rowSpan: 1, accent: 'gradient', tag: 'Core' },
        { id: 3, title: 'Zero Latency', colSpan: 1, rowSpan: 1, accent: 'solid', tag: 'Speed' },
        { id: 4, title: 'Global CDN Rail', colSpan: 1, rowSpan: 1, accent: 'solid', tag: 'Infra' },
        { id: 5, title: 'End-to-End Encryption', colSpan: 2, rowSpan: 1, accent: 'solid', tag: 'Security' }
      ]
    },
    saas_analytics: {
      id: 'saas_analytics',
      name: 'SaaS Analytics Dashboard (4 Cards)',
      columns: 4,
      rows: 2,
      gap: 16,
      borderRadius: 20,
      minRowHeight: 180,
      cards: [
        { id: 1, title: 'Revenue & MRR Growth', colSpan: 2, rowSpan: 2, accent: 'glass', tag: '$148.5K' },
        { id: 2, title: 'Active Subscribers', colSpan: 2, rowSpan: 1, accent: 'solid', tag: '+34%' },
        { id: 3, title: 'Net Churn Rate', colSpan: 1, rowSpan: 1, accent: 'gradient', tag: '0.8%' },
        { id: 4, title: 'Global Traffic Split', colSpan: 1, rowSpan: 1, accent: 'solid', tag: '120 Countries' }
      ]
    },
    asymmetric_showcase: {
      id: 'asymmetric_showcase',
      name: '6-Card Asymmetric Showcase',
      columns: 4,
      rows: 3,
      gap: 16,
      borderRadius: 20,
      minRowHeight: 150,
      cards: [
        { id: 1, title: 'Flagship Platform', colSpan: 3, rowSpan: 2, accent: 'glass', tag: 'Hero' },
        { id: 2, title: 'Instant Preview', colSpan: 1, rowSpan: 1, accent: 'solid', tag: 'New' },
        { id: 3, title: 'Dark Mode UI', colSpan: 1, rowSpan: 2, accent: 'gradient', tag: 'Theme' },
        { id: 4, title: 'Developer SDKs', colSpan: 1, rowSpan: 1, accent: 'solid', tag: 'APIs' },
        { id: 5, title: 'Webhooks & Events', colSpan: 2, rowSpan: 1, accent: 'solid', tag: 'Automation' },
        { id: 6, title: 'Cloud Backups', colSpan: 1, rowSpan: 1, accent: 'solid', tag: 'Storage' }
      ]
    },
    hero_split: {
      id: 'hero_split',
      name: '2×2 Hero Split (4 Cards)',
      columns: 4,
      rows: 2,
      gap: 20,
      borderRadius: 24,
      minRowHeight: 200,
      cards: [
        { id: 1, title: 'Primary Showcase', colSpan: 2, rowSpan: 1, accent: 'glass', tag: 'Spotlight' },
        { id: 2, title: 'Key Metric Growth', colSpan: 2, rowSpan: 1, accent: 'gradient', tag: 'Metrics' },
        { id: 3, title: 'Integrations Hub', colSpan: 2, rowSpan: 1, accent: 'solid', tag: 'Ecosystem' },
        { id: 4, title: 'Community & Trust', colSpan: 2, rowSpan: 1, accent: 'solid', tag: '50K+ Teams' }
      ]
    }
  };

  // 2. Mesh Gradient Palettes
  const MESH_PALETTES = {
    indigo_violet: {
      id: 'indigo_violet',
      name: 'SaaS Indigo-Violet',
      baseColor: '#0f172a',
      orbs: [
        { color: '#6366f1', x: 20, y: 30, spread: 55 },
        { color: '#a855f7', x: 80, y: 25, spread: 50 },
        { color: '#3b82f6', x: 35, y: 80, spread: 60 },
        { color: '#ec4899', x: 85, y: 75, spread: 45 }
      ]
    },
    sunset_peach: {
      id: 'sunset_peach',
      name: 'Sunset Peach-Rose',
      baseColor: '#1e1b4b',
      orbs: [
        { color: '#f43f5e', x: 25, y: 25, spread: 55 },
        { color: '#fb923c', x: 75, y: 20, spread: 50 },
        { color: '#e11d48', x: 20, y: 75, spread: 45 },
        { color: '#facc15', x: 80, y: 80, spread: 60 }
      ]
    },
    aurora_mint: {
      id: 'aurora_mint',
      name: 'Aurora Mint-Cyan',
      baseColor: '#022c22',
      orbs: [
        { color: '#10b981', x: 15, y: 35, spread: 60 },
        { color: '#06b6d4', x: 85, y: 20, spread: 50 },
        { color: '#14b8a6', x: 40, y: 80, spread: 55 },
        { color: '#3b82f6', x: 80, y: 70, spread: 45 }
      ]
    },
    dark_obsidian: {
      id: 'dark_obsidian',
      name: 'Dark Obsidian Neon',
      baseColor: '#09090b',
      orbs: [
        { color: '#38bdf8', x: 20, y: 20, spread: 40 },
        { color: '#818cf8', x: 75, y: 30, spread: 45 },
        { color: '#c084fc', x: 30, y: 80, spread: 50 },
        { color: '#f472b6', x: 85, y: 85, spread: 35 }
      ]
    },
    warm_cream: {
      id: 'warm_cream',
      name: 'Warm Cream Pastel',
      baseColor: '#fdfbf7',
      orbs: [
        { color: '#fcd34d', x: 20, y: 25, spread: 60 },
        { color: '#fdba74', x: 80, y: 30, spread: 55 },
        { color: '#f472b6', x: 30, y: 75, spread: 50 },
        { color: '#a7f3d0', x: 80, y: 80, spread: 55 }
      ]
    }
  };

  /**
   * Generate Bento CSS and Markup Snippets
   */
  function generateBentoCSS(config) {
    const { columns, gap, borderRadius, minRowHeight } = config;
    return [
      `/* Bento Grid Container */`,
      `.bento-grid {`,
      `  display: grid;`,
      `  grid-template-columns: repeat(${columns}, minmax(0, 1fr));`,
      `  gap: ${gap}px;`,
      `  grid-auto-rows: minmax(${minRowHeight}px, auto);`,
      `}`,
      ``,
      `/* Base Bento Card */`,
      `.bento-card {`,
      `  border-radius: ${borderRadius}px;`,
      `  padding: 1.5rem;`,
      `  border: 1px solid rgba(255, 255, 255, 0.1);`,
      `  overflow: hidden;`,
      `  position: relative;`,
      `}`,
      ``,
      `/* Responsive Stacking */`,
      `@media (max-width: 768px) {`,
      `  .bento-grid {`,
      `    grid-template-columns: 1fr;`,
      `  }`,
      `  .bento-card {`,
      `    grid-column: span 1 !important;`,
      `    grid-row: span 1 !important;`,
      `  }`,
      `}`
    ].join('\n');
  }

  function generateBentoTailwindHTML(config) {
    const { columns, gap, borderRadius, cards } = config;
    const cardSnippets = cards.map(c => {
      let bgStyle = 'bg-slate-900/60 border border-slate-800 text-white';
      if (c.accent === 'glass') {
        bgStyle = 'backdrop-blur-md bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-white/10 shadow-xl';
      } else if (c.accent === 'gradient') {
        bgStyle = 'bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-indigo-500/30';
      }

      return [
        `  <!-- Card: ${c.title} -->`,
        `  <div class="col-span-${c.colSpan} row-span-${c.rowSpan} rounded-[${borderRadius}px] p-6 ${bgStyle} flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">`,
        `    <div class="flex items-center justify-between">`,
        `      <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300">${c.tag || 'Feature'}</span>`,
        `    </div>`,
        `    <div class="mt-8">`,
        `      <h3 class="text-xl font-bold tracking-tight">${c.title}</h3>`,
        `      <p class="text-sm text-slate-400 mt-1">High-performance modular architecture crafted for modern digital applications.</p>`,
        `    </div>`,
        `  </div>`
      ].join('\n');
    }).join('\n\n');

    return [
      `<!-- Responsive Bento Grid Layout -->`,
      `<section class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">`,
      `  <div class="grid grid-cols-1 md:grid-cols-${columns} gap-[${gap}px]">`,
      cardSnippets,
      `  </div>`,
      `</section>`
    ].join('\n');
  }

  function generateBentoReactJSX(config) {
    const { columns, gap, borderRadius, cards } = config;

    return [
      `import React from 'react';`,
      ``,
      `export default function BentoFeatureSection() {`,
      `  const cards = ${JSON.stringify(cards, null, 2)};`,
      ``,
      `  return (`,
      `    <section className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">`,
      `      <div className="grid grid-cols-1 md:grid-cols-${columns} gap-[${gap}px]">`,
      `        {cards.map((card) => (`,
      `          <div`,
      `            key={card.id}`,
      `            className={\`col-span-1 md:col-span-\${card.colSpan} row-span-\${card.rowSpan} rounded-[${borderRadius}px] p-6 flex flex-col justify-between border transition-all duration-200 hover:scale-[1.01] \${`,
      `              card.accent === 'glass'`,
      `                ? 'backdrop-blur-md bg-white/10 dark:bg-slate-900/40 border-white/20 dark:border-white/10 shadow-xl'`,
      `                : card.accent === 'gradient'`,
      `                ? 'bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border-indigo-500/30'`,
      `                : 'bg-slate-900/70 border-slate-800 text-white'`,
      `            }\`}`,
      `          >`,
      `            <div className="flex items-center justify-between">`,
      `              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300">`,
      `                {card.tag || 'Feature'}`,
      `              </span>`,
      `            </div>`,
      `            <div className="mt-8">`,
      `              <h3 className="text-xl font-bold tracking-tight">{card.title}</h3>`,
      `              <p className="text-sm text-slate-400 mt-1">`,
      `                High-performance modular architecture crafted for modern digital applications.`,
      `              </p>`,
      `            </div>`,
      `          </div>`,
      `        ))}`,
      `      </div>`,
      `    </section>`,
      `  );`,
      `}`
    ].join('\n');
  }

  /**
   * Generate Mesh Gradient CSS & SVG Noise
   */
  function generateMeshCSS(baseColor, orbs, noiseOpacity = 0.12) {
    const radialLayers = orbs.map(orb => {
      return `radial-gradient(at ${orb.x}% ${orb.y}%, ${orb.color} 0px, transparent ${orb.spread}%)`;
    }).join(',\n    ');

    const cssOutput = [
      `/* Pure Layered Mesh Gradient */`,
      `.mesh-background {`,
      `  background-color: ${baseColor};`,
      `  background-image:`,
      `    ${radialLayers};`,
      `  background-size: 100% 100%;`,
      `  background-repeat: no-repeat;`,
      `}`
    ].join('\n');

    return cssOutput;
  }

  function generateMeshTailwindClass(baseColor, orbs) {
    const layers = orbs.map(orb => `radial-gradient(at_${orb.x}%_${orb.y}%,_${orb.color}_0px,_transparent_${orb.spread}%)`).join(',_');
    return `bg-[${baseColor}] bg-[${layers}] bg-no-repeat bg-cover`;
  }

  /**
   * Generate Glassmorphism CSS & Tailwind
   */
  function generateGlassCSS(config) {
    const { blur, opacity, tintColor, saturation, borderOpacity, shadow } = config;

    // Convert tint hex to rgba
    const r = parseInt(tintColor.slice(1, 3), 16) || 255;
    const g = parseInt(tintColor.slice(3, 5), 16) || 255;
    const b = parseInt(tintColor.slice(5, 7), 16) || 255;

    const bgRgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    const borderRgba = `rgba(${r}, ${g}, ${b}, ${borderOpacity})`;
    const boxShadowCss = shadow
      ? `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25);`
      : `box-shadow: none;`;

    return [
      `/* Glassmorphic Card */`,
      `.glass-card {`,
      `  background: ${bgRgba};`,
      `  backdrop-filter: blur(${blur}px) saturate(${saturation}%);`,
      `  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);`,
      `  border: 1px solid ${borderRgba};`,
      `  border-radius: 20px;`,
      `  ${boxShadowCss}`,
      `}`
    ].join('\n');
  }

  function generateGlassTailwindClasses(config) {
    const { blur, opacity, shadow } = config;
    const blurClass = blur >= 24 ? 'backdrop-blur-xl' : (blur >= 16 ? 'backdrop-blur-md' : 'backdrop-blur-sm');
    const opacityPct = Math.round(opacity * 100);
    const shadowClass = shadow ? 'shadow-2xl' : 'shadow-none';

    return `${blurClass} bg-white/${opacityPct} dark:bg-black/${opacityPct} border border-white/20 dark:border-white/10 ${shadowClass} rounded-2xl`;
  }

  /**
   * Combined Full Component Export
   */
  function generateCombinedComponent(bentoConfig, meshConfig, glassConfig) {
    return [
      `<!-- Full Combined Bento + Mesh Gradient + Glassmorphism UI Component -->`,
      `<div class="relative min-h-screen p-6 sm:p-12 overflow-hidden bg-[${meshConfig.baseColor}]"`,
      `     style="background-image: ${meshConfig.orbs.map(o => `radial-gradient(at ${o.x}% ${o.y}%, ${o.color} 0px, transparent ${o.spread}%)`).join(', ')};">`,
      `  `,
      `  <!-- Bento Grid Container -->`,
      `  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-${bentoConfig.columns} gap-[${bentoConfig.gap}px]">`,
      bentoConfig.cards.map(c => `    <div class="col-span-1 md:col-span-${c.colSpan} row-span-${c.rowSpan} rounded-[${bentoConfig.borderRadius}px] p-6 backdrop-blur-[${glassConfig.blur}px] bg-white/[${glassConfig.opacity}] border border-white/[${glassConfig.borderOpacity}] ${glassConfig.shadow ? 'shadow-2xl' : ''} text-white flex flex-col justify-between">
      <span class="text-xs uppercase tracking-wider font-bold px-3 py-1 bg-white/10 rounded-full w-max">${c.tag || 'Module'}</span>
      <h3 class="text-xl font-bold mt-6">${c.title}</h3>
    </div>`).join('\n'),
      `  </div>`,
      `</div>`
    ].join('\n');
  }

  return {
    BENTO_PRESETS,
    MESH_PALETTES,
    generateBentoCSS,
    generateBentoTailwindHTML,
    generateBentoReactJSX,
    generateMeshCSS,
    generateMeshTailwindClass,
    generateGlassCSS,
    generateGlassTailwindClasses,
    generateCombinedComponent
  };
}));
