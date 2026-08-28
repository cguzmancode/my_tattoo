import { getArtistBySlug } from '@/app/actions/profile'
import { ArtistProfile } from '@/components/public/artist-profile'
import { notFound } from 'next/navigation'
import { DEMO_ARTIST } from '@/lib/mocks'

interface PublicProfilePageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug } = await params

  // Siempre mostrar el perfil demo para alex-rivera-tattoo
  // Esto sirve como portfolio de ejemplo para visitantes
  if (slug === DEMO_ARTIST.slug) {
    return <ArtistProfile artist={DEMO_ARTIST} />
  }

  let artist: Awaited<ReturnType<typeof getArtistBySlug>>
  try {
    artist = await getArtistBySlug(slug)
  } catch {
    notFound()
  }

  return <ArtistProfile artist={artist} />
}
