const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = !app.isPackaged;
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

function startBackendServer() {
  try {
    const backendPath = isDev
      ? path.join(__dirname, "backend", "dist", "index.js") // Local path for dev
      : path.join(
          process.resourcesPath,
          "app.asar.unpacked",
          "backend",
          "dist",
          "backend.exe"
        ); // Packaged executable for production

    const isExecutable = !isDev && backendPath.endsWith(".exe");

    console.log(`🔍 Looking for backend at: ${backendPath}`);
    console.log(`📁 isDev: ${isDev}`);
    console.log(`📁 isExecutable: ${isExecutable}`);

    if (!fs.existsSync(backendPath)) {
      console.error(`❌ Backend file not found: ${backendPath}`);

      // Let's also check what files actually exist in the resources directory
      if (!isDev) {
        const resourcesDir = path.join(
          process.resourcesPath,
          "app.asar.unpacked"
        );
        console.log(`📁 Checking resources directory: ${resourcesDir}`);
        try {
          if (fs.existsSync(resourcesDir)) {
            console.log(
              `📁 Contents of ${resourcesDir}:`,
              fs.readdirSync(resourcesDir)
            );
            const backendDir = path.join(resourcesDir, "backend");
            if (fs.existsSync(backendDir)) {
              console.log(
                `📁 Contents of ${backendDir}:`,
                fs.readdirSync(backendDir)
              );
              const backendDistDir = path.join(backendDir, "dist");
              if (fs.existsSync(backendDistDir)) {
                console.log(
                  `📁 Contents of ${backendDistDir}:`,
                  fs.readdirSync(backendDistDir)
                );
              }
            }
          }
        } catch (err) {
          console.error("Error checking directories:", err);
        }
      }
      return;
    }

    const backendCwd = isDev
      ? path.join(__dirname, "backend", "dist")
      : path.join(
          process.resourcesPath,
          "app.asar.unpacked",
          "backend",
          "dist"
        );

    // Use different spawn arguments based on whether it's an executable or node script
    const spawnCommand = isExecutable ? backendPath : "node";
    const spawnArgs = isExecutable ? [] : [backendPath];

    backendProcess = spawn(spawnCommand, spawnArgs, {
      cwd: backendCwd,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    if (backendProcess.stdout) {
      backendProcess.stdout.on("data", (data) => {
        console.log("✅ Backend stdout:", data.toString());
      });
    }
    if (backendProcess.stderr) {
      backendProcess.stderr.on("data", (data) => {
        console.error("❌ Backend stderr:", data.toString());
      });
    }

    // Listen for messages via IPC (if your backend sends any)
    backendProcess.on("message", (msg) => {
      console.log("✅ Backend (message):", msg);
    });

    backendProcess.on("error", (err) => {
      console.error("❌ Backend (error):", err);
    });

    backendProcess.on("exit", (code, signal) => {
      console.log(
        `⚠️ Backend process exited with code ${code}, signal ${signal}`
      );
    });
  } catch (error) {
    console.error("Error starting backend:", error);
  }
}

function stopBackendServer() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
    console.log("Backend process killed.");
  }
}

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    window.loadURL("http://localhost:5173");
    window.webContents.openDevTools();
  } else {
    const frontendPath = path.join(__dirname, "frontend", "dist", "index.html");
    window.loadFile(frontendPath);
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  return window;
}

app.on("ready", async () => {
  try {
    startBackendServer();
    mainWindow = createMainWindow();
  } catch (error) {
    dialog.showErrorBox(
      "Startup Error",
      `Failed to start the application:\n\n${error.message}`
    );
  }
});

app.on("window-all-closed", () => {
  // quit app & stop backend
  if (process.platform !== "darwin") {
    stopBackendServer();
    app.quit();
  }
});

app.on("before-quit", () => {
  // ensure backend is killed before quitting
  stopBackendServer();
});

app.on("activate", () => {
  if (mainWindow === null) {
    startBackendServer();
    mainWindow = createMainWindow();
  }
});
