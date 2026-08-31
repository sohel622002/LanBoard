import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar, CornerDownLeft, PlusIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import ProjectTaskPrioritySelection from "./project-task-priority-selection";
import type { Priority } from "@/types/project";
import ProjectTaskAssigneeSelection from "./project-task-assignee-selection";
import { useProjectStageTask } from "@/hooks/useProjectStageTask";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/api/queryKeys";

interface ProjectTaskFormType {
  title: string;
  dueDate: string;
  priority: Priority;
  stageId: string;
  assignees: { id: string }[];
}

export default function ProjectTaskFormCard({
  projectId,
  stageId,
}: {
  projectId: string;
  stageId: string;
}) {
  const queryClient = useQueryClient();
  const { createStageTask } = useProjectStageTask();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [projectTaskForm, setProjectTaskForm] = useState<ProjectTaskFormType>({
    title: "",
    dueDate: "",
    stageId: stageId,
    priority: null,
    assignees: [],
  });

  const invalidateProject = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PROJECT, projectId],
    });
  };

  const onProjectTaskFormChange = <K extends keyof ProjectTaskFormType>(
    key: K,
    value: ProjectTaskFormType[K]
  ) => {
    setProjectTaskForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveTask = async () => {
    console.log("projectTaskForm", projectTaskForm);
    const payload = Object.fromEntries(
      Object.entries(projectTaskForm).filter(
        ([_, value]) =>
          value !== null &&
          value !== "" &&
          value !== undefined &&
          !(Array.isArray(value) && value.length === 0) // exclude empty arrays
      )
    );
    const updatedTask = await createStageTask(payload);
    if (updatedTask) {
      invalidateProject();
    }
    setIsFormVisible(false);
  };

  return (
    <>
      {!isFormVisible ? (
        <Button
          variant={"ghost"}
          className="border border-border w-full text-muted-foreground"
          onClick={() => setIsFormVisible(true)}
        >
          <PlusIcon /> Add Task
        </Button>
      ) : (
        <Card className="py-3 gap-1 group">
          <CardContent>
            <div className="flex gap-1">
              <div className="flex-1">
                <Input
                  autoFocus
                  placeholder="New Task.."
                  value={projectTaskForm.title}
                  onChange={(event) =>
                    onProjectTaskFormChange("title", event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      saveTask();
                    }
                  }}
                  className="px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 border-none outline-none"
                />
              </div>
              <div className="hidden gap-1 group-hover:flex">
                <Button className="cursor-pointer flex items-center rounded-md text-sm px-[3px] border border-border">
                  <CornerDownLeft className="w-4 h-4" /> Save
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <ProjectTaskAssigneeSelection
                assignee={projectTaskForm.assignees}
                onAssigneeSelect={(assignee) =>
                  onProjectTaskFormChange("assignees", assignee)
                }
              />
              <div className="flex gap-1">
                <Calendar className="w-6 h-6 aspect-square cursor-pointer rounded-md px-[3px] border border-border" />
                <ProjectTaskPrioritySelection
                  priority={projectTaskForm.priority}
                  onPrioritySelect={(priority) =>
                    onProjectTaskFormChange("priority", priority)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
