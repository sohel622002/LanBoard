import { db } from '../../database';

export class CloudUserService {
    async getUserByEmail(email: string) {
        try {
            return await db.cloud.user.findUnique({
                where: { email: email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    createdAt: true
                }
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw new Error('Failed to fetch user profile');
        }
    }

    async getUserProfile(userId: string) {
        try {
            return await db.cloud.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw new Error('Failed to fetch user profile');
        }
    }

    async updateUserProfile(userId: string, updateData: { email?: string }) {
        try {
            return await db.cloud.user.update({
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

export const userService = new CloudUserService();