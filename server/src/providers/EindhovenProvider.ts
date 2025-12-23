import axios from 'axios';
import { CarDTO, LocationDTO, ProviderType, FuelType } from '../../../shared/types';
import { ICarProvider, MatchingCriteria } from './ICarProvider';

interface EindhovenRecord {
    fields: {
        aanbieder_deelauto: string;
        geo_point_2d: [number, number];
        naam_zone: string;
        aantal_voertuigen: number;
        type_zone: string;
        status: string;
    };
}

interface EindhovenResponse {
    records: EindhovenRecord[];
}

export class EindhovenProvider implements ICarProvider {
    name = 'EindhovenProvider';
    private readonly API_URL = 'https://data.eindhoven.nl/api/records/1.0/search/?dataset=locaties-deelautos&q=&rows=1000';

    async getAvailableCars(criteria: MatchingCriteria): Promise<CarDTO[]> {
        // Note: The Eindhoven API doesn't support complex filtering by availability date/passengers directly in this endpoint
        // So we fetch all locations and map them to cars.
        // In a real app, we might check 'status' or 'aantal_voertuigen' more strictly.

        try {
            const response = await axios.get<EindhovenResponse>(this.API_URL);
            const records = response.data.records;

            const cars: CarDTO[] = [];

            records.forEach(record => {
                // If a zone has multiple vehicles, we could theoretically spawn multiple cars.
                // For this MVP/Demo, we create one representative car per zone/record.
                const count = record.fields.aantal_voertuigen || 1;

                for (let i = 0; i < count; i++) {
                    cars.push(this.mapToCarDTO(record, i));
                }
            });

            return cars;
        } catch (error) {
            console.error('Error fetching Eindhoven data:', error);
            return [];
        }
    }

    private mapToCarDTO(record: EindhovenRecord, index: number): CarDTO {
        const location: LocationDTO = {
            address: record.fields.naam_zone,
            latitude: record.fields.geo_point_2d[0],
            longitude: record.fields.geo_point_2d[1],
            label: record.fields.type_zone
        };

        // Determine provider name from dataset or default to generic
        // The dataset distinguishes provider in 'aanbieder_deelauto' (e.g. MyWheels, Amber)
        // We map this to our internal provider types if possible, or keep it generic EINDHOVEN provider
        // but maybe use the name in the model or description.

        const originalProvider = record.fields.aanbieder_deelauto;

        let mappedProvider: ProviderType = ProviderType.EINDHOVEN;
        let mappedModel = 'Shared Car';

        if (originalProvider && originalProvider.toLowerCase().includes('mywheels')) {
            mappedProvider = ProviderType.MYWHEELS;
            mappedModel = 'MyWheels Car';
        } else if (originalProvider && originalProvider.toLowerCase().includes('greenwheels')) {
            mappedProvider = ProviderType.GREENWHEELS;
            mappedModel = 'Greenwheels Car';
        }

        return {
            id: `eindhoven-${record.fields.naam_zone}-${index}`,
            make: originalProvider || 'Deelauto', // Use the provider name as "Make" for visibility e.g. "MyWheels"
            model: mappedModel,
            seats: 4, // Assumption
            luggageCapacity: 2, // Medium assumption
            fuelType: FuelType.EV, // Many shared cars in Eindhoven are EVs/Ambers
            range: 300, // Estimate
            provider: mappedProvider,
            pricePerHourEstimate: 5.00, // Placeholder
            location: location,
            imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=60', // Generic car image
            rating: 4.5
        };
    }
}
