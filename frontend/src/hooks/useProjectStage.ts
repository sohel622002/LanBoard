import { getApi } from "@/api/axiosInstance";
import type { StageCreateData } from "@/types/project-stage";
import toast from "react-hot-toast";

export const useProjectStage = () => {
    const createStage = async (stageData: StageCreateData) => {
        try {
            const response = await getApi().post("/api/project/stage", stageData)
            return response.data.body;
        } catch (error: Error | unknown) {
            console.error(error);
            toast.error("Failed to create project stage")
        }
    }

    const deleteStage = async (stageId: string) => {
        try {
            const response = await getApi().delete(`/api/project/stage/${stageId}`)
            return response.data.body;
        } catch (error: Error | unknown) {
            console.error(error);
            toast.error("Failed to delete stage")
        }
    }

    return { createStage, deleteStage }
}