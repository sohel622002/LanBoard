import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { useCheckConfig } from "@/hooks/useCheckConfig";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { localDbHelthCheck } = useCheckConfig();
  const [localHealth, setLocalHealth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkLocalConfig = async () => {
    try {
      const health = await localDbHelthCheck();
      setLocalHealth(health);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    checkLocalConfig();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        Loading...
      </div>
    );

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
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
        <main className="flex-1 flex items-center gap-8 justify-center p-6">
          <LoginForm localHealth={localHealth}/>
        </main>
      </div>
    </>
  );
}
