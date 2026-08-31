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
          priority === "HIGH" && "bg-red-100 text-red-700",
          priority === "MEDIUM" && "bg-blue-100 text-blue-700",
          priority === "LOW" && "bg-gray-100 text-gray-700"
        )}
      >
        <FlagIcon
          className={cn(
            "w-4 h-4",
            priority === "HIGH" && "text-red-700",
            priority === "MEDIUM" && "text-blue-700",
            priority === "LOW" && "text-gray-700"
          )}
        />
        {priority.toLocaleLowerCase()}
      </span>
    </>
  );
}
