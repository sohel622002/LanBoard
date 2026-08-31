import type { Project } from "@/types/project";
import { getApi } from "./axiosInstance";

class TaskAPI {
    public async reorderTask(taskId: string, payload: any): Promise<Project> {
        return getApi().put(`/api/project/stage/task/reorder/${taskId}`, payload).then(res => res.data.body)
    }
}

export const taskApi = new TaskAPI();