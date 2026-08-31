import { BIN_DIR, DATA_DIR, POSTGRES_PORT, POSTGRES_URLS, TEMP_DIR } from '../../utils/constants';
import path from "path";
import fs from "fs";
import https from "https";
import { socketService } from '../../local/services/socketService';
import extract from 'extract-zip';
import { ChildProcess, spawn } from 'child_process';
import { Client } from "pg";

export class PostgresService {
    public isInitialized: boolean = false;
    public postgresProcess: ChildProcess;

    async getPlatformKey(): Promise<keyof typeof POSTGRES_URLS> {
        const platform = process.platform;
        const arch = process.arch;

        console.log(`Detected platform: ${platform}, architecture: ${arch}`);

        if (platform === 'win32') {
            return arch === 'x64' ? 'win32-x64' : 'win32-ia32';
        } else if (platform === 'darwin') {
            return arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64';
        } else if (platform === 'linux') {
            return 'linux-x64';
        }

        throw new Error(`Unsupported platform: ${platform}-${arch}`);
    }

    async downloadFile(url: string, destination: string): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log(`Downloading from: ${url}`);
            console.log(`Saving to: ${destination}`);

            const file = fs.createWriteStream(destination);

            https.get(url, (response) => {
                if (response.statusCode === 302 || response.statusCode === 301) {
                    // Handle redirect
                    return this.downloadFile(response.headers.location, destination)
                        .then(resolve)
                        .catch(reject);
                }

                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    return;
                }

                const totalSize = parseInt(response.headers['content-length'], 10);
                let downloadedSize = 0;

                response.on('data', (chunk) => {
                    downloadedSize += chunk.length;
                    if (totalSize) {
                        const percent = ((downloadedSize / totalSize) * 100).toFixed(1);
                        process.stdout.write(`\rDownloading... ${percent}%`);
                        socketService.emitToAll('postgres_binary_progress', { percent });
                    }
                });

                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    console.log('\nDownload completed!');
                    resolve();
                });

                file.on('error', (err) => {
                    fs.unlink(destination, () => { }); // Delete partial file
                    reject(err);
                });
            }).on('error', reject);
        });
    }

    async cleanupTempDirectory() {
        if (!fs.existsSync(TEMP_DIR)) {
            return;
        }

        try {
            // On Windows, some files might be locked, so we'll try multiple approaches
            if (process.platform === 'win32') {
                // First, try to remove read-only attributes recursively
                try {
                    const { spawn } = require('child_process');
                    await new Promise((resolve) => {
                        const attrib = spawn('attrib', ['-R', path.join(TEMP_DIR, '*'), '/S'], { stdio: 'ignore' });
                        attrib.on('close', () => resolve(null));
                        attrib.on('error', () => resolve(null)); // Ignore errors, continue cleanup
                    });
                } catch (err) {
                    // Ignore attrib errors
                }

                // Try to remove with timeout
                let attempts = 0;
                const maxAttempts = 3;

                while (attempts < maxAttempts && fs.existsSync(TEMP_DIR)) {
                    try {
                        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
                        break;
                    } catch (error) {
                        attempts++;
                        if (attempts < maxAttempts) {
                            console.log(`Cleanup attempt ${attempts} failed, retrying in 1 second...`);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        } else {
                            console.warn('⚠️ Could not fully clean up temporary directory. You may need to manually delete:', TEMP_DIR);
                            console.warn('This is usually due to file locks and is safe to ignore.');
                        }
                    }
                }
            } else {
                // On Unix-like systems, standard cleanup should work
                fs.rmSync(TEMP_DIR, { recursive: true, force: true });
            }
        } catch (error) {
            console.warn('⚠️ Could not fully clean up temporary directory:', error.message);
            console.warn('You may need to manually delete:', TEMP_DIR);
        }
    }

    public copyDirectory(src: string, dest: string) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const files = fs.readdirSync(src);

        for (const file of files) {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);

            if (fs.statSync(srcPath).isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);

                // Make executable on Unix-like systems
                if (process.platform !== 'win32') {
                    try {
                        fs.chmodSync(destPath, 0o755);
                    } catch (err) {
                        console.warn(`Could not make ${destPath} executable:`, err.message);
                    }
                }
            }
        }
    }

    public findPostgresBinaries(extractPath: string): string | null {
        // Common paths where PostgreSQL binaries might be located
        const possiblePaths = [
            path.join(extractPath, 'pgsql', 'bin'),
            path.join(extractPath, 'postgresql', 'bin'),
            path.join(extractPath, 'bin'),
            path.join(extractPath, 'pgsql'),
            path.join(extractPath, 'postgresql')
        ];

        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                const files = fs.readdirSync(possiblePath);
                const hasPostgres = files.some(file =>
                    file.startsWith('postgres') && (file.endsWith('.exe') || !file.includes('.'))
                );
                const hasInitdb = files.some(file =>
                    file.startsWith('initdb') && (file.endsWith('.exe') || !file.includes('.'))
                );

                if (hasPostgres && hasInitdb) {
                    console.log(`Found PostgreSQL binaries in: ${possiblePath}`);
                    return possiblePath;
                }
            }
        }

        // If not found in bin directories, look for the parent directory
        const walkDir = (dir: string): string | null => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    const result = this.findPostgresBinaries(fullPath);
                    if (result) return result;
                }
            }
            return null;
        };

        return walkDir(extractPath);
    }

    public async extractArchive(archivePath: string, extractPath: string): Promise<void> {
        console.log(`Extracting ${archivePath} to ${extractPath}`);

        if (archivePath.endsWith('.zip')) {
            await extract(archivePath, { dir: extractPath });
        } else if (archivePath.endsWith('.tar.gz')) {
            // For tar.gz files, use tar command
            return new Promise((resolve, reject) => {
                const tar = spawn('tar', ['-xzf', archivePath, '-C', extractPath]);

                tar.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`tar extraction failed with code ${code}`));
                    }
                });

                tar.on('error', reject);
            });
        }
    }

    async downloadPostgresBinaries() {
        try {
            console.log('🐘 PostgreSQL Auto-Downloader');
            console.log('==============================');

            socketService.emitToAll('postgres_binary_event', { event: "checkExisting" });

            // Check if postgres-bin already exists
            if (fs.existsSync(BIN_DIR)) {
                console.log('postgres-bin directory already exists');

                // Check if it has the required binaries
                const binPath = path.join(BIN_DIR, 'bin');
                if (fs.existsSync(binPath)) {
                    const files = fs.readdirSync(binPath);
                    const hasPostgres = files.some(file => file.startsWith('postgres'));
                    const hasInitdb = files.some(file => file.startsWith('initdb'));

                    if (hasPostgres && hasInitdb) {
                        console.log('PostgreSQL binaries already present');
                        return;
                    }
                }
            }

            const platformKey = await this.getPlatformKey();
            const downloadInfo = POSTGRES_URLS[platformKey];

            if (!downloadInfo) {
                throw new Error(`No download URL available for platform: ${platformKey}`);
            }

            console.log(`📥 Downloading PostgreSQL for ${platformKey}...`);
            socketService.emitToAll('postgres_binary_event', { event: "downloading" });

            // Create temp directory
            if (!fs.existsSync(TEMP_DIR)) {
                fs.mkdirSync(TEMP_DIR, { recursive: true });
            }

            const archivePath = path.join(TEMP_DIR, downloadInfo.filename);

            socketService.emitToAll('postgres_binary_download', { started: true });
            // Download PostgreSQL
            await this.downloadFile(downloadInfo.url, archivePath);
            socketService.emitToAll('postgres_binary_download', { downloaded: true });

            // Extract archive
            console.log('📦 Extracting PostgreSQL...');
            socketService.emitToAll('postgres_binary_event', { event: "extracting" });

            const extractPath = path.join(TEMP_DIR, 'extracted');
            if (!fs.existsSync(extractPath)) {
                fs.mkdirSync(extractPath, { recursive: true });
            }

            await this.extractArchive(archivePath, extractPath);

            socketService.emitToAll('postgres_binary_event', { event: "locating" });

            // Find PostgreSQL binaries
            console.log('🔍 Locating PostgreSQL binaries...');
            const binariesPath = this.findPostgresBinaries(extractPath);

            if (!binariesPath) {
                throw new Error('Could not locate PostgreSQL binaries in extracted files');
            }

            // Copy binaries to postgres-bin
            console.log('📁 Setting up postgres-bin directory...');

            // Determine the structure to copy
            const parentDir = path.dirname(binariesPath);
            const isInBinSubdir = path.basename(binariesPath) === 'bin';

            socketService.emitToAll('postgres_binary_event', { event: "copying" });
            if (isInBinSubdir) {
                // Copy the entire parent directory structure
                this.copyDirectory(parentDir, BIN_DIR);
            } else {
                // Create bin subdirectory and copy binaries there
                const targetBinDir = path.join(BIN_DIR, 'bin');
                if (!fs.existsSync(targetBinDir)) {
                    fs.mkdirSync(targetBinDir, { recursive: true });
                }
                this.copyDirectory(binariesPath, targetBinDir);

                // Also copy lib and share directories if they exist
                const libDir = path.join(parentDir, 'lib');
                const shareDir = path.join(parentDir, 'share');

                if (fs.existsSync(libDir)) {
                    this.copyDirectory(libDir, path.join(BIN_DIR, 'lib'));
                }

                if (fs.existsSync(shareDir)) {
                    this.copyDirectory(shareDir, path.join(BIN_DIR, 'share'));
                }
            }

            // Clean up temp directory
            console.log('🧹 Cleaning up temporary files...');
            socketService.emitToAll('postgres_binary_event', { event: "cleanup" });
            await this.cleanupTempDirectory();

            console.log('✅ PostgreSQL setup completed successfully!');
            console.log(`📂 Binaries installed in: ${BIN_DIR}`);

            socketService.emitToAll('postgres_binary_event', { event: "done" });
        } catch (error) {
            console.error('❌ Error setting up PostgreSQL:', error.message);

            // Clean up on error
            await this.cleanupTempDirectory();

            process.exit(1);
        }
    }

    public runCommand(command: string, args: any) {
        return new Promise((resolve, reject) => {
            const process = spawn(command, args);

            process.on('close', (code) => {
                if (code === 0) {
                    resolve(null);
                } else {
                    reject(new Error(`Command failed with code ${code}`));
                }
            });

            process.on('error', (error) => {
                reject(error);
            });
        });
    }

    async initializePostgresBinaries() {
        try {
            if (this.isInitialized) {
                return { success: true, message: "Already initialized" };
            }

            console.log("Starting PostgreSQL initialization...");

            // Check if postgres-bin directory exists
            if (!fs.existsSync(BIN_DIR)) {
                throw new Error(
                    "postgres-bin directory not found. Please follow setup instructions."
                );
            }

            // Initialize data directory if it doesn't exist
            if (!fs.existsSync(DATA_DIR)) {
                console.log("Initializing PostgreSQL data directory...");
                fs.mkdirSync(DATA_DIR, { recursive: true });

                const initdbPath = path.join(BIN_DIR, "bin", "initdb.exe");
                await this.runCommand(initdbPath, [
                    "-D",
                    DATA_DIR,
                    "-U",
                    "postgres",
                    "--auth-local=trust",
                ]);
            }

            // Start PostgreSQL server
            console.log("Starting PostgreSQL server...");
            const postgresPath = path.join(BIN_DIR, "bin", "postgres.exe");

            this.postgresProcess = spawn(
                postgresPath,
                ["-D", DATA_DIR, "-p", POSTGRES_PORT.toString()],
                {
                    stdio: ["ignore", "pipe", "pipe"],
                }
            );

            this.postgresProcess.stdout.on("data", (data) => {
                console.log(`PostgreSQL: ${data}`);
            });

            this.postgresProcess.stderr.on("data", (data) => {
                console.log(`PostgreSQL Error: ${data}`);
            });

            // Wait for PostgreSQL to be ready
            await new Promise((resolve, reject) => {
                const checkConnection = async () => {
                    try {
                        const testClient = new Client({
                            host: "localhost",
                            port: POSTGRES_PORT,
                            user: "postgres",
                            database: "postgres",
                        });
                        await testClient.connect();
                        await testClient.end();
                        resolve(null);
                    } catch (error) {
                        setTimeout(checkConnection, 1000);
                    }
                };
                setTimeout(checkConnection, 2000);
            });

            // Create database and table
            console.log("Setting up database...");
            const tempDbClient = new Client({
                host: "localhost",
                port: POSTGRES_PORT,
                user: "postgres",
                database: "postgres",
            });

            await tempDbClient.connect();

            // Create database
            try {
                await tempDbClient.query("CREATE DATABASE appdb");
                console.log("Database appdb created");
            } catch (error) {
                if (!error.message.includes("already exists")) {
                    throw error;
                }
                console.log("Database appdb already exists");
            }

            await tempDbClient.end();

            // Connect to the new database
            const dbClient = new Client({
                host: "localhost",
                port: POSTGRES_PORT,
                user: "postgres",
                database: "appdb",
            });

            await dbClient.connect();
            this.isInitialized = true;

            return { success: true, message: "PostgreSQL initialized successfully" };
        } catch (error) {
            console.error("Initialization error:", error);
            throw Error(error.message);
        }
    }
}

export const postgresService = new PostgresService();