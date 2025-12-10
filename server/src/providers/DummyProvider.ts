import { ICarProvider, MatchingCriteria } from './ICarProvider';
import { CarDTO } from '../../../shared/types';
import CarsRepo from '../repositories/CarsRepo';

export class DummyProvider implements ICarProvider {
    name = 'DummyProvider';

    async getAvailableCars(criteria: MatchingCriteria): Promise<CarDTO[]> {
        // In a real scenario, this would filter based on criteria
        // For now, we just return all cars from the repo that match basic filters
        const allCars = await CarsRepo.findAll();
        return allCars.filter(car => car.provider === 'DUMMY');
    }
}
