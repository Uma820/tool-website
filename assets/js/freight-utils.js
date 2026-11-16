/**
 * Free Online Tools - Freight & Shipping Suite Shared Utilities
 * 100% Client-side dimensional calculations, unit conversions, and cross-tool state transfer.
 */

const FreightUtils = (function() {
  'use strict';

  // Constants & Unit Conversions
  const CM_TO_IN = 0.393701;
  const IN_TO_CM = 2.54;
  const KG_TO_LBS = 2.20462;
  const LBS_TO_KG = 0.453592;
  const CBM_TO_CFT = 35.3147;
  const CFT_TO_CBM = 0.0283168;

  // Standard Container Specifications (Metric: cm, kg, m3)
  const CONTAINERS = {
    '20gp': {
      id: '20gp',
      name: "20' Standard (20'GP)",
      length: 589, // cm
      width: 235,  // cm
      height: 239, // cm
      cbm: 33.2,
      maxPayloadKg: 28200,
      doorWidth: 234,
      doorHeight: 228
    },
    '40gp': {
      id: '40gp',
      name: "40' Standard (40'GP)",
      length: 1203,
      width: 235,
      height: 239,
      cbm: 67.7,
      maxPayloadKg: 26700,
      doorWidth: 234,
      doorHeight: 228
    },
    '40hc': {
      id: '40hc',
      name: "40' High Cube (40'HC)",
      length: 1203,
      width: 235,
      height: 269,
      cbm: 76.4,
      maxPayloadKg: 26500,
      doorWidth: 234,
      doorHeight: 258
    }
  };

  // Standard Pallet Specifications (Metric: cm, kg)
  const PALLETS = {
    'euro': {
      id: 'euro',
      name: 'Euro Pallet (EUR 1)',
      length: 120, // cm
      width: 80,   // cm
      height: 14.4,// cm (tare height)
      tareWeightKg: 25,
      maxWeightKg: 1500
    },
    'us_gma': {
      id: 'us_gma',
      name: 'US / GMA Standard (48 × 40 in)',
      length: 120, // ~47.24 in -> 120cm
      width: 100,  // ~39.37 in -> 100cm
      height: 15,
      tareWeightKg: 20,
      maxWeightKg: 1200
    },
    'uk': {
      id: 'uk',
      name: 'UK Standard (BS ISO)',
      length: 120,
      width: 100,
      height: 15,
      tareWeightKg: 25,
      maxWeightKg: 1500
    }
  };

  // Dimensional Weight Divisors
  const DIM_FACTORS = {
    courier: { metric: 5000, imperial: 139, label: 'Express Courier (DHL, FedEx, UPS)' },
    air:     { metric: 6000, imperial: 166, label: 'Standard Air Freight (IATA)' },
    road:    { metric: 4000, imperial: 111, label: 'Road / Surface Freight' }
  };

  /**
   * Safe number parser with minimum threshold
   */
  function safeNumber(val, defaultVal = 0) {
    const num = parseFloat(val);
    return isNaN(num) || num < 0 ? defaultVal : num;
  }

  /**
   * Round to decimal places
   */
  function round(val, decimals = 2) {
    if (isNaN(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  /**
   * Calculate single box volume in CBM
   */
  function itemCbm(l, w, h, isMetric = true) {
    const len = safeNumber(l);
    const wid = safeNumber(w);
    const hei = safeNumber(h);
    if (len <= 0 || wid <= 0 || hei <= 0) return 0;

    if (isMetric) {
      // cm to m3
      return (len * wid * hei) / 1000000;
    } else {
      // inches to m3: 1 m3 = 61,023.7441 in3
      return (len * wid * hei) / 61023.7;
    }
  }

  /**
   * Calculate volumetric weight for single box
   */
  function itemVolumetricWeight(l, w, h, divisor, isMetric = true) {
    const len = safeNumber(l);
    const wid = safeNumber(w);
    const hei = safeNumber(h);
    const div = safeNumber(divisor, isMetric ? 5000 : 139);
    if (len <= 0 || wid <= 0 || hei <= 0 || div <= 0) return 0;

    return (len * wid * hei) / div;
  }

  /**
   * Round up to the nearest 0.5 for Air Freight Chargeable Weight
   */
  function roundAirChargeable(weight) {
    if (isNaN(weight) || weight <= 0) return 0;
    return Math.ceil(weight * 2) / 2;
  }

  /**
   * Encode items to URL query parameter string
   * Format: items=Name,L,W,H,Wt,Qty;Name2,...&unit=metric
   */
  function encodeCargoParams(targetUrl, items, isMetric = true) {
    if (!items || !items.length) return targetUrl;
    const encodedRows = items.map(it => {
      const name = encodeURIComponent(it.name || 'Box');
      const l = safeNumber(it.l);
      const w = safeNumber(it.w);
      const h = safeNumber(it.h);
      const wt = safeNumber(it.wt);
      const qty = safeNumber(it.qty, 1);
      return `${name},${l},${w},${h},${wt},${qty}`;
    }).join(';');

    const url = new URL(targetUrl, window.location.origin);
    url.searchParams.set('items', encodedRows);
    url.searchParams.set('unit', isMetric ? 'metric' : 'imperial');
    return url.pathname + url.search;
  }

  /**
   * Parse items from URL query parameter string
   */
  function parseCargoParams() {
    const params = new URLSearchParams(window.location.search);
    const itemsParam = params.get('items');
    const unitParam = params.get('unit');
    const isMetric = unitParam !== 'imperial';

    if (!itemsParam) return null;

    try {
      const rows = itemsParam.split(';').map((rowStr, idx) => {
        const parts = rowStr.split(',');
        if (parts.length >= 6) {
          return {
            name: decodeURIComponent(parts[0]) || `Box ${idx + 1}`,
            l: safeNumber(parts[1]),
            w: safeNumber(parts[2]),
            h: safeNumber(parts[3]),
            wt: safeNumber(parts[4]),
            qty: safeNumber(parts[5], 1)
          };
        }
        return null;
      }).filter(Boolean);

      return {
        items: rows.length ? rows : null,
        isMetric
      };
    } catch (e) {
      console.warn('Error parsing freight cargo params:', e);
      return null;
    }
  }

  /**
   * Copy formatted text to clipboard and display user toast
   */
  function copyTextToClipboard(text, successMsg = 'Results copied to clipboard!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.FreeOnlineTools && window.FreeOnlineTools.showToast) {
          window.FreeOnlineTools.showToast(successMsg);
        } else {
          alert(successMsg);
        }
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, msg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (window.FreeOnlineTools && window.FreeOnlineTools.showToast) {
        window.FreeOnlineTools.showToast(msg);
      } else {
        alert(msg);
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
    document.body.removeChild(ta);
  }

  return {
    CM_TO_IN,
    IN_TO_CM,
    KG_TO_LBS,
    LBS_TO_KG,
    CBM_TO_CFT,
    CFT_TO_CBM,
    CONTAINERS,
    PALLETS,
    DIM_FACTORS,
    safeNumber,
    round,
    itemCbm,
    itemVolumetricWeight,
    roundAirChargeable,
    encodeCargoParams,
    parseCargoParams,
    copyTextToClipboard
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FreightUtils;
}
