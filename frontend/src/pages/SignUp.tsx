import { SignupForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
        {/* Header */}
        <header className="p-6">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/welcome")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Welcome
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <SignupForm />
        </main>
      </div>
    </>
  );
}
