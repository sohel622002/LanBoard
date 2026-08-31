import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export class SocketService {
    public io: IOServer;

    async initSocket(server: HTTPServer): Promise<void> {
        const { Server } = require("socket.io");
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.on("connection", (socket: Socket) => {
            console.log("A user connected:", socket.id);

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }

    async emitToAll(event: string, data: unknown): Promise<void> {
        if (!this.io) {
            console.error("Socket.io not initialized!");
            return;
        }
        this.io.emit(event, data);
    }

    async emitToSocket(socketId: string, event: string, data: unknown): Promise<void> {
        if (!this.io) {
            console.error("Socket.io not initialized!");
            return;
        }
        this.io.to(socketId).emit(event, data);
    }
}

export const socketService = new SocketService();