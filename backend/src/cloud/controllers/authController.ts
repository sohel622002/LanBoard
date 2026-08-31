import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { LoginRequest, SignupRequest } from '../../types/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'PROJECT_VAULT_DEFAULT_SECRET_0001';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const signupData: SignupRequest = req.body;
      // Check if user already exists
      const existingUser = await authService.findUserByEmail(signupData.email);

      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(signupData.password, 10);
      signupData.password = hashedPassword;

      const result = await authService.createUser(signupData);

      // Generate JWT
      const token = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
      });

      res.status(201).json({ success: true, message: 'Account created successfully', user: result, token });
    } catch (error) {
      console.error('Signup controller error:', error);
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;

      // Check if user already exists
      const existingUser = await authService.findUserByEmail(loginData.email);

      if (!existingUser) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isValid = await bcrypt.compare(loginData.password, existingUser.password);
      if (!isValid) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      // Generate JWT
      const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
      });

      delete existingUser.password; // Remove password before sending user data

      res.status(200).json({ success: true, message: 'Login successful', user: existingUser, token });
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
    }
  }
}

export const authController = new AuthController();