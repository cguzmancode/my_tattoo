'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, DollarSign, Palette } from 'lucide-react'
import { BookingRequestForm } from './booking-request-form'

interface ArtistProfileProps {
  artist: {
    id: string
    name: string
    slug: string
    bio: string | null
    styles: string[]
    depositAmount: number
    instagramUrl: string | null
    portfolioImages: string[]
    isActive: boolean
  }
}

export function ArtistProfile({ artist }: ArtistProfileProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header con gradiente sutil */}
      <header className="relative border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-orange-400 transition-colors">
              InkApp
            </Link>
            <span>/</span>
            <span className="text-zinc-300">{artist.name}</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Columna izquierda: Info del artista */}
          <div className="space-y-8">
            {/* Nombre y bio */}
            <div className="space-y-4">
              <h1 className="font-serif text-5xl font-bold tracking-tight text-white sm:text-6xl">
                {artist.name}
              </h1>
              {artist.bio && (
                <p data-testid="artist-bio" className="text-lg leading-relaxed text-zinc-400">
                  {artist.bio}
                </p>
              )}
            </div>

            {/* Estilos */}
            {artist.styles.length > 0 && (
              <div data-testid="artist-styles" className="flex flex-wrap gap-2">
                {artist.styles.map((style) => (
                  <span
                    key={style}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300"
                  >
                    <Palette className="h-3.5 w-3.5 text-orange-500" />
                    {style}
                  </span>
                ))}
              </div>
            )}

            {/* Info cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Depósito requerido
                    </p>
                    <p data-testid="deposit-amount" className="text-xl font-semibold text-white">
                      ${(artist.depositAmount / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <Calendar className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Disponibilidad
                    </p>
                    <p className="text-sm font-medium text-emerald-400">
                      Aceptando citas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram */}
            {artist.instagramUrl && (
              <a
                href={artist.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-orange-500 hover:text-orange-400"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Ver en Instagram
              </a>
            )}

            {/* Portfolio images */}
            {artist.portfolioImages.length > 0 && (
              <div data-testid="portfolio-images" className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Portafolio</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {artist.portfolioImages.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                    >
                      <Image
                        src={image}
                        alt={`${artist.name} portfolio ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: Formulario de solicitud */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-2xl border-2 border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Solicitar cita</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Completa el formulario y {artist.name} te contactará pronto.
                </p>
              </div>
              <BookingRequestForm artistSlug={artist.slug} depositAmount={artist.depositAmount} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500 sm:px-6 lg:px-8">
          <p>
            Reserva gestionada por{' '}
            <Link href="/" className="text-orange-500 hover:text-orange-400">
              InkApp
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
