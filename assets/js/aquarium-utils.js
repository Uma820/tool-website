/**
 * Free Online Tools - Aquarium Calculator Suite Utility Engine
 * Shared volume formulas, tank presets, heater wattage sizing, water change dosing,
 * and 35+ species bioload & compatibility catalog.
 * 100% Client-Side.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AquariumUtils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ==========================================
  // 1. Constants & Presets
  // ==========================================

  // Conversion Factors
  const CU_INCHES_PER_US_GAL = 231.0;
  const LITERS_PER_US_GAL = 3.785411784;
  const LITERS_PER_UK_GAL = 4.54609;
  const LBS_PER_US_GAL_FRESH = 8.34;
  const LBS_PER_US_GAL_SALT = 8.55;
  const KG_PER_LB = 0.45359237;

  // Standard Commercial Aquarium Sizes (US Standard Glass)
  const STANDARD_TANKS = [
    { id: 'custom', name: 'Custom Dimensions', length: 24, width: 12, height: 16, shape: 'rectangular' },
    { id: '5gal', name: '5 Gallon Standard (16" × 8" × 10")', length: 16, width: 8, height: 10, shape: 'rectangular', nominalGal: 5 },
    { id: '10gal', name: '10 Gallon Standard (20" × 10" × 12")', length: 20, width: 10, height: 12, shape: 'rectangular', nominalGal: 10 },
    { id: '20gal_h', name: '20 Gallon High (24" × 12" × 16")', length: 24, width: 12, height: 16, shape: 'rectangular', nominalGal: 20 },
    { id: '20gal_l', name: '20 Gallon Long (30" × 12" × 12")', length: 30, width: 12, height: 12, shape: 'rectangular', nominalGal: 20 },
    { id: '29gal', name: '29 Gallon Standard (30" × 12" × 18")', length: 30, width: 12, height: 18, shape: 'rectangular', nominalGal: 29 },
    { id: '40gal_b', name: '40 Gallon Breeder (36" × 18" × 16")', length: 36, width: 18, height: 16, shape: 'rectangular', nominalGal: 40 },
    { id: '55gal', name: '55 Gallon Standard (48" × 13" × 21")', length: 48, width: 13, height: 21, shape: 'rectangular', nominalGal: 55 },
    { id: '75gal', name: '75 Gallon Standard (48" × 18" × 21")', length: 48, width: 18, height: 21, shape: 'rectangular', nominalGal: 75 },
    { id: '125gal', name: '125 Gallon Standard (72" × 18" × 21")', length: 72, width: 18, height: 21, shape: 'rectangular', nominalGal: 125 }
  ];

  // Commercial Aquarium Heater Ratings (Watts)
  const STANDARD_HEATERS = [25, 50, 75, 100, 150, 200, 300, 500];

  // Water Conditioners / Dechlorinators
  const CONDITIONER_PRESETS = {
    seachem_prime: {
      name: 'Seachem Prime',
      doseMlPerGal: 0.1, // 1 ml per 10 gal (5 ml per 50 gal)
      doseMlPerLiter: 0.0264,
      notes: 'Standard: 1 ml per 10 US Gal (5 ml per 50 Gal). 1 thread inside cap ≈ 1 ml.'
    },
    api_stress_coat: {
      name: 'API Stress Coat',
      doseMlPerGal: 0.5, // 5 ml per 10 gal
      doseMlPerLiter: 0.132,
      notes: 'Standard: 5 ml per 10 US Gal.'
    },
    tetra_aquasafe: {
      name: 'Tetra AquaSafe',
      doseMlPerGal: 0.5, // 5 ml per 10 gal
      doseMlPerLiter: 0.132,
      notes: 'Standard: 5 ml per 10 US Gal.'
    },
    fritz_complete: {
      name: 'Fritz Complete',
      doseMlPerGal: 0.1, // 1 ml per 10 gal
      doseMlPerLiter: 0.0264,
      notes: 'Standard: 1 ml per 10 US Gal.'
    },
    custom: {
      name: 'Custom Dosage',
      doseMlPerGal: 0.2,
      doseMlPerLiter: 0.0528,
      notes: 'Custom user-specified dosage per volume.'
    }
  };

  // 35+ Popular Aquarium Species Catalog
  // Bioload score is calibrated relative to a standard Neon Tetra (1.0).
  const SPECIES_CATALOG = [
    { id: 'neon_tetra', name: 'Neon Tetra', scientific: 'Paracheirodon innesi', adultSizeInch: 1.5, bioload: 1.0, minGal: 10, minLengthInch: 20, schoolingMin: 6, temp: [72, 78], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Delicate schooling fish; thrives in groups of 6+.' },
    { id: 'cardinal_tetra', name: 'Cardinal Tetra', scientific: 'Paracheirodon axelrodi', adultSizeInch: 1.75, bioload: 1.2, minGal: 15, minLengthInch: 24, schoolingMin: 6, temp: [75, 82], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Similar to Neons, prefers slightly warmer water.' },
    { id: 'rummy_nose', name: 'Rummy Nose Tetra', scientific: 'Hemigrammus bleheri', adultSizeInch: 2.0, bioload: 1.4, minGal: 20, minLengthInch: 30, schoolingMin: 6, temp: [75, 82], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Superb tight schooling behavior; red nose fades when stressed.' },
    { id: 'ember_tetra', name: 'Ember Tetra', scientific: 'Hyphessobrycon amandae', adultSizeInch: 0.8, bioload: 0.6, minGal: 5, minLengthInch: 16, schoolingMin: 6, temp: [73, 82], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Vibrant orange nano schooling fish.' },
    { id: 'guppy', name: 'Fancy Guppy', scientific: 'Poecilia reticulata', adultSizeInch: 2.0, bioload: 1.3, minGal: 10, minLengthInch: 20, schoolingMin: 3, temp: [72, 82], type: 'tropical', strata: 'top', behavior: 'peaceful', notes: 'Prolific livebearer; colorful and active.' },
    { id: 'endler_guppy', name: 'Endler Livebearer', scientific: 'Poecilia wingei', adultSizeInch: 1.2, bioload: 0.8, minGal: 5, minLengthInch: 16, schoolingMin: 3, temp: [74, 82], type: 'tropical', strata: 'top', behavior: 'peaceful', notes: 'Hardy, active nano livebearer.' },
    { id: 'platy', name: 'Platy', scientific: 'Xiphophorus maculatus', adultSizeInch: 2.5, bioload: 2.2, minGal: 10, minLengthInch: 20, schoolingMin: 3, temp: [70, 80], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Robust, peaceful community livebearer.' },
    { id: 'molly', name: 'Molly', scientific: 'Poecilia sphenops', adultSizeInch: 3.5, bioload: 3.5, minGal: 20, minLengthInch: 24, schoolingMin: 3, temp: [72, 82], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'High waste producer; prefers hard alkaline or brackish water.' },
    { id: 'swordtail', name: 'Swordtail', scientific: 'Xiphophorus hellerii', adultSizeInch: 4.0, bioload: 3.5, minGal: 29, minLengthInch: 30, schoolingMin: 3, temp: [72, 80], type: 'tropical', strata: 'top', behavior: 'peaceful', notes: 'Fast-swimming livebearer; requires swimming length.' },
    { id: 'betta_male', name: 'Betta (Male)', scientific: 'Betta splendens', adultSizeInch: 2.5, bioload: 2.5, minGal: 5, minLengthInch: 16, schoolingMin: 1, temp: [76, 82], type: 'tropical', strata: 'top', behavior: 'solitary', notes: 'Solitary! Never keep two males together. Avoid fin-nipping tank mates.' },
    { id: 'betta_female', name: 'Betta (Female)', scientific: 'Betta splendens', adultSizeInch: 2.2, bioload: 2.2, minGal: 10, minLengthInch: 20, schoolingMin: 1, temp: [76, 82], type: 'tropical', strata: 'top', behavior: 'peaceful', notes: 'Can be kept individually or in expert sororities (20+ gal).' },
    { id: 'dwarf_gourami', name: 'Dwarf Gourami', scientific: 'Trichogaster lalius', adultSizeInch: 3.0, bioload: 3.2, minGal: 15, minLengthInch: 24, schoolingMin: 1, temp: [74, 82], type: 'tropical', strata: 'top', behavior: 'peaceful', notes: 'Labyrinth fish; peaceful centerpiece.' },
    { id: 'honey_gourami', name: 'Honey Gourami', scientific: 'Trichogaster chuna', adultSizeInch: 2.0, bioload: 2.0, minGal: 10, minLengthInch: 20, schoolingMin: 2, temp: [74, 82], type: 'tropical', strata: 'top', behavior: 'peaceful', notes: 'Very gentle and peaceful gourami.' },
    { id: 'pearl_gourami', name: 'Pearl Gourami', scientific: 'Trichopodus leerii', adultSizeInch: 4.5, bioload: 5.5, minGal: 30, minLengthInch: 36, schoolingMin: 2, temp: [77, 82], type: 'tropical', strata: 'top', behavior: 'peaceful', notes: 'Stunning centerpiece; needs plant cover and quiet flow.' },
    { id: 'corydoras_bronze', name: 'Bronze / Albino Corydoras', scientific: 'Corydoras aeneus', adultSizeInch: 2.75, bioload: 2.5, minGal: 20, minLengthInch: 24, schoolingMin: 6, temp: [72, 78], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Bottom dweller; needs smooth sand and groups of 6+.' },
    { id: 'corydoras_panda', name: 'Panda Corydoras', scientific: 'Corydoras panda', adultSizeInch: 2.0, bioload: 2.0, minGal: 15, minLengthInch: 24, schoolingMin: 6, temp: [68, 77], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Prefers slightly cooler water than other corydoras.' },
    { id: 'corydoras_pygmy', name: 'Pygmy Corydoras', scientific: 'Corydoras pygmaeus', adultSizeInch: 1.0, bioload: 0.8, minGal: 10, minLengthInch: 20, schoolingMin: 6, temp: [72, 79], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Nano bottom/mid swimmer; delightful in large shoals.' },
    { id: 'kuhli_loach', name: 'Kuhli Loach', scientific: 'Pangio kuhlii', adultSizeInch: 3.5, bioload: 2.0, minGal: 20, minLengthInch: 30, schoolingMin: 5, temp: [73, 82], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Eel-like bottom dweller; nocturnal burrower in soft sand.' },
    { id: 'otocinclus', name: 'Otocinclus Catfish', scientific: 'Otocinclus macrospilus', adultSizeInch: 1.75, bioload: 1.2, minGal: 10, minLengthInch: 20, schoolingMin: 6, temp: [72, 79], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Dedicated diatom algae eater; needs an established tank with biofilm.' },
    { id: 'bristlenose_pleco', name: 'Bristlenose Pleco', scientific: 'Ancistrus cirrhosus', adultSizeInch: 5.0, bioload: 9.0, minGal: 29, minLengthInch: 30, schoolingMin: 1, temp: [73, 80], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Heavy waste producer; great algae grazer, needs driftwood.' },
    { id: 'clown_pleco', name: 'Clown Pleco', scientific: 'Panaqolus maccus', adultSizeInch: 3.5, bioload: 6.0, minGal: 20, minLengthInch: 24, schoolingMin: 1, temp: [74, 82], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Wood-eating dwarf pleco; stays compact.' },
    { id: 'harlequin_rasbora', name: 'Harlequin Rasbora', scientific: 'Trigonostigma heteromorpha', adultSizeInch: 1.75, bioload: 1.2, minGal: 10, minLengthInch: 20, schoolingMin: 6, temp: [73, 80], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Hardy schooling fish with classic black pork-chop patch.' },
    { id: 'chili_rasbora', name: 'Chili Rasbora', scientific: 'Boraras brigittae', adultSizeInch: 0.7, bioload: 0.4, minGal: 5, minLengthInch: 16, schoolingMin: 8, temp: [74, 82], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Micro schooling gem; safe with dwarf shrimp.' },
    { id: 'cpd', name: 'Celestial Pearl Danio', scientific: 'Danio margaritatus', adultSizeInch: 0.9, bioload: 0.6, minGal: 10, minLengthInch: 20, schoolingMin: 6, temp: [71, 78], type: 'tropical', strata: 'mid', behavior: 'peaceful', notes: 'Spotted "Galaxy Rasbora", timid without dense live plants.' },
    { id: 'zebra_danio', name: 'Zebra Danio', scientific: 'Danio rerio', adultSizeInch: 2.0, bioload: 1.5, minGal: 15, minLengthInch: 24, schoolingMin: 6, temp: [64, 77], type: 'both', strata: 'top', behavior: 'peaceful', notes: 'Very fast, active surface schooling fish; tolerates cool water.' },
    { id: 'white_cloud', name: 'White Cloud Mountain Minnow', scientific: 'Tanichthys albonubes', adultSizeInch: 1.5, bioload: 1.0, minGal: 10, minLengthInch: 20, schoolingMin: 6, temp: [60, 72], type: 'coldwater', strata: 'top', behavior: 'peaceful', notes: 'Cool water favorite; no heater needed at room temp.' },
    { id: 'cherry_barb', name: 'Cherry Barb', scientific: 'Puntius titteya', adultSizeInch: 2.0, bioload: 1.5, minGal: 15, minLengthInch: 24, schoolingMin: 6, temp: [73, 81], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Peaceful barb; males turn deep ruby red.' },
    { id: 'tiger_barb', name: 'Tiger Barb', scientific: 'Puntigrus tetrazona', adultSizeInch: 3.0, bioload: 3.0, minGal: 29, minLengthInch: 30, schoolingMin: 8, temp: [74, 80], type: 'tropical', strata: 'mid', behavior: 'semi-aggressive', notes: 'Notorious fin-nipper! Keep in groups of 8+ to diffuse aggression. Avoid long-finned fish.' },
    { id: 'angelfish', name: 'Freshwater Angelfish', scientific: 'Pterophyllum scalare', adultSizeInch: 6.0, bioload: 12.0, minGal: 29, minLengthInch: 30, schoolingMin: 1, temp: [76, 84], type: 'tropical', strata: 'mid', behavior: 'semi-aggressive', notes: 'Tall vertical body; will eat small tetras/shrimp once adult.' },
    { id: 'german_ram', name: 'German Blue Ram', scientific: 'Mikrogeophagus ramirezi', adultSizeInch: 2.5, bioload: 3.5, minGal: 20, minLengthInch: 24, schoolingMin: 2, temp: [80, 86], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Warm water dwarf cichlid; sensitive to nitrate.' },
    { id: 'boesemani_rainbow', name: 'Boesemani Rainbowfish', scientific: 'Melanotaenia boesemani', adultSizeInch: 4.5, bioload: 6.0, minGal: 55, minLengthInch: 48, schoolingMin: 6, temp: [75, 82], type: 'tropical', strata: 'top', behavior: 'peaceful', notes: 'Fast schooling fish; requires a 4-foot long swimming runway.' },
    { id: 'fancy_goldfish', name: 'Fancy Goldfish (Fantail / Oranda)', scientific: 'Carassius auratus', adultSizeInch: 8.0, bioload: 25.0, minGal: 30, minLengthInch: 36, schoolingMin: 2, temp: [65, 74], type: 'coldwater', strata: 'mid', behavior: 'peaceful', notes: 'Massive waste producer! Coldwater only; needs heavy filtration.' },
    { id: 'cherry_shrimp', name: 'Cherry Shrimp', scientific: 'Neocaridina davidi', adultSizeInch: 1.2, bioload: 0.1, minGal: 2, minLengthInch: 10, schoolingMin: 5, temp: [68, 78], type: 'tropical', strata: 'all', behavior: 'peaceful', notes: 'Extremely low bioload; master algae cleaners.' },
    { id: 'amano_shrimp', name: 'Amano Shrimp', scientific: 'Caridina multidentata', adultSizeInch: 2.0, bioload: 0.3, minGal: 5, minLengthInch: 16, schoolingMin: 3, temp: [70, 80], type: 'tropical', strata: 'all', behavior: 'peaceful', notes: 'Powerhouse hair algae grazer; cannot breed in freshwater.' },
    { id: 'nerite_snail', name: 'Nerite Snail', scientific: 'Neritina natalensis', adultSizeInch: 1.0, bioload: 0.5, minGal: 5, minLengthInch: 16, schoolingMin: 1, temp: [72, 79], type: 'tropical', strata: 'all', behavior: 'peaceful', notes: 'Glass algae specialist; eggs will not hatch in freshwater.' },
    { id: 'mystery_snail', name: 'Mystery Snail', scientific: 'Pomacea bridgesii', adultSizeInch: 2.0, bioload: 2.0, minGal: 10, minLengthInch: 20, schoolingMin: 1, temp: [70, 82], type: 'tropical', strata: 'all', behavior: 'peaceful', notes: 'Large, entertaining snail; noticeable waste producer.' },
    { id: 'dwarf_frog', name: 'African Dwarf Frog', scientific: 'Hymenochirus boettgeri', adultSizeInch: 1.5, bioload: 2.0, minGal: 10, minLengthInch: 20, schoolingMin: 2, temp: [72, 78], type: 'tropical', strata: 'bottom', behavior: 'peaceful', notes: 'Fully aquatic frog; slow feeder with poor eyesight.' }
  ];

  // Helper: Round to specified decimal places
  function round(val, decimals = 1) {
    if (isNaN(val) || !isFinite(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round((val + Number.EPSILON) * factor) / factor;
  }

  // ==========================================
  // 2. Tool 1: Aquarium Volume Calculator
  // ==========================================
  function calculateAquariumVolume({
    shape = 'rectangular', // rectangular, cylinder, bowfront, hexagonal, corner
    unit = 'imperial',     // imperial (inches/gal/lbs) or metric (cm/L/kg)
    // Dimensions
    length = 24,           // L or side length
    width = 12,            // W or side width
    height = 16,           // H
    centerWidth = 16,      // for bowfront
    diameter = 18,         // for cylinder
    sideLength = 12,       // for hexagonal
    // Net Adjustments
    glassThicknessMm = 6,  // 0 to 20 mm
    headspaceInch = 1.0,   // top water line headspace (inches or cm converted)
    displacementPct = 12,  // 0% to 30% for substrate & hardscape
    substrateDepthInch = 2.0, // for bonus substrate calculator
    waterType = 'freshwater' // freshwater (8.34 lbs/gal) or saltwater (8.55 lbs/gal)
  }) {
    // Normalize dimensions to inches for calculations
    let l_in = Math.max(1, parseFloat(length) || 24);
    let w_in = Math.max(1, parseFloat(width) || 12);
    let h_in = Math.max(1, parseFloat(height) || 16);
    let cw_in = Math.max(w_in, parseFloat(centerWidth) || w_in);
    let dia_in = Math.max(1, parseFloat(diameter) || 18);
    let s_in = Math.max(1, parseFloat(sideLength) || 12);
    let hs_in = Math.max(0, parseFloat(headspaceInch) || 0);
    let subDepth_in = Math.max(0, parseFloat(substrateDepthInch) || 0);

    if (unit === 'metric') {
      l_in /= 2.54;
      w_in /= 2.54;
      h_in /= 2.54;
      cw_in /= 2.54;
      dia_in /= 2.54;
      s_in /= 2.54;
      hs_in /= 2.54;
      subDepth_in /= 2.54;
    }

    // Glass thickness in inches
    const glassThicknessIn = (Math.max(0, parseFloat(glassThicknessMm) || 6)) / 25.4;
    const dispFraction = Math.max(0, Math.min(40, parseFloat(displacementPct) || 12)) / 100;

    // Gross Footprint Area (sq in) and Gross Volume (cu in)
    let grossAreaSqIn = 0;
    let netInternalAreaSqIn = 0;

    switch (shape) {
      case 'cylinder': {
        const r = dia_in / 2;
        grossAreaSqIn = Math.PI * r * r;
        const r_int = Math.max(0.1, r - glassThicknessIn);
        netInternalAreaSqIn = Math.PI * r_int * r_int;
        break;
      }
      case 'bowfront': {
        // Footprint = Rectangle (L * W) + Parabolic Bow Segment (2/3 * L * (W_center - W))
        const bowRise = Math.max(0, cw_in - w_in);
        grossAreaSqIn = (l_in * w_in) + ((2 / 3) * l_in * bowRise);
        const l_int = Math.max(0.1, l_in - (2 * glassThicknessIn));
        const w_int = Math.max(0.1, w_in - glassThicknessIn);
        const bowRise_int = Math.max(0, bowRise - glassThicknessIn);
        netInternalAreaSqIn = (l_int * w_int) + ((2 / 3) * l_int * bowRise_int);
        break;
      }
      case 'hexagonal': {
        // Regular Hexagon Area = (3 * sqrt(3) / 2) * side^2
        grossAreaSqIn = ((3 * Math.sqrt(3)) / 2) * Math.pow(s_in, 2);
        const s_int = Math.max(0.1, s_in - (glassThicknessIn * 1.155));
        netInternalAreaSqIn = ((3 * Math.sqrt(3)) / 2) * Math.pow(s_int, 2);
        break;
      }
      case 'corner': {
        // Quarter Cylinder (Sector of 90 degrees = pi * R^2 / 4)
        grossAreaSqIn = (Math.PI * Math.pow(l_in, 2)) / 4;
        const l_int = Math.max(0.1, l_in - glassThicknessIn);
        netInternalAreaSqIn = (Math.PI * Math.pow(l_int, 2)) / 4;
        break;
      }
      case 'rectangular':
      default: {
        grossAreaSqIn = l_in * w_in;
        const l_int = Math.max(0.1, l_in - (2 * glassThicknessIn));
        const w_int = Math.max(0.1, w_in - (2 * glassThicknessIn));
        netInternalAreaSqIn = l_int * w_int;
        break;
      }
    }

    // Gross Volume
    const grossCuIn = grossAreaSqIn * h_in;
    const grossUsGal = grossCuIn / CU_INCHES_PER_US_GAL;
    const grossLiters = grossUsGal * LITERS_PER_US_GAL;
    const grossUkGal = grossLiters / LITERS_PER_UK_GAL;

    // Internal Water Height (Headspace subtracted)
    const effectiveWaterHeightIn = Math.max(0.1, h_in - glassThicknessIn - hs_in);
    const internalWaterCuIn = netInternalAreaSqIn * effectiveWaterHeightIn;
    const internalWaterUsGal = internalWaterCuIn / CU_INCHES_PER_US_GAL;

    // Net Water Volume (Substrate/Hardscape displacement subtracted)
    const netUsGal = Math.max(0, internalWaterUsGal * (1 - dispFraction));
    const netLiters = netUsGal * LITERS_PER_US_GAL;
    const netUkGal = netLiters / LITERS_PER_UK_GAL;

    // Substrate Requirement Bonus Calculator
    // Substrate weight: ~100 lbs/cu ft = ~0.058 lbs per cu in of substrate
    const substrateCuIn = netInternalAreaSqIn * subDepth_in;
    const substrateLbs = substrateCuIn * 0.058;
    const substrateKg = substrateLbs * KG_PER_LB;

    // Weights
    const waterDensityLbsPerGal = (waterType === 'saltwater') ? LBS_PER_US_GAL_SALT : LBS_PER_US_GAL_FRESH;
    const waterWeightLbs = netUsGal * waterDensityLbsPerGal;
    // Glass empty weight approx 1.35 lbs per gross gallon for standard float glass
    const glassWeightLbs = grossUsGal * 1.35;
    const totalFilledWeightLbs = waterWeightLbs + glassWeightLbs + substrateLbs;
    const totalFilledWeightKg = totalFilledWeightLbs * KG_PER_LB;

    return {
      shape,
      unit,
      gross: {
        usGal: round(grossUsGal, 1),
        liters: round(grossLiters, 1),
        ukGal: round(grossUkGal, 1),
        cuIn: round(grossCuIn, 0)
      },
      net: {
        usGal: round(netUsGal, 1),
        liters: round(netLiters, 1),
        ukGal: round(netUkGal, 1)
      },
      surfaceAreaSqIn: round(grossAreaSqIn, 1),
      surfaceAreaSqCm: round(grossAreaSqIn * 6.4516, 1),
      weight: {
        waterLbs: round(waterWeightLbs, 1),
        glassLbs: round(glassWeightLbs, 1),
        substrateLbs: round(substrateLbs, 1),
        totalLbs: round(totalFilledWeightLbs, 0),
        totalKg: round(totalFilledWeightKg, 0)
      },
      substrate: {
        depthInch: round(subDepth_in, 1),
        depthCm: round(subDepth_in * 2.54, 1),
        weightLbs: round(substrateLbs, 1),
        weightKg: round(substrateKg, 1)
      }
    };
  }

  // ==========================================
  // 3. Tool 2: Fish Tank Heater Size Calculator
  // ==========================================
  function calculateHeaterSize({
    waterVolume = 20,          // in Gallons or Liters based on unit
    unit = 'gallons',          // 'gallons' or 'liters'
    ambientTemp = 65,          // Coldest room ambient temp (°F or °C)
    targetTemp = 78,           // Desired aquarium temp (°F or °C)
    tempUnit = 'F',            // 'F' or 'C'
    isCovered = true           // Covered with glass lid or rimless open top
  }) {
    // Normalize volume to US Gallons
    const vGal = (unit === 'liters') ? (parseFloat(waterVolume) || 0) / LITERS_PER_US_GAL : (parseFloat(waterVolume) || 0);

    // Normalize temperatures to Fahrenheit for calculations
    let ambF = parseFloat(ambientTemp) || 65;
    let tgtF = parseFloat(targetTemp) || 78;

    if (tempUnit === 'C') {
      ambF = (ambF * 9 / 5) + 32;
      tgtF = (tgtF * 9 / 5) + 32;
    }

    const deltaF = Math.max(0, tgtF - ambF);
    const deltaC = deltaF * 5 / 9;

    // Lid heat loss multiplier: Open top rimless tanks lose 15% to 20% more heat through evaporation
    const lidMultiplier = isCovered ? 1.0 : 1.18;

    // Calculate required baseline watts:
    // Standard rule: ~3W/gal for up to 5°F delta, ~4.5W/gal for 10°F delta, ~6W/gal for 15°F delta
    // Mathematical continuous formula: Watts = VolGal * (2.0 + deltaF * 0.30) * lidMultiplier
    let rawWatts = 0;
    if (deltaF > 0 && vGal > 0) {
      const wattsPerGal = Math.max(2.5, 1.8 + (deltaF * 0.32));
      rawWatts = vGal * wattsPerGal * lidMultiplier;
    }

    // Round up to nearest standard commercial heater rating
    let recommendedTotalWatts = STANDARD_HEATERS[STANDARD_HEATERS.length - 1];
    for (let i = 0; i < STANDARD_HEATERS.length; i++) {
      if (STANDARD_HEATERS[i] >= rawWatts) {
        recommendedTotalWatts = STANDARD_HEATERS[i];
        break;
      }
    }

    // If extremely large tank (>125 gal / >500W required), calculate multiple 300W/500W units
    let heaterCount = 1;
    let singleHeaterWatts = recommendedTotalWatts;
    let dualHeaterRecommendation = null;

    if (vGal >= 35 || recommendedTotalWatts >= 150) {
      // Recommend dual heaters
      heaterCount = 2;
      const targetHalf = recommendedTotalWatts / 2;
      let halfRating = STANDARD_HEATERS[STANDARD_HEATERS.length - 1];
      for (let i = 0; i < STANDARD_HEATERS.length; i++) {
        if (STANDARD_HEATERS[i] >= targetHalf) {
          halfRating = STANDARD_HEATERS[i];
          break;
        }
      }
      singleHeaterWatts = halfRating;
      dualHeaterRecommendation = {
        enabled: true,
        count: 2,
        singleWatts: halfRating,
        totalCombinedWatts: halfRating * 2,
        reason: 'Dual heaters provide thermal runaway protection (prevent boiling if one sticks on) and prevent chilling shock if one fails in winter.'
      };
    }

    // Monthly Electricity Cost estimate (assuming ~45% winter heating duty cycle @ $0.15/kWh)
    const dailyKwh = (recommendedTotalWatts * 24 * 0.45) / 1000;
    const monthlyCostUsd = dailyKwh * 30 * 0.15;

    return {
      waterVolumeGal: round(vGal, 1),
      waterVolumeLiters: round(vGal * LITERS_PER_US_GAL, 1),
      deltaF: round(deltaF, 1),
      deltaC: round(deltaC, 1),
      isCovered,
      rawWatts: round(rawWatts, 0),
      recommendedTotalWatts,
      dualHeaters: dualHeaterRecommendation,
      dutyCycleDailyKwh: round(dailyKwh, 2),
      estimatedMonthlyCostUsd: round(monthlyCostUsd, 2)
    };
  }

  // ==========================================
  // 4. Tool 3: Aquarium Water Change Calculator
  // ==========================================
  function calculateWaterChange({
    tankVolume = 20,           // in Gallons or Liters
    unit = 'gallons',          // 'gallons' or 'liters'
    changePercentage = 25,     // 5% to 90%
    conditionerId = 'seachem_prime', // seachem_prime, api_stress_coat, tetra_aquasafe, etc.
    customMlPerGal = 0.2,
    doseMode = 'new_water',    // 'new_water' or 'full_tank'
    currentNitratePpm = 40,    // ppm in tank before change
    tapNitratePpm = 0          // ppm in fresh tap water
  }) {
    const v = Math.max(0.5, parseFloat(tankVolume) || 20);
    const pct = Math.max(1, Math.min(95, parseFloat(changePercentage) || 25));
    const changeFraction = pct / 100;

    // Volume changed in user's unit
    const waterChangedUserUnit = v * changeFraction;
    const waterRemainingUserUnit = v - waterChangedUserUnit;

    // Normalize to Gallons & Liters
    let waterChangedGal = waterChangedUserUnit;
    let waterChangedLiters = waterChangedUserUnit * LITERS_PER_US_GAL;
    let totalTankGal = v;

    if (unit === 'liters') {
      waterChangedGal = waterChangedUserUnit / LITERS_PER_US_GAL;
      waterChangedLiters = waterChangedUserUnit;
      totalTankGal = v / LITERS_PER_US_GAL;
    }

    // Bucket Count (Standard 5-Gallon / 19-Liter buckets)
    const bucketCount = waterChangedGal / 5.0;

    // Conditioner Dosing
    const preset = CONDITIONER_PRESETS[conditionerId] || CONDITIONER_PRESETS.seachem_prime;
    let doseRatePerGal = preset.doseMlPerGal;
    if (conditionerId === 'custom') {
      doseRatePerGal = parseFloat(customMlPerGal) || 0.2;
    }

    const volumeToDoseGal = (doseMode === 'full_tank') ? totalTankGal : waterChangedGal;
    const doseMl = volumeToDoseGal * doseRatePerGal;
    const doseDrops = Math.round(doseMl * 20); // 1 ml ≈ 20 drops

    // Cap helper for Seachem Prime
    let capGuide = '';
    if (conditionerId === 'seachem_prime') {
      if (doseMl < 1.0) {
        capGuide = `${doseDrops} drops (for nano tanks)`;
      } else if (doseMl <= 5.0) {
        capGuide = `Approx. ${round(doseMl, 1)} ml (each internal thread is ~1 ml)`;
      } else {
        const fullCaps = Math.floor(doseMl / 5);
        const remMl = round(doseMl % 5, 1);
        capGuide = `${fullCaps} full cap(s)${remMl > 0 ? ` + ${remMl} ml` : ''} (1 full cap = 5 ml)`;
      }
    }

    // Nitrate Simulation
    let postNitratePpm = null;
    let nitrateRemovedPpm = null;
    let nitrateStatus = null;

    if (currentNitratePpm !== '' && !isNaN(currentNitratePpm)) {
      const cNit = Math.max(0, parseFloat(currentNitratePpm) || 0);
      const tNit = Math.max(0, parseFloat(tapNitratePpm) || 0);

      // Post-change nitrate formula: Post = Current * (1 - pct) + Tap * pct
      postNitratePpm = round((cNit * (1 - changeFraction)) + (tNit * changeFraction), 1);
      nitrateRemovedPpm = round(cNit - postNitratePpm, 1);

      if (postNitratePpm <= 20) {
        nitrateStatus = { label: 'Optimal (<20 ppm)', class: 'badge-success' };
      } else if (postNitratePpm <= 40) {
        nitrateStatus = { label: 'Acceptable (20–40 ppm)', class: 'badge-warning' };
      } else if (postNitratePpm <= 80) {
        nitrateStatus = { label: 'High (40–80 ppm)', class: 'badge-danger' };
      } else {
        nitrateStatus = { label: 'Dangerous (>80 ppm)', class: 'badge-danger' };
      }
    }

    return {
      unit,
      waterChanged: round(waterChangedUserUnit, 1),
      waterRemaining: round(waterRemainingUserUnit, 1),
      waterChangedGal: round(waterChangedGal, 1),
      waterChangedLiters: round(waterChangedLiters, 1),
      bucketCount: round(bucketCount, 1),
      conditioner: {
        id: conditionerId,
        name: preset.name,
        doseMode,
        doseMl: round(doseMl, 2),
        doseDrops,
        capGuide
      },
      nitrate: postNitratePpm !== null ? {
        currentPpm: parseFloat(currentNitratePpm),
        tapPpm: parseFloat(tapNitratePpm) || 0,
        postPpm: postNitratePpm,
        removedPpm: nitrateRemovedPpm,
        status: nitrateStatus
      } : null
    };
  }

  // ==========================================
  // 5. Tool 4: Aquarium Stocking Calculator
  // ==========================================
  function calculateStocking({
    tankVolumeGal = 20,        // Gallons
    tankLengthInch = 24,       // Tank length in inches
    waterType = 'tropical',    // 'tropical', 'coldwater', 'brackish'
    filtrationLevel = 1.0,     // 1.0 (standard), 1.25 (canister/over-filtered), 1.4 (planted + canister)
    selectedSpecies = []       // [{ id, quantity }]
  }) {
    const vGal = Math.max(1, parseFloat(tankVolumeGal) || 20);
    const lInch = Math.max(6, parseFloat(tankLengthInch) || 24);
    const filt = Math.max(0.8, Math.min(2.0, parseFloat(filtrationLevel) || 1.0));

    // Base Bioload Capacity of Tank:
    // Capacity = Volume * 2.2 * FiltrationMultiplier
    const baseCapacity = vGal * 2.2 * filt;

    let totalBioload = 0;
    let totalFishCount = 0;
    const speciesBreakdown = [];
    const alerts = [];

    // Track active temperatures & species for compatibility checks
    const activeSpeciesData = [];

    selectedSpecies.forEach(item => {
      const sp = SPECIES_CATALOG.find(s => s.id === item.id);
      if (!sp) return;

      const qty = Math.max(0, parseInt(item.quantity, 10) || 0);
      if (qty <= 0) return;

      totalFishCount += qty;
      const subBioload = sp.bioload * qty;
      totalBioload += subBioload;

      activeSpeciesData.push({ ...sp, qty });

      speciesBreakdown.push({
        id: sp.id,
        name: sp.name,
        scientific: sp.scientific,
        quantity: qty,
        adultSizeInch: sp.adultSizeInch,
        bioloadScore: sp.bioload,
        subtotalBioload: round(subBioload, 1)
      });

      // 1. Schooling Minimum Check
      if (sp.schoolingMin > 1 && qty < sp.schoolingMin) {
        alerts.push({
          type: 'warning',
          category: 'schooling',
          text: `${sp.name} is a schooling species and thrives in groups of at least ${sp.schoolingMin} (you currently have ${qty}). Keeping them in small numbers causes chronic stress and illness.`
        });
      }

      // 2. Minimum Tank Size Check
      if (vGal < sp.minGal) {
        alerts.push({
          type: 'danger',
          category: 'tank_size',
          text: `${sp.name} requires at least a ${sp.minGal} Gallon tank as an adult (your tank is ${round(vGal, 0)} Gallons).`
        });
      }

      // 3. Minimum Tank Length Check
      if (lInch < sp.minLengthInch) {
        alerts.push({
          type: 'warning',
          category: 'tank_length',
          text: `${sp.name} requires at least ${sp.minLengthInch}" of horizontal swimming length (your tank is ${round(lInch, 0)}" long).`
        });
      }

      // 4. Male Betta Solitary Warning
      if (sp.id === 'betta_male' && qty > 1) {
        alerts.push({
          type: 'danger',
          category: 'aggression',
          text: `Never keep multiple male Bettas in the same aquarium! They will fight to the death over territory.`
        });
      }
    });

    // 5. Cross-Species Temperature & Water Compatibility Checks
    const hasTropical = activeSpeciesData.some(s => s.type === 'tropical');
    const hasColdwater = activeSpeciesData.some(s => s.type === 'coldwater');

    if (hasTropical && hasColdwater) {
      const coldNames = activeSpeciesData.filter(s => s.type === 'coldwater').map(s => s.name).join(', ');
      const tropNames = activeSpeciesData.filter(s => s.type === 'tropical').map(s => s.name).join(', ');
      alerts.push({
        type: 'danger',
        category: 'temperature',
        text: `Temperature Incompatibility: You have mixed Coldwater species (${coldNames}) with Tropical species (${tropNames}). Coldwater species suffer shortened lifespans from accelerated metabolism in warm tropical water, while tropical fish suffer immune collapse in unheated water.`
      });
    }

    // 6. Fin Nipping & Aggression Alerts (Tiger Barb + Long-finned fish)
    const hasTigerBarbs = activeSpeciesData.some(s => s.id === 'tiger_barb');
    const hasLongFinned = activeSpeciesData.some(s => ['betta_male', 'betta_female', 'guppy', 'angelfish'].includes(s.id));
    if (hasTigerBarbs && hasLongFinned) {
      alerts.push({
        type: 'warning',
        category: 'fin_nipping',
        text: `Fin Nipping Risk: Tiger Barbs frequently nip trailing fins and are not safe tank mates for Bettas, Guppies, or Angelfish.`
      });
    }

    // 7. Angelfish + Micro Shrimp / Micro Rasboras predation
    const hasAngelfish = activeSpeciesData.some(s => s.id === 'angelfish');
    const hasMicroPrey = activeSpeciesData.some(s => ['neon_tetra', 'ember_tetra', 'chili_rasbora', 'cherry_shrimp'].includes(s.id));
    if (hasAngelfish && hasMicroPrey) {
      alerts.push({
        type: 'warning',
        category: 'predation',
        text: `Predation Risk: Adult Angelfish naturally prey upon small nano fish (Neon Tetras, Chili Rasboras) and dwarf Cherry Shrimp.`
      });
    }

    // Calculate Stocking %
    const stockingPct = baseCapacity > 0 ? round((totalBioload / baseCapacity) * 100, 1) : 0;

    // Stocking Status & Gauge Level
    let statusLabel = 'Understocked';
    let statusColor = '#16a34a'; // Green
    let statusBadge = 'badge-success';
    let recommendedWaterChangePct = 20;

    if (stockingPct <= 70) {
      statusLabel = 'Understocked (Low Maintenance)';
      statusColor = '#0284c7';
      statusBadge = 'badge-success';
      recommendedWaterChangePct = 15;
    } else if (stockingPct <= 95) {
      statusLabel = 'Well-Stocked (Healthy Balance)';
      statusColor = '#16a34a';
      statusBadge = 'badge-success';
      recommendedWaterChangePct = 25;
    } else if (stockingPct <= 105) {
      statusLabel = 'Fully Stocked (Strict Care Needed)';
      statusColor = '#ea580c';
      statusBadge = 'badge-warning';
      recommendedWaterChangePct = 35;
    } else {
      statusLabel = 'Overstocked (High Bioload Warning)';
      statusColor = '#dc2626';
      statusBadge = 'badge-danger';
      recommendedWaterChangePct = 50;
    }

    return {
      tankVolumeGal: round(vGal, 1),
      tankLengthInch: round(lInch, 1),
      totalFishCount,
      totalBioload: round(totalBioload, 1),
      baseCapacity: round(baseCapacity, 1),
      stockingPct,
      statusLabel,
      statusColor,
      statusBadge,
      recommendedWaterChangePct,
      speciesBreakdown,
      alerts
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
    STANDARD_TANKS,
    STANDARD_HEATERS,
    CONDITIONER_PRESETS,
    SPECIES_CATALOG,
    round,
    calculateAquariumVolume,
    calculateHeaterSize,
    calculateWaterChange,
    calculateStocking,
    copyTextToClipboard
  };
});