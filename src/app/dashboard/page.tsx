import { BookingList } from '@/components/dashboard/booking-list'
import { StatsCards } from '@/components/dashboard/stats-cards'

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your tattoo appointments</p>
      </div>
      
      <StatsCards />
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Bookings</h2>
        <BookingList />
      </div>
    </div>
  )
}
