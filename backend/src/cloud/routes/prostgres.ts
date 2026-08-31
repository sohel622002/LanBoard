import express from 'express';
import { postgresController } from '../controllers/postgresController';

const router = express.Router();

// Public routes
router.post('/download', postgresController.downloadPostgresBinaries);
router.post('/initialize', postgresController.initializePostgresBinaries);

export default router;