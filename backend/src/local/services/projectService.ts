import { db } from '../../database';
import { ProjectCreateRequest, ProjectUpdateRequest } from '../../types/local/project';

export class ProjectService {
    async createProject(projectData: ProjectCreateRequest) {
        try {
            return await db.local.project.create({
                data: {
                    ...projectData,
                    stages: {
                        create: [
                            { name: "Todo", isDefault: true },
                            { name: "In Progress", isDefault: true },
                            { name: "Done", isDefault: true }
                        ]
                    }
                },
                include: { stages: true }
            })
        } catch (error) {
            console.error('Error creating project:', error);
            throw new Error('Failed to create project');
        }
    }

    async getProjects() {
        try {
            return await db.local.project.findMany({
                include: { collaborators: true, stages: true }
            })
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw new Error('Failed to fetch projects');
        }
    }

    async getProjectById(id: string) {
        try {
            return await db.local.project.findUnique({
                where: { id },
                include: {
                    collaborators: true,
                    stages: {
                        include: {
                            tasks: {
                                include: {
                                    assignees: true
                                },
                                orderBy: { index: "asc" }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            console.error('Error fetching project by Id:', error);
            throw new Error('Failed to fetch project by Id');
        }
    }

    async updateProject(id: string, projectData: ProjectUpdateRequest) {
        try {
            return await db.local.project.update({
                where: { id },
                data: projectData,
                include: { collaborators: true, stages: true }
            })
        } catch (error) {
            console.error('Error fetching project by Id:', error);
            throw new Error('Failed to fetch project by Id');
        }
    }

    async deleteProject(id: string) {
        try {
            return await db.local.project.delete({ where: { id } })
        } catch (error) {
            console.error('Error deleting project:', error);
            throw new Error('Failed to delete project');
        }
    }
}

export const projectService = new ProjectService();