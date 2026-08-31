export interface SignupRequest {
    email: string;
    isAdmin: boolean;
    password: string;
    fullName?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        fullName?: string;
        createdAt: Date;
    };
    token?: string;
}