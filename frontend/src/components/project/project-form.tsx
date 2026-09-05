import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2Icon } from "lucide-react";
import type { Project } from "@/types/project";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "@/api/projects";
import { QUERY_KEYS } from "@/api/queryKeys";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const today = startOfDay(new Date());

// Create schema
const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  description: z
    .string()
    .max(200, { message: "Description must be at most 200 characters long" })
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  startDate: z
    .date()
    .min(today, { message: "Start date must be in the future" }),
  deadline: z
    .date()
    .min(today, { message: "Deadline must be in the future" })
    .optional(),
});

// Update schema
const updateProjectSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  description: z
    .string()
    .max(200, { message: "Description must be at most 200 characters long" })
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  // only validate type, not future date
  startDate: z.date(),
  deadline: z.date().optional(),
});

type FormValues =
  | z.infer<typeof createProjectSchema>
  | z.infer<typeof updateProjectSchema>;

type ProjectFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: { data: Project | null; projectId: string }; // for update
  mode?: "create" | "update";
};

export function ProjectForm(projectFormProps: ProjectFormProps) {
  const queryClient = useQueryClient();

  const { open, mode, setOpen, initialData } = projectFormProps;
  const schema = mode === "create" ? createProjectSchema : updateProjectSchema;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      priority: "LOW",
      startDate: new Date(),
      deadline: undefined,
    },
  });

  useEffect(() => {
    if (initialData && initialData.projectId && mode === "update") {
      reset({
        name: initialData.data?.name,
        description: initialData.data?.description,
        priority:
          initialData.data?.priority === "LOW" ||
          initialData.data?.priority === "MEDIUM" ||
          initialData.data?.priority === "HIGH"
            ? initialData.data?.priority
            : "LOW",
        startDate: initialData.data?.startDate
          ? new Date(initialData.data?.startDate)
          : new Date(),
        deadline: initialData.data?.deadline
          ? new Date(initialData.data?.deadline)
          : undefined,
      });
    }
  }, [initialData, mode]);

  const createProjectMutation = useMutation({
    mutationFn: (newProject: Partial<Project>) =>
      projectApi.createProject(newProject),
    onSuccess: (createdProject) => {
      queryClient.setQueryData<Project[]>([QUERY_KEYS.PROJECTS], (old) => {
        return old ? [...old, createdProject] : [createdProject];
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({
      project,
      projectId,
    }: {
      project: Partial<Project>;
      projectId: string;
    }) => projectApi.updateProject(project, projectId),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<Project[]>([QUERY_KEYS.PROJECTS], (old) => {
        return old
          ? old.map((project) =>
              project.id === updatedProject.id ? updatedProject : project
            )
          : [updatedProject];
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      startDate: data.startDate?.toISOString(),
      deadline: data.deadline?.toISOString(),
    };
    console.log("Form data:", payload);
    if (mode === "update" && initialData) {
      updateProjectMutation.mutate({
        project: payload,
        projectId: initialData.projectId,
      });
    } else {
      createProjectMutation.mutate(payload);
    }
    setOpen(false);
  };

  const onOpenChange = (val: boolean) => {
    if (!isSubmitting) setOpen(val);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create new" : "Update"} project
          </DialogTitle>
          <DialogDescription>
            Fill in the details to start a new project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Project name */}
          <div className="space-y-2">
            <Label>Project name</Label>
            <Input placeholder="Enter project name" {...register("name")} />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-destructive text-sm">{errors.priority.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              placeholder="Add a description..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="flex gap-2">
            <div className="space-y-2 flex-1">
              <Label>Start Date</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick start date"
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-destructive text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <Label>Deadline</Label>
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick deadline"
                  />
                )}
              />
              {errors.deadline && (
                <p className="text-destructive text-sm">
                  {errors.deadline.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {mode === "create" ? "Create" : "Update"} project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
