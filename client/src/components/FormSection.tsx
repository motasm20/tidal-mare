import React from 'react';

interface FormSectionProps {
    title: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, icon, children }) => {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {icon && <span style={{ color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>{icon}</span>}
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>{title}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {children}
            </div>
        </div>
    );
};
