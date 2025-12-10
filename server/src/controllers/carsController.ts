import { Request, Response } from 'express';
import CarsRepo from '../repositories/CarsRepo';
import { CarDTO } from '../../../shared/types';

export const getAllCars = async (req: Request, res: Response) => {
    const cars = await CarsRepo.findAll();
    res.json(cars);
};

export const createCar = async (req: Request, res: Response) => {
    try {
        const carData = req.body as CarDTO;
        // Basic validation could go here
        const newCar = await CarsRepo.add({ ...carData, id: Math.random().toString() });
        res.status(201).json(newCar);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCar = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body as Partial<CarDTO>;
        const updatedCar = await CarsRepo.update(id, updates);
        if (!updatedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(updatedCar);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCar = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const success = await CarsRepo.delete(id);
        if (!success) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
