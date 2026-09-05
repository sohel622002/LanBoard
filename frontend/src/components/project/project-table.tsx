import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit2Icon, EyeIcon, Loader2, Trash2Icon } from "lucide-react";
import type { Project } from "@/types/project";
import { formattedDate } from "@/lib/utils";
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
                  <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                    {formattedDate(project.startDate)}
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                    {formattedDate(project.deadline)}
                  </TableCell>
                  {/* <TableCell>{project.currency ?? "---"}</TableCell> */}
                  <TableCell>
                    <StatusBadge status={project.status} />
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
                    <PriorityBadge priority={project.priority} />
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
