import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile/profile-form'
import { DEMO_ARTIST } from '@/lib/mocks/data'

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Usar datos del mock para demo
  const artist = DEMO_ARTIST

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-[#ff6b35] to-[#c0a062] rounded-full" />
          <span className="font-label text-xs tracking-widest text-[#ff6b35] uppercase">
            Configuración
          </span>
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-3">
          Tu Perfil
        </h1>
        <p className="text-[#a1a1a1] max-w-xl">
          Actualiza tu información pública. Estos datos serán visibles para los clientes 
          cuando visiten tu página de perfil.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#ff6b35]/20 via-transparent to-[#00d4ff]/20 blur-xl opacity-30" />
        
        <div className="relative rounded-2xl border border-white/10 bg-[#141414] p-8">
          <ProfileForm
            initialData={{
              id: artist.id,
              name: artist.name,
              slug: artist.slug,
              bio: artist.bio || '',
              styles: artist.styles,
              depositAmount: artist.depositAmount,
              instagramUrl: artist.instagramUrl || '',
              portfolioImages: artist.portfolioImages,
            }}
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-[#00d4ff] to-[#c0a062] rounded-full" />
          <span className="font-label text-xs tracking-widest text-[#00d4ff] uppercase">
            Vista Previa
          </span>
        </div>
        
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white">
              Así te ven los clientes
            </h3>
            <a 
              href={`/t/${artist.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#ff6b35] hover:text-[#ff8555] transition-colors"
            >
              Ver perfil público →
            </a>
          </div>
          
          <div className="aspect-video rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center overflow-hidden relative">
            {/* Mock profile preview */}
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#c0a062] mx-auto mb-4 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-black">
                  {artist.name.charAt(0)}
                </span>
              </div>
              <h4 className="font-display text-xl font-bold text-white mb-2">
                {artist.name}
              </h4>
              <p className="text-[#a1a1a1] text-sm max-w-md">
                {artist.bio?.slice(0, 100) || 'Sin descripción'}...
              </p>
            </div>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}
