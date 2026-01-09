import { CarDTO, LocationDTO } from '../../../shared/types';
import { ICarProvider, MatchingCriteria } from '../providers/ICarProvider';
import { DummyProvider } from '../providers/DummyProvider';
import { GreenWheelsPlaceholder } from '../providers/GreenWheelsPlaceholder';
import { MyWheelsPlaceholder } from '../providers/MyWheelsPlaceholder';

import { EindhovenProvider } from '../providers/EindhovenProvider';
import { NationalProvider } from '../providers/NationalProvider';

class MatchingService {
    private providers: ICarProvider[] = [
        new DummyProvider(),
        new GreenWheelsPlaceholder(),
        new MyWheelsPlaceholder(),
        new EindhovenProvider(),
        new NationalProvider()
    ];

    async findMatches(criteria: MatchingCriteria): Promise<CarDTO[]> {
        const results = await Promise.all(this.providers.map(p => p.getAvailableCars(criteria)));
        const allCars = results.flat();

        // Filter based on criteria (double check in case providers return non-compliant cars)
        const suitableCars = allCars.filter(car => {
            // Check seats
            if (car.seats < criteria.passengers) return false;

            // Check luggage (simple check: car capacity >= requested)
            if (car.luggageCapacity < criteria.luggageLevel) return false;

            // Check range (simple distance calc)
            const distance = this.calculateDistance(criteria.startLocation, criteria.endLocation);
            if (car.range && car.range < distance) return false;

            return true;
        });

        // Sort by price estimate (cheapest first)
        return suitableCars.sort((a, b) => a.pricePerHourEstimate - b.pricePerHourEstimate);
    }

    private calculateDistance(start: LocationDTO, end: LocationDTO): number {
        // Simple Haversine or dummy distance
        // For MVP, just return a dummy distance or calculate if coords exist
        if (start.latitude && start.longitude && end.latitude && end.longitude) {
            // ... calc
            return 50; // Dummy 50km
        }
        return 50;
    }
}

export default new MatchingService();
