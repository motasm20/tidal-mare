import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewmodels';
import { useNavigate, Link } from 'react-router-dom';
// @ts-ignore
import googleLogo from '../assets/google-logo.png';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '../components/Icons';

const authVM = authViewModel;

export const RegisterPage: React.FC = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        await authVM.register(email, password);
        if (authVM.isAuthenticated) {
            navigate('/dashboard');
        }
    };

    const handleGoogleLogin = async () => {
        await authVM.loginWithGoogle();
        if (authVM.isAuthenticated) navigate('/dashboard');
    };

    const handleGuestLogin = async () => {
        await authVM.loginAnonymously();
        if (authVM.isAuthenticated) navigate('/dashboard');
    };

    return (
        <div className="auth-background">
            <div className="auth-card">
                <h2 className="auth-title">Maak een account</h2>
                <p className="auth-subtitle">Begin vandaag nog met jouw duurzame reis</p>

                {authVM.error && <p className="error-message mb-4">{authVM.error}</p>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-group">
                            <EnvelopeIcon className="input-icon" />
                            <input
                                type="email"
                                className="form-input input-with-icon"
                                placeholder="naam@voorbeeld.nl"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Wachtwoord</label>
                        <div className="input-group">
                            <LockClosedIcon className="input-icon" />
                            <input
                                type="password"
                                className="form-input input-with-icon"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4" disabled={authVM.isLoading} style={{ width: '100%', padding: '12px' }}>
                        {authVM.isLoading ? 'Bezig met registreren...' : 'Registreren'}
                    </button>
                </form>

                <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#666' }}>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }}></span>
                    <span style={{ padding: '0 10px', fontSize: '0.9rem', color: '#94a3b8' }}>of registreer met</span>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }}></span>
                </div>

                <div className="social-login-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '1rem' }}>
                    <button
                        onClick={handleGoogleLogin}
                        className="social-btn-round"
                        title="Registreren met Google"
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <button
                        onClick={handleGuestLogin}
                        className="guest-text-link"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: '5px'
                        }}
                    >
                        Of ga door als gast
                    </button>
                </div>

                <div className="mt-4 text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
                    Heb je al een account? <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
                </div>
            </div>
        </div>
    );
});
