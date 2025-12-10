import { UserDTO } from '../../../shared/types';
import bcrypt from 'bcrypt';

class UsersRepo {
    private users: UserDTO[] = [];
    private passwords: Map<string, string> = new Map(); // Store hashed passwords

    constructor() {
        this.seedAdmin();
    }

    private async seedAdmin() {
        // Admin
        const adminEmail = 'admin@onze.nl';
        const adminPass = await bcrypt.hash('admin123', 10);
        this.users.push({
            id: 'admin-1',
            email: adminEmail,
            role: 'admin'
        });
        this.passwords.set(adminEmail, adminPass);

        // Customer
        const customerEmail = 'customer@onze.nl';
        const customerPass = await bcrypt.hash('customer123', 10);
        this.users.push({
            id: 'customer-1',
            email: customerEmail,
            role: 'customer',
            homeLocation: { address: 'Kerkstraat 1', label: 'Thuis', latitude: 52.3, longitude: 4.9 }, // Pre-seed for easy testing
            workLocation: undefined
        });
        this.passwords.set(customerEmail, customerPass);
    }

    async findByEmail(email: string): Promise<UserDTO | undefined> {
        return this.users.find(u => u.email === email);
    }

    async verifyPassword(email: string, password: string): Promise<boolean> {
        const hash = this.passwords.get(email);
        if (!hash) return false;
        return bcrypt.compare(password, hash);
    }

    async create(user: UserDTO, password: string): Promise<UserDTO> {
        const hashedPassword = await bcrypt.hash(password, 10);
        this.users.push(user);
        this.passwords.set(user.email, hashedPassword);
        return user;
    }

    async updateLocations(userId: string, locations: { homeLocation?: UserDTO['homeLocation'], workLocation?: UserDTO['workLocation'] }): Promise<UserDTO | undefined> {
        const index = this.users.findIndex(u => u.id === userId);
        if (index === -1) return undefined;

        this.users[index] = {
            ...this.users[index],
            ...locations
        };
        return this.users[index];
    }
}

export default new UsersRepo();
