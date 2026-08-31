export interface ProjectCreateRequest {
    name: string;
    description?: string;
    status?: string;
    deadline?: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    startDate: string;
}

export interface ProjectUpdateRequest {
    name: string;
    description?: string;
    status?: string;
    priority?: "HIGH" | "MEDIUM" | "LOW";
    startDate?: string;
    dueDate?: string;
}