'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Loader2, User, Link as LinkIcon, DollarSign, FileText, Image as ImageIcon, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile'
import { generateSlug } from '@/lib/utils'
import { ImageUpload } from '@/components/ui/image-upload'

interface ProfileFormProps {
  initialData: {
    id: string
    name: string
    slug: string
    bio: string
    styles: string[]
    depositAmount: number
    instagramUrl: string
    portfolioImages: string[]
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [portfolioImages, setPortfolioImages] = useState<string[]>(initialData.portfolioImages || [])
  const [newImages, setNewImages] = useState<File[]>([])

  const [formData, setFormData] = useState({
    name: initialData.name,
    slug: initialData.slug,
    bio: initialData.bio,
    styles: initialData.styles.join(', '),
    depositAmount: (initialData.depositAmount / 100).toFixed(2),
    instagramUrl: initialData.instagramUrl,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSuccess(false)
    setError(null)
  }

  const generateSlugFromName = () => {
    const newSlug = generateSlug(formData.name)
    setFormData((prev) => ({ ...prev, slug: newSlug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    setError(null)

    try {
      const result = await updateProfile({
        name: formData.name,
        slug: formData.slug,
        bio: formData.bio,
        styles: formData.styles.split(',').map((s) => s.trim()).filter(Boolean),
        depositAmount: Math.round(parseFloat(formData.depositAmount) * 100),
        instagramUrl: formData.instagramUrl || undefined,
      })

      if (result) {
        setSuccess(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses = (fieldName: string) => `
    w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 text-sm text-white 
    placeholder:text-[#525252] transition-all duration-300
    ${focusedField === fieldName 
      ? 'border-[#ff6b35] shadow-[0_0_15px_rgba(255,107,53,0.2)]' 
      : 'border-white/10 hover:border-white/20'}
    focus:border-[#ff6b35] focus:outline-none focus:shadow-[0_0_15px_rgba(255,107,53,0.2)]
  `

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence mode="wait">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-green-400">¡Perfil actualizado!</p>
              <p className="text-sm text-green-400/70">Tus cambios se han guardado correctamente.</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="font-medium text-red-400">Error</p>
              <p className="text-sm text-red-400/70">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium text-[#a1a1a1]">
          <User className="h-4 w-4 text-[#ff6b35]" />
          Nombre del Artista
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
          required
          className={inputClasses('name')}
          placeholder="Ej: Alex Rivera"
        />
      </motion.div>

      {/* Slug */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        <label htmlFor="slug" className="mb-2 flex items-center gap-2 text-sm font-medium text-[#a1a1a1]">
          <LinkIcon className="h-4 w-4 text-[#ff6b35]" />
          URL de tu Perfil
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-center rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden focus-within:border-[#ff6b35] focus-within:shadow-[0_0_15px_rgba(255,107,53,0.2)] transition-all duration-300">
              <span className="border-r border-white/10 px-4 py-3 text-sm text-[#525252] bg-[#141414]">
                inkapp.com/t/
              </span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                onFocus={() => setFocusedField('slug')}
                onBlur={() => setFocusedField(null)}
                required
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none"
                placeholder="tu-nombre"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={generateSlugFromName}
            className="rounded-xl border border-white/10 bg-[#141414] px-4 text-sm font-medium text-[#a1a1a1] transition-colors hover:border-[#ff6b35]/50 hover:text-white whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4 inline mr-2" />
            Generar
          </motion.button>
        </div>
        <p className="mt-2 text-xs text-[#525252]">
          Esta es tu URL pública. Compártela con tus clientes.
        </p>
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="bio" className="mb-2 flex items-center gap-2 text-sm font-medium text-[#a1a1a1]">
          <FileText className="h-4 w-4 text-[#ff6b35]" />
          Biografía
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          onFocus={() => setFocusedField('bio')}
          onBlur={() => setFocusedField(null)}
          rows={4}
          placeholder="Cuéntales a los clientes sobre tu experiencia, estilo y estudio..."
          className={`${inputClasses('bio')} resize-none`}
        />
        <p className="mt-2 text-xs text-[#525252]">
          {formData.bio.length}/500 caracteres
        </p>
      </motion.div>

      {/* Styles */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
      >
        <label htmlFor="styles" className="mb-2 flex items-center gap-2 text-sm font-medium text-[#a1a1a1]">
          <ImageIcon className="h-4 w-4 text-[#ff6b35]" />
          Estilos (separados por comas)
        </label>
        <input
          type="text"
          id="styles"
          name="styles"
          value={formData.styles}
          onChange={handleChange}
          onFocus={() => setFocusedField('styles')}
          onBlur={() => setFocusedField(null)}
          placeholder="Traditional, Japanese, Realism, Blackwork..."
          className={inputClasses('styles')}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {formData.styles.split(',').map((style, index) => (
            style.trim() && (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#ff6b35]/10 text-[#ff6b35] border border-[#ff6b35]/20"
              >
                {style.trim()}
              </motion.span>
            )
          ))}
        </div>
      </motion.div>

      {/* Deposit Amount */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="depositAmount" className="mb-2 flex items-center gap-2 text-sm font-medium text-[#a1a1a1]">
          <DollarSign className="h-4 w-4 text-[#ff6b35]" />
          Depósito Requerido ($)
        </label>
        <div className="flex items-center rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden focus-within:border-[#ff6b35] focus-within:shadow-[0_0_15px_rgba(255,107,53,0.2)] transition-all duration-300">
          <span className="border-r border-white/10 px-4 py-3 text-sm text-[#525252] bg-[#141414] font-medium">
            $
          </span>
          <input
            type="number"
            id="depositAmount"
            name="depositAmount"
            value={formData.depositAmount}
            onChange={handleChange}
            onFocus={() => setFocusedField('depositAmount')}
            onBlur={() => setFocusedField(null)}
            min="0"
            step="0.01"
            required
            className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-[#525252]">
          Los clientes deben pagar este depósito para confirmar su cita.
        </p>
      </motion.div>

      {/* Instagram URL */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
      >
        <label htmlFor="instagramUrl" className="mb-2 block text-sm font-medium text-[#a1a1a1]">
          Instagram
        </label>
        <input
          type="url"
          id="instagramUrl"
          name="instagramUrl"
          value={formData.instagramUrl}
          onChange={handleChange}
          onFocus={() => setFocusedField('instagramUrl')}
          onBlur={() => setFocusedField(null)}
          placeholder="https://instagram.com/tuusuario"
          className={inputClasses('instagramUrl')}
        />
      </motion.div>

      {/* Portfolio Images */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.375 }}
      >
        <label className="mb-2 block text-sm font-medium text-[#a1a1a1]">
          Fotos de tu trabajo
        </label>
        <ImageUpload
          maxFiles={10}
          maxSizeMB={2}
          onFilesSelected={(files) => setNewImages((prev) => [...prev, ...files])}
          onFileRemoved={(index) => {
            setNewImages((prev) => prev.filter((_, i) => i !== index))
            setPortfolioImages((prev) => prev.filter((_, i) => i !== index))
          }}
          existingImages={portfolioImages}
        />
        <p className="mt-2 text-xs text-[#525252]">
          Máximo 10 imágenes de tu portfolio (2MB cada una)
        </p>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-end gap-4 pt-6 border-t border-white/10"
      >
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 107, 53, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-[#ff6b35] px-8 py-3 text-sm font-label tracking-wider text-black transition-all hover:bg-[#ff8555] disabled:cursor-not-allowed disabled:opacity-50 uppercase"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </motion.button>
      </motion.div>
    </form>
  )
}
