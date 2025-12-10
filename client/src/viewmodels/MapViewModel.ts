import { makeAutoObservable } from 'mobx';
import type { LocationDTO, ChargingPointDTO } from '../models';

export class MapViewModel {
    // UI state
    selectionMode: 'start' | 'end' = 'start';

    // Data state
    startMarker: LocationDTO | null = null;
    endMarker: LocationDTO | null = null;
    chargingPoints: ChargingPointDTO[] = [];

    // View state (optional usage now that map controls itself somewhat, but good for defaults)
    center: [number, number] = [52.1326, 5.2913]; // Netherlands
    zoom: number = 8;

    constructor() {
        makeAutoObservable(this);
    }

    setSelectionMode(mode: 'start' | 'end') {
        this.selectionMode = mode;
    }

    handleMapClick(lat: number, lng: number) {
        // Just for logic, actual address string managed in React component or here for marker display
        const location: LocationDTO = {
            latitude: lat,
            longitude: lng,
            address: `Geprikt`
        };

        if (this.selectionMode === 'start') {
            this.setStartMarker(location);
        } else {
            this.setEndMarker(location);
        }
    }

    setStartMarker(location: LocationDTO) {
        this.startMarker = location;
        if (location.latitude && location.longitude) {
            this.center = [location.latitude, location.longitude];
            this.zoom = 13;
        }
    }

    setEndMarker(location: LocationDTO) {
        this.endMarker = location;
    }

    setChargingPoints(points: ChargingPointDTO[]) {
        this.chargingPoints = points;
    }

    reset() {
        this.startMarker = null;
        this.endMarker = null;
        this.selectionMode = 'start';
    }
}
