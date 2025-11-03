/**
 * Utility functions for image handling
 */

/**
 * Converts a base64 string to a data URL for image display
 * @param base64String - The base64 encoded image string (with or without data URI prefix)
 * @param mimeType - The MIME type of the image (default: 'image/jpeg')
 * @returns A data URL that can be used in img src attribute
 */
export function base64ToImageUrl(base64String: string, mimeType: string = 'image/jpeg'): string {
  if (!base64String) {
    return '';
  }

  if (base64String.startsWith('data:')) {
    return base64String;
  }

  return `data:${mimeType};base64,${base64String}`;
}

/**
 * Checks if a string is a valid base64 encoded image
 * @param str - The string to check
 * @returns True if the string appears to be base64 encoded
 */
export function isBase64Image(str: string): boolean {
  if (!str) {
    return false;
  }

  // Check if it already has data URI prefix
  if (str.startsWith('data:image/')) {
    return true;
  }

  // Check if it's a URL
  if (str.startsWith('http://') || str.startsWith('https://')) {
    return false;
  }

  // Check if it looks like base64 (contains only valid base64 characters)
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  return base64Regex.test(str);
}

/**
 * Gets the appropriate image URL, handling both base64 and regular URLs
 * @param imageData - The image data (base64 string or URL)
 * @param mimeType - The MIME type for base64 images (default: 'image/jpeg')
 * @returns A URL that can be used in img src attribute
 */
export function getImageUrl(imageData: string, mimeType: string = 'image/jpeg'): string {
  if (!imageData) {
    return '';
  }

  // If it's already a complete URL or data URI, return as is
  if (imageData.startsWith('http://') || 
      imageData.startsWith('https://') || 
      imageData.startsWith('data:')) {
    return imageData;
  }

  // Otherwise, treat it as base64 and convert
  return base64ToImageUrl(imageData, mimeType);
}
