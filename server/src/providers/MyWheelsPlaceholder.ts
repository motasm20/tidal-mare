import { ICarProvider, MatchingCriteria } from './ICarProvider';
import { CarDTO } from '../../../shared/types';

export class MyWheelsPlaceholder implements ICarProvider {
    name = 'MyWheels';

    async getAvailableCars(criteria: MatchingCriteria): Promise<CarDTO[]> {
        // TODO: Integrate with MyWheels API
        // GET https://api.mywheels.nl/api/v1/search...

        return [];
    }
}
