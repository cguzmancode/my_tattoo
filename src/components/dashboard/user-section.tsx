'use client'

import { UserButton } from '@clerk/nextjs'

interface UserSectionProps {
  artist: { name: string; isActive: boolean } | null
}

export function UserSection({ artist }: UserSectionProps) {
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
            {artist?.name || 'Artista'}
          </p>
          <p className="text-xs text-[#525252]">
            {artist?.isActive ? 'Artista' : 'Pendiente'}
          </p>
        </div>
      </div>
    </div>
  )
}
