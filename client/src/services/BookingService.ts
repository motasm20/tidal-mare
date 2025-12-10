import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    query,
    where
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { BookingDTO } from "../models";

const BOOKINGS_COLLECTION = 'bookings';

export class BookingService {

    // Create a new booking
    static async createBooking(booking: Omit<BookingDTO, 'id'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
                ...booking,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (e) {
            console.error("Error creating booking: ", e);
            throw e;
        }
    }

    // Get bookings for a specific user
    static async getUserBookings(userId: string): Promise<BookingDTO[]> {
        try {
            const q = query(
                collection(db, BOOKINGS_COLLECTION),
                where("userId", "==", userId)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BookingDTO));
        } catch (e) {
            console.error("Error fetching user bookings: ", e);
            return []; // Fail gracefully
        }
    }

    // Get all bookings (for Admin)
    static async getAllBookings(): Promise<BookingDTO[]> {
        try {
            const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BookingDTO));
        } catch (e) {
            console.error("Error fetching all bookings: ", e);
            return [];
        }
    }

    // Cancel/Update booking status
    static async updateBookingStatus(id: string, status: string, reason?: string): Promise<void> {
        const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
        await updateDoc(bookingRef, { status, cancellationReason: reason });
    }

    // Get single booking details
    static async getBookingById(id: string): Promise<BookingDTO | null> {
        const docRef = doc(db, BOOKINGS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BookingDTO;
        } else {
            return null;
        }
    }
}
