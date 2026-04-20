'use client'

import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { TattooNeedle } from '@/components/icons/tattoo-needle'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-16">
      {/* Force Clerk inputs to be white */}
      <style jsx global>{`
        .cl-formFieldInput {
          color: #ffffff !important;
          caret-color: #ff6b35 !important;
        }
        .cl-formFieldInput::placeholder {
          color: #525252 !important;
        }
      `}</style>
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
            Crea tu cuenta
          </h1>
          <p className="text-[#a1a1a1]">
            Únete a InkApp y gestiona tu estudio profesionalmente
          </p>
        </div>

        {/* Sign Up Component */}
        <div className="relative">
          <SignUp
            appearance={{
              baseTheme: 'dark',
              variables: {
                colorBackground: '#141414',
                colorText: '#ffffff',
                colorTextSecondary: '#a1a1a1',
                colorInputText: '#ffffff',
                colorInputBackground: '#0a0a0a',
                colorInputBorder: 'rgba(255, 255, 255, 0.1)',
                colorPrimary: '#ff6b35',
                colorDanger: '#ef4444',
                colorSuccess: '#22c55e',
                borderRadius: '0.75rem',
              },
              elements: {
                rootBox: 'w-full',
                card: '!bg-[#141414] !border !border-white/10 !rounded-2xl !p-8 !shadow-2xl',
                header: '!hidden',
                socialButtonsBlockButton: '!bg-[#1a1a1a] !border !border-white/10 hover:!bg-[#222] hover:!border-[#ff6b35]/30',
                socialButtonsBlockButtonText: '!text-white !font-body',
                dividerLine: '!bg-white/10',
                dividerText: '!text-[#525252]',
                formFieldLabel: '!text-[#a1a1a1] !font-body !text-sm !mb-2',
                formFieldInput: '!bg-[#0a0a0a] !border !border-white/10 !text-white !placeholder-[#525252] !rounded-lg !px-4 !py-3 focus:!border-[#ff6b35] focus:!ring-1 focus:!ring-[#ff6b35]/50',
                formButtonPrimary: '!bg-[#ff6b35] hover:!bg-[#ff8555] !text-black !font-label !text-lg !tracking-wider !uppercase !rounded-lg !py-3 hover:!shadow-[0_0_30px_rgba(255,107,53,0.4)]',
                footer: '!hidden',
                alternativeMethodsBlockButton: '!text-[#ff6b35] hover:!text-[#ff8555]',
                formFieldErrorText: '!text-[#ef4444]',
                identityPreviewText: '!text-white',
                identityPreviewEditButton: '!text-[#ff6b35]',
                otpCodeFieldInput: '!bg-[#0a0a0a] !border !border-white/10 !text-white',
              },
            }}
            fallbackRedirectUrl="/onboarding"
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
          ¿Ya tienes cuenta?{' '}
          <a href="/sign-in" className="text-[#ff6b35] hover:text-[#ff8555] transition-colors font-medium">
            Inicia sesión
          </a>
        </motion.p>
      </motion.div>
    </div>
  )
}
