import { useEffect, useState } from "react";
import { useEncryptedConfig } from "./useEncryptedConfig";
import { useNavigate } from "react-router-dom";

export function useCheckConfig() {
    const { config, updateConfig } = useEncryptedConfig();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const localDbHelthCheck = async () => {
        try {
            console.log("Admin Ip from config", config.adminIP);

            const response = await fetch(`${config.adminIP}/api/health`);
            if (!response.ok) {
                console.error("Local db helth check failed!");
                return false;
            }
            const result = await response.json();
            if (!result.success) return false;
            return result.local; // Return local db health check
        } catch (error) {
            console.error(error);
            return false
        }
    }

    const checkConfig = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login")
                return;
            }
            // Check for config
            console.log("🚀 ~ checkConfig ~ config:", config)
            if (!config || !config.adminIP) {
                setError("")
                navigate("/admin-connection")
                return;
            }

            const localDbHealth = await localDbHelthCheck();
            console.log("🚀 ~ checkConfig ~ localDbHealth:", localDbHealth)

            if (!localDbHealth) {
                updateConfig({ adminIP: "", isAdmin: false });
                navigate("/admin-connection")
                console.error("Database not connected, Please check your connection or try again later!");
                return;
            }
        } catch (error: Error | any) {
            console.error(error);
            setError(error.message || "Unknown error");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkConfig();
    }, [])

    return { loading, error, localDbHelthCheck }
}