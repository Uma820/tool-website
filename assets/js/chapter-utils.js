/**
 * YouTube Chapter Formatter & Timestamp Validator Utility
 * Parses, validates, sorts, formats, and time-shifts YouTube chapter lists.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChapterUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Convert seconds to timestamp string
   */
  function formatSeconds(totalSeconds, format = 'auto') {
    if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
    totalSeconds = Math.round(totalSeconds);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (format === 'force_hmmss') {
      return `${h}:${pad(m)}:${pad(s)}`;
    }
    if (format === 'force_mmss') {
      const totalM = Math.floor(totalSeconds / 60);
      return `${pad(totalM)}:${pad(s)}`;
    }

    // Default 'auto': m:ss if h === 0, otherwise h:mm:ss
    if (h > 0) {
      return `${h}:${pad(m)}:${pad(s)}`;
    }
    return `${m}:${pad(s)}`;
  }

  /**
   * Format duration in human-readable form (e.g. "2m 15s" or "1h 05m 20s")
   */
  function formatDuration(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds <= 0) return '0s';
    totalSeconds = Math.round(totalSeconds);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  }

  /**
   * Parse timestamp string to seconds
   * Supports:
   *  - 0:00, 00:00, 1:23, 01:23, 1:02:30, 01:02:30
   *  - SMPTE with frames: 00:02:30:15 (ignores frames)
   *  - Period or hyphen delimiters: 2.30, 01-20
   *  - Single-digit seconds: 1:5 -> 1:05
   */
  function parseTimestampToSeconds(str) {
    if (!str) return null;
    let s = str.trim();

    // Remove surrounding brackets or parenthesis
    s = s.replace(/^[\[\(\{<]+|[\]\)\}>]+$/g, '');

    // Normalize hyphens/periods if used as time delimiters (e.g. "1.30" -> "1:30")
    s = s.replace(/(\d+)[.-](\d{2})(?!\d)/g, '$1:$2');

    // Split by colon
    const parts = s.split(':').map(p => p.trim());
    if (parts.length < 2) return null;

    // SMPTE 4 parts (h:m:s:frames) -> drop frames
    if (parts.length === 4) {
      parts.pop();
    }

    let hours = 0, minutes = 0, seconds = 0;

    if (parts.length === 3) {
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
      seconds = parseInt(parts[2], 10);
    } else if (parts.length === 2) {
      minutes = parseInt(parts[0], 10);
      seconds = parseInt(parts[1], 10);
    } else {
      return null;
    }

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
    if (minutes < 0 || seconds < 0 || hours < 0) return null;

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Parse raw textarea text into structured chapter array
   */
  function parseChaptersFromText(rawText) {
    if (!rawText || !rawText.trim()) return [];

    const lines = rawText.split(/\r?\n/);
    const chapters = [];

    // Regex to match timestamp anywhere in line
    // Matches: [01:23:45], 0:00, 1:5, 12.30, 00:02:30:15, etc.
    const timeRegex = /(?:\[|\()?(?:(\d{1,2})[:.-])?(\d{1,3})[:.-](\d{1,2})(?::(\d{1,2}))?(?:\]|\))?/;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const match = trimmed.match(timeRegex);
      if (!match) return;

      const matchedTimeStr = match[0];
      const seconds = parseTimestampToSeconds(matchedTimeStr);
      if (seconds === null) return;

      // Extract title: remove matched timestamp and surrounding delimiters like " - ", " : ", " — "
      let title = trimmed.replace(matchedTimeStr, '').trim();
      title = title.replace(/^[-–—:\s/|•]+|[-–—:\s/|•]+$/g, '').trim();

      chapters.push({
        id: 'ch_' + index + '_' + Math.random().toString(36).substr(2, 6),
        rawTime: matchedTimeStr,
        seconds: seconds,
        title: title || 'Untitled Chapter',
        originalLine: trimmed
      });
    });

    return chapters;
  }

  /**
   * Validate chapters against official YouTube rules
   */
  function validateChapters(chapters, totalVideoSeconds = null) {
    const issues = [];
    const warnings = [];

    if (!chapters || chapters.length === 0) {
      return {
        isValid: false,
        status: 'empty',
        statusText: 'No chapters entered yet',
        issues: ['Please paste or add timestamps to begin validation.'],
        warnings: []
      };
    }

    // Rule 1: Starts at 0:00
    const startsAtZero = chapters[0].seconds === 0;
    if (!startsAtZero) {
      issues.push({
        code: 'MISSING_ZERO',
        message: 'First chapter must start at 0:00 (currently starts at ' + formatSeconds(chapters[0].seconds) + ').',
        canAutoFix: true
      });
    }

    // Rule 2: Minimum 3 chapters
    if (chapters.length < 3) {
      issues.push({
        code: 'MIN_THREE',
        message: `YouTube requires at least 3 chapters in ascending order (found ${chapters.length}).`,
        canAutoFix: false
      });
    }

    // Rule 3: Chronological ascending order & duplicates
    let isAscending = true;
    let hasDuplicates = false;

    for (let i = 1; i < chapters.length; i++) {
      if (chapters[i].seconds < chapters[i - 1].seconds) {
        isAscending = false;
      } else if (chapters[i].seconds === chapters[i - 1].seconds) {
        hasDuplicates = true;
      }
    }

    if (!isAscending) {
      issues.push({
        code: 'NOT_ASCENDING',
        message: 'Timestamps must be in chronological ascending order.',
        canAutoFix: true
      });
    }

    if (hasDuplicates) {
      issues.push({
        code: 'DUPLICATE_TIMESTAMPS',
        message: 'Duplicate timestamps detected at the exact same second.',
        canAutoFix: true
      });
    }

    // Rule 4: Minimum 10 seconds duration per chapter
    // Duration of chapter i = chapter[i+1].seconds - chapter[i].seconds
    const shortChapters = [];
    for (let i = 0; i < chapters.length - 1; i++) {
      const dur = chapters[i + 1].seconds - chapters[i].seconds;
      if (dur < 10) {
        shortChapters.push({
          index: i,
          title: chapters[i].title,
          duration: dur,
          timeStr: formatSeconds(chapters[i].seconds)
        });
      }
    }

    // Check last chapter if total video length is provided
    if (totalVideoSeconds && totalVideoSeconds > 0 && chapters.length > 0) {
      const lastIdx = chapters.length - 1;
      const lastDur = totalVideoSeconds - chapters[lastIdx].seconds;
      if (lastDur < 10 && lastDur > 0) {
        shortChapters.push({
          index: lastIdx,
          title: chapters[lastIdx].title,
          duration: lastDur,
          timeStr: formatSeconds(chapters[lastIdx].seconds)
        });
      }
    }

    if (shortChapters.length > 0) {
      issues.push({
        code: 'SHORT_DURATION',
        message: `${shortChapters.length} chapter(s) are shorter than the 10-second YouTube minimum.`,
        details: shortChapters,
        canAutoFix: true
      });
    }

    // Title Quality & Mobile Truncation Check (> 50 chars)
    const longTitles = [];
    const emptyTitles = [];
    chapters.forEach((ch, idx) => {
      if (!ch.title || !ch.title.trim() || ch.title === 'Untitled Chapter') {
        emptyTitles.push(idx + 1);
      } else if (ch.title.length > 50) {
        longTitles.push({ index: idx + 1, title: ch.title, length: ch.title.length });
      }
    });

    if (emptyTitles.length > 0) {
      warnings.push(`Chapter ${emptyTitles.join(', ')} has an empty or missing title.`);
    }

    if (longTitles.length > 0) {
      warnings.push(`${longTitles.length} chapter title(s) exceed 50 characters (may be truncated on mobile YouTube scrubbers).`);
    }

    const isValid = issues.length === 0;

    return {
      isValid,
      status: isValid ? 'ready' : 'error',
      statusText: isValid ? 'Ready for YouTube' : `${issues.length} Issue(s) Found`,
      issues,
      warnings
    };
  }

  /**
   * Automatically fix all formatting, chronological, and 0:00 issues
   */
  function autoFixAll(chapters, totalVideoSeconds = null) {
    if (!chapters || chapters.length === 0) return [];

    let fixed = chapters.map(ch => ({ ...ch }));

    // 1. Sort ascending
    fixed.sort((a, b) => a.seconds - b.seconds);

    // 2. Remove exact duplicates (keeping the one with longer title)
    const deduped = [];
    fixed.forEach(ch => {
      if (deduped.length === 0) {
        deduped.push(ch);
      } else {
        const last = deduped[deduped.length - 1];
        if (last.seconds === ch.seconds) {
          if (ch.title.length > last.title.length) {
            deduped[deduped.length - 1] = ch;
          }
        } else {
          deduped.push(ch);
        }
      }
    });
    fixed = deduped;

    // 3. Prepend 0:00 Intro if missing
    if (fixed.length === 0 || fixed[0].seconds > 0) {
      fixed.unshift({
        id: 'ch_intro_' + Date.now(),
        rawTime: '0:00',
        seconds: 0,
        title: 'Intro'
      });
    }

    // 4. Merge chapters < 10 seconds with next chapter
    let merged = [];
    for (let i = 0; i < fixed.length; i++) {
      if (i < fixed.length - 1) {
        const dur = fixed[i + 1].seconds - fixed[i].seconds;
        if (dur < 10) {
          // Merge title with next chapter if short
          fixed[i + 1].title = fixed[i].title + ' & ' + fixed[i + 1].title;
          continue; // skip current
        }
      }
      merged.push(fixed[i]);
    }
    fixed = merged;

    // If still less than 3 chapters, we can't invent content, but it's now sorted & clean
    return fixed;
  }

  /**
   * Apply global time shift (+/- seconds) to all chapters after 0:00
   */
  function applyTimeOffset(chapters, offsetSeconds) {
    if (!chapters || !offsetSeconds || isNaN(offsetSeconds)) return chapters;
    const offset = Math.round(offsetSeconds);

    return chapters.map((ch, idx) => {
      // Keep 0:00 as 0:00
      if (idx === 0 && ch.seconds === 0) {
        return { ...ch };
      }
      const newSec = Math.max(0, ch.seconds + offset);
      return {
        ...ch,
        seconds: newSec
      };
    });
  }

  /**
   * Format titles with casing
   */
  function formatCase(title, mode) {
    if (!title) return '';
    if (mode === 'title') {
      // Title Case
      return title.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    } else if (mode === 'sentence') {
      // Sentence case
      const lower = title.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return title; // keep original
  }

  /**
   * Format full chapters list to clean string ready for YouTube Description
   */
  function exportToString(chapters, options = {}) {
    if (!chapters || chapters.length === 0) return '';

    const separatorStyle = options.separator || 'space'; // 'space', 'hyphen', 'emdash', 'colon'
    const timeFormat = options.timeFormat || 'auto'; // 'auto', 'force_mmss', 'force_hmmss'
    const caseMode = options.caseMode || 'original'; // 'original', 'title', 'sentence'

    const sepMap = {
      space: ' ',
      hyphen: ' - ',
      emdash: ' — ',
      colon: ': '
    };
    const sep = sepMap[separatorStyle] || ' ';

    return chapters.map(ch => {
      const timeStr = formatSeconds(ch.seconds, timeFormat);
      const titleStr = formatCase(ch.title, caseMode);
      return `${timeStr}${sep}${titleStr}`;
    }).join('\n');
  }

  return {
    formatSeconds,
    formatDuration,
    parseTimestampToSeconds,
    parseChaptersFromText,
    validateChapters,
    autoFixAll,
    applyTimeOffset,
    formatCase,
    exportToString
  };
}));
