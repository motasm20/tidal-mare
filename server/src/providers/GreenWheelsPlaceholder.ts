import { ICarProvider, MatchingCriteria } from './ICarProvider';
import { CarDTO } from '../../../shared/types';

export class GreenWheelsPlaceholder implements ICarProvider {
    name = 'GreenWheels';

    async getAvailableCars(criteria: MatchingCriteria): Promise<CarDTO[]> {
        // TODO: Integrate with GreenWheels API
        // GET https://api.greenwheels.com/v1/search?lat=...&lng=...

        // Return empty list or mock data for now
        return [];
    }
}
