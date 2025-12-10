import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewmodels';
import { useNavigate, Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '../components/Icons';

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

    return (
        <div className="auth-background">
            <div className="auth-card">
                <h2 className="auth-title">Maak een account</h2>
                <p className="auth-subtitle">Begin vandaag nog met jouw duurzame reis</p>

                {authVM.error && <p className="error-message mb-4">{authVM.error}</p>}

                <button
                    onClick={() => authVM.loginWithGoogle().then(() => { if (authVM.isAuthenticated) navigate('/dashboard') })}
                    className="google-btn w-full mb-3"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                    Registreren met Google
                </button>

                <button
                    onClick={() => authVM.loginAnonymously().then(() => { if (authVM.isAuthenticated) navigate('/dashboard') })}
                    className="guest-btn w-full mb-4"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '10px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    👤 Doorgaan als gast
                </button>

                <div className="divider">
                    <span>of met email</span>
                </div>

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
                <div className="mt-4 text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
                    Heb je al een account? <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
                </div>
            </div>
        </div>
    );
});
