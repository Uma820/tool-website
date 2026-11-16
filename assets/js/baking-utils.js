/**
 * Free Online Tools - Baking & Coffee Calculator Suite Shared Utilities
 * 100% Client-side culinary calculations, Baker's percentages,
 * hydration splits, yeast conversions, and coffee brew ratios.
 */

const BakingUtils = (function() {
  'use strict';

  // Conversion Constants
  const G_TO_OZ = 0.03527396;
  const OZ_TO_G = 28.34952;
  const ML_TO_FLOZ = 0.033814;
  const FLOZ_TO_ML = 29.5735;
  const TBSP_COFFEE_BEANS_G = 5.0; // ~5g whole beans or coarse grind per level US tbsp
  const TBSP_WATER_ML = 15.0;

  // Pizza Style Presets
  const PIZZA_PRESETS = {
    'neapolitan': {
      name: 'Neapolitan (AVPN Style)',
      hydration: 62.0,
      salt: 3.0,
      yeast: 0.2, // IDY
      oil: 0.0,
      sugar: 0.0,
      desc: 'Crisp, blistered cornicione, wood-fired 450°C (850°F)'
    },
    'new-york': {
      name: 'New York Style',
      hydration: 63.0,
      salt: 2.5,
      yeast: 0.4,
      oil: 2.0,
      sugar: 1.5,
      desc: 'Foldable, chewy slice, deck oven 260°C–290°C (500°F–550°F)'
    },
    'detroit': {
      name: 'Detroit / Sicilian Pan',
      hydration: 70.0,
      salt: 2.5,
      yeast: 0.6,
      oil: 3.0,
      sugar: 1.0,
      desc: 'Thick, airy focaccia-like crumb with crispy cheese edges'
    },
    'sourdough': {
      name: 'Artisan Sourdough Pizza',
      hydration: 65.0,
      salt: 2.5,
      yeast: 15.0, // Sourdough starter
      yeastType: 'starter',
      oil: 1.5,
      sugar: 0.0,
      desc: 'Long cold fermentation, complex flavor, digestible crumb'
    }
  };

  // Coffee Brew Presets
  const COFFEE_PRESETS = {
    'pourover': {
      name: 'Pour-Over (V60 / Chemex / Kalita)',
      ratio: 16.0, // 1:16
      grind: 'Medium-Fine (table salt to sand)',
      tempC: 93,
      tempF: 200,
      bloomRatio: 2.5, // 2.5x coffee weight
      bloomTimeSec: 45
    },
    'frenchpress': {
      name: 'French Press (Immersion)',
      ratio: 15.0, // 1:15
      grind: 'Coarse (sea salt crystals)',
      tempC: 94,
      tempF: 202,
      bloomRatio: 2.0,
      bloomTimeSec: 30
    },
    'autodrip': {
      name: 'Auto Drip Coffee Maker',
      ratio: 16.5, // 1:16.5
      grind: 'Medium (sand)',
      tempC: 92,
      tempF: 198,
      bloomRatio: 2.0,
      bloomTimeSec: 30
    },
    'aeropress': {
      name: 'AeroPress (Standard Method)',
      ratio: 14.0, // 1:14
      grind: 'Fine to Medium-Fine',
      tempC: 85,
      tempF: 185,
      bloomRatio: 2.0,
      bloomTimeSec: 30
    },
    'espresso': {
      name: 'Espresso (Double Shot)',
      ratio: 2.0, // 1:2
      grind: 'Very Fine (powdered table salt)',
      tempC: 93,
      tempF: 200,
      bloomRatio: 0,
      bloomTimeSec: 0
    },
    'coldbrew': {
      name: 'Cold Brew Concentrate',
      ratio: 5.0, // 1:5
      grind: 'Extra Coarse (cracked peppercorns)',
      tempC: 20,
      tempF: 68,
      bloomRatio: 0,
      bloomTimeSec: 0
    }
  };

  // Helper: Round number
  function round(val, decimals = 1) {
    if (isNaN(val) || !isFinite(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  // Helper: Grams to Ounces formatted
  function formatWeight(grams, isOz = false, decimals = 1) {
    if (isOz) {
      const oz = round(grams * G_TO_OZ, decimals === 0 ? 1 : 2);
      return `${oz} oz`;
    }
    return `${round(grams, decimals)} g`;
  }

  // ==========================================
  // 1. Pizza Dough Calculator
  // ==========================================
  function calculatePizzaDough({
    balls = 4,
    ballWeight = 250,
    hydration = 62,
    salt = 2.5,
    yeast = 0.3,
    yeastType = 'idy', // 'idy', 'ady', 'fresh', 'starter'
    oil = 0,
    sugar = 0
  }) {
    const numBalls = Math.max(1, parseInt(balls, 10) || 1);
    const weightPerBall = Math.max(10, parseFloat(ballWeight) || 250);
    const totalDoughTarget = numBalls * weightPerBall;

    const hydrPct = Math.max(0, parseFloat(hydration) || 0);
    const saltPct = Math.max(0, parseFloat(salt) || 0);
    let yeastPct = Math.max(0, parseFloat(yeast) || 0);
    const oilPct = Math.max(0, parseFloat(oil) || 0);
    const sugarPct = Math.max(0, parseFloat(sugar) || 0);

    // Yeast type multiplier against IDY base:
    // ADY = IDY * 1.25, Fresh = IDY * 3.0
    let yeastDisplayFactor = 1.0;
    if (yeastType === 'ady') yeastDisplayFactor = 1.25;
    else if (yeastType === 'fresh') yeastDisplayFactor = 3.0;

    const effectiveYeastPct = yeastPct * (yeastType === 'starter' ? 1.0 : yeastDisplayFactor);

    // Baker's % total: Flour is always 100%
    const totalBakerPercent = 100 + hydrPct + saltPct + effectiveYeastPct + oilPct + sugarPct;

    if (totalBakerPercent <= 0) return null;

    // Back-calculate flour weight:
    // Flour = Total Dough / (Total Baker % / 100)
    const flourGrams = totalDoughTarget / (totalBakerPercent / 100);
    const waterGrams = flourGrams * (hydrPct / 100);
    const saltGrams = flourGrams * (saltPct / 100);
    const yeastGrams = flourGrams * (effectiveYeastPct / 100);
    const oilGrams = flourGrams * (oilPct / 100);
    const sugarGrams = flourGrams * (sugarPct / 100);

    // Sum actual batch weight
    const totalBatchGrams = flourGrams + waterGrams + saltGrams + yeastGrams + oilGrams + sugarGrams;
    const actualBallWeight = totalBatchGrams / numBalls;

    // Hydration texture interpretation
    let textureBadge = 'Easy to Handle';
    let textureClass = 'badge-success';
    if (hydrPct < 58) {
      textureBadge = 'Stiff / Dry (Great for Detroit/Crackers)';
      textureClass = 'badge-warning';
    } else if (hydrPct <= 64) {
      textureBadge = 'Optimal / Easy to Handle (Classic NY & Neapolitan)';
      textureClass = 'badge-success';
    } else if (hydrPct <= 72) {
      textureBadge = 'Moderately Wet (Requires stretch & folds)';
      textureClass = 'badge-info';
    } else {
      textureBadge = 'High Hydration / Very Wet (Pan/Focaccia)';
      textureClass = 'badge-warning';
    }

    const ingredients = [
      { name: 'Flour (00 or Bread Flour)', pct: 100.0, totalG: round(flourGrams, 0), perBallG: round(flourGrams / numBalls, 1) },
      { name: 'Water', pct: hydrPct, totalG: round(waterGrams, 0), perBallG: round(waterGrams / numBalls, 1) },
      { name: 'Salt', pct: saltPct, totalG: round(saltGrams, 1), perBallG: round(saltGrams / numBalls, 1) },
      { 
        name: yeastType === 'starter' ? 'Sourdough Starter / Levain' : `Yeast (${yeastType.toUpperCase()})`,
        pct: round(effectiveYeastPct, 2),
        totalG: round(yeastGrams, 1),
        perBallG: round(yeastGrams / numBalls, 2)
      }
    ];

    if (oilPct > 0) {
      ingredients.push({ name: 'Olive Oil', pct: oilPct, totalG: round(oilGrams, 1), perBallG: round(oilGrams / numBalls, 1) });
    }
    if (sugarPct > 0) {
      ingredients.push({ name: 'Sugar / Diastatic Malt', pct: sugarPct, totalG: round(sugarGrams, 1), perBallG: round(sugarGrams / numBalls, 1) });
    }

    return {
      balls: numBalls,
      targetBallWeight: weightPerBall,
      totalBatchGrams: round(totalBatchGrams, 0),
      actualBallWeight: round(actualBallWeight, 1),
      hydrationPct: hydrPct,
      textureBadge,
      textureClass,
      ingredients
    };
  }

  // ==========================================
  // 2. Sourdough Hydration Calculator
  // ==========================================
  function calculateSourdoughHydration({
    flours = [], // [{ name, weight }]
    water = 350,
    starterWeight = 100,
    starterHydration = 100,
    salt = 10,
    inclusions = [] // [{ name, weight, waterFactor }]
  }) {
    let totalAddedFlour = 0;
    flours.forEach(f => {
      totalAddedFlour += Math.max(0, parseFloat(f.weight) || 0);
    });

    const addedWater = Math.max(0, parseFloat(water) || 0);
    const starterW = Math.max(0, parseFloat(starterWeight) || 0);
    const starterHydr = Math.max(1, parseFloat(starterHydration) || 100);
    const saltG = Math.max(0, parseFloat(salt) || 0);

    // Sourdough starter flour & water breakdown:
    // Starter = StarterFlour + (StarterFlour * (Hydration/100))
    // Starter = StarterFlour * (1 + Hydration/100)
    // StarterFlour = Starter / (1 + Hydration/100)
    const starterFlour = starterW / (1 + (starterHydr / 100));
    const starterWater = starterW - starterFlour;

    // Inclusion water contributions (e.g. Milk 88% water, Honey 17% water, Beer 95%)
    let inclusionWater = 0;
    let inclusionWeightTotal = 0;
    if (Array.isArray(inclusions)) {
      inclusions.forEach(inc => {
        const wt = Math.max(0, parseFloat(inc.weight) || 0);
        const factor = Math.max(0, Math.min(1, parseFloat(inc.waterFactor) || 0));
        inclusionWeightTotal += wt;
        inclusionWater += (wt * factor);
      });
    }

    const totalFlour = totalAddedFlour + starterFlour;
    const totalWater = addedWater + starterWater + inclusionWater;

    if (totalFlour <= 0) return null;

    // Hydration metrics
    const trueTotalHydration = (totalWater / totalFlour) * 100;
    const baseHydration = totalAddedFlour > 0 ? (addedWater / totalAddedFlour) * 100 : 0;
    const inoculationPct = totalAddedFlour > 0 ? (starterW / totalAddedFlour) * 100 : 0;
    const saltPct = (saltG / totalFlour) * 100;
    const totalDoughWeight = totalFlour + totalWater + saltG + inclusionWeightTotal;

    // Crumb / handling guide
    let handlingLevel = 'Standard Crumb';
    if (trueTotalHydration < 60) {
      handlingLevel = 'Stiff / Tight Crumb (Bagel, Pretzel)';
    } else if (trueTotalHydration <= 68) {
      handlingLevel = 'Standard Sourdough (Beginner-friendly, holds shape)';
    } else if (trueTotalHydration <= 78) {
      handlingLevel = 'Artisan Open Crumb (Custardy, aerated interior)';
    } else {
      handlingLevel = 'High Hydration (Ciabatta, Pan de Cristal, Focaccia)';
    }

    return {
      totalAddedFlour: round(totalAddedFlour, 1),
      starterFlour: round(starterFlour, 1),
      starterWater: round(starterWater, 1),
      totalFlour: round(totalFlour, 1),
      totalWater: round(totalWater, 1),
      addedWater: round(addedWater, 1),
      inclusionWater: round(inclusionWater, 1),
      trueTotalHydration: round(trueTotalHydration, 1),
      baseHydration: round(baseHydration, 1),
      inoculationPct: round(inoculationPct, 1),
      saltPct: round(saltPct, 2),
      totalDoughWeight: round(totalDoughWeight, 0),
      handlingLevel
    };
  }

  // ==========================================
  // 3. Baker's Percentage Calculations
  // ==========================================
  function calculateBakersPercentages({
    flours = [], // [{ name, weight }]
    ingredients = [] // [{ name, weight }]
  }) {
    let totalFlourWeight = 0;
    flours.forEach(f => {
      totalFlourWeight += Math.max(0, parseFloat(f.weight) || 0);
    });

    if (totalFlourWeight <= 0) return null;

    const flourList = flours.map(f => {
      const wt = Math.max(0, parseFloat(f.weight) || 0);
      const pct = (wt / totalFlourWeight) * 100;
      return {
        name: f.name || 'Flour',
        weight: round(wt, 1),
        bakersPct: round(pct, 1)
      };
    });

    let totalBatchWeight = totalFlourWeight;
    let waterWeight = 0;

    const otherList = ingredients.map(ing => {
      const wt = Math.max(0, parseFloat(ing.weight) || 0);
      totalBatchWeight += wt;
      const pct = (wt / totalFlourWeight) * 100;
      if (ing.name && ing.name.toLowerCase().includes('water')) {
        waterWeight += wt;
      }
      return {
        name: ing.name || 'Ingredient',
        weight: round(wt, 1),
        bakersPct: round(pct, 2)
      };
    });

    const overallHydration = (waterWeight / totalFlourWeight) * 100;

    return {
      totalFlourWeight: round(totalFlourWeight, 1),
      totalBatchWeight: round(totalBatchWeight, 1),
      overallHydration: round(overallHydration, 1),
      flours: flourList,
      ingredients: otherList
    };
  }

  function calculateWeightsFromPercentages({
    targetFlourWeight,
    targetDoughWeight,
    percentages = [] // [{ name, pct, isFlour }]
  }) {
    let totalBakerPct = 0;
    percentages.forEach(p => {
      totalBakerPct += Math.max(0, parseFloat(p.pct) || 0);
    });

    let baseFlour = 0;
    if (targetFlourWeight && parseFloat(targetFlourWeight) > 0) {
      baseFlour = parseFloat(targetFlourWeight);
    } else if (targetDoughWeight && parseFloat(targetDoughWeight) > 0 && totalBakerPct > 0) {
      baseFlour = parseFloat(targetDoughWeight) / (totalBakerPct / 100);
    }

    if (baseFlour <= 0) return null;

    let totalWeight = 0;
    const computed = percentages.map(item => {
      const pct = Math.max(0, parseFloat(item.pct) || 0);
      const wt = baseFlour * (pct / 100);
      totalWeight += wt;
      return {
        name: item.name,
        pct: round(pct, 2),
        weightG: round(wt, wt < 25 ? 1 : 0),
        weightOz: round(wt * G_TO_OZ, 2),
        isFlour: !!item.isFlour
      };
    });

    return {
      baseFlourWeight: round(baseFlour, 1),
      totalDoughWeight: round(totalWeight, 0),
      items: computed
    };
  }

  // ==========================================
  // 4. Bread Recipe Scaler
  // ==========================================
  function scaleRecipe({
    ingredients = [], // [{ name, amount, unit, isFlour }]
    mode = 'multiplier', // 'multiplier', 'yield', 'flour'
    multiplier = 1.0,
    originalYield = 1,
    targetYield = 1,
    targetFlourWeight = 0
  }) {
    if (!Array.isArray(ingredients) || ingredients.length === 0) return null;

    let scaleFactor = 1.0;

    if (mode === 'multiplier') {
      scaleFactor = Math.max(0.01, parseFloat(multiplier) || 1.0);
    } else if (mode === 'yield') {
      const origY = Math.max(0.1, parseFloat(originalYield) || 1);
      const targY = Math.max(0.1, parseFloat(targetYield) || 1);
      scaleFactor = targY / origY;
    } else if (mode === 'flour') {
      let origFlour = 0;
      ingredients.forEach(i => {
        if (i.isFlour) origFlour += Math.max(0, parseFloat(i.amount) || 0);
      });
      const targFlour = Math.max(0, parseFloat(targetFlourWeight) || 0);
      if (origFlour > 0 && targFlour > 0) {
        scaleFactor = targFlour / origFlour;
      }
    }

    let origTotal = 0;
    let scaledTotal = 0;

    const scaledItems = ingredients.map((item, idx) => {
      const amt = Math.max(0, parseFloat(item.amount) || 0);
      const scaledAmt = amt * scaleFactor;

      // Smart rounding
      let roundedScaled = scaledAmt;
      if (item.unit === 'g' || item.unit === 'ml') {
        roundedScaled = scaledAmt < 25 ? round(scaledAmt, 1) : Math.round(scaledAmt);
      } else {
        roundedScaled = round(scaledAmt, 2);
      }

      origTotal += amt;
      scaledTotal += roundedScaled;

      return {
        id: item.id || `ing-${idx}`,
        name: item.name || `Ingredient #${idx + 1}`,
        originalAmount: amt,
        scaledAmount: roundedScaled,
        unit: item.unit || 'g',
        isFlour: !!item.isFlour
      };
    });

    return {
      scaleFactor: round(scaleFactor, 3),
      originalTotal: round(origTotal, 1),
      scaledTotal: round(scaledTotal, 1),
      items: scaledItems
    };
  }

  // ==========================================
  // 5. Coffee-to-Water Ratio Calculator
  // ==========================================
  function calculateCoffeeBrew({
    brewMethod = 'pourover',
    ratio = 16.0,
    mode = 'coffee_to_water', // 'coffee_to_water', 'water_to_coffee', 'cups'
    coffeeGrams = 20,
    waterGrams = 320,
    cupCount = 2,
    cupSizeMl = 250,
    strengthAdjustment = 0 // -1 (stronger), 0 (balanced), +1 (lighter)
  }) {
    const preset = COFFEE_PRESETS[brewMethod] || COFFEE_PRESETS['pourover'];
    let effectiveRatio = Math.max(1, (parseFloat(ratio) || preset.ratio) + parseFloat(strengthAdjustment || 0));

    let finalCoffeeG = 0;
    let finalWaterG = 0;

    if (mode === 'coffee_to_water') {
      finalCoffeeG = Math.max(1, parseFloat(coffeeGrams) || 0);
      finalWaterG = finalCoffeeG * effectiveRatio;
    } else if (mode === 'water_to_coffee') {
      finalWaterG = Math.max(10, parseFloat(waterGrams) || 0);
      finalCoffeeG = finalWaterG / effectiveRatio;
    } else if (mode === 'cups') {
      const cups = Math.max(1, parseInt(cupCount, 10) || 1);
      const sizeMl = Math.max(50, parseFloat(cupSizeMl) || 250);
      finalWaterG = cups * sizeMl;
      finalCoffeeG = finalWaterG / effectiveRatio;
    }

    const coffeeTbsp = round(finalCoffeeG / TBSP_COFFEE_BEANS_G, 1);
    const waterFlOz = round(finalWaterG * ML_TO_FLOZ, 1);
    const coffeeOz = round(finalCoffeeG * G_TO_OZ, 2);

    // Pour-over bloom and steps
    const bloomG = round(finalCoffeeG * (preset.bloomRatio || 2.5), 0);
    const step1G = round(finalWaterG * 0.6, 0); // 60% pour
    const step2G = Math.round(finalWaterG);

    return {
      brewMethodName: preset.name,
      ratio: `1:${round(effectiveRatio, 1)}`,
      coffeeGrams: round(finalCoffeeG, 1),
      coffeeOunces: coffeeOz,
      coffeeTbsp,
      waterGrams: Math.round(finalWaterG),
      waterMl: Math.round(finalWaterG),
      waterFlOz,
      grindRecommendation: preset.grind,
      temperatureC: preset.tempC,
      temperatureF: preset.tempF,
      steps: {
        bloomG,
        bloomTimeSec: preset.bloomTimeSec || 45,
        step1G,
        finalG: step2G
      }
    };
  }

  // ==========================================
  // Clipboard Copy Feedback Utility
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
    G_TO_OZ,
    OZ_TO_G,
    ML_TO_FLOZ,
    FLOZ_TO_ML,
    PIZZA_PRESETS,
    COFFEE_PRESETS,
    round,
    formatWeight,
    calculatePizzaDough,
    calculateSourdoughHydration,
    calculateBakersPercentages,
    calculateWeightsFromPercentages,
    scaleRecipe,
    calculateCoffeeBrew,
    copyTextToClipboard
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BakingUtils;
}
