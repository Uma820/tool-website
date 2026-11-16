/**
 * Newsletter Sponsorship & CPM Rate Calculator Utilities
 * 100% Client-Side calculation engine for creator ad slot pricing,
 * reverse CPM evaluation, multi-issue bundles, and media-kit pitch generators.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NewsletterCalcUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Supported Currencies & Baseline Rates relative to 1 USD
  const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', rate: 1.00, name: 'US Dollar' },
    INR: { code: 'INR', symbol: '₹', rate: 84.50, name: 'Indian Rupee' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' }
  };

  // Niche Presets with Benchmark Open-CPM (USD)
  const NICHES = {
    finance: {
      id: 'finance',
      name: 'Finance, Crypto & Investing',
      cpm: 65,
      description: 'High-earning retail investors, fintech professionals, and traders ($55 - $85 Open-CPM).'
    },
    b2b_saas: {
      id: 'b2b_saas',
      name: 'B2B SaaS, AI & Software Dev',
      cpm: 60,
      description: 'Founders, CTOs, engineers, and product decision-makers ($50 - $75 Open-CPM).'
    },
    marketing: {
      id: 'marketing',
      name: 'Marketing, Startups & Creator Economy',
      cpm: 45,
      description: 'Growth marketers, agency owners, bootstrappers, and digital creators ($35 - $55 Open-CPM).'
    },
    health: {
      id: 'health',
      name: 'Health, Fitness & Productivity',
      cpm: 35,
      description: 'Wellness enthusiasts, biohackers, athletes, and busy professionals ($28 - $45 Open-CPM).'
    },
    news: {
      id: 'news',
      name: 'General News, Culture & Entertainment',
      cpm: 22,
      description: 'Broad consumer readership with general lifestyle interests ($18 - $30 Open-CPM).'
    },
    custom: {
      id: 'custom',
      name: 'Custom Open-CPM',
      cpm: 40,
      description: 'Enter your custom Open-CPM based on bespoke audience demographics.'
    }
  };

  // Ad Placement Types & Valuation Multipliers
  const PLACEMENTS = {
    primary: {
      id: 'primary',
      name: 'Primary / Top Sponsor',
      multiplier: 1.00,
      description: '"Presented by" above the fold with 150-word blurb, logo & CTA button (1.0x baseline).'
    },
    dedicated: {
      id: 'dedicated',
      name: 'Dedicated Solo Blast',
      multiplier: 2.30,
      description: '100% exclusive dedicated email broadcast with zero editorial content (2.3x multiplier).'
    },
    secondary: {
      id: 'secondary',
      name: 'Mid-Newsletter Secondary Sponsor',
      multiplier: 0.65,
      description: '75-word sponsor card placed midway through the newsletter content (0.65x multiplier).'
    },
    footer: {
      id: 'footer',
      name: 'Footer / Classified Text Ad',
      multiplier: 0.30,
      description: '2-line quick link or classified ad block at the bottom of the email (0.30x multiplier).'
    }
  };

  /**
   * Calculate Creator Fair Ad Slot Rate (Mode 1)
   */
  function calculateCreatorRate(params = {}) {
    const subscribers = Math.max(0, parseInt(params.subscribers, 10) || 0);
    const openRatePct = Math.max(0, Math.min(100, parseFloat(params.openRatePct) || 0));
    const ctrPct = Math.max(0, Math.min(100, parseFloat(params.ctrPct) || 0));
    const openCpm = Math.max(0, parseFloat(params.openCpm) || 0);
    const placementMultiplier = Math.max(0, parseFloat(params.placementMultiplier) || 1.0);
    const currencyCode = params.currencyCode && CURRENCIES[params.currencyCode] ? params.currencyCode : 'USD';
    const fxRate = CURRENCIES[currencyCode].rate;

    // Delivery metrics
    const uniqueOpens = Math.round(subscribers * (openRatePct / 100));
    const estimatedClicks = Math.round(uniqueOpens * (ctrPct / 100));

    // Base Fair Price (in USD): (Unique Opens / 1,000) * Open-CPM * Placement Multiplier
    const fairPriceUsd = (uniqueOpens / 1000) * openCpm * placementMultiplier;

    // Converted to target currency
    const fairPrice = Math.round(fairPriceUsd * fxRate);
    const floorPrice = Math.round(fairPrice * 0.85); // -15% negotiation floor
    const anchorPrice = Math.round(fairPrice * 1.20); // +20% premium anchor

    // Effective metrics
    const effectiveCpcUsd = estimatedClicks > 0 ? (fairPriceUsd / estimatedClicks) : 0;
    const effectiveCpc = estimatedClicks > 0 ? (fairPrice / estimatedClicks) : 0;
    const subscriberCpm = subscribers > 0 ? ((fairPriceUsd / subscribers) * 1000) : 0;

    return {
      subscribers,
      openRatePct,
      ctrPct,
      openCpm,
      placementMultiplier,
      currencyCode,
      currencySymbol: CURRENCIES[currencyCode].symbol,
      uniqueOpens,
      estimatedClicks,
      fairPrice,
      floorPrice,
      anchorPrice,
      effectiveCpc: Math.round(effectiveCpc * 100) / 100,
      effectiveCpcUsd: Math.round(effectiveCpcUsd * 100) / 100,
      subscriberCpm: Math.round(subscriberCpm * 100) / 100
    };
  }

  /**
   * Reverse CPM & Sponsor Offer Evaluation (Mode 2)
   */
  function calculateSponsorOffer(params = {}) {
    const offerAmount = Math.max(0, parseFloat(params.offerAmount) || 0);
    const subscribers = Math.max(0, parseInt(params.subscribers, 10) || 0);
    const openRatePct = Math.max(0, Math.min(100, parseFloat(params.openRatePct) || 0));
    const ctrPct = Math.max(0, Math.min(100, parseFloat(params.ctrPct) || 0));
    const baselineCpm = Math.max(1, parseFloat(params.baselineCpm) || 45);
    const currencyCode = params.currencyCode && CURRENCIES[params.currencyCode] ? params.currencyCode : 'USD';
    const fxRate = CURRENCIES[currencyCode].rate;

    const uniqueOpens = Math.round(subscribers * (openRatePct / 100));
    const estimatedClicks = Math.round(uniqueOpens * (ctrPct / 100));

    // Convert offer into USD baseline for benchmarking
    const offerUsd = fxRate > 0 ? (offerAmount / fxRate) : offerAmount;

    const effectiveOpenCpm = uniqueOpens > 0 ? (offerUsd / (uniqueOpens / 1000)) : 0;
    const effectiveSubscriberCpm = subscribers > 0 ? (offerUsd / (subscribers / 1000)) : 0;
    const effectiveCpc = estimatedClicks > 0 ? (offerAmount / estimatedClicks) : 0;

    // Rating: compare effectiveOpenCpm to baselineCpm
    let rating = 'fair'; // 'below' | 'fair' | 'premium'
    let ratingLabel = 'Fair Market Rate';
    let ratingDescription = 'This offer matches current industry averages for your niche and reader engagement.';

    const ratio = baselineCpm > 0 ? (effectiveOpenCpm / baselineCpm) : 1;
    if (ratio < 0.80) {
      rating = 'below';
      ratingLabel = 'Below Market Rate (Lowball)';
      ratingDescription = `This offer equates to only $${effectiveOpenCpm.toFixed(1)} Open-CPM, which is significantly below your niche benchmark of $${baselineCpm.toFixed(0)} Open-CPM. Consider counter-offering.`;
    } else if (ratio > 1.25) {
      rating = 'premium';
      ratingLabel = 'Premium Offer (High Value)';
      ratingDescription = `This sponsor is offering a generous $${effectiveOpenCpm.toFixed(1)} Open-CPM (${Math.round((ratio - 1) * 100)}% above industry average). Highly favorable offer.`;
    }

    return {
      offerAmount,
      currencyCode,
      currencySymbol: CURRENCIES[currencyCode].symbol,
      uniqueOpens,
      estimatedClicks,
      effectiveOpenCpm: Math.round(effectiveOpenCpm * 100) / 100,
      effectiveSubscriberCpm: Math.round(effectiveSubscriberCpm * 100) / 100,
      effectiveCpc: Math.round(effectiveCpc * 100) / 100,
      rating,
      ratingLabel,
      ratingDescription
    };
  }

  /**
   * Multi-Issue Package Bundler
   */
  function generateBundlePackages(singleRate) {
    const rate = Math.max(0, singleRate);

    const b1Rate = rate;
    const b4Rate = Math.round(rate * 0.90);
    const b8Rate = Math.round(rate * 0.85);
    const b12Rate = Math.round(rate * 0.80);

    return [
      {
        issues: 1,
        title: 'Single Issue (1x)',
        discountPct: 0,
        perIssueRate: b1Rate,
        totalPrice: b1Rate,
        savings: 0,
        description: 'Standard single newsletter sponsorship.'
      },
      {
        issues: 4,
        title: 'Monthly Pack (4x)',
        discountPct: 10,
        perIssueRate: b4Rate,
        totalPrice: b4Rate * 4,
        savings: Math.max(0, (rate * 4) - (b4Rate * 4)),
        description: '1 sponsor ad in every weekly issue for a month (Save 10%).'
      },
      {
        issues: 8,
        title: 'Bi-Monthly Pack (8x)',
        discountPct: 15,
        perIssueRate: b8Rate,
        totalPrice: b8Rate * 8,
        savings: Math.max(0, (rate * 8) - (b8Rate * 8)),
        description: 'Consistent bi-monthly omnipresence (Save 15%).'
      },
      {
        issues: 12,
        title: 'Quarterly Takeover (12x)',
        discountPct: 20,
        perIssueRate: b12Rate,
        totalPrice: b12Rate * 12,
        savings: Math.max(0, (rate * 12) - (b12Rate * 12)),
        description: 'Exclusive quarterly anchor sponsor partner (Save 20%).'
      }
    ];
  }

  /**
   * Annual Sponsorship Revenue Projections
   */
  function generateAnnualProjections(singleRate) {
    const rate = Math.max(0, singleRate);

    return {
      onePerMonth: {
        slotsPerMonth: 1,
        annualIssues: 12,
        monthlyGross: rate,
        annualGross: rate * 12
      },
      twoPerMonth: {
        slotsPerMonth: 2,
        annualIssues: 24,
        monthlyGross: rate * 2,
        annualGross: rate * 24
      },
      fourPerMonth: {
        slotsPerMonth: 4,
        annualIssues: 52, // weekly single slot
        monthlyGross: Math.round(rate * 4.33),
        annualGross: rate * 52
      }
    };
  }

  /**
   * Format Ready-to-Send Media Kit Pitch Snippet
   */
  function formatPitchSnippet(data) {
    const sym = data.currencySymbol || '$';
    const bundles = generateBundlePackages(data.fairPrice);

    return [
      `Hi [Sponsor Name],`,
      ``,
      `Thanks for your interest in partnering with [Newsletter Name]! Here is our current media kit snapshot and sponsorship rate card:`,
      ``,
      `📊 AUDIENCE & ENGAGEMENT METRICS:`,
      `• Total Active Subscribers: ${data.subscribers.toLocaleString()} Verified Readers`,
      `• Average Open Rate: ${data.openRatePct}% (~${data.uniqueOpens.toLocaleString()} unique opens per send)`,
      `• Average CTR: ${data.ctrPct}% (~${data.estimatedClicks.toLocaleString()} estimated sponsor clicks per issue)`,
      `• Primary Readership: ${data.nicheName || 'Professional Leaders & Decision-Makers'}`,
      ``,
      `💼 AD SLOTS & RATE CARD (${data.placementName || 'Primary Sponsor'}):`,
      `• Single Issue: ${sym}${data.fairPrice.toLocaleString()} / issue`,
      `• 4-Issue Monthly Package (10% Off): ${sym}${bundles[1].totalPrice.toLocaleString()} (${sym}${bundles[1].perIssueRate.toLocaleString()}/send)`,
      `• 8-Issue Campaign (15% Off): ${sym}${bundles[2].totalPrice.toLocaleString()} (${sym}${bundles[2].perIssueRate.toLocaleString()}/send)`,
      `• 12-Issue Quarterly Partner (20% Off): ${sym}${bundles[3].totalPrice.toLocaleString()} (${sym}${bundles[3].perIssueRate.toLocaleString()}/send)`,
      ``,
      `Each primary sponsorship includes a "Presented by" header, up to 150 words of copy, your logo, and 2 trackable call-to-action links.`,
      ``,
      `Would you like to reserve a date for next month?`,
      ``,
      `Best regards,`,
      `[Your Name]`
    ].join('\n');
  }

  return {
    CURRENCIES,
    NICHES,
    PLACEMENTS,
    calculateCreatorRate,
    calculateSponsorOffer,
    generateBundlePackages,
    generateAnnualProjections,
    formatPitchSnippet
  };
}));
