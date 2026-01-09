import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoJsonObject } from 'geojson';
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
    destination?: [number, number] | null;
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
    consumption?: number;
    fuelType?: string;
}

const CarPopupContent: React.FC<{ car: CarDTO; onSelectCar?: (car: CarDTO) => void; color: string; walkStats?: { duration: number; distance: number } | null; destination?: [number, number] | null }> = ({ car, onSelectCar, color, walkStats, destination }) => {
    const [rdwSpecs, setSpecs] = React.useState<RDWSpecs | null>(null);
    const [tripCost, setTripCost] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchSpecs = async () => {
            try {
                // Try to find specs for this model
                const response = await axios.get<RDWSpecs>('http://localhost:3000/api/rdw/specs', {
                    params: { make: car.make, model: car.model }
                });
                setSpecs(response.data);
            } catch (e) {
            }
        };
        fetchSpecs();
    }, [car.make, car.model]);

    useEffect(() => {
        const calculateCost = async () => {
            if (!rdwSpecs?.consumption || !destination || !car.location) return;

            try {
                const response = await axios.get('http://localhost:3000/api/routing/route', {
                    params: {
                        startLat: car.location.latitude,
                        startLng: car.location.longitude,
                        endLat: destination[0],
                        endLng: destination[1],
                        mode: 'driving'
                    }
                });

                const distanceKm = response.data.distance / 1000;
                let price = 0;

                if (rdwSpecs.fuelType === 'Elektriciteit') {
                    // consumption is kWh/100km
                    // Cost = (Dist / 100) * Cons * PricePerKwh
                    price = (distanceKm / 100) * rdwSpecs.consumption * 0.40; // €0.40/kWh
                } else {
                    // consumption is L/100km
                    price = (distanceKm / 100) * rdwSpecs.consumption * 2.00; // €2.00/L
                }

                setTripCost(price.toFixed(2));
            } catch (e) { console.error(e); }
        };
        calculateCost();
    }, [rdwSpecs, destination, car.location]);

    return (
        <div className="car-popup">
            <h4 style={{ margin: '0 0 5px 0' }}>{car.make} {car.model}</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>{car.location?.address || 'Locatie onbekend'}</p>
                {walkStats && (
                    <span style={{ fontSize: '0.8em', fontWeight: 'bold', color: '#2563eb', background: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>
                        🚶 {Math.ceil(walkStats.duration / 60)} min
                    </span>
                )}
            </div>

            <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
                <span className="badge" style={{ background: color, color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8em' }}>
                    {car.make}
                </span>
                <span className="badge" style={{ background: '#3498db', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8em' }}>
                    €{car.pricePerHourEstimate}/hr
                </span>
            </div>

            {tripCost && (
                <div style={{ marginTop: '8px', padding: '6px', background: '#ecfdf5', borderRadius: '4px', fontSize: '0.8em', border: '1px solid #10b981', color: '#064e3b' }}>
                    ⛽ Ritprijs (est): <strong>€{tripCost}</strong>
                </div>
            )}

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

export const CarMap: React.FC<CarMapProps> = ({ cars, center = [51.4416, 5.4697], zoom = 13, showChargingStations = false, showParkingLots = false, onSelectCar, destination }) => {
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

    // Routing State
    const [routeGeoJson, setRouteGeoJson] = React.useState<GeoJsonObject | null>(null);
    const [walkStats, setWalkStats] = React.useState<{ duration: number; distance: number } | null>(null);
    const [selectedCarId, setSelectedCarId] = React.useState<string | null>(null);

    const handleCarClick = async (car: CarDTO) => {
        setSelectedCarId(car.id);
        setRouteGeoJson(null);
        setWalkStats(null);

        if (!center || !car.location) return;

        try {
            const response = await axios.get('http://localhost:3000/api/routing/route', {
                params: {
                    startLat: center[0],
                    startLng: center[1],
                    endLat: car.location.latitude,
                    endLng: car.location.longitude,
                    mode: 'walking'
                }
            });

            setRouteGeoJson(response.data.geometry);
            setWalkStats({
                duration: response.data.duration,
                distance: response.data.distance
            });
        } catch (e) {
            console.error("Failed to fetch route", e);
        }
    };

    return (
        <div className="car-map-container" style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={center} zoom={zoom} />

                {/* Route Layer */}
                {routeGeoJson && (
                    <GeoJSON
                        key={selectedCarId} // Force re-render on new route
                        data={routeGeoJson}
                        style={{ color: '#3b82f6', weight: 4, dashArray: '10, 10', opacity: 0.8 }}
                    />
                )}

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
                                eventHandlers={{
                                    click: () => handleCarClick(car)
                                }}
                                pathOptions={{
                                    color: color,
                                    fillColor: color,
                                    fillOpacity: 0.7
                                }}
                            >
                                <Popup>
                                    <CarPopupContent
                                        car={car}
                                        onSelectCar={onSelectCar}
                                        color={color}
                                        walkStats={selectedCarId === car.id ? walkStats : null}
                                        destination={destination}
                                    />
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
