/**
 * Reseller Profit & Fee Calculator Utilities
 * 100% Client-Side calculation engine for resale platforms:
 * Poshmark, Mercari, Vinted, eBay, and Depop.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ResellerCalcUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Currency Symbols and baseline rates (for display)
  const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
    CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)' }
  };

  // Official Fee Presets
  const PLATFORMS = {
    poshmark: {
      id: 'poshmark',
      name: 'Poshmark',
      threshold: 15.00,
      flatFeeUnderThreshold: 2.95,
      percentFeeAboveThreshold: 0.20,
      description: '$2.95 flat fee if under $15, or 20% commission if $15 and above.'
    },
    mercari: {
      id: 'mercari',
      name: 'Mercari',
      sellingFeePct: 0.10,
      description: '10% flat selling commission on completed sales.'
    },
    vinted: {
      id: 'vinted',
      name: 'Vinted',
      sellerFeePct: 0.00,
      description: '0% seller fee (buyers pay 5% + $0.70 Buyer Protection).'
    },
    ebay: {
      id: 'ebay',
      name: 'eBay',
      finalValueFeePct: 0.1325,
      fixedFee: 0.30,
      description: '13.25% Final Value Fee on total sale + $0.30 fixed per order.'
    },
    depop: {
      id: 'depop',
      name: 'Depop',
      sellingFeePct: 0.00,
      paymentProcessingPct: 0.033,
      paymentProcessingFixed: 0.45,
      boostFeePct: 0.08,
      description: '0% selling fee + 3.3% + $0.45 payment processing fee.'
    }
  };

  /**
   * Calculate Platform Fee for a given platform and sale price
   */
  function calculatePlatformFee(platformId, salePrice, options = {}) {
    const price = Math.max(0, parseFloat(salePrice) || 0);
    let fee = 0;
    let breakdown = {
      commission: 0,
      processing: 0,
      shippingDiscount: 0,
      adOrBoost: 0,
      other: 0,
      total: 0
    };

    switch (platformId) {
      case 'poshmark': {
        // Poshmark: $2.95 if < $15, else 20%
        const commission = price < 15.00 ? (price > 0 ? 2.95 : 0) : price * 0.20;
        const shippingDiscount = Math.max(0, parseFloat(options.poshmarkShippingDiscount) || 0);
        breakdown.commission = Math.round(commission * 100) / 100;
        breakdown.shippingDiscount = Math.round(shippingDiscount * 100) / 100;
        fee = breakdown.commission + breakdown.shippingDiscount;
        break;
      }

      case 'mercari': {
        // Mercari: 10% selling fee
        const commission = price * 0.10;
        breakdown.commission = Math.round(commission * 100) / 100;
        fee = breakdown.commission;
        break;
      }

      case 'vinted': {
        // Vinted: 0% seller fee + optional bump
        const bump = Math.max(0, parseFloat(options.vintedBumpFee) || 0);
        breakdown.other = Math.round(bump * 100) / 100;
        fee = breakdown.other;
        break;
      }

      case 'ebay': {
        // eBay: 13.25% + $0.30 + Promoted Listing ad %
        const shippingChargedToBuyer = Math.max(0, parseFloat(options.ebayBuyerShipping) || 0);
        const totalGross = price + shippingChargedToBuyer;
        const commission = totalGross > 0 ? (totalGross * 0.1325 + 0.30) : 0;
        const adPct = Math.max(0, parseFloat(options.ebayPromotedAdPct) || 0) / 100;
        const adFee = price * adPct;

        breakdown.commission = Math.round(commission * 100) / 100;
        breakdown.adOrBoost = Math.round(adFee * 100) / 100;
        fee = breakdown.commission + breakdown.adOrBoost;
        break;
      }

      case 'depop': {
        // Depop: 0% selling fee + 3.3% + $0.45 processing + optional 8% boost
        const processing = price > 0 ? (price * 0.033 + 0.45) : 0;
        const isBoosted = options.depopIsBoosted === true;
        const boostFee = isBoosted ? (price * 0.08) : 0;

        breakdown.processing = Math.round(processing * 100) / 100;
        breakdown.adOrBoost = Math.round(boostFee * 100) / 100;
        fee = breakdown.processing + breakdown.adOrBoost;
        break;
      }

      default:
        fee = 0;
    }

    breakdown.total = Math.round(fee * 100) / 100;
    return breakdown;
  }

  /**
   * Mode 1: Calculate Net Profit, Payout, Margin & ROI
   */
  function calculateProfit(params = {}) {
    const platformId = params.platformId || 'poshmark';
    const salePrice = Math.max(0, parseFloat(params.salePrice) || 0);
    const cogs = Math.max(0, parseFloat(params.cogs) || 0);
    const sellerShipping = Math.max(0, parseFloat(params.sellerShipping) || 0);
    const packagingCost = params.packagingCost !== undefined
      ? Math.max(0, parseFloat(params.packagingCost) || 0)
      : 0.50;

    const feeBreakdown = calculatePlatformFee(platformId, salePrice, params);
    const totalPlatformFees = feeBreakdown.total;

    // Platform payout (what the marketplace transfers to seller's account)
    const platformPayout = Math.max(0, salePrice - totalPlatformFees);

    // Total expenses incurred by seller
    const totalInvested = cogs + sellerShipping + packagingCost;
    const totalExpenses = totalPlatformFees + totalInvested;

    // Net Profit
    const netProfit = Math.round((salePrice - totalExpenses) * 100) / 100;

    // ROI % and Profit Margin % (Guard against $0 COGS / $0 investment)
    const roiPct = (cogs > 0 && totalInvested > 0)
      ? Math.round((netProfit / totalInvested) * 1000) / 10
      : null;
    const marginPct = salePrice > 0 ? Math.round((netProfit / salePrice) * 1000) / 10 : 0;

    // Calculate Break-Even Price (Sale price where Net Profit == 0)
    const breakEvenPrice = calculateBreakEven(platformId, totalInvested, params);

    return {
      platformId,
      salePrice,
      cogs,
      sellerShipping,
      packagingCost,
      totalInvested: Math.round(totalInvested * 100) / 100,
      platformPayout: Math.round(platformPayout * 100) / 100,
      feeBreakdown,
      totalPlatformFees,
      netProfit,
      roiPct,
      marginPct,
      breakEvenPrice
    };
  }

  /**
   * Calculate Break-Even Listing Price
   */
  function calculateBreakEven(platformId, totalInvested, options = {}) {
    // We want: SalePrice - Fees(SalePrice) = TotalInvested
    // Solved using target price solver with targetNet = 0
    return calculateTargetListingPrice(platformId, 0, totalInvested, options);
  }

  /**
   * Mode 2: Calculate Target Listing Price required to net a specific target profit
   */
  function calculateTargetListingPrice(platformId, targetNetProfit, totalInvested, options = {}) {
    const targetNet = Math.max(0, parseFloat(targetNetProfit) || 0);
    const expenses = Math.max(0, parseFloat(totalInvested) || 0);
    const neededPayout = targetNet + expenses;

    if (neededPayout <= 0) return 0;

    switch (platformId) {
      case 'poshmark': {
        const shippingDiscount = Math.max(0, parseFloat(options.poshmarkShippingDiscount) || 0);
        const requiredAfterDiscount = neededPayout + shippingDiscount;

        // Check if under $15 with $2.95 flat fee
        const priceUnder15 = requiredAfterDiscount + 2.95;
        if (priceUnder15 < 15.00) {
          return Math.round(priceUnder15 * 100) / 100;
        }

        // Otherwise 20% commission: Price * (1 - 0.20) = requiredAfterDiscount
        const priceAbove15 = requiredAfterDiscount / 0.80;
        return Math.round(priceAbove15 * 100) / 100;
      }

      case 'mercari': {
        // 10% fee: Price * 0.90 = neededPayout
        return Math.round((neededPayout / 0.90) * 100) / 100;
      }

      case 'vinted': {
        // 0% seller fee: Price - bump = neededPayout
        const bump = Math.max(0, parseFloat(options.vintedBumpFee) || 0);
        return Math.round((neededPayout + bump) * 100) / 100;
      }

      case 'ebay': {
        // Price * (1 - 0.1325 - adPct) - 0.30 = neededPayout
        const adPct = Math.max(0, parseFloat(options.ebayPromotedAdPct) || 0) / 100;
        const feeRate = 0.1325 + adPct;
        const denominator = 1 - feeRate;
        if (denominator <= 0) return Math.round(neededPayout * 2 * 100) / 100;
        return Math.round(((neededPayout + 0.30) / denominator) * 100) / 100;
      }

      case 'depop': {
        // Price * (1 - 0.033 - boostPct) - 0.45 = neededPayout
        const isBoosted = options.depopIsBoosted === true;
        const boostPct = isBoosted ? 0.08 : 0;
        const feeRate = 0.033 + boostPct;
        const denominator = 1 - feeRate;
        if (denominator <= 0) return Math.round(neededPayout * 2 * 100) / 100;
        return Math.round(((neededPayout + 0.45) / denominator) * 100) / 100;
      }

      default:
        return Math.round(neededPayout * 100) / 100;
    }
  }

  /**
   * Cross-Marketplace Comparison: Evaluates the item across all 5 platforms simultaneously
   */
  function compareAllPlatforms(params = {}) {
    const platforms = ['poshmark', 'mercari', 'vinted', 'ebay', 'depop'];
    const results = [];

    platforms.forEach(pId => {
      const calc = calculateProfit({
        ...params,
        platformId: pId
      });
      results.push({
        platform: PLATFORMS[pId],
        ...calc
      });
    });

    // Find platform with highest net profit
    let bestIndex = 0;
    let maxProfit = -Infinity;
    results.forEach((r, idx) => {
      if (r.netProfit > maxProfit) {
        maxProfit = r.netProfit;
        bestIndex = idx;
      }
    });

    // Lowest profit platform
    let minProfit = Infinity;
    results.forEach(r => {
      if (r.netProfit < minProfit) minProfit = r.netProfit;
    });

    const maxProfitDifference = Math.max(0, maxProfit - minProfit);

    return {
      results,
      bestIndex,
      bestPlatform: results[bestIndex].platform,
      maxProfitDifference: Math.round(maxProfitDifference * 100) / 100
    };
  }

  /**
   * Format Sourcing & Profit Summary for clipboard export
   */
  function formatSourcingSummary(result, currencySymbol = '$') {
    const sym = currencySymbol;
    const pName = PLATFORMS[result.platformId]?.name || result.platformId;
    const roiStr = result.roiPct !== null ? `${result.roiPct}%` : 'N/A ($0 COGS)';

    return [
      `===========================================`,
      `RESELLER SOURCING & PROFIT SUMMARY`,
      `===========================================`,
      `Platform: ${pName}`,
      `Listed Sale Price: ${sym}${result.salePrice.toFixed(2)}`,
      `Cost of Goods (COGS): ${sym}${result.cogs.toFixed(2)}`,
      `Shipping & Packaging: ${sym}${(result.sellerShipping + result.packagingCost).toFixed(2)}`,
      `Total Invested Cost: ${sym}${result.totalInvested.toFixed(2)}`,
      `-------------------------------------------`,
      `Platform & Processing Fees: -${sym}${result.totalPlatformFees.toFixed(2)}`,
      `Estimated Platform Payout: ${sym}${result.platformPayout.toFixed(2)}`,
      `-------------------------------------------`,
      `NET PROFIT: ${result.netProfit >= 0 ? '+' : ''}${sym}${result.netProfit.toFixed(2)}`,
      `Profit Margin: ${result.marginPct}%`,
      `Return on Investment (ROI): ${roiStr}`,
      `Break-Even Listing Price: ${sym}${result.breakEvenPrice.toFixed(2)}`,
      `===========================================`,
      `Generated by Free Online Tools (100% Client-Side)`
    ].join('\n');
  }

  return {
    CURRENCIES,
    PLATFORMS,
    calculatePlatformFee,
    calculateProfit,
    calculateBreakEven,
    calculateTargetListingPrice,
    compareAllPlatforms,
    formatSourcingSummary
  };
}));
