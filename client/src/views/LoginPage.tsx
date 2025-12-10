import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewmodels';
import { useNavigate, Link } from 'react-router-dom';
// @ts-ignore
import { EnvelopeIcon, LockClosedIcon } from '../components/Icons';

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

                <button
                    onClick={handleGoogleLogin}
                    className="google-btn w-full mb-3"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        background: '#ffffff',
                        color: '#3c4043',
                        border: '1px solid #dadce0',
                        padding: '12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '14px',
                        fontFamily: 'Roboto, arial, sans-serif',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        transition: 'background-color .2s box-shadow .2s'
                    }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                    Inloggen met Google
                </button>

                <button
                    onClick={handleGuestLogin}
                    className="guest-btn w-full mb-4"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        background: '#f8f9fa',
                        color: '#666',
                        border: '1px solid #ccc',
                        padding: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    👤 Doorgaan als gast
                </button>

                <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#666' }}>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }}></span>
                    <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>of met email</span>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }}></span>
                </div>

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
                            <div style={{ textAlign: 'right', marginTop: '0.5rem', width: '100%' }}>
                                <button type="button" onClick={() => setResetMode(true)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Wachtwoord vergeten?
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4" disabled={authVM.isLoading} style={{ width: '100%', padding: '12px' }}>
                        {authVM.isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
                    </button>
                </form>

                <div className="mt-4 text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
                    Nog geen account? <Link to="/register" style={{ fontWeight: 600 }}>Registreer hier</Link>
                </div>
            </div>
        </div>
    );
});
