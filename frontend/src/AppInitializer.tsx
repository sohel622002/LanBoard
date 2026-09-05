import { type ReactNode } from "react";
import { useCheckConfig } from "./hooks/useCheckConfig";

interface AppInitializerProps {
  children: ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const { loading, error } = useCheckConfig();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-background text-destructive">
        Error: {error}
      </div>
    );

  return <>{children}</>;
};
