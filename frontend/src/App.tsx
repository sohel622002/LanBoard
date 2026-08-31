// import { LoginForm } from "./components/login-form";
import Layout from "./components/layout";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SetupProcess from "./pages/SetupProcess";
import AdminConnection from "./pages/AdminConnection";
import { useEffect } from "react";
import ProjectPage from "./pages/Projects";
import { Toaster } from "react-hot-toast";
import { AppInitializer } from "./AppInitializer";
import { useEncryptedConfig } from "./hooks/useEncryptedConfig";
import { createApiInstance } from "./api/axiosInstance";
import UsersPage from "./pages/Users";
import ProjectView from "./pages/ProjectView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Welcome from "./pages/Welcome";

// Create a client
const queryClient = new QueryClient();

function App() {
  const { config } = useEncryptedConfig();

  useEffect(() => {
    if (config.adminIP) {
      createApiInstance(config.adminIP);
    }
  }, [config.adminIP]);

  return (
    <section className="min-h-screen bg-background">
      <Toaster />
      <Router>
        <QueryClientProvider client={queryClient}>
          <AppInitializer>
            <Routes>
              {/* Public Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/setup-process" element={<SetupProcess />} />
              <Route path="/admin-connection" element={<AdminConnection />} />

              {/* Protected / Layout Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectPage />} />
                <Route path="/projects/:id" element={<ProjectView />} />
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Routes>
          </AppInitializer>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Router>
    </section>
  );
}

export default App;
