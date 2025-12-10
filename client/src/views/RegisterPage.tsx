import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewmodels';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Registreren</h2>
                {authVM.error && <p className="error-message mb-4">{authVM.error}</p>}

                <button
                    onClick={() => authVM.loginWithGoogle().then(() => { if (authVM.isAuthenticated) navigate('/dashboard') })}
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

                <form onSubmit={handleRegister}>
                    <div className="form-field">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="naam@voorbeeld.nl"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Wachtwoord</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4" disabled={authVM.isLoading} style={{ width: '100%' }}>
                        {authVM.isLoading ? 'Bezig met registreren...' : 'Registreren'}
                    </button>
                </form>
                <div className="mt-4 text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Heb je al een account? <Link to="/">Log in</Link>
                </div>
            </div>
        </div>
    );
});
