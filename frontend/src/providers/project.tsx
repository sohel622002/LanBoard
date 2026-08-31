import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useCallback,
} from "react";
import type { Project } from "@/types/project";
import { getApi } from "@/api/axiosInstance";

type State = {
  projects: Project[];
  selectedProject?: Project;
  loading: boolean;
  error?: string;
};

type Action =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | undefined };

const initialState: State = {
  projects: [],
  loading: false,
  error: undefined,
};

const projectReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

type ProjectContextTypes = {
  state: State;
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (data: Project, projectId: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
};

const ProjectContext = createContext<ProjectContextTypes>({
  state: initialState,
  fetchProjects: async () => {},
  createProject: async () => {},
  updateProject: async () => {},
  deleteProject: async () => {},
});

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  const fetchProjects = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await getApi().get("/api/projects");
      dispatch({ type: "SET_PROJECTS", payload: response.data.body });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const createProject = async (data: Partial<Project>) => {
    try {
      const response = await getApi().post("/api/projects", data);
      dispatch({ type: "ADD_PROJECT", payload: response.data.body });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  const updateProject = async (data: Project, projectId: string) => {
    try {
      const response = await getApi().put(`/api/project/${projectId}`, data);
      dispatch({ type: "UPDATE_PROJECT", payload: response.data.body });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await getApi().delete(`/api/project/${projectId}`);
      dispatch({ type: "DELETE_PROJECT", payload: projectId });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        state,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
