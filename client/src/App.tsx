import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { RegisterPage } from './views/RegisterPage';
import { TermsPage } from './views/TermsPage';
import { PrivacyPage } from './views/PrivacyPage';
import { PrivateRoute } from './views/components/PrivateRoute';

import { Dashboard } from './views/Dashboard';
import { RequestCarPage } from './views/RequestCarPage';
import { BookingDetailsPage } from './views/BookingDetailsPage';
import { ProfilePage } from './views/ProfilePage';
import { DeleteAccountPage } from './views/DeleteAccountPage';
import { MyRidesPage } from './views/MyRidesPage';

import { AdminPanel } from './views/AdminPanel';

import { Navbar } from './views/components/Navbar';

function App() {
  return (
    <Router basename="/tidal-mare">
      <div className="app-shell">
        <Navbar />
        <main className="app-content">
          <div className="app-container">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Customer Routes (Full Access) */}
              <Route element={<PrivateRoute roles={['customer', 'admin']} />}>
                <Route path="/my-rides" element={<MyRidesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/booking/:id" element={<BookingDetailsPage />} />
                <Route path="/delete-account" element={<DeleteAccountPage />} />
              </Route>

              {/* Shared Routes (Guest & Customer) */}
              <Route element={<PrivateRoute roles={['customer', 'guest', 'admin']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/request" element={<RequestCarPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<PrivateRoute roles={['admin']} />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
