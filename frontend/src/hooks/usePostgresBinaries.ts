import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import toast from "react-hot-toast";
// import { useUser } from "./useUser";
import { userApi } from "@/api/user";

export function usePostgresBinaries() {
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
    const [process, setProcess] = useState(false);
    const [postgresBinariesDownloadProgress, setPostgresBinariesDownloadProgress] = useState(0);
    const [downloadingPostgresBinaries, setDownloadingPostgresBinaries] = useState(false);
    const [initializingPostgresBinaries, setInitializingPostgresBinaries] = useState(false);
    const [postgresRunning, setPostgresRunning] = useState(false);
    const [postgresBinariesEvent, setPostgresBinariesEvent] = useState("");

    // const { createUser } = useUser();

    const { on, off } = useSocket();

    type PostgresDownloadEventKey =
        | "checkExisting"
        | "downloading"
        | "extracting"
        | "locating"
        | "copying"
        | "cleanup"
        | "done";

    const postgresDownloadEvents: Record<PostgresDownloadEventKey, string> = {
        checkExisting: "Checking for existing PostgreSQL installation…",
        downloading: "Downloading PostgreSQL binaries…",
        extracting: "Extracting PostgreSQL binaries…",
        locating: "Locating PostgreSQL executables…",
        copying: "Copying PostgreSQL binaries…",
        cleanup: "Cleaning up temporary files…",
        done: "PostgreSQL setup completed successfully!",
    }

    const downloadPostgresBinaries = async () => {
        try {
            setProcess(true);
            setInitializingPostgresBinaries(false);
            const response = await fetch(`${VITE_BACKEND_URL}/api/postgres/download`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error("download postgres binaries failed");
            }

            const result: { success?: boolean } = await response.json();

            console.log("result from download postgres bonaries => ", result);

            if (!result.success) {
                setProcess(false);
                toast.error("Error: Download postgres binaries failed")
                return;
            }

            setDownloadingPostgresBinaries(false);
            initializePostgresBinaries()
        } catch (error: Error | any) {
            console.error(error);
            toast.error(error ? error.message : "Download postgres binaries failed. Please try again.");
            setProcess(false);
        }
    }

    const initializePostgresBinaries = async () => {
        try {
            setProcess(true);
            setDownloadingPostgresBinaries(false);
            setInitializingPostgresBinaries(true);

            const response = await fetch(`${VITE_BACKEND_URL}/api/postgres/initialize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error("initialize postgres binaries failed");
            }

            const result: { success?: boolean, message?: string } = await response.json();

            console.log("result from initialize postgres bonaries => ", result);

            setProcess(false);
            setInitializingPostgresBinaries(true);

            if (!result.success) {
                toast.error("Error: Initialize postgres binaries failed")
                return;
            }

            toast.success(result?.message || 'successfully initialized postgres binaries');
            const localStoredAdminUser = JSON.parse(localStorage.getItem("user") as string);
            console.log("localStoredAdminUser", localStoredAdminUser);
            delete localStoredAdminUser.id;
            // await createUser(localStoredAdminUser);
            await userApi.createUser(localStoredAdminUser)
            setPostgresRunning(true)
        } catch (error: Error | any) {
            console.error(error);
            toast.error(error ? error.message : "Initialize postgres binaries failed. Please try again.");
            setProcess(false);
        }
    }

    useEffect(() => {
        off(SOCKET_EVENTS.POSTGRES_BINARY_PROGRESS);
        off(SOCKET_EVENTS.POSTGRES_BINARY_DOWNLOAD);
        off(SOCKET_EVENTS.POSTGRES_BINARY_EVENT);
        off(SOCKET_EVENTS.POSTGRES_BINARY_INITIALIZE);

        on(SOCKET_EVENTS.POSTGRES_BINARY_PROGRESS, (data) => {
            console.log("POSTGRES_BINARY_PROGRESS", data);
            setPostgresBinariesDownloadProgress(data.percent);
        });

        on(SOCKET_EVENTS.POSTGRES_BINARY_DOWNLOAD, (data) => {
            console.log("POSTGRES_BINARY_DOWNLOAD", data);
            if (data['started']) {
                setDownloadingPostgresBinaries(true);
            }
            if (data['downloaded']) {
                setDownloadingPostgresBinaries(false);
                setPostgresBinariesDownloadProgress(0);
            }
        });

        // on(SOCKET_EVENTS.POSTGRES_BINARY_INITIALIZE, (data) => {
        //     console.log("POSTGRES_BINARY_INITIALIZE", data);
        //     if (data['event']) {
        //         setInitializingPostgresBinaries()
        //     }
        // });

        on(SOCKET_EVENTS.POSTGRES_BINARY_EVENT, (data) => {
            console.log("POSTGRES_BINARY_EVENT", data);
            if (data['event']) {
                const eventKey = data['event'] as PostgresDownloadEventKey;
                if (eventKey in postgresDownloadEvents) {
                    setPostgresBinariesEvent(postgresDownloadEvents[eventKey]);
                    // if (eventKey === 'done') initializePostgresBinaries();
                    if (eventKey === 'extracting') setDownloadingPostgresBinaries(false)
                } else {
                    setPostgresBinariesEvent("");
                }
            }
        });

        return () => {
            off(SOCKET_EVENTS.POSTGRES_BINARY_PROGRESS);
            off(SOCKET_EVENTS.POSTGRES_BINARY_DOWNLOAD);
            off(SOCKET_EVENTS.POSTGRES_BINARY_EVENT);
            off(SOCKET_EVENTS.POSTGRES_BINARY_INITIALIZE);
        };
    }, [on, off]);

    return { downloadPostgresBinaries, process, postgresBinariesEvent, postgresRunning, initializingPostgresBinaries, downloadingPostgresBinaries, postgresBinariesDownloadProgress }
}