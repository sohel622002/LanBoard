import express from 'express';
import { userController } from '../controllers/userController';

const router = express.Router();

// Public routes
router.post('/user', userController.createUser);
router.get('/user', userController.getUser);

export default router;