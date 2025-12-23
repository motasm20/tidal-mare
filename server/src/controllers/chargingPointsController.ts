import { Request, Response } from 'express';
import axios from 'axios';
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

export const searchExternal = async (req: Request, res: Response) => {
    try {
        const { lat, lng, distance = 10 } = req.query;

        // Use a free API key or none (Open Charge Map allows limited non-key usage, but key is better)
        // For this demo we'll try without or use a demo key if we had one.
        const response = await axios.get('https://api.openchargemap.io/v3/poi/', {
            params: {
                output: 'json',
                latitude: lat,
                longitude: lng,
                distance: distance,
                distanceunit: 'KM',
                maxresults: 50,
                compact: true,
                verbose: false
            },
            headers: {
                // 'X-API-Key': 'YOUR_API_KEY' // TODO: Add API Key if needed
                'User-Agent': 'TidalMare/1.0'
            }
        });

        // Map to internal DTO
        const points: ChargingPointDTO[] = response.data.map((poi: any) => ({
            id: `ocm-${poi.ID}`,
            latitude: poi.AddressInfo.Latitude,
            longitude: poi.AddressInfo.Longitude,
            address: poi.AddressInfo.AddressLine1,
            city: poi.AddressInfo.Town,
            provider: poi.OperatorInfo?.Title || 'Unknown Operator',
            status: poi.StatusType?.Title === 'Operational' ? 'AVAILABLE' : 'OCCUPIED',
            powerKW: poi.Connections?.[0]?.PowerKW || 11
        }));

        res.json(points);
    } catch (error: any) {
        console.error('OCM Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch charging points' });
    }
};
