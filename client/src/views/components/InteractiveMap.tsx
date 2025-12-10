import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map view when center changes
// We only update center if it changes significantly or on init
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// Component to handle clicks
const MapEvents: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

interface Position {
    lat: number;
    lng: number;
    address?: string;
}

interface MapComponentProps {
    // Controlled props
    mapMode: 'start' | 'end';
    startPosition?: Position | null;
    endPosition?: Position | null;

    // Callbacks
    onCoordinatePicked: (lat: number, lng: number, type?: 'start' | 'end') => void;

    // Optional: Charging points for display
    chargingPoints?: Array<{ id: string; latitude: number; longitude: number; name: string; status: string }>;
}

export const InteractiveMap: React.FC<MapComponentProps> = ({
    mapMode,
    startPosition,
    endPosition,
    onCoordinatePicked,
    chargingPoints = []
}) => {

    // Determine center: Start > End > Default (Netherlands center approx)
    const center: [number, number] = startPosition
        ? [startPosition.lat, startPosition.lng]
        : endPosition
            ? [endPosition.lat, endPosition.lng]
            : [52.1326, 5.2913]; // Fallback: Netherlands

    const zoom = startPosition || endPosition ? 13 : 8;

    const handleMapClick = (lat: number, lng: number) => {
        onCoordinatePicked(lat, lng);
    };

    const handleDragEnd = (e: any, type: 'start' | 'end') => {
        const marker = e.target;
        const position = marker.getLatLng();
        // Dragging explicitly sets that specific type
        onCoordinatePicked(position.lat, position.lng, type);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
            >
                <MapUpdater center={center} zoom={zoom} />
                <MapEvents onMapClick={handleMapClick} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {startPosition && (
                    <Marker
                        position={[startPosition.lat, startPosition.lng]}
                        draggable={true}
                        eventHandlers={{
                            dragend: (e) => handleDragEnd(e, 'start')
                        }}
                    >
                        <Popup>Start: {startPosition.address || 'Geselecteerde locatie'}</Popup>
                    </Marker>
                )}

                {endPosition && (
                    <Marker
                        position={[endPosition.lat, endPosition.lng]}
                        draggable={true}
                        eventHandlers={{
                            dragend: (e) => handleDragEnd(e, 'end')
                        }}
                    >
                        <Popup>Eind: {endPosition.address || 'Geselecteerde locatie'}</Popup>
                    </Marker>
                )}

                {chargingPoints.map(cp => (
                    <Marker key={cp.id} position={[cp.latitude, cp.longitude]}>
                        <Popup>{cp.name} ({cp.status})</Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Visual Feedback for Mode */}
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                padding: '8px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: '#334155'
            }}>
                Modus: {mapMode === 'start' ? 'Startpunt kiezen' : 'Eindpunt kiezen'}
            </div>
        </div>
    );
};
