import React from 'react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const PrivacyPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6', position: 'relative', overflowX: 'hidden' }}>
            <AnimatedBackground />

            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', background: 'rgba(255,255,255,0.9)', borderRadius: '16px', position: 'relative', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#111827' }}>Privacybeleid – Tidal Mare</h3>

                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>Tidal Mare hecht grote waarde aan de bescherming van persoonsgegevens en handelt conform de Algemene Verordening Gegevensbescherming (AVG).</p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>1. Identiteit van de Verwerkingsverantwoordelijke</h3>
                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>Tidal Mare is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid.</p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>2. Welke gegevens wij verzamelen</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
                    <li>Naam, adres en woonplaats (NAW-gegevens)</li>
                    <li>E-mailadres en accountgegevens</li>
                    <li>Rijbewijsgegevens</li>
                    <li>Locatiegegevens tijdens gebruik van de Dienst</li>
                    <li>Rit- en reserveringsgeschiedenis</li>
                </ul>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>3. Doeleinden van de verwerking</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
                    <li>Uitvoering van de overeenkomst</li>
                    <li>Reserveringen en voertuigtoegang mogelijk maken</li>
                    <li>Facturatie en betalingen</li>
                    <li>Veiligheid, fraudepreventie en schadeafhandeling</li>
                </ul>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>4. Delen van gegevens met derden</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>Persoonsgegevens worden uitsluitend gedeeld met derden indien dit noodzakelijk is, zoals:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
                    <li>Betaalproviders</li>
                    <li>Verzekeraars bij schade of incidenten</li>
                    <li>IT-dienstverleners voor hosting en onderhoud</li>
                </ul>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>5. Bewaartermijnen en Beveiliging</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>Gegevens worden niet langer bewaard dan noodzakelijk voor het doel waarvoor ze zijn verzameld of zolang dit wettelijk verplicht is.</p>
                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>Tidal Mare treft passende technische en organisatorische maatregelen om persoonsgegevens te beveiligen.</p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>6. Rechten van de Gebruiker</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>De Gebruiker heeft het recht op:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
                    <li>Inzage in zijn persoonsgegevens</li>
                    <li>Correctie van onjuiste gegevens</li>
                    <li>Verwijdering van gegevens (recht op vergetelheid)</li>
                    <li>Beperking of bezwaar tegen verwerking</li>
                </ul>
                <p>Verzoeken kunnen worden ingediend via het platform of per e-mail.</p>
            </div>
        </div>
    );
};
