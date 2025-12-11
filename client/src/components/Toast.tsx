import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bg = type === 'success' ? '#10b981' : '#ef4444';

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: bg,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 2000,
            animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            fontWeight: '600'
        }}>
            <span>{type === 'success' ? '✅' : '⚠️'}</span>
            {message}
            <style>{`
                @keyframes toastSlideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
