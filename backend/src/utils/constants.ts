import os from "os";
import path from "path";
import fs from "fs";

// Base application data directory (outside exe, writable)
console.log("os.homedir()", os.homedir());

export const APP_DATA_DIR = path.join(os.homedir(), ".myapp"); // or use os.tmpdir() if temporary only
if (!fs.existsSync(APP_DATA_DIR)) {
    fs.mkdirSync(APP_DATA_DIR, { recursive: true });
}

export const POSTGRES_URLS = {
    "win32-x64": {
        url: "https://get.enterprisedb.com/postgresql/postgresql-15.4-1-windows-x64-binaries.zip",
        filename: "postgresql-windows-x64.zip",
    },
    "win32-ia32": {
        url: "https://get.enterprisedb.com/postgresql/postgresql-15.4-1-windows-binaries.zip",
        filename: "postgresql-windows-x32.zip",
    },
    "darwin-x64": {
        url: "https://get.enterprisedb.com/postgresql/postgresql-15.4-1-osx-binaries.zip",
        filename: "postgresql-macos.zip",
    },
    "darwin-arm64": {
        url: "https://get.enterprisedb.com/postgresql/postgresql-15.4-1-osx-binaries.zip",
        filename: "postgresql-macos-arm.zip",
    },
    "linux-x64": {
        url: "https://get.enterprisedb.com/postgresql/postgresql-15.4-1-linux-x64-binaries.tar.gz",
        filename: "postgresql-linux-x64.tar.gz",
    },
};

// Writable directories (outside exe)
export const BIN_DIR = path.join(APP_DATA_DIR, "postgres-bin");
export const DATA_DIR = path.join(APP_DATA_DIR, "postgres_data");
export const TEMP_DIR = path.join(APP_DATA_DIR, "temp-postgres");

export const POSTGRES_PORT = 55432;
