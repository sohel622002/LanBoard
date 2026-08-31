import type { User } from "./user";

export type Priority = "HIGH" | "MEDIUM" | "LOW" | null;

export type ProjectTasks = { 
  id: string, 
  title: string, 
  description: string | null, 
  dueDate: string | null, 
  priority: Priority
  assignees: User[]
}

export type ProjectStage = { id: string; name: string; isDefault: boolean, tasks: ProjectTasks[] }

export type Project = {
  id: string
  name: string
  description?: string
  startDate: string
  deadline: string
  status: "active" | "Design" | "Brief"
  people: { name: string; initials: string; avatar?: string }[]
  stages: ProjectStage[]
  priority: Priority
}
