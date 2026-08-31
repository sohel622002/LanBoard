import express from 'express';
import { projectStageTaskController } from '../controllers/projectStageTaskController';

const router = express.Router();

// Public routes
router.post('/project/stage/task', projectStageTaskController.createTask);
router.put('/project/stage/task/:taskId', projectStageTaskController.updateTask);
router.delete('/project/stage/task/:taskId', projectStageTaskController.deleteTask);
router.put('/project/stage/task/reorder/:taskId', projectStageTaskController.reorderTask);

export default router;