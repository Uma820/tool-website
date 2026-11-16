/**
 * Short-Form Safe-Zone Utility Engine
 * Shared client-side geometry, overlay specs, and canvas template generation
 * for TikTok, Instagram Reels, and YouTube Shorts (1080x1920 base).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SafeZoneUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Base canvas dimensions for 9:16 vertical short-form video
  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1920;

  // Platform Specs (all values in px on a 1080 x 1920 canvas)
  const PLATFORMS = {
    tiktok: {
      name: 'TikTok',
      topMargin: 220,
      bottomMarginStandard: 380,
      bottomMarginAd: 460,
      rightMargin: 180,
      leftMargin: 60,
      color: '#00f2fe',
      cadColor: 'rgba(0, 242, 254, 0.25)',
      dangerColor: 'rgba(254, 44, 85, 0.35)',
      safeColor: 'rgba(34, 197, 94, 0.25)'
    },
    reels: {
      name: 'Instagram Reels',
      topMargin: 220,
      bottomMarginStandard: 340,
      bottomMarginExpanded: 420,
      rightMargin: 160,
      leftMargin: 50,
      grid4x5: { top: 285, bottom: 1635, height: 1350 }, // 1080 x 1350 center crop
      grid1x1: { top: 420, bottom: 1500, height: 1080 }, // 1080 x 1080 center square
      color: '#e1306c',
      cadColor: 'rgba(225, 48, 108, 0.25)',
      dangerColor: 'rgba(225, 48, 108, 0.35)',
      safeColor: 'rgba(34, 197, 94, 0.25)'
    },
    shorts: {
      name: 'YouTube Shorts',
      topMargin: 180,
      bottomMarginStandard: 380,
      rightMargin: 180,
      leftMargin: 50,
      color: '#ff0000',
      cadColor: 'rgba(255, 0, 0, 0.25)',
      dangerColor: 'rgba(255, 0, 0, 0.35)',
      safeColor: 'rgba(34, 197, 94, 0.25)'
    },
    universal: {
      name: 'Universal All-3 Strictest',
      topMargin: 220, // Max top
      bottomMarginStandard: 460, // Max bottom (including TikTok Ad / expanded captions)
      rightMargin: 180, // Max right
      leftMargin: 60,  // Max left
      color: '#3b82f6',
      cadColor: 'rgba(59, 130, 246, 0.25)',
      dangerColor: 'rgba(239, 68, 68, 0.38)',
      safeColor: 'rgba(34, 197, 94, 0.28)'
    }
  };

  /**
   * Calculate exact safe zone rectangle for given platform and options
   */
  function getSafeZoneRect(platformKey, options = {}) {
    const spec = PLATFORMS[platformKey] || PLATFORMS.universal;
    const top = spec.topMargin;
    let bottomMargin = spec.bottomMarginStandard;

    if (platformKey === 'tiktok' && options.adMode) {
      bottomMargin = spec.bottomMarginAd;
    } else if (platformKey === 'reels' && options.expandedCaption) {
      bottomMargin = spec.bottomMarginExpanded;
    } else if (options.expandedCaption && platformKey !== 'universal') {
      bottomMargin += 80;
    }

    const right = spec.rightMargin;
    const left = spec.leftMargin;

    const x = left;
    const y = top;
    const width = CANVAS_WIDTH - left - right;
    const height = CANVAS_HEIGHT - top - bottomMargin;

    return {
      x,
      y,
      width,
      height,
      top,
      bottom: CANVAS_HEIGHT - bottomMargin,
      left,
      right: CANVAS_WIDTH - right,
      bottomMargin,
      rightMargin: right
    };
  }

  /**
   * Generate demo 9:16 sample frame on canvas
   */
  function drawSampleDemoFrame(canvas) {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');

    // Rich modern aesthetic dark gradient
    const grad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    grad.addColorStop(0, '#111827');
    grad.addColorStop(0.35, '#1e1b4b');
    grad.addColorStop(0.7, '#311042');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle background mesh glow circles
    const radGlow1 = ctx.createRadialGradient(540, 700, 50, 540, 700, 480);
    radGlow1.addColorStop(0, 'rgba(147, 51, 234, 0.35)');
    radGlow1.addColorStop(1, 'rgba(147, 51, 234, 0)');
    ctx.fillStyle = radGlow1;
    ctx.fillRect(0, 200, CANVAS_WIDTH, 1000);

    const radGlow2 = ctx.createRadialGradient(400, 1300, 30, 400, 1300, 450);
    radGlow2.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
    radGlow2.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = radGlow2;
    ctx.fillRect(0, 900, CANVAS_WIDTH, 900);

    // Decorative grid lines (rule of thirds)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(360, 0); ctx.lineTo(360, CANVAS_HEIGHT);
    ctx.moveTo(720, 0); ctx.lineTo(720, CANVAS_HEIGHT);
    ctx.moveTo(0, 640); ctx.lineTo(CANVAS_WIDTH, 640);
    ctx.moveTo(0, 1280); ctx.lineTo(CANVAS_WIDTH, 1280);
    ctx.stroke();

    // Center focal point graphics
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(540, 960, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(540, 800); ctx.lineTo(540, 1120);
    ctx.moveTo(380, 960); ctx.lineTo(700, 960);
    ctx.stroke();

    // Center badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('9:16 DEMO VIDEO FRAME', 540, 920);

    ctx.font = '500 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText('1080 × 1920 Standard Resolution', 540, 985);
    ctx.fillText('Subject / Key Content Stays In Center', 540, 1035);

    // Top test text (to demonstrate overlap in danger zone)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('▲ TOP UI ZONE (Tabs & Search overlap here) ▲', 540, 120);

    // Bottom test text (demonstrating caption area overlap)
    ctx.fillText('▼ BOTTOM UI ZONE (Captions & Audio overlap here) ▼', 540, 1780);

    // Right rail note
    ctx.save();
    ctx.translate(1010, 960);
    ctx.rotate(Math.PI / 2);
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('RIGHT ACTION RAIL OVERLAP', 0, 0);
    ctx.restore();
  }

  /**
   * Draw transparent CAD safe zone guide overlay onto a 1080x1920 canvas
   */
  function drawCadOverlay(canvas, platformKey, options = {}) {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const spec = PLATFORMS[platformKey] || PLATFORMS.universal;
    const rect = getSafeZoneRect(platformKey, options);

    // 1. Danger Zone Fill (Red tinted translucent overlay outside safe zone)
    ctx.fillStyle = spec.dangerColor || 'rgba(239, 68, 68, 0.35)';

    // Top danger zone
    ctx.fillRect(0, 0, CANVAS_WIDTH, rect.top);
    // Bottom danger zone
    ctx.fillRect(0, rect.bottom, CANVAS_WIDTH, rect.bottomMargin);
    // Right danger zone (between top and bottom)
    ctx.fillRect(rect.right, rect.top, spec.rightMargin, rect.height);
    // Left margin zone
    ctx.fillRect(0, rect.top, spec.leftMargin, rect.height);

    // 2. Safe Zone Inner Fill (Subtle green tinted overlay)
    ctx.fillStyle = spec.safeColor || 'rgba(34, 197, 94, 0.2)';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    // 3. Green Safe Zone Boundary Outline
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 8]);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.setLineDash([]);

    // 4. Red Danger Zone Outer Outlines
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    // Top danger line
    ctx.beginPath();
    ctx.moveTo(0, rect.top); ctx.lineTo(CANVAS_WIDTH, rect.top);
    // Bottom danger line
    ctx.moveTo(0, rect.bottom); ctx.lineTo(CANVAS_WIDTH, rect.bottom);
    // Right danger line
    ctx.moveTo(rect.right, rect.top); ctx.lineTo(rect.right, rect.bottom);
    ctx.stroke();

    // 5. Profile Grid Crop Guides (for Reels or when enabled)
    if (options.showProfileGrid || platformKey === 'reels') {
      const grid = PLATFORMS.reels.grid4x5;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 6]);
      ctx.strokeRect(0, grid.top, CANVAS_WIDTH, grid.height);
      ctx.setLineDash([]);

      // Label for 4:5
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('── Instagram Profile Feed 4:5 Crop (1080 × 1350) ──', 30, grid.top + 32);
      ctx.fillText('── 4:5 Bottom Cutoff ──', 30, grid.bottom - 16);

      if (options.show1x1Grid) {
        const grid1 = PLATFORMS.reels.grid1x1;
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(0, grid1.top, CANVAS_WIDTH, grid1.height);
        ctx.setLineDash([]);

        ctx.fillStyle = '#60a5fa';
        ctx.fillText('── Instagram Profile 1:1 Square Center Crop (1080 × 1080) ──', 30, grid1.top + 30);
      }
    }

    // 6. Text Labels & Measurements
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';

    // Top Danger Label
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`▲ TOP DANGER ZONE (Top ${rect.top}px / ${Math.round(rect.top / CANVAS_HEIGHT * 100)}%) ▲`, 540, rect.top / 2 + 8);

    // Bottom Danger Label
    ctx.fillText(`▼ BOTTOM DANGER ZONE (Bottom ${rect.bottomMargin}px / ${Math.round(rect.bottomMargin / CANVAS_HEIGHT * 100)}%) ▼`, 540, rect.bottom + (rect.bottomMargin / 2) + 8);

    // Right Rail Label
    ctx.save();
    ctx.translate(rect.right + (spec.rightMargin / 2), rect.y + (rect.height / 2));
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`▶ RIGHT DANGER ZONE (${spec.rightMargin}px) ▶`, 0, 8);
    ctx.restore();

    // Center Safe Zone Label Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(540 - 270, rect.y + 30, 540, 70);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(540 - 270, rect.y + 30, 540, 70);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`✅ SAFE ZONE (${rect.width} × ${rect.height} px)`, 540, rect.y + 60);
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${spec.name} Overlay Guide · 100% In-Browser`, 540, rect.y + 88);

    // Corner crosshairs for editors
    drawCrosshair(ctx, rect.x, rect.y);
    drawCrosshair(ctx, rect.right, rect.y);
    drawCrosshair(ctx, rect.x, rect.bottom);
    drawCrosshair(ctx, rect.right, rect.bottom);
  }

  function drawCrosshair(ctx, x, y) {
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 20, y); ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20); ctx.lineTo(x, y + 20);
    ctx.stroke();
  }

  /**
   * Generate transparent PNG download for CapCut / Premiere / DaVinci
   */
  function exportTransparentPng(platformKey, options = {}, filename = 'safe-zone-overlay-1080x1920.png') {
    const canvas = document.createElement('canvas');
    drawCadOverlay(canvas, platformKey, options);

    canvas.toBlob(function (blob) {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 5000);
    }, 'image/png');
  }

  /**
   * Export composite screenshot of underlying media + overlay
   */
  function exportCompositeScreenshot(mediaEl, platformKey, options = {}, filename = 'preview-with-overlay.png') {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');

    // 1. Draw media element (Image or Video)
    if (mediaEl) {
      try {
        const mw = mediaEl.videoWidth || mediaEl.naturalWidth || mediaEl.width || CANVAS_WIDTH;
        const mh = mediaEl.videoHeight || mediaEl.naturalHeight || mediaEl.height || CANVAS_HEIGHT;

        if (options.fitMode === 'contain') {
          // Letterbox contain
          const scale = Math.min(CANVAS_WIDTH / mw, CANVAS_HEIGHT / mh);
          const dw = mw * scale;
          const dh = mh * scale;
          const dx = (CANVAS_WIDTH - dw) / 2;
          const dy = (CANVAS_HEIGHT - dh) / 2;
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.drawImage(mediaEl, dx, dy, dw, dh);
        } else {
          // Cover center crop (default 9:16)
          const scale = Math.max(CANVAS_WIDTH / mw, CANVAS_HEIGHT / mh);
          const dw = mw * scale;
          const dh = mh * scale;
          const dx = (CANVAS_WIDTH - dw) / 2;
          const dy = (CANVAS_HEIGHT - dh) / 2;
          ctx.drawImage(mediaEl, dx, dy, dw, dh);
        }
      } catch (e) {
        console.warn('Could not draw media onto canvas (cross-origin or format issue)', e);
        drawSampleDemoFrame(canvas);
      }
    } else {
      drawSampleDemoFrame(canvas);
    }

    // 2. Draw overlay
    const overlayCanvas = document.createElement('canvas');
    drawCadOverlay(overlayCanvas, platformKey, options);

    // Blend overlay with requested opacity
    ctx.globalAlpha = options.opacity !== undefined ? options.opacity : 0.85;
    ctx.drawImage(overlayCanvas, 0, 0);
    ctx.globalAlpha = 1.0;

    canvas.toBlob(function (blob) {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 5000);
    }, 'image/png');
  }

  return {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PLATFORMS,
    getSafeZoneRect,
    drawSampleDemoFrame,
    drawCadOverlay,
    exportTransparentPng,
    exportCompositeScreenshot
  };
}));
