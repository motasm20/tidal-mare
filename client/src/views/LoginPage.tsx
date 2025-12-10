import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewmodels';
import { useNavigate } from 'react-router-dom';

const authVM = authViewModel;

export const LoginPage: React.FC = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await authVM.login(email, password);
        if (authVM.isAuthenticated) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Inloggen</h2>
                {authVM.error && <p className="error-message mb-4">{authVM.error}</p>}

                <button
                    onClick={() => authVM.loginWithGoogle().then(() => { if (authVM.isAuthenticated) navigate('/dashboard') })}
                    className="google-btn w-full mb-4"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        background: '#fff',
                        color: '#333',
                        border: '1px solid #ccc',
                        padding: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                    Inloggen met Google
                </button>

                <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#666' }}>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }}></span>
                    <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>of</span>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }}></span>
                </div>

                <form onSubmit={handleLogin}>
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
                        {authVM.isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
                    </button>
                </form>
            </div>
        </div>
    );
});
