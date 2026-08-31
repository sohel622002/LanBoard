import type { Priority } from "./project";

export type TaskCreateData = {
    stageId: string
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
    assignees?: { id: string }[]
}

export type TaskUpdateData = {
    title?: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
    stageId?: string;
    assignees?: { id: string }[]
}