import { makeAutoObservable, runInAction } from 'mobx';
import type { UserDTO } from '../models';
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

    async updateProfile(updates: Partial<UserDTO>) {
        if (!this.user) return;
        this.isLoading = true;
        try {
            await AuthService.updateUserProfile(this.user.id, updates);

            runInAction(() => {
                if (this.user) {
                    this.user = { ...this.user, ...updates };
                }
            });
        } catch (e) {
            console.error("Failed to update profile", e);
            throw e;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}
