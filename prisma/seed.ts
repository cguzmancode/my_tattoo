import 'dotenv/config'
import { fileURLToPath } from 'node:url'
import { prisma } from '../src/lib/prisma'

interface SeedOptions {
  clerkId: string
  slug?: string
  email?: string
  today?: Date
}

const DEFAULT_SLUG = 'alex-rivera-tattoo'
const DEFAULT_NAME = 'Alex "The Needle" Rivera'
const DEFAULT_BIO =
  'Especialista en tradicional americano y neotradicional. 10+ años transformando ideas en arte permanente. Estudio privado en el corazón de Madrid. Cada diseño es único, creado en colaboración con el cliente.'
const DEFAULT_STYLES = ['Traditional', 'Neotraditional', 'Blackwork', 'Japanese']
const DEFAULT_PORTFOLIO = [
  'https://images.unsplash.com/photo-1561377455-190afb395ed7?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1759247943688-5d47a84dd615?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1711637819902-7e1255e487cc?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1723242017542-6273e0115435?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1597852075234-fd721ac361d3?w=800&h=800&fit=crop',
]

function daysFromNow(today: Date, n: number): Date {
  const d = new Date(today)
  d.setUTCDate(d.getUTCDate() + n)
  return d
}

function isoDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export async function seedDemo(options: SeedOptions) {
  const today = options.today ?? new Date()
  const slug = options.slug ?? DEFAULT_SLUG
  const email = options.email ?? `demo+${options.clerkId.slice(-12)}@my-tattoo.demo`

  await prisma.artist.deleteMany({ where: { clerkId: options.clerkId } })

  const artist = await prisma.artist.create({
    data: {
      clerkId: options.clerkId,
      email,
      slug,
      name: DEFAULT_NAME,
      bio: DEFAULT_BIO,
      styles: DEFAULT_STYLES,
      depositAmount: 5000,
      instagramUrl: 'https://instagram.com/alex.needle',
      portfolioImages: DEFAULT_PORTFOLIO,
      isActive: true,
    },
  })

  const bookingsToCreate = [
    {
      clientName: 'María García',
      clientEmail: 'maria@example.com',
      clientPhone: '+34 612 345 678',
      bodyZone: 'Forearm',
      size: 'Medium (10-15cm)',
      description: 'Rosa tradicional con banner que diga "Mamá". Colores vivos, old school.',
      preferredDates: [isoDateOnly(daysFromNow(today, 5)), isoDateOnly(daysFromNow(today, 6))],
      status: 'PENDING' as const,
      createdAt: daysFromNow(today, -1),
    },
    {
      clientName: 'Carlos Rodríguez',
      clientEmail: 'carlos@example.com',
      clientPhone: '+34 623 456 789',
      bodyZone: 'Chest',
      size: 'Large (20-30cm)',
      description: 'Dragón japonés estilo irezumi, blanco y negro con sombreado. Pecho completo.',
      preferredDates: [isoDateOnly(daysFromNow(today, 14))],
      status: 'PENDING' as const,
      createdAt: today,
    },
    {
      clientName: 'Miguel Torres',
      clientEmail: 'miguel@example.com',
      clientPhone: '+34 689 012 345',
      bodyZone: 'Upper Arm',
      size: 'Medium (10-14cm)',
      description: 'Lobo aullando a la luna con bosque de fondo. Blackwork.',
      preferredDates: [isoDateOnly(daysFromNow(today, 12))],
      status: 'PENDING' as const,
      createdAt: daysFromNow(today, -3),
    },
    {
      clientName: 'Laura Martínez',
      clientEmail: 'laura@example.com',
      clientPhone: '+34 634 567 890',
      bodyZone: 'Shoulder',
      size: 'Small (5-8cm)',
      description: 'Luna minimalista con cara sutil. Fine line.',
      preferredDates: [isoDateOnly(daysFromNow(today, 8))],
      status: 'ACCEPTED' as const,
      proposedDate: daysFromNow(today, 8),
      priceEstimate: 12000,
      durationEstimate: '2-3 horas',
      artistNotes: 'Confirmar tamaño exacto antes de la cita.',
      createdAt: daysFromNow(today, -5),
    },
    {
      clientName: 'Juan López',
      clientEmail: 'juan@example.com',
      clientPhone: '+34 645 678 901',
      bodyZone: 'Back',
      size: 'Extra Large (Full Back)',
      description: 'Calavera mexicana con elementos florales y reloj. Neotradicional a color.',
      preferredDates: [isoDateOnly(daysFromNow(today, 10))],
      status: 'ACCEPTED' as const,
      proposedDate: daysFromNow(today, 10),
      priceEstimate: 80000,
      durationEstimate: '3 sesiones de 5 horas',
      createdAt: daysFromNow(today, -7),
    },
    {
      clientName: 'Ana Fernández',
      clientEmail: 'ana@example.com',
      clientPhone: '+34 656 789 012',
      bodyZone: 'Thigh',
      size: 'Large (20-25cm)',
      description: 'Serpiente enroscada con rosas y dagas. Tradicional con colores vivos.',
      preferredDates: [isoDateOnly(daysFromNow(today, 3))],
      status: 'CONFIRMED' as const,
      proposedDate: daysFromNow(today, 3),
      priceEstimate: 45000,
      durationEstimate: '6 horas',
      createdAt: daysFromNow(today, -14),
    },
    {
      clientName: 'Pedro Sánchez',
      clientEmail: 'pedro@example.com',
      clientPhone: '+34 667 890 123',
      bodyZone: 'Calf',
      size: 'Medium (12-18cm)',
      description: 'Ancla con cadenas y rosas. Tradicional americano, colores sólidos.',
      preferredDates: [isoDateOnly(daysFromNow(today, 7))],
      status: 'CONFIRMED' as const,
      proposedDate: daysFromNow(today, 7),
      priceEstimate: 25000,
      durationEstimate: '4 horas',
      createdAt: daysFromNow(today, -10),
    },
    {
      clientName: 'Elena Vargas',
      clientEmail: 'elena@example.com',
      clientPhone: '+34 678 901 234',
      bodyZone: 'Wrist',
      size: 'Small (5-7cm)',
      description: 'Símbolo de infinito con nombre integrado.',
      preferredDates: [isoDateOnly(daysFromNow(today, -20))],
      status: 'COMPLETED' as const,
      proposedDate: daysFromNow(today, -20),
      priceEstimate: 8000,
      durationEstimate: '1 hora',
      createdAt: daysFromNow(today, -30),
    },
    {
      clientName: 'Sofía Ruiz',
      clientEmail: 'sofia@example.com',
      clientPhone: '+34 689 012 345',
      bodyZone: 'Wrist',
      size: 'Small (5-7cm)',
      description: 'Letras con el nombre de mi hija en script.',
      preferredDates: [isoDateOnly(daysFromNow(today, -10))],
      status: 'CANCELLED' as const,
      createdAt: daysFromNow(today, -20),
    },
  ]

  const bookings = []
  for (const data of bookingsToCreate) {
    bookings.push(
      await prisma.booking.create({
        data: { ...data, artistId: artist.id },
      }),
    )
  }

  const blockedDates = [
    { date: daysFromNow(today, 5), reason: 'Vacation' },
    { date: daysFromNow(today, 6), reason: 'Vacation' },
    { date: daysFromNow(today, 15), reason: 'Convention' },
  ]
  await prisma.blockedDate.createMany({
    data: blockedDates.map((b) => ({ artistId: artist.id, date: b.date, reason: b.reason })),
  })

  const firstPending = bookings.find((b) => b.status === 'PENDING')
  if (firstPending) {
    await prisma.bookingMessage.createMany({
      data: [
        {
          bookingId: firstPending.id,
          sender: 'client',
          message: '¡Hola! Estoy muy emocionada con el diseño. ¿Tienes alguna referencia de algo similar que hayas hecho?',
          createdAt: daysFromNow(today, -1),
        },
        {
          bookingId: firstPending.id,
          sender: 'artist',
          message: '¡Hola María! Mira mi Instagram, hay varios trabajos similares. Para tu pieza puedo añadir un toque personal con las hojas. ¿Te gustaría ver un boceto antes?',
          createdAt: daysFromNow(today, -1),
        },
        {
          bookingId: firstPending.id,
          sender: 'client',
          message: '¡Sí, me encantaría! Cuándo podríamos vernos para revisarlo?',
          createdAt: today,
          read: false,
        },
      ],
    })
  }

  return { artist, bookings, blockedDates }
}

async function main() {
  const clerkId = process.env.DEMO_CLERK_USER_ID
  if (!clerkId) {
    console.error('DEMO_CLERK_USER_ID environment variable required')
    process.exit(1)
  }
  const result = await seedDemo({ clerkId })
  console.log(`Seeded ${result.bookings.length} bookings + ${result.blockedDates.length} blocked dates for ${result.artist.slug}`)
  await prisma.$disconnect()
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url)
if (isDirectRun) {
  main().catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
}
