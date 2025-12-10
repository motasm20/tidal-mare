import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, Link } from 'react-router-dom';
import { BookingViewModel } from '../viewmodels/BookingViewModel';
import { SmartKey } from '../components/SmartKey';

// Use a singleton or context in real app, creating here for simplicity/mvp per existing pattern
const vm = new BookingViewModel();

export const BookingDetailsPage: React.FC = observer(() => {
    const { id } = useParams<{ id: string }>();
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    useEffect(() => {
        if (id) {
            vm.loadBookingDetails(id);
        }
    }, [id]);

    const handleCancel = async () => {
        if (id) {
            await vm.cancelBooking(id, cancelReason);
            setShowCancelDialog(false);
        }
    };

    if (vm.isLoading && !vm.selectedBookingDetails) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Laden...</div>;
    }

    if (vm.error) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>Error: {vm.error}</div>;
    }

    const booking = vm.selectedBookingDetails;
    if (!booking) return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Geen boeking gevonden.</div>;

    const canCancel = booking.status === 'REQUESTED' || booking.status === 'CONFIRMED';

    // Status color helper
    const getStatusStyle = (s: string) => {
        switch (s) {
            case 'CONFIRMED': return { color: '#059669', background: '#d1fae5' };
            case 'CANCELLED': return { color: '#dc2626', background: '#fee2e2' };
            case 'COMPLETED': return { color: '#374151', background: '#f3f4f6' };
            default: return { color: '#2563eb', background: '#dbeafe' }; // REQUESTED
        }
    };

    const statusStyle = getStatusStyle(booking.status);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', background: '#f9fafb', transition: 'background 0.2s', fontWeight: '500' }}>
                    ← Terug naar Dashboard
                </Link>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                {/* Header */}
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Boeking #{booking.id.substring(0, 8)}</h2>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            Aangemaakt op {new Date(booking.createdAt).toLocaleDateString()} om {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.025em', ...statusStyle }}>
                        {booking.status}
                    </div>
                </div>

                <div style={{ padding: '2rem' }}>
                    {/* Status Alert for Cancelled */}
                    {booking.status === 'CANCELLED' && (
                        <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '1rem', marginBottom: '2rem', borderRadius: '0 8px 8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ fontSize: '1.25rem' }}>❌</span>
                                <div>
                                    <h4 style={{ fontWeight: '700', color: '#7f1d1d', margin: 0 }}>Deze rit is geannuleerd</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#b91c1c', marginTop: '0.25rem' }}>
                                        Datum: {booking.cancelledAt ? new Date(booking.cancelledAt).toLocaleString() : '-'}
                                        {booking.cancellationReason && <span style={{ display: 'block', marginTop: '0.25rem', fontStyle: 'italic' }}>"{booking.cancellationReason}"</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Route Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <span>🗺️</span> Route
                            </h3>
                            <div style={{ position: 'relative', paddingLeft: '1.5rem', marginLeft: '0.5rem', borderLeft: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-29px', top: '0.25rem', width: '1rem', height: '1rem', borderRadius: '50%', background: '#3b82f6', border: '2px solid white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Vertrek</span>
                                    <p style={{ fontWeight: '500', color: '#111827', fontSize: '1.125rem', lineHeight: '1.25', margin: 0 }}>{booking.startLocation.address}</p>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-29px', top: '0.25rem', width: '1rem', height: '1rem', borderRadius: '50%', background: '#111827', border: '2px solid white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Aankomst</span>
                                    <p style={{ fontWeight: '500', color: '#111827', fontSize: '1.125rem', lineHeight: '1.25', margin: 0 }}>{booking.endLocation.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Car & Time Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <span>🚗</span> Details
                            </h3>

                            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Voertuig</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ fontSize: '1.5rem' }}>🚙</div>
                                        <div>
                                            <p style={{ fontWeight: '700', color: '#111827', margin: 0 }}>{booking.car?.make} {booking.car?.model}</p>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{booking.car?.provider}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Tijdstip</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ fontSize: '1.5rem' }}>📅</div>
                                        <div>
                                            <p style={{ fontWeight: '700', color: '#111827', margin: 0 }}>{new Date(booking.startTime).toLocaleDateString()}</p>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Smart Key Section (Only if CONFIRMED) */}
                {booking.status === 'CONFIRMED' && (
                    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #f3f4f6' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>Jouw Digitale Sleutel</h3>
                        <div style={{ maxWidth: '360px', margin: '0 auto' }}>
                            <SmartKey
                                carName={`${booking.car?.make} ${booking.car?.model}`}
                                licensePlate="T-123-XY"
                                onUnlock={() => console.log('Unlocked from details!')}
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                {canCancel && (
                    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setShowCancelDialog(true)}
                            style={{
                                padding: '0.625rem 1.5rem',
                                background: 'white',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                fontWeight: '500',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            🚫 Rit Annuleren
                        </button>
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {showCancelDialog && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '28rem', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '3rem', width: '3rem', borderRadius: '50%', background: '#fee2e2' }}>
                                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0 }}>Weet je het zeker?</h3>
                            <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.9rem' }}>Je staat op het punt deze rit te annuleren. Dit kan niet ongedaan worden gemaakt.</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Reden van annulering (optioneel)</label>
                            <input
                                type="text"
                                style={{ width: '100%', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
                                placeholder="Bijv. Plannen gewijzigd..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowCancelDialog(false)}
                                style={{ flex: 1, padding: '0.625rem 1rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontWeight: '500', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Terug
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={vm.isCancelling}
                                style={{ flex: 1, padding: '0.625rem 1rem', background: '#dc2626', color: 'white', fontWeight: '700', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)' }}
                            >
                                {vm.isCancelling ? 'Bezig...' : 'Bevestig'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
