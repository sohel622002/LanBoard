import { getApi } from "@/api/axiosInstance";
import type { TaskCreateData, TaskUpdateData } from "@/types/project-stage-task";
import toast from "react-hot-toast";

export const useProjectStageTask = () => {
    const createStageTask = async (taskData: Partial<TaskCreateData>) => {
        try {
            const response = await getApi().post("/api/project/stage/task", taskData)
            return response.data.body;
        } catch (error: Error | unknown) {
            console.error(error);
            toast.error("Failed to create project stage task")
        }
    }

    const updateStageTask = async (taskData: TaskUpdateData, taskId: string) => {
        try {
            const response = await getApi().put(`/api/project/stage/task/${taskId}`, taskData)
            return response.data.body;
        } catch (error: Error | unknown) {
            console.error(error);
            toast.error("Failed to update project stage task")
        }
    }

    return { createStageTask, updateStageTask }
}