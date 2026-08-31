import { Request, Response } from 'express';
import { userService } from '../services/userService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserCreate } from 'types/local/user';
import { userService as cloudUserService } from "../../cloud/services/cloudUserService";

const JWT_SECRET = process.env.JWT_SECRET || 'PROJECT_VAULT_DEFAULT_SECRET_0001';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class UserController {
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData: UserCreate = req.body;

            // Check if user already exists
            const existingUser = await userService.getUserByEmail(userData.email);

            console.log("existingUser", existingUser);

            if (existingUser) {
                throw new Error("User already exists with this email");
            }

            if (userData.isAdmin) {
                // fethc user detail from cloud
                const adminUser = await cloudUserService.getUserByEmail(userData.email);
                userData.password = adminUser.password
            } else {
                // Hash password
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashedPassword;
            }

            const result = await userService.createUser(userData);

            console.log("result", result);

            // Generate JWT
            const token = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
            });

            delete result.password; // Remove password before sending user data

            res.status(201).json({ success: true, message: 'Account created successfully', user: result, token });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const response = await userService.getUsers();
            res.status(201).json({ success: true, message: 'User get successfully!', body: response });
        } catch (error) {
            console.error('User get error:', error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }
}

export const userController = new UserController();