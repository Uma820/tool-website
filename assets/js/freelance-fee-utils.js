/**
 * Cross-Border Freelance & Creator Fee Reverse Calculator Utilities
 * Computes forward and reverse fee calculations, hidden FX spread costs,
 * platform presets, and side-by-side rail comparisons.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FreelanceFeeUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Standard Default Currency Pairs & Mid-Market Rates relative to 1 USD
  const DEFAULT_CURRENCY_RATES = {
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', ratePerUsd: 84.50 },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', ratePerUsd: 0.92 },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', ratePerUsd: 0.79 },
    PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', ratePerUsd: 58.50 },
    BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', ratePerUsd: 5.75 },
    NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', ratePerUsd: 1540.0 },
    PKR: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', ratePerUsd: 278.0 },
    BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', ratePerUsd: 120.0 },
    CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', ratePerUsd: 1.38 },
    AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', ratePerUsd: 1.52 },
    SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', ratePerUsd: 1.33 },
    AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', ratePerUsd: 3.67 },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', ratePerUsd: 1.00 }
  };

  // Platform Presets Specification
  const PLATFORMS = {
    paypal: {
      id: 'paypal',
      name: 'PayPal International',
      baseFeePct: 4.40,
      intlSurchargePct: 0.00,
      fixedFee: 0.30,
      fxMarkupPct: 3.75,
      taxOnFeePct: 0.0,
      description: '4.40% commercial transaction fee + $0.30 fixed + ~3.75% hidden FX markup spread.'
    },
    stripe: {
      id: 'stripe',
      name: 'Stripe International Card',
      baseFeePct: 2.90,
      intlSurchargePct: 1.50,
      fixedFee: 0.30,
      fxMarkupPct: 2.00,
      taxOnFeePct: 0.0,
      description: '2.90% base + 1.50% international card surcharge + $0.30 fixed + 2.00% FX conversion.'
    },
    wise: {
      id: 'wise',
      name: 'Wise Business Account',
      baseFeePct: 0.00,
      intlSurchargePct: 0.00,
      fixedFee: 0.00,
      fxMarkupPct: 0.55,
      taxOnFeePct: 0.0,
      description: '0% receive via local USD/EUR bank details + ~0.55% transparent mid-market FX transfer fee.'
    },
    payoneer: {
      id: 'payoneer',
      name: 'Payoneer Receiving Account',
      baseFeePct: 1.00,
      intlSurchargePct: 0.00,
      fixedFee: 0.00,
      fxMarkupPct: 2.50,
      taxOnFeePct: 0.0,
      description: '1.00% payment receiving fee + 2.50% withdrawal exchange rate spread to local bank.'
    },
    gumroad: {
      id: 'gumroad',
      name: 'Gumroad Creator Sale',
      baseFeePct: 10.00,
      intlSurchargePct: 2.90,
      fixedFee: 0.80, // $0.50 Gumroad + $0.30 processor
      fxMarkupPct: 2.00,
      taxOnFeePct: 0.0,
      description: '10.00% platform fee + $0.50 + 2.90% + $0.30 processing + 2.00% cross-currency payout.'
    },
    custom: {
      id: 'custom',
      name: 'Custom Payment Rail',
      baseFeePct: 3.50,
      intlSurchargePct: 1.00,
      fixedFee: 0.30,
      fxMarkupPct: 2.50,
      taxOnFeePct: 0.0,
      description: 'Fully customizable percentage fee, fixed fee, FX markup, and GST/VAT tax on fees.'
    }
  };

  /**
   * Calculate Forward Mode: Given Gross Invoice, compute fees and net payout
   */
  function calculateForward(grossAmount, config = {}) {
    const gross = Math.max(0, parseFloat(grossAmount) || 0);
    const basePct = Math.max(0, parseFloat(config.baseFeePct) || 0) / 100;
    const intlPct = Math.max(0, parseFloat(config.intlSurchargePct) || 0) / 100;
    const fixedFee = Math.max(0, parseFloat(config.fixedFee) || 0);
    const fxMarkupPct = Math.max(0, parseFloat(config.fxMarkupPct) || 0) / 100;
    const taxOnFeePct = Math.max(0, parseFloat(config.taxOnFeePct) || 0) / 100;
    const exchangeRate = Math.max(0.0001, parseFloat(config.exchangeRate) || 1.0);
    const isSameCurrency = config.isSameCurrency === true;

    if (gross <= 0) {
      return {
        gross: 0,
        platformFee: 0,
        fixedFee: 0,
        taxOnFee: 0,
        totalPlatformFee: 0,
        netBeforeFx: 0,
        fxSpreadCost: 0,
        netClientCurrency: 0,
        netLocalCurrency: 0,
        effectiveDeductionPct: 0,
        exchangeRate,
        effectiveExchangeRate: exchangeRate
      };
    }

    // Platform fee calculation
    const totalFeePct = basePct + intlPct;
    const rawPlatformFee = (gross * totalFeePct) + fixedFee;
    const taxOnFee = rawPlatformFee * taxOnFeePct;
    const totalPlatformFee = rawPlatformFee + taxOnFee;

    const netBeforeFx = Math.max(0, gross - totalPlatformFee);

    // FX Spread Calculation
    const effectiveFxRate = isSameCurrency ? 1.0 : exchangeRate * (1 - fxMarkupPct);
    const netLocalCurrency = isSameCurrency ? netBeforeFx : netBeforeFx * effectiveFxRate;

    // What the user would have received at pure mid-market rate
    const midMarketLocal = isSameCurrency ? netBeforeFx : netBeforeFx * exchangeRate;
    const fxSpreadCostLocal = Math.max(0, midMarketLocal - netLocalCurrency);
    const fxSpreadCostClient = isSameCurrency ? 0 : (fxSpreadCostLocal / exchangeRate);

    const netClientCurrency = isSameCurrency ? netBeforeFx : netBeforeFx * (1 - fxMarkupPct);
    const totalDeductionsClient = gross - netClientCurrency;
    const effectiveDeductionPct = gross > 0 ? (totalDeductionsClient / gross) * 100 : 0;

    return {
      gross,
      platformFee: Math.round(gross * totalFeePct * 100) / 100,
      fixedFee,
      taxOnFee: Math.round(taxOnFee * 100) / 100,
      totalPlatformFee: Math.round(totalPlatformFee * 100) / 100,
      netBeforeFx: Math.round(netBeforeFx * 100) / 100,
      fxSpreadCost: Math.round(fxSpreadCostClient * 100) / 100,
      fxSpreadCostLocal: Math.round(fxSpreadCostLocal * 100) / 100,
      netClientCurrency: Math.round(netClientCurrency * 100) / 100,
      netLocalCurrency: Math.round(netLocalCurrency * 100) / 100,
      effectiveDeductionPct: Math.round(effectiveDeductionPct * 10) / 10,
      exchangeRate,
      effectiveExchangeRate: Math.round(effectiveFxRate * 1000) / 1000
    };
  }

  /**
   * Calculate Reverse Mode: Given Target Net Payout, compute exact gross invoice to bill
   */
  function calculateReverse(targetNet, isTargetLocal = false, config = {}) {
    const target = Math.max(0, parseFloat(targetNet) || 0);
    const basePct = Math.max(0, parseFloat(config.baseFeePct) || 0) / 100;
    const intlPct = Math.max(0, parseFloat(config.intlSurchargePct) || 0) / 100;
    const fixedFee = Math.max(0, parseFloat(config.fixedFee) || 0);
    const fxMarkupPct = Math.max(0, parseFloat(config.fxMarkupPct) || 0) / 100;
    const taxOnFeePct = Math.max(0, parseFloat(config.taxOnFeePct) || 0) / 100;
    const exchangeRate = Math.max(0.0001, parseFloat(config.exchangeRate) || 1.0);
    const isSameCurrency = config.isSameCurrency === true;

    if (target <= 0) {
      return calculateForward(0, config);
    }

    // Step 1: Compute target in client currency after FX
    let targetNetClient = target;
    if (isTargetLocal && !isSameCurrency) {
      const effectiveRate = exchangeRate * (1 - fxMarkupPct);
      targetNetClient = target / effectiveRate;
    }

    // Step 2: Account for FX spread to get net before FX
    const netBeforeFx = isSameCurrency ? targetNetClient : targetNetClient / (1 - fxMarkupPct);

    // Step 3: Account for platform percentage fee + fixed fee + tax
    // Formula: Gross - Gross * TotalFeePct * (1 + Tax) - FixedFee * (1 + Tax) = NetBeforeFx
    // Gross * [1 - TotalFeePct * (1 + Tax)] = NetBeforeFx + FixedFee * (1 + Tax)
    const totalFeePct = basePct + intlPct;
    const feeMultiplier = totalFeePct * (1 + taxOnFeePct);
    const fixedFeeWithTax = fixedFee * (1 + taxOnFeePct);

    const denominator = 1 - feeMultiplier;
    if (denominator <= 0.01) {
      // Fee approaches 100%, guard division
      return calculateForward(target * 2, config);
    }

    const requiredGross = (netBeforeFx + fixedFeeWithTax) / denominator;

    // Use calculateForward with requiredGross to get full waterfall
    return calculateForward(requiredGross, config);
  }

  /**
   * Compare all 5 platforms simultaneously for a given transaction
   */
  function compareAllPlatforms(amount, isReverse = true, isTargetLocal = false, config = {}) {
    const exchangeRate = parseFloat(config.exchangeRate) || 84.50;
    const isSameCurrency = config.isSameCurrency === true;
    const taxOnFeePct = parseFloat(config.taxOnFeePct) || 0;

    const results = [];

    const platformKeys = ['wise', 'stripe', 'payoneer', 'paypal', 'gumroad'];

    platformKeys.forEach(key => {
      const p = PLATFORMS[key];
      const pConfig = {
        baseFeePct: p.baseFeePct,
        intlSurchargePct: p.intlSurchargePct,
        fixedFee: p.fixedFee,
        fxMarkupPct: p.fxMarkupPct,
        taxOnFeePct,
        exchangeRate,
        isSameCurrency
      };

      let result;
      if (isReverse) {
        result = calculateReverse(amount, isTargetLocal, pConfig);
      } else {
        result = calculateForward(amount, pConfig);
      }

      results.push({
        platform: p,
        ...result
      });
    });

    // Find best rail (lowest gross invoice needed in reverse mode, or highest net payout in forward mode)
    let bestIndex = 0;
    if (isReverse) {
      let minGross = Infinity;
      results.forEach((r, idx) => {
        if (r.gross < minGross) {
          minGross = r.gross;
          bestIndex = idx;
        }
      });
    } else {
      let maxNet = -Infinity;
      results.forEach((r, idx) => {
        if (r.netClientCurrency > maxNet) {
          maxNet = r.netClientCurrency;
          bestIndex = idx;
        }
      });
    }

    // Calculate savings of best vs worst (most expensive)
    let worstGross = -Infinity;
    results.forEach(r => {
      if (r.gross > worstGross) worstGross = r.gross;
    });

    const maxSavingsClient = Math.max(0, worstGross - results[bestIndex].gross);
    const maxSavingsLocal = maxSavingsClient * exchangeRate;

    return {
      results,
      bestIndex,
      bestPlatform: results[bestIndex].platform,
      maxSavingsClient: Math.round(maxSavingsClient * 100) / 100,
      maxSavingsLocal: Math.round(maxSavingsLocal * 100) / 100
    };
  }

  return {
    DEFAULT_CURRENCY_RATES,
    PLATFORMS,
    calculateForward,
    calculateReverse,
    compareAllPlatforms
  };
}));
