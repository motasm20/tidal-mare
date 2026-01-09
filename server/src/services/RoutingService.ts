
import axios from 'axios';
import NodeCache from 'node-cache';

interface RouteResult {
    distance: number; // meters
    duration: number; // seconds
    geometry: any; // GeoJSON LineString
}

class RoutingService {
    private cache: NodeCache;
    private readonly OSRM_BASE_URL = process.env.OSRM_BASE_URL || 'http://router.project-osrm.org/route/v1';

    constructor() {
        this.cache = new NodeCache({ stdTTL: 3600 }); // Cache routes for 1 hour (walking routes don't change much)
    }

    async getRoute(startLat: number, startLng: number, endLat: number, endLng: number, mode: 'walking' | 'driving' = 'walking'): Promise<RouteResult | null> {
        const cacheKey = `${mode}_${startLat.toFixed(4)}_${startLng.toFixed(4)}_${endLat.toFixed(4)}_${endLng.toFixed(4)}`;
        const cached = this.cache.get<RouteResult>(cacheKey);
        if (cached) return cached;

        try {
            // OSRM profiles: foot, driving (car)
            const profile = mode === 'walking' ? 'foot' : 'driving';
            const url = `${this.OSRM_BASE_URL}/${profile}/${startLng},${startLat};${endLng},${endLat}`;

            const response = await axios.get(url, {
                params: {
                    overview: 'full',
                    geometries: 'geojson'
                },
                timeout: 10000 // 10 second timeout
            });
            if (response.data.code !== 'Ok' || !response.data.routes || response.data.routes.length === 0) {
                return null;
            }

            const route = response.data.routes[0];

            if (!route.distance || !route.duration || !route.geometry) {
                console.error('Invalid route data from OSRM:', route);
                return null;
            }

            const result: RouteResult = {
                distance: route.distance,
                duration: route.duration,
                geometry: route.geometry
            };
            this.cache.set(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Error fetching OSRM route:', error);
            // Don't crash, just return null so UI can degrade gracefully (straight line)
            return null;
        }
    }
}

export default new RoutingService();
