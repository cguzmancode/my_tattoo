// Mock data for local development and demo
// Pure data — the only imports are type-only, so nothing leaks to runtime.
import type {
  DashboardArtist,
  DashboardBooking,
  DashboardStats,
} from '@/types/dashboard'

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
    'https://images.unsplash.com/photo-1561377455-190afb395ed7?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1759247943688-5d47a84dd615?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1711637819902-7e1255e487cc?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1723242017542-6273e0115435?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1597852075234-fd721ac361d3?w=800&h=800&fit=crop',
  ],
  isActive: true,
  createdAt: new Date('2020-01-15'),
  updatedAt: new Date('2024-01-15'),
} satisfies DashboardArtist

// Fields every fixture shares; the factory keeps each entry focused on what
// makes it different while the return type guarantees the full Prisma shape.
type DemoBookingInput = Pick<
  DashboardBooking,
  | 'id'
  | 'clientName'
  | 'clientEmail'
  | 'clientPhone'
  | 'bodyZone'
  | 'size'
  | 'description'
  | 'style'
  | 'preferredDates'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
> &
  Partial<DashboardBooking>

function demoBooking(input: DemoBookingInput): DashboardBooking {
  return {
    artistId: DEMO_ARTIST.id,
    referenceImages: [],
    proposedDate: null,
    priceEstimate: null,
    durationEstimate: null,
    artistNotes: null,
    reminderSent24h: false,
    reminderSent48h: false,
    ...input,
  }
}

export const DEMO_BOOKINGS: DashboardBooking[] = [
  demoBooking({
    id: 'booking-001',
    clientName: 'María García',
    clientEmail: 'maria@example.com',
    clientPhone: '+34 612 345 678',
    bodyZone: 'Forearm',
    size: 'Medium (10-15cm)',
    description: 'Quiero un diseño de una rosa tradicional con un banner que diga "Mamá". Colores vivos, estilo old school.',
    style: 'Traditional',
    preferredDates: ['2024-02-15', '2024-02-16'],
    status: 'PENDING',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  }),
  demoBooking({
    id: 'booking-002',
    clientName: 'Carlos Rodríguez',
    clientEmail: 'carlos@example.com',
    clientPhone: '+34 623 456 789',
    bodyZone: 'Chest',
    size: 'Large (20-30cm)',
    description: 'Dragón japonés estilo irezumi, en blanco y negro con sombreado. Diseño que se extienda por el pecho.',
    style: 'Japanese',
    preferredDates: ['2024-02-20'],
    status: 'PENDING',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  }),
  demoBooking({
    id: 'booking-003',
    clientName: 'Laura Martínez',
    clientEmail: 'laura@example.com',
    clientPhone: '+34 634 567 890',
    bodyZone: 'Shoulder',
    size: 'Small (5-8cm)',
    description: 'Tatuaje minimalista de una luna con una cara sutil. Estilo fine line.',
    style: 'Minimalist',
    preferredDates: ['2024-02-10'],
    status: 'ACCEPTED',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-11'),
  }),
  demoBooking({
    id: 'booking-004',
    clientName: 'Juan López',
    clientEmail: 'juan@example.com',
    clientPhone: '+34 645 678 901',
    bodyZone: 'Back',
    size: 'Extra Large (Full Back)',
    description: 'Calavera mexicana con elementos florales y un reloj. Estilo neotradicional a color.',
    style: 'Neotraditional',
    preferredDates: ['2024-03-01', '2024-03-02'],
    status: 'ACCEPTED',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-09'),
  }),
  demoBooking({
    id: 'booking-005',
    clientName: 'Ana Fernández',
    clientEmail: 'ana@example.com',
    clientPhone: '+34 656 789 012',
    bodyZone: 'Thigh',
    size: 'Large (20-25cm)',
    description: 'Serpiente enroscada con rosas y dagas. Estilo tradicional con colores vivos.',
    style: 'Traditional',
    preferredDates: ['2024-01-25'],
    status: 'CONFIRMED',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-06'),
  }),
  demoBooking({
    id: 'booking-006',
    clientName: 'Pedro Sánchez',
    clientEmail: 'pedro@example.com',
    clientPhone: '+34 667 890 123',
    bodyZone: 'Calf',
    size: 'Medium (12-18cm)',
    description: 'Ancla con cadenas y rosas. Estilo tradicional americano, colores sólidos.',
    style: 'Traditional',
    preferredDates: ['2024-01-28'],
    status: 'CONFIRMED',
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2024-01-03'),
  }),
  demoBooking({
    id: 'booking-007',
    clientName: 'Sofía Ruiz',
    clientEmail: 'sofia@example.com',
    clientPhone: '+34 678 901 234',
    bodyZone: 'Wrist',
    size: 'Small (5-7cm)',
    description: 'Letras con el nombre de mi hija en estilo script.',
    style: 'Script',
    preferredDates: ['2024-01-20'],
    status: 'CANCELLED',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-07'),
  }),
  demoBooking({
    id: 'booking-008',
    clientName: 'Miguel Torres',
    clientEmail: 'miguel@example.com',
    clientPhone: '+34 689 012 345',
    bodyZone: 'Upper Arm',
    size: 'Medium (10-14cm)',
    description: 'Lobo aullando a la luna con bosque de fondo. Estilo blackwork.',
    style: 'Blackwork',
    preferredDates: ['2024-02-05'],
    status: 'PENDING',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  }),
]

export const DEMO_BLOCKED_DATES = [
  { id: 'blocked-001', date: new Date('2024-01-20'), artistId: 'demo-artist-001', reason: 'Vacation' },
  { id: 'blocked-002', date: new Date('2024-01-21'), artistId: 'demo-artist-001', reason: 'Vacation' },
  { id: 'blocked-003', date: new Date('2024-02-14'), artistId: 'demo-artist-001', reason: 'Holiday' },
]

export const DEMO_STATS: DashboardStats = {
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
