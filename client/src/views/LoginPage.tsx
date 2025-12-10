import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewmodels';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '../components/Icons';

const authVM = authViewModel;

export const LoginPage: React.FC = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetMode, setResetMode] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await authVM.login(email, password);
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

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authVM.resetPassword(resetEmail);
            setResetMessage("Check je email voor instructies om je wachtwoord te resetten.");
        } catch (e: any) {
            // Error handled in VM
        }
    };

    if (resetMode) {
        return (
            <div className="auth-background">
                <div className="auth-card">
                    <h2 className="auth-title">Wachtwoord Resetten</h2>
                    <p className="auth-subtitle">Vul je email in om een reset link te ontvangen.</p>
                    {authVM.error && <p className="error-message mb-4">{authVM.error}</p>}
                    {resetMessage && <p className="success-message mb-4" style={{ color: 'green', background: '#e6fffa', padding: '10px', borderRadius: '4px' }}>{resetMessage}</p>}

                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-group">
                                <EnvelopeIcon className="input-icon" />
                                <input
                                    type="email"
                                    className="form-input input-with-icon"
                                    placeholder="naam@voorbeeld.nl"
                                    value={resetEmail}
                                    onChange={e => setResetEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full mt-4" disabled={authVM.isLoading} style={{ width: '100%', padding: '12px' }}>
                            {authVM.isLoading ? 'Verzenden...' : 'Reset Link Sturen'}
                        </button>
                    </form>
                    <button onClick={() => setResetMode(false)} className="text-btn block mt-4 text-center w-full" style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginTop: '1rem' }}>
                        Terug naar Inloggen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-background">
            <div className="auth-card">
                <h2 className="auth-title">Welkom terug</h2>
                <p className="auth-subtitle">Log in om verder te gaan met Tidal Mare</p>

                {authVM.error && <p className="error-message mb-4">{authVM.error}</p>}

                <form onSubmit={handleLogin}>
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
                        {authVM.isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
                    </button>
                </form>

                <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#666' }}>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }}></span>
                    <span style={{ padding: '0 10px', fontSize: '0.9rem', color: '#94a3b8' }}>of log in met</span>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }}></span>
                </div>

                <div className="social-login-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <button
                        onClick={handleGoogleLogin}
                        className="social-btn-round"
                        title="Inloggen met Google"
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

                    <button
                        onClick={handleGuestLogin}
                        className="social-btn-round"
                        title="Doorgaan als gast"
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
                        <UserIcon className="w-6 h-6 text-slate-600" style={{ width: '24px', height: '24px', color: '#475569' }} />
                    </button>
                </div>

                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button type="button" onClick={() => setResetMode(true)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'none' }}>
                        Wachtwoord vergeten?
                    </button>
                    <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
                        Nog geen account? <Link to="/register" style={{ fontWeight: 600 }}>Registreer hier</Link>
                    </div>
                </div>
            </div>
        </div>
    );
});
