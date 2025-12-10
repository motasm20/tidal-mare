import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import confetti from 'canvas-confetti';
import { BookingViewModel } from '../viewmodels/BookingViewModel';
import { authViewModel } from '../viewmodels';
import { AddressAutocomplete } from '../components/AddressAutocomplete';
import { MapPinIcon, UserIcon, HomeIcon, BriefcaseIcon } from '../components/Icons';
import { CarMap } from '../components/CarMap';
import { AnimatedBackground } from '../components/AnimatedBackground';

const bookingVM = new BookingViewModel();

export const RequestCarPage: React.FC = observer(() => {
    const { user } = authViewModel;
    const [isMapView, setIsMapView] = React.useState(true); // Default to Map View

    const playSuccessSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const oscillators = [
                { freq: 440, type: 'sine', delay: 0 },
                { freq: 554, type: 'sine', delay: 0.1 },
                { freq: 659, type: 'sine', delay: 0.2 },
                { freq: 880, type: 'sine', delay: 0.3 }
            ];

            oscillators.forEach(({ freq, type, delay }) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = type as any;
                osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

                gain.gain.setValueAtTime(0, ctx.currentTime + delay);
                gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + delay + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.5);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.6);
            });
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    // Trigger confetti and sound on success
    useEffect(() => {
        if (bookingVM.bookingStatus === 'CONFIRMED') {
            playSuccessSound();
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 7,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
                });
                confetti({
                    particleCount: 7,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [bookingVM.bookingStatus]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await bookingVM.searchCars();
    };

    const handleShortcut = (type: 'home' | 'work') => {
        if (type === 'home' && user?.homeLocation) {
            bookingVM.startStreet = user.homeLocation.address;
            bookingVM.isStartAddressValid = true;
        } else if (type === 'work' && user?.workLocation) {
            bookingVM.startStreet = user.workLocation.address;
            bookingVM.isStartAddressValid = true;
        }
    };

    // Helper Styles
    const containerStyle: React.CSSProperties = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 10
    };

    const cardStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.5)'
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
    };

    const mainGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
        gap: '2rem'
    };

    const headerStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '1.5rem 0',
        marginBottom: '2rem'
    };

    // Responsive helper
    const isMobile = window.innerWidth <= 768;

    return (
        <div style={{ minHeight: '100vh', position: 'relative', background: '#111827', paddingBottom: '3rem', overflowX: 'hidden' }}>
            <AnimatedBackground />

            {/* Header */}
            <div style={{ position: 'relative', zIndex: 20, ...headerStyle }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Tidal Mare</span>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', margin: '0.25rem 0 0.5rem 0' }}>
                            Waar wil je heen vandaag?
                        </h1>
                        <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>
                            Regel binnen enkele seconden een comfortabele rit.
                        </p>
                    </div>
                </div>
            </div>

            <div style={containerStyle}>
                <div style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '1.5rem' } : mainGridStyle}>

                    {/* Left Column: Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Start Location */}
                        <div style={cardStyle}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ background: 'var(--primary-100)', color: 'var(--primary-600)', padding: '6px', borderRadius: '8px', display: 'flex' }}><MapPinIcon className="w-5 h-5" /></span>
                                Startlocatie
                            </h2>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <button type="button" onClick={() => handleShortcut('home')} className="shortcut-chip">
                                    <HomeIcon className="w-4 h-4" /> Thuis
                                </button>
                                <button type="button" onClick={() => handleShortcut('work')} className="shortcut-chip">
                                    <BriefcaseIcon className="w-4 h-4" /> Werk
                                </button>
                            </div>

                            <div style={gridStyle}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <AddressAutocomplete
                                        label="Straat en Huisnummer"
                                        value={bookingVM.startStreet + (bookingVM.startHouseNumber ? ` ${bookingVM.startHouseNumber}` : '')}
                                        onChange={(val) => bookingVM.updateStartField('street', val)}
                                        onSelect={(s) => bookingVM.setStartAddress(s)}
                                        isValid={bookingVM.isStartAddressValid}
                                        hasError={bookingVM.showValidationErrors && !bookingVM.isStartAddressValid}
                                        placeholder="Zoek hier (bijv. Kalverstraat)..."
                                    />
                                </div>
                            </div>
                            <div style={{ ...gridStyle, marginTop: '1rem' }}>
                                <div>
                                    <label className="form-label">Postcode</label>
                                    <input type="text" className="form-input" readOnly value={bookingVM.startPostcode} onChange={e => bookingVM.updateStartField('postcode', e.target.value)} style={{ background: '#f9fafb', cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <label className="form-label">Plaats</label>
                                    <input type="text" className="form-input" readOnly value={bookingVM.startCity} onChange={e => bookingVM.updateStartField('city', e.target.value)} style={{ background: '#f9fafb', cursor: 'not-allowed' }} />
                                </div>
                            </div>
                        </div>

                        {/* End Location */}
                        <div style={cardStyle}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ background: '#fee2e2', color: '#dc2626', padding: '6px', borderRadius: '8px', display: 'flex' }}><MapPinIcon className="w-5 h-5" /></span>
                                Eindlocatie
                            </h2>
                            <div style={gridStyle}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <AddressAutocomplete
                                        label="Straat en Huisnummer"
                                        value={bookingVM.endStreet + (bookingVM.endHouseNumber ? ` ${bookingVM.endHouseNumber}` : '')}
                                        onChange={(val) => bookingVM.updateEndField('street', val)}
                                        onSelect={(s) => bookingVM.setEndAddress(s)}
                                        isValid={bookingVM.isEndAddressValid}
                                        hasError={bookingVM.showValidationErrors && !bookingVM.isEndAddressValid}
                                        placeholder="Waar gaat de reis naartoe?"
                                    />
                                </div>
                            </div>
                            <div style={{ ...gridStyle, marginTop: '1rem' }}>
                                <div>
                                    <label className="form-label">Postcode</label>
                                    <input type="text" className="form-input" readOnly value={bookingVM.endPostcode} onChange={e => bookingVM.updateEndField('postcode', e.target.value)} style={{ background: '#f9fafb', cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <label className="form-label">Plaats</label>
                                    <input type="text" className="form-input" readOnly value={bookingVM.endCity} onChange={e => bookingVM.updateEndField('city', e.target.value)} style={{ background: '#f9fafb', cursor: 'not-allowed' }} />
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div style={cardStyle}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px', borderRadius: '8px', display: 'flex' }}><UserIcon className="w-5 h-5" /></span>
                                Reisdetails
                            </h2>
                            <div style={gridStyle}>
                                <div>
                                    <label className="form-label">Passagiers</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="8"
                                        className="form-input"
                                        value={bookingVM.passengers}
                                        onChange={e => bookingVM.setPassengers(parseInt(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Bagage</label>
                                    <select
                                        className="form-input"
                                        value={bookingVM.luggageLevel}
                                        onChange={e => bookingVM.setLuggageLevel(parseInt(e.target.value))}
                                    >
                                        <option value="0">Geen bagage</option>
                                        <option value="1">Klein (handbagage)</option>
                                        <option value="2">Normaal</option>
                                        <option value="3">Veel bagage</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: '1.5rem' }}>
                                <label className="form-label">
                                    Opmerkingen (Optioneel)
                                </label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    style={{ resize: 'none' }}
                                    placeholder="Bijv. graag ophalen aan de achterzijde..."
                                    value={bookingVM.bookingNote}
                                    onChange={e => bookingVM.setBookingNote(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ ...cardStyle, position: 'sticky', top: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Samenvatting
                                <span className="status-badge status-requested">Rit info</span>
                            </h3>

                            <div style={{ position: 'relative', paddingLeft: '24px', marginBottom: '2rem' }}>
                                {/* Timeline Line */}
                                <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, #10b981, #e5e7eb, #ef4444)' }}></div>

                                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-24px', width: '16px', height: '16px', background: '#d1fae5', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px #10b981' }}>
                                        <div style={{ width: '6px', height: '6px', background: '#047857', borderRadius: '50%' }}></div>
                                    </div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)', fontWeight: '700' }}>Startlocatie</span>
                                    <span style={{ fontWeight: '500', display: 'block', color: bookingVM.startAddressSummary ? '#111827' : '#9ca3af', fontStyle: bookingVM.startAddressSummary ? 'normal' : 'italic' }}>
                                        {bookingVM.startAddressSummary || "Kies een startlocatie"}
                                    </span>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-24px', width: '16px', height: '16px', background: '#fee2e2', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px #ef4444' }}>
                                        <div style={{ width: '6px', height: '6px', background: '#b91c1c', borderRadius: '50%' }}></div>
                                    </div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)', fontWeight: '700' }}>Eindlocatie</span>
                                    <span style={{ fontWeight: '500', display: 'block', color: bookingVM.endAddressSummary ? '#111827' : '#9ca3af', fontStyle: bookingVM.endAddressSummary ? 'normal' : 'italic' }}>
                                        {bookingVM.endAddressSummary || "Kies een eindlocatie"}
                                    </span>
                                </div>
                            </div>

                            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #f3f4f6' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#6b7280' }}>Reizigers</span>
                                    <span style={{ fontWeight: '600', color: '#111827' }}>{bookingVM.passengers} personen</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#6b7280' }}>Bagage</span>
                                    <span style={{ fontWeight: '600', color: '#111827' }}>
                                        {['Geen', 'Klein', 'Normaal', 'Veel'][bookingVM.luggageLevel]}
                                    </span>
                                </div>
                            </div>

                            {bookingVM.error && (
                                <div className="error-message">
                                    <span style={{ marginRight: '8px' }}>⚠️</span>
                                    {bookingVM.error}
                                </div>
                            )}

                            <button
                                onClick={handleSearch}
                                disabled={bookingVM.isLoading}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {bookingVM.isLoading ? 'Zoeken...' : 'Zoek Beschikbare Auto\'s →'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {bookingVM.availableCars.length > 0 && (
                    <div style={{ marginTop: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white' }}>Beschikbare Auto's</h3>
                            <div style={{ display: 'flex', background: '#374151', padding: '4px', borderRadius: '12px' }}>
                                <button
                                    onClick={() => setIsMapView(false)}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '8px',
                                        background: !isMapView ? '#111827' : 'transparent',
                                        color: !isMapView ? 'white' : '#9ca3af',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    📋 Lijst
                                </button>
                                <button
                                    onClick={() => setIsMapView(true)}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '8px',
                                        background: isMapView ? '#111827' : 'transparent',
                                        color: isMapView ? 'white' : '#9ca3af',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    🗺️ Kaart
                                </button>
                            </div>
                        </div>

                        {isMapView ? (
                            <div className="fade-in">
                                <CarMap
                                    cars={bookingVM.availableCars}
                                    center={[52.3676, 4.9041]} // Mock center (Amsterdam) as we don't have accurate lat/lng in VM yet
                                    onSelectCar={(car) => {
                                        bookingVM.selectCar(car);
                                        bookingVM.confirmBooking();
                                    }}
                                />
                                <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.85rem', textAlign: 'center' }}>
                                    * Locaties zijn bij benadering weergegeven.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                                {bookingVM.availableCars.map(car => (
                                    <div key={car.id} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                                        <div style={{ height: '180px', background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ fontSize: '4rem', opacity: 0.8 }}>🚙</div>
                                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>
                                                {car.seats} stoelen
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>{car.make} {car.model}</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                                <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563' }}>{car.fuelType}</span>
                                                <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563' }}>Automaat</span>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: '700', marginBottom: '2px' }}>Prijs indicatie</div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>€{car.pricePerHourEstimate}<span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '400' }}>/u</span></div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        bookingVM.selectCar(car);
                                                        bookingVM.confirmBooking();
                                                    }}
                                                    className="btn-primary"
                                                    style={{ background: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}
                                                >
                                                    Boek Nu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <style>{`
                            .fade-in { animation: fadeIn 0.5s ease-out forwards; }
                            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                        `}</style>
                    </div>
                )}

                {/* Confirmation Modal */}
                {bookingVM.bookingStatus === 'CONFIRMED' && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <div style={{ width: '64px', height: '64px', background: '#d1fae5', color: '#047857', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>✓</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Boeking Bevestigd!</h3>
                            <p style={{ color: '#4b5563', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Je rit is succesvol ingepland. We hebben een bevestiging naar je mail gestuurd.
                            </p>
                            <button onClick={() => bookingVM.clearForm()} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                Terug naar overzicht
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
