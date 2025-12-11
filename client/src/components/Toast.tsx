import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    onClose: () => void;
}

const CheckIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ErrorIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(onClose, 400); // Wait for exit animation
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    // Premium styling config
    const styles = type === 'success' ? {
        gradient: 'linear-gradient(135deg, #059669, #10b981)',
        shadow: '0 0 20px rgba(16, 185, 129, 0.3)',
        iconColor: '#10b981'
    } : {
        gradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
        shadow: '0 0 20px rgba(239, 68, 68, 0.3)',
        iconColor: '#ef4444'
    };

    return (
        <div
            className={isLeaving ? 'toast-exit' : 'toast-enter'}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                background: 'rgba(23, 23, 23, 0.85)', // Dark premium background
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                boxShadow: `0 10px 30px -5px rgba(0,0,0,0.5), ${styles.shadow}`,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                zIndex: 9999,
                color: 'white',
                minWidth: '320px',
                maxWidth: '400px',
                overflow: 'hidden'
            }}
        >
            {/* Status Icon with Glow */}
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: styles.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <div style={{ color: 'white' }}>
                    {type === 'success' ? <CheckIcon /> : <ErrorIcon />}
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '2px' }}>
                    {type === 'success' ? 'Succesvol' : 'Foutmelding'}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: '500' }}>
                    {message}
                </div>
            </div>

            {/* Close button */}
            <button
                onClick={() => { setIsLeaving(true); setTimeout(onClose, 400); }}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    display: 'flex',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Animated Progress Bar */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: styles.gradient,
                width: '100%',
                animation: 'progress 3s linear forwards',
                transformOrigin: 'left'
            }} />

            <style>{`
                .toast-enter {
                    animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .toast-exit {
                    animation: slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slideUpFade {
                    from { transform: translateY(20px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes slideDownFade {
                    from { transform: translateY(0) scale(1); opacity: 1; }
                    to { transform: translateY(10px) scale(0.95); opacity: 0; }
                }
                @keyframes progress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
};
