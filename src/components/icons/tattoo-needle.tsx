interface TattooNeedleProps {
  className?: string
}

export function TattooNeedle({ className = "h-6 w-6" }: TattooNeedleProps) {
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
      {/* Needle tip */}
      <path d="M12 2L12 8" />
      
      {/* Needle body - bar */}
      <path d="M12 8L12 18" />
      
      {/* Needle eye/loop at top */}
      <circle cx="12" cy="20" r="2" />
      
      {/* Ink drop falling */}
      <path d="M12 22L12 23" />
      
      {/* Small ink dots */}
      <circle cx="10" cy="24" r="0.5" fill="currentColor" />
      <circle cx="14" cy="24.5" r="0.5" fill="currentColor" />
    </svg>
  )
}
