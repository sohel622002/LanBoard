import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import TaskPriority from "./project-task-priority";
import type { Priority } from "@/types/project";
import { cn } from "@/lib/utils";
import { Check, CircleOffIcon, FlagIcon } from "lucide-react";

interface ProjectTaskPriorityProps {
  priority?: Priority;
  onPrioritySelect: (priority: Priority) => void;
}

export default function ProjectTaskPrioritySelection(
  props: ProjectTaskPriorityProps
) {
  const [isPriorityPopoverOpen, setIsPriorityPopoverOpen] = useState(false);

  const options: { label: string; value: Priority; color: string }[] = [
    { label: "High", value: "HIGH", color: "text-destructive" },
    { label: "Medium", value: "MEDIUM", color: "text-warning" },
    { label: "Low", value: "LOW", color: "text-info" },
    { label: "Clear", value: null, color: "" },
  ];
  const onSelect = (value: Priority) => {
    props.onPrioritySelect(value);
    setIsPriorityPopoverOpen(false);
  };

  return (
    <>
      <Popover
        open={isPriorityPopoverOpen}
        onOpenChange={setIsPriorityPopoverOpen}
      >
        <PopoverTrigger asChild>
          <span>
            <TaskPriority priority={props.priority} />
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <span className="text-muted-foreground text-sm">Task Priority</span>
          <div className="mt-2 space-y-1">
            {options.map((opt) => (
              <div
                key={opt.label}
                onClick={() => onSelect(opt.value)}
                className={cn(
                  "flex items-center p-1 justify-between hover:bg-accent rounded-md cursor-pointer",
                  props.priority === opt.value && "bg-accent"
                )}
              >
                <span className="flex gap-1 items-center text-sm">
                  {opt.value ? (
                    <FlagIcon className={cn("w-4 h-4", opt.color)} />
                  ) : (
                    <CircleOffIcon className="w-4 h-4" />
                  )}
                  {opt.label}
                </span>
                {props.priority === opt.value && <Check className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
