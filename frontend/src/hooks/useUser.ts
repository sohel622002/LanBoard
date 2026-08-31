import { useEffect, useState } from "react";
import { useEncryptedConfig } from "./useEncryptedConfig"
import toast from "react-hot-toast";
import { getApi } from "@/api/axiosInstance";
import type { User } from "@/types/user";

export const useUser = () => {
    const { config } = useEncryptedConfig();
    const [users, setUsers] = useState<User[]>([]);

    const createUser = async (userPaylod: any) => {
        if (!config.adminIP) return console.error("Admin IP Not found!");
        try {
            const response = await getApi().post("/api/user", userPaylod);
            setUsers((prev) => [...prev, response.data.body]);
        } catch (error: Error | any) {
            console.error(error);
            toast.error(error ? error.message : "Login failed. Please check your credentials and try again.");
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await getApi().get("/api/user");
            setUsers(response.data.body);
        } catch (error: Error | unknown) {
            console.error(error);
            toast.error("Failed to fetch users")
        }
    }

    useEffect(() => {
        fetchUsers();
        console.log("config", config);
    }, [])

    return { users, createUser }
}