'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Calendar, DollarSign, Palette, MapPin, ArrowRight, Clock, Sparkles } from 'lucide-react'
import { BookingRequestForm } from './booking-request-form'
import { TattooNeedle } from '@/components/icons/tattoo-needle'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TattooNeedle className="h-7 w-7 text-[#ff6b35]" />
              </motion.div>
              <span className="font-display text-xl font-bold">
                Ink<span className="text-[#ff6b35]">App</span>
              </span>
            </Link>
            <span className="text-sm text-[#a1a1a1]">
              Perfil del Artista
            </span>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-[128px]" />
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Artist Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-4 py-2"
              >
                <Sparkles className="h-4 w-4 text-[#ff6b35]" />
                <span className="font-label text-xs tracking-widest text-[#ff6b35] uppercase">
                  Artista Destacado
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
              >
                {artist.name}
              </motion.h1>

              {/* Bio */}
              {artist.bio && (
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg text-[#a1a1a1] leading-relaxed mb-8 max-w-xl"
                >
                  {artist.bio}
                </motion.p>
              )}

              {/* Styles */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {artist.styles.map((style, index) => (
                  <motion.span
                    key={style}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-[#ff6b35]/50 hover:bg-[#ff6b35]/10 transition-all duration-300"
                  >
                    <Palette className="h-4 w-4 text-[#ff6b35]" />
                    {style}
                  </motion.span>
                ))}
              </motion.div>

              {/* Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-[#ff6b35]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#525252]">Depósito</p>
                    <p className="font-semibold text-white">
                      ${(artist.depositAmount / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[#525252]">Disponibilidad</p>
                    <p className="font-semibold text-green-400">
                      Aceptando citas
                    </p>
                  </div>
                </div>

                {artist.instagramUrl && (
                  <motion.a
                    href={artist.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:border-[#ff6b35]/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center">
                      <svg className="h-5 w-5 text-[#ff6b35]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#525252]">Instagram</p>
                      <p className="font-semibold text-white">
                        Ver trabajos
                      </p>
                    </div>
                  </motion.a>
                )}
              </motion.div>
            </motion.div>

            {/* Right: Featured Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src={artist.portfolioImages[0]}
                  alt={`${artist.name} featured work`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
              </div>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 rounded-xl border border-white/10 bg-[#141414] p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#ff6b35] flex items-center justify-center text-black font-bold">
                    {artist.portfolioImages.length}
                  </div>
                  <div>
                    <p className="font-semibold text-white">Trabajos</p>
                    <p className="text-xs text-[#a1a1a1]">en portfolio</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-[#525252] font-label tracking-widest uppercase">
              Ver Portfolio
            </span>
            <ArrowRight className="h-4 w-4 text-[#ff6b35] rotate-90" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Portfolio Gallery */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-[#ff6b35] to-[#c0a062] rounded-full" />
              <span className="font-label text-xs tracking-widest text-[#ff6b35] uppercase">
                Portfolio
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white">
              Trabajos Recientes
            </h2>
          </motion.div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artist.portfolioImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`
                  group relative overflow-hidden rounded-xl
                  ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
                  ${index === 3 ? 'lg:col-span-2' : ''}
                `}
              >
                <div className={`
                  relative overflow-hidden rounded-xl border border-white/10
                  ${index === 0 ? 'aspect-[16/9]' : 'aspect-square'}
                `}>
                  <Image
                    src={image}
                    alt={`${artist.name} portfolio ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium">
                      Trabajo #{index + 1}
                    </p>
                  </div>
                  
                  {/* Glow Border on Hover */}
                  <div className="absolute inset-0 rounded-xl ring-2 ring-[#ff6b35]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff6b35]/5 to-[#ff6b35]/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 bg-gradient-to-r from-[#00d4ff] to-[#c0a062] rounded-full" />
                <span className="font-label text-xs tracking-widest text-[#00d4ff] uppercase">
                  Reserva
                </span>
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                ¿Listo para tu próximo tatuaje?
              </h2>
              <p className="text-[#a1a1a1] text-lg mb-8">
                Completa el formulario y {artist.name} se pondrá en contacto contigo 
                para discutir los detalles de tu diseño.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Calendar, text: 'Elige tu fecha preferida' },
                  { icon: DollarSign, text: 'Depósito seguro de $50' },
                  { icon: Clock, text: 'Respuesta en 24-48 horas' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="h-12 w-12 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-[#ff6b35]" />
                    </div>
                    <span className="text-white">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-24"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#ff6b35]/30 via-[#00d4ff]/10 to-[#ff6b35]/30 blur-xl opacity-50" />
                
                <div className="relative rounded-2xl border border-white/10 bg-[#141414] p-8">
                  <div className="mb-6">
                    <h3 className="font-display text-2xl font-bold text-white mb-2">
                      Solicitar Cita
                    </h3>
                    <p className="text-[#a1a1a1]">
                      Todos los campos son obligatorios
                    </p>
                  </div>
                  <BookingRequestForm 
                    artistSlug={artist.slug} 
                    depositAmount={artist.depositAmount} 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <TattooNeedle className="h-6 w-6 text-[#ff6b35]" />
              <span className="font-display text-xl font-bold text-white">
                Ink<span className="text-[#ff6b35]">App</span>
              </span>
            </div>
            <p className="text-[#525252] text-sm">
              © 2024 InkApp. Reservas gestionadas profesionalmente.
            </p>
            <Link 
              href="/"
              className="text-[#a1a1a1] hover:text-[#ff6b35] transition-colors text-sm"
            >
              Volver al inicio →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
