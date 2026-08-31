// src/api/axiosInstance.ts
import axios, { type AxiosInstance } from "axios";

let api: AxiosInstance | null = null;

export const createApiInstance = (baseURL: string) => {
    api = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // You can add interceptors if needed
    api.interceptors.response.use(
        (res) => res,
        (err) => {
            console.error("API error:", err.response?.data || err.message);
            return Promise.reject(err);
        }
    );

    return api;
};

export const getApi = () => {
    if (!api) {
        throw new Error("API instance not initialized. Call createApiInstance first.");
    }
    return api;
};
