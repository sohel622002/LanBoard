import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit2Icon, EyeIcon, Loader2, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { formattedDate } from "@/lib/utils";
import type { User } from "@/types/user";

export function UserTable({ users }: { users: User[] }) {
  const [projectDeleting] = useState<string | null>(null);

  //   const handleProjectDelete = async (id: string) => {
  //     setProjectDeleting(id);
  //     await deleteProject(id);
  //     setProjectDeleting(null);
  //   };

  return (
    <div className="rounded-md border bg-card border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users
                ?.filter((user) => !user.isAdmin)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Avatar className="h-8 w-8 rounded-lg grayscale">
                        <AvatarImage alt={user.fullName} />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      {user.fullName}
                    </TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                      {formattedDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Button variant="ghost" size="icon">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        //   onClick={() => updateProjectClickHandler(project)}
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </Button>
                      <Button
                        //   onClick={() => handleProjectDelete(project.id)}
                        variant="destructive"
                        size="icon"
                      >
                        {projectDeleting && projectDeleting === user.id ? (
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
