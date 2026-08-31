import { Request, Response } from 'express';
import { projectStageService } from '../services/projectStageService';
import { ProjectStageCreateRequest, ProjectStageUpdateRequest } from '../../types/local/project-stage';

export class ProjectStageController {
    async createStage(req: Request, res: Response): Promise<void> {
        try {
            const stageData: ProjectStageCreateRequest = req.body;
            const createdStage = await projectStageService.createProjectStage(stageData);
            res.status(201).json({ success: true, message: 'Project stage created successfully', body: createdStage });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async updateStage(req: Request, res: Response): Promise<void> {
        try {
            const { projectId } = req.params;
            const stageData: ProjectStageUpdateRequest = req.body;
            const createdStage = await projectStageService.updateProjectStage(stageData, projectId);
            res.status(201).json({ success: true, message: 'Project stage updated successfully', body: createdStage });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async deleteStage(req: Request, res: Response): Promise<void> {
        try {
            const { stageId } = req.params;
            const stage = await projectStageService.getStageById(stageId);
            if (stage.isDefault) {
                res.status(403).json({ success: false, message: "Can not delete default stage" })
                return;
            }
            const deletedStage = await projectStageService.deleteProjectStage(stageId);
            res.status(201).json({ success: true, message: 'Project stage deleting successfully', body: deletedStage });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }
}

export const projectStageController = new ProjectStageController();