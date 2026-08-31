import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "1",
    name: "Managers Meeting Q1",
    startDate: "2024-07-16",
    deadline: "2024-10-24",
    status: "Active",
    people: [{ name: "Helen", initials: "H" }],
    priority: "High",
  },
  {
    id: "2",
    name: "Homepage Video",
    startDate: "2024-07-16",
    deadline: "2024-10-24",
    status: "Design",
    people: [{ name: "John", initials: "J" }, { name: "Mia", initials: "M" }],
    priority: "Low",
  }
]
