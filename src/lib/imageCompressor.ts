/**
 * Client-side image compression utility to ensure uploaded images
 * stay well within Firestore document size limits (max 1MB per document, target < 150KB per image).
 */

export async function compressImage(
  fileOrDataUrl: File | Blob | string,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    let src = '';
    let isObjectUrl = false;

    if (typeof fileOrDataUrl === 'string') {
      src = fileOrDataUrl;
    } else {
      src = URL.createObjectURL(fileOrDataUrl);
      isObjectUrl = true;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isObjectUrl) {
        URL.revokeObjectURL(src);
      }

      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(src);
        return;
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      let compressed = canvas.toDataURL('image/jpeg', quality);

      // If still larger than 300KB base64 string, compress further
      if (compressed.length > 400000) {
        compressed = canvas.toDataURL('image/jpeg', 0.5);
      }
      if (compressed.length > 400000) {
        // Shrink canvas to half and re-render
        const halfCanvas = document.createElement('canvas');
        halfCanvas.width = Math.max(1, Math.round(width * 0.6));
        halfCanvas.height = Math.max(1, Math.round(height * 0.6));
        const halfCtx = halfCanvas.getContext('2d');
        if (halfCtx) {
          halfCtx.drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);
          compressed = halfCanvas.toDataURL('image/jpeg', 0.5);
        }
      }

      resolve(compressed);
    };

    img.onerror = () => {
      if (isObjectUrl) {
        URL.revokeObjectURL(src);
      }
      // If error loading image, fallback to original if string, or reject
      if (typeof fileOrDataUrl === 'string') {
        resolve(fileOrDataUrl);
      } else {
        reject(new Error('Failed to load image for compression'));
      }
    };

    img.src = src;
  });
}

/**
 * Ensures any large data URL in a string is compressed
 */
export async function sanitizeImageUrl(url: string, maxDim: number = 600): Promise<string> {
  if (!url || typeof url !== 'string') return url || '';
  if (url.startsWith('data:image/') && url.length > 200000) {
    try {
      return await compressImage(url, maxDim, maxDim, 0.7);
    } catch {
      return url;
    }
  }
  return url;
}
