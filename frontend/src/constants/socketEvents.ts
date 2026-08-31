// List all socket event topics here
export const SOCKET_EVENTS = {
  POSTGRES_BINARY_PROGRESS: "postgres_binary_progress",
  POSTGRES_BINARY_DOWNLOAD: "postgres_binary_download",
  POSTGRES_BINARY_EVENT: "postgres_binary_event",
  POSTGRES_BINARY_INITIALIZE: "postgres_binary_initialize"
} as const;

// This creates a union type of all event names
export type SocketEventName = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
