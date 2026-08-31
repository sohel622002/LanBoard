import express from 'express';
import { projectController } from '../controllers/projectController';

const router = express.Router();

// Public routes
router.post('/projects', projectController.createProject);
router.get('/projects', projectController.getProjects);
router.get('/project/:id', projectController.getProject);
router.put('/project/:id', projectController.updateProject);
router.delete('/project/:id', projectController.deleteProject);

export default router;