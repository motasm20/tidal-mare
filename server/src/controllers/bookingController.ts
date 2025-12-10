import { Request, Response } from 'express';
import BookingService from '../services/BookingService';
import { BookingDTO } from '../../../shared/types';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const bookingData = req.body as BookingDTO;
        // In real app setup, userId comes from auth middleware. 
        // For MVP, if it is in body, use it, else generic.
        // We really should use req.user.userId from token if available.
        if ((req as any).user) {
            bookingData.userId = (req as any).user.userId;
        }

        const booking = await BookingService.createBooking(bookingData);
        res.status(201).json(booking);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        // userId from middleware
        const userId = (req as any).user?.userId || req.query.userId as string;
        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }
        const bookings = await BookingService.getUserBookings(userId);
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getBooking = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const bookingId = req.params.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const booking = await BookingService.getBookingById(bookingId, userId);
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
};

export const cancelBooking = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const bookingId = req.params.id;
    const { reason } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const booking = await BookingService.cancelBooking(bookingId, userId, reason);
        res.json(booking);
    } catch (error: any) {
        if (error.message === 'Booking not found') {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (error.message === 'Unauthorized') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        res.status(400).json({ message: error.message || 'Failed to cancel booking' });
    }
};
