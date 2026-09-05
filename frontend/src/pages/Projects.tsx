import { ProjectPagination } from "@/components/project/project-pagination";
import { ProjectTable } from "@/components/project/project-table";
import { ProjectToolbar } from "@/components/project/project-toolbar";
import { useState } from "react";
// import { useProject } from "@/hooks/useProject";
import ProjectCards from "@/components/project/project-cards";
import { ProjectForm } from "@/components/project/project-form";
import type { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/api/queryKeys";
import { projectApi } from "@/api/projects";

export default function ProjectPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // const { updateProject } = useProject();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"table" | "cards">("table");

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: () => projectApi.getProjects(),
    staleTime: 1000 * 60 * 5, // 5 min stale time
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => projectApi.deleteProject(projectId),
    onMutate: (projectId: string) => {
      setDeletingId(projectId); // track current
    },
    onSettled: () => {
      setDeletingId(null); // reset when done (success or error)
    },
    onSuccess: (deletedProject) => {
      queryClient.setQueryData<Project[]>([QUERY_KEYS.PROJECTS], (old) => {
        return old
          ? old.filter((project) => project.id !== deletedProject.id)
          : [];
      });
    },
  });

  const totalPages = Math.ceil(projects?.length / perPage);

  const [projectFormMode, setProjectFormMode] = useState<"create" | "update">(
    "create"
  );

  const [updateProjectData, setUpdateProjectData] = useState<{
    data: Project | null;
    projectId: string;
  }>({
    data: null,
    projectId: "",
  });

  const updateProjectClickHandler = (project: Project) => {
    setUpdateProjectData({
      data: project,
      projectId: project.id,
    });
    setOpen(true);
    setProjectFormMode("update");
  };

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (error)
    return <p className="text-sm text-destructive">Error fetching projects</p>;

  return (
    <>
      <main className="p-4 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">All Projects</h1>
          <Button
            onClick={() => {
              setProjectFormMode("create");
              setOpen(true);
            }}
          >
            <PlusIcon /> New Project
          </Button>
        </div>
        <ProjectForm
          open={open}
          setOpen={setOpen}
          initialData={updateProjectData}
          // createProject={createProject}
          // updateProject={updateProject}
          mode={projectFormMode}
        />
        <ProjectToolbar view={view} setView={setView} />
        {view === "table" && (
          <ProjectTable
            projects={projects}
            deletingId={deletingId}
            deleteProjectMutation={deleteProjectMutation}
            updateProjectClickHandler={updateProjectClickHandler}
          />
        )}
        {view === "cards" && (
          <ProjectCards
            projects={projects}
            deletingId={deletingId}
            deleteProjectMutation={deleteProjectMutation}
            updateProjectClickHandler={updateProjectClickHandler}
          />
        )}
        <ProjectPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}
