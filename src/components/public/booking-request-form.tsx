'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, CheckCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react'
import { BodyZoneSelector } from '@/components/body-zone/body-zone-selector'

interface BookingRequestFormProps {
  artistSlug: string
  depositAmount: number
}

interface FormData {
  clientName: string
  clientEmail: string
  description: string
  preferredDate: string
  bodyZone: string
  size: string
}

const sizes = [
  { value: 'small', label: 'Pequeño (hasta 5cm)', dots: 1 },
  { value: 'medium', label: 'Mediano (5-15cm)', dots: 2 },
  { value: 'large', label: 'Grande (15-25cm)', dots: 3 },
  { value: 'xlarge', label: 'Extra Grande (+25cm)', dots: 4 },
]

export function BookingRequestForm({ artistSlug }: BookingRequestFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    description: '',
    preferredDate: '',
    bodyZone: '',
    size: 'medium',
  })
  const [showBodyZoneSelector, setShowBodyZoneSelector] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleBodyZoneSelect = (zoneId: string) => {
    setFormData((prev) => ({ ...prev, bodyZone: zoneId }))
    setShowBodyZoneSelector(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          artistSlug,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking request')
      }

      setIsSuccess(true)
      setFormData({ clientName: '', clientEmail: '', description: '', preferredDate: '', bodyZone: '', size: 'medium' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-emerald-800 bg-emerald-950/30 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
          <CheckCircle className="h-6 w-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-emerald-400">¡Solicitud enviada!</h3>
        <p className="mt-2 text-sm text-emerald-200/70">
          El artista revisará tu solicitud y te contactará pronto.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form data-testid="booking-form" onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/30 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="clientName" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Tu nombre
        </label>
        <input
          type="text"
          id="clientName"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          required
          placeholder="John Doe"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div>
        <label htmlFor="clientEmail" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Correo electrónico
        </label>
        <input
          type="email"
          id="clientEmail"
          name="clientEmail"
          value={formData.clientEmail}
          onChange={handleChange}
          required
          placeholder="john@example.com"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div>
        <label htmlFor="preferredDate" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Fecha preferida
        </label>
        <input
          type="date"
          id="preferredDate"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Body Zone Selector */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          Zona del cuerpo
        </label>
        <button
          type="button"
          onClick={() => setShowBodyZoneSelector(!showBodyZoneSelector)}
          className="w-full flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white hover:border-orange-500 transition-colors"
        >
          <span className={formData.bodyZone ? 'text-white' : 'text-zinc-500'}>
            {formData.bodyZone
              ? formData.bodyZone.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              : 'Selecciona la zona del cuerpo'}
          </span>
          <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${showBodyZoneSelector ? 'rotate-180' : ''}`} />
        </button>
        {showBodyZoneSelector && (
          <div className="mt-3">
            <BodyZoneSelector
              selectedZone={formData.bodyZone}
              onSelect={handleBodyZoneSelect}
            />
          </div>
        )}
      </div>

      {/* Size Selector */}
      <div>
        <label htmlFor="size" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Tamaño del tatuaje
        </label>
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 appearance-none cursor-pointer"
        >
          {sizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Describe tu tatuaje
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Estilo, colores, referencias, ideas..."
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            Enviar solicitud
          </>
        )}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Al enviar, aceptas los términos de servicio de InkApp.
      </p>
    </form>
  )
}
