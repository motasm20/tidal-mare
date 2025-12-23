import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { CarDTO } from '../../../../shared/types';
import { ProviderType } from '../../../../shared/types';

interface CarMapProps {
    cars: CarDTO[];
    center?: [number, number];
    zoom?: number;
}

// Component to update map center when props change
const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        // Use setView for instant robust positioning
        map.setView(center, zoom);
        // Also invalidate size in case of layout shifts
        map.invalidateSize();
    }, [center, zoom, map]);

    return null;
};

const getProviderColor = (make: string) => {
    const normalize = (s: string) => s.toLowerCase();
    const name = normalize(make);

    if (name.includes('mywheels')) return '#116284';
    if (name.includes('greenwheels')) return '#106F62';
    if (name.includes('iris')) return '#EA8D31'; // Iris Elektrick

    return '#C32D1C'; // Default from snippet
};

export const CarMap: React.FC<CarMapProps> = ({ cars, center = [51.4416, 5.4697], zoom = 13 }) => {
    return (
        <div className="car-map-container" style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={center} zoom={zoom} />

                {cars.map(car => {
                    // Use provider color if it's an external car, or fallback logic
                    const color = car.provider === ProviderType.EINDHOVEN
                        ? getProviderColor(car.make)
                        : '#3498db'; // Internal cars blue

                    return (
                        car.location && car.location.latitude && car.location.longitude && (
                            <CircleMarker
                                key={car.id}
                                center={[car.location.latitude, car.location.longitude]}
                                radius={8}
                                pathOptions={{
                                    color: color,
                                    fillColor: color,
                                    fillOpacity: 0.7
                                }}
                            >
                                <Popup>
                                    <div className="car-popup">
                                        <h4 style={{ margin: '0 0 5px 0' }}>{car.make} {car.model}</h4>
                                        <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>{car.location.address}</p>
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
                                            <span className="badge" style={{
                                                background: color,
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '0.8em'
                                            }}>
                                                {car.make}
                                            </span>
                                            <span className="badge" style={{
                                                background: '#3498db',
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '0.8em'
                                            }}>
                                                €{car.pricePerHourEstimate}/hr
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        )
                    );
                })}
            </MapContainer>
        </div>
    );
};
