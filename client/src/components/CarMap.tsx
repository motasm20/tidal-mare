import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { CarDTO } from '../models';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Car Icon
const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // Placeholder premium car icon
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

interface CarMapProps {
    cars: CarDTO[];
    center: [number, number]; // Lat, Lng
    onSelectCar: (car: CarDTO) => void;
}

// Helper to update map view when center changes
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    map.flyTo(center, 13);
    return null;
};

export const CarMap: React.FC<CarMapProps> = ({ cars, center, onSelectCar }) => {
    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid var(--slate-200)' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapUpdater center={center} />

                {/* Search Center Marker */}
                <Marker position={center}>
                    <Popup>Jouw Locatie</Popup>
                </Marker>

                {/* Cars */}
                {cars.map((car, index) => {
                    // Hack: Generate pseudo-random position near center for MVP so they show up on map
                    // In real app, CarDTO would have real lat/lng
                    const offsetLat = (Math.random() - 0.5) * 0.02;
                    const offsetLng = (Math.random() - 0.5) * 0.02;
                    const position: [number, number] = [center[0] + offsetLat, center[1] + offsetLng];

                    return (
                        <Marker key={car.id || index} position={position} icon={carIcon} eventHandlers={{
                            click: () => onSelectCar(car)
                        }}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{car.make} {car.model}</h3>
                                    <p style={{ margin: 0, color: '#64748b' }}>{car.provider}</p>
                                    <button
                                        onClick={() => onSelectCar(car)}
                                        style={{
                                            marginTop: '0.5rem',
                                            background: '#0ea5e9',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Kies deze
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};
