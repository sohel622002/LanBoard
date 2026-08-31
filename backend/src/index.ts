import express from "express";
import cors from "cors";
import { createServer } from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cloudAuthRoutes from './cloud/routes/auth';
import postgresRoutes from './cloud/routes/prostgres';
import localAuthRoutes from './local/routes/auth';
import userRoutes from './local/routes/user';
import projectRoutes from './local/routes/project';
import projectStageRoutes from './local/routes/project-stage';
import projectStageTaskRoutes from './local/routes/project-stage-task';
import bonjourRoutes from './local/routes/bonjour';
import dotenv from "dotenv";
import { socketService } from "./local/services/socketService";
import { db } from "./database/index"

dotenv.config();

const app = express();

app.use(cors({
    credentials: true
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Cloud routes
app.use('/api/cloud/auth', cloudAuthRoutes);
app.use('/api/postgres', postgresRoutes);

// Local routes
app.use('/api/local/auth', localAuthRoutes);
app.use("/api", userRoutes)
app.use("/api", projectRoutes)
app.use("/api", projectStageRoutes)
app.use("/api", projectStageTaskRoutes)

app.use("/api", bonjourRoutes)

app.get("/api/health", async (req, res) => {
    try {
        const status = await db.healthCheck();
        res.json({ success: true, ...status });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const httpServer = createServer(app);

socketService.initSocket(httpServer);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log("Server running at:");
    console.log(`http://localhost:${PORT}`);
})