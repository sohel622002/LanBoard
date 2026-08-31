import { Card, CardContent } from "../ui/card";
import { Calendar, EllipsisIcon, PencilIcon } from "lucide-react";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import type { Priority, ProjectTasks } from "@/types/project";
import { useProjectStageTask } from "@/hooks/useProjectStageTask";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/api/queryKeys";
import ProjectTaskPrioritySelection from "./project-task-priority-selection";
import ProjectTaskAssigneeSelection from "./project-task-assignee-selection";

type ProjectTaskCardProps = {
  task: ProjectTasks;
  isCreating?: boolean;
  projectId: string;
};

export default function ProjectTaskCard({
  task,
  projectId,
}: ProjectTaskCardProps) {
  const queryClient = useQueryClient();
  const { updateStageTask } = useProjectStageTask();
  const [taskTitleUpdating, setTaskTitleUpdating] = useState(false);

  const invalidateProject = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PROJECT, projectId],
    });
  };

  const onTitleChange = async (title: string) => {
    if (title && task?.id) {
      const updatedTask = await updateStageTask({ title }, task.id);
      if (updatedTask) {
        invalidateProject();
      }
    }
  };

  const onPrioritySelect = async (priority: Priority) => {
    if (priority && task?.id) {
      const updatedTask = await updateStageTask({ priority }, task.id);
      if (updatedTask) {
        invalidateProject();
      }
    }
  };

  const onAssigneeSelect = async (assignees: { id: string }[]) => {
    const updatedTask = await updateStageTask({ assignees }, task.id);
    if (updatedTask) {
      invalidateProject();
    }
  };

  return (
    <Card className="py-3 gap-1 group cursor-pointer select-none">
      <CardContent>
        <div className="flex gap-1">
          <div className="flex-1">
            <TaskTitle
              title={task.title}
              onTitleChange={onTitleChange}
              setTaskTitleUpdating={setTaskTitleUpdating}
              taskTitleUpdating={taskTitleUpdating}
            />
          </div>
          <div className="hidden gap-1 group-hover:flex">
            <span
              className="cursor-pointer flex items-center rounded-md h-6 px-[3px] border border-border"
              onClick={() => setTaskTitleUpdating(true)}
            >
              <PencilIcon className="w-4 h-4" />
            </span>
            <span className="cursor-pointer flex items-center rounded-md h-6 px-[3px] border border-border">
              <EllipsisIcon className="w-4 h-4" />
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <ProjectTaskAssigneeSelection
            assignee={task.assignees}
            onAssigneeSelect={onAssigneeSelect}
          />
          <div className="flex gap-1">
            <Calendar className="w-6 h-6 aspect-square cursor-pointer rounded-md px-[3px] border border-border" />
            <ProjectTaskPrioritySelection
              priority={task.priority}
              onPrioritySelect={onPrioritySelect}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskTitle({
  title,
  taskTitleUpdating,
  onTitleChange,
  setTaskTitleUpdating,
}: {
  title: string;
  taskTitleUpdating: boolean;
  onTitleChange: (title: string) => void;
  setTaskTitleUpdating: React.Dispatch<SetStateAction<boolean>>;
}) {
  const taskTitleRef = useRef<HTMLParagraphElement | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  // Focus and move cursor to end
  useEffect(() => {
    if (taskTitleUpdating && taskTitleRef.current) {
      const el = taskTitleRef.current;
      el.focus();

      // Move cursor to the end
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false); // false moves cursor to end
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [taskTitleUpdating]);

  return (
    <p
      ref={taskTitleRef}
      contentEditable={taskTitleUpdating}
      suppressContentEditableWarning
      className="line-clamp-2"
      onKeyDown={(e) => {
        switch (e.key) {
          case "Enter":
            e.preventDefault();
            e.currentTarget.blur(); // Commit on Enter
            break;
          case "Escape":
            e.currentTarget.textContent = updatedTitle; // Revert
            e.currentTarget.blur();
            break;
        }
      }}
      onBlur={(e) => {
        const text = e.currentTarget.textContent || "";

        if (text && text !== updatedTitle) {
          setUpdatedTitle(text);
          onTitleChange(text); // Call external callback
        } else if (!text) {
          e.currentTarget.textContent = updatedTitle; // Revert empty
        }

        setTaskTitleUpdating(false); // Close editing
      }}
    >
      {updatedTitle}
    </p>
  );
}
