import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { BookingService } from '../services/BookingService';
import type { BookingDTO } from '../models';
import { SustainabilityStats } from '../components/SustainabilityStats';
import { authViewModel } from '../viewmodels';
// @ts-ignore - Component exists but TS might not see it immediately in this environment
import { BookingCard } from '../components/BookingCard';

export const Dashboard: React.FC = observer(() => {
    const [bookings, setBookings] = React.useState<BookingDTO[]>([]);

    React.useEffect(() => {
        const fetchBookings = async () => {
            // Use the actual logged-in user ID
            const userId = authViewModel.user?.id;
            if (!userId) return;

            try {
                const userBookings = await BookingService.getUserBookings(userId);
                setBookings(userBookings);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            }
        };
        fetchBookings();
    }, [authViewModel.user]);

    // Split bookings
    const upcomingBookings = bookings.filter(b => ['REQUESTED', 'CONFIRMED'].includes(b.status));
    const historyBookings = bookings.filter(b => ['CANCELLED', 'COMPLETED'].includes(b.status));

    return (
        <div className="dashboard app-container">

            {/* Header with Actions */}
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Mijn Dashboard</h2>
                <div className="dashboard-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/request" className="btn-primary">
                        + Nieuwe Rit
                    </Link>
                    <Link to="/profile" className="logout-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                        Mijn Profiel
                    </Link>
                </div>
            </div>

            {/* Sustainability Stats */}
            <SustainabilityStats
                co2Saved={authViewModel.sustainabilityStats.co2Saved}
                treesPlanted={authViewModel.sustainabilityStats.treesPlanted}
                distance={authViewModel.sustainabilityStats.distance}
            />

            {/* Upcoming Bookings Section */}
            <section style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>📅 Aankomende Ritten</h3>
                {upcomingBookings.length === 0 ? (
                    <div className="empty-state card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>Je hebt nog geen ritten gepland.</p>
                    </div>
                ) : (
                    <div className="bookings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {upcomingBookings.map(b => (
                            <div key={b.id} className="booking-wrapper">
                                <BookingCard booking={b} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* History Section */}
            <section>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>📜 Geschiedenis</h3>
                {historyBookings.length === 0 ? (
                    <div className="empty-state card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>Nog geen ritten gemaakt.</p>
                    </div>
                ) : (
                    <div className="bookings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {historyBookings.map(b => (
                            <div key={b.id} className="booking-wrapper">
                                <BookingCard booking={b} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
});
