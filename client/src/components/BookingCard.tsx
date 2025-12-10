import React from 'react';
import { Link } from 'react-router-dom';
import type { BookingDTO } from '../models';

interface BookingCardProps {
    booking: BookingDTO;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'status-confirmed'; // Blue
            case 'CANCELLED': return 'status-cancelled'; // Red
            case 'COMPLETED': return 'status-completed'; // Green
            default: return 'status-requested'; // Gray
        }
    };

    return (
        <Link to={`/booking/${booking.id}`} className="booking-card-link">
            <div className="booking-card">
                <div className="booking-card-header">
                    <div className="booking-time">
                        <span className="date">{new Date(booking.startTime).toLocaleDateString()}</span>
                        <span className="time">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                        {booking.status}
                    </span>
                </div>

                <div className="booking-route">
                    <div className="route-point">
                        <span className="icon text-lg">📍</span>
                        <span className="address">{booking.startLocation.address}</span>
                    </div>
                    <div className="route-arrow">↓</div>
                    <div className="route-point">
                        <span className="icon text-lg">🏁</span>
                        <span className="address">{booking.endLocation?.address || 'Bestemming'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
