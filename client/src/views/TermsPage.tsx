import React from 'react';
import { AnimatedBackground } from '../components/AnimatedBackground';


export const TermsPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6', position: 'relative', overflowX: 'hidden' }}>
            <AnimatedBackground />

            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', background: 'rgba(255,255,255,0.9)', borderRadius: '16px', position: 'relative', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#111827' }}>Algemene Voorwaarden</h1>

                <div style={{ color: '#4b5563', lineHeight: '1.6' }}>
                    <p><strong>Laatst bijgewerkt:</strong> {new Date().toLocaleDateString('nl-NL')}</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>1. Inleiding</h3>
                    <p>Welkom bij Tidal Mare. Door gebruik te maken van onze diensten, ga je akkoord met deze voorwaarden. Lees ze zorgvuldig door.</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>2. Gebruik van de Dienst</h3>
                    <p>Je mag onze diensten alleen gebruiken voor wettige doeleinden. Je stemt ermee in om geen misbruik te maken van de auto's of de applicatie.</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>3. Accounts</h3>
                    <p>Je bent verantwoordelijk voor het beveiligen van je account. Deel je wachtwoord niet met anderen.</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>4. Betalingen</h3>
                    <p>Alle betalingen geschieden via de in de app aangeboden betaalmethoden. Tarieven worden vooraf getoond.</p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>5. Aansprakelijkheid</h3>
                    <p>Tidal Mare is niet aansprakelijk voor indirecte schade voortvloeiend uit het gebruik van onze diensten, tenzij er sprake is van opzet of grove schuld.</p>
                </div>
            </div>
        </div>
    );
};
