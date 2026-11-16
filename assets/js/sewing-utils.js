/**
 * Free Online Tools - Quilting & Sewing Calculator Suite Shared Utilities
 * 100% Client-side dimensional calculations, fractional yardage rounding,
 * unit conversions, and cross-tool state transfer.
 */

const SewingUtils = (function() {
  'use strict';

  // Conversion Constants
  const IN_TO_CM = 2.54;
  const CM_TO_IN = 1 / 2.54;
  const YD_TO_IN = 36;
  const IN_TO_YD = 1 / 36;
  const YD_TO_M = 0.9144;
  const M_TO_YD = 1 / 0.9144;
  const M_TO_CM = 100;
  const CM_TO_M = 0.01;

  // Standard Quilt Size Presets (Inches)
  const QUILT_PRESETS = {
    'crib': { name: 'Crib / Baby', width: 36, length: 52 },
    'throw': { name: 'Lap / Throw', width: 50, length: 65 },
    'twin': { name: 'Twin Bed', width: 68, length: 86 },
    'full': { name: 'Full / Double Bed', width: 84, length: 90 },
    'queen': { name: 'Queen Bed', width: 90, length: 95 },
    'king': { name: 'King Bed', width: 108, length: 95 }
  };

  // Standard Bolt Width Presets (Inches)
  const BOLT_WIDTH_PRESETS = {
    '42': { name: '42" Standard Quilting Cotton (40" usable)', width: 42, usable: 40 },
    '44': { name: '44" Quilting / Apparel Cotton (42" usable)', width: 44, usable: 42 },
    '54': { name: '54" Home Decor / Drapery (52" usable)', width: 54, usable: 52 },
    '60': { name: '60" Garment / Knit Wide (58" usable)', width: 60, usable: 58 },
    '108': { name: '108" Seamless Wide-Back (106" usable)', width: 108, usable: 106 }
  };

  // Curtain Fullness Presets
  const CURTAIN_FULLNESS_PRESETS = {
    'pencil': { name: 'Pencil Pleat / Gathered (2.0x)', multiplier: 2.0 },
    'sheer': { name: 'Sheer / Wave Curtain (2.5x)', multiplier: 2.5 },
    'eyelet': { name: 'Eyelet / Grommet (1.8x)', multiplier: 1.8 },
    'tailored': { name: 'Tailored / Pinch Pleat / Flat (1.5x)', multiplier: 1.5 }
  };

  // Fabric Shrinkage Presets (Average percentages)
  const SHRINKAGE_PRESETS = {
    'cotton': { name: '100% Cotton / Quilting Cotton', length: 4.0, width: 3.0 },
    'linen': { name: '100% Linen', length: 6.0, width: 4.0 },
    'wool': { name: 'Wool / Wool Flannel', length: 8.0, width: 6.0 },
    'rayon': { name: 'Rayon / Viscose', length: 5.0, width: 5.0 },
    'denim': { name: 'Denim (Raw / Unwashed)', length: 7.0, width: 4.0 },
    'silk': { name: 'Silk (Habotai / Crepe)', length: 3.0, width: 2.0 },
    'polyester': { name: 'Polyester / Synthetic Blend', length: 0.5, width: 0.5 }
  };

  /**
   * Helper: Round number to fixed decimals
   */
  function round(val, decimals = 2) {
    if (isNaN(val) || !isFinite(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  /**
   * Converts decimal yards to fractional representation rounded UP to nearest 1/8 yard
   * Fabric stores sell fabric in increments of 1/8 yd (4.5 inches).
   * e.g. 2.15 yards -> "2 1/4 yds" (rounded up from 2.125 to 2.25)
   */
  function toFractionalYards(decimalYards, roundUp = true) {
    if (isNaN(decimalYards) || decimalYards <= 0) return '0 yds';
    
    // Total eighths
    const eighths = roundUp 
      ? Math.ceil(decimalYards * 8) 
      : Math.round(decimalYards * 8);

    const whole = Math.floor(eighths / 8);
    const rem = eighths % 8;

    let frac = '';
    if (rem === 1) frac = '1/8';
    else if (rem === 2) frac = '1/4';
    else if (rem === 3) frac = '3/8';
    else if (rem === 4) frac = '1/2';
    else if (rem === 5) frac = '5/8';
    else if (rem === 6) frac = '3/4';
    else if (rem === 7) frac = '7/8';

    if (whole === 0 && frac) return `${frac} yd`;
    if (whole > 0 && frac) return `${whole} ${frac} yds`;
    if (whole === 1) return '1 yd';
    return `${whole} yds`;
  }

  /**
   * Format decimal yards alongside fractional and meters
   */
  function formatYardageOutput(decimalYards) {
    const decYd = round(decimalYards, 2);
    const fracYd = toFractionalYards(decimalYards, true);
    const meters = round(decimalYards * YD_TO_M, 2);
    return {
      decimalYards: decYd,
      fractionalYards: fracYd,
      meters: meters,
      formattedSummary: `${fracYd} (${decYd} yds / ${meters} m)`
    };
  }

  // ==========================================
  // 1. Quilt Backing Calculations
  // ==========================================
  function calculateQuiltBacking({
    topWidth,
    topLength,
    boltWidth = 42,
    overageSide = 4, // 4" per side = 8" total
    seamAllowance = 0.5, // 0.5" standard
    isMetric = false
  }) {
    // If metric, convert inputs from cm to inches for calculations
    const toInches = isMetric ? CM_TO_IN : 1;
    const toLocalDim = isMetric ? IN_TO_CM : 1;

    const topW = Math.max(0, parseFloat(topWidth) || 0) * toInches;
    const topL = Math.max(0, parseFloat(topLength) || 0) * toInches;
    const boltW = Math.max(0, parseFloat(boltWidth) || 42) * toInches;
    const overage = Math.max(0, parseFloat(overageSide) || 4) * toInches;
    const sa = Math.max(0, parseFloat(seamAllowance) || 0.5) * toInches;

    if (topW <= 0 || topL <= 0 || boltW <= 0) {
      return null;
    }

    // Required backing dimensions
    const backW = topW + (2 * overage);
    const backL = topL + (2 * overage);

    // Usable width after removing selvages (standard 2" deduction total = 1" per side)
    const usableW = Math.max(1, boltW - 2);

    // --- Case 1: Vertical Panels (Seams run parallel to quilt length / lengthwise grain) ---
    let vertPanels = 1;
    if (backW > usableW) {
      // Each seam takes 2 * sa (1" total seam allowance per join)
      // W_back + (N - 1) * 2 * sa <= N * usableW
      // N * (usableW - 2 * sa) >= W_back - 2 * sa
      const effectivePanelWidth = Math.max(1, usableW - (2 * sa));
      vertPanels = Math.ceil((backW - (2 * sa)) / effectivePanelWidth);
      if (vertPanels < 1) vertPanels = 1;
    }
    const vertCutLengthInches = backL;
    const vertTotalInches = vertPanels * vertCutLengthInches;
    const vertYards = vertTotalInches / YD_TO_IN;

    // --- Case 2: Horizontal Panels (Seams run parallel to quilt width / crosswise grain) ---
    let horizPanels = 1;
    if (backL > usableW) {
      const effectivePanelWidth = Math.max(1, usableW - (2 * sa));
      horizPanels = Math.ceil((backL - (2 * sa)) / effectivePanelWidth);
      if (horizPanels < 1) horizPanels = 1;
    }
    const horizCutLengthInches = backW;
    const horizTotalInches = horizPanels * horizCutLengthInches;
    const horizYards = horizTotalInches / YD_TO_IN;

    // Smart comparison
    const yardDifference = Math.abs(vertYards - horizYards);
    let bestOrientation = 'vertical';
    let savingsYardage = 0;
    let savingsPct = 0;

    if (vertYards < horizYards) {
      bestOrientation = 'vertical';
      savingsYardage = yardDifference;
      savingsPct = horizYards > 0 ? (yardDifference / horizYards) * 100 : 0;
    } else if (horizYards < vertYards) {
      bestOrientation = 'horizontal';
      savingsYardage = yardDifference;
      savingsPct = vertYards > 0 ? (yardDifference / vertYards) * 100 : 0;
    } else {
      bestOrientation = 'equal';
    }

    return {
      topDimensions: {
        width: round(topW * toLocalDim, 1),
        length: round(topL * toLocalDim, 1)
      },
      backingDimensions: {
        width: round(backW * toLocalDim, 1),
        length: round(backL * toLocalDim, 1)
      },
      usableBoltWidth: round(usableW * toLocalDim, 1),
      vertical: {
        panels: vertPanels,
        cutLength: round(vertCutLengthInches * toLocalDim, 1),
        totalInches: round(vertTotalInches, 1),
        yardage: formatYardageOutput(vertYards),
        seamsCount: Math.max(0, vertPanels - 1)
      },
      horizontal: {
        panels: horizPanels,
        cutLength: round(horizCutLengthInches * toLocalDim, 1),
        totalInches: round(horizTotalInches, 1),
        yardage: formatYardageOutput(horizYards),
        seamsCount: Math.max(0, horizPanels - 1)
      },
      recommendation: {
        winner: bestOrientation,
        savingsYards: round(savingsYardage, 2),
        savingsFractional: toFractionalYards(savingsYardage, false),
        savingsPercent: round(savingsPct, 1),
        isSeamless: (bestOrientation === 'vertical' && vertPanels === 1) || 
                    (bestOrientation === 'horizontal' && horizPanels === 1) ||
                    (vertPanels === 1 && horizPanels === 1)
      }
    };
  }

  // ==========================================
  // 2. Quilt Binding Calculations
  // ==========================================
  function calculateQuiltBinding({
    quiltWidth,
    quiltLength,
    stripWidth = 2.5,
    boltWidth = 42,
    cuttingMethod = 'straight', // 'straight' (WOF) or 'bias'
    cornerAllowance = 12, // default 12" extra for corners and joins
    isMetric = false
  }) {
    const toInches = isMetric ? CM_TO_IN : 1;
    const toLocalDim = isMetric ? IN_TO_CM : 1;

    const w = Math.max(0, parseFloat(quiltWidth) || 0) * toInches;
    const l = Math.max(0, parseFloat(quiltLength) || 0) * toInches;
    const sw = Math.max(0, parseFloat(stripWidth) || 2.5) * toInches;
    const bw = Math.max(0, parseFloat(boltWidth) || 42) * toInches;
    const extra = Math.max(0, parseFloat(cornerAllowance) || 12) * toInches;

    if (w <= 0 || l <= 0 || sw <= 0 || bw <= 0) return null;

    const perimeter = 2 * (w + l);
    const totalBindingLength = perimeter + extra;
    const usableWOF = Math.max(1, bw - 2); // 2" selvage allowance

    // Straight-grain WOF calculations
    const stripsNeeded = Math.ceil(totalBindingLength / usableWOF);
    const wofLinearLength = stripsNeeded * sw;
    const wofYards = wofLinearLength / YD_TO_IN;

    // Continuous bias square calculations
    // Area = Total Binding Length * Strip Width
    // Square side required = sqrt(Total Binding Length * Strip Width) + 2" safety
    const biasArea = totalBindingLength * sw;
    const biasSquareSide = Math.ceil(Math.sqrt(biasArea) + 2); // rounded up to nearest inch
    const biasYards = biasSquareSide / YD_TO_IN;
    const biasExceedsBolt = biasSquareSide > usableWOF;

    return {
      perimeter: round(perimeter * toLocalDim, 1),
      totalBindingLength: round(totalBindingLength * toLocalDim, 1),
      stripWidth: round(sw * toLocalDim, 2),
      method: cuttingMethod,
      straightGrain: {
        stripsNeeded: stripsNeeded,
        usableWOF: round(usableWOF * toLocalDim, 1),
        linearInches: round(wofLinearLength, 1),
        yardage: formatYardageOutput(wofYards)
      },
      continuousBias: {
        squareSide: round(biasSquareSide * toLocalDim, 1),
        exceedsBolt: biasExceedsBolt,
        linearInches: round(biasSquareSide, 1),
        yardage: formatYardageOutput(biasYards)
      }
    };
  }

  // ==========================================
  // 3. Fabric Yardage & Multi-Piece Layout
  // ==========================================
  function calculateFabricYardage({
    boltWidth = 44,
    usableDeduction = 1, // default 1" selvage deduction
    patternRepeat = 0,
    items = [],
    isMetric = false
  }) {
    const toInches = isMetric ? CM_TO_IN : 1;
    const toLocalDim = isMetric ? IN_TO_CM : 1;

    const bw = Math.max(0, parseFloat(boltWidth) || 44) * toInches;
    const deduction = Math.max(0, parseFloat(usableDeduction) || 1) * toInches;
    const usableW = Math.max(1, bw - deduction);
    const repeat = Math.max(0, parseFloat(patternRepeat) || 0) * toInches;

    if (bw <= 0 || !Array.isArray(items) || items.length === 0) return null;

    let totalLinearInches = 0;
    let totalPiecesCut = 0;
    let totalPieceArea = 0;
    const processedItems = [];

    items.forEach((item, idx) => {
      const name = item.name || `Piece #${idx + 1}`;
      const width = Math.max(0, parseFloat(item.width) || 0) * toInches;
      const length = Math.max(0, parseFloat(item.length) || 0) * toInches;
      const qty = Math.max(0, parseInt(item.quantity, 10) || 0);
      const allowRotation = !!item.allowRotation;

      if (width <= 0 || length <= 0 || qty <= 0) return;

      totalPiecesCut += qty;
      totalPieceArea += (width * length * qty);

      // Check orientations
      // Orientation A: Standard (piece width along fabric width, piece length along fabric length)
      const fitsStandard = width <= usableW;
      const colsStandard = fitsStandard ? Math.floor(usableW / width) : 0;
      const rowsStandard = colsStandard > 0 ? Math.ceil(qty / colsStandard) : Infinity;
      let lenStandard = rowsStandard !== Infinity ? rowsStandard * length : Infinity;

      // Orientation B: Rotated 90 deg (piece length along fabric width, piece width along fabric length)
      const fitsRotated = allowRotation && length <= usableW;
      const colsRotated = fitsRotated ? Math.floor(usableW / length) : 0;
      const rowsRotated = colsRotated > 0 ? Math.ceil(qty / colsRotated) : Infinity;
      let lenRotated = rowsRotated !== Infinity ? rowsRotated * width : Infinity;

      let chosenOrientation = 'standard';
      let chosenCols = colsStandard;
      let chosenRows = rowsStandard;
      let pieceWOnFabric = width;
      let pieceLOnFabric = length;
      let rowLen = lenStandard;
      let isOversized = false;

      if (!fitsStandard && !fitsRotated) {
        isOversized = true;
        rowLen = length;
        chosenCols = 1;
        chosenRows = qty;
      } else if (fitsRotated && (!fitsStandard || lenRotated < lenStandard)) {
        chosenOrientation = 'rotated';
        chosenCols = colsRotated;
        chosenRows = rowsRotated;
        pieceWOnFabric = length;
        pieceLOnFabric = width;
        rowLen = lenRotated;
      }

      // Pattern Repeat adjustments
      if (repeat > 0 && !isOversized && chosenRows < Infinity) {
        // Each row along length aligns with next pattern repeat
        const singleCutDrop = Math.ceil(pieceLOnFabric / repeat) * repeat;
        rowLen = chosenRows * singleCutDrop;
      }

      totalLinearInches += (isFinite(rowLen) ? rowLen : 0);

      processedItems.push({
        id: item.id || `item-${idx}`,
        name: name,
        originalWidth: round(width * toLocalDim, 2),
        originalLength: round(length * toLocalDim, 2),
        quantity: qty,
        allowRotation: allowRotation,
        chosenOrientation: chosenOrientation,
        colsAcross: chosenCols,
        rowsAlong: chosenRows,
        pieceWidthOnFabric: round(pieceWOnFabric * toLocalDim, 2),
        pieceLengthOnFabric: round(pieceLOnFabric * toLocalDim, 2),
        linearInchesRequired: round(rowLen, 2),
        isOversized: isOversized
      });
    });

    const totalYards = totalLinearInches / YD_TO_IN;
    const totalFabricArea = usableW * totalLinearInches;
    const utilizationPct = totalFabricArea > 0 ? Math.min(100, (totalPieceArea / totalFabricArea) * 100) : 0;

    return {
      usableBoltWidth: round(usableW * toLocalDim, 1),
      totalLinearInches: round(totalLinearInches, 1),
      totalPiecesCut: totalPiecesCut,
      utilizationPercent: round(utilizationPct, 1),
      yardage: formatYardageOutput(totalYards),
      items: processedItems
    };
  }

  // ==========================================
  // 4. Curtain Fabric Calculations
  // ==========================================
  function calculateCurtainFabric({
    rodWidth,
    finishedDrop,
    panelCount = 2, // 2 for pair, 1 for single
    fullnessMultiplier = 2.0,
    fabricWidth = 54,
    hemAllowance = 14, // 4" header + 8" double bottom hem + 2" turn
    sideHemAllowance = 4, // 4" per panel (1" double turned both sides)
    patternRepeat = 0,
    isMetric = false
  }) {
    const toInches = isMetric ? CM_TO_IN : 1;
    const toLocalDim = isMetric ? IN_TO_CM : 1;

    const rw = Math.max(0, parseFloat(rodWidth) || 0) * toInches;
    const fd = Math.max(0, parseFloat(finishedDrop) || 0) * toInches;
    const panels = Math.max(1, parseInt(panelCount, 10) || 2);
    const fullness = Math.max(1, parseFloat(fullnessMultiplier) || 2.0);
    const fw = Math.max(0, parseFloat(fabricWidth) || 54) * toInches;
    const hems = Math.max(0, parseFloat(hemAllowance) || 14) * toInches;
    const sideHems = Math.max(0, parseFloat(sideHemAllowance) || 4) * toInches;
    const repeat = Math.max(0, parseFloat(patternRepeat) || 0) * toInches;

    if (rw <= 0 || fd <= 0 || fw <= 0) return null;

    // Total flat gathered width needed across rod + side hems
    const gatheredFabricWidth = rw * fullness;
    const totalFlatWidth = gatheredFabricWidth + (sideHems * panels);

    // Number of fabric widths (cuts) needed across the rod
    const widthsNeeded = Math.ceil(totalFlatWidth / fw);
    const widthsPerPanel = widthsNeeded / panels;

    // Cut drop per width
    const unadjustedCutDrop = fd + hems;
    let cutDrop = unadjustedCutDrop;
    let patternWastePerDrop = 0;

    if (repeat > 0) {
      cutDrop = Math.ceil(unadjustedCutDrop / repeat) * repeat;
      patternWastePerDrop = cutDrop - unadjustedCutDrop;
    }

    const totalLinearInches = widthsNeeded * cutDrop;
    const totalYards = totalLinearInches / YD_TO_IN;

    return {
      rodWidth: round(rw * toLocalDim, 1),
      finishedDrop: round(fd * toLocalDim, 1),
      totalFlatWidth: round(totalFlatWidth * toLocalDim, 1),
      widthsNeeded: widthsNeeded,
      widthsPerPanel: round(widthsPerPanel, 1),
      panelCount: panels,
      cutDrop: round(cutDrop * toLocalDim, 1),
      unadjustedCutDrop: round(unadjustedCutDrop * toLocalDim, 1),
      patternWastePerDrop: round(patternWastePerDrop * toLocalDim, 1),
      totalLinearInches: round(totalLinearInches, 1),
      yardage: formatYardageOutput(totalYards)
    };
  }

  // ==========================================
  // 5. Fabric Shrinkage Calculations
  // ==========================================
  function calculateSwatchShrinkage({
    preWashWidth,
    preWashLength,
    postWashWidth,
    postWashLength
  }) {
    const preW = parseFloat(preWashWidth) || 0;
    const preL = parseFloat(preWashLength) || 0;
    const postW = parseFloat(postWashWidth) || 0;
    const postL = parseFloat(postWashLength) || 0;

    if (preW <= 0 || preL <= 0 || postW < 0 || postL < 0) return null;

    const widthShrinkagePct = ((preW - postW) / preW) * 100;
    const lengthShrinkagePct = ((preL - postL) / preL) * 100;

    const preArea = preW * preL;
    const postArea = postW * postL;
    const areaShrinkagePct = ((preArea - postArea) / preArea) * 100;

    return {
      widthShrinkagePct: round(widthShrinkagePct, 2),
      lengthShrinkagePct: round(lengthShrinkagePct, 2),
      areaShrinkagePct: round(areaShrinkagePct, 2),
      postWashWidth: round(postW, 2),
      postWashLength: round(postL, 2)
    };
  }

  function calculatePreWashAdjustment({
    finishedWidth,
    finishedLength,
    lengthShrinkagePct = 4.0,
    widthShrinkagePct = 3.0,
    isMetric = false
  }) {
    const toInches = isMetric ? CM_TO_IN : 1;
    const toLocalDim = isMetric ? IN_TO_CM : 1;

    const fw = Math.max(0, parseFloat(finishedWidth) || 0) * toInches;
    const fl = Math.max(0, parseFloat(finishedLength) || 0) * toInches;
    const lenShrink = Math.min(99.9, Math.max(0, parseFloat(lengthShrinkagePct) || 0));
    const widShrink = Math.min(99.9, Math.max(0, parseFloat(widthShrinkagePct) || 0));

    if (fw <= 0 || fl <= 0) return null;

    // Required Pre-Wash Cut Dimensions:
    // PreWash * (1 - shrink/100) = Finished  =>  PreWash = Finished / (1 - shrink/100)
    const preWashW = fw / (1 - (widShrink / 100));
    const preWashL = fl / (1 - (lenShrink / 100));

    const extraLengthInches = preWashL - fl;
    const extraWidthInches = preWashW - fw;

    const preWashYards = preWashL / YD_TO_IN;
    const finishedYards = fl / YD_TO_IN;
    const extraYards = extraLengthInches / YD_TO_IN;

    return {
      finishedDimensions: {
        width: round(fw * toLocalDim, 2),
        length: round(fl * toLocalDim, 2)
      },
      preWashDimensions: {
        width: round(preWashW * toLocalDim, 2),
        length: round(preWashL * toLocalDim, 2)
      },
      extraRequired: {
        length: round(extraLengthInches * toLocalDim, 2),
        width: round(extraWidthInches * toLocalDim, 2),
        yards: round(extraYards, 2)
      },
      preWashYardage: formatYardageOutput(preWashYards),
      finishedYardage: formatYardageOutput(finishedYards),
      shrinkageUsed: {
        lengthPct: round(lenShrink, 1),
        widthPct: round(widShrink, 1)
      }
    };
  }

  // ==========================================
  // URL State Transfer & Copy Utilities
  // ==========================================
  function copyTextToClipboard(text, btnElement, successMsg = 'Copied!') {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showCopyFeedback(btnElement, successMsg);
      } catch (err) {
        console.error('Copy fallback failed:', err);
      }
      document.body.removeChild(textarea);
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      showCopyFeedback(btnElement, successMsg);
    }).catch(err => {
      console.error('Clipboard write failed:', err);
    });
  }

  function showCopyFeedback(btnElement, msg) {
    if (!btnElement) return;
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${msg}</span>
    `;
    btnElement.classList.add('copy-success');
    setTimeout(() => {
      btnElement.innerHTML = originalText;
      btnElement.classList.remove('copy-success');
    }, 2000);
  }

  return {
    IN_TO_CM,
    CM_TO_IN,
    YD_TO_IN,
    IN_TO_YD,
    YD_TO_M,
    M_TO_YD,
    QUILT_PRESETS,
    BOLT_WIDTH_PRESETS,
    CURTAIN_FULLNESS_PRESETS,
    SHRINKAGE_PRESETS,
    round,
    toFractionalYards,
    formatYardageOutput,
    calculateQuiltBacking,
    calculateQuiltBinding,
    calculateFabricYardage,
    calculateCurtainFabric,
    calculateSwatchShrinkage,
    calculatePreWashAdjustment,
    copyTextToClipboard
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SewingUtils;
}
