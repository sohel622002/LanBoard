import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Generic type for event map
type EventMap = Record<string, (...args: any[]) => void>;

export const useSocket = <
  ServerEvents extends EventMap = EventMap,
  ClientEvents extends EventMap = EventMap
>(
  serverUrl: string = "http://localhost:3001"
) => {
  const socketRef = useRef<Socket<ServerEvents, ClientEvents> | null>(null);

  useEffect(() => {
    socketRef.current = io(serverUrl, {
      transports: ["websocket"],
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [serverUrl]);

  // Send message to any topic
  const send = <T extends keyof ClientEvents>(
    event: T,
    ...args: Parameters<ClientEvents[T]>
  ) => {
    socketRef.current?.emit(event as any, ...args);
  };

  // Listen for any topic
  const on = <T extends keyof ServerEvents>(
    event: T,
    callback: ServerEvents[T]
  ) => {
    socketRef.current?.on(event as any, callback);
  };

  // Remove listener
  const off = <T extends keyof ServerEvents>(
    event: T,
    callback?: ServerEvents[T]
  ) => {
    socketRef.current?.off(event as any, callback);
  };

  return { send, on, off };
};
