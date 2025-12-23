
import axios from 'axios';
import NodeCache from 'node-cache';

import { ParkingGarageDTO } from '../../../shared/types';

interface RDWGarage {
    areaid: string;
    areadesc: string;
    location: {
        latitude: string;
        longitude: string;
    };
    usageid: string;
}

class ParkingService {
    private cache: NodeCache;
    private readonly BASE_URL = 'https://opendata.rdw.nl/resource/t5pc-eb34.json';
    private readonly TTL_SECONDS = 300; // 5 minutes cache

    constructor() {
        this.cache = new NodeCache({ stdTTL: this.TTL_SECONDS });
    }

    async getGarages(lat: number, lng: number, radiusKm: number): Promise<ParkingGarageDTO[]> {
        const cacheKey = `g_${lat.toFixed(2)}_${lng.toFixed(2)}_${radiusKm}`;
        const cached = this.cache.get<ParkingGarageDTO[]>(cacheKey);
        if (cached) return cached;

        try {
            // 1. Fetch Location Data
            const radiusMeters = radiusKm * 1000;
            const geoResponse = await axios.get<RDWGarage[]>(this.BASE_URL, {
                params: {
                    '$where': `within_circle(location, ${lat}, ${lng}, ${radiusMeters}) AND usageid = 'GARAGEP'`,
                    '$limit': 50
                }
            });

            if (geoResponse.data.length === 0) return [];

            const garages = geoResponse.data.map(item => ({
                id: item.areaid,
                name: item.areadesc,
                latitude: parseFloat(item.location.latitude),
                longitude: parseFloat(item.location.longitude),
                type: 'Garage',
                capacity: 0 // Default
            }));

            // 2. Fetch Capacity Data (b3us-f26s)
            // We get IDs to query efficiently
            const areaIds = garages.map(g => `'${g.id}'`).join(',');

            if (areaIds) {
                try {
                    const specsResponse = await axios.get('https://opendata.rdw.nl/resource/b3us-f26s.json', {
                        params: {
                            '$where': `areaid in (${areaIds})`
                        }
                    });

                    // Merge capacity
                    const specsMap = new Map<string, number>();
                    specsResponse.data.forEach((s: any) => {
                        if (s.areaid) {
                            specsMap.set(s.areaid, parseInt(s.capacity || '0'));
                        }
                    });

                    garages.forEach(g => {
                        if (specsMap.has(g.id)) {
                            // We know it exists, so ! is safe, or we can just access it.
                            g.capacity = specsMap.get(g.id) || 0;
                        }
                    });
                } catch (specError) {
                    console.error("Failed to fetch parking specs", specError);
                    // Continue without specs
                }
            }

            this.cache.set(cacheKey, garages);
            return garages;

        } catch (error) {
            console.error('Error fetching RDW Parking data:', error);
            return [];
        }
    }
}

export default new ParkingService();
