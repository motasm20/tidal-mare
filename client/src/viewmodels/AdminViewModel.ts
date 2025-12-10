import { makeAutoObservable, runInAction } from 'mobx';

import type { CarDTO, ChargingPointDTO } from '../models';
import api from '../services/ApiService';

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
                api.get('/cars'),
                api.get('/charging-points')
            ]);

            runInAction(() => {
                this.cars = carsRes.data;
                this.chargingPoints = pointsRes.data;
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
            const response = await api.post('/cars', car);
            runInAction(() => {
                this.cars.push(response.data);
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
            await api.delete(`/cars/${id}`);
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
            const response = await api.post('/charging-points', point);
            runInAction(() => {
                this.chargingPoints.push(response.data);
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
            await api.delete(`/charging-points/${id}`);
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
