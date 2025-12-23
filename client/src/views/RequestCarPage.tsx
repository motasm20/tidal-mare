import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { BookingViewModel } from '../viewmodels/BookingViewModel';
import { authViewModel } from '../viewmodels';
import { AddressAutocomplete } from '../components/AddressAutocomplete';
import { MapPinIcon, UserIcon, HomeIcon, BriefcaseIcon } from '../components/Icons';
import { CarMap } from '../components/CarMap';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { ProviderType } from '../../../shared/types';

const bookingVM = new BookingViewModel();

export const RequestCarPage: React.FC = observer(() => {
    const { user } = authViewModel;
    const navigate = useNavigate();
    const [isMapView, setIsMapView] = React.useState(false); // Default to List View for better UX initially? Or Map? Let's keep Map as requested but toggleable. Actually User said "in de map wil ik", implying map is primary.
    // User task says "improve booking page".
    // I'll stick to isMapView state but change the toggle UI.

    const [showGuestModal, setShowGuestModal] = React.useState(false);
    const [showSuccessToast, setShowSuccessToast] = React.useState(false);

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
        if (bookingVM.bookingStatus === 'CONFIRMED' || bookingVM.bookingStatus === 'REQUESTED') {
            playSuccessSound();
            const duration = 3000;
            const end = Date.now() + duration;

            // Show Toast
            setShowSuccessToast(true);

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

    const handleShortcut = (type: 'home' | 'work', target: 'start' | 'end' = 'start') => {
        const location = type === 'home' ? user?.homeLocation : user?.workLocation;

        if (location) {
            if (target === 'start') {
                bookingVM.startStreet = location.address;
                bookingVM.isStartAddressValid = true;
            } else {
                bookingVM.endStreet = location.address;
                bookingVM.isEndAddressValid = true;
            }
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                // Ideally reverse geocode, but for now explicitly set coordinates
                bookingVM.startLat = latitude;
                bookingVM.startLng = longitude;
                bookingVM.startStreet = "Huidige Locatie";
                bookingVM.isStartAddressValid = true;
            }, (err) => {
                console.error(err);
                alert("Kon huidige locatie niet ophalen. Controleer je browser instellingen.");
            });
        }
    };

    const handleSwapAddresses = () => {
        const startState = {
            street: bookingVM.startStreet,
            number: bookingVM.startHouseNumber,
            postcode: bookingVM.startPostcode,
            city: bookingVM.startCity,
            lat: bookingVM.startLat,
            lng: bookingVM.startLng,
            valid: bookingVM.isStartAddressValid
        };

        bookingVM.startStreet = bookingVM.endStreet;
        bookingVM.startHouseNumber = bookingVM.endHouseNumber;
        bookingVM.startPostcode = bookingVM.endPostcode;
        bookingVM.startCity = bookingVM.endCity;
        bookingVM.startLat = bookingVM.endLat;
        bookingVM.startLng = bookingVM.endLng;
        bookingVM.isStartAddressValid = bookingVM.isEndAddressValid;

        bookingVM.endStreet = startState.street;
        bookingVM.endHouseNumber = startState.number;
        bookingVM.endPostcode = startState.postcode;
        bookingVM.endCity = startState.city;
        bookingVM.endLat = startState.lat;
        bookingVM.endLng = startState.lng;
        bookingVM.isEndAddressValid = startState.valid;
    };

    // Responsive helper
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleConfirmBooking = () => {
        if (user?.role === 'guest') {
            setShowGuestModal(true);
            return;
        }
        bookingVM.confirmBooking();
    };

    // Helper Styles
    const containerStyle: React.CSSProperties = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: isMobile ? '1rem 0.5rem' : '2rem 1rem',
        position: 'relative',
        zIndex: 10
    };

    const cardStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: isMobile ? '1.25rem' : '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.5)'
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '1rem' : '2rem'
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
        padding: isMobile ? '1rem 0' : '1.5rem 0',
        marginBottom: isMobile ? '1rem' : '2rem'
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', background: '#f3f4f6', paddingBottom: '3rem', overflowX: 'hidden' }}>
            <AnimatedBackground />

            {/* Header */}
            <div style={{ position: 'relative', zIndex: 20, ...headerStyle }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Tidal Mare</span>
                        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '800', color: '#111827', margin: '0.25rem 0 0.5rem 0' }}>
                            Waar wil je heen vandaag?
                        </h1>
                        <p style={{ color: '#4b5563', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>
                            Regel binnen enkele seconden een comfortabele rit.
                        </p>
                    </div>
                </div>
            </div>

            <div style={containerStyle}>
                <div style={isMobile ? { display: 'flex', flexDirection: 'column', gap: '1.5rem' } : mainGridStyle}>

                    {/* Left Column: Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Combined Location Card */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                    <span style={{ background: 'var(--primary-100)', color: 'var(--primary-600)', padding: '6px', borderRadius: '8px', display: 'flex' }}><MapPinIcon className="w-5 h-5" /></span>
                                    Jouw Reis
                                </h2>
                            </div>

                            <div style={{ position: 'relative' }}>
                                {/* Vertical connecting line */}
                                <div style={{ position: 'absolute', left: '20px', top: '45px', bottom: '45px', width: '2px', background: 'linear-gradient(to bottom, #d1fae5, #e5e7eb, #fee2e2)', zIndex: 0 }}></div>

                                {/* Start Location Input */}
                                <div style={{ marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', paddingLeft: '4px' }}>Ophalen</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ marginTop: '12px', color: '#10b981' }}>●</div>
                                        <div style={{ flex: 1 }}>
                                            <AddressAutocomplete
                                                label=""
                                                value={bookingVM.startStreet + (bookingVM.startHouseNumber ? ` ${bookingVM.startHouseNumber}` : '')}
                                                onChange={(val) => bookingVM.updateStartField('street', val)}
                                                onSelect={(s) => bookingVM.setStartAddress(s)}
                                                isValid={bookingVM.isStartAddressValid}
                                                hasError={bookingVM.showValidationErrors && !bookingVM.isStartAddressValid}
                                                placeholder="Startlocatie..."
                                            />
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                <button type="button" onClick={handleCurrentLocation} className="shortcut-chip" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                                    📍 Huidige Locatie
                                                </button>
                                                <button type="button" onClick={() => handleShortcut('home', 'start')} className="shortcut-chip" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                                    <HomeIcon className="w-3 h-3" /> Thuis
                                                </button>
                                                <button type="button" onClick={() => handleShortcut('work', 'start')} className="shortcut-chip" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                                    <BriefcaseIcon className="w-3 h-3" /> Werk
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Swap Button (Centered) */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '1rem', marginTop: '-10px', marginBottom: '-10px', position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
                                    <button
                                        onClick={handleSwapAddresses}
                                        style={{
                                            background: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s',
                                            transform: 'rotate(90deg)',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                            pointerEvents: 'auto'
                                        }}
                                        title="Wissel Locaties"
                                    >
                                        🔄
                                    </button>
                                </div>

                                {/* End Location Input */}
                                <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', paddingLeft: '4px' }}>Bestemming</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ marginTop: '12px', color: '#ef4444' }}>●</div>
                                        <div style={{ flex: 1 }}>
                                            <AddressAutocomplete
                                                label=""
                                                value={bookingVM.endStreet + (bookingVM.endHouseNumber ? ` ${bookingVM.endHouseNumber}` : '')}
                                                onChange={(val) => bookingVM.updateEndField('street', val)}
                                                onSelect={(s) => bookingVM.setEndAddress(s)}
                                                isValid={bookingVM.isEndAddressValid}
                                                hasError={bookingVM.showValidationErrors && !bookingVM.isEndAddressValid}
                                                placeholder="Waar wil je heen?"
                                            />
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                <button type="button" onClick={() => handleShortcut('home', 'end')} className="shortcut-chip" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                                    <HomeIcon className="w-3 h-3" /> Naar Thuis
                                                </button>
                                                <button type="button" onClick={() => handleShortcut('work', 'end')} className="shortcut-chip" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                                    <BriefcaseIcon className="w-3 h-3" /> Naar Werk
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Collapsible/Hidden Details for Postcode/City to keep UI clean */}
                            {/* We keep them in state but visually hide them or treat them as auto-filled */}
                        </div>

                        {/* Details Card */}
                        <div style={cardStyle}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px', borderRadius: '8px', display: 'flex' }}><UserIcon className="w-5 h-5" /></span>
                                Voorkeuren
                            </h2>

                            <div style={gridStyle}>
                                <div>
                                    <label className="form-label">Datum & Tijd</label>
                                    <input
                                        type="datetime-local"
                                        className="form-input"
                                        value={bookingVM.dateTime ? bookingVM.dateTime.slice(0, 16) : ''}
                                        onChange={(e) => bookingVM.dateTime = new Date(e.target.value).toISOString()}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Passagiers</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
                                        <button
                                            onClick={() => bookingVM.setPassengers(Math.max(1, bookingVM.passengers - 1))}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: 'white',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.2rem',
                                                color: '#374151'
                                            }}
                                        >−</button>
                                        <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center', fontSize: '1rem', color: '#111827' }}>{bookingVM.passengers}</span>
                                        <button
                                            onClick={() => bookingVM.setPassengers(Math.min(8, bookingVM.passengers + 1))}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: 'white',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.2rem',
                                                color: '#374151'
                                            }}
                                        >+</button>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                                <label className="form-label">Extra's</label>
                                <select
                                    className="form-input"
                                    value={bookingVM.luggageLevel}
                                    onChange={e => bookingVM.setLuggageLevel(parseInt(e.target.value))}
                                >
                                    <option value="0">Geen bagage</option>
                                    <option value="1">Klein (handbagage)</option>
                                    <option value="2">Normaal (koffer)</option>
                                    <option value="3">Veel bagage</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary & Search Button */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ ...cardStyle, position: 'sticky', top: '24px', border: '1px solid transparent', background: 'linear-gradient(to bottom right, #ffffff, #f9fafb)' }}>


                            {bookingVM.error && (
                                <div className="error-message" style={{ marginBottom: '1rem' }}>
                                    <span style={{ marginRight: '8px' }}>⚠️</span>
                                    {bookingVM.error}
                                </div>
                            )}

                            <button
                                onClick={handleSearch}
                                disabled={bookingVM.isLoading}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem', background: '#111827' }}
                            >
                                {bookingVM.isLoading ? 'Zoeken...' : 'Zoek Auto\'s ➜'}
                            </button>

                            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                                Wij zoeken direct bij alle aanbieders in de buurt.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {bookingVM.availableCars.length > 0 && (
                    <div style={{ marginTop: '3rem' }} id="results-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1f2937' }}>
                                    {bookingVM.availableCars.length} Auto's gevonden
                                </h3>
                                <p style={{ color: '#6b7280' }}>Kies de beste rit voor jou.</p>
                            </div>

                            {/* Segmented Control */}
                            <div style={{ background: '#e5e7eb', padding: '4px', borderRadius: '12px', display: 'flex' }}>
                                <button
                                    onClick={() => setIsMapView(false)}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '8px',
                                        background: !isMapView ? 'white' : 'transparent',
                                        color: !isMapView ? '#111827' : '#6b7280',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        boxShadow: !isMapView ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Lijst
                                </button>
                                <button
                                    onClick={() => setIsMapView(true)}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '8px',
                                        background: isMapView ? 'white' : 'transparent',
                                        color: isMapView ? '#111827' : '#6b7280',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        boxShadow: isMapView ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Kaart
                                </button>
                            </div>
                        </div>

                        {isMapView ? (
                            <div className="fade-in" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                <CarMap
                                    cars={bookingVM.availableCars}
                                    center={
                                        (bookingVM.startLat && bookingVM.startLng)
                                            ? [bookingVM.startLat, bookingVM.startLng]
                                            : [51.4416, 5.4697]
                                    }
                                    onSelectCar={(car) => {
                                        bookingVM.selectCar(car);
                                        handleConfirmBooking();
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                                {bookingVM.availableCars.map(car => {
                                    // Determine styling based on provider
                                    let accentColor = '#6b7280';
                                    let providerName: string = car.provider;

                                    if (car.provider === ProviderType.MYWHEELS || car.make.toLowerCase().includes('mywheels')) {
                                        accentColor = '#116284';
                                        providerName = 'MyWheels';
                                    } else if (car.provider === ProviderType.GREENWHEELS || car.make.toLowerCase().includes('greenwheels')) {
                                        accentColor = '#106F62';
                                        providerName = 'Greenwheels';
                                    } else if (car.provider === ProviderType.EINDHOVEN) {
                                        accentColor = '#ef4444';
                                        // Try to extract provider from make if possible
                                        providerName = car.make || 'Deelauto';
                                    }

                                    return (
                                        <div key={car.id} style={{
                                            background: 'white',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                            border: '1px solid #f3f4f6',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            cursor: 'pointer'
                                        }}
                                            className="car-card-hover"
                                            onClick={() => {
                                                bookingVM.selectCar(car);
                                                handleConfirmBooking();
                                            }}
                                        >
                                            <div style={{ height: '160px', background: `linear-gradient(135deg, ${accentColor}11, ${accentColor}33)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {/* Provider Badge */}
                                                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: accentColor, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }}></span>
                                                    {providerName}
                                                </div>

                                                <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>🚙</div>

                                                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                    {car.seats} personen
                                                </div>
                                            </div>

                                            <div style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>{car.model}</h4>
                                                    <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', color: '#4b5563' }}>{car.fuelType}</span>
                                                </div>
                                                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                                    {car.location?.address || 'Locatie onbekend'}
                                                    {car.range ? ` • ${car.range} km bereik` : ''}
                                                </p>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                                    <div>
                                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>Geschat tarief</span>
                                                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>€{car.pricePerHourEstimate}<small style={{ fontSize: '0.9rem', fontWeight: '400', color: '#6b7280' }}>/uur</small></span>
                                                    </div>
                                                    <button className="btn-primary" style={{ background: accentColor, boxShadow: `0 4px 10px ${accentColor}44` }}>
                                                        Boeken
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <style>{`
                            .fade-in { animation: fadeIn 0.5s ease-out forwards; }
                            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                            .car-card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1) !important; }
                        `}</style>
                    </div>
                )}

                {/* Guest Modal */}
                <Modal
                    isOpen={showGuestModal}
                    onClose={() => setShowGuestModal(false)}
                    title="Account vereist"
                    footer={
                        <>
                            <button
                                onClick={() => setShowGuestModal(false)}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: '600', cursor: 'pointer', color: 'white', transition: 'background 0.2s' }}
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="btn-primary"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                Registreren
                            </button>
                        </>
                    }
                >
                    <p>Als gast kun je niet boeken. Wil je een account aanmaken om verder te gaan?</p>
                </Modal>

                {/* Success Toast */}
                {showSuccessToast && (
                    <Toast
                        message="Je rit is succesvol ingepland! Bevestiging verstuurd."
                        type="success"
                        onClose={() => {
                            setShowSuccessToast(false);
                            bookingVM.clearForm();
                        }}
                    />
                )}
            </div>
        </div>
    );
});
