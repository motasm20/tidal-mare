export const BookingStatus = {
    REQUESTED: 'REQUESTED',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
} as const;
export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const ProviderType = {
    DUMMY: 'DUMMY',
    GREENWHEELS: 'GREENWHEELS',
    MYWHEELS: 'MYWHEELS'
} as const;
export type ProviderType = typeof ProviderType[keyof typeof ProviderType];

export const FuelType = {
    EV: 'EV',
    HYBRID: 'HYBRID',
    PETROL: 'PETROL'
} as const;
export type FuelType = typeof FuelType[keyof typeof FuelType];

export interface LocationDTO {
    address: string;
    latitude?: number;
    longitude?: number;
    label?: string; // e.g. "Home", "Work"
}

export interface UserDTO {
    id: string;
    email: string;
    role: 'customer' | 'admin';
    homeLocation?: LocationDTO;
    workLocation?: LocationDTO;
}

export interface CarDTO {
    id: string;
    make: string;
    model: string;
    seats: number;
    luggageCapacity: number; // 0=none, 1=small, 2=medium, 3=large
    fuelType: FuelType;
    range?: number; // km
    provider: ProviderType;
    imageUrl?: string;
    pricePerHourEstimate: number;
}

export interface BookingDTO {
    id: string;
    userId: string;
    carId: string;
    car: CarDTO;
    startLocation: LocationDTO;
    endLocation: LocationDTO;
    startTime: string; // ISO
    endTime?: string; // ISO
    status: BookingStatus;
    totalPrice?: number;
    createdAt: string; // ISO
    cancelledAt?: string; // ISO
    cancellationReason?: string;
    note?: string;
}

export interface ChargingPointDTO {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    connectorType: string;
    status: 'AVAILABLE' | 'OCCUPIED' | 'UNKNOWN';
}
