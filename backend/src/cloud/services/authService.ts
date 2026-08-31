import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../database';
import { SignupRequest, SignupResponse } from '../../types/auth';

export class AuthService {

    async findUserByEmail(email: string) {
        try {
            const user = await db.cloud.user.findUnique({
                where: { email }
            });

            return user;
        } catch (error) {
            console.error(error);
            throw new Error(error)
        }
    }

    async checkEmailExists(email: string): Promise<boolean> {
        try {
            const existingUser = await db.cloud.user.findUnique({
                where: { email }
            });
            return !!existingUser;
        } catch (error) {
            console.error('Error checking email existence:', error);
            throw new Error('Database error occurred');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    async createUser(signupData: SignupRequest): Promise<SignupResponse['user']> {
        try {
            // Create user in cloud database
            const newUser = await db.cloud.user.create({
                data: signupData,
                select: {
                    id: true,
                    email: true,
                    password: true,
                    fullName: true,
                    createdAt: true
                }
            });

            return newUser;
        } catch (error) {
            console.error('Signup error:', error);
            throw new Error('Failed to create account. Please try again.');
        }
    }

    // generateToken(userId: string): string {
    //     return jwt.sign(
    //         { userId },
    //         process.env.JWT_SECRET!,
    //         {
    //             expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    //             issuer: 'your-app-name'
    //         }
    //     );
    // }

    async verifyToken(token: string): Promise<{ userId: number } | null> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
            return decoded;
        } catch (error) {
            return null;
        }
    }
}

export const authService = new AuthService();