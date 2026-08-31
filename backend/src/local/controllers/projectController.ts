import { Request, Response } from 'express';
import { projectService } from '../services/projectService';
import { ProjectCreateRequest, ProjectUpdateRequest } from '../../types/local/project';

export class ProjectController {
    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const projectData: ProjectCreateRequest = req.body;
            const createdProject = await projectService.createProject(projectData);
            res.status(201).json({ success: true, message: 'Project created successfully', body: createdProject });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async getProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await projectService.getProjects();
            res.status(200).json({ success: true, body: projects });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async getProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const project = await projectService.getProjectById(id);
            res.status(200).json({ success: true, body: project });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const projectData: ProjectUpdateRequest = req.body;
            const updatedProject = await projectService.updateProject(id, projectData);
            res.status(200).json({ success: true, body: updatedProject });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deletedProject = await projectService.deleteProject(id);
            res.status(200).json({ success: true, body: deletedProject });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }
}

export const projectController = new ProjectController();