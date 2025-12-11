import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease'
        }}>
            <div style={{
                background: 'rgba(23, 23, 23, 0.9)', // Dark premium background
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '450px',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                transform: 'translateY(0)',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'white' }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af', padding: '0.5rem', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    >
                        ×
                    </button>
                </div>

                <div style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '2rem' }}>
                    {children}
                </div>

                {footer && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        {footer}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
