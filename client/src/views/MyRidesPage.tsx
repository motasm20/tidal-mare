import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { BookingService } from '../services/BookingService';
import type { BookingDTO } from '../models';
import { BookingCard } from '../components/BookingCard';
import { authViewModel } from '../viewmodels';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Link } from 'react-router-dom';

export const MyRidesPage: React.FC = observer(() => {
    const [bookings, setBookings] = React.useState<BookingDTO[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const userId = authViewModel.user?.id;
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                const userBookings = await BookingService.getUserBookings(userId);
                setBookings(userBookings);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setIsLoading(false);
            }

        };
        fetchBookings();
    }, [authViewModel.user]);

    const upcomingBookings = bookings.filter(b => ['REQUESTED', 'CONFIRMED'].includes(b.status));
    const historyBookings = bookings.filter(b => ['CANCELLED', 'COMPLETED'].includes(b.status));

    // Helper Styles
    const containerStyle: React.CSSProperties = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        paddingBottom: '3rem'
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#111827', // Dark gray/black
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255,255,255,0.8)', // Add background
        padding: '0.5rem',
        borderRadius: '8px',
        backdropFilter: 'blur(4px)'
    };

    const emptyStateStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '3rem',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.5)',
        color: '#6b7280'
    };

    return (
        <div style={{ background: '#f3f4f6', minHeight: '100vh', position: 'relative' }}>
            <AnimatedBackground />

            <div style={containerStyle}>
                <div style={{ marginBottom: '2rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.7)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Mijn Ritten</h1>
                        <p style={{ color: '#374151', fontSize: '1.1rem', fontWeight: '500' }}>Beheer je aankomende en afgelopen reizen.</p>
                    </div>
                    <Link to="/request" className="btn-primary" style={{ textDecoration: 'none', background: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        + Nieuwe Rit
                    </Link>
                </div>

                {isLoading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#6b7280' }}>Ritten laden...</div>
                ) : (
                    <>
                        {/* Upcoming Section */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={sectionTitleStyle}>
                                📅 Aankomend <span style={{ fontSize: '0.9rem', background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '12px' }}>{upcomingBookings.length}</span>
                            </h2>
                            {upcomingBookings.length === 0 ? (
                                <div style={emptyStateStyle}>
                                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Je hebt nog geen ritten gepland.</p>
                                    <Link to="/request" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>Plan een rit →</Link>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                                    {upcomingBookings.map(b => (
                                        <div key={b.id}>
                                            <BookingCard booking={b} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* History Section */}
                        <section>
                            <h2 style={sectionTitleStyle}>
                                📜 Geschiedenis
                            </h2>
                            {historyBookings.length === 0 ? (
                                <div style={emptyStateStyle}>
                                    <p>Nog geen geschiedenis.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                                    {historyBookings.map(b => (
                                        <div key={b.id} style={{ opacity: 0.8 }}>
                                            <BookingCard booking={b} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
});
