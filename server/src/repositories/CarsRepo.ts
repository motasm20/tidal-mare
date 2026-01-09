import { CarDTO, FuelType, ProviderType } from '../../../shared/types';

class CarsRepo {
    private cars: CarDTO[] = [
        {
            id: 'c1',
            make: 'Tesla',
            model: 'Model 3',
            seats: 5,
            luggageCapacity: 2,
            fuelType: FuelType.EV,
            provider: ProviderType.DUMMY,
            pricePerHourEstimate: 15,
            range: 400,
            location: { latitude: 51.4416, longitude: 5.4697, address: 'Strijp-S, Eindhoven' }
        },
        {
            id: 'c2',
            make: 'Volkswagen',
            model: 'ID.3',
            seats: 5,
            luggageCapacity: 2,
            fuelType: FuelType.EV,
            provider: ProviderType.GREENWHEELS,
            pricePerHourEstimate: 8,
            range: 350,
            location: { latitude: 51.4380, longitude: 5.4750, address: 'Centrum, Eindhoven' }
        },
        {
            id: 'c3',
            make: 'Kia',
            model: 'Niro',
            seats: 5,
            luggageCapacity: 3,
            fuelType: FuelType.EV,
            provider: ProviderType.MYWHEELS,
            pricePerHourEstimate: 9,
            range: 450,
            location: { latitude: 51.4500, longitude: 5.4600, address: 'Woensel, Eindhoven' }
        },
        {
            id: 'c4',
            make: 'Hyundai',
            model: 'Kona',
            seats: 5,
            luggageCapacity: 2,
            fuelType: FuelType.HYBRID,
            provider: ProviderType.DUMMY,
            pricePerHourEstimate: 7,
            range: 600,
            location: { latitude: 51.4600, longitude: 5.4500, address: 'Best, Eindhoven' }
        }
    ];

    async findAll(): Promise<CarDTO[]> {
        return this.cars;
    }

    async findById(id: string): Promise<CarDTO | undefined> {
        return this.cars.find(c => c.id === id);
    }

    async add(car: CarDTO): Promise<CarDTO> {
        this.cars.push(car);
        return car;
    }
    async update(id: string, carData: Partial<CarDTO>): Promise<CarDTO | undefined> {
        const index = this.cars.findIndex(c => c.id === id);
        if (index === -1) return undefined;
        this.cars[index] = { ...this.cars[index], ...carData };
        return this.cars[index];
    }

    async delete(id: string): Promise<boolean> {
        const index = this.cars.findIndex(c => c.id === id);
        if (index === -1) return false;
        this.cars.splice(index, 1);
        return true;
    }
}

export default new CarsRepo();
