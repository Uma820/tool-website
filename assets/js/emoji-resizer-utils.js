/**
 * Discord & Twitch Custom Emoji & Emote Resizer Utilities
 * 100% Client-Side canvas operations, alpha trimming, sticker outlines,
 * presets, and zero-dependency PKZIP generator.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EmojiResizerUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Standard Platform Presets
  const PRESETS = {
    'discord-emoji': {
      id: 'discord-emoji',
      name: 'Discord Emoji',
      platform: 'Discord',
      targetSize: 128,
      sizes: [128],
      maxKb: 256,
      aspect: '1:1',
      description: '128×128 px standard Discord custom server emoji (Max 256 KB).'
    },
    'discord-sticker': {
      id: 'discord-sticker',
      name: 'Discord Sticker',
      platform: 'Discord',
      targetSize: 320,
      sizes: [320],
      maxKb: 512,
      aspect: '1:1',
      description: '320×320 px Discord server sticker with lossless alpha transparency (Max 512 KB).'
    },
    'twitch-emote': {
      id: 'twitch-emote',
      name: 'Twitch Emote',
      platform: 'Twitch',
      targetSize: 112,
      sizes: [112, 56, 28],
      maxKb: 1024,
      aspect: '1:1',
      description: '112×112 px standard Twitch subscriber emote + 56px & 28px bundle (Max 1 MB).'
    },
    'twitch-badge': {
      id: 'twitch-badge',
      name: 'Twitch Sub Badge',
      platform: 'Twitch',
      targetSize: 72,
      sizes: [72, 36, 18],
      maxKb: 25,
      aspect: '1:1',
      description: '72×72 px Twitch channel subscriber / bit loyalty badge + 36px & 18px (Strict 25 KB max).'
    },
    'custom': {
      id: 'custom',
      name: 'Custom Square',
      platform: 'Custom',
      targetSize: 128,
      sizes: [128],
      maxKb: 512,
      aspect: '1:1',
      description: 'Custom square dimensions (64px to 512px) with customizable file-size limit.'
    }
  };

  /**
   * Find bounding box of non-transparent pixels in ImageData
   * @param {ImageData} imageData 
   * @param {number} alphaThreshold 
   * @returns {{x: number, y: number, width: number, height: number, isEmpty: boolean}}
   */
  function findBoundingBox(imageData, alphaThreshold = 10) {
    const { width, height, data } = imageData;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > alphaThreshold) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX === -1) {
      // Entirely transparent or empty
      return { x: 0, y: 0, width, height, isEmpty: true };
    }

    return {
      x: minX,
      y: minY,
      width: (maxX - minX) + 1,
      height: (maxY - minY) + 1,
      isEmpty: false
    };
  }

  /**
   * CRC32 calculation table for PKZIP generator
   */
  const CRC32_TABLE = (function () {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c >>> 0;
    }
    return table;
  })();

  function calculateCrc32(uint8Array) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < uint8Array.length; i++) {
      crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ uint8Array[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  /**
   * Minimal zero-dependency in-memory PKZIP archive builder
   * @param {Array<{name: string, data: Uint8Array}>} files
   * @returns {Uint8Array} ZIP binary buffer
   */
  function buildZip(files) {
    let totalLength = 0;
    const records = [];

    files.forEach(file => {
      const nameBytes = new TextEncoder().encode(file.name);
      const dataBytes = file.data instanceof Uint8Array ? file.data : new Uint8Array(file.data);
      const crc = calculateCrc32(dataBytes);
      const size = dataBytes.length;

      // Local File Header is 30 bytes + name length + data length
      const localHeaderLength = 30 + nameBytes.length;
      totalLength += localHeaderLength + size;

      records.push({
        file,
        nameBytes,
        dataBytes,
        crc,
        size
      });
    });

    // Central directory length calculation
    let centralDirLength = 0;
    records.forEach(r => {
      centralDirLength += 46 + r.nameBytes.length;
    });

    // End of central directory is 22 bytes
    const fullZipLength = totalLength + centralDirLength + 22;
    const zipBuffer = new Uint8Array(fullZipLength);
    const view = new DataView(zipBuffer.buffer);

    let offset = 0;
    const centralOffsets = [];

    // 1. Write Local Headers + Data
    records.forEach(r => {
      centralOffsets.push(offset);

      // Local Header Signature 0x04034b50
      view.setUint32(offset, 0x04034b50, true);
      view.setUint16(offset + 4, 20, true); // Version needed (2.0)
      view.setUint16(offset + 6, 0, true);  // General purpose flags
      view.setUint16(offset + 8, 0, true);  // Compression (0 = Store)
      view.setUint16(offset + 10, 0, true); // Time
      view.setUint16(offset + 12, 0, true); // Date
      view.setUint32(offset + 14, r.crc, true); // CRC32
      view.setUint32(offset + 18, r.size, true); // Compressed size
      view.setUint32(offset + 22, r.size, true); // Uncompressed size
      view.setUint16(offset + 26, r.nameBytes.length, true); // Filename length
      view.setUint16(offset + 28, 0, true); // Extra field length

      offset += 30;
      zipBuffer.set(r.nameBytes, offset);
      offset += r.nameBytes.length;

      zipBuffer.set(r.dataBytes, offset);
      offset += r.size;
    });

    const centralDirStart = offset;

    // 2. Write Central Directory Records
    records.forEach((r, idx) => {
      // Central Directory Signature 0x02014b50
      view.setUint32(offset, 0x02014b50, true);
      view.setUint16(offset + 4, 20, true); // Version made by
      view.setUint16(offset + 6, 20, true); // Version needed
      view.setUint16(offset + 8, 0, true);  // General flags
      view.setUint16(offset + 10, 0, true); // Compression (0 = Store)
      view.setUint16(offset + 12, 0, true); // Time
      view.setUint16(offset + 14, 0, true); // Date
      view.setUint32(offset + 16, r.crc, true); // CRC32
      view.setUint32(offset + 20, r.size, true); // Compressed size
      view.setUint32(offset + 24, r.size, true); // Uncompressed size
      view.setUint16(offset + 28, r.nameBytes.length, true); // Filename length
      view.setUint16(offset + 30, 0, true); // Extra length
      view.setUint16(offset + 32, 0, true); // Comment length
      view.setUint16(offset + 34, 0, true); // Disk number
      view.setUint16(offset + 36, 0, true); // Internal attributes
      view.setUint32(offset + 38, 0, true); // External attributes
      view.setUint32(offset + 42, centralOffsets[idx], true); // Local header offset

      offset += 46;
      zipBuffer.set(r.nameBytes, offset);
      offset += r.nameBytes.length;
    });

    const centralDirEnd = offset;

    // 3. Write End of Central Directory (EOCD) Record 0x06054b50
    view.setUint32(offset, 0x06054b50, true);
    view.setUint16(offset + 4, 0, true); // Disk number
    view.setUint16(offset + 6, 0, true); // Disk with central dir
    view.setUint16(offset + 8, records.length, true); // Num entries on disk
    view.setUint16(offset + 10, records.length, true); // Total num entries
    view.setUint32(offset + 12, centralDirEnd - centralDirStart, true); // Central dir size
    view.setUint32(offset + 16, centralDirStart, true); // Central dir offset
    view.setUint16(offset + 20, 0, true); // Comment length

    return zipBuffer;
  }

  /**
   * Draw sticker white/colored outline around non-transparent pixels
   * Uses multi-angle offset dilation
   * @param {HTMLCanvasElement} targetCanvas Destination canvas
   * @param {HTMLCanvasElement|HTMLImageElement} sourceImage Source to outline
   * @param {number} strokeWidth Thickness in pixels
   * @param {string} strokeColor Outline color (e.g. '#ffffff')
   */
  function drawStickerOutline(targetCanvas, sourceImage, strokeWidth = 3, strokeColor = '#ffffff') {
    if (!targetCanvas || !sourceImage || strokeWidth <= 0) return;
    const ctx = targetCanvas.getContext('2d');
    const w = targetCanvas.width;
    const h = targetCanvas.height;

    // Create temporary offscreen canvas for silhouette mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = w;
    maskCanvas.height = h;
    const maskCtx = maskCanvas.getContext('2d');

    // 1. Draw source on mask
    maskCtx.drawImage(sourceImage, 0, 0, w, h);

    // 2. Tint entire opaque area of mask to strokeColor
    maskCtx.globalCompositeOperation = 'source-in';
    maskCtx.fillStyle = strokeColor;
    maskCtx.fillRect(0, 0, w, h);
    maskCtx.globalCompositeOperation = 'source-over';

    // 3. Draw dilated outline on target canvas across radial steps
    const steps = Math.max(16, strokeWidth * 6);
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const ox = Math.round(Math.cos(angle) * strokeWidth);
      const oy = Math.round(Math.sin(angle) * strokeWidth);
      ctx.drawImage(maskCanvas, ox, oy);
    }

    // 4. Draw original source on top
    ctx.drawImage(sourceImage, 0, 0, w, h);
  }

  return {
    PRESETS,
    findBoundingBox,
    buildZip,
    calculateCrc32,
    drawStickerOutline
  };
}));
