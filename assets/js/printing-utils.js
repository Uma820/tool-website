/**
 * Free Online Tools - 3D Printing Suite Utility Engine
 * Shared calculation functions, material densities, spool tares, and currency formatting.
 * 100% Client-Side.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PrintingUtils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ==========================================
  // Constants & Presets
  // ==========================================

  // Material Densities (g/cm^3)
  const MATERIAL_DENSITIES = {
    pla: { name: 'PLA (Polylactic Acid)', density: 1.24, costPerKg: 20 },
    petg: { name: 'PETG (Polyethylene Terephthalate Glycol)', density: 1.27, costPerKg: 22 },
    abs: { name: 'ABS (Acrylonitrile Butadiene Styrene)', density: 1.04, costPerKg: 19 },
    asa: { name: 'ASA (Acrylonitrile Styrene Acrylate)', density: 1.07, costPerKg: 26 },
    tpu: { name: 'TPU 95A (Flexible)', density: 1.21, costPerKg: 30 },
    nylon: { name: 'Nylon / PA', density: 1.14, costPerKg: 38 },
    pc: { name: 'Polycarbonate (PC)', density: 1.20, costPerKg: 35 },
    placf: { name: 'PLA-CF (Carbon Fiber)', density: 1.30, costPerKg: 32 },
    resin: { name: 'Standard UV Resin (SLA)', density: 1.12, costPerKg: 28 }
  };

  // Empty Spool Tare Weights (grams)
  const SPOOL_TARES = {
    bambu_reusable: { name: 'Bambu Lab Reusable Spool', tare: 250 },
    bambu_cardboard: { name: 'Bambu Lab Cardboard Spool', tare: 215 },
    esun_plastic: { name: 'eSUN Plastic Spool', tare: 235 },
    polymaker_cardboard: { name: 'Polymaker Cardboard Spool', tare: 140 },
    hatchbox_plastic: { name: 'Hatchbox Plastic Spool', tare: 225 },
    prusament_hybrid: { name: 'Prusament Hybrid (Cardboard/Plastic)', tare: 201 },
    sunlu_plastic: { name: 'SUNLU Plastic Spool', tare: 195 },
    creality_cardboard: { name: 'Creality Cardboard Spool', tare: 150 },
    custom: { name: 'Custom Tare Weight', tare: 200 }
  };

  // Printer Wattage Presets (Watts)
  const PRINTER_WATTS = {
    bambu_p1s: { name: 'Bambu Lab P1S / X1C (~110W avg)', watts: 110 },
    bambu_a1: { name: 'Bambu Lab A1 / A1 Mini (~90W avg)', watts: 90 },
    ender3: { name: 'Creality Ender 3 / CR-10 (~150W avg)', watts: 150 },
    prusa_mk4: { name: 'Prusa MK3S+ / MK4 (~120W avg)', watts: 120 },
    chamber_heated: { name: 'High-Temp / Active Chamber (Voron/K1 Max ~300W)', watts: 300 },
    resin_mono: { name: 'SLA Resin Mono LCD (~50W avg)', watts: 50 },
    custom: { name: 'Custom Printer Wattage', watts: 120 }
  };

  // Currency Symbols and Formats
  const CURRENCIES = {
    USD: { symbol: '$', code: 'USD', position: 'prefix', name: 'US Dollar ($)' },
    INR: { symbol: '₹', code: 'INR', position: 'prefix', name: 'Indian Rupee (₹)' },
    EUR: { symbol: '€', code: 'EUR', position: 'prefix', name: 'Euro (€)' },
    GBP: { symbol: '£', code: 'GBP', position: 'prefix', name: 'British Pound (£)' }
  };

  // Conversions
  const METERS_TO_FEET = 3.28084;
  const FEET_TO_METERS = 0.3048;
  const GRAMS_TO_OUNCES = 0.035274;

  function round(val, decimals = 2) {
    if (isNaN(val) || !isFinite(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round((val + Number.EPSILON) * factor) / factor;
  }

  function formatCurrency(amount, currencyCode = 'USD', decimals = 2) {
    const cur = CURRENCIES[currencyCode] || CURRENCIES.USD;
    const val = round(amount, decimals).toFixed(decimals);
    return cur.position === 'prefix' ? `${cur.symbol}${val}` : `${val} ${cur.symbol}`;
  }

  // ==========================================
  // 1. 3D Print Cost Calculator
  // ==========================================
  function calculate3DPrintCost({
    filaments = [], // [{ name, weightUsedG, spoolCost, spoolWeightG }]
    printHours = 4,
    printMinutes = 30,
    printerWatts = 120,
    electricityRateKwh = 0.15,
    prepPostMinutes = 20,
    hourlyLaborRate = 25.0,
    printerCost = 600,
    lifespanHours = 3000,
    maintenancePerHour = 0.10,
    failureRatePct = 10,
    markupMultiplier = 2.5,
    quantity = 1,
    currency = 'USD'
  }) {
    // 1. Material Cost
    let totalMaterialCost = 0;
    let totalFilamentWeightG = 0;
    const filamentBreakdown = filaments.map((f, idx) => {
      const wUsed = Math.max(0, parseFloat(f.weightUsedG) || 0);
      const sCost = Math.max(0, parseFloat(f.spoolCost) || 0);
      const sWeight = Math.max(1, parseFloat(f.spoolWeightG) || 1000);
      const costPerG = sCost / sWeight;
      const itemCost = wUsed * costPerG;
      totalMaterialCost += itemCost;
      totalFilamentWeightG += wUsed;
      return {
        id: f.id || `fil-${idx}`,
        name: f.name || `Filament #${idx + 1}`,
        weightUsedG: round(wUsed, 1),
        spoolCost: sCost,
        spoolWeightG: sWeight,
        costPerG: round(costPerG, 4),
        totalCost: round(itemCost, 2)
      };
    });

    // 2. Electricity Cost
    const totalPrintHours = Math.max(0, parseFloat(printHours) || 0) + (Math.max(0, parseFloat(printMinutes) || 0) / 60);
    const watts = Math.max(0, parseFloat(printerWatts) || 0);
    const kwhRate = Math.max(0, parseFloat(electricityRateKwh) || 0);
    const totalKwh = (watts * totalPrintHours) / 1000;
    const electricityCost = totalKwh * kwhRate;

    // 3. Machine Depreciation & Maintenance
    const purchaseCost = Math.max(0, parseFloat(printerCost) || 0);
    const lifeHours = Math.max(1, parseFloat(lifespanHours) || 3000);
    const hourlyDepreciation = purchaseCost / lifeHours;
    const hourlyMaint = Math.max(0, parseFloat(maintenancePerHour) || 0);
    const totalMachineHourlyRate = hourlyDepreciation + hourlyMaint;
    const machineCost = totalMachineHourlyRate * totalPrintHours;

    // 4. Labor Cost
    const laborMins = Math.max(0, parseFloat(prepPostMinutes) || 0);
    const laborHours = laborMins / 60;
    const laborRate = Math.max(0, parseFloat(hourlyLaborRate) || 0);
    const laborCost = laborHours * laborRate;

    // 5. Failure Buffer
    const subtotal = totalMaterialCost + electricityCost + machineCost + laborCost;
    const failPct = Math.max(0, parseFloat(failureRatePct) || 0);
    const failureBufferCost = subtotal * (failPct / 100);

    // 6. Total True Cost Per Unit & Batch
    const totalCostPerUnit = subtotal + failureBufferCost;
    const batchQty = Math.max(1, parseInt(quantity, 10) || 1);
    const totalBatchCost = totalCostPerUnit * batchQty;

    // 7. Pricing & Markup
    const markup = Math.max(1.0, parseFloat(markupMultiplier) || 2.5);
    const recommendedPricePerUnit = totalCostPerUnit * markup;
    const netProfitPerUnit = recommendedPricePerUnit - totalCostPerUnit;
    const profitMarginPct = recommendedPricePerUnit > 0 ? (netProfitPerUnit / recommendedPricePerUnit) * 100 : 0;

    const totalBatchRevenue = recommendedPricePerUnit * batchQty;
    const totalBatchProfit = netProfitPerUnit * batchQty;

    // Cost Breakdown percentages
    const materialPct = totalCostPerUnit > 0 ? (totalMaterialCost / totalCostPerUnit) * 100 : 0;
    const electricityPct = totalCostPerUnit > 0 ? (electricityCost / totalCostPerUnit) * 100 : 0;
    const machinePct = totalCostPerUnit > 0 ? (machineCost / totalCostPerUnit) * 100 : 0;
    const laborPct = totalCostPerUnit > 0 ? (laborCost / totalCostPerUnit) * 100 : 0;
    const failurePct = totalCostPerUnit > 0 ? (failureBufferCost / totalCostPerUnit) * 100 : 0;

    return {
      currency,
      quantity: batchQty,
      totalPrintHours: round(totalPrintHours, 2),
      totalFilamentWeightG: round(totalFilamentWeightG, 1),
      filaments: filamentBreakdown,
      costs: {
        material: round(totalMaterialCost, 2),
        electricity: round(electricityCost, 2),
        machine: round(machineCost, 2),
        labor: round(laborCost, 2),
        failureBuffer: round(failureBufferCost, 2),
        totalPerUnit: round(totalCostPerUnit, 2),
        totalBatch: round(totalBatchCost, 2)
      },
      percentages: {
        material: round(materialPct, 1),
        electricity: round(electricityPct, 1),
        machine: round(machinePct, 1),
        labor: round(laborPct, 1),
        failure: round(failurePct, 1)
      },
      pricing: {
        markupMultiplier: markup,
        recommendedPricePerUnit: round(recommendedPricePerUnit, 2),
        netProfitPerUnit: round(netProfitPerUnit, 2),
        profitMarginPct: round(profitMarginPct, 1),
        totalBatchRevenue: round(totalBatchRevenue, 2),
        totalBatchProfit: round(totalBatchProfit, 2)
      }
    };
  }

  // ==========================================
  // 2. Filament Remaining Calculator
  // ==========================================
  function calculateFilamentRemaining({
    mode = 'scale', // 'scale' or 'ruler'
    // Scale Mode Inputs
    grossWeightG = 450,
    spoolTareG = 215,
    originalNetWeightG = 1000,
    // Ruler Mode Inputs
    hubDiameterMm = 90,
    outerDiameterMm = 160,
    spoolWidthMm = 55,
    // Shared Inputs
    materialDensity = 1.24,
    filamentDiameterMm = 1.75,
    // Can I Print This Checker
    requiredGrams = 150,
    requiredMeters = 0
  }) {
    const density = Math.max(0.5, parseFloat(materialDensity) || 1.24);
    const diameterMm = Math.max(1.0, parseFloat(filamentDiameterMm) || 1.75);
    const radiusCm = (diameterMm / 2) / 10;
    const crossSectionAreaCm2 = Math.PI * Math.pow(radiusCm, 2);

    let remainingWeightG = 0;
    let percentLeft = 0;

    if (mode === 'scale') {
      const gross = Math.max(0, parseFloat(grossWeightG) || 0);
      const tare = Math.max(0, parseFloat(spoolTareG) || 0);
      const origNet = Math.max(1, parseFloat(originalNetWeightG) || 1000);

      remainingWeightG = Math.max(0, gross - tare);
      percentLeft = Math.min(100, Math.max(0, (remainingWeightG / origNet) * 100));
    } else {
      // Ruler Mode: Hollow cylinder formula with 0.78 packing factor
      const dHub = Math.max(10, parseFloat(hubDiameterMm) || 90);
      const dOut = Math.max(dHub, parseFloat(outerDiameterMm) || 160);
      const widthMm = Math.max(10, parseFloat(spoolWidthMm) || 55);

      const rOutMm = dOut / 2;
      const rHubMm = dHub / 2;
      const packingFactor = 0.78;

      const volumeMm3 = Math.PI * (Math.pow(rOutMm, 2) - Math.pow(rHubMm, 2)) * widthMm * packingFactor;
      const volumeCm3 = volumeMm3 / 1000;
      remainingWeightG = Math.max(0, volumeCm3 * density);

      const origNet = Math.max(1, parseFloat(originalNetWeightG) || 1000);
      percentLeft = Math.min(100, Math.max(0, (remainingWeightG / origNet) * 100));
    }

    // Remaining Volume & Length
    const remainingVolumeCm3 = remainingWeightG / density;
    const lengthCm = crossSectionAreaCm2 > 0 ? remainingVolumeCm3 / crossSectionAreaCm2 : 0;
    const lengthMeters = lengthCm / 100;
    const lengthFeet = lengthMeters * METERS_TO_FEET;

    // Can I Print This? Verification
    let canPrint = true;
    let diffGrams = 0;
    let diffMeters = 0;

    const reqG = Math.max(0, parseFloat(requiredGrams) || 0);
    const reqM = Math.max(0, parseFloat(requiredMeters) || 0);

    if (reqG > 0) {
      diffGrams = remainingWeightG - reqG;
      canPrint = diffGrams >= 0;
    } else if (reqM > 0) {
      diffMeters = lengthMeters - reqM;
      canPrint = diffMeters >= 0;
      diffGrams = remainingWeightG - (reqM * crossSectionAreaCm2 * 100 * density);
    } else {
      diffGrams = remainingWeightG;
      canPrint = remainingWeightG > 0;
    }

    return {
      mode,
      remainingWeightG: round(remainingWeightG, 1),
      remainingMeters: round(lengthMeters, 1),
      remainingFeet: round(lengthFeet, 1),
      percentLeft: round(percentLeft, 1),
      canPrint,
      differenceGrams: round(diffGrams, 1),
      differenceMeters: round(diffMeters, 1),
      density,
      filamentDiameterMm: diameterMm
    };
  }

  // ==========================================
  // 3. Filament Length Calculator
  // ==========================================
  function calculateFilamentLength({
    direction = 'weight_to_length', // 'weight_to_length' or 'length_to_weight'
    weightG = 250,
    lengthValue = 100,
    lengthUnit = 'm', // 'm' or 'mm'
    filamentDiameterMm = 1.75,
    materialDensity = 1.24,
    spoolCostPerKg = 20,
    currency = 'USD'
  }) {
    const density = Math.max(0.5, parseFloat(materialDensity) || 1.24);
    const diameterMm = Math.max(1.0, parseFloat(filamentDiameterMm) || 1.75);
    const radiusCm = (diameterMm / 2) / 10;
    const crossSectionAreaCm2 = Math.PI * Math.pow(radiusCm, 2);
    const pricePerKg = Math.max(0, parseFloat(spoolCostPerKg) || 0);

    let finalWeightG = 0;
    let finalLengthM = 0;

    if (direction === 'weight_to_length') {
      finalWeightG = Math.max(0, parseFloat(weightG) || 0);
      const volumeCm3 = finalWeightG / density;
      const lengthCm = crossSectionAreaCm2 > 0 ? volumeCm3 / crossSectionAreaCm2 : 0;
      finalLengthM = lengthCm / 100;
    } else {
      const rawLen = Math.max(0, parseFloat(lengthValue) || 0);
      finalLengthM = lengthUnit === 'mm' ? rawLen / 1000 : rawLen;
      const lengthCm = finalLengthM * 100;
      const volumeCm3 = crossSectionAreaCm2 * lengthCm;
      finalWeightG = volumeCm3 * density;
    }

    const finalLengthFt = finalLengthM * METERS_TO_FEET;
    const finalWeightOz = finalWeightG * GRAMS_TO_OUNCES;
    const volumeCm3 = finalWeightG / density;
    const estimatedCost = (finalWeightG / 1000) * pricePerKg;

    // Compute standard 1kg spool reference stats for this material
    const oneKgVolCm3 = 1000 / density;
    const oneKgLenM = (oneKgVolCm3 / crossSectionAreaCm2) / 100;

    return {
      direction,
      filamentDiameterMm: diameterMm,
      density,
      weightGrams: round(finalWeightG, 1),
      weightOunces: round(finalWeightOz, 2),
      lengthMeters: round(finalLengthM, 1),
      lengthFeet: round(finalLengthFt, 1),
      volumeCm3: round(volumeCm3, 1),
      estimatedCost: round(estimatedCost, 2),
      currency,
      standard1kgLengthM: round(oneKgLenM, 1)
    };
  }

  // ==========================================
  // 4. Multi-Color Waste Calculator
  // ==========================================
  function calculateMultiColorWaste({
    modelWeightG = 80,
    swapsCount = 420,
    flushVolumeMm3 = 180,
    primeTowerWeightG = 25,
    materialDensity = 1.24,
    costPerKg = 22,
    copiesCount = 1,
    currency = 'USD'
  }) {
    const modelG = Math.max(0, parseFloat(modelWeightG) || 0);
    const swaps = Math.max(0, parseInt(swapsCount, 10) || 0);
    const flushVol = Math.max(0, parseFloat(flushVolumeMm3) || 180);
    const towerG = Math.max(0, parseFloat(primeTowerWeightG) || 0);
    const density = Math.max(0.5, parseFloat(materialDensity) || 1.24);
    const pricePerKg = Math.max(0, parseFloat(costPerKg) || 0);
    const copies = Math.max(1, parseInt(copiesCount, 10) || 1);

    // Total flush volume per plate in mm^3
    const totalFlushVolMm3 = swaps * flushVol;
    // Density is g/cm^3. 1 cm^3 = 1000 mm^3.
    // Weight (g) = (Volume mm^3 / 1000) * density
    const purgeWasteWeightG = (totalFlushVolMm3 / 1000) * density;
    const totalWasteWeightG = purgeWasteWeightG + towerG;

    // Finished models total weight on the plate
    const totalFinishedModelsWeightG = modelG * copies;
    // Total filament consumed on plate
    const totalConsumedG = totalFinishedModelsWeightG + totalWasteWeightG;

    const wastePercentage = totalConsumedG > 0 ? (totalWasteWeightG / totalConsumedG) * 100 : 0;
    const wasteRatio = totalFinishedModelsWeightG > 0 ? totalWasteWeightG / totalFinishedModelsWeightG : 0;

    // Costs
    const costPerGram = pricePerKg / 1000;
    const modelFilamentCost = totalFinishedModelsWeightG * costPerGram;
    const wasteFilamentCost = totalWasteWeightG * costPerGram;
    const totalFilamentCost = totalConsumedG * costPerGram;

    const wasteCostPerPart = wasteFilamentCost / copies;
    const totalCostPerPart = totalFilamentCost / copies;

    // Batch optimization comparison table for 1, 2, 4, 8 copies
    // Note: Purge swaps and prime tower stay virtually constant across the plate!
    const batchPresets = [1, 2, 4, 8];
    const batchComparison = batchPresets.map(k => {
      const finishedWt = modelG * k;
      const consumed = finishedWt + totalWasteWeightG;
      const wastePct = (totalWasteWeightG / consumed) * 100;
      const wasteGPerPart = totalWasteWeightG / k;
      const wasteCostPart = (totalWasteWeightG * costPerGram) / k;
      const singlePartWasteG = totalWasteWeightG;
      const savingsPct = ((singlePartWasteG - wasteGPerPart) / singlePartWasteG) * 100;

      return {
        copies: k,
        totalFinishedWeightG: round(finishedWt, 1),
        totalConsumedG: round(consumed, 1),
        wastePct: round(wastePct, 1),
        wasteGPerPart: round(wasteGPerPart, 1),
        wasteCostPerPart: round(wasteCostPart, 2),
        savingsPct: round(Math.max(0, savingsPct), 1)
      };
    });

    return {
      copies,
      modelWeightG: round(modelG, 1),
      swaps,
      flushVolumeMm3: flushVol,
      primeTowerWeightG: round(towerG, 1),
      purgeWasteWeightG: round(purgeWasteWeightG, 1),
      totalWasteWeightG: round(totalWasteWeightG, 1),
      totalFinishedModelsWeightG: round(totalFinishedModelsWeightG, 1),
      totalConsumedG: round(totalConsumedG, 1),
      wastePercentage: round(wastePercentage, 1),
      wasteRatio: round(wasteRatio, 2),
      costs: {
        modelFilamentCost: round(modelFilamentCost, 2),
        wasteFilamentCost: round(wasteFilamentCost, 2),
        totalFilamentCost: round(totalFilamentCost, 2),
        wasteCostPerPart: round(wasteCostPerPart, 2),
        totalCostPerPart: round(totalCostPerPart, 2),
        currency
      },
      batchComparison
    };
  }

  // ==========================================
  // Clipboard Utility
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
      console.error('Clipboard copy error:', err);
    });
  }

  function showCopyFeedback(btnElement, successMsg) {
    if (!btnElement) return;
    const originalText = btnElement.innerHTML;
    btnElement.classList.add('copy-success');
    btnElement.innerHTML = `✓ ${successMsg}`;
    setTimeout(() => {
      btnElement.classList.remove('copy-success');
      btnElement.innerHTML = originalText;
    }, 2200);
  }

  return {
    MATERIAL_DENSITIES,
    SPOOL_TARES,
    PRINTER_WATTS,
    CURRENCIES,
    METERS_TO_FEET,
    FEET_TO_METERS,
    GRAMS_TO_OUNCES,
    round,
    formatCurrency,
    calculate3DPrintCost,
    calculateFilamentRemaining,
    calculateFilamentLength,
    calculateMultiColorWaste,
    copyTextToClipboard
  };
});
