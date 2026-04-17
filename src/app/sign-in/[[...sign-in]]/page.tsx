'use client'

import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { TattooNeedle } from '@/components/icons/tattoo-needle'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-16">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative">
              <TattooNeedle className="h-12 w-12 text-[#ff6b35]" />
              <div className="absolute inset-0 bg-[#ff6b35]/30 blur-2xl rounded-full" />
            </div>
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-[#a1a1a1]">
            Inicia sesión para gestionar tu estudio
          </p>
        </div>

        {/* Sign In Component */}
        <div className="relative">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50',
                header: 'hidden',
                socialButtonsBlockButton: 'bg-[#1a1a1a] border border-white/10 hover:bg-[#222] hover:border-[#ff6b35]/30 transition-all duration-300',
                socialButtonsBlockButtonText: 'text-white font-body',
                dividerLine: 'bg-white/10',
                dividerText: 'text-[#525252] font-body text-sm',
                formFieldLabel: 'text-[#a1a1a1] font-body text-sm mb-2',
                formFieldInput: 'bg-[#0a0a0a] border border-white/10 text-white rounded-lg px-4 py-3 focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50 transition-all duration-300',
                formButtonPrimary: 'bg-[#ff6b35] hover:bg-[#ff8555] text-black font-label text-lg tracking-wider uppercase rounded-lg py-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,53,0.4)]',
                footer: 'hidden',
                alternativeMethodsBlockButton: 'text-[#ff6b35] hover:text-[#ff8555] font-body',
                formFieldErrorText: 'text-[#ef4444] text-sm mt-1',
                identityPreviewText: 'text-white',
                identityPreviewEditButton: 'text-[#ff6b35]',
                otpCodeFieldInput: 'bg-[#0a0a0a] border border-white/10 text-white',
              },
            }}

          />

          {/* Glow Effect */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#ff6b35]/20 via-transparent to-[#00d4ff]/20 blur-xl opacity-30 pointer-events-none" />
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-[#525252] text-sm"
        >
          ¿No tienes cuenta?{' '}
          <a href="/sign-up" className="text-[#ff6b35] hover:text-[#ff8555] transition-colors font-medium">
            Regístrate gratis
          </a>
        </motion.p>
      </motion.div>
    </div>
  )
}
