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
            range: 400
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
