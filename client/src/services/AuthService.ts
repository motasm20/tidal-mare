import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../config/firebase";
import { StorageService } from "./StorageService";

export class AuthService {
    static async login(email: string, password: string): Promise<User> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        StorageService.setToken(token); // Keep using StorageService for now if other things rely on it
        return userCredential.user;
    }

    static async loginWithGoogle(): Promise<User> {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const token = await userCredential.user.getIdToken();
        StorageService.setToken(token);
        return userCredential.user;
    }

    static async register(email: string, password: string): Promise<User> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        StorageService.setToken(token);
        return userCredential.user;
    }

    static async logout(): Promise<void> {
        await signOut(auth);
        StorageService.removeToken();
    }

    static onAuthStateChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    }
}
