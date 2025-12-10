import { BookingDTO } from '../../../shared/types';

class BookingsRepo {
    private bookings: BookingDTO[] = [];

    async findAll(): Promise<BookingDTO[]> {
        return this.bookings;
    }

    async findByUser(userId: string): Promise<BookingDTO[]> {
        return this.bookings.filter(b => b.userId === userId);
    }

    async findById(id: string): Promise<BookingDTO | undefined> {
        return this.bookings.find(b => b.id === id);
    }

    async create(booking: BookingDTO): Promise<BookingDTO> {
        booking.createdAt = new Date().toISOString();
        this.bookings.push(booking);
        return booking;
    }

    async cancel(id: string, reason?: string): Promise<BookingDTO | null> {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) return null;

        booking.status = 'CANCELLED'; // Using string literal as enum is const object
        booking.cancelledAt = new Date().toISOString();
        if (reason) booking.cancellationReason = reason;

        return booking;
    }
}

export default new BookingsRepo();
