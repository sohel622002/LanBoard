import { Request, Response } from 'express';
import { ProjectStageTaskCreateRequest, ProjectStageTaskReorderRequest, ProjectStageTaskUpdateRequest } from '../../types/local/project-stage-task';
import { projectStageTaskService } from '../services/projectStageTaskService';

export class ProjectStageTaskController {
    async createTask(req: Request, res: Response): Promise<void> {
        try {
            const taskData: Partial<ProjectStageTaskCreateRequest> = req.body;
            // Find last task for stage
            const lastTask = await projectStageTaskService.lastTask(taskData.stageId);
            const newTaskIndex = lastTask ? lastTask.index + 100 : 100;
            const createdTask = await projectStageTaskService.createTask({ ...taskData, index: newTaskIndex });
            res.status(201).json({ success: true, message: 'Project task created successfully', body: createdTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params;
            const taskData: Partial<ProjectStageTaskUpdateRequest> = req.body;
            const createdTask = await projectStageTaskService.updateTask(taskData, taskId);
            res.status(201).json({ success: true, message: 'Project stage task updated successfully', body: createdTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async reorderTask(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params;
            const taskData: ProjectStageTaskReorderRequest = req.body;
            const updatedTask = await projectStageTaskService.reorderTask(taskData, taskId);
            res.status(201).json({ success: true, message: 'Project stage task reorder successfully', body: updatedTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params;
            const deletedTask = await projectStageTaskService.deleteProjectStageTask(taskId);
            res.status(201).json({ success: true, message: 'Project stage task deleted successfully', body: deletedTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }
}

export const projectStageTaskController = new ProjectStageTaskController();