export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-4 w-80 rounded-lg bg-white/5 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-[#141414] p-5 space-y-3"
          >
            <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
            <div className="h-10 w-1/3 rounded bg-white/5 animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-white/5 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
