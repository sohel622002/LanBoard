import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">ProjectVault</h1>
              <p className="text-xs text-muted-foreground">v2.1.0</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-5">
            <h2 className="text-3xl font-semibold mb-4">
              Welcome to ProjectVault
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your project management with powerful tools for teams
              and individuals. Organize tasks, collaborate effectively, and
              deliver projects on time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together seamlessly with real-time updates and
                  communication tools
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Project Management</CardTitle>
                <CardDescription>
                  Organize projects with Kanban boards, timelines, and progress
                  tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <User className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Personal Productivity</CardTitle>
                <CardDescription>
                  Manage your individual tasks and projects with powerful
                  organizational tools
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto"
            >
              Sign In
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto"
            >
              Create Account
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/admin-connection")}
              className="w-full sm:w-auto"
            >
              Connect to Team
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              Help & Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
