import jwt from 'jsonwebtoken';
import { config } from '../config';
import UsersRepo from '../repositories/UsersRepo';
import { UserDTO } from '../../../shared/types';

class AuthService {
    async login(email: string, password: string): Promise<{ token: string, user: UserDTO }> {
        const user = await UsersRepo.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValid = await UsersRepo.verifyPassword(email, password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
        );
        console.log('[AuthService] Signed token for user:', user.id);

        return { token, user };
    }

    async register(email: string, password: string): Promise<{ token: string, user: UserDTO }> {
        const existing = await UsersRepo.findByEmail(email);
        if (existing) {
            throw new Error('User already exists');
        }

        const newUser: UserDTO = {
            id: Math.random().toString(),
            email,
            role: 'customer'
        };

        await UsersRepo.create(newUser, password);

        return this.login(email, password);
    }
}

export default new AuthService();
