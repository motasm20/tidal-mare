import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CarMap } from '../components/Map/CarMap';
import type { CarDTO, LocationDTO } from '../../../shared/types';
import '../App.css';

export const LandingPage: React.FC = () => {
    const [cars, setCars] = useState<CarDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                // Default criteria to search in Eindhoven area
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
                console.log('Fetched cars:', response.data.length);
                setCars(response.data);
            } catch (error: any) {
                console.error('Failed to fetch cars', error);
                setError(error.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    return (
        <div className="landing-page">
            <header className="hero-section" style={{
                background: 'linear-gradient(135deg, var(--ocean-800) 0%, var(--primary-900) 100%)',
                color: 'white',
                border: 'none',
                paddingBottom: '4rem'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 className="hero-title" style={{ color: 'white' }}>Elektrische mobiliteit<br />voor iedereen</h1>
                    <p className="hero-subtitle" style={{ color: 'var(--primary-100)' }}>
                        Slim boeken. Slim rijden. Zero emission. Ervaar de vrijheid van de toekomst.
                    </p>
                    <Link to="/request" className="cta-button">
                        Reis aanvragen <span>→</span>
                    </Link>
                </div>
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, var(--primary-500) 0%, transparent 70%)',
                    opacity: 0.1,
                    filter: 'blur(60px)',
                    zIndex: 1
                }} />
            </header>

            <section className="live-map-section" style={{ padding: '2rem', maxWidth: '1200px', margin: '-3rem auto 2rem auto', position: 'relative', zIndex: 3 }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--ocean-900)' }}>Live Beschikbaarheid in Eindhoven</h2>
                    {loading ? (
                        <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p>Zoeken naar auto's...</p>
                        </div>
                    ) : error ? (
                        <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red', flexDirection: 'column' }}>
                            <p>Error loading cars: {error}</p>
                            <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', background: 'var(--primary-600)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Retry</button>
                        </div>
                    ) : (
                        <CarMap cars={cars} center={[51.4416, 5.4697]} zoom={12} />
                    )}
                </div>
            </section>

            <section className="features-grid">
                <div className="feature-card">
                    <span className="feature-icon">🌿</span>
                    <h3 className="feature-title">Duurzaam reizen</h3>
                    <p className="feature-desc">100% elektrische vloot voor een schonere toekomst. Wij zorgen voor de planeet terwijl jij rijdt.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🚗</span>
                    <h3 className="feature-title">Flexibele beschikbaarheid</h3>
                    <p className="feature-desc">Boek direct een auto in jouw buurt, 24/7. Geen wachttijden, geen gedoe.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">⚡</span>
                    <h3 className="feature-title">Laadpunten onderweg</h3>
                    <p className="feature-desc">Slimme integratie met laadpalen op je route. Altijd opgeladen aankomen.</p>
                </div>
            </section>
        </div>
    );
};
