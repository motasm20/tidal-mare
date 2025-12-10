import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <header className="hero-section" style={{
                background: 'linear-gradient(135deg, var(--ocean-800) 0%, var(--primary-900) 100%)',
                color: 'white',
                border: 'none'
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
