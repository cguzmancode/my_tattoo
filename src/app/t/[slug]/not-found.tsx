import Link from 'next/link'

export default function ArtistNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-6xl font-bold text-zinc-800">404</h1>
        <h2 className="text-2xl font-semibold text-white">Artist not found</h2>
        <p className="text-zinc-400">
          The artist profile you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
