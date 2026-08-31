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
import { cn, formattedDate } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Calendar,
  Edit2Icon,
  EyeIcon,
  Loader2,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "../ui/badge";
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
              <CardDescription className="flex gap-1">
                <Calendar className="h-4 w-4 mt-[1px]" />{" "}
                {formattedDate(project.startDate)}
              </CardDescription>
              <CardAction>
                {project.priority && (
                  <Badge
                    className={cn(
                      "capitalize",
                      project.priority === "HIGH" && "bg-red-100 text-red-700",
                      project.priority === "MEDIUM" &&
                        "bg-orange-100 text-orange-700",
                      project.priority === "LOW" && "bg-blue-100 text-blue-700"
                    )}
                  >
                    {project.priority.toLowerCase()}
                  </Badge>
                )}
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
                <span className="text-muted-foreground text-sm">Deadline</span>
                <p className="text-sm">{formattedDate(project.deadline)}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize bg-yellow-100 text-yellow-700",
                    project.status === "active" &&
                      "bg-green-100 text-green-700",
                    project.status === "Design" &&
                      "bg-purple-100 text-purple-700"
                  )}
                >
                  {project.status.toLowerCase()}
                </Badge>
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
