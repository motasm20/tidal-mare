import React from 'react';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const TermsPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6', position: 'relative', overflowX: 'hidden' }}>
            <AnimatedBackground />

            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', background: 'rgba(255,255,255,0.9)', borderRadius: '16px', position: 'relative', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#111827' }}>Algemene Voorwaarden – Tidal Mare</h3>

                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>Deze Algemene Voorwaarden zijn van toepassing op het gebruik van het car-sharing platform “Tidal Mare”. Door registratie en gebruik van de dienst verklaart de gebruiker zich akkoord met deze voorwaarden.</p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>1. Definities</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
                    <li><strong>Gebruiker:</strong> iedere natuurlijke persoon die een account heeft aangemaakt bij Tidal Mare.</li>
                    <li><strong>Voertuig:</strong> een (elektrische) auto die via het platform beschikbaar wordt gesteld voor gedeeld gebruik.</li>
                    <li><strong>Dienst:</strong> het aanbieden van een digitaal platform voor het reserveren en gebruiken van gedeelde voertuigen.</li>
                </ul>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>2. Registratie en Accountbeveiliging</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>Om gebruik te maken van de Dienst dient de Gebruiker zich te registreren en correcte, actuele en volledige gegevens te verstrekken.</p>
                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>De Gebruiker is verantwoordelijk voor het vertrouwelijk houden van zijn inloggegevens en is aansprakelijk voor alle activiteiten die via zijn account plaatsvinden.</p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>3. Gebruik van de Voertuigen</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>De Gebruiker dient het Voertuig zorgvuldig te gebruiken en als een goed huisvader te behandelen.</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
                    <li>Het is verboden het Voertuig te gebruiken voor illegale activiteiten.</li>
                    <li>Roken, vervuiling en vervoer van gevaarlijke stoffen is niet toegestaan.</li>
                    <li>Het Voertuig dient na gebruik schoon en netjes te worden achtergelaten.</li>
                </ul>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>4. Reserveringen en Annuleringen</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>Reserveringen worden digitaal bevestigd via het platform. Annulering is mogelijk zolang de reservering nog niet is gestart.</p>
                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>Tidal Mare behoudt zich het recht voor annuleringskosten in rekening te brengen conform het geldende tarief.</p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>5. Tarieven en Betalingen</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>De geldende tarieven worden vooraf duidelijk weergegeven. Betaling geschiedt via de aangeboden betaalmethoden.</p>
                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>Bij niet-tijdige betaling kan de toegang tot de Dienst worden beperkt of beëindigd.</p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>6. Aansprakelijkheid, Schade en Verzekering</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>De Gebruiker is aansprakelijk voor schade aan het Voertuig tijdens de reserveringsperiode, behoudens normale slijtage.</p>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>Op elk Voertuig is een verzekering van toepassing met een vastgesteld eigen risico. Dit eigen risico komt voor rekening van de Gebruiker.</p>
                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>Tidal Mare is niet aansprakelijk voor indirecte schade of gevolgschade.</p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>7. Duur en Beëindiging</h3>
                <p style={{ marginBottom: '0.5rem', color: '#4b5563', lineHeight: '1.6' }}>De overeenkomst wordt aangegaan voor onbepaalde tijd.</p>
                <p style={{ marginBottom: '1rem', color: '#4b5563', lineHeight: '1.6' }}>Tidal Mare kan het account van de Gebruiker beëindigen bij overtreding van deze voorwaarden of bij misbruik van de Dienst.</p>
            </div>
        </div>
    );
};
