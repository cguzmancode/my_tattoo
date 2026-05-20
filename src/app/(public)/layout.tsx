import { PublicHeader } from '@/components/layout/public-header'
import { NoiseOverlay } from '@/components/layout/noise-overlay'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NoiseOverlay />
      <PublicHeader />
      <main className="relative z-10 pt-16">{children}</main>
    </>
  )
}
