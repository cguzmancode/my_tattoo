import { getArtistBySlug } from '@/app/actions/profile'
import { ArtistProfile } from '@/components/public/artist-profile'
import { notFound } from 'next/navigation'

interface PublicProfilePageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug } = await params

  try {
    const artist = await getArtistBySlug(slug)
    return <ArtistProfile artist={artist} />
  } catch {
    notFound()
  }
}
