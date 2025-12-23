
import { Request, Response } from 'express';
import ParkingService from '../services/ParkingService';

export class ParkingController {

    async searchGarages(req: Request, res: Response) {
        try {
            const { lat, lng, distance } = req.query;

            if (!lat || !lng) {
                return res.status(400).json({ error: "Lat and Lng are required" });
            }

            const radius = distance ? parseFloat(String(distance)) : 5; // Default 5km

            const garages = await ParkingService.getGarages(
                parseFloat(String(lat)),
                parseFloat(String(lng)),
                radius
            );

            res.json(garages);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
