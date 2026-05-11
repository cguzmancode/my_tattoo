import { prisma } from '@/lib/prisma'
import { PrismaBookingRepository } from './infrastructure/prisma-booking-repository'
import { PrismaBookingMessageRepository } from './infrastructure/prisma-booking-message-repository'
import { ResendNotificationService } from './infrastructure/resend-notification-service'
import { SystemClock } from './infrastructure/system-clock'
import { CreateBookingUseCase } from './application/use-cases/create-booking'
import { AcceptBookingUseCase } from './application/use-cases/accept-booking'
import { RejectBookingUseCase } from './application/use-cases/reject-booking'
import { ConfirmBookingUseCase } from './application/use-cases/confirm-booking'
import { CompleteBookingUseCase } from './application/use-cases/complete-booking'
import { CancelBookingUseCase } from './application/use-cases/cancel-booking'
import { AddMessageToBookingUseCase } from './application/use-cases/add-message-to-booking'
import { GetArtistBookingsUseCase } from './application/use-cases/get-artist-bookings'

const bookingRepository = new PrismaBookingRepository(prisma)
const bookingMessageRepository = new PrismaBookingMessageRepository(prisma)
const notificationService = new ResendNotificationService(prisma)
const clock = new SystemClock()

export const bookingsModule = {
  createBooking: new CreateBookingUseCase(bookingRepository, notificationService, clock),
  acceptBooking: new AcceptBookingUseCase(bookingRepository, notificationService, clock),
  rejectBooking: new RejectBookingUseCase(bookingRepository, notificationService, clock),
  confirmBooking: new ConfirmBookingUseCase(bookingRepository, clock),
  completeBooking: new CompleteBookingUseCase(bookingRepository, clock),
  cancelBooking: new CancelBookingUseCase(bookingRepository, clock),
  addMessageToBooking: new AddMessageToBookingUseCase(
    bookingRepository,
    bookingMessageRepository,
    notificationService,
    clock,
  ),
  getArtistBookings: new GetArtistBookingsUseCase(bookingRepository),
}
