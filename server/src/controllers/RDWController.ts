
import { Request, Response } from 'express';
import RDWService from '../services/RDWService';

export class RDWController {

    async getSpecs(req: Request, res: Response) {
        try {
            const { make, model } = req.query;

            if (!make || !model) {
                return res.status(400).json({ error: "Make and Model are required" });
            }

            const specs = await RDWService.getSpecsForModel(String(make), String(model));

            if (!specs) {
                return res.status(404).json({ error: "Vehicle specs not found" });
            }

            res.json(specs);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
