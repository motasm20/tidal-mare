import { makeAutoObservable, runInAction } from 'mobx';
import { BookingStatus } from '../models';
import type { CarDTO } from '../models';
import axios from 'axios';
import { BookingService } from '../services/BookingService';
import { auth } from '../config/firebase'; // Direct access to user ID
import type { AddressSuggestion } from '../services/AddressSuggestionService';

export class BookingViewModel {
    // Start Address Fields
    startStreet: string = '';
    startHouseNumber: string = '';
    startPostcode: string = '';
    startCity: string = '';
    startCountry: string = 'Nederland';
    isStartAddressValid: boolean = false;
    startLat: number | null = null;
    startLng: number | null = null;

    // End Address Fields
    endStreet: string = '';
    endHouseNumber: string = '';
    endPostcode: string = '';
    endCity: string = '';
    endCountry: string = 'Nederland';
    isEndAddressValid: boolean = false;
    endLat: number | null = null;
    endLng: number | null = null;

    // Other Booking Info
    bookingNote: string = '';
    dateTime: string = new Date().toISOString();
    passengers: number = 1;
    luggageLevel: number = 0; // 0=none, 1=small, 2=medium, 3=large

    availableCars: CarDTO[] = [];
    selectedCar: CarDTO | null = null;

    isLoading: boolean = false;
    error: string | null = null;
    bookingStatus: BookingStatus | null = null;

    selectedBookingDetails: any | null = null;
    isCancelling: boolean = false;
    showValidationErrors: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    // --- Actions: Address Handling ---

    setStartAddress(suggestion: AddressSuggestion) {
        this.startStreet = suggestion.street;
        this.startHouseNumber = suggestion.houseNumber;
        this.startPostcode = suggestion.postcode;
        this.startCity = suggestion.city;
        this.startCountry = suggestion.country;
        this.startLat = suggestion.latitude;
        this.startLng = suggestion.longitude;
        this.isStartAddressValid = true;
    }

    setEndAddress(suggestion: AddressSuggestion) {
        this.endStreet = suggestion.street;
        this.endHouseNumber = suggestion.houseNumber;
        this.endPostcode = suggestion.postcode;
        this.endCity = suggestion.city;
        this.endCountry = suggestion.country;
        this.endLat = suggestion.latitude;
        this.endLng = suggestion.longitude;
        this.isEndAddressValid = true;
    }

    updateStartField(field: 'street' | 'houseNumber' | 'postcode' | 'city', value: string) {
        if (field === 'street') {
            this.startStreet = value;
            // Clear other fields to prevent ghosting in the concatenated input value
            this.startHouseNumber = '';
            this.startPostcode = '';
            this.startCity = '';
        } else if (field === 'houseNumber') {
            this.startHouseNumber = value;
        } else if (field === 'postcode') {
            this.startPostcode = value;
        } else if (field === 'city') {
            this.startCity = value;
        }

        this.isStartAddressValid = false; // Require selection again
    }

    updateEndField(field: 'street' | 'houseNumber' | 'postcode' | 'city', value: string) {
        if (field === 'street') {
            this.endStreet = value;
            // Clear other fields to prevent ghosting in the concatenated input value
            this.endHouseNumber = '';
            this.endPostcode = '';
            this.endCity = '';
        } else if (field === 'houseNumber') {
            this.endHouseNumber = value;
        } else if (field === 'postcode') {
            this.endPostcode = value;
        } else if (field === 'city') {
            this.endCity = value;
        }

        this.isEndAddressValid = false;
    }

    setPassengers(count: number) {
        this.passengers = count;
    }

    setLuggageLevel(level: number) {
        this.luggageLevel = level;
    }

    setBookingNote(note: string) {
        this.bookingNote = note;
    }

    // --- Validation Helper ---
    get canSearch(): boolean {
        return this.isStartAddressValid && this.isEndAddressValid && this.passengers > 0;
    }

    // --- Actions: Search & Book ---

    async searchCars() {
        this.showValidationErrors = true;

        if (!this.canSearch) {
            runInAction(() => { this.error = "Vul a.u.b. geldige start- en eindadressen in."; });
            return;
        }

        this.isLoading = true;
        this.error = null;
        this.availableCars = [];

        try {
            const criteria = {
                startLocation: {
                    address: this.startAddressSummary,
                    latitude: this.startLat || 51.4416,
                    longitude: this.startLng || 5.4697
                },
                endLocation: {
                    address: this.endAddressSummary,
                    latitude: this.endLat || 51.4416,
                    longitude: this.endLng || 5.4697
                },
                dateTime: this.dateTime,
                passengers: this.passengers,
                luggageLevel: this.luggageLevel
            };

            const response = await axios.post('http://localhost:3000/api/matching/search', criteria);

            runInAction(() => {
                this.availableCars = response.data;
                this.isLoading = false;
            });
        } catch (err) {
            runInAction(() => {
                console.error("Search failed", err);
                this.error = "Er ging iets mis bij het zoeken naar auto's.";
                this.isLoading = false;
            });
        }
    }

    selectCar(car: CarDTO) {
        this.selectedCar = car;
    }

    async confirmBooking() {
        if (!this.selectedCar || !this.isStartAddressValid || !this.isEndAddressValid) return;

        const currentUser = auth.currentUser;
        if (!currentUser) {
            runInAction(() => { this.error = "Je moet ingelogd zijn om te boeken."; });
            return;
        }

        this.isLoading = true;
        try {
            const bookingPayload = {
                userId: currentUser.uid,
                carId: this.selectedCar.id,
                startLocation: {
                    address: `${this.startStreet} ${this.startHouseNumber}, ${this.startCity}`,
                    latitude: this.startLat || 0,
                    longitude: this.startLng || 0
                },
                endLocation: {
                    address: `${this.endStreet} ${this.endHouseNumber}, ${this.endCity}`,
                    latitude: this.endLat || 0,
                    longitude: this.endLng || 0
                },
                startTime: this.dateTime,
                totalPrice: this.selectedCar.pricePerHourEstimate * 2,
                note: this.bookingNote,
                status: BookingStatus.REQUESTED
            };

            await BookingService.createBooking(bookingPayload as any);

            runInAction(() => {
                this.bookingStatus = BookingStatus.REQUESTED;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.message || "Booking failed";
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    // --- Other Actions ---

    clearForm() {
        this.startStreet = '';
        this.startHouseNumber = '';
        this.startPostcode = '';
        this.startCity = '';
        this.isStartAddressValid = false;

        this.endStreet = '';
        this.endHouseNumber = '';
        this.endPostcode = '';
        this.endCity = '';
        this.isEndAddressValid = false;

        this.bookingNote = '';
        this.availableCars = [];
        this.bookingStatus = null;
    }

    // --- Summary Getters ---
    get startAddressSummary(): string {
        if (!this.startStreet) return '-';
        return `${this.startStreet} ${this.startHouseNumber}, ${this.startCity}`;
    }

    get endAddressSummary(): string {
        if (!this.endStreet) return '-';
        return `${this.endStreet} ${this.endHouseNumber}, ${this.endCity}`;
    }

    // Kept from previous requirements just in case, adapted
    async cancelBooking(id: string, reason?: string) {
        this.isCancelling = true;
        try {
            await BookingService.updateBookingStatus(id, 'CANCELLED', reason);
            if (this.selectedBookingDetails?.id === id) {
                await this.loadBookingDetails(id);
            }
        } catch (e: any) {
            console.error(e);
        } finally {
            runInAction(() => { this.isCancelling = false; });
        }
    }

    async loadBookingDetails(id: string) {
        try {
            const booking = await BookingService.getBookingById(id);
            runInAction(() => this.selectedBookingDetails = booking);
        } catch (e) { console.error(e); }
    }
}
