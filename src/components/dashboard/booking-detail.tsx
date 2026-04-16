'use client'

import { useState } from 'react'
import { BookingStatus } from '@prisma/client'
import { updateBookingStatus } from '@/app/actions/bookings'
import { StatusBadge } from './status-badge'
import { formatCurrency } from '@/lib/utils'

interface BookingDetailProps {
  booking: {
    id: string
    clientName: string
    clientEmail: string
    clientPhone: string | null
    bodyZone: string
    size: string
    description: string
    preferredDates: string[]
    status: BookingStatus
    proposedDate: Date | null
    depositPaid: boolean
    createdAt: Date
    referenceImages: string[]
  }
}

export function BookingDetail({ booking }: BookingDetailProps) {
  const [status, setStatus] = useState(booking.status)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: BookingStatus) => {
    setLoading(true)
    try {
      await updateBookingStatus(booking.id, { status: newStatus })
      setStatus(newStatus)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setLoading(false)
    }
  }

  const canAccept = status === 'PENDING'
  const canConfirm = status === 'ACCEPTED' && booking.depositPaid
  const canReject = status === 'PENDING' || status === 'ACCEPTED'

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start pb-6 border-b">
        <div>
          <h2 className="text-2xl font-bold">{booking.clientName}</h2>
          <p className="text-gray-600">{booking.clientEmail}</p>
          {booking.clientPhone && (
            <p className="text-gray-500 text-sm mt-1">{booking.clientPhone}</p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Body Zone</h3>
          <p className="mt-1 text-lg capitalize">{booking.bodyZone}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Size</h3>
          <p className="mt-1 text-lg capitalize">{booking.size}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</h3>
          <p className="mt-1 text-gray-900">{booking.description}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Preferred Dates</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {booking.preferredDates.map((date) => (
              <span key={date} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {new Date(date).toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>
        {booking.depositPaid && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Deposit</h3>
            <p className="mt-1 text-green-600 font-semibold">Paid</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t">
        {canAccept && (
          <button
            onClick={() => handleStatusChange('ACCEPTED')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Accept'}
          </button>
        )}
        {canConfirm && (
          <button
            onClick={() => handleStatusChange('CONFIRMED')}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        )}
        {canReject && (
          <button
            onClick={() => handleStatusChange('REJECTED')}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Reject'}
          </button>
        )}
      </div>
    </div>
  )
}
