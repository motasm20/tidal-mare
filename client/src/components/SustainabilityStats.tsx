import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

interface StatsProps {
    co2Saved: number;
    treesPlanted: number;
    distance: number;
}

const AnimatedCounter: React.FC<{ value: number, duration?: number }> = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const startValue = 0;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Smoother easing

            setCount(Math.floor(easeOutQuart * (value - startValue) + startValue));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return <span>{count}</span>;
}

export const SustainabilityStats: React.FC<StatsProps> = observer(({ co2Saved, treesPlanted, distance }) => {

    // Gradient text style
    const gradientText = {
        background: 'linear-gradient(135deg, #4ade80 0%, #059669 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    return (
        <div className="sustainability-stats" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
            marginTop: '1rem'
        }}>
            {/* Stat 1: CO2 */}
            <div className="stat-card" style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☁️</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1, ...gradientText }}>
                    <AnimatedCounter value={co2Saved} /> <span style={{ fontSize: '1rem', verticalAlign: 'middle' }}>kg</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600', marginTop: '0.5rem' }}>
                    CO2 Bespaard
                </div>
            </div>

            {/* Stat 2: Trees */}
            <div className="stat-card" style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌳</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1, ...gradientText }}>
                    <AnimatedCounter value={treesPlanted} />
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600', marginTop: '0.5rem' }}>
                    Bomen Equivalent
                </div>
            </div>

            {/* Stat 3: Distance */}
            <div className="stat-card" style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1, ...gradientText }}>
                    <AnimatedCounter value={distance} /> <span style={{ fontSize: '1rem', verticalAlign: 'middle' }}>km</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600', marginTop: '0.5rem' }}>
                    Emissievrij Gereden
                </div>
            </div>

            {/* Responsive Fix: Stack on mobile */}
            <style>{`
                @media (max-width: 768px) {
                    .sustainability-stats {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
});
