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

            {/* Guest Banner */}
            {authViewModel.user?.role === 'guest' && (
                <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fcd34d',
                    color: '#92400e',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>👋</span>
                    <div>
                        <strong>Welkom als gast!</strong>
                        <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>
                            Je kunt rondkijken en ritten zoeken, maar om daadwerkelijk te boeken moet je een account aanmaken.
                        </p>
                    </div>
                </div>
            )}

            {/* Sustainability Stats */}
            <SustainabilityStats
                co2Saved={authViewModel.sustainabilityStats.co2Saved}
                treesPlanted={authViewModel.sustainabilityStats.treesPlanted}
                distance={authViewModel.sustainabilityStats.distance}
            />

            {/* Live Map Section */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>🗺️ Live Beschikbaarheid</h3>
                    <Link to="/request" style={{ fontSize: '0.9rem', color: 'var(--primary-600)', fontWeight: '600', textDecoration: 'none' }}>
                        Bekijk alle auto's →
                    </Link>
                </div>

                <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
                    {loadingMap ? (
                        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p>Kaart laden...</p>
                        </div>
                    ) : (
                        <CarMap cars={cars} center={[51.4416, 5.4697]} zoom={12} />
                    )}
                </div>
            </section>
        </div>
    );
});
