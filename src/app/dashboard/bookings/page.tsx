import { BookingList } from '@/components/dashboard/booking-list'

export default async function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">Manage your appointment requests</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <BookingList />
      </div>
    </div>
  )
}
