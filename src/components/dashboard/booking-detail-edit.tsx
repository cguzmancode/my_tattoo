'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, X, Loader2, DollarSign, Clock, Calendar, FileText, Tag } from 'lucide-react'

interface BookingDetailEditProps {
  booking: {
    id: string
    status: 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
    proposedDate?: Date
    priceEstimate?: number
    durationEstimate?: string
    artistNotes?: string
  }
  onSave: (data: {
    status: string
    proposedDate?: string
    priceEstimate?: number
    durationEstimate?: string
    artistNotes?: string
  }) => Promise<void>
  onCancel: () => void
}

const statusOptions = [
  { value: 'PENDING', label: 'Pendiente', color: '#eab308' },
  { value: 'ACCEPTED', label: 'Aceptada', color: '#00d4ff' },
  { value: 'CONFIRMED', label: 'Confirmada', color: '#22c55e' },
  { value: 'CANCELLED', label: 'Cancelada', color: '#ef4444' },
  { value: 'COMPLETED', label: 'Completada', color: '#a1a1a1' },
]

const durationOptions = [
  { value: '1-2h', label: '1-2 horas' },
  { value: '3-4h', label: '3-4 horas' },
  { value: '5h+', label: '5+ horas' },
  { value: 'multiple', label: 'Múltiples sesiones' },
]

export function BookingDetailEdit({ booking, onSave, onCancel }: BookingDetailEditProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    status: booking.status,
    proposedDate: booking.proposedDate ? new Date(booking.proposedDate).toISOString().split('T')[0] : '',
    priceEstimate: booking.priceEstimate || '',
    durationEstimate: booking.durationEstimate || '',
    artistNotes: booking.artistNotes || '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave({
        ...formData,
        priceEstimate: formData.priceEstimate ? Number(formData.priceEstimate) : undefined,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-white">
          <Tag className="h-4 w-4 text-[#ff6b35]" />
          Estado
        </label>
        <div className="grid grid-cols-2 gap-2">
          {statusOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChange('status', option.value)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                formData.status === option.value
                  ? 'border-[#ff6b35] bg-[#ff6b35]/10 text-white'
                  : 'border-white/10 bg-[#0a0a0a] text-[#a1a1a1] hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                {option.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Proposed Date */}
      <div className="space-y-2">
        <label htmlFor="proposedDate" className="flex items-center gap-2 text-sm font-medium text-white">
          <Calendar className="h-4 w-4 text-[#ff6b35]" />
          Fecha propuesta
        </label>
        <input
          type="date"
          id="proposedDate"
          value={formData.proposedDate}
          onChange={(e) => handleChange('proposedDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm
                     focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/20
                     transition-all"
        />
      </div>

      {/* Price Estimate */}
      <div className="space-y-2">
        <label htmlFor="priceEstimate" className="flex items-center gap-2 text-sm font-medium text-white">
          <DollarSign className="h-4 w-4 text-[#ff6b35]" />
          Precio estimado (€)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252]">€</span>
          <input
            type="number"
            id="priceEstimate"
            value={formData.priceEstimate}
            onChange={(e) => handleChange('priceEstimate', e.target.value)}
            placeholder="Ej: 250"
            min="0"
            step="10"
            className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm
                       focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/20
                       transition-all placeholder:text-[#525252]"
          />
        </div>
      </div>

      {/* Duration Estimate */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-white">
          <Clock className="h-4 w-4 text-[#ff6b35]" />
          Duración estimada
        </label>
        <div className="grid grid-cols-2 gap-2">
          {durationOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChange('durationEstimate', option.value)}
              className={`p-3 rounded-xl border text-sm transition-all ${
                formData.durationEstimate === option.value
                  ? 'border-[#ff6b35] bg-[#ff6b35]/10 text-white'
                  : 'border-white/10 bg-[#0a0a0a] text-[#a1a1a1] hover:border-white/20'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Artist Notes */}
      <div className="space-y-2">
        <label htmlFor="artistNotes" className="flex items-center gap-2 text-sm font-medium text-white">
          <FileText className="h-4 w-4 text-[#ff6b35]" />
          Notas privadas
        </label>
        <textarea
          id="artistNotes"
          value={formData.artistNotes}
          onChange={(e) => handleChange('artistNotes', e.target.value)}
          placeholder="Notas internas sobre el cliente, diseño, etc..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm
                     focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]/20
                     transition-all resize-none placeholder:text-[#525252]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <motion.button
          type="submit"
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                     bg-[#ff6b35] text-black font-medium text-sm
                     hover:bg-[#ff8555] transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </motion.button>
        <motion.button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                     border border-white/10 text-white font-medium text-sm
                     hover:bg-white/5 transition-colors"
        >
          <X className="h-4 w-4" />
          Cancelar
        </motion.button>
      </div>
    </form>
  )
}
