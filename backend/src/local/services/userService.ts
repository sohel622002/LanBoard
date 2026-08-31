import { UserCreate } from 'types/local/user';
import { db } from '../../database';

export class UserService {

    async createUser(userData: UserCreate) {
        const { email, fullName, isAdmin, password } = userData;
        try {
            return await db.local.user.create({
                data: {
                    email,
                    isAdmin: isAdmin || false,
                    fullName,
                    password
                }
            });
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

    async getUsers() {
        try {
            return await db.local.user.findMany();
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        }
    }

    async getUserById(userId: string) {
        try {
            return await db.local.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    createdAt: true
                }
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        }
    }

    async getUserByEmail(email: string) {
        try {
            return await db.local.user.findUnique({
                where: { email: email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    createdAt: true
                }
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        }
    }

    async updateUserById(userId: string, updateData: { email?: string }) {
        try {
            return await db.local.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    updatedAt: true
                }
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update profile');
        }
    }
}

export const userService = new UserService();