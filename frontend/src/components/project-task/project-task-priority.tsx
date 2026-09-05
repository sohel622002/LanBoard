import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import { FlagIcon } from "lucide-react";

export default function TaskPriority({
  priority,
}: {
  priority?: Project["priority"];
}) {
  if (!priority) {
    return (
      <>
        <span className="cursor-pointer flex items-center rounded-md h-6 px-[3px] border border-border">
          <FlagIcon className="w-4 h-4" />
        </span>
      </>
    );
  }
  return (
    <>
      <span
        className={cn(
          "cursor-pointer flex items-center capitalize font-medium gap-1 text-xs rounded-md h-6 px-[3px] border border-border",
          priority === "HIGH" && "bg-destructive/15 text-destructive",
          priority === "MEDIUM" && "bg-warning/15 text-warning",
          priority === "LOW" && "bg-info/15 text-info"
        )}
      >
        <FlagIcon
          className={cn(
            "w-4 h-4",
            priority === "HIGH" && "text-destructive",
            priority === "MEDIUM" && "text-warning",
            priority === "LOW" && "text-info"
          )}
        />
        {priority.toLocaleLowerCase()}
      </span>
    </>
  );
}
