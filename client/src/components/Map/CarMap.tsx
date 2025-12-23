import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { CarDTO } from '../../../../shared/types';
import { ProviderType } from '../../../../shared/types';

import axios from 'axios';
import type { ChargingPointDTO, ParkingGarageDTO } from '../../../../shared/types';

interface CarMapProps {
    cars: CarDTO[];
    center?: [number, number];
    zoom?: number;
    showChargingStations?: boolean;
    showParkingLots?: boolean;
    onSelectCar?: (car: CarDTO) => void;
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


interface RDWSpecs {
    make: string;
    model: string;
    massKg: number;
    color: string;
    year: number;
    description: string;
}

const CarPopupContent: React.FC<{ car: CarDTO; onSelectCar?: (car: CarDTO) => void; color: string }> = ({ car, onSelectCar, color }) => {
    const [rdwSpecs, setSpecs] = React.useState<RDWSpecs | null>(null);

    useEffect(() => {
        const fetchSpecs = async () => {
            try {
                // Try to find specs for this model
                const response = await axios.get<RDWSpecs>('http://localhost:3000/api/rdw/specs', {
                    params: { make: car.make, model: car.model }
                });
                setSpecs(response.data);
            } catch (e) {
                // Silent fail/no specs found
            }
        };
        fetchSpecs();
    }, [car.make, car.model]);

    return (
        <div className="car-popup">
            <h4 style={{ margin: '0 0 5px 0' }}>{car.make} {car.model}</h4>
            <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>{car.location?.address || 'Locatie onbekend'}</p>

            <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
                <span className="badge" style={{ background: color, color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8em' }}>
                    {car.make}
                </span>
                <span className="badge" style={{ background: '#3498db', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8em' }}>
                    €{car.pricePerHourEstimate}/hr
                </span>
            </div>

            {rdwSpecs && (
                <div style={{ marginTop: '8px', padding: '6px', background: '#f3f4f6', borderRadius: '4px', fontSize: '0.8em', borderLeft: '3px solid #F6AD55' }}>
                    <div style={{ fontWeight: 'bold', color: '#d97706', marginBottom: '2px' }}>RDW Verified (Type)</div>
                    <div>⚖️ {rdwSpecs.massKg} kg</div>
                    <div>🎨 {rdwSpecs.color}</div>
                    <div>📅 {rdwSpecs.year}</div>
                </div>
            )}

            {onSelectCar && (
                <button
                    onClick={() => onSelectCar(car)}
                    style={{ marginTop: '8px', width: '100%', padding: '4px 8px', borderRadius: '4px', border: 'none', background: '#111827', color: 'white', cursor: 'pointer', fontSize: '0.9em' }}
                >
                    Kies Auto
                </button>
            )}
        </div>
    );
};

export const CarMap: React.FC<CarMapProps> = ({ cars, center = [51.4416, 5.4697], zoom = 13, showChargingStations = false, showParkingLots = false, onSelectCar }) => {
    const [chargingPoints, setChargingPoints] = React.useState<ChargingPointDTO[]>([]);

    useEffect(() => {
        if (showChargingStations) {
            // Fetch charging points near center
            const fetchPoints = async () => {
                try {
                    const response = await axios.get<ChargingPointDTO[]>('http://localhost:3000/api/charging-points/search', {
                        params: {
                            lat: center[0],
                            lng: center[1],
                            distance: 5 // 5km radius
                        }
                    });
                    setChargingPoints(response.data);
                } catch (e) {
                    console.error("Failed to fetch charging points", e);
                }
            };
            fetchPoints();
        } else {
            setChargingPoints([]);
        }
    }, [showChargingStations, center]);

    const [parkingGarages, setParkingGarages] = React.useState<ParkingGarageDTO[]>([]);

    useEffect(() => {
        if (showParkingLots) {
            const fetchGarages = async () => {
                try {
                    const response = await axios.get<ParkingGarageDTO[]>('http://localhost:3000/api/parking/search', {
                        params: {
                            lat: center[0],
                            lng: center[1],
                            distance: 5
                        }
                    });
                    setParkingGarages(response.data);
                } catch (e) {
                    console.error("Failed to fetch parking garages", e);
                }
            };
            fetchGarages();
        } else {
            setParkingGarages([]);
        }
    }, [showParkingLots, center]);

    return (
        <div className="car-map-container" style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={center} zoom={zoom} />

                {/* Cars Layer */}
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
                                    <CarPopupContent car={car} onSelectCar={onSelectCar} color={color} />
                                </Popup>
                            </CircleMarker>
                        )
                    );
                })}

                {/* Charging Points Layer */}
                {showChargingStations && chargingPoints.map(point => (
                    <CircleMarker
                        key={point.id}
                        center={[point.latitude, point.longitude]}
                        radius={5}
                        pathOptions={{
                            color: '#10b981', // Green for charging
                            fillColor: '#6ee7b7',
                            fillOpacity: 0.9,
                            weight: 1
                        }}
                    >
                        <Popup>
                            <div className="charging-popup">
                                <h4 style={{ margin: '0 0 5px 0', color: '#047857' }}>🔌 {point.provider}</h4>
                                <p style={{ margin: '0', fontSize: '0.9em' }}>{point.address}, {point.city}</p>
                                <div style={{ marginTop: '5px', fontSize: '0.8em', fontWeight: 'bold' }}>
                                    {point.powerKW} kW • {point.status}
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* Parking Layer */}
                {showParkingLots && parkingGarages.map(garage => (
                    <CircleMarker
                        key={garage.id}
                        center={[garage.latitude, garage.longitude]}
                        radius={6}
                        pathOptions={{
                            color: '#7c3aed', // Purple
                            fillColor: '#a78bfa',
                            fillOpacity: 0.9,
                            weight: 1
                        }}
                    >
                        <Popup>
                            <div className="parking-popup">
                                <h4 style={{ margin: '0 0 5px 0', color: '#6d28d9' }}>🅿️ {garage.name}</h4>
                                <p style={{ margin: '0', fontSize: '0.9em' }}>Parkeergarage</p>
                                {garage.capacity && (
                                    <div style={{ marginTop: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>
                                        Totaal: {garage.capacity} plekken
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};
