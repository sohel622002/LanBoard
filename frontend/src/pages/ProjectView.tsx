import { projectApi } from "@/api/projects";
import { QUERY_KEYS } from "@/api/queryKeys";
import ProjectTaskCard from "@/components/project-task/project-task-card";
import ProjectTaskFormCard from "@/components/project-task/project-task-form-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { useProject } from "@/hooks/useProject";
import { useProjectStage } from "@/hooks/useProjectStage";
import { formattedDate } from "@/lib/utils";
import type { Project, ProjectStage } from "@/types/project";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, Trash2Icon, User2Icon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { taskApi } from "@/api/task";

interface ReorderTaskMutationProps {
  taskId: string;
  stageId: string;
  prevTaskId?: string | null;
  nextTaskId?: string | null;
}

export default function ProjectView() {
  const queryClient = useQueryClient();
  const { createStage, deleteStage } = useProjectStage();
  const { id } = useParams();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.PROJECT, id],
    queryFn: () => projectApi.getProject(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 min stale time
  });

  // 2️⃣ Local state for drag-and-drop
  const [stagesState, setStagesState] = useState<Project["stages"]>([]);

  useEffect(() => {
    if (project) setStagesState(project.stages);
  }, [project]);

  const reorderMutation = useMutation({
    mutationFn: ({ taskId, ...rest }: ReorderTaskMutationProps) =>
      taskApi.reorderTask(taskId, rest),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECT, id] });
    },
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const previousState = structuredClone(stagesState);
    const newStages = structuredClone(stagesState);

    // find source and destination stages
    const sourceStage = newStages.find((s) => s.id === source.droppableId);
    const destStage = newStages.find((s) => s.id === destination.droppableId);
    if (!sourceStage || !destStage) return;

    // remove dragged task
    const [movedTask] = sourceStage.tasks.splice(source.index, 1);

    // insert at destination
    destStage.tasks.splice(destination.index, 0, movedTask);

    // update stageId if moved
    // if (sourceStage.id !== destStage.id) movedTask.stageId = destStage.id;

    // update local state instantly (optimistic UI)
    setStagesState(newStages);

    // prev/next task for backend
    const prevTask = destStage.tasks[destination.index - 1];
    const nextTask = destStage.tasks[destination.index + 1];

    // call mutation
    reorderMutation.mutate(
      {
        taskId: draggableId,
        stageId: destStage.id,
        prevTaskId: prevTask?.id || null,
        nextTaskId: nextTask?.id || null,
      },
      {
        // rollback UI if API fails
        onError: () => {
          setStagesState(previousState);
        },
      }
    );
  };

  const StageColumn = memo(
    ({ stage, projectId }: { stage: ProjectStage; projectId: string }) => {
      return (
        <div className="w-80 shrink-0">
          <Card className="py-3">
            <CardContent>
              <div className="flex justify-between rounded-md group">
                <h4>{stage.name}</h4>
                {!stage.isDefault && (
                  <DeleteStageConfirmation
                    stage={stage}
                    projectId={projectId}
                    deleteStage={deleteStage}
                  />
                )}
                {/* If stage is default, just show count (no delete) */}
                {stage.isDefault && (
                  <span className="flex text-xs font-mono w-6 h-6 rounded-full items-center justify-center bg-muted text-muted-foreground">
                    {stage.tasks.length}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Droppable droppableId={stage.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`mt-3 space-y-2 transition-all border-2 ${
                  snapshot.isDraggingOver
                    ? "border-dashed border-sky-400"
                    : "border-transparent"
                }`}
              >
                {stage.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        className={`${
                          dragSnapshot.isDragging ? "opacity-90 scale-105" : ""
                        }`}
                      >
                        <ProjectTaskCard task={task} projectId={projectId} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <ProjectTaskFormCard
                  projectId={id as string}
                  stageId={stage.id}
                />
              </div>
            )}
          </Droppable>
        </div>
      );
    }
  );

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (error)
    return <p className="text-sm text-destructive">Error fetching project</p>;

  return (
    <>
      <main className="p-4 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">{project?.name}</h1>
          {/* <Button>
            <User2Icon /> Add Member
          </Button> */}
        </div>
        <Card>
          <CardContent className="space-y-4">
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                Description
              </span>
              <p className="line-clamp-3 text-sm">
                {project?.description || "--"}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Start Date
                </span>
                <p className="font-mono text-sm tabular-nums">
                  {formattedDate(project?.startDate)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Deadline
                </span>
                <p className="font-mono text-sm tabular-nums">
                  {formattedDate(project?.deadline)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Status
                </span>
                <StatusBadge status={project?.status} />
              </div>
              {project?.priority && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs uppercase tracking-wide">
                    Priority
                  </span>
                  <PriorityBadge priority={project?.priority} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <ScrollArea className="w-full">
          {project && (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 mb-3">
                {stagesState.map((stage) => (
                  <StageColumn
                    key={stage.id}
                    stage={stage}
                    projectId={id as string}
                  />
                ))}

                <StageCreate
                  projectData={project}
                  projectId={project.id}
                  createStage={createStage}
                />
              </div>
            </DragDropContext>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>
    </>
  );
}

// {project.stages.map((stage) => (
//                   <div className="w-80 shrink-0" key={stage.id}>
//                     <Card className="py-3">
//                       <CardContent>
//                         <div className="flex justify-between rounded-md group">
//                           <h4>{stage.name}</h4>
//                           {/* Count badge */}
//                           {!stage.isDefault && (
//                             <DeleteStageConfirmation
//                               stage={stage}
//                               projectId={project.id}
//                               deleteStage={deleteStage}
//                             />
//                           )}

//                           {/* If stage is default, just show count (no delete) */}
//                           {stage.isDefault && (
//                             <span className="flex text-xs w-6 h-6 rounded-full items-center justify-center bg-muted">
//                               4
//                             </span>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                     <Droppable droppableId={stage.id}>
//                       {(provided, snapshot) => (
//                         // <div className="mt-3 space-y-2">
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.droppableProps}
//                           className={`mt-3 space-y-2 transition-all border-2 ${
//                             snapshot.isDraggingOver
//                               ? "border-dashed border-sky-400"
//                               : "border-transparent"
//                           }`}
//                         >
//                           {stage.tasks &&
//                             stage.tasks.map((task, index) => (
//                               <Draggable
//                                 draggableId={task.id}
//                                 index={index}
//                                 key={task.id}
//                               >
//                                 {(dragProvided, dragSnapshot) => (
//                                   <div
//                                     ref={dragProvided.innerRef}
//                                     {...dragProvided.draggableProps}
//                                     {...dragProvided.dragHandleProps}
//                                     className={`mb-2 p-3 rounded-lg shadow-sm bg-white border ${
//                                       dragSnapshot.isDragging
//                                         ? "opacity-90 scale-105"
//                                         : ""
//                                     }`}
//                                   >
//                                     <ProjectTaskCard
//                                       key={task.id}
//                                       task={task}
//                                       projectId={id as string}
//                                     />
//                                   </div>
//                                 )}
//                               </Draggable>
//                             ))}
//                           {provided.placeholder}
//                           <ProjectTaskFormCard
//                             projectId={id as string}
//                             stageId={stage.id}
//                           />
//                         </div>
//                       )}
//                     </Droppable>
//                   </div>
//                 ))}

function DeleteStageConfirmation({
  stage,
  projectId,
  deleteStage,
}: {
  stage: ProjectStage;
  projectId: string;
  deleteStage: (stageId: string) => Promise<ProjectStage>;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProjectStageDelete = async () => {
    try {
      setLoading(true);
      await deleteStage(stage.id);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECT, projectId],
      });
      setOpen(false);
    } catch (error) {
      console.error("Delete stage failed:", error);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <span className="flex text-xs font-mono w-6 h-6 rounded-full items-center justify-center bg-muted text-muted-foreground group-hover:hidden">
        {stage.tasks.length}
      </span>
      <AlertDialog
        open={open}
        onOpenChange={(isOpen) => !loading && setOpen(isOpen)}
      >
        <AlertDialogTrigger
          onClick={() => setOpen(true)}
          className="hidden cursor-pointer text-destructive w-6 h-6 rounded-full items-center justify-center group-hover:flex"
        >
          <Trash2Icon className="w-4 h-4" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete stage
              from current project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={(e) => {
                e.preventDefault(); // stops auto-close
                handleProjectStageDelete();
              }}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StageCreate({
  projectData,
  createStage,
  projectId,
}: {
  projectData: Project | undefined;
  createStage: ({
    projectId,
    name,
  }: {
    projectId: string;
    name: string;
  }) => Promise<ProjectStage>;
  projectId: string;
}) {
  const [stageCreate, setStageCreate] = useState(false);
  const [stageName, setStageName] = useState("");
  const queryClient = useQueryClient();

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter" && projectData && projectData.id) {
      await createStage({
        projectId: projectData.id,
        name: stageName,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECT, projectId],
      });
      setStageName("");
      setStageCreate(false);
    }
  };
  return (
    <>
      {!stageCreate ? (
        <>
          <div className="w-60 shrink-0">
            <Card
              className="py-3 cursor-pointer"
              onClick={() => setStageCreate(true)}
            >
              <CardContent>
                <div className="flex gap-2 items-center rounded-md group">
                  <PlusIcon size={18} />
                  <h4>Add stage</h4>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="w-60 shrink-0">
          <Card className="py-[6px] cursor-pointer">
            <CardContent className="px-1">
              <Input
                autoFocus
                className="py-0 border-0 shadow-none"
                onBlur={() => {
                  setStageCreate(false);
                  setStageName("");
                }}
                onChange={(e) => setStageName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                value={stageName}
                placeholder="new stage"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
