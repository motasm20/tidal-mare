import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import type { CarDTO, LocationDTO } from '../models';

import { CarMap } from '../components/Map/CarMap'; // Import CarMap
import { authViewModel } from '../viewmodels';
// @ts-ignore - Component exists but TS might not see it immediately in this environment

export const Dashboard: React.FC = observer(() => {
    const [cars, setCars] = useState<CarDTO[]>([]);
    const [loadingMap, setLoadingMap] = useState(true);
    const [mapCenter, setMapCenter] = useState<[number, number]>([51.4416, 5.4697]);

    // Filter State
    const [filterElectric, setFilterElectric] = useState(false);
    const [filterProvider, setFilterProvider] = useState('all');
    const [showCharging, setShowCharging] = useState(false);
    const [showParking, setShowParking] = useState(false);

    // Fetch cars for map
    useEffect(() => {
        const fetchCars = async (latitude: number, longitude: number, address: string = 'Huidige Locatie') => {
            try {
                if (latitude && longitude) {
                    setMapCenter([latitude, longitude]);
                }
                const location: LocationDTO = {
                    address: address,
                    latitude: latitude,
                    longitude: longitude
                };

                const response = await axios.post<CarDTO[]>('http://localhost:3000/api/matching/search', {
                    startLocation: location,
                    endLocation: location, // For now start=end for "search nearby"
                    passengers: 1,
                    luggageLevel: 0,
                    dateTime: new Date().toISOString()
                });
                setCars(response.data);
            } catch (error) {
                console.error('Failed to fetch cars for dashboard', error);
            } finally {
                setLoadingMap(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchCars(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("Geolocation permission denied or failed, falling back to Eindhoven:", error);
                    fetchCars(51.4416, 5.4697, 'Eindhoven (Fallback)');
                }
            );
        } else {
            // Browser doesn't support Geolocation
            fetchCars(51.4416, 5.4697, 'Eindhoven (Fallback)');
        }
    }, []);

    // Live map logic
    return (
        <div className="dashboard app-container">

            {/* Header with Actions */}
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Mijn Dashboard</h2>
                <div className="dashboard-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/request" className="btn-primary">
                        + Nieuwe Rit
                    </Link>
                    {authViewModel.user?.role !== 'guest' ? (
                        <Link to="/profile" className="logout-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                            Mijn Profiel
                        </Link>
                    ) : (
                        <Link to="/register" className="btn-primary" style={{ background: '#f59e0b', border: 'none' }}>
                            Account Aanmaken
                        </Link>
                    )}
                </div>
            </div>

            {/* Guest CTA */}
            {authViewModel.user?.role === 'guest' && (
                <div style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '24px',
                    padding: '2rem',
                    color: 'white',
                    marginBottom: '3rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(0,0,0,0) 70%)', transform: 'translate(30%, -30%)' }}></div>

                    <div style={{ flex: '1 1 400px', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'inline-block', background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem', border: '1px solid rgba(56,189,248,0.3)' }}>
                            Word lid van de community
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 1rem 0', lineHeight: 1.2 }}>
                            Begin met jouw impact
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px', margin: 0 }}>
                            Houd bij hoeveel CO₂ je bespaart, plant digitale bomen en krijg toegang tot exclusieve auto's.
                        </p>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem' }}>
                        <Link to="/register" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                            Account Aanmaken
                        </Link>
                    </div>
                </div>
            )}

            {/* Live Map Section */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0 }}>🗺️ Live Beschikbaarheid</h3>

                    {/* Filters & Actions */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                            <button
                                onClick={() => setFilterElectric(!filterElectric)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                                    borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer',
                                    background: filterElectric ? '#ecfdf5' : 'transparent',
                                    color: filterElectric ? '#059669' : '#64748b',
                                    border: 'none',
                                    transition: 'all 0.2s',
                                    fontWeight: filterElectric ? '600' : '500'
                                }}
                            >
                                ⚡ Elektrisch
                            </button>

                            <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

                            <select
                                value={filterProvider}
                                onChange={(e) => setFilterProvider(e.target.value)}
                                style={{
                                    padding: '6px 28px 6px 8px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer',
                                    background: 'transparent', color: '#64748b', border: 'none',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.6rem auto',
                                    outline: 'none'
                                }}
                            >
                                <option value="all">Alle aanbieders</option>
                                <option value="MYWHEELS">MyWheels</option>
                                <option value="GREENWHEELS">Greenwheels</option>
                                <option value="EINDHOVEN">Overige Aanbieders</option>
                            </select>

                            <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

                            <button
                                onClick={() => setShowCharging(!showCharging)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                                    borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer',
                                    background: showCharging ? '#eff6ff' : 'transparent',
                                    color: showCharging ? '#2563eb' : '#64748b',
                                    border: 'none',
                                    transition: 'all 0.2s',
                                    fontWeight: showCharging ? '600' : '500'
                                }}
                            >
                                🔌 Laadpalen
                            </button>
                            <button
                                onClick={() => setShowParking(!showParking)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                                    borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer',
                                    background: showParking ? '#f5f3ff' : 'transparent',
                                    color: showParking ? '#7c3aed' : '#64748b',
                                    border: 'none',
                                    transition: 'all 0.2s',
                                    fontWeight: showParking ? '600' : '500'
                                }}
                            >
                                🅿️ Parkeren
                            </button>
                        </div>
                        <Link
                            to="/request"
                            style={{
                                fontSize: '0.9rem',
                                color: '#0f172a',
                                fontWeight: '600',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '8px 16px',
                                borderRadius: '99px',
                                background: 'white',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                        >
                            Bekijk alle auto's <span style={{ fontSize: '1.1em', lineHeight: 1 }}>→</span>
                        </Link>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
                    {loadingMap ? (
                        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p>Kaart laden...</p>
                        </div>
                    ) : (
                        <CarMap
                            cars={cars.filter(car => {
                                if (filterElectric && car.fuelType !== 'EV') return false;
                                if (filterProvider !== 'all' && car.provider !== filterProvider) return false;
                                return true;
                            })}
                            center={mapCenter}
                            zoom={12}
                            showChargingStations={showCharging}
                            showParkingLots={showParking}
                        />
                    )}
                </div>
            </section>
        </div>
    );
});
