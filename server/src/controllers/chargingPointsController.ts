import { Request, Response } from 'express';
import ChargingPointsRepo from '../repositories/ChargingPointsRepo';
import { ChargingPointDTO } from '../../../shared/types';

export const getAllPoints = async (req: Request, res: Response) => {
    const points = await ChargingPointsRepo.findAll();
    res.json(points);
};

export const createPoint = async (req: Request, res: Response) => {
    try {
        const pointData = req.body as ChargingPointDTO;
        const newPoint = await ChargingPointsRepo.add({ ...pointData, id: Math.random().toString() });
        res.status(201).json(newPoint);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updatePoint = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body as Partial<ChargingPointDTO>;
        const updatedPoint = await ChargingPointsRepo.update(id, updates);
        if (!updatedPoint) {
            return res.status(404).json({ message: 'Charging point not found' });
        }
        res.json(updatedPoint);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePoint = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const success = await ChargingPointsRepo.delete(id);
        if (!success) {
            return res.status(404).json({ message: 'Charging point not found' });
        }
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
