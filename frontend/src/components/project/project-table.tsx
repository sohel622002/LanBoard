import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit2Icon, EyeIcon, Loader2, Trash2Icon } from "lucide-react";
import type { Project } from "@/types/project";
import { cn, formattedDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { type UseMutationResult } from "@tanstack/react-query";


export function ProjectTable({
  projects,
  deletingId,
  deleteProjectMutation,
  updateProjectClickHandler,
}: {
  projects: Project[];
  deletingId: string | null;
  deleteProjectMutation: UseMutationResult<any, Error, string, void>,
  updateProjectClickHandler: (project: Project) => void;
}) {
  const navigate = useNavigate();
 
  return (
    <div className="rounded-md border bg-card border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-12">
                <Checkbox />
              </TableHead> */}
              <TableHead>Project Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Deadline</TableHead>
              {/* <TableHead>Currency</TableHead> */}
              <TableHead>Status</TableHead>
              {/* <TableHead>People</TableHead> */}
              <TableHead>Priority</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects &&
              projects?.map((project) => (
                <TableRow key={project.id}>
                  {/* <TableCell>
                    <Checkbox />
                  </TableCell> */}
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{formattedDate(project.startDate)}</TableCell>
                  <TableCell>{formattedDate(project.deadline)}</TableCell>
                  {/* <TableCell>{project.currency ?? "---"}</TableCell> */}
                  <TableCell>
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
                  </TableCell>
                  {/* <TableCell className="flex gap-1">
                  {project.people.map((p, i) => (
                    <Avatar key={i} className="h-8 w-8 border">
                      <AvatarImage src={p.avatar} />
                      <AvatarFallback>{p.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </TableCell> */}
                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize",
                        project.priority === "HIGH" &&
                          "bg-red-100 text-red-700",
                        project.priority === "MEDIUM" &&
                          "bg-orange-100 text-orange-700",
                        project.priority === "LOW" &&
                          "bg-blue-100 text-blue-700"
                      )}
                    >
                      {project.priority.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
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
                      disabled={deletingId === project.id}
                      size="icon"
                    >
                      {deletingId === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2Icon className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
