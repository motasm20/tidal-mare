import React from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewmodels';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Modal } from '../components/Modal';

export const DeleteAccountPage: React.FC = observer(() => {
    const navigate = useNavigate();
    const { isLoading, error } = authViewModel;

    const handleDelete = async () => {
        if (window.confirm('Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
            try {
                await authViewModel.deleteAccount();
                navigate('/register');
                alert('Je account is verwijderd.');
            } catch (e) {
                // Error handled in VM / UI display
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', background: '#111827', padding: '2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatedBackground />

            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '3rem 2rem',
                maxWidth: '500px',
                width: '100%',
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚠️</div>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#dc2626', marginBottom: '1rem' }}>Account Verwijderen</h1>

                <p style={{ color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Je staat op het punt om je account permanent te verwijderen.
                    <br /><br />
                    <strong>Wat gebeurt er?</strong>
                    <ul style={{ textAlign: 'left', marginTop: '0.5rem', marginBottom: '1rem' }}>
                        <li>• Je profiel en privégegevens worden gewist.</li>
                        <li>• Je kunt niet meer inloggen.</li>
                        <li>• Je rithistorie wordt <span style={{ color: '#059669', fontWeight: 600 }}>geanonimiseerd bewaard</span> voor statistieken.</li>
                    </ul>
                </p>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoading ? 'Bezig met verwijderen...' : 'Ja, verwijder mijn account'}
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'transparent',
                            color: '#4b5563',
                            border: '1px solid #e5e7eb',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Annuleren, breng me terug
                    </button>
                </div>
            </div>
        </div>
    );
});
