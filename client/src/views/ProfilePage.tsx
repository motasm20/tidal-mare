import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authViewModel, userProfileViewModel } from '../viewmodels';
import { FormSection } from '../components/FormSection';
import { AddressAutocomplete } from '../components/AddressAutocomplete';
import type { LocationDTO } from '../models';
import {
    UserIcon,
    EnvelopeIcon,
    HomeIcon,
    BriefcaseIcon,
    LockClosedIcon,
    MapPinIcon
} from '../components/Icons';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = observer(() => {
    const { user } = authViewModel;
    const { isLoading } = userProfileViewModel;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
    const [iban, setIban] = useState('');

    const [homeLocation, setHomeLocation] = useState<LocationDTO | undefined>(undefined);
    const [workLocation, setWorkLocation] = useState<LocationDTO | undefined>(undefined);

    useEffect(() => {
        if (user) {
            userProfileViewModel.setUser(user);
            if (user.firstName) setFirstName(user.firstName);
            if (user.lastName) setLastName(user.lastName);
            if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
            if (user.dateOfBirth) setDateOfBirth(user.dateOfBirth);
            if (user.licenseNumber) setLicenseNumber(user.licenseNumber);
            if (user.licenseExpiryDate) setLicenseExpiryDate(user.licenseExpiryDate);
            if (user.emergencyContactName) setEmergencyContactName(user.emergencyContactName);
            if (user.emergencyContactPhone) setEmergencyContactPhone(user.emergencyContactPhone);
            if (user.iban) setIban(user.iban);

            if (user.homeLocation) setHomeLocation(user.homeLocation);
            if (user.workLocation) setWorkLocation(user.workLocation);
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Construct the update object based on our UserDTO
        const updates = {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
            licenseNumber,
            licenseExpiryDate,
            emergencyContactName,
            emergencyContactPhone,
            iban,
            homeLocation,
            workLocation
        };

        // We use the same updateLocations method but now pass all fields. 
        // We need to slightly patch UserProfileViewModel to accept generic partials if it doesn't already.
        // Or simply cast it here if we know the underlying service handles it.
        // Actually best practice is to update the VM method Signature.
        await userProfileViewModel.updateProfile(updates);

        if (userProfileViewModel.user) {
            authViewModel.user = userProfileViewModel.user;
        }
        // Ideally show a toast here, using alert for MVP
        alert('Updates succesvol opgeslagen! ✅');
    };

    if (!user) return <div className="p-8 text-center text-gray-500">Niet ingelogd.</div>;

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        position: 'relative' as const,
        zIndex: 10,
        overflow: 'hidden'
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', background: '#111827', padding: '2rem 1rem' }}>
            <AnimatedBackground />

            {/* Nav Back */}
            <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto', position: 'relative', zIndex: 10 }}>
                <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '99px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', transition: 'background 0.2s', fontWeight: '500', fontSize: '0.9rem' }}>
                    ← Terug naar Dashboard
                </Link>
            </div>

            <div style={cardStyle}>
                <div style={{ background: 'linear-gradient(to right, #0099cc, #0077a8)', padding: '3rem 2rem', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                            👤
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Mijn Profiel</h1>
                            <p style={{ opacity: 0.9, fontSize: '1.1rem', marginTop: '0.25rem' }}>Beheer je gegevens en locaties</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '2.5rem' }}>
                    <form onSubmit={handleSave}>
                        <FormSection title="Accountgegevens" icon={<div style={{ width: '20px', height: '20px' }}><UserIcon /></div>}>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#374151' }}>
                                    <span style={{ color: '#6b7280' }}><EnvelopeIcon className="w-4 h-4" /></span>
                                    <span>E-mailadres</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={user.email}
                                        readOnly
                                        disabled
                                        style={{ paddingLeft: '2.5rem', background: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed', borderColor: '#e5e7eb' }}
                                    />
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                        <LockClosedIcon className="w-4 h-4" />
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.5rem', fontStyle: 'italic' }}>Je e-mailadres is gekoppeld aan je account en kan niet worden gewijzigd.</p>
                            </div>
                            <div className="grid-2-cols">
                                <div className="form-group">
                                    <label className="form-label">Voornaam</label>
                                    <input type="text" className="form-input" placeholder="Je voornaam" value={firstName} onChange={e => setFirstName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Achternaam</label>
                                    <input type="text" className="form-input" placeholder="Je achternaam" value={lastName} onChange={e => setLastName(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid-2-cols" style={{ marginTop: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Geboortedatum</label>
                                    <input type="date" className="form-input" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Telefoonnummer</label>
                                    <input type="tel" className="form-input" placeholder="06 12345678" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label className="form-label">IBAN (voor betalingen)</label>
                                <input type="text" className="form-input" placeholder="NL00 RABO 0123 4567 89" value={iban} onChange={e => setIban(e.target.value)} />
                            </div>
                        </FormSection>

                        <div style={{ height: '1px', background: '#f3f4f6', margin: '2rem 0' }}></div>

                        <FormSection title="Rijbewijs" icon={<div style={{ fontSize: '1.2rem' }}>🪪</div>}>
                            <div className="grid-2-cols">
                                <div className="form-group">
                                    <label className="form-label">Rijbewijsnummer</label>
                                    <input type="text" className="form-input" placeholder="1234567890" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Geldig tot</label>
                                    <input type="date" className="form-input" value={licenseExpiryDate} onChange={e => setLicenseExpiryDate(e.target.value)} />
                                </div>
                            </div>
                        </FormSection>

                        <div style={{ height: '1px', background: '#f3f4f6', margin: '2rem 0' }}></div>

                        <FormSection title="Noodcontact" icon={<div style={{ fontSize: '1.2rem' }}>🚨</div>}>
                            <div className="grid-2-cols">
                                <div className="form-group">
                                    <label className="form-label">Naam Contactpersoon</label>
                                    <input type="text" className="form-input" placeholder="Naam" value={emergencyContactName} onChange={e => setEmergencyContactName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Telefoonnummer</label>
                                    <input type="tel" className="form-input" placeholder="06 12345678" value={emergencyContactPhone} onChange={e => setEmergencyContactPhone(e.target.value)} />
                                </div>
                            </div>
                        </FormSection>

                        <div style={{ height: '1px', background: '#f3f4f6', margin: '2rem 0' }}></div>

                        <FormSection title="Favoriete Locaties" icon={<div style={{ width: '20px', height: '20px' }}><MapPinIcon /></div>}>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#374151' }}>
                                    <span style={{ color: 'var(--primary-600)' }}><HomeIcon /></span>
                                    <span>Thuisadres</span>
                                </label>
                                <AddressAutocomplete
                                    label=""
                                    value={homeLocation?.address || ''}
                                    onChange={(val) => setHomeLocation(prev => ({ ...prev, address: val, label: 'Thuis' } as LocationDTO))}
                                    onSelect={(suggestion) => {
                                        setHomeLocation({
                                            address: `${suggestion.street} ${suggestion.houseNumber}, ${suggestion.city}`,
                                            latitude: suggestion.latitude,
                                            longitude: suggestion.longitude,
                                            label: 'Thuis'
                                        });
                                    }}
                                    placeholder="Bijv. Kerkstraat 1, Amsterdam"
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#374151' }}>
                                    <span style={{ color: 'var(--primary-600)' }}><BriefcaseIcon /></span>
                                    <span>Werkadres</span>
                                </label>
                                <AddressAutocomplete
                                    label=""
                                    value={workLocation?.address || ''}
                                    onChange={(val) => setWorkLocation(prev => ({ ...prev, address: val, label: 'Werk' } as LocationDTO))}
                                    onSelect={(suggestion) => {
                                        setWorkLocation({
                                            address: `${suggestion.street} ${suggestion.houseNumber}, ${suggestion.city}`,
                                            latitude: suggestion.latitude,
                                            longitude: suggestion.longitude,
                                            label: 'Werk'
                                        });
                                    }}
                                    placeholder="Bijv. Stationsplein 5, Utrecht"
                                />
                            </div>
                        </FormSection>

                        <style>{`
                            .grid-2-cols {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 1.5rem;
                            }
                            @media (max-width: 640px) {
                                .grid-2-cols {
                                    grid-template-columns: 1fr;
                                }
                            }
                        `}</style>

                        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <Link to="/dashboard" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'white', border: '1px solid #e5e7eb', color: '#374151', textDecoration: 'none', fontWeight: '600', transition: 'background 0.2s' }}>
                                Annuleren
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary"
                                style={{
                                    padding: '0.75rem 2rem',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                {isLoading ? 'Opslaan...' : 'Wijzigingen Opslaan'}
                            </button>
                        </div>
                    </form>

                    <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #fee2e2' }}>
                        <h3 style={{ color: '#991b1b', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Gevarenzone</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Wil je je account en privégegevens verwijderen?
                        </p>
                        <Link to="/delete-account" style={{ color: '#dc2626', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'underline' }}>
                            Account verwijderen
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
});
