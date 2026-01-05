
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
    consumption?: number; // L/100km or kWh/100km
    fuelType?: string;
}

interface RDWFuel {
    kenteken: string;
    brandstof_omschrijving: string;
    brandstofverbruik_gecombineerd?: string; // L/100km
    elektriciteitsverbruik_gecombineerd_wltp?: string; // Wh/km
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
                    const fuzzyVehicle = fuzzyResponse.data[0];
                    const specs = this.mapToSpecs(fuzzyVehicle);
                    const fuelData = await this.getFuelConsumption(fuzzyVehicle.kenteken);
                    if (fuelData) {
                        specs.consumption = fuelData.consumption;
                        specs.fuelType = fuelData.fuelType;
                    }
                    this.cache.set(cacheKey, specs);
                    return specs;
                }
                return null;
            }

            const rdwVehicle = response.data[0];
            const specs = this.mapToSpecs(rdwVehicle);

            // Enrich with fuel consumption
            const fuelData = await this.getFuelConsumption(rdwVehicle.kenteken);
            if (fuelData) {
                specs.consumption = fuelData.consumption;
                specs.fuelType = fuelData.fuelType;
            }

            this.cache.set(cacheKey, specs);
            return specs;

        } catch (error) {
            console.error('Error fetching RDW data:', error);
            return null;
        }
    }

    private async getFuelConsumption(kenteken: string): Promise<{ consumption: number; fuelType: string } | undefined> {
        try {
            const response = await axios.get<RDWFuel[]>('https://opendata.rdw.nl/resource/8ys7-d773.json', {
                params: {
                    kenteken: kenteken
                }
            });

            if (response.data.length > 0) {
                const fuel = response.data[0];
                // Check electric first
                if (fuel.elektriciteitsverbruik_gecombineerd_wltp) {
                    const whPerKm = parseInt(fuel.elektriciteitsverbruik_gecombineerd_wltp, 10);
                    if (!isNaN(whPerKm)) {
                        return {
                            consumption: (whPerKm * 100) / 1000,
                            fuelType: 'Elektriciteit'
                        };
                    }
                }
                // Check fossil
                if (fuel.brandstofverbruik_gecombineerd) {
                    const liters = parseFloat(fuel.brandstofverbruik_gecombineerd);
                    if (!isNaN(liters)) {
                        return {
                            consumption: liters,
                            fuelType: fuel.brandstof_omschrijving || 'Brandstof'
                        };
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to fetch fuel data for', kenteken);
        }
        return undefined;
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
