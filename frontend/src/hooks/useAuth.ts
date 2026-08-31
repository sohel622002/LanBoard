import { useState } from "react";
import toast from "react-hot-toast";
import { useEncryptedConfig } from "./useEncryptedConfig";
import { useNavigate } from "react-router-dom";
import { createApiInstance } from "@/api/axiosInstance";

type LoginSignupResponse = {
    success: boolean;
    message: string;
    isAdmin: boolean;
    user: {
        id: string;
        email: string;
        password: string;
        fullName: string;
    },
    token: string;
}

export const useAuth = () => {
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [user, setUser] = useState<LoginSignupResponse["user"] | null>(null);
    const { config, updateConfig } = useEncryptedConfig();
    const navigate = useNavigate();

    const login = async (email: string, password: string, adminIP?: string) => {
        try {
            console.log("config.adminIP", config.adminIP);
            const baseURL = adminIP || config.adminIP;

            if (!baseURL) {
                navigate("/admin-connection")
                toast.error("Admin ip missing, Please connect to admin server first!");
                return;
            }

            const response = await fetch(`${baseURL}/api/local/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const result: LoginSignupResponse = await response.json();
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            setUser(result.user);
            navigate("/")
            toast.success(result.message || "Login successful!");
        } catch (error: Error | any) {
            console.error(error);
            toast.error(error ? error.message : "Login failed. Please check your credentials and try again.");
        }
    }

    const signUp = async (data: { email: string, password: string, fullName: string }) => {
        const { email, password, fullName } = data;
        try {
            // isAdmin is always true for first user (as cloud setup)
            const response = await fetch(`${VITE_BACKEND_URL}/api/cloud/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, fullName, isAdmin: true }),
            });

            if (!response.ok) {
                throw new Error("Sign up failed");
            }

            const result: LoginSignupResponse = await response.json();

            console.log("result => ", result);

            if (!result.success) {
                toast.error(result.message || "Sign up failed!");
                return;
            }
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            setUser(result.user);
            updateConfig({ isAdmin: true, adminIP: 'http://localhost:3001' });
            createApiInstance(`http://localhost:3001/`);
            navigate("/setup-process");
            toast.success(result.message || "Sign up successful!");
        } catch (error: Error | any) {
            console.error(error);
            toast.error(error ? error.message : "Sign up failed. Please try again.");
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const validateUserLoggedIn = () => {
        const token = localStorage.getItem("token");
        if (!token) return false;
        return true;
    };

    return { login, signUp, logout, user, validateUserLoggedIn };
}