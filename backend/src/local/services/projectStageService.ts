import { db } from '../../database';
import { ProjectStageCreateRequest, ProjectStageUpdateRequest } from '../../types/local/project-stage';

export class ProjectStageService {
    async getStageById(stageId: string) {
        try {
            return await db.local.stage.findFirst({
                where: { id: stageId }
            })
        } catch (error) {
            console.error('Error creating project stage:', error);
            throw new Error('Failed to create project stage');
        }
    }
    async createProjectStage(stageData: ProjectStageCreateRequest) {
        try {
            return await db.local.stage.create({
                data: stageData
            })
        } catch (error) {
            console.error('Error creating project stage:', error);
            throw new Error('Failed to create project stage');
        }
    }
    async updateProjectStage(stageData: ProjectStageUpdateRequest, projectId: string) {
        try {
            return await db.local.stage.update({
                where: { id: projectId },
                data: stageData
            })
        } catch (error) {
            console.error('Error updating project stage:', error);
            throw new Error('Failed to update project stage');
        }
    }
    async deleteProjectStage(stageId: string) {
        try {
            return await db.local.stage.delete({
                where: { id: stageId }
            })
        } catch (error) {
            console.error('Error deleting project stage:', error);
            throw new Error('Failed to delete project stage');
        }
    }
}

export const projectStageService = new ProjectStageService();