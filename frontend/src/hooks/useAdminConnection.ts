import { getApi } from "@/api/axiosInstance"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export type Admin = {
    name: string
    ip: string
    port: number
    userid: string
}

export const useAdminConnection = () => {
    const [discoveredServers, setDiscoveredServers] = useState<Admin[]>([])

    const fetchAdminsInNetwork = async () => {
        try {
            const response = await getApi().get("/api/listen/bonjour");
            console.log("🚀 ~ fetchAdminsInNetwork ~ response.data:", response.data)
            setDiscoveredServers(response.data.body);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch admins in network!")
        }
    }

    useEffect(() => {
        fetchAdminsInNetwork();
    }, [])

    return { discoveredServers, fetchAdminsInNetwork }
}