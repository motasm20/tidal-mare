import { Request, Response } from 'express';
import MatchingService from '../services/MatchingService';

export const findMatches = async (req: Request, res: Response) => {
    try {
        const criteria = req.body;
        const matches = await MatchingService.findMatches(criteria);
        res.json(matches);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
