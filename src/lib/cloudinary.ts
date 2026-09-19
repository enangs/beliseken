// Cloudinary configuration for image uploads
// Free plan: 25GB storage, 25GB bandwidth/month

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

export const CLOUDINARY_CONFIG = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  apiKey: CLOUDINARY_API_KEY,
  // Never expose API secret to client
};

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload image file to Cloudinary
 * Works with both File objects (client) and Buffer (server)
 */
export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string = 'beliseken/products',
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): Promise<{ url: string; publicId: string } | null> {
  const { width = 800, height = 600, quality = 'auto', format = 'auto' } = options;

  try {
    // Convert to base64 data URI
    let dataURI: string;
    
    if (file instanceof File) {
      // Client-side: convert File to base64
      const base64 = await fileToBase64(file);
      dataURI = base64;
    } else {
      // Server-side: convert Buffer to base64
      const base64String = file.toString('base64');
      dataURI = `data:image/${format === 'auto' ? 'jpg' : format};base64,${base64String}`;
    }

    // Use Cloudinary's signed upload
    const timestamp = Math.round(Date.now() / 1000);
    const signature = await createSignature(timestamp);

    const formData = new FormData();
    formData.append('file', dataURI);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('transformation', `w_${width},h_${height},c_fill,q_${quality},f_${format}`);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary upload error:', error);
      return null;
    }

    const result = await response.json();
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

/**
 * Convert File to base64 data URI
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Create signature for Cloudinary upload
 */
async function createSignature(timestamp: number): Promise<string> {
  // In production, use crypto to create HMAC-SHA1 signature
  // For now, return a placeholder
  // TODO: Implement proper signature creation
  return `placeholder_${timestamp}`;
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = await createSignature(timestamp);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cloudinary delete failed: ${error.error?.message || 'Unknown error'}`);
  }
}

/**
 * Optimize Cloudinary URL for different sizes
 */
export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) return url;

  const { width = 800, height = 600, quality = 'auto', format = 'auto' } = options;

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  return `${parts[0]}/upload/w_${width},h_${height},c_fill,q_${quality},f_${format}/${parts[1]}`;
}

/**
 * Get thumbnail URL for product cards
 */
export function getThumbnailUrl(url: string): string {
  return getOptimizedUrl(url, { width: 400, height: 300, quality: 'auto' });
}

/**
 * Get medium URL for product detail
 */
export function getMediumUrl(url: string): string {
  return getOptimizedUrl(url, { width: 800, height: 600, quality: 'auto' });
}

/**
 * Get large URL for full view
 */
export function getLargeUrl(url: string): string {
  return getOptimizedUrl(url, { width: 1200, height: 900, quality: 'auto' });
}
