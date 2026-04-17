import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile/profile-form'

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const artist = await prisma.artist.findUnique({
    where: { clerkId: userId },
  })

  if (!artist) {
    redirect('/sign-up')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-zinc-400">
          Update your profile information and public settings
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <ProfileForm
          initialData={{
            id: artist.id,
            name: artist.name,
            slug: artist.slug,
            bio: artist.bio,
            styles: artist.styles,
            depositAmount: artist.depositAmount,
            instagramUrl: artist.instagramUrl,
            portfolioImages: artist.portfolioImages,
          }}
        />
      </div>
    </div>
  )
}
