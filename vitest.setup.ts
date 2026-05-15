import 'dotenv/config'

// Integration tests must run against the dev DB, never prod.
// `pnpm test:integration` sets INTEGRATION_TEST=1; we then swap DATABASE_URL
// with DATABASE_URL_TEST (which points to the `my_tattoo_dev` Supabase project).
if (process.env.INTEGRATION_TEST === '1') {
  if (!process.env.DATABASE_URL_TEST) {
    throw new Error(
      'DATABASE_URL_TEST is not set in .env. Refusing to run integration tests against DATABASE_URL (likely prod).',
    )
  }
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST
}

import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js headers and cookies for server components
vi.mock('next/headers', () => ({
  headers: () => new Headers(),
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))
