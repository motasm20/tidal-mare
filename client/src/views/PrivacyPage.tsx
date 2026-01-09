import React from 'react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const PrivacyPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6', position: 'relative', overflowX: 'hidden' }}>
            <AnimatedBackground />

            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', background: 'rgba(255,255,255,0.9)', borderRadius: '16px', position: 'relative', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#111827' }}>Privacybeleid</h1>

                <div style={{ color: '#4b5563', lineHeight: '1.6' }}>
                    <p><strong>Laatst bijgewerkt:</strong> {new Date().toLocaleDateString('nl-NL')}</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>1. Gegevensverzameling</h3>
                    <p>Wij verzamelen gegevens die je ons verstrekt, zoals je naam, e-mailadres en locatiegegevens om onze diensten te kunnen leveren.</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>2. Gebruik van Gegevens</h3>
                    <p>Je gegevens worden gebruikt om ritten te plannen, betalingen te verwerken en je account te beheren.</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>3. Gegevensdeling</h3>
                    <p>Wij delen je gegevens niet met derden, behalve indien noodzakelijk voor de uitvoering van de dienst (bijv. autodeelpartners) of indien wettelijk verplicht.</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>4. Jouw Rechten</h3>
                    <p>Je hebt het recht om je gegevens in te zien, te corrigeren of te laten verwijderen. Neem contact met ons op via support@tidalmare.com.</p>
                </div>
            </div>
        </div>
    );
};
