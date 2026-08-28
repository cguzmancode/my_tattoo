// Single source of truth for image upload constraints.
// Used by both the authenticated upload route and the public booking route,
// so the two can never drift apart again.

export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number]

// Mirrors the maxFiles limit enforced by <ImageUpload /> in the booking form.
export const MAX_FILES_PER_BOOKING = 5

const EXTENSION_BY_TYPE: Record<AllowedImageType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export type ImageValidationResult = { ok: true } | { ok: false; error: string }

export function isAllowedImageType(type: string): type is AllowedImageType {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)
}

export function safeExtensionFor(mimeType: string): string {
  return isAllowedImageType(mimeType) ? EXTENSION_BY_TYPE[mimeType] : 'jpg'
}

export function validateImageFile(file: { type: string; size: number }): ImageValidationResult {
  if (!isAllowedImageType(file.type)) {
    return { ok: false, error: 'Invalid file type. Only JPG, PNG, WebP allowed' }
  }
  if (file.size <= 0) {
    return { ok: false, error: 'Empty file' }
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: 'File too large (max 2MB)' }
  }
  return { ok: true }
}
