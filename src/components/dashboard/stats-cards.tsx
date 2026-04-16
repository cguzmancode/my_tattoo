import { getBookingStats } from '@/app/actions/bookings'
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react'

export async function StatsCards() {
  const stats = await getBookingStats()

  const cards = [
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Accepted',
      value: stats.accepted,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total',
      value: stats.total,
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className={`${card.bgColor} rounded-xl p-6 border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-3xl font-bold mt-2 ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <Icon className={`w-8 h-8 ${card.color} opacity-50`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
