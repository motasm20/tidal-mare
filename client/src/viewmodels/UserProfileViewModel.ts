import { makeAutoObservable, runInAction } from 'mobx';
import type { LocationDTO, UserDTO } from '../models';
import { AuthService } from '../services/AuthService';

export class UserProfileViewModel {
    user: UserDTO | null = null;
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: UserDTO) {
        this.user = user;
    }

    async updateLocations(homeLocation?: LocationDTO, workLocation?: LocationDTO) {
        if (!this.user) return;
        this.isLoading = true;
        try {
            const updates: any = {};
            if (homeLocation) updates.homeLocation = homeLocation;
            if (workLocation) updates.workLocation = workLocation;

            await AuthService.updateUserProfile(this.user.id, updates);

            runInAction(() => {
                if (this.user) {
                    if (homeLocation) this.user.homeLocation = homeLocation;
                    if (workLocation) this.user.workLocation = workLocation;
                }
            });
        } catch (e) {
            console.error("Failed to update profile locations", e);
            throw e;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}
