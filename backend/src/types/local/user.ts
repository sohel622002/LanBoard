export interface UserCreate {
    email: string;
    isAdmin: boolean;
    password?: string;
    fullName?: string;
}