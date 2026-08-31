import express from 'express';
import { projectStageController } from '../controllers/projectStageController';

const router = express.Router();

// Public routes
router.post('/project/stage', projectStageController.createStage);
router.put('/project/stage/:projectId', projectStageController.updateStage);
router.delete('/project/stage/:stageId', projectStageController.deleteStage);

export default router;