import { getApi } from "@/api/axiosInstance";
import type { Project } from "@/types/project"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

export const useProject = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchProjectById = async (projectId: string) => {
        try {
            const response = await getApi().get(`/api/project/${projectId}`)
            return response.data.body;
        } catch (error: Error | unknown) {
            console.error(error);
            toast.error("Failed to fetch single project")
        }
    }

    const fetchProjects = async () => {
        try {
            const response = await getApi().get("/api/projects");
            setProjects(response.data.body);
        } catch (error: Error | unknown) {
            console.error(error);
            toast.error("Failed to fetch projects")
        }
    }

    const createProject = async (projectData: Partial<Project>) => {
        try {
            const response = await getApi().post("/api/projects", projectData);
            console.log("🚀 ~ createProject ~ response:", response)
            setProjects((prev) => [...prev, response.data.body]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create project");
        }
    }

    const updateProject = async (projectData: Partial<Project>, projectId: string) => {
        try {
            const response = await getApi().put(`/api/project/${projectId}`, projectData);
            console.log("🚀 ~ updateProject ~ response:", response)
            setProjects((prev) =>
                prev.map((project) =>
                    project.id === projectId ? response.data.body : project
                )
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to create project");
        }
    }

    const deleteProject = async (projectId: string) => {
        try {
            const response = await getApi().delete(`/api/project/${projectId}`);
            setProjects((prev) => prev.filter((project) => project.id !== response.data.body.id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete project");
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return { projects, createProject, deleteProject, updateProject, fetchProjectById }
}