import { ChargingPointDTO } from '../../../shared/types';

class ChargingPointsRepo {
    private points: ChargingPointDTO[] = [
        {
            id: 'cp1',
            name: 'Fastned Amsterdam',
            latitude: 52.3,
            longitude: 4.9,
            connectorType: 'CCS',
            status: 'AVAILABLE'
        }
    ];

    async findAll(): Promise<ChargingPointDTO[]> {
        return this.points;
    }

    async add(point: ChargingPointDTO): Promise<ChargingPointDTO> {
        this.points.push(point);
        return point;
    }
    async update(id: string, pointData: Partial<ChargingPointDTO>): Promise<ChargingPointDTO | undefined> {
        const index = this.points.findIndex(cp => cp.id === id);
        if (index === -1) return undefined;
        this.points[index] = { ...this.points[index], ...pointData };
        return this.points[index];
    }

    async delete(id: string): Promise<boolean> {
        const index = this.points.findIndex(cp => cp.id === id);
        if (index === -1) return false;
        this.points.splice(index, 1);
        return true;
    }
}

export default new ChargingPointsRepo();
