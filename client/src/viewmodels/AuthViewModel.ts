import { makeAutoObservable, runInAction } from 'mobx';
import type { UserDTO } from '../models';
import { AuthService } from '../services/AuthService';

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
            const user = await AuthService.login(email, password);
            runInAction(() => {
                // Map Firebase user to UserDTO
                this.user = {
                    id: user.uid,
                    email: user.email || '',
                    role: 'customer' // Default role for now, or fetch from Firestore if we store roles there
                };
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.message || 'Login failed';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async loginWithGoogle(): Promise<void> {
        this.isLoading = true;
        this.error = null;
        try {
            const user = await AuthService.loginWithGoogle();
            runInAction(() => {
                this.user = {
                    id: user.uid,
                    email: user.email || '',
                    role: 'customer'
                };
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.message || 'Google login failed';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async loginAnonymously(): Promise<void> {
        this.isLoading = true;
        this.error = null;
        try {
            const user = await AuthService.loginAnonymously();
            runInAction(() => {
                this.user = {
                    id: user.uid,
                    email: 'guest@tidalmare.com', // Mock email for guest
                    role: 'guest'
                };
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.message || 'Anonymous login failed';
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
            const user = await AuthService.register(email, password);
            runInAction(() => {
                this.user = {
                    id: user.uid,
                    email: user.email || '',
                    role: 'customer'
                };
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.message || 'Registration failed';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    logout(): void {
        AuthService.logout();
        this.user = null;
    }

    private checkAuth(): void {
        AuthService.onAuthStateChanged((user) => {
            runInAction(() => {
                if (user) {
                    this.user = {
                        id: user.uid,
                        email: user.email || '',
                        role: 'customer'
                    };
                } else {
                    this.user = null;
                }
            });
        });
    }
}
