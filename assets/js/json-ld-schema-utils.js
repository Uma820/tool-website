/**
 * JSON-LD Schema Markup Utilities
 * 100% Client-Side generation, cleaning, validation, and formatting of Google Rich Snippet schemas:
 * FAQPage, LocalBusiness, HowTo, Article/BlogPosting, Product with AggregateRating, and BreadcrumbList.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JsonLdSchemaUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Recursively strip out empty strings, nulls, undefined values,
   * empty arrays, and empty objects so the resulting JSON-LD is 100% clean
   * and never triggers Google Structured Data warnings.
   */
  function cleanObject(obj) {
    if (obj === null || obj === undefined) return undefined;
    if (typeof obj === 'string') {
      const trimmed = obj.trim();
      return trimmed === '' ? undefined : trimmed;
    }
    if (typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      const cleanedArr = obj
        .map(item => cleanObject(item))
        .filter(item => item !== undefined);
      return cleanedArr.length > 0 ? cleanedArr : undefined;
    }

    const cleanedObj = {};
    let hasKeys = false;

    for (const [key, val] of Object.entries(obj)) {
      const cleanedVal = cleanObject(val);
      if (cleanedVal !== undefined) {
        cleanedObj[key] = cleanedVal;
        hasKeys = true;
      }
    }

    return hasKeys ? cleanedObj : undefined;
  }

  /**
   * Convert hours and minutes into ISO 8601 duration format (e.g. PT1H30M, PT45M)
   */
  function durationToISO8601(hours = 0, minutes = 0) {
    const h = parseInt(hours, 10) || 0;
    const m = parseInt(minutes, 10) || 0;

    if (h === 0 && m === 0) return undefined;

    let res = 'PT';
    if (h > 0) res += `${h}H`;
    if (m > 0) res += `${m}M`;
    return res;
  }

  /**
   * 1. FAQPage Schema Generator
   */
  function generateFAQSchema(faqs = []) {
    const items = faqs
      .filter(f => f && (f.question || f.answer))
      .map(f => ({
        '@type': 'Question',
        name: f.question || '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer || ''
        }
      }));

    const raw = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items
    };

    return cleanObject(raw) || { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };
  }

  /**
   * 2. LocalBusiness Schema Generator
   */
  function generateLocalBusinessSchema(data = {}) {
    const openingHours = Array.isArray(data.openingHours)
      ? data.openingHours
          .filter(h => h && h.dayOfWeek && h.opens && h.closes)
          .map(h => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.dayOfWeek,
            opens: h.opens,
            closes: h.closes
          }))
      : undefined;

    const raw = {
      '@context': 'https://schema.org',
      '@type': data.businessType || 'LocalBusiness',
      name: data.name,
      description: data.description,
      image: data.image,
      telephone: data.telephone,
      email: data.email,
      url: data.url,
      priceRange: data.priceRange,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.streetAddress,
        addressLocality: data.city,
        addressRegion: data.state,
        postalCode: data.postalCode,
        addressCountry: data.country
      },
      geo: (data.latitude && data.longitude) ? {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude)
      } : undefined,
      openingHoursSpecification: openingHours
    };

    return cleanObject(raw) || { '@context': 'https://schema.org', '@type': data.businessType || 'LocalBusiness' };
  }

  /**
   * 3. HowTo Schema Generator
   */
  function generateHowToSchema(data = {}) {
    const steps = Array.isArray(data.steps)
      ? data.steps
          .filter(s => s && (s.name || s.text))
          .map((s, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            name: s.name,
            text: s.text,
            image: s.image,
            url: s.url
          }))
      : undefined;

    const supplies = Array.isArray(data.supplies)
      ? data.supplies
          .filter(Boolean)
          .map(item => ({ '@type': 'HowToSupply', name: item }))
      : undefined;

    const tools = Array.isArray(data.tools)
      ? data.tools
          .filter(Boolean)
          .map(item => ({ '@type': 'HowToTool', name: item }))
      : undefined;

    const isoDuration = durationToISO8601(data.hours, data.minutes);

    const raw = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: data.name,
      description: data.description,
      image: data.image,
      totalTime: isoDuration,
      estimatedCost: data.costValue ? {
        '@type': 'MonetaryAmount',
        currency: data.costCurrency || 'USD',
        value: data.costValue
      } : undefined,
      supply: supplies,
      tool: tools,
      step: steps
    };

    return cleanObject(raw) || { '@context': 'https://schema.org', '@type': 'HowTo' };
  }

  /**
   * 4. Article / BlogPosting Schema Generator
   */
  function generateArticleSchema(data = {}) {
    const raw = {
      '@context': 'https://schema.org',
      '@type': data.articleType || 'Article',
      headline: data.headline,
      description: data.description,
      image: data.image,
      author: data.authorName ? {
        '@type': data.authorType || 'Person',
        name: data.authorName,
        url: data.authorUrl
      } : undefined,
      publisher: data.publisherName ? {
        '@type': 'Organization',
        name: data.publisherName,
        logo: data.publisherLogo ? {
          '@type': 'ImageObject',
          url: data.publisherLogo
        } : undefined
      } : undefined,
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished
    };

    return cleanObject(raw) || { '@context': 'https://schema.org', '@type': data.articleType || 'Article' };
  }

  /**
   * 5. Product & AggregateRating Schema Generator
   */
  function generateProductSchema(data = {}) {
    const hasOffer = data.price !== undefined && data.price !== '' && data.price !== null;
    const hasRating = data.ratingValue !== undefined && data.ratingValue !== '' && data.ratingValue !== null;

    const raw = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      image: data.image,
      description: data.description,
      brand: data.brand ? {
        '@type': 'Brand',
        name: data.brand
      } : undefined,
      sku: data.sku,
      offers: hasOffer ? {
        '@type': 'Offer',
        price: parseFloat(data.price),
        priceCurrency: data.currency || 'USD',
        availability: data.availability ? `https://schema.org/${data.availability}` : undefined,
        url: data.productUrl
      } : undefined,
      aggregateRating: hasRating ? {
        '@type': 'AggregateRating',
        ratingValue: parseFloat(data.ratingValue),
        reviewCount: parseInt(data.reviewCount, 10) || 1,
        bestRating: 5,
        worstRating: 1
      } : undefined
    };

    return cleanObject(raw) || { '@context': 'https://schema.org', '@type': 'Product' };
  }

  /**
   * 6. BreadcrumbList Schema Generator
   */
  function generateBreadcrumbSchema(items = []) {
    const listElements = items
      .filter(item => item && (item.name || item.url))
      .map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: item.url
      }));

    const raw = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: listElements
    };

    return cleanObject(raw) || { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [] };
  }

  /**
   * Validate schema completeness against Google Rich Snippet specifications
   */
  function validateSchema(schemaType, data = {}) {
    const missingRequired = [];
    const missingRecommended = [];

    switch (schemaType) {
      case 'faq': {
        const faqs = Array.isArray(data) ? data : (data.faqs || []);
        const validFaqs = faqs.filter(f => f && f.question && f.answer);
        if (validFaqs.length === 0) {
          missingRequired.push('At least 1 Question & Answer pair');
        } else if (validFaqs.length < 2) {
          missingRecommended.push('At least 2 FAQs for accordion rich snippet');
        }
        break;
      }

      case 'localbusiness': {
        if (!data.name) missingRequired.push('Business Name');
        if (!data.city || !data.streetAddress) missingRequired.push('Street Address & City');
        if (!data.telephone && !data.url) missingRequired.push('Telephone or Website URL');
        if (!data.image) missingRecommended.push('Business Image / Storefront Photo');
        if (!data.priceRange) missingRecommended.push('Price Range ($–$$$$)');
        if (!data.latitude || !data.longitude) missingRecommended.push('Geo Coordinates (Latitude/Longitude)');
        if (!data.openingHours || data.openingHours.length === 0) missingRecommended.push('Opening Hours Schedule');
        break;
      }

      case 'howto': {
        if (!data.name) missingRequired.push('HowTo Title / Guide Name');
        const steps = Array.isArray(data.steps) ? data.steps.filter(s => s && (s.name || s.text)) : [];
        if (steps.length < 2) missingRequired.push('At least 2 HowTo Steps');
        if (!data.description) missingRecommended.push('Guide Description');
        if (!data.hours && !data.minutes) missingRecommended.push('Total Execution Time');
        if (!data.image) missingRecommended.push('Featured HowTo Image');
        break;
      }

      case 'article': {
        if (!data.headline) missingRequired.push('Article Headline');
        if (!data.authorName) missingRequired.push('Author Name');
        if (!data.datePublished) missingRequired.push('Date Published');
        if (!data.image) missingRecommended.push('Featured Article Image');
        if (!data.description) missingRecommended.push('Short Summary / Description');
        if (!data.publisherName) missingRecommended.push('Publisher Name & Logo');
        break;
      }

      case 'product': {
        if (!data.name) missingRequired.push('Product Name');
        const hasOffer = data.price !== undefined && data.price !== '' && data.price !== null;
        const hasRating = data.ratingValue !== undefined && data.ratingValue !== '' && data.ratingValue !== null;
        if (!hasOffer && !hasRating) missingRequired.push('Either Price/Offer or Rating Value');
        if (!data.image) missingRecommended.push('Product Image URL');
        if (!data.brand) missingRecommended.push('Brand Name');
        if (!data.sku) missingRecommended.push('SKU or Identifier');
        if (hasRating && !data.reviewCount) missingRecommended.push('Review Count for AggregateRating');
        break;
      }

      case 'breadcrumb': {
        const items = Array.isArray(data) ? data : (data.items || []);
        const validItems = items.filter(i => i && i.name && i.url);
        if (validItems.length < 2) {
          missingRequired.push('At least 2 Breadcrumb Levels (Home + Target Page)');
        }
        break;
      }

      default:
        break;
    }

    return {
      isValid: missingRequired.length === 0,
      missingRequired,
      missingRecommended
    };
  }

  /**
   * Format Schema Object into HTML script tag or formatted JSON
   */
  function formatOutput(schemaObj, format = 'html', indent = 2) {
    if (!schemaObj) return '';
    const jsonStr = JSON.stringify(schemaObj, null, indent);

    if (format === 'html') {
      return `<script type="application/ld+json">\n${jsonStr}\n<\/script>`;
    } else if (format === 'minified') {
      return JSON.stringify(schemaObj);
    }
    return jsonStr;
  }

  /**
   * Sample Demonstration Data for all 6 Schema Types
   */
  const SAMPLE_DATA = {
    faq: [
      {
        question: 'What is JSON-LD structured data and why does Google prefer it?',
        answer: 'JSON-LD (JavaScript Object Notation for Linked Data) is a standard format for providing search engines with explicit clues about the meaning of a webpage. Google officially recommends JSON-LD over Microdata or RDFa because it can be injected directly into the HTML <head> without altering existing visible markup.'
      },
      {
        question: 'How do rich snippets impact click-through rates (CTR)?',
        answer: 'Google Rich Results with star ratings, FAQ drop-downs, and product pricing typically increase organic CTR by 20% to 35% by occupying more vertical visual real estate on the Search Engine Results Page (SERP).'
      },
      {
        question: 'Where should I paste this JSON-LD schema code?',
        answer: 'You can paste the generated <script type="application/ld+json"> tag anywhere in your HTML, but placing it inside the <head>...</head> or right before the closing </body> tag is standard practice.'
      }
    ],

    localbusiness: {
      businessType: 'Restaurant',
      name: 'Sunset Bistro & Wine Bar',
      description: 'Artisanal farm-to-table Mediterranean dining with coastal views and curated vintage wines.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      telephone: '+1-555-839-2041',
      email: 'reservations@sunsetbistro.example',
      url: 'https://sunsetbistro.example',
      priceRange: '$$$',
      streetAddress: '742 Evergreen Promenade',
      city: 'Santa Monica',
      state: 'CA',
      postalCode: '90401',
      country: 'US',
      latitude: 34.0195,
      longitude: -118.4912,
      openingHours: [
        { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '11:30', closes: '22:00' },
        { dayOfWeek: ['Saturday', 'Sunday'], opens: '10:00', closes: '23:30' }
      ]
    },

    howto: {
      name: 'How to Build an Ergonomic Standing Desk from Scratch',
      description: 'A complete step-by-step DIY woodworking guide to building an electric motorized standing desk on a weekend budget.',
      image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c',
      hours: 2,
      minutes: 30,
      costCurrency: 'USD',
      costValue: '185.00',
      supplies: ['1x Solid Birch Butcher Block (60" x 30")', 'Dual-Motor Standing Desk Frame Kit', 'Wood Finish / Polyurethane Satin Coat'],
      tools: ['Cordless Drill & Driver', 'Orbital Sander (120/220 Grit)', 'Measuring Tape'],
      steps: [
        {
          name: 'Sand and Prep the Butcher Block',
          text: 'Thoroughly sand the wood surface starting with 120-grit sandpaper and finish with 220-grit for a glass-smooth desktop finish.',
          image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c'
        },
        {
          name: 'Apply Protective Polyurethane Finish',
          text: 'Apply two thin coats of clear satin polyurethane, waiting 4 hours between coats and lightly buffing with fine steel wool.',
          image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5'
        },
        {
          name: 'Assemble and Secure the Motorized Frame',
          text: 'Invert the tabletop, center the motorized metal frame with a tape measure, pre-drill pilot holes, and fasten securely with wood screws.',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'
        }
      ]
    },

    article: {
      articleType: 'BlogPosting',
      headline: 'The Ultimate Guide to Core Web Vitals and Modern SEO Ranking Signals',
      description: 'Learn how Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) directly influence organic search rankings.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      authorType: 'Person',
      authorName: 'Sarah Jenkins',
      authorUrl: 'https://example.com/authors/sarah-jenkins',
      publisherName: 'Search Insights Media',
      publisherLogo: 'https://example.com/logo.png',
      datePublished: '2026-03-15',
      dateModified: '2026-11-10'
    },

    product: {
      name: 'UltraLite Carbon Wireless Mechanical Keyboard',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      description: 'Hot-swappable low-profile mechanical keyboard with custom lubed switches and multi-device Bluetooth 5.3 connectivity.',
      brand: 'AeroType Labs',
      sku: 'AERO-CARB-65',
      price: '129.99',
      currency: 'USD',
      availability: 'InStock',
      productUrl: 'https://example.com/products/carbon-keyboard',
      ratingValue: '4.9',
      reviewCount: 382
    },

    breadcrumb: [
      { name: 'Home', url: 'https://example.com/' },
      { name: 'Technology', url: 'https://example.com/tech' },
      { name: 'Keyboards', url: 'https://example.com/tech/keyboards' },
      { name: 'Wireless Mechanical', url: 'https://example.com/tech/keyboards/wireless' }
    ]
  };

  return {
    cleanObject,
    durationToISO8601,
    generateFAQSchema,
    generateLocalBusinessSchema,
    generateHowToSchema,
    generateArticleSchema,
    generateProductSchema,
    generateBreadcrumbSchema,
    validateSchema,
    formatOutput,
    SAMPLE_DATA
  };
}));
