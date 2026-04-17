import { getArtistBySlug } from '@/app/actions/profile'
import { ArtistProfile } from '@/components/public/artist-profile'
import { notFound } from 'next/navigation'
import { DEMO_ARTIST, isDemoMode } from '@/lib/mocks'

interface PublicProfilePageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug } = await params

  // En modo demo, retornar datos de ejemplo para el slug demo
  if (slug === DEMO_ARTIST.slug && isDemoMode()) {
    return <ArtistProfile artist={DEMO_ARTIST} />
  }

  try {
    const artist = await getArtistBySlug(slug)
    return <ArtistProfile artist={artist} />
  } catch {
    notFound()
  }
}
