// Mock data for local development and demo
// Pure data - no server dependencies

export const DEMO_ARTIST = {
  id: 'demo-artist-001',
  clerkId: 'demo_clerk_id',
  name: 'Alex "The Needle" Rivera',
  email: 'alex@inkapp.demo',
  slug: 'alex-rivera-tattoo',
  bio: 'Especialista en tradicional americano y neotradicional. 10+ años de experiencia transformando ideas en arte permanente. Estudio privado en el corazón de Madrid. Cada diseño es único, creado en colaboración con el cliente.',
  styles: ['Traditional', 'Neotraditional', 'Blackwork', 'Japanese'],
  depositAmount: 5000,
  instagramUrl: 'https://instagram.com/alex.needle',
  portfolioImages: [
    'https://images.unsplash.com/photo-1611501275019-9e0877284709?w=800&q=80',
    'https://images.unsplash.com/photo-1598371839696-5c5b0e0c5d1c?w=800&q=80',
    'https://images.unsplash.com/photo-1565058379802-64566b6f267a?w=800&q=80',
    'https://images.unsplash.com/photo-1590246815117-7f6d9b8b2c58?w=800&q=80',
    'https://images.unsplash.com/photo-1470167290877-7d5d3446de4c?w=800&q=80',
    'https://images.unsplash.com/photo-1597223557154-721c1cecc4c0?w=800&q=80',
  ],
  isActive: true,
  createdAt: new Date('2020-01-15'),
  updatedAt: new Date('2024-01-15'),
}

export const DEMO_BOOKINGS = [
  {
    id: 'booking-001',
    clientName: 'María García',
    clientEmail: 'maria@example.com',
    clientPhone: '+34 612 345 678',
    bodyZone: 'Forearm',
    size: 'Medium (10-15cm)',
    description: 'Quiero un diseño de una rosa tradicional con un banner que diga "Mamá". Colores vivos, estilo old school.',
    referenceImages: [],
    preferredDates: [new Date('2024-02-15'), new Date('2024-02-16')],
    status: 'PENDING' as const,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    artistId: 'demo-artist-001',
    payments: [],
  },
  {
    id: 'booking-002',
    clientName: 'Carlos Rodríguez',
    clientEmail: 'carlos@example.com',
    clientPhone: '+34 623 456 789',
    bodyZone: 'Chest',
    size: 'Large (20-30cm)',
    description: 'Dragón japonés estilo irezumi, en blanco y negro con sombreado. Diseño que se extienda por el pecho.',
    referenceImages: [],
    preferredDates: [new Date('2024-02-20')],
    status: 'PENDING' as const,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    artistId: 'demo-artist-001',
    payments: [],
  },
  {
    id: 'booking-003',
    clientName: 'Laura Martínez',
    clientEmail: 'laura@example.com',
    clientPhone: '+34 634 567 890',
    bodyZone: 'Shoulder',
    size: 'Small (5-8cm)',
    description: 'Tatuaje minimalista de una luna con una cara sutil. Estilo fine line.',
    referenceImages: [],
    preferredDates: [new Date('2024-02-10')],
    status: 'ACCEPTED' as const,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-11'),
    artistId: 'demo-artist-001',
    payments: [],
  },
  {
    id: 'booking-004',
    clientName: 'Juan López',
    clientEmail: 'juan@example.com',
    clientPhone: '+34 645 678 901',
    bodyZone: 'Back',
    size: 'Extra Large (Full Back)',
    description: 'Calavera mexicana con elementos florales y un reloj. Estilo neotradicional a color.',
    referenceImages: [],
    preferredDates: [new Date('2024-03-01'), new Date('2024-03-02')],
    status: 'ACCEPTED' as const,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-09'),
    artistId: 'demo-artist-001',
    payments: [
      {
        id: 'payment-001',
        bookingId: 'booking-004',
        stripePaymentIntentId: 'pi_demo_001',
        amount: 5000,
        status: 'PENDING' as const,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      }
    ],
  },
  {
    id: 'booking-005',
    clientName: 'Ana Fernández',
    clientEmail: 'ana@example.com',
    clientPhone: '+34 656 789 012',
    bodyZone: 'Thigh',
    size: 'Large (20-25cm)',
    description: 'Serpiente enroscada con rosas y dagas. Estilo tradicional con colores vivos.',
    referenceImages: [],
    preferredDates: [new Date('2024-01-25')],
    status: 'CONFIRMED' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-06'),
    artistId: 'demo-artist-001',
    payments: [
      {
        id: 'payment-002',
        bookingId: 'booking-005',
        stripePaymentIntentId: 'pi_demo_002',
        amount: 5000,
        status: 'COMPLETED' as const,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      }
    ],
  },
  {
    id: 'booking-006',
    clientName: 'Pedro Sánchez',
    clientEmail: 'pedro@example.com',
    clientPhone: '+34 667 890 123',
    bodyZone: 'Calf',
    size: 'Medium (12-18cm)',
    description: 'Ancla con cadenas y rosas. Estilo tradicional americano, colores sólidos.',
    referenceImages: [],
    preferredDates: [new Date('2024-01-28')],
    status: 'CONFIRMED' as const,
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2024-01-03'),
    artistId: 'demo-artist-001',
    payments: [
      {
        id: 'payment-003',
        bookingId: 'booking-006',
        stripePaymentIntentId: 'pi_demo_003',
        amount: 5000,
        status: 'COMPLETED' as const,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      }
    ],
  },
  {
    id: 'booking-007',
    clientName: 'Sofía Ruiz',
    clientEmail: 'sofia@example.com',
    clientPhone: '+34 678 901 234',
    bodyZone: 'Wrist',
    size: 'Small (5-7cm)',
    description: 'Letras con el nombre de mi hija en estilo script.',
    referenceImages: [],
    preferredDates: [new Date('2024-01-20')],
    status: 'CANCELLED' as const,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-07'),
    artistId: 'demo-artist-001',
    payments: [],
  },
  {
    id: 'booking-008',
    clientName: 'Miguel Torres',
    clientEmail: 'miguel@example.com',
    clientPhone: '+34 689 012 345',
    bodyZone: 'Upper Arm',
    size: 'Medium (10-14cm)',
    description: 'Lobo aullando a la luna con bosque de fondo. Estilo blackwork.',
    referenceImages: [],
    preferredDates: [new Date('2024-02-05')],
    status: 'PENDING' as const,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    artistId: 'demo-artist-001',
    payments: [],
  },
]

export const DEMO_BLOCKED_DATES = [
  { id: 'blocked-001', date: new Date('2024-01-20'), artistId: 'demo-artist-001', reason: 'Vacation' },
  { id: 'blocked-002', date: new Date('2024-01-21'), artistId: 'demo-artist-001', reason: 'Vacation' },
  { id: 'blocked-003', date: new Date('2024-02-14'), artistId: 'demo-artist-001', reason: 'Holiday' },
]

export const DEMO_STATS = {
  totalBookings: 24,
  pendingBookings: 3,
  acceptedBookings: 2,
  confirmedBookings: 15,
  cancelledBookings: 4,
  thisWeek: 2,
  thisMonth: 5,
}

// Verificar si estamos en modo demo
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV === 'development'
}

// Helper para obtener datos del artista demo
export function getDemoArtist() {
  return DEMO_ARTIST
}

// Helper para obtener bookings del artista demo
export function getDemoBookings() {
  return DEMO_BOOKINGS
}

// Helper para obtener fechas bloqueadas
export function getDemoBlockedDates() {
  return DEMO_BLOCKED_DATES
}

// Helper para obtener stats
export function getDemoStats() {
  return DEMO_STATS
}
