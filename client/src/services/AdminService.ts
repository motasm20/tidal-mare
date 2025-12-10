import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { CarDTO, ChargingPointDTO } from "../models";

export class AdminService {
    static async getCars(): Promise<CarDTO[]> {
        const snapshot = await getDocs(collection(db, 'cars'));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CarDTO));
    }

    static async addCar(car: any): Promise<CarDTO> {
        const ref = await addDoc(collection(db, 'cars'), car);
        return { id: ref.id, ...car };
    }

    static async deleteCar(id: string): Promise<void> {
        await deleteDoc(doc(db, 'cars', id));
    }

    static async getChargingPoints(): Promise<ChargingPointDTO[]> {
        const snapshot = await getDocs(collection(db, 'charging_points'));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChargingPointDTO));
    }

    static async addChargingPoint(point: any): Promise<ChargingPointDTO> {
        const ref = await addDoc(collection(db, 'charging_points'), point);
        return { id: ref.id, ...point };
    }

    static async deleteChargingPoint(id: string): Promise<void> {
        await deleteDoc(doc(db, 'charging_points', id));
    }
}
