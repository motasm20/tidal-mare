
import axios from 'axios';
import NodeCache from 'node-cache';

interface RDWVehicle {
    kenteken: string;
    merk: string;
    handelsbenaming: string;
    inrichting: string;
    massa_ledig_voertuig: string;
    eerste_kleur: string;
    datum_eerste_toelating: string;
    brandstof_omschrijving?: string; // Often in secondary link, but checking main first
}

export interface VehicleSpecs {
    make: string;
    model: string;
    massKg: number;
    color: string;
    year: number;
    description: string;
}

class RDWService {
    private cache: NodeCache;
    private readonly BASE_URL = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json';

    constructor() {
        this.cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
    }

    async getSpecsForModel(make: string, model: string): Promise<VehicleSpecs | null> {
        const cacheKey = `${make}-${model}`.toUpperCase();
        const cached = this.cache.get<VehicleSpecs>(cacheKey);
        if (cached) return cached;

        try {
            // Find a recent example of this car on the road to get specs
            // We sort by date DESC to get a new one
            const response = await axios.get<RDWVehicle[]>(this.BASE_URL, {
                params: {
                    merk: make.toUpperCase(),
                    handelsbenaming: model.toUpperCase(), // This is tricky, exact match needed often
                    '$limit': 1,
                    '$order': 'datum_eerste_toelating DESC'
                }
            });

            if (response.data.length === 0) {
                // Try fuzzy search or just failed
                // Fallback: Try searching just matching the model string loosely if possible (Socrata supports `q`)
                const fuzzyResponse = await axios.get<RDWVehicle[]>(this.BASE_URL, {
                    params: {
                        '$where': `merk like '%${make.toUpperCase()}%' AND handelsbenaming like '%${model.toUpperCase()}%'`,
                        '$limit': 1
                    }
                });

                if (fuzzyResponse.data.length > 0) {
                    return this.mapToSpecs(fuzzyResponse.data[0]);
                }
                return null;
            }

            const specs = this.mapToSpecs(response.data[0]);
            this.cache.set(cacheKey, specs);
            return specs;

        } catch (error) {
            console.error('Error fetching RDW data:', error);
            return null;
        }
    }

    private mapToSpecs(rdw: RDWVehicle): VehicleSpecs {
        return {
            make: rdw.merk,
            model: rdw.handelsbenaming,
            massKg: parseInt(rdw.massa_ledig_voertuig || '0'),
            color: rdw.eerste_kleur,
            year: parseInt((rdw.datum_eerste_toelating || '0000').substring(0, 4)),
            description: rdw.inrichting
        };
    }
}

export default new RDWService();
