import { describe, it, expect } from 'vitest'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES_PER_BOOKING,
  safeExtensionFor,
  validateImageFile,
} from '@/lib/uploads/image-validation'

describe('image validation', () => {
  describe('validateImageFile', () => {
    it('accepts an allowed type under the size limit', () => {
      const result = validateImageFile({ type: 'image/jpeg', size: 1024 })

      expect(result.ok).toBe(true)
    })

    it.each(ALLOWED_IMAGE_TYPES)('accepts %s', (type) => {
      const result = validateImageFile({ type, size: 1024 })

      expect(result.ok).toBe(true)
    })

    it('rejects a disallowed MIME type', () => {
      const result = validateImageFile({ type: 'image/svg+xml', size: 1024 })

      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error).toMatch(/type/i)
    })

    it('rejects non-image content regardless of extension tricks', () => {
      const result = validateImageFile({ type: 'text/html', size: 1024 })

      expect(result.ok).toBe(false)
    })

    it('rejects a file over the size limit', () => {
      const result = validateImageFile({ type: 'image/png', size: MAX_FILE_SIZE + 1 })

      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error).toMatch(/large|size/i)
    })

    it('accepts a file exactly at the size limit', () => {
      const result = validateImageFile({ type: 'image/png', size: MAX_FILE_SIZE })

      expect(result.ok).toBe(true)
    })

    it('rejects an empty file', () => {
      const result = validateImageFile({ type: 'image/png', size: 0 })

      expect(result.ok).toBe(false)
    })
  })

  describe('safeExtensionFor', () => {
    it('maps each allowed MIME type to its extension', () => {
      expect(safeExtensionFor('image/jpeg')).toBe('jpg')
      expect(safeExtensionFor('image/png')).toBe('png')
      expect(safeExtensionFor('image/webp')).toBe('webp')
    })

    it('falls back to jpg for unknown types', () => {
      expect(safeExtensionFor('application/octet-stream')).toBe('jpg')
    })
  })

  describe('limits', () => {
    it('caps booking uploads at the same limit the UI enforces', () => {
      expect(MAX_FILES_PER_BOOKING).toBe(5)
    })

    it('caps file size at 2MB', () => {
      expect(MAX_FILE_SIZE).toBe(2 * 1024 * 1024)
    })
  })
})
