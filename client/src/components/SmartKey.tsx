import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

interface SmartKeyProps {
    carName: string;
    licensePlate?: string;
    onUnlock: () => void;
}

export const SmartKey: React.FC<SmartKeyProps> = observer(({ carName, licensePlate, onUnlock }) => {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [unlocked, setUnlocked] = useState(false);
    const requestRef = useRef<number | null>(null);

    // Animation Speed (Slightly faster for premium feel)
    const FILL_SPEED = 2.5;

    useEffect(() => {
        const animate = () => {
            if (isHolding && !unlocked) {
                setProgress(prev => {
                    const next = prev + FILL_SPEED;
                    if (next >= 100) {
                        setUnlocked(true);
                        setIsHolding(false);
                        onUnlock();
                        return 100;
                    }
                    return next;
                });
                requestRef.current = requestAnimationFrame(animate);
            } else if (!isHolding && !unlocked && progress > 0) {
                // Rapid decay for snappy feel
                setProgress(prev => Math.max(0, prev - (FILL_SPEED * 3)));
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
        };
    }, [isHolding, unlocked, progress, onUnlock]);

    const handleStart = () => {
        if (!unlocked) setIsHolding(true);
    };

    const handleEnd = () => {
        setIsHolding(false);
    };

    return (
        <div className="smart-key-container" style={{
            background: '#111827', // Matte black/dark gray
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #1f2937',
            userSelect: 'none'
        }}>
            {/* Lock Button (Top Right corner) */}
            {unlocked && (
                <div
                    onClick={() => { setUnlocked(false); setProgress(0); }}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#374151',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                    }}
                    title="Vergrendelen"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
            )}

            {/* Header Info */}
            <div style={{ marginBottom: '2.5rem', opacity: unlocked ? 0.5 : 1, transition: 'opacity 0.5s' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '500', margin: 0, color: '#e5e7eb', letterSpacing: '0.025em' }}>{carName}</h3>
                {licensePlate && (
                    <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        background: '#1f2937',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontFamily: 'monospace',
                        letterSpacing: '1px'
                    }}>
                        {licensePlate}
                    </div>
                )}
            </div>

            {/* The Interaction Button */}
            <div
                onMouseDown={handleStart}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchEnd={handleEnd}
                style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background: unlocked ? 'rgba(16, 185, 129, 0.1)' : 'linear-gradient(145deg, #1f2937, #111827)',
                    boxShadow: unlocked
                        ? '0 0 30px rgba(16, 185, 129, 0.2)'
                        : (isHolding ? 'inset 0 4px 10px rgba(0,0,0,0.5)' : '5px 5px 15px #0b0f19, -5px -5px 15px #273549'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: unlocked ? 'default' : 'pointer',
                    position: 'relative',
                    transform: isHolding ? 'scale(0.96)' : 'scale(1)',
                    transition: 'all 0.2s ease-out',
                    border: '1px solid #374151',
                    marginBottom: '2rem'
                }}
            >
                {/* Progress Ring */}
                <svg width="140" height="140" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)', pointerEvents: 'none' }}>
                    {/* Track */}
                    <circle cx="70" cy="70" r="68" stroke="#374151" strokeWidth="2" fill="transparent" />
                    {/* Progress */}
                    <circle
                        cx="70"
                        cy="70"
                        r="68"
                        stroke={unlocked ? '#10b981' : '#3b82f6'} // Green if unlocked, Blue active
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={427}
                        strokeDashoffset={427 - (427 * progress) / 100}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0s linear, opacity 0.3s' }}
                        opacity={isHolding || unlocked ? 1 : 0}
                    />
                </svg>

                {/* Center Icon */}
                <div style={{ color: unlocked ? '#10b981' : (isHolding ? '#60a5fa' : '#9ca3af'), transition: 'color 0.3s' }}>
                    {unlocked ? (
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            <path d="M7 7h10"></path>
                            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                        </svg>
                    ) : (
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    )}
                </div>
            </div>

            {/* Status Text */}
            <div style={{ minHeight: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{
                    fontSize: '0.875rem',
                    color: unlocked ? '#10b981' : (isHolding ? '#e5e7eb' : '#6b7280'),
                    fontWeight: '600',
                    margin: 0,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    transition: 'color 0.3s'
                }}>
                    {unlocked ? 'Auto is open' : (isHolding ? 'Authenticeren...' : 'Houd vast om te openen')}
                </p>
                {unlocked && (
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.5rem 0 0 0', animation: 'fadeIn 0.5s' }}>
                        Verbinding stabiel • Gereed voor start
                    </p>
                )}
            </div>
        </div>
    );
});
