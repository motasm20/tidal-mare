import React, { useState, useEffect, useRef } from 'react';
import { addressSuggestionService } from '../services/AddressSuggestionService';
import type { AddressSuggestion } from '../services/AddressSuggestionService';
import { CheckCircleIcon } from './Icons';

interface AddressAutocompleteProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    onSelect: (suggestion: AddressSuggestion) => void;
    placeholder?: string;
    className?: string;
    isValid?: boolean;
    hasError?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
    label,
    value,
    onChange,
    onSelect,
    placeholder,
    className,
    isValid,
    hasError
}) => {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (value.length >= 2 && isOpen) {
                setIsLoading(true);
                const results = await addressSuggestionService.search(value);
                setSuggestions(results);
                setIsLoading(false);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [value, isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (s: AddressSuggestion) => {
        onSelect(s);
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div className={`form-group relative ${className || ''}`} ref={wrapperRef} style={{ position: 'relative' }}>
            <div className="flex justify-between items-center mb-1.5" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="form-label">
                    {label}
                </label>
                {isValid && (
                    <span className="text-green-600" style={{ color: 'var(--accent-hover)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                        <CheckCircleIcon className="w-4 h-4" /> Bevestigd
                    </span>
                )}
            </div>

            <div className="relative group" style={{ position: 'relative' }}>
                <div className="absolute inset-y-0 left-0" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isValid ? 'var(--accent-color)' : 'var(--slate-400)', pointerEvents: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    className={`form-input ${isValid ? 'valid' : ''} ${hasError ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem', borderColor: hasError ? '#f87171' : isValid ? 'var(--accent-color)' : '' }}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        if (suggestions.length === 0 && value.length >= 2) {
                            addressSuggestionService.search(value).then(setSuggestions);
                        }
                    }}
                    placeholder={placeholder || "Zoek adres..."}
                    autoComplete="off"
                />

                {isLoading && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                        <div style={{ width: '16px', height: '16px', border: '2px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                )}
            </div>

            {hasError && !isValid && (
                <p className="error-message" style={{ marginTop: '0.5rem', marginBottom: 0, padding: '0.5rem', fontSize: '0.8rem' }}>
                    Kies een geldig adres uit de lijst
                </p>
            )}

            {isOpen && suggestions.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    zIndex: 9999,
                    width: '100%',
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--border-radius-sm)',
                    maxHeight: '18rem',
                    overflowY: 'auto',
                    marginTop: '0.5rem',
                    padding: '0.5rem 0',
                    listStyle: 'none',
                    border: '1px solid var(--slate-200)'
                }}>
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            style={{
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid var(--slate-50)',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(suggestion);
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div style={{ color: 'var(--slate-400)', marginTop: '2px' }}>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div style={{ marginLeft: '0.75rem' }}>
                                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--slate-900)', fontSize: '0.9rem' }}>
                                        {suggestion.street} {suggestion.houseNumber}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                                        {suggestion.postcode} {suggestion.city}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                    <li style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--slate-400)', textAlign: 'center', backgroundColor: 'var(--slate-50)', borderTop: '1px solid var(--slate-100)', fontStyle: 'italic' }}>
                        Powered by PDOK
                    </li>
                </ul>
            )}

            {isOpen && value.length >= 2 && !isLoading && suggestions.length === 0 && (
                <div style={{
                    position: 'absolute',
                    zIndex: 9999,
                    width: '100%',
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '1rem',
                    textAlign: 'center',
                    color: 'var(--slate-500)',
                    fontStyle: 'italic',
                    marginTop: '0.5rem'
                }}>
                    Geen adressen gevonden
                </div>
            )}
        </div>
    );
};
