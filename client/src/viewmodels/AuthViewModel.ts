import { makeAutoObservable, runInAction } from 'mobx';
import type { UserDTO } from '../models';
import { StorageService } from '../services/StorageService';
import api from '../services/ApiService';

export class AuthViewModel {
    user: UserDTO | null = null;
    isLoading: boolean = false;
    error: string | null = null;

    // Mock Sustainability Stats
    sustainabilityStats = {
        co2Saved: 124, // kg
        treesPlanted: 12,
        distance: 850 // km
    };

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
        this.checkAuth();
    }

    get isAuthenticated(): boolean {
        return !!this.user;
    }

    get isAdmin(): boolean {
        return this.user?.role === 'admin';
    }

    async login(email: string, password: string): Promise<void> {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            StorageService.setToken(token);
            runInAction(() => {
                this.user = user;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Login failed';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async register(email: string, password: string): Promise<void> {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await api.post('/auth/register', { email, password });
            const { token, user } = response.data;

            StorageService.setToken(token);
            runInAction(() => {
                this.user = user;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Registration failed';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    logout(): void {
        StorageService.removeToken();
        this.user = null;
    }

    private checkAuth(): void {
        const token = StorageService.getToken();
        if (token) {
            // Ideally verify token with backend
            // For now, just assume logged in if token exists (and maybe decode it later)
            this.user = { id: '1', email: 'restored@example.com', role: 'customer' }; // Placeholder
        }
    }
}
