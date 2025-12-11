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

    private getFriendlyErrorMessage(error: any): string {
        const code = error.code || '';
        const message = error.message || '';

        switch (code) {
            case 'auth/email-already-in-use':
                return 'Dit e-mailadres is al in gebruik. Log in of probeer een ander adres.';
            case 'auth/invalid-email':
                return 'Het opgegeven e-mailadres is ongeldig.';
            case 'auth/weak-password':
                return 'Het wachtwoord is te zwak. Gebruik minimaal 6 tekens.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Ongeldig e-mailadres of wachtwoord.';
            case 'auth/too-many-requests':
                return 'Te veel mislukte pogingen. Probeer het later opnieuw.';
            case 'auth/network-request-failed':
                return 'Er is een netwerkfout opgetreden. Controleer je verbinding.';
            case 'auth/requires-recent-login':
                return 'Voor deze actie moet je opnieuw inloggen.';
            default:
                if (message.includes('email-already-in-use')) return 'Dit e-mailadres is al in gebruik.';
                return 'Er is een fout opgetreden. Probeer het opnieuw.';
        }
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
                this.error = this.getFriendlyErrorMessage(e);
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
                this.error = this.getFriendlyErrorMessage(e);
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
                console.error("Guest login error:", e);
                this.error = this.getFriendlyErrorMessage(e);
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }



    // ... (rest of the file until register)

    async register(email: string, password: string): Promise<void> {
        this.isLoading = true;
        this.error = null;

        // Unsubscribe from auth listener to prevent "flash" of logged-in state
        // because Firebase automatically logs in the user after creation.
        if (this.unsubscribeAuth) {
            this.unsubscribeAuth();
            this.unsubscribeAuth = null;
        }

        try {
            await AuthService.register(email, password);
            // User requested no auto-login. Force logout so they must verify and login manually.
            await AuthService.logout();
            runInAction(() => {
                this.user = null;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = this.getFriendlyErrorMessage(e);
            });
            throw e;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
            // Re-subscribe to auth changes
            this.checkAuth();
        }
    }

    async logout(): Promise<void> {
        try {
            await AuthService.logout();
            runInAction(() => {
                this.user = null;
            });
        } catch (e: any) {
            console.error("Logout failed:", e);
        }
    }

    async deleteAccount(): Promise<void> {
        this.isLoading = true;
        try {
            await AuthService.deleteAccount();
            runInAction(() => {
                this.user = null;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = this.getFriendlyErrorMessage(e);
            });
            throw e;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async resetPassword(email: string): Promise<void> {
        this.isLoading = true;
        this.error = null;
        try {
            await AuthService.resetPassword(email);
        } catch (e: any) {
            runInAction(() => {
                this.error = this.getFriendlyErrorMessage(e);
            });
            throw e;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async resendVerificationEmail(): Promise<void> {
        this.isLoading = true;
        try {
            await AuthService.resendCurrentVerificationEmail();
        } catch (e: any) {
            runInAction(() => {
                this.error = this.getFriendlyErrorMessage(e);
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    private unsubscribeAuth: (() => void) | null = null;

    private checkAuth(): void {
        // Ensure we don't have multiple subscriptions
        if (this.unsubscribeAuth) {
            this.unsubscribeAuth();
        }

        this.unsubscribeAuth = AuthService.onAuthStateChanged(async (user) => {
            if (user) {
                // If anonymous, generic guest role
                if (user.isAnonymous) {
                    runInAction(() => {
                        this.user = {
                            id: user.uid,
                            email: 'guest@tidalmare.com',
                            role: 'guest'
                        };
                    });
                    return;
                }

                // If logged in, fetch their profile for the REAL role
                try {
                    const profile = await AuthService.getUserProfile(user.uid);
                    runInAction(() => {
                        this.user = {
                            id: user.uid,
                            email: user.email || '',
                            role: profile?.role || 'customer' // Fallback to customer
                        };
                    });
                } catch (e) {
                    // Fallback if fetch fails
                    runInAction(() => {
                        this.user = {
                            id: user.uid,
                            email: user.email || '',
                            role: 'customer'
                        };
                    });
                }
            } else {
                runInAction(() => {
                    this.user = null;
                });
            }
        });
    }
}
