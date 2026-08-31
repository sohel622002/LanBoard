import { useState, useEffect, useCallback } from "react";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENC_DEC_SECRET_KEY;

// Helpers
const encrypt = (data: any) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (cipherText: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (err) {
        console.error("Decryption failed:", err);
        return null;
    }
};

export type AppConfig = {
    isAdmin: boolean;
    adminIP: string;
    theme: "light" | "dark";
};

export function useEncryptedConfig() {
    const initialValue: AppConfig = { isAdmin: false, adminIP: "", theme: 'light' };
    const [config, setConfig] = useState<AppConfig>(() => {
        const stored = localStorage.getItem('app_config');
        if (stored) {
            const decrypted = decrypt(stored);
            return decrypted ?? initialValue;
        }
        return initialValue;
    });

    // save whenever config changes
    useEffect(() => {
        if (config) {
            const encrypted = encrypt(config);
            localStorage.setItem('app_config', encrypted);
        }
    }, [config]);

    // update config with partial object
    const updateConfig = useCallback(
        (updates: Partial<AppConfig>) => {
            setConfig((prev) => ({ ...prev, ...updates }));
        },
        []
    );

    // reset
    const clearConfig = useCallback(() => {
        localStorage.removeItem('app_config');
        if (initialValue) setConfig(initialValue);
    }, [initialValue]);

    return { config, updateConfig, clearConfig };
}
