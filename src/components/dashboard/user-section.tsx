'use client'

import { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { getCurrentArtist } from '@/app/actions/user'

interface ArtistData {
  id: string
  name: string
  email: string
  isActive: boolean
}

export function UserSection() {
  const [artist, setArtist] = useState<ArtistData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArtist() {
      const artistData = await getCurrentArtist()
      if (artistData) {
        setArtist({
          id: artistData.id,
          name: artistData.name,
          email: artistData.email,
          isActive: artistData.isActive,
        })
      }
      setLoading(false)
    }

    fetchArtist()
  }, [])

  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] border border-white/10">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-10 w-10 rounded-full border-2 border-[#ff6b35]/50"
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {loading ? '...' : artist?.name || 'Artista'}
          </p>
          <p className="text-xs text-[#525252]">
            {loading ? '' : artist?.isActive ? 'Artista' : 'Pendiente'}
          </p>
        </div>
      </div>
    </div>
  )
}
