import { Sidebar } from '@/components/dashboard/sidebar'
import { BottomNav } from '@/components/dashboard/bottom-nav'
import { ToastProvider } from '@/components/ui/toast'
import { getCurrentArtist } from '@/app/actions/user'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const artist = await getCurrentArtist()
  const sidebarArtist = artist
    ? { name: artist.name, isActive: artist.isActive }
    : null

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar artist={sidebarArtist} />
        <main className="flex-1 p-6 lg:p-10 overflow-auto pb-24 lg:pb-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </ToastProvider>
  )
}
