'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Shield, Zap, Palette, Clock, Users } from 'lucide-react'
import { TattooNeedle } from '@/components/icons/tattoo-needle'
import { DEMO_ARTIST, DEMO_STATS } from '@/lib/mocks'

const features = [
  {
    icon: Calendar,
    title: 'Gestión de Citas',
    description: 'Organiza tu agenda, bloquea fechas y mantén el control de tu tiempo.',
  },
  {
    icon: Shield,
    title: 'Pagos Seguros',
    description: 'Depósitos integrados con Stripe. Sin preocupaciones, solo arte.',
  },
  {
    icon: Zap,
    title: 'Rápido y Simple',
    description: 'Configura tu perfil en minutos y recibe solicitudes al instante.',
  },
  {
    icon: Palette,
    title: 'Portfolio Online',
    description: 'Muestra tu trabajo al mundo. Tu estilo, tu reglas, tu negocio.',
  },
]

const stats = [
  { label: 'Artistas', value: '500+', icon: Users },
  { label: 'Citas Gestiónadas', value: '10K+', icon: Calendar },
  { label: 'Soporte 24/7', value: 'Siempre', icon: Clock },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff6b35]/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-[128px]" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b35] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b35]"></span>
            </span>
            <span className="font-label text-sm tracking-widest text-[#ff6b35]">
              PLATAFORMA PARA TATUADORES
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="block font-display text-5xl font-bold tracking-tight text-white sm:text-7xl">
              Tu Arte.
            </span>
            <span className="block font-display text-5xl font-bold tracking-tight sm:text-7xl mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-[#c0a062]">
                Tu Negocio.
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-[#a1a1a1] sm:text-xl mb-10"
          >
            La plataforma todo-en-uno para tatuadores profesionales. 
            Gestiona citas, recibe pagos y crece tu marca. 
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 107, 53, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 btn-primary rounded-full px-8 py-4 text-lg"
              >
                <TattooNeedle className="h-5 w-5" />
                EMPIEZA GRATIS
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            
            <Link href={`/t/${DEMO_ARTIST.slug}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline rounded-full px-8 py-4 text-lg"
              >
                VER DEMO
              </motion.button>
            </Link>
          </motion.div>

          {/* Demo Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-4xl"
          >
            <div className="relative rounded-2xl border border-white/10 bg-[#141414]/80 p-2 backdrop-blur-xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#525252] font-mono">inkapp.com/t/{DEMO_ARTIST.slug}</span>
                </div>
              </div>
              
              {/* Preview content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-gradient-to-r from-[#ff6b35] to-[#c0a062] rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-4 w-5/6 bg-white/10 rounded" />
                  </div>
                  <div className="flex gap-2">
                    {DEMO_ARTIST.styles.slice(0, 3).map((_, i) => (
                      <div key={i} className="h-6 w-20 bg-[#ff6b35]/20 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {DEMO_ARTIST.portfolioImages.slice(0, 4).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-[#1a1a1a] border border-white/5" />
                  ))}
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#ff6b35]/20 via-transparent to-[#00d4ff]/20 blur-xl opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
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
            <span className="text-xs text-[#525252] font-label tracking-widest">DESCUBRE MÁS</span>
            <div className="h-8 w-5 rounded-full border-2 border-[#525252] flex justify-center pt-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-[#ff6b35]"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="font-label text-[#ff6b35] tracking-widest text-sm">FEATURES</span>
            <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
              Todo lo que necesitas
            </h2>
            <p className="mt-4 text-[#a1a1a1] max-w-2xl mx-auto">
              Herramientas diseñadas específicamente para tatuadores profesionales.
            </p>
          </motion.div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, borderColor: "rgba(255, 107, 53, 0.3)" }}
                className="group relative rounded-2xl border border-white/10 bg-[#141414] p-8 transition-all"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff6b35]/10 text-[#ff6b35] group-hover:bg-[#ff6b35]/20 transition-colors">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#a1a1a1] leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff6b35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 border-y border-white/5 bg-[#141414]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-[#ff6b35] mx-auto mb-4" />
                <div className="font-display text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="font-label text-[#a1a1a1] tracking-widest text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b35]/10 to-transparent" />
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl mb-6">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-[#a1a1a1] text-lg mb-10 max-w-2xl mx-auto">
              Únete a cientos de tatuadores que ya gestionan sus citas profesionalmente.
              Empieza gratis hoy.
            </p>
            
            <Link href="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 107, 53, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary rounded-full px-10 py-5 text-xl"
              >
                CREAR CUENTA GRATIS
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <TattooNeedle className="h-6 w-6 text-[#ff6b35]" />
              <span className="font-display text-xl font-bold text-white">
                Ink<span className="text-[#ff6b35]">App</span>
              </span>
            </div>
            
            <p className="text-[#525252] text-sm">
              © 2024 InkApp. Hecho con ❤️ para la comunidad tattoo.
            </p>
            
            <div className="flex gap-6">
              <a href="#" className="text-[#a1a1a1] hover:text-[#ff6b35] transition-colors">Instagram</a>
              <a href="#" className="text-[#a1a1a1] hover:text-[#ff6b35] transition-colors">Twitter</a>
              <a href="#" className="text-[#a1a1a1] hover:text-[#ff6b35] transition-colors">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
