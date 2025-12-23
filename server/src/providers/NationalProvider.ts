import axios from 'axios';
import { ICarProvider, MatchingCriteria } from './ICarProvider';
import { CarDTO, ProviderType, FuelType } from '../../../shared/types';

interface ApiVehicle {
    system_id: string;
    vehicle_id: string;
    lat: number;
    lon: number;
    is_reserved: boolean;
    is_disabled: boolean;
    form_factor: string;
    propulsion_type: string;
}

interface ApiResponse {
    last_updated: string;
    ttl: number;
    data: {
        vehicles: ApiVehicle[];
    };
}

export class NationalProvider implements ICarProvider {
    name = "National Provider (Real-time)";
    private cache: CarDTO[] = [];
    private lastFetch: number = 0;
    private readonly CACHE_TTL = 60 * 1000; // 1 minute cache

    private mapProvider(systemId: string): ProviderType {
        const id = systemId.toLowerCase();
        if (id.includes('mywheels')) return ProviderType.MYWHEELS;
        if (id.includes('greenwheels')) return ProviderType.GREENWHEELS;
        // Add more mappings if needed
        return ProviderType.EINDHOVEN; // Default/Other
    }

    private mapFuel(propulsion: string): FuelType {
        if (propulsion === 'electric') return FuelType.EV;
        if (propulsion === 'combustion' || propulsion === 'petrol') return FuelType.PETROL;
        if (propulsion === 'electric_assist' || propulsion === 'hybrid') return FuelType.HYBRID;
        return FuelType.PETROL;
    }

    async getAvailableCars(criteria: MatchingCriteria): Promise<CarDTO[]> {
        const now = Date.now();
        if (this.cache.length > 0 && (now - this.lastFetch) < this.CACHE_TTL) {
            console.log('Serving national cars from cache');
            return this.filterCars(this.cache, criteria);
        }

        try {
            console.log('Fetching national cars from dashboarddeelmobiliteit.nl...');
            const response = await axios.get<ApiResponse>('https://api.datadeelmobiliteit.nl/vehicles', {
                headers: { 'User-Agent': 'TidalMare/1.0' }
            });

            const vehicles = response.data.data.vehicles;

            // Map API response to CarDTO
            const cars: CarDTO[] = vehicles
                .filter(v => v.form_factor === 'car' && !v.is_disabled && !v.is_reserved)
                .map(v => ({
                    id: v.vehicle_id,
                    make: this.mapProvider(v.system_id) === ProviderType.MYWHEELS
                        ? 'MyWheels'
                        : v.system_id.charAt(0).toUpperCase() + v.system_id.slice(1),
                    model: v.propulsion_type === 'electric' ? 'Electric Car' : (v.form_factor.charAt(0).toUpperCase() + v.form_factor.slice(1)),
                    seats: 5, // Default
                    luggageCapacity: 2,
                    fuelType: this.mapFuel(v.propulsion_type),
                    range: v.propulsion_type === 'electric' ? 350 : 600,
                    provider: this.mapProvider(v.system_id),
                    pricePerHourEstimate: 5, // Estimate
                    location: {
                        address: 'Locatie op kaart',
                        latitude: v.lat,
                        longitude: v.lon,
                        label: v.system_id.charAt(0).toUpperCase() + v.system_id.slice(1)
                    },
                    rating: 4.5
                }));

            this.cache = cars;
            this.lastFetch = now;
            console.log(`Fetched ${cars.length} available cars nationally.`);

            return this.filterCars(cars, criteria);
        } catch (error) {
            console.error('Failed to fetch national car data:', error);
            // Fallback to empty or perhaps cached data if available (not implemented here)
            return [];
        }
    }

    private filterCars(cars: CarDTO[], criteria: MatchingCriteria): CarDTO[] {
        // Simple geo-filtering if needed, but for now we return all and let MatchingService filtering handle logic
        // or client handle distance. However, MatchingService does simple filtering.
        return cars;
    }
}
