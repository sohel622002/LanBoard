import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { LoginRequest } from '../../types/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'LANBOARD_DEFAULT_SECRET_0001';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;
      console.log("loginData", loginData);
      
      // Check if user already exists
      const existingUser = await authService.findUserByEmail(loginData.email);
      console.log("existingUser", existingUser);
      
      if (!existingUser) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isValid = await bcrypt.compare(loginData.password, existingUser.password);
      console.log("isValid", isValid);
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

  // Health check endpoint
  //   async healthCheck(req: Request, res: Response): Promise<void> {
  //     try {
  //       const dbHealth = await db.healthCheck();
  //       res.json({
  //         success: true,
  //         message: 'Auth service is healthy',
  //         database: dbHealth
  //       });
  //     } catch (error) {
  //       res.status(500).json({
  //         success: false,
  //         message: 'Service health check failed'
  //       });
  //     }
  //   }
}

export const authController = new AuthController();