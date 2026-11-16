/**
 * Voiceover & Podcast Script Runtime Timer & Rate Calculator Utilities
 * 100% Client-Side script parsing, spoken word counting, pause detection,
 * WPM runtime estimations, and commercial ad slot validation.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VoiceoverUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Standard Speaking Speed Benchmarks
  const WPM_PRESETS = {
    slow: { id: 'slow', name: 'Slow / Audiobook', wpm: 120, description: 'Clear, dramatic storytelling with deliberate pacing.' },
    conversational: { id: 'conversational', name: 'Conversational / YouTube', wpm: 150, description: 'Natural, engaging tone standard for modern video and explainers.' },
    energetic: { id: 'energetic', name: 'Energetic / Podcast', wpm: 165, description: 'Brisk, upbeat podcast hosts, tech reviews, and radio promos.' },
    fast: { id: 'fast', name: 'Fast / Ad Disclaimer', wpm: 190, description: 'Rapid-fire terms, promotional spots, and pharmaceutical disclaimers.' }
  };

  // Pause Duration Defaults (in seconds)
  const PAUSE_DEFAULTS = {
    comma: 0.25,        // Comma, semicolon, dash
    sentenceEnd: 0.60,  // Period, exclamation, question mark
    paragraph: 1.20,    // Double line-break
    beat: 0.80,         // [beat]
    breath: 0.40        // [breath]
  };

  /**
   * Format seconds into MM:SS or HH:MM:SS string
   */
  function formatSecondsToTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds <= 0) return '00:00';
    totalSeconds = Math.round(totalSeconds);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = n => String(n).padStart(2, '0');

    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  }

  /**
   * Approximate spoken word expansion for currency and numbers
   */
  function approximateSpokenExpansion(text) {
    if (!text) return text;
    let s = text;

    // Currency: $150 -> "150 dollars" (adds 1 word)
    s = s.replace(/[$€£₹](\d+(?:\.\d{1,2})?)/g, '$1 dollars');

    // Percent: 25% -> "25 percent"
    s = s.replace(/(\d+)%/g, '$1 percent');

    // Years like 2026 -> counted as ~2 words
    s = s.replace(/\b(19\d{2}|20\d{2})\b/g, '$1 year');

    return s;
  }

  /**
   * Parse script text and calculate runtime metrics
   * @param {string} rawText Input script text
   * @param {Object} options Configuration flags
   */
  function parseScript(rawText, options = {}) {
    if (!rawText || !rawText.trim()) {
      return {
        wordCount: 0,
        charCount: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        spokenText: '',
        speakingSeconds: 0,
        punctuationPauseSeconds: 0,
        explicitTagPauseSeconds: 0,
        totalPauseSeconds: 0,
        totalSeconds: 0,
        formattedTotal: '00:00',
        wpm: options.wpm || 150
      };
    }

    const wpm = options.wpm && options.wpm >= 50 && options.wpm <= 400 ? options.wpm : 150;
    const ignoreDirections = options.ignoreDirections !== false; // default true
    const expandNumbers = options.expandNumbers === true;        // default false
    const includePunctuation = options.includePunctuation !== false; // default true

    let text = rawText;

    // 1. Extract explicit pause tags
    let explicitTagPauseSeconds = 0;

    // Match [pause 1.5s], [pause 2], (pause 1s), etc.
    const pauseTagRegex = /(?:\[|\()(?:pause\s*([\d.]+)\s*s?)(?:\]|\))/gi;
    let match;
    while ((match = pauseTagRegex.exec(text)) !== null) {
      const val = parseFloat(match[1]);
      if (!isNaN(val) && val > 0) {
        explicitTagPauseSeconds += val;
      }
    }

    // Match [beat] (0.8s)
    const beatMatches = text.match(/(?:\[|\()beat(?:\]|\))/gi) || [];
    explicitTagPauseSeconds += beatMatches.length * PAUSE_DEFAULTS.beat;

    // Match [breath] (0.4s)
    const breathMatches = text.match(/(?:\[|\()breath(?:\]|\))/gi) || [];
    explicitTagPauseSeconds += breathMatches.length * PAUSE_DEFAULTS.breath;

    // 2. Strip explicit pause tags so they don't count as words
    text = text.replace(/(?:\[|\()(?:pause\s*[\d.]+\s*s?|beat|breath)(?:\]|\))/gi, ' ');

    // 3. Strip non-spoken stage directions if enabled (e.g. [upbeat music], (sighs), [SFX: Thunder])
    if (ignoreDirections) {
      text = text.replace(/\[[^\]]*\]/g, ' ');
      text = text.replace(/\([^\)]*\)/g, ' ');
    }

    // 4. Measure natural punctuation pauses before stripping punctuation
    let punctuationPauseSeconds = 0;
    if (includePunctuation) {
      // Commas, semicolons, em/en dashes
      const commaMatches = text.match(/[,;—–]/g) || [];
      // Sentence terminators (periods, exclamations, question marks)
      const sentenceEndMatches = text.match(/[.!?]+(?=\s|$)/g) || [];
      // Paragraph breaks (two or more line-breaks)
      const paragraphBreaks = text.split(/\r?\n\s*\r?\n/).length - 1;

      punctuationPauseSeconds = (commaMatches.length * PAUSE_DEFAULTS.comma) +
                                (sentenceEndMatches.length * PAUSE_DEFAULTS.sentenceEnd) +
                                (Math.max(0, paragraphBreaks) * PAUSE_DEFAULTS.paragraph);
    }

    // 5. Expand numbers if enabled
    let textToCount = text;
    if (expandNumbers) {
      textToCount = approximateSpokenExpansion(text);
    }

    // 6. Count spoken words
    const words = textToCount.match(/[\w\d'’]+/g) || [];
    const wordCount = words.length;

    // Basic document stats
    const charCount = textToCount.length;
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [];
    const sentenceCount = sentences.length || (wordCount > 0 ? 1 : 0);
    const paragraphs = rawText.split(/\r?\n\s*\r?\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length || (wordCount > 0 ? 1 : 0);

    // 7. Calculate runtime
    const speakingSeconds = wordCount > 0 ? (wordCount / wpm) * 60 : 0;
    const totalPauseSeconds = explicitTagPauseSeconds + punctuationPauseSeconds;
    const totalSeconds = speakingSeconds + totalPauseSeconds;

    return {
      wordCount,
      charCount,
      sentenceCount,
      paragraphCount,
      spokenText: text.trim(),
      wpm,
      speakingSeconds: Math.round(speakingSeconds * 10) / 10,
      punctuationPauseSeconds: Math.round(punctuationPauseSeconds * 10) / 10,
      explicitTagPauseSeconds: Math.round(explicitTagPauseSeconds * 10) / 10,
      totalPauseSeconds: Math.round(totalPauseSeconds * 10) / 10,
      totalSeconds: Math.round(totalSeconds * 10) / 10,
      formattedTotal: formatSecondsToTime(totalSeconds)
    };
  }

  /**
   * Calculate commercial broadcast ad spot fit (15s, 30s, 60s)
   */
  function checkAdSlotFit(actualSeconds, targetSeconds) {
    if (!targetSeconds || targetSeconds <= 0) return null;
    const diff = Math.round((targetSeconds - actualSeconds) * 10) / 10;
    const pct = Math.min(100, Math.round((actualSeconds / targetSeconds) * 100));
    const fits = actualSeconds <= targetSeconds;

    // Approximate words to cut or add (assuming 150 WPM = 2.5 words/sec)
    const wordDelta = Math.round(Math.abs(diff) * 2.5);

    let statusText = '';
    if (fits) {
      if (diff <= 1.0) {
        statusText = `Spot on! Fits inside ${targetSeconds}s with a ${diff}s clean buffer.`;
      } else {
        statusText = `Fits easily inside ${targetSeconds}s (${diff}s buffer remaining).`;
      }
    } else {
      statusText = `Over by ${Math.abs(diff)}s! Cut approx. ${wordDelta} word${wordDelta === 1 ? '' : 's'} to fit.`;
    }

    return {
      targetSeconds,
      actualSeconds,
      diff,
      pct,
      fits,
      wordDelta,
      statusText
    };
  }

  /**
   * Calculate Voiceover Pricing Quote
   */
  function calculateQuote(wordCount, totalSeconds, pricingModel = 'word', unitRate = 0.15, extraFee = 0) {
    let basePrice = 0;
    const finishedMinutes = Math.max(1, Math.ceil(totalSeconds / 60));
    const finishedHours = totalSeconds / 3600;

    if (pricingModel === 'word') {
      basePrice = wordCount * unitRate;
    } else if (pricingModel === 'pfm') {
      basePrice = finishedMinutes * unitRate;
    } else if (pricingModel === 'pfh') {
      basePrice = Math.max(1, finishedHours) * unitRate;
    } else if (pricingModel === 'flat') {
      basePrice = unitRate;
    }

    const total = Math.max(0, basePrice + (parseFloat(extraFee) || 0));
    return {
      pricingModel,
      unitRate,
      extraFee,
      basePrice: Math.round(basePrice * 100) / 100,
      total: Math.round(total * 100) / 100,
      finishedMinutes,
      finishedHours: Math.round(finishedHours * 100) / 100
    };
  }

  return {
    WPM_PRESETS,
    PAUSE_DEFAULTS,
    formatSecondsToTime,
    parseScript,
    checkAdSlotFit,
    calculateQuote
  };
}));
