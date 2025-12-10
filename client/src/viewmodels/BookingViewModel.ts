import { makeAutoObservable, runInAction } from 'mobx';
import { BookingStatus, ProviderType, FuelType } from '../models';
import type { CarDTO, LocationDTO } from '../models';
import api from '../services/ApiService';
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

        // Mock API call for demo stability
        this.isLoading = true;
        this.error = null;
        this.availableCars = [];

        // Simulate network delay
        setTimeout(() => {
            runInAction(() => {
                this.availableCars = [
                    {
                        id: 'car-1',
                        make: 'Tesla',
                        model: 'Model Y',
                        provider: ProviderType.MYWHEELS,
                        seats: 4,
                        fuelType: FuelType.EV,
                        luggageCapacity: 1,
                        range: 450,
                        pricePerHourEstimate: 18,
                        rating: 4.8,
                        location: { latitude: 52.3676, longitude: 4.9041, address: 'Amsterdam Centrum' }
                    } as CarDTO,
                    {
                        id: 'car-2',
                        make: 'BMW',
                        model: 'iX',
                        provider: ProviderType.GREENWHEELS,
                        seats: 5,
                        fuelType: FuelType.EV,
                        luggageCapacity: 2,
                        range: 520,
                        pricePerHourEstimate: 24,
                        rating: 4.9,
                        location: { latitude: 52.3650, longitude: 4.9000, address: 'Amsterdam Zuid' }
                    } as CarDTO,
                    {
                        id: 'car-3',
                        make: 'Polestar',
                        model: '2',
                        provider: ProviderType.MYWHEELS,
                        seats: 4,
                        fuelType: FuelType.EV,
                        luggageCapacity: 1,
                        range: 400,
                        pricePerHourEstimate: 16,
                        rating: 4.7,
                        location: { latitude: 52.3700, longitude: 4.9100, address: 'Amsterdam Oost' }
                    } as CarDTO
                ];
                this.isLoading = false;
            });
        }, 800);
    }

    selectCar(car: CarDTO) {
        this.selectedCar = car;
    }

    async confirmBooking() {
        if (!this.selectedCar || !this.isStartAddressValid || !this.isEndAddressValid) return;

        this.isLoading = true;
        try {
            const bookingPayload: any = {
                userId: '1',
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
                status: BookingStatus.CONFIRMED
            };

            await api.post('/bookings', bookingPayload);

            runInAction(() => {
                this.bookingStatus = BookingStatus.CONFIRMED;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || "Booking failed";
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
            await api.patch(`/bookings/${id}/cancel`, { reason });
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
            const res = await api.get(`/bookings/${id}`);
            runInAction(() => this.selectedBookingDetails = res.data);
        } catch (e) { console.error(e); }
    }
}
