import { Priority } from "../../../prisma/generated/local-client";

export interface ProjectStageTaskCreateRequest {
    title: string;
    stageId: string;
    index?: number;
    priority?: Priority;
    dueDate?: string;
    assignees?: Array<{ id: string }>
}

export interface ProjectStageTaskUpdateRequest {
    title?: string;
    index?: number;
    description?: string;
    priority?: Priority;
    dueDate?: string;
    stageId?: string;
    assignees?: Array<{ id: string }>
}

export interface ProjectStageTaskReorderRequest {
    stageId: string;
    prevTaskId?: string; 
    nextTaskId?: string;
}