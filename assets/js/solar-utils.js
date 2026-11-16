/**
 * Free Online Tools - Solar & Battery Calculator Suite Utility Engine
 * Shared electrical formulas, appliance wattages, battery chemistries, and peak sun hour presets.
 * 100% Client-Side.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SolarUtils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ==========================================
  // Presets & Constants
  // ==========================================

  // Battery Chemistry & Recommended Depth of Discharge (DoD)
  const BATTERY_CHEMISTRIES = {
    tubular_lead_acid: { name: 'Tubular / Flooded Lead-Acid', dod: 50, efficiency: 0.80 },
    agm_gel: { name: 'AGM / Sealed Gel Lead-Acid', dod: 60, efficiency: 0.85 },
    lifepo4: { name: 'LiFePO4 Lithium Iron Phosphate', dod: 85, efficiency: 0.95 },
    custom: { name: 'Custom Depth of Discharge (DoD)', dod: 50, efficiency: 0.85 }
  };

  // Common Household Appliance Wattages & Startup Surge
  const APPLIANCE_PRESETS = [
    { id: 'fan', name: 'Ceiling Fan', runningWatts: 75, surgeWatts: 150, category: 'Comfort' },
    { id: 'bulb', name: 'LED Light Bulb', runningWatts: 12, surgeWatts: 12, category: 'Lighting' },
    { id: 'tv', name: 'Smart LED TV (50")', runningWatts: 100, surgeWatts: 120, category: 'Entertainment' },
    { id: 'router', name: 'Wi-Fi Router & ONT', runningWatts: 15, surgeWatts: 15, category: 'Connectivity' },
    { id: 'laptop', name: 'Laptop Charger', runningWatts: 65, surgeWatts: 65, category: 'Work' },
    { id: 'fridge', name: 'Inverter Refrigerator', runningWatts: 150, surgeWatts: 600, category: 'Kitchen' },
    { id: 'desktop', name: 'Desktop PC & Monitor', runningWatts: 250, surgeWatts: 300, category: 'Work' },
    { id: 'split_ac', name: '1.5 Ton Inverter AC', runningWatts: 1500, surgeWatts: 3200, category: 'HVAC' },
    { id: 'water_pump', name: '1 HP Submersible Water Pump', runningWatts: 750, surgeWatts: 2200, category: 'Pumps' },
    { id: 'microwave', name: 'Countertop Microwave Oven', runningWatts: 1000, surgeWatts: 1000, category: 'Kitchen' },
    { id: 'sump_pump', name: '1/2 HP Sump Pump', runningWatts: 800, surgeWatts: 2150, category: 'Pumps' }
  ];

  // Peak Sun Hours (PSH) Regional Presets
  const SUN_HOUR_PRESETS = {
    cloudy: { name: 'Cloudy / Northern Climate (3.5 PSH)', hours: 3.5 },
    moderate: { name: 'Moderate / Temperate Climate (4.5 PSH)', hours: 4.5 },
    sunny: { name: 'Sunny / Subtropical (India, US Sunbelt) (5.5 PSH)', hours: 5.5 },
    desert: { name: 'Desert / High Solar Radiation (6.5 PSH)', hours: 6.5 }
  };

  // Standard Commercial Commercial Ratings
  const STANDARD_INVERTER_RATINGS_VA = [700, 900, 1100, 1500, 2000, 3000, 5000, 7500, 10000];
  const STANDARD_BATTERY_AH = [100, 150, 200, 220];
  const STANDARD_GENERATOR_KW = [2.0, 3.5, 5.0, 7.5, 10.0, 12.5, 15.0, 20.0, 25.0];

  function round(val, decimals = 1) {
    if (isNaN(val) || !isFinite(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round((val + Number.EPSILON) * factor) / factor;
  }

  function formatHoursMinutes(decimalHours) {
    if (isNaN(decimalHours) || !isFinite(decimalHours) || decimalHours <= 0) {
      return '0 min';
    }
    const totalMinutes = Math.round(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
      return `${minutes} min${minutes === 1 ? '' : 's'}`;
    }
    if (minutes === 0) {
      return `${hours} hr${hours === 1 ? '' : 's'}`;
    }
    return `${hours} hr${hours === 1 ? '' : 's'} ${minutes} min${minutes === 1 ? '' : 's'}`;
  }

  // ==========================================
  // 1. Battery Runtime Calculator
  // ==========================================
  function calculateBatteryRuntime({
    voltage = 12,
    capacityAh = 150,
    batteryCount = 1,
    wiring = 'parallel', // 'parallel' or 'series'
    dodPercentage = 50,
    loadType = 'watts', // 'watts' or 'amps'
    loadValue = 300,
    inverterEfficiencyPct = 88
  }) {
    const vSingle = Math.max(1, parseFloat(voltage) || 12);
    const ahSingle = Math.max(1, parseFloat(capacityAh) || 150);
    const count = Math.max(1, parseInt(batteryCount, 10) || 1);
    const dod = Math.max(1, Math.min(100, parseFloat(dodPercentage) || 50));
    const invEff = Math.max(1, Math.min(100, parseFloat(inverterEfficiencyPct) || 88)) / 100;

    // Bank voltage and capacity based on wiring
    let totalVoltage = vSingle;
    let totalAh = ahSingle;

    if (wiring === 'series') {
      totalVoltage = vSingle * count;
      totalAh = ahSingle;
    } else {
      // Parallel
      totalVoltage = vSingle;
      totalAh = ahSingle * count;
    }

    const totalCapacityWh = totalVoltage * totalAh;
    const totalCapacityKwh = totalCapacityWh / 1000;
    const usableEnergyWh = totalCapacityWh * (dod / 100);
    const usableEnergyKwh = usableEnergyWh / 1000;

    // Calculate actual load in Watts
    let loadWatts = 0;
    if (loadType === 'amps') {
      const loadAmps = Math.max(0, parseFloat(loadValue) || 0);
      loadWatts = loadAmps * totalVoltage;
    } else {
      loadWatts = Math.max(0, parseFloat(loadValue) || 0);
    }

    // Effective draw from battery accounting for inverter loss
    const effectiveDrawWatts = invEff > 0 ? loadWatts / invEff : loadWatts;

    let runtimeHours = 0;
    if (effectiveDrawWatts > 0) {
      runtimeHours = usableEnergyWh / effectiveDrawWatts;
    }

    // Reference table across standard load benchmarks (100W, 250W, 500W, 1000W, 1500W)
    const benchmarks = [100, 250, 500, 1000, 1500].map(benchWatts => {
      const effDraw = invEff > 0 ? benchWatts / invEff : benchWatts;
      const hrs = effDraw > 0 ? usableEnergyWh / effDraw : 0;
      return {
        loadWatts: benchWatts,
        runtimeHours: round(hrs, 2),
        runtimeFormatted: formatHoursMinutes(hrs)
      };
    });

    return {
      totalVoltage: round(totalVoltage, 1),
      totalAh: round(totalAh, 1),
      totalCapacityWh: round(totalCapacityWh, 0),
      totalCapacityKwh: round(totalCapacityKwh, 2),
      usableEnergyWh: round(usableEnergyWh, 0),
      usableEnergyKwh: round(usableEnergyKwh, 2),
      dodPercentage: dod,
      loadWatts: round(loadWatts, 1),
      effectiveDrawWatts: round(effectiveDrawWatts, 1),
      runtimeHours: round(runtimeHours, 2),
      runtimeFormatted: formatHoursMinutes(runtimeHours),
      benchmarks
    };
  }

  // ==========================================
  // 2. Inverter Backup Calculator
  // ==========================================
  function calculateInverterBackup({
    appliances = [], // [{ name, wattage, quantity }]
    backupHours = 4,
    systemVoltage = 12,
    batteryType = 'tubular_lead_acid',
    customDodPct = 50,
    inverterEfficiencyPct = 85,
    powerFactor = 0.8
  }) {
    let totalRunningWatts = 0;
    const sanitizedAppliances = appliances.map((app, idx) => {
      const w = Math.max(0, parseFloat(app.wattage) || 0);
      const q = Math.max(0, parseInt(app.quantity, 10) || 0);
      const subtotalW = w * q;
      totalRunningWatts += subtotalW;
      return {
        id: app.id || `app-${idx}`,
        name: app.name || `Appliance #${idx + 1}`,
        wattage: w,
        quantity: q,
        subtotalWatts: subtotalW,
        percentage: 0
      };
    });

    // Compute load percentage share
    sanitizedAppliances.forEach(app => {
      app.percentage = totalRunningWatts > 0 ? round((app.subtotalWatts / totalRunningWatts) * 100, 1) : 0;
    });

    const hours = Math.max(0.1, parseFloat(backupHours) || 4);
    const vSystem = Math.max(1, parseFloat(systemVoltage) || 12);
    const eff = Math.max(0.1, Math.min(1.0, (parseFloat(inverterEfficiencyPct) || 85) / 100));
    const pf = Math.max(0.6, Math.min(1.0, parseFloat(powerFactor) || 0.8));

    // DoD lookup
    const chemConfig = BATTERY_CHEMISTRIES[batteryType] || BATTERY_CHEMISTRIES.tubular_lead_acid;
    const dod = (batteryType === 'custom' ? parseFloat(customDodPct) : chemConfig.dod) || 50;

    // 1. Inverter Rating in VA: (Total Watts / PF) * 1.25 safety headroom
    const rawVA = (totalRunningWatts / pf) * 1.25;
    // Round up to nearest standard commercial inverter rating
    let recommendedVA = STANDARD_INVERTER_RATINGS_VA[STANDARD_INVERTER_RATINGS_VA.length - 1];
    for (let i = 0; i < STANDARD_INVERTER_RATINGS_VA.length; i++) {
      if (STANDARD_INVERTER_RATINGS_VA[i] >= rawVA) {
        recommendedVA = STANDARD_INVERTER_RATINGS_VA[i];
        break;
      }
    }
    const recommendedKva = recommendedVA >= 1000 ? round(recommendedVA / 1000, 1) : null;

    // 2. Battery Energy Required (Wh) = (Total Watts * Hours) / Inverter Efficiency
    const energyRequiredWh = (totalRunningWatts * hours) / eff;
    // Usable energy must equal energyRequiredWh: TotalWh * (DoD/100) = EnergyRequiredWh
    const totalBankCapacityWh = energyRequiredWh / (dod / 100);
    // Ah = Wh / System Voltage
    const rawAh = totalBankCapacityWh / vSystem;

    // Round up to commercial battery capacity (per 12V block)
    let recommendedSingleAh = 150;
    for (let i = 0; i < STANDARD_BATTERY_AH.length; i++) {
      if (STANDARD_BATTERY_AH[i] >= rawAh) {
        recommendedSingleAh = STANDARD_BATTERY_AH[i];
        break;
      }
    }
    // Number of 12V batteries needed in series to match system voltage
    const batteriesInSeries = Math.max(1, Math.round(vSystem / 12));
    // Number of parallel strings if rawAh exceeds single 220Ah battery
    const parallelStrings = Math.max(1, Math.ceil(rawAh / 220));
    const totalBatteriesNeeded = batteriesInSeries * parallelStrings;

    return {
      totalRunningWatts: round(totalRunningWatts, 1),
      backupHours: hours,
      systemVoltage: vSystem,
      energyRequiredWh: round(energyRequiredWh, 0),
      rawInverterVA: round(rawVA, 0),
      recommendedInverterVA: recommendedVA,
      recommendedInverterKva: recommendedKva,
      rawCapacityAh: round(rawAh, 1),
      recommendedBatteryAh: rawAh <= 220 ? recommendedSingleAh : Math.ceil(rawAh / parallelStrings),
      recommendedBatteriesCount: totalBatteriesNeeded,
      batteryConfiguration: `${batteriesInSeries} in series${parallelStrings > 1 ? ` x ${parallelStrings} parallel strings` : ''}`,
      appliances: sanitizedAppliances
    };
  }

  // ==========================================
  // 3. Solar Panel Size Calculator
  // ==========================================
  function calculateSolarPanelSize({
    systemType = 'ongrid', // 'ongrid', 'offgrid', 'hybrid'
    inputMode = 'monthly_bill', // 'monthly_bill' or 'daily_load'
    monthlyKwh = 450,
    dailyWh = 15000,
    peakSunHours = 5.0,
    panelWattage = 540,
    systemDerateFactorPct = 78,
    daysOfAutonomy = 1,
    batterySystemVoltage = 48
  }) {
    const psh = Math.max(1.0, parseFloat(peakSunHours) || 5.0);
    const panelW = Math.max(50, parseFloat(panelWattage) || 540);
    const derate = Math.max(0.5, Math.min(1.0, (parseFloat(systemDerateFactorPct) || 78) / 100));

    // Daily kWh consumed
    let dailyKwh = 0;
    if (inputMode === 'monthly_bill') {
      const mKwh = Math.max(0, parseFloat(monthlyKwh) || 0);
      dailyKwh = mKwh / 30;
    } else {
      const dWh = Math.max(0, parseFloat(dailyWh) || 0);
      dailyKwh = dWh / 1000;
    }

    // Required Solar Generation capacity (kW): Daily kWh / (Peak Sun Hours * Derate)
    const requiredSolarKw = (psh * derate > 0) ? (dailyKwh / (psh * derate)) : 0;
    const requiredSolarWatts = requiredSolarKw * 1000;

    // Number of panels
    const panelCount = panelW > 0 ? Math.ceil(requiredSolarWatts / panelW) : 0;
    const actualArrayKw = (panelCount * panelW) / 1000;

    // Roof area estimate: Modern ~400W to 550W panels measure approx 2.0m x 1.05m = ~2.1 m^2 (~22.6 sq ft)
    const sqFtPerPanel = 22.0;
    const sqMPerPanel = 2.05;
    const totalRoofSqFt = panelCount * sqFtPerPanel;
    const totalRoofSqM = panelCount * sqMPerPanel;

    // Off-Grid / Hybrid Battery Sizing
    let batteryBankKwh = 0;
    let batteryBankAh48V = 0;
    let chargeControllerAmps = 0;

    if (systemType === 'offgrid' || systemType === 'hybrid') {
      const autonomy = Math.max(1, parseFloat(daysOfAutonomy) || 1);
      const vBat = Math.max(12, parseFloat(batterySystemVoltage) || 48);
      // Assuming LiFePO4 / efficient lead-acid 80% usable DoD & 85% roundtrip efficiency
      batteryBankKwh = (dailyKwh * autonomy) / (0.80 * 0.85);
      batteryBankAh48V = (batteryBankKwh * 1000) / vBat;

      // Charge controller sizing: Array Watts / Battery Voltage with 1.25 margin
      chargeControllerAmps = (actualArrayKw * 1000) / vBat * 1.25;
    }

    return {
      systemType,
      dailyKwh: round(dailyKwh, 2),
      monthlyKwh: round(dailyKwh * 30, 1),
      peakSunHours: psh,
      systemDeratePct: round(derate * 100, 0),
      recommendedSystemSizeKw: round(requiredSolarKw, 2),
      actualArraySizeKw: round(actualArrayKw, 2),
      panelCount,
      singlePanelWattage: panelW,
      roofAreaSqFt: round(totalRoofSqFt, 0),
      roofAreaSqM: round(totalRoofSqM, 1),
      batteryStorage: {
        needed: systemType !== 'ongrid',
        bankKwh: round(batteryBankKwh, 1),
        bankAh: round(batteryBankAh48V, 0),
        systemVoltage: parseFloat(batterySystemVoltage) || 48,
        chargeControllerAmps: round(chargeControllerAmps, 0)
      }
    };
  }

  // ==========================================
  // 4. Generator Size Calculator
  // ==========================================
  function calculateGeneratorSize({
    appliances = [], // [{ name, runningWatts, surgeWatts, quantity }]
    altitudeDeratingPct = 0, // 0% sea level, 15% high altitude / hot climate
    safetyMarginPct = 20,
    powerFactor = 0.8
  }) {
    let totalRunningWatts = 0;
    let maxSurgeDelta = 0; // Highest single appliance startup surge delta: (Surge - Running)

    appliances.forEach(app => {
      const rW = Math.max(0, parseFloat(app.runningWatts) || 0);
      const sW = Math.max(rW, parseFloat(app.surgeWatts) || rW);
      const qty = Math.max(0, parseInt(app.quantity, 10) || 0);

      totalRunningWatts += rW * qty;

      if (qty > 0) {
        const delta = sW - rW;
        if (delta > maxSurgeDelta) {
          maxSurgeDelta = delta;
        }
      }
    });

    // Peak Starting Surge = Total Running + Highest Single Startup Surge Delta
    const peakStartingSurgeWatts = totalRunningWatts + maxSurgeDelta;

    const safetyMultiplier = 1 + (Math.max(0, parseFloat(safetyMarginPct) || 20) / 100);
    const altitudeMultiplier = 1 + (Math.max(0, parseFloat(altitudeDeratingPct) || 0) / 100);
    const pf = Math.max(0.6, Math.min(1.0, parseFloat(powerFactor) || 0.8));

    // Required Continuous Capacity
    const requiredRunningWatts = totalRunningWatts * safetyMultiplier * altitudeMultiplier;
    const requiredSurgeWatts = peakStartingSurgeWatts * 1.10 * altitudeMultiplier;

    const requiredRunningKw = requiredRunningWatts / 1000;
    const requiredSurgeKw = requiredSurgeWatts / 1000;

    // kVA = kW / Power Factor
    const requiredKva = requiredRunningKw / pf;

    // Round up to standard commercial generator size
    let recommendedKw = STANDARD_GENERATOR_KW[STANDARD_GENERATOR_KW.length - 1];
    for (let i = 0; i < STANDARD_GENERATOR_KW.length; i++) {
      if (STANDARD_GENERATOR_KW[i] >= requiredRunningKw) {
        recommendedKw = STANDARD_GENERATOR_KW[i];
        break;
      }
    }
    const recommendedKva = round(recommendedKw / pf, 1);

    return {
      totalRunningWatts: round(totalRunningWatts, 0),
      totalRunningKw: round(totalRunningWatts / 1000, 2),
      peakStartingSurgeWatts: round(peakStartingSurgeWatts, 0),
      peakStartingSurgeKw: round(peakStartingSurgeWatts / 1000, 2),
      requiredRunningKw: round(requiredRunningKw, 2),
      requiredSurgeKw: round(requiredSurgeKw, 2),
      recommendedGeneratorKw: recommendedKw,
      recommendedGeneratorKva: recommendedKva,
      safetyMarginPct,
      altitudeDeratingPct
    };
  }

  // ==========================================
  // Clipboard Copy Utility
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
        console.error('Clipboard copy error:', err);
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
    BATTERY_CHEMISTRIES,
    APPLIANCE_PRESETS,
    SUN_HOUR_PRESETS,
    STANDARD_INVERTER_RATINGS_VA,
    STANDARD_BATTERY_AH,
    STANDARD_GENERATOR_KW,
    round,
    formatHoursMinutes,
    calculateBatteryRuntime,
    calculateInverterBackup,
    calculateSolarPanelSize,
    calculateGeneratorSize,
    copyTextToClipboard
  };
});
