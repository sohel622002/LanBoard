export const ERROR_CODES = {
  INVALID_TOKEN: "INVALID_TOKEN",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  PERMISSION_DENIED: "PERMISSION_DENIED",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
