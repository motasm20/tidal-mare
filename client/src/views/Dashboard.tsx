import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import type { CarDTO, LocationDTO } from '../models';
import { SustainabilityStats } from '../components/SustainabilityStats';
import { CarMap } from '../components/Map/CarMap'; // Import CarMap
import { authViewModel } from '../viewmodels';
// @ts-ignore - Component exists but TS might not see it immediately in this environment

export const Dashboard: React.FC = observer(() => {
    const [cars, setCars] = useState<CarDTO[]>([]);
    const [loadingMap, setLoadingMap] = useState(true);

    // Filter State
    const [filterElectric, setFilterElectric] = useState(false);
    const [filterProvider, setFilterProvider] = useState('all');
    const [showCharging, setShowCharging] = useState(false);
    const [showParking, setShowParking] = useState(false);

    // Fetch cars for map
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const dummyLocation: LocationDTO = {
                    address: 'Eindhoven',
                    latitude: 51.4416,
                    longitude: 5.4697
                };

                const response = await axios.post<CarDTO[]>('http://localhost:3000/api/matching/search', {
                    startLocation: dummyLocation,
                    endLocation: dummyLocation,
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

        fetchCars();
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

            {/* Sustainability Stats or Guest CTA */}
            {authViewModel.user?.role !== 'guest' ? (
                <SustainabilityStats
                    co2Saved={authViewModel.sustainabilityStats.co2Saved}
                    treesPlanted={authViewModel.sustainabilityStats.treesPlanted}
                    distance={authViewModel.sustainabilityStats.distance}
                />
            ) : (
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
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                                onClick={() => setFilterElectric(!filterElectric)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px',
                                    borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                                    background: filterElectric ? '#d1fae5' : 'white',
                                    color: filterElectric ? '#065f46' : '#6b7280',
                                    border: filterElectric ? '1px solid #059669' : '1px solid #d1d5db'
                                }}
                            >
                                ⚡ Elektrisch
                            </button>
                            <select
                                value={filterProvider}
                                onChange={(e) => setFilterProvider(e.target.value)}
                                style={{
                                    padding: '4px 24px 4px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                                    background: 'white', color: '#6b7280', border: '1px solid #d1d5db',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center', backgroundSize: '0.6rem auto'
                                }}
                            >
                                <option value="all">Alle aanbieders</option>
                                <option value="MYWHEELS">MyWheels</option>
                                <option value="GREENWHEELS">Greenwheels</option>
                                <option value="EINDHOVEN">Overige (o.a. Iris)</option>
                            </select>
                            <button
                                onClick={() => setShowCharging(!showCharging)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px',
                                    borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                                    background: showCharging ? '#ecfdf5' : 'white',
                                    color: showCharging ? '#059669' : '#6b7280',
                                    border: showCharging ? '1px solid #10b981' : '1px solid #d1d5db'
                                }}
                            >
                                🔌 Laadpalen
                            </button>
                            <button
                                onClick={() => setShowParking(!showParking)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px',
                                    borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                                    background: showParking ? '#f3e8ff' : 'white', // light purple-100
                                    color: showParking ? '#7c3aed' : '#6b7280', // purple-600
                                    border: showParking ? '1px solid #8b5cf6' : '1px solid #d1d5db'
                                }}
                            >
                                🅿️ Parkeren
                            </button>
                        </div>
                        <Link to="/request" style={{ fontSize: '0.9rem', color: 'var(--primary-600)', fontWeight: '600', textDecoration: 'none' }}>
                            Bekijk alle auto's →
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
                            center={[51.4416, 5.4697]}
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
