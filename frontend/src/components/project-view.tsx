import { Plus, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "./ui/table";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  name: string;
  description?: string;
  estimation: string;
  type: string;
  people: string[];
  priority: "Low" | "Medium" | "High";
};

const tasks: { [key: string]: Task[] } = {
  todo: [
    {
      id: "1",
      name: "Employee Details",
      description: "Create a page where there is information about employees",
      estimation: "Feb 14, 2024 - Feb 1, 2024",
      type: "Dashboard",
      people: ["AL", "DT"],
      priority: "Medium",
    },
    {
      id: "2",
      name: "Darkmode version",
      description: "Darkmode version for all screens",
      estimation: "Feb 14, 2024 - Feb 1, 2024",
      type: "Mobile App",
      people: ["AL"],
      priority: "Low",
    },
  ],
  progress: [
    {
      id: "3",
      name: "Super Admin Role",
      estimation: "Feb 14, 2024 - Feb 1, 2024",
      type: "Dashboard",
      people: ["DT"],
      priority: "High",
    },
    {
      id: "4",
      name: "Settings Page",
      estimation: "Feb 14, 2024 - Feb 1, 2024",
      type: "Mobile App",
      people: ["AL"],
      priority: "Medium",
    },
  ],
  review: [
    {
      id: "5",
      name: "KPI and Employee Statistics",
      description: "Create a design that displays KPIs and employee statistics",
      estimation: "Feb 14, 2024 - Feb 1, 2024",
      type: "Dashboard",
      people: ["DT"],
      priority: "Low",
    },
  ],
};

export function ProjectView() {
  const renderTaskRow = (task: Task) => (
    <TableRow key={task.id}>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell className="font-medium">{task.name}</TableCell>
      <TableCell className="whitespace-normal">
        {task.description ?? "-"}
      </TableCell>
      <TableCell>{task.estimation}</TableCell>
      <TableCell>
        <Badge variant="outline">{task.type}</Badge>
      </TableCell>
      <TableCell className="flex -space-x-2">
        {task.people.map((p, i) => (
          <Avatar key={i} className="h-8 w-8 border">
            {/* <AvatarImage src={p.avatar} /> */}
            <AvatarFallback>{p}</AvatarFallback>
          </Avatar>
        ))}
      </TableCell>
      <TableCell>
        <Badge
          variant={
            task.priority === "High"
              ? "destructive"
              : task.priority === "Medium"
              ? "secondary"
              : "outline"
          }
        >
          {task.priority}
        </Badge>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Craftboard Project</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." className="w-60" />
          <Button variant="outline">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          {/* Sections */}
          {Object.entries(tasks).map(([section, items], index) => (
            <Collapsible
              key={section}
              defaultOpen
              className={cn(
                "border border-border",
                index !== 0 && "border-t-0"
              )}
            >
              <CollapsibleTrigger
                asChild
                className={cn("pt-3 pb-2 bg-card cursor-pointer")}
              >
                <CardHeader>
                  <CardTitle className="capitalize">
                    {section} ({items.length})
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead />
                        <TableHead>Task Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Estimation</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>People</TableHead>
                        <TableHead>Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{items.map(renderTaskRow)}</TableBody>
                  </Table>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
