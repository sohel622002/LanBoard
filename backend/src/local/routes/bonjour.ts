import express from 'express';
import { bonjourController } from '../controllers/bonjourController';

const router = express.Router();

// Public routes
router.post('/emit/bonjour', bonjourController.emit);
router.get('/listen/bonjour', bonjourController.listen);
router.post('/unpublish/bonjour', bonjourController.unpublish);

export default router;