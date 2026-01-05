
import { Request, Response } from 'express';
import RoutingService from '../services/RoutingService';

export class RoutingController {

    async getRoute(req: Request, res: Response) {
        try {
            const { startLat, startLng, endLat, endLng, mode } = req.query;

            if (!startLat || !startLng || !endLat || !endLng) {
                return res.status(400).json({ error: "Missing coordinates" });
            }

            const routeMode = (mode === 'driving') ? 'driving' : 'walking';

            const parsedStartLat = parseFloat(startLat as string);
            const parsedStartLng = parseFloat(startLng as string);
            const parsedEndLat = parseFloat(endLat as string);
            const parsedEndLng = parseFloat(endLng as string);

            if (isNaN(parsedStartLat) || isNaN(parsedStartLng) || isNaN(parsedEndLat) || isNaN(parsedEndLng)) {
                return res.status(400).json({ error: "Invalid coordinate values" });
            }

            const route = await RoutingService.getRoute(
                parsedStartLat,
                parsedStartLng,
                parsedEndLat,
                parsedEndLng,
                routeMode
            );
            if (!route) {
                return res.status(404).json({ error: "Route not found" });
            }

            res.json(route);

        } catch (error) {
            console.error("Routing error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
