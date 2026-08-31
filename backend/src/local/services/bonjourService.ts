import { db } from '../../database';
import bonjour, { Bonjour, RemoteService } from "bonjour";
import os from "os";

function getLocalIp(): string {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]!) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "127.0.0.1";
}


export class BonjourService {
    private bonjour: Bonjour;
    private published: any | null = null;
    private discoveredAdmins: {
        name: string;
        ip: string;
        port: number;
        userid: string;
    }[] = [];
    private listening = false;

    constructor() {
        this.bonjour = bonjour();
    }

    /** Emit admin service if local DB is healthy */
    async emit(userid: string, port: number) {
        if (this.published) {
            console.log("Bonjour service already published");
            return;
        }

        const health = await db.healthCheck();
        if (!health.local) {
            throw new Error("Local DB not healthy. Cannot publish Bonjour service.");
        }

        const ip = getLocalIp();
        this.published = this.bonjour.publish({
            name: `ProjectVault-${userid}`,
            type: "projectvault",
            port,
            txt: { userid, ip },
        });

        console.log(`✅ Bonjour published: ${ip}:${port} (${userid})`);
    }

    stopListening() {
        if (!this.listening) return;
        this.bonjour.destroy(); // stops all browsing/publishing
        this.listening = false;
        this.discoveredAdmins = []; // optional, clear cache
        console.log("🛑 Bonjour listener stopped");
    }


    /** Start listening for admins (employee mode) */
    listen() {
        bonjourService.stopListening();

        const browser = this.bonjour.find({ type: "projectvault" });
        browser.on("up", (service: RemoteService) => { 
            const ip = service.txt.ip || service.referer.address;
            const admin = {
                name: service.name,
                ip,
                port: service.port,
                userid: service.txt.userid,
            };
            if (!this.discoveredAdmins.find((a) => a.userid === admin.userid)) {
                this.discoveredAdmins.push(admin);
                console.log("✅ Discovered admin:", admin);
            }
        });
        browser.on("down", (service: RemoteService) => {
            this.discoveredAdmins = this.discoveredAdmins.filter(
                (a) => a.userid !== service.txt.userid
            );
            console.log("🛑 Admin went offline:", service.txt.userid);
        });
    }

    /** Get discovered admins */
    getAdmins() {
        return this.discoveredAdmins;
    }

    /** Unpublish admin service */
    unpublish() {
        if (this.published) {
            this.published.stop(() => {
                console.log("🛑 Bonjour service unpublished");
                this.published = null;
            });
        }
    }
}

export const bonjourService = new BonjourService();