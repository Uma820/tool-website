/**
 * Favicon & Web Manifest Utilities
 * 100% Client-Side generation engine for multi-resolution Windows .ico binaries,
 * PWA site.webmanifest generation, and pure JavaScript .zip packaging.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FaviconManifestUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // CRC32 Lookup Table for ZIP file creation
  let crcTable = null;
  function makeCrcTable() {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[n] = c;
    }
    return table;
  }

  function crc32(uint8Array) {
    if (!crcTable) crcTable = makeCrcTable();
    let crc = 0 ^ (-1);
    for (let i = 0; i < uint8Array.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ uint8Array[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  /**
   * Minimal Pure JavaScript ZIP File Builder (No external libraries required)
   * Uses standard PKZIP Store (uncompressed) format.
   */
  function createZip(files = []) {
    // files: Array of { name: 'filename.ext', data: Uint8Array | string }
    const localHeaders = [];
    const centralHeaders = [];
    let offset = 0;

    const encoder = new TextEncoder();

    files.forEach(file => {
      const nameBytes = encoder.encode(file.name);
      let dataBytes;
      if (typeof file.data === 'string') {
        dataBytes = encoder.encode(file.data);
      } else if (file.data instanceof Uint8Array) {
        dataBytes = file.data;
      } else if (file.data instanceof ArrayBuffer) {
        dataBytes = new Uint8Array(file.data);
      } else {
        dataBytes = new Uint8Array(0);
      }

      const fileCrc = crc32(dataBytes);
      const size = dataBytes.length;

      // Local File Header (30 bytes + name + data)
      const lh = new Uint8Array(30 + nameBytes.length + size);
      const lv = new DataView(lh.buffer);

      lv.setUint32(0, 0x04034b50, true); // Local file header signature
      lv.setUint16(4, 20, true);         // Version needed to extract (2.0)
      lv.setUint16(6, 0, true);          // General purpose bit flag
      lv.setUint16(8, 0, true);          // Compression method (0 = store)
      lv.setUint16(10, 0x4800, true);    // Last mod file time (12:00:00)
      lv.setUint16(12, 0x5421, true);    // Last mod file date (2026-01-01)
      lv.setUint32(14, fileCrc, true);   // CRC-32
      lv.setUint32(18, size, true);      // Compressed size
      lv.setUint32(22, size, true);      // Uncompressed size
      lv.setUint16(26, nameBytes.length, true); // File name length
      lv.setUint16(28, 0, true);          // Extra field length

      lh.set(nameBytes, 30);
      lh.set(dataBytes, 30 + nameBytes.length);

      localHeaders.push(lh);

      // Central Directory Header (46 bytes + name)
      const ch = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(ch.buffer);

      cv.setUint32(0, 0x02014b50, true); // Central file header signature
      cv.setUint16(4, 20, true);         // Version made by (2.0)
      cv.setUint16(6, 20, true);         // Version needed to extract (2.0)
      cv.setUint16(8, 0, true);          // General purpose bit flag
      cv.setUint16(10, 0, true);         // Compression method (0 = store)
      cv.setUint16(12, 0x4800, true);    // Last mod time
      cv.setUint16(14, 0x5421, true);    // Last mod date
      cv.setUint32(16, fileCrc, true);   // CRC-32
      cv.setUint32(20, size, true);      // Compressed size
      cv.setUint32(24, size, true);      // Uncompressed size
      cv.setUint16(28, nameBytes.length, true); // File name length
      cv.setUint16(30, 0, true);          // Extra field length
      cv.setUint16(32, 0, true);          // File comment length
      cv.setUint16(34, 0, true);          // Disk number start
      cv.setUint16(36, 0, true);          // Internal file attributes
      cv.setUint32(38, 0, true);          // External file attributes
      cv.setUint32(42, offset, true);    // Relative offset of local header

      ch.set(nameBytes, 46);
      centralHeaders.push(ch);

      offset += lh.length;
    });

    const centralDirOffset = offset;
    let centralDirSize = 0;
    centralHeaders.forEach(ch => { centralDirSize += ch.length; });

    // End of Central Directory Record (22 bytes)
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);

    ev.setUint32(0, 0x06054b50, true);        // EOCD signature
    ev.setUint16(4, 0, true);                 // Number of this disk
    ev.setUint16(6, 0, true);                 // Disk where central directory starts
    ev.setUint16(8, files.length, true);      // Number of central directory records on this disk
    ev.setUint16(10, files.length, true);     // Total number of central directory records
    ev.setUint32(12, centralDirSize, true);   // Size of central directory
    ev.setUint32(16, centralDirOffset, true); // Offset of start of central directory
    ev.setUint16(20, 0, true);                // Comment length

    // Assemble all chunks into single Blob
    const totalParts = [...localHeaders, ...centralHeaders, eocd];
    return new Blob(totalParts, { type: 'application/zip' });
  }

  /**
   * Pure JavaScript Multi-Resolution Windows .ico Binary Encoder
   * Encodes a valid ICO file embedding PNG image frames (16x16, 32x32, 48x48)
   */
  function createIcoFile(frames = []) {
    // frames: Array of { width: number, height: number, pngBytes: Uint8Array }
    const numImages = frames.length;
    if (numImages === 0) return new Uint8Array(0);

    const headerSize = 6;
    const dirEntrySize = 16;
    let dataOffset = headerSize + (dirEntrySize * numImages);

    // Calculate total ICO size
    let totalSize = dataOffset;
    frames.forEach(f => { totalSize += f.pngBytes.length; });

    const icoBuffer = new Uint8Array(totalSize);
    const view = new DataView(icoBuffer.buffer);

    // 1. ICONDIR Header (6 bytes)
    view.setUint16(0, 0, true);           // Reserved, must be 0
    view.setUint16(2, 1, true);           // 1 = ICO format
    view.setUint16(4, numImages, true);   // Number of images

    // 2. ICONDIRENTRY Table (16 bytes per image)
    frames.forEach((frame, idx) => {
      const entryOffset = headerSize + (idx * dirEntrySize);
      const w = frame.width >= 256 ? 0 : frame.width;
      const h = frame.height >= 256 ? 0 : frame.height;
      const size = frame.pngBytes.length;

      view.setUint8(entryOffset + 0, w);       // Width
      view.setUint8(entryOffset + 1, h);       // Height
      view.setUint8(entryOffset + 2, 0);       // Color count (0 = >=8bpp)
      view.setUint8(entryOffset + 3, 0);       // Reserved
      view.setUint16(entryOffset + 4, 1, true); // Color planes
      view.setUint16(entryOffset + 6, 32, true);// Bits per pixel (32-bit RGBA)
      view.setUint32(entryOffset + 8, size, true); // Size of image data in bytes
      view.setUint32(entryOffset + 12, dataOffset, true); // Offset of image data

      // Copy PNG data at dataOffset
      icoBuffer.set(frame.pngBytes, dataOffset);
      dataOffset += size;
    });

    return icoBuffer;
  }

  /**
   * Render an image onto a Canvas with custom size, padding, background & clipping
   */
  function renderIconToCanvas(img, options = {}) {
    const size = options.size || 192;
    const paddingPct = Math.max(0, Math.min(40, options.paddingPct || 0)) / 100;
    const bgFill = options.bgFill || 'transparent'; // 'transparent' or '#ffffff'
    const shape = options.shape || 'square'; // 'square', 'squircle', 'circle'

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';

    // 1. Apply shape clipping if specified
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    } else if (shape === 'squircle') {
      // 22% squircle border radius
      const radius = size * 0.22;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();
    }

    // 2. Render background fill if not transparent
    if (bgFill && bgFill !== 'transparent') {
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, size, size);
    }

    // 3. Render Image with Padding & Aspect Ratio preservation
    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const padPx = size * paddingPct;
      const availW = size - (padPx * 2);
      const availH = size - (padPx * 2);

      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;

      let drawW = availW;
      let drawH = availH;
      let offsetX = padPx;
      let offsetY = padPx;

      if (srcW > srcH) {
        drawH = (srcH / srcW) * availW;
        offsetY = padPx + ((availH - drawH) / 2);
      } else if (srcH > srcW) {
        drawW = (srcW / srcH) * availH;
        offsetX = padPx + ((availW - drawW) / 2);
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }

    return canvas;
  }

  /**
   * Convert Canvas to Uint8Array (PNG binary data)
   */
  function canvasToPngUint8Array(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed'));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          resolve(new Uint8Array(reader.result));
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      }, 'image/png');
    });
  }

  /**
   * Generate Web App Manifest JSON object
   */
  function generateManifestJson(params = {}) {
    const name = params.appName || 'My Awesome Web App';
    const shortName = params.shortName || 'App';
    const themeColor = params.themeColor || '#2563eb';
    const bgColor = params.backgroundColor || '#ffffff';
    const display = params.display || 'standalone';

    return {
      name,
      short_name: shortName,
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      theme_color: themeColor,
      background_color: bgColor,
      display: display,
      start_url: '/'
    };
  }

  /**
   * Generate standard modern HTML <head> code tags
   */
  function generateHtmlHeadSnippet(params = {}) {
    const themeColor = params.themeColor || '#2563eb';

    return [
      `<!-- Standard Favicons -->`,
      `<link rel="icon" type="image/x-icon" href="/favicon.ico">`,
      `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`,
      `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`,
      ``,
      `<!-- Apple Touch Icon (iOS Homescreen) -->`,
      `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`,
      ``,
      `<!-- Progressive Web App Manifest & Android Theme Color -->`,
      `<link rel="manifest" href="/site.webmanifest">`,
      `<meta name="theme-color" content="${themeColor}">`
    ].join('\n');
  }

  return {
    crc32,
    createZip,
    createIcoFile,
    renderIconToCanvas,
    canvasToPngUint8Array,
    generateManifestJson,
    generateHtmlHeadSnippet
  };
}));
