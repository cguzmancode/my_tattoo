'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { TattooNeedle } from '@/components/icons/tattoo-needle'
import { User, Palette, DollarSign, Check, ArrowRight, Loader2, AtSign } from 'lucide-react'

const tattooStyles = [
  'Traditional', 'Neotraditional', 'Blackwork', 'Japanese', 'Tribal',
  'Realism', 'Watercolor', 'Minimalist', 'Geometric', 'Script',
  'Illustrative', 'Black and Grey', 'Color', 'Dotwork', 'Fine Line'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    styles: [] as string[],
    depositAmount: '',
    instagramUrl: '',
  })

  const toggleStyle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl"
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
            Completa tu perfil
          </h1>
          <p className="text-[#a1a1a1]">
            Cuéntanos sobre ti para crear tu portfolio
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-[#141414] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8555]"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-[#525252]">
            <span className={step >= 1 ? 'text-[#ff6b35]' : ''}>Perfil</span>
            <span className={step >= 2 ? 'text-[#ff6b35]' : ''}>Estilos</span>
            <span className={step >= 3 ? 'text-[#ff6b35]' : ''}>Finalizar</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Step 1: Profile Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#ff6b35]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Información básica</h2>
                    <p className="text-sm text-[#a1a1a1]">Cuéntanos quién eres</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#a1a1a1] mb-2">Nombre artístico</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Alex 'The Needle' Rivera"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#525252] focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#a1a1a1] mb-2">Biografía</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Cuéntanos tu historia, experiencia, estilos favoritos..."
                      rows={4}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#525252] focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.bio}
                  className="w-full flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff8555] text-black font-label text-lg tracking-wider uppercase rounded-lg py-4 transition-all hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Styles */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-[#ff6b35]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Estilos de tatuaje</h2>
                    <p className="text-sm text-[#a1a1a1]">Selecciona tus especialidades</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {tattooStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        formData.styles.includes(style)
                          ? 'bg-[#ff6b35] text-black'
                          : 'bg-[#0a0a0a] text-[#a1a1a1] border border-white/10 hover:border-[#ff6b35]/50'
                      }`}
                    >
                      {formData.styles.includes(style) && (
                        <Check className="h-3 w-3 inline mr-1" />
                      )}
                      {style}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={formData.styles.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff8555] text-black font-label text-lg tracking-wider uppercase rounded-lg py-4 transition-all hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Business Info */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-[#ff6b35]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Información de negocio</h2>
                    <p className="text-sm text-[#a1a1a1]">Configura tus tarifas y redes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#a1a1a1] mb-2">
                      Depósito requerido (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#525252]" />
                      <input
                        type="number"
                        value={formData.depositAmount}
                        onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                        placeholder="50"
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#525252] focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50 outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-[#525252] mt-1">
                      Monto que el cliente debe pagar para confirmar la cita
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-[#a1a1a1] mb-2">
                      Instagram (opcional)
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#525252]" />
                      <input
                        type="text"
                        value={formData.instagramUrl}
                        onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                        placeholder="@tu_usuario"
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#525252] focus:border-[#ff6b35] focus:ring-1 focus:ring-[#ff6b35]/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.depositAmount || isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff8555] text-black font-label text-lg tracking-wider uppercase rounded-lg py-4 transition-all hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creando perfil...
                      </>
                    ) : (
                      <>
                        Completar registro
                        <Check className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Glow Effect */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#ff6b35]/20 via-transparent to-[#00d4ff]/20 blur-xl opacity-30 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  )
}
