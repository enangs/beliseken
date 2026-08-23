// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: "ru7la0qb",
  uploadPreset: "beliseken_products", // Unsigned upload preset
};

// Upload image to Cloudinary
export async function uploadToCloudinary(
  file: File,
  folder: string = "beliseken/products"
): Promise<{ url: string; publicId: string } | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("folder", folder);
    formData.append("resource_type", "image");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
}

// Upload multiple files
export async function uploadMultipleToCloudinary(
  files: File[],
  folder: string = "beliseken/products"
): Promise<{ url: string; publicId: string }[]> {
  const results = await Promise.all(
    files.map((file) => uploadToCloudinary(file, folder))
  );
  return results.filter((r) => r !== null) as { url: string; publicId: string }[];
}

// Delete image from Cloudinary (requires signed request - for admin only)
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  // Note: Delete requires signed request, use API route for this
  // For now, we'll just remove the reference
  return true;
}

// Get optimized image URL
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality?: number
): string {
  if (!url || !url.includes("cloudinary.com")) return url;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  transformations.push("f_auto"); // Auto format (WebP, AVIF)
  transformations.push("c_limit"); // Limit to fit

  return `${parts[0]}/${transformations.join(",")}/${parts[1]}`;
}
