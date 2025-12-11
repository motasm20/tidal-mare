import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    signInAnonymously,
    sendEmailVerification
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { StorageService } from "./StorageService";

export class AuthService {
    static async login(email: string, password: string): Promise<User> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        StorageService.setToken(token);
        return userCredential.user;
    }

    static async loginWithGoogle(): Promise<User> {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const token = await user.getIdToken();
        StorageService.setToken(token);

        // Check if user exists, if not create record
        await this.createUserDocument(user);

        return user;
    }

    static async loginAnonymously(): Promise<User> {
        const userCredential = await signInAnonymously(auth);
        const token = await userCredential.user.getIdToken();
        StorageService.setToken(token);
        // We typically don't create a permanent user doc for guests unless they convert, 
        // but we could track them if needed. For now, skip.
        return userCredential.user;
    }

    static async register(email: string, password: string): Promise<User> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        StorageService.setToken(token);

        // Create user document
        await this.createUserDocument(user);

        // Send verification email
        await this.sendVerificationEmail(user);

        return user;
    }

    static async sendVerificationEmail(user: User): Promise<void> {
        await sendEmailVerification(user);
    }

    static async resetPassword(email: string): Promise<void> {
        await sendPasswordResetEmail(auth, email);
    }

    static async logout(): Promise<void> {
        await signOut(auth);
        StorageService.removeToken();
    }

    static onAuthStateChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    }

    // Helper: Get user profile data (role, etc)
    static async getUserProfile(uid: string): Promise<any> {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    }

    // Helper: Create user document if it doesn't exist
    private static async createUserDocument(user: User) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                role: 'customer', // Default role
                createdAt: new Date().toISOString(),
                displayName: user.displayName || '',
                photoURL: user.photoURL || ''
            });
        }
    }
    // Helper: Update user profile
    static async updateUserProfile(uid: string, data: any): Promise<void> {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, data, { merge: true });
    }
}
