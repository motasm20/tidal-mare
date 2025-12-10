import { BookingDTO, BookingStatus } from '../../../shared/types';
import BookingsRepo from '../repositories/BookingsRepo';

import CarsRepo from '../repositories/CarsRepo';

class BookingService {
    async createBooking(booking: BookingDTO): Promise<BookingDTO> {
        // Find the car based on carId
        if (booking.carId) {
            const car = await CarsRepo.findById(booking.carId);
            if (car) {
                booking.car = car;
            }
        }

        // Validate booking
        if (!booking.car) {
            // Fallback for MVP if somehow carId is bad, or just warn. 
            // In real app we error here.
            console.warn("Booking created without valid Car object");
        }

        booking.status = BookingStatus.REQUESTED;
        booking.id = Math.random().toString();

        return BookingsRepo.create(booking);
    }

    async getUserBookings(userId: string): Promise<BookingDTO[]> {
        return BookingsRepo.findByUser(userId);
    }
    async getBookingById(bookingId: string, userId: string): Promise<BookingDTO | null> {
        const booking = await BookingsRepo.findById(bookingId);
        if (!booking) return null;
        if (booking.userId !== userId) return null; // Security check
        return booking;
    }

    async cancelBooking(bookingId: string, userId: string, reason?: string): Promise<BookingDTO> {
        const booking = await BookingsRepo.findById(bookingId);

        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.userId !== userId) {
            throw new Error('Unauthorized');
        }

        if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
            throw new Error('Cannot cancel a completed or already cancelled booking');
        }

        const updatedBooking = await BookingsRepo.cancel(bookingId, reason);
        if (!updatedBooking) throw new Error('Failed to cancel booking');

        return updatedBooking;
    }
}

export default new BookingService();
