export default function BookingsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-4 w-72 rounded-lg bg-white/5 animate-pulse" />
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-white/5 animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-[#141414] overflow-hidden"
          >
            <div className="h-40 w-full bg-white/5 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-2/3 rounded bg-white/5 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
