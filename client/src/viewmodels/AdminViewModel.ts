import { makeAutoObservable, runInAction } from 'mobx';

import type { CarDTO, ChargingPointDTO } from '../models';
import { AdminService } from '../services/AdminService';

export class AdminViewModel {
    cars: CarDTO[] = [];
    chargingPoints: ChargingPointDTO[] = [];
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    async loadData() {
        this.isLoading = true;
        try {
            const [carsRes, pointsRes] = await Promise.all([
                AdminService.getCars(),
                AdminService.getChargingPoints()
            ]);

            runInAction(() => {
                this.cars = carsRes;
                this.chargingPoints = pointsRes;
            });
        } catch (e) {
            console.error("Failed to load admin data", e);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async addCar(car: Omit<CarDTO, 'id'>) {
        this.isLoading = true;
        try {
            const newCar = await AdminService.addCar(car);
            runInAction(() => {
                this.cars.push(newCar);
            });
        } catch (e) {
            console.error("Failed to add car", e);
            throw e;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async deleteCar(id: string) {
        this.isLoading = true;
        try {
            await AdminService.deleteCar(id);
            runInAction(() => {
                this.cars = this.cars.filter(c => c.id !== id);
            });
        } catch (e) {
            console.error("Failed to delete car", e);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async addChargingPoint(point: Omit<ChargingPointDTO, 'id'>) {
        this.isLoading = true;
        try {
            const newPoint = await AdminService.addChargingPoint(point);
            runInAction(() => {
                this.chargingPoints.push(newPoint);
            });
        } catch (e) {
            console.error("Failed to add charging point", e);
            throw e;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async deleteChargingPoint(id: string) {
        this.isLoading = true;
        try {
            await AdminService.deleteChargingPoint(id);
            runInAction(() => {
                this.chargingPoints = this.chargingPoints.filter(cp => cp.id !== id);
            });
        } catch (e) {
            console.error("Failed to delete charging point", e);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}
