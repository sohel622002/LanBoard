import type { Project } from "@/types/project";
import { getApi } from "./axiosInstance";

class ProjectAPI {
    public async getProject(projectId: string): Promise<Project> {
        return getApi().get(`/api/project/${projectId}`).then(res => res.data.body)
    }
    public async getProjects() {
        return getApi().get("/api/projects").then(res => res.data.body)
    }
    public async createProject(projectData: Partial<Project>) {
        return getApi().post("/api/projects", projectData).then(res => res.data.body);
    }
    public async updateProject(projectData: Partial<Project>, projectId: string) {
        return getApi().put(`/api/project/${projectId}`, projectData).then(res => res.data.body)
    }
    public async deleteProject(projectId: string) {
        return getApi().delete(`/api/project/${projectId}`).then(res => res.data.body)
    }
}

export const projectApi = new ProjectAPI();