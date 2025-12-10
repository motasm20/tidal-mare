import { CarDTO, LocationDTO } from '../../../shared/types';

export interface MatchingCriteria {
    startLocation: LocationDTO;
    endLocation: LocationDTO;
    passengers: number;
    luggageLevel: number;
    dateTime: string;
}

export interface ICarProvider {
    name: string;
    getAvailableCars(criteria: MatchingCriteria): Promise<CarDTO[]>;
}
