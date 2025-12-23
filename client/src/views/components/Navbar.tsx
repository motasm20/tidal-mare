import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../../viewmodels';

export const Navbar: React.FC = observer(() => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = authViewModel;

    const handleLogout = () => {
        authViewModel.logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    Onze Bedrijf Mobility
                </Link>
                <div className="navbar-menu">
                    <div className="navbar-links">
                        {!isAuthenticated && (
                            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Home</NavLink>
                        )}
                        {isAuthenticated && user?.role === 'customer' && (
                            <>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Home</NavLink>
                                <NavLink to="/request" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Reis aanvragen</NavLink>
                                <NavLink to="/my-rides" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Mijn Ritten</NavLink>
                                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Profiel</NavLink>
                            </>
                        )}
                        {isAuthenticated && user?.role === 'guest' && (
                            <>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Home</NavLink>
                                <NavLink to="/request" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Reis aanvragen</NavLink>
                            </>
                        )}
                        {isAuthenticated && user?.role === 'admin' && (
                            <>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Dashboard</NavLink>
                                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Admin Panel</NavLink>
                            </>
                        )}
                    </div>
                </div>
                <div className="navbar-end">
                    {!isAuthenticated ? (
                        <div className="navbar-links">
                            <NavLink to="/login" className="nav-item">Inloggen</NavLink>
                            <NavLink to="/register" className="nav-item">Registreren</NavLink>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="logout-btn">Uitloggen</button>
                    )}
                </div>
            </div>
        </nav>
    );
});
