import { Request, Response } from 'express';
import UsersRepo from '../repositories/UsersRepo';
import { LocationDTO } from '../../../shared/types';

export const updateLocations = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { homeLocation, workLocation } = req.body as { homeLocation?: LocationDTO, workLocation?: LocationDTO };

    try {
        const updatedUser = await UsersRepo.updateLocations(req.user.userId, { homeLocation, workLocation });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Using findByEmail since DTO doesn't have a simple findById public accessor although repo has private array.
    // Ideally repo should have findById. Let's rely on findByEmail if we assume we might lack findById in repo for now, OR update Repo.
    // Checking UsersRepo, it only has findByEmail. I should add findById or just iterate.
    // Wait, updateLocations already uses id.

    // Quick fix: Implementation detail, let's just use what we have in Repo or assume findById exists (it doesn't yet).
    // I will add findById to Repo in next step if needed, but for now updateLocations returns the user, so Profile page can use that or local state.
    // But usually /me GET is needed.
    res.status(501).json({ message: 'Not implemented' });
};
