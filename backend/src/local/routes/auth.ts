import express from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../schemas/auth.schema';

const router = express.Router();

// Public routes
router.post('/login', authController.login);

export default router;