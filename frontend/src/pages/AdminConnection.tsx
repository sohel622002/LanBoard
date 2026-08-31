import { createApiInstance } from "@/api/axiosInstance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminConnection, type Admin } from "@/hooks/useAdminConnection";
import { useAuth } from "@/hooks/useAuth";
import { useEncryptedConfig } from "@/hooks/useEncryptedConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Server,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminConnection() {
  const { login } = useAuth();
  const { updateConfig } = useEncryptedConfig();
  const { discoveredServers, fetchAdminsInNetwork } = useAdminConnection();

  const [adminIP, setAdminIP] = useState("");
  const [connectionStep, setConnectionStep] = useState<"discovery" | "login">(
    "discovery"
  );
  const [selectedServer, setSelectedServer] = useState<Partial<Admin> | null>(
    null
  );
  const navigate = useNavigate();

  const [manualConnection, setManualConnection] = useState({
    ipAddress: "",
    port: 3001,
  });

  const [isScanning, setIsScanning] = useState(false);

  const handleRefreshServers = async () => {
    setIsScanning(true);
    await fetchAdminsInNetwork();
    setIsScanning(false);
  };

  const handleConnectToServer = (server: Admin) => {
    console.log("server:", server);
    updateConfig({
      adminIP: `http://${server.ip}:${server.port}`,
      isAdmin: false,
    });
    createApiInstance(`http://${server.ip}:${server.port}/`);
    setAdminIP(`http://${server.ip}:${server.port}`)
    setSelectedServer(server);
    setConnectionStep("login");
  };

  const handleManualConnect = () => {
    if (!manualConnection.ipAddress || !manualConnection.port) return;
    updateConfig({
      adminIP: `http://${manualConnection.ipAddress}:${manualConnection.port}`,
      isAdmin: false,
    });
    createApiInstance(
      `http://${manualConnection.ipAddress}:${manualConnection.port}/`
    );
    setAdminIP(`http://${manualConnection.ipAddress}:${manualConnection.port}`)
    setSelectedServer({
      ip: manualConnection.ipAddress,
      port: manualConnection.port,
    });
    setConnectionStep("login");
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("data", data);
      await login(data.email, data.password, adminIP);
    } catch (error) {
      console.error(error);
    }
  };

  if (connectionStep === "login" && selectedServer) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
        <header className="p-6">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              onClick={() => setConnectionStep("discovery")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Server Discovery
            </Button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Server className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Connect to Admin</CardTitle>
              <CardDescription>
                Connecting to {selectedServer.name || selectedServer.ip}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Server</span>
                  <Badge variant="secondary">
                    <Wifi className="w-3 h-3 mr-1" />
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedServer.ip}:{selectedServer.port}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  {/* Email field */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
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

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-5">
              <h1 className="text-3xl font-semibold mb-4">Connect to Admin</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find and connect to your admin's server to start collaborating
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Auto-Discovery Panel */}
              <Card className="">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Wifi className="w-5 h-5" />
                        Available Servers
                      </CardTitle>
                      <CardDescription>
                        Automatically discovered team servers on your network
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshServers}
                      disabled={isScanning}
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          isScanning ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {discoveredServers &&
                      discoveredServers.map((server) => (
                        <div
                          key={server.ip}
                          className="p-4 border rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{server.name}</h4>
                            <Badge variant="default">
                              <Wifi className="w-3 h-3 mr-1" />
                              online
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {server.ip}:{server.port} • Last seen: Just now
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleConnectToServer(server)}
                            className="w-full"
                          >
                            Connect
                          </Button>
                        </div>
                      ))}

                    {discoveredServers.length === 0 && !isScanning && (
                      <div className="text-center py-8">
                        <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No servers found
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Make sure you're on the same network as your team
                          server
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Manual Connection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Manual Connection
                  </CardTitle>
                  <CardDescription>
                    Connect directly using IP address and port
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        If you don't see your team server above, you can connect
                        manually using the connection details provided by your
                        team leader.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="manualIp">Server IP Address</Label>
                      <Input
                        id="manualIp"
                        placeholder="192.168.1.100"
                        value={manualConnection.ipAddress}
                        onChange={(e) =>
                          setManualConnection((prev) => ({
                            ...prev,
                            ipAddress: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manualPort">Port</Label>
                      <Input
                        id="manualPort"
                        placeholder="8080"
                        value={manualConnection.port}
                        onChange={(e) =>
                          setManualConnection((prev) => ({
                            ...prev,
                            port: Number(e.target.value),
                          }))
                        }
                      />
                    </div>

                    <Button
                      onClick={handleManualConnect}
                      className="w-full"
                      disabled={
                        !manualConnection.ipAddress || !manualConnection.port
                      }
                    >
                      Connect Manually
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Need help?</p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          • Ask your team leader for the server connection
                          details
                        </li>
                        <li>
                          • Make sure you're connected to the same network
                        </li>
                        <li>
                          • Check that the server is running and accessible
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
