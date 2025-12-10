import { makeAutoObservable, runInAction } from 'mobx';
import type { LocationDTO, UserDTO } from '../models';
import api from '../services/ApiService';

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
        this.isLoading = true;
        try {
            const response = await api.put('/users/me/locations', {
                homeLocation,
                workLocation
            });
            runInAction(() => {
                this.user = response.data;
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
