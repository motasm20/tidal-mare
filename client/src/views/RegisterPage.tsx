import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewmodels';
import { useNavigate } from 'react-router-dom';

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
            </div>
        </div>
    );
});
