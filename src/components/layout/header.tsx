'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import { TattooNeedle } from '@/components/icons/tattoo-needle'

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <TattooNeedle className="h-8 w-8 text-[#ff6b35]" />
            <div className="absolute inset-0 rounded-full bg-[#ff6b35]/20 blur-xl" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-wider text-white">
              Ink
              <span className="text-[#ff6b35]">App</span>
            </span>
            <span className="font-label text-[10px] tracking-[0.3em] text-white/40 -mt-1">
              TATTOO STUDIO
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-label text-sm tracking-widest text-white/70 transition-colors hover:text-white"
              >
                INICIAR SESIÓN
              </motion.button>
            </SignInButton>
            <SignUpButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 107, 53, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary rounded-full"
              >
                REGISTRARSE
              </motion.button>
            </SignUpButton>
          </Show>
          
          <Show when="signed-in">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 107, 53, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary rounded-full text-sm"
              >
                DASHBOARD
              </motion.button>
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 rounded-full border-2 border-[#ff6b35]/50"
                }
              }}
            />
          </Show>
        </nav>
      </div>
      
      {/* Bottom gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#ff6b35]/50 to-transparent" />
    </motion.header>
  )
}
