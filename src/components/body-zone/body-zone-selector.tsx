'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

interface BodyZone {
  id: string
  name: string
  nameEs: string
  path: string
  center: { x: number; y: number }
}

const bodyZones: BodyZone[] = [
  {
    id: 'head',
    name: 'Head',
    nameEs: 'Cabeza',
    path: 'M48 8 C48 4 52 4 52 8 L52 14 C52 18 48 18 48 14 Z',
    center: { x: 50, y: 11 }
  },
  {
    id: 'neck',
    name: 'Neck',
    nameEs: 'Cuello',
    path: 'M45 20 L55 20 L54 26 L46 26 Z',
    center: { x: 50, y: 23 }
  },
  {
    id: 'chest',
    name: 'Chest',
    nameEs: 'Pecho',
    path: 'M35 28 L65 28 L62 42 L38 42 Z',
    center: { x: 50, y: 35 }
  },
  {
    id: 'stomach',
    name: 'Stomach',
    nameEs: 'Abdomen',
    path: 'M38 44 L62 44 L58 58 L42 58 Z',
    center: { x: 50, y: 51 }
  },
  {
    id: 'back',
    name: 'Back',
    nameEs: 'Espalda',
    path: 'M32 28 L35 28 L38 58 L42 58 L38 70 L32 70 Z M68 28 L65 28 L62 58 L58 58 L62 70 L68 70 Z',
    center: { x: 50, y: 49 }
  },
  {
    id: 'upper-arm-left',
    name: 'Left Upper Arm',
    nameEs: 'Brazo Sup. Izq.',
    path: 'M30 30 L34 30 L32 50 L28 50 Z',
    center: { x: 31, y: 40 }
  },
  {
    id: 'upper-arm-right',
    name: 'Right Upper Arm',
    nameEs: 'Brazo Sup. Der.',
    path: 'M66 30 L70 30 L72 50 L68 50 Z',
    center: { x: 69, y: 40 }
  },
  {
    id: 'forearm-left',
    name: 'Left Forearm',
    nameEs: 'Antebrazo Izq.',
    path: 'M26 52 L32 52 L30 72 L24 72 Z',
    center: { x: 28, y: 62 }
  },
  {
    id: 'forearm-right',
    name: 'Right Forearm',
    nameEs: 'Antebrazo Der.',
    path: 'M68 52 L74 52 L76 72 L70 72 Z',
    center: { x: 72, y: 62 }
  },
  {
    id: 'hand-left',
    name: 'Left Hand',
    nameEs: 'Mano Izq.',
    path: 'M22 74 C22 72 26 72 26 74 L26 80 C26 82 22 82 22 80 Z',
    center: { x: 24, y: 77 }
  },
  {
    id: 'hand-right',
    name: 'Right Hand',
    nameEs: 'Mano Der.',
    path: 'M74 74 C74 72 78 72 78 74 L78 80 C78 82 74 82 74 80 Z',
    center: { x: 76, y: 77 }
  },
  {
    id: 'thigh-left',
    name: 'Left Thigh',
    nameEs: 'Muslo Izq.',
    path: 'M40 72 L48 72 L46 92 L40 92 Z',
    center: { x: 44, y: 82 }
  },
  {
    id: 'thigh-right',
    name: 'Right Thigh',
    nameEs: 'Muslo Der.',
    path: 'M52 72 L60 72 L60 92 L54 92 Z',
    center: { x: 56, y: 82 }
  },
  {
    id: 'calf-left',
    name: 'Left Calf',
    nameEs: 'Pantorrilla Izq.',
    path: 'M40 94 L46 94 L44 114 L40 114 Z',
    center: { x: 43, y: 104 }
  },
  {
    id: 'calf-right',
    name: 'Right Calf',
    nameEs: 'Pantorrilla Der.',
    path: 'M54 94 L60 94 L60 114 L56 114 Z',
    center: { x: 57, y: 104 }
  },
  {
    id: 'foot-left',
    name: 'Left Foot',
    nameEs: 'Pie Izq.',
    path: 'M38 116 C38 114 42 114 42 116 L44 122 C44 124 38 124 38 122 Z',
    center: { x: 41, y: 119 }
  },
  {
    id: 'foot-right',
    name: 'Right Foot',
    nameEs: 'Pie Der.',
    path: 'M56 116 C56 114 60 114 60 116 L62 122 C62 124 56 124 56 122 Z',
    center: { x: 59, y: 119 }
  },
]

// Silueta del cuerpo (líneas de referencia)
const bodyOutline = `
  M50 8
  C55 8 55 14 55 14
  L55 18
  C60 20 65 25 65 35
  L65 45
  C70 50 72 60 72 70
  L74 80
  C75 85 74 90 72 92
  L60 95
  C58 95 56 94 56 92
  L58 75
  C58 70 55 65 52 62
  L48 62
  C45 65 42 70 42 75
  L42 92
  C42 94 40 95 38 95
  L28 92
  C26 90 25 85 26 80
  L28 70
  C30 60 32 50 35 45
  L35 35
  C35 25 40 20 45 18
  L45 14
  C45 14 45 8 50 8
  Z
`

interface BodyZoneSelectorProps {
  selectedZone: string | null
  onSelect: (zoneId: string) => void
  multiple?: boolean
  selectedZones?: string[]
  onMultiSelect?: (zones: string[]) => void
}

export function BodyZoneSelector({
  selectedZone,
  onSelect,
  multiple = false,
  selectedZones = [],
  onMultiSelect
}: BodyZoneSelectorProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [showBack, setShowBack] = useState(false)

  const handleZoneClick = (zoneId: string) => {
    if (multiple && onMultiSelect) {
      const newZones = selectedZones.includes(zoneId)
        ? selectedZones.filter(z => z !== zoneId)
        : [...selectedZones, zoneId]
      onMultiSelect(newZones)
    } else {
      onSelect(zoneId)
    }
  }

  const isSelected = (zoneId: string) => {
    if (multiple) return selectedZones.includes(zoneId)
    return selectedZone === zoneId
  }

  const selectedZoneData = bodyZones.find(z => z.id === (multiple ? selectedZones[0] : selectedZone))
  const hoveredZoneData = bodyZones.find(z => z.id === hoveredZone)

  return (
    <div className="w-full max-w-md mx-auto">
      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-full border border-white/10 bg-[#141414] p-1">
          <button
            onClick={() => setShowBack(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              !showBack
                ? 'bg-[#ff6b35] text-black'
                : 'text-white hover:text-[#ff6b35]'
            }`}
          >
            Frente
          </button>
          <button
            onClick={() => setShowBack(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              showBack
                ? 'bg-[#ff6b35] text-black'
                : 'text-white hover:text-[#ff6b35]'
            }`}
          >
            Espalda
          </button>
        </div>
      </div>

      {/* SVG Body Map */}
      <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 p-6">
        <svg
          viewBox="0 0 100 130"
          className="w-full h-auto max-h-[400px]"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,107,53,0.1))' }}
        >
          {/* Background glow */}
          <defs>
            <radialGradient id="zoneGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Body outline (decorative) */}
          <path
            d={bodyOutline}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
            opacity="0.5"
          />

          {/* Body zones */}
          {bodyZones.map((zone) => {
            const isZoneSelected = isSelected(zone.id)
            const isZoneHovered = hoveredZone === zone.id
            const isBackZone = zone.id === 'back'

            // Hide/show zones based on view
            if (showBack && !isBackZone) return null
            if (!showBack && isBackZone) return null

            return (
              <g key={zone.id}>
                {/* Glow effect for selected/hovered */}
                {(isZoneSelected || isZoneHovered) && (
                  <circle
                    cx={zone.center.x}
                    cy={zone.center.y}
                    r="8"
                    fill="url(#zoneGlow)"
                    opacity={isZoneSelected ? 1 : 0.5}
                  />
                )}

                {/* Zone path */}
                <motion.path
                  d={zone.path}
                  fill={isZoneSelected ? '#ff6b35' : 'rgba(255,255,255,0.05)'}
                  stroke={isZoneSelected ? '#ff6b35' : isZoneHovered ? '#ff6b35' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isZoneSelected ? 2 : 1}
                  initial={false}
                  animate={{
                    fill: isZoneSelected ? '#ff6b35' : isZoneHovered ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.05)',
                    strokeWidth: isZoneSelected ? 2 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    cursor: 'pointer',
                    filter: isZoneSelected ? 'url(#glow)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  onClick={() => handleZoneClick(zone.id)}
                />

                {/* Selection indicator */}
                {isZoneSelected && (
                  <motion.circle
                    cx={zone.center.x}
                    cy={zone.center.y}
                    r="4"
                    fill="black"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="h-3 w-3 text-black" />
                  </motion.circle>
                )}
              </g>
            )
          })}
        </svg>

        {/* Zone tooltip */}
        <AnimatePresence>
          {hoveredZone && hoveredZoneData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#ff6b35]/30 text-sm text-white whitespace-nowrap"
            >
              {hoveredZoneData.nameEs}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Zone Display */}
      <div className="mt-6">
        {multiple ? (
          <div className="flex flex-wrap gap-2">
            {selectedZones.length === 0 ? (
              <p className="text-[#525252] text-sm">Selecciona las zonas donde quieres el tatuaje</p>
            ) : (
              selectedZones.map(zoneId => {
                const zone = bodyZones.find(z => z.id === zoneId)
                if (!zone) return null
                return (
                  <motion.button
                    key={zoneId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => handleZoneClick(zoneId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/30 text-sm text-[#ff6b35]"
                  >
                    {zone.nameEs}
                    <span className="text-[#ff6b35]/60">×</span>
                  </motion.button>
                )
              })
            )}
          </div>
        ) : (
          <div className="text-center">
            {selectedZone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/30"
              >
                <div className="h-3 w-3 rounded-full bg-[#ff6b35]" />
                <span className="text-[#ff6b35] font-medium">{selectedZoneData?.nameEs}</span>
              </motion.div>
            ) : (
              <p className="text-[#525252] text-sm">Selecciona la zona donde quieres el tatuaje</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
