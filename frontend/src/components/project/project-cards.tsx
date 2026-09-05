import type { Project } from "@/types/project";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formattedDate } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Calendar,
  Edit2Icon,
  EyeIcon,
  Loader2,
  Trash2Icon,
} from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import type { UseMutationResult } from "@tanstack/react-query";

export default function ProjectCards({
  projects,
  deletingId,
  deleteProjectMutation,
  updateProjectClickHandler,
}: {
  projects: Project[];
  deletingId: string | null;
  deleteProjectMutation: UseMutationResult<any, Error, string, void>;
  updateProjectClickHandler: (project: Project) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
        {projects.map((project) => (
          <Card className="gap-3" key={project.id}>
            <CardHeader>
              <CardTitle className="text-lg truncate">{project.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 font-mono text-xs tabular-nums">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate(project.startDate)}
              </CardDescription>
              <CardAction>
                <PriorityBadge priority={project.priority} />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-muted-foreground text-sm">
                  Description
                </span>
                <p className="line-clamp-3 text-sm">
                  {project.description || "--"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Deadline
                </span>
                <p className="font-mono text-sm tabular-nums">
                  {formattedDate(project.deadline)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Status
                </span>
                <StatusBadge status={project.status} />
              </div>
            </CardContent>
            <CardFooter className="flex space-x-1 justify-end">
              <Button variant="ghost" size="icon">
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateProjectClickHandler(project)}
              >
                <Edit2Icon className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => deleteProjectMutation.mutate(project.id)}
                variant="destructive"
                size="icon"
              >
                {deletingId === project.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2Icon className="h-4 w-4" />
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
