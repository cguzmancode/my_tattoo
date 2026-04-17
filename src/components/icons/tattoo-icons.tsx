interface IconProps {
  className?: string
}

// Icono X estilo tattoo para días bloqueados
export function BlockedIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* X cruzada estilo tattoo */}
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
      {/* Puntos decorativos en los extremos */}
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
      <circle cx="6" cy="18" r="1.5" fill="currentColor" />
    </svg>
  )
}

// Icono de círculo abierto para días disponibles
export function AvailableIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Círculo estilo tattoo */}
      <circle cx="12" cy="12" r="8" />
      {/* Puntos decorativos */}
      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
      <circle cx="12" cy="20" r="1.5" fill="currentColor" />
    </svg>
  )
}

// Icono de aguja de tattoo simplificada - CORREGIDO para viewBox 0 0 24 24
export function TattooNeedleIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Aguja - ajustado para caber en 24x24 */}
      <path d="M12 2L12 14" />
      <circle cx="12" cy="16" r="2" />
      <path d="M12 18L12 20" />
      {/* Gota de tinta */}
      <circle cx="10" cy="21" r="0.5" fill="currentColor" />
      <circle cx="14" cy="21.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

// Icono de calavera pequeña para cancelados
export function SkullIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Cráneo estilo old school tattoo */}
      <path d="M9 5a5 5 0 0 1 6 0c2.5 1.5 3 4 3 6a4 4 0 0 1-1 3v2H7v-2a4 4 0 0 1-1-3c0-2 .5-4.5 3-6z" />
      {/* Ojos */}
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
      <circle cx="15" cy="11" r="1.5" fill="currentColor" />
      {/* Nariz */}
      <path d="M12 13L12 15" />
      {/* Dientes */}
      <path d="M10 16H14" />
    </svg>
  )
}

// Icono de rosa para estilos tradicionales
export function RoseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Pétalos */}
      <circle cx="12" cy="7" r="4" />
      <circle cx="9" cy="8" r="2.5" />
      <circle cx="15" cy="8" r="2.5" />
      {/* Tallo */}
      <path d="M12 11L12 20" />
      {/* Hojas */}
      <path d="M12 16C10 17 8 16 8 14" />
      <path d="M12 14C14 15 16 14 16 12" />
    </svg>
  )
}
