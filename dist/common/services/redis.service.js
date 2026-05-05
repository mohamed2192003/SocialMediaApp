import { createClient } from "redis";
import { env } from "../../config/env.service.js";
export class RedisService {
    client;
    isConnected = false;
    constructor() {
        this.client = createClient({
            url: env.redisUrl,
            socket: {
                tls: true,
                rejectUnauthorized: false,
                checkServerIdentity: () => undefined,
            },
        });
        this.handleConnection();
    }
    handleConnection() {
        this.client.on("error", (err) => {
            console.error("❌ Redis Client Error:", err);
        });
        this.client.on("ready", () => {
            console.log("✅ Redis Client Connected");
            this.isConnected = true;
        });
        this.client.on("end", () => {
            console.log("⚠️ Redis connection closed");
            this.isConnected = false;
        });
        this.client.on("reconnecting", () => {
            console.log("🔄 Redis reconnecting...");
        });
    }
    async connect() {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
                console.log("✅ Redis connected");
            }
            console.log("Redis status:", this.client.isOpen);
        }
        catch (err) {
            console.error("❌ Redis connection failed:", err);
            throw err;
        }
    }
    createRevokeKey({ userId, token, }) {
        return `RevokeToken::${userId}::${token}`;
    }
    async set({ key, value, ttl, }) {
        const data = typeof value === "object" ? JSON.stringify(value) : value;
        return ttl
            ? await this.client.set(key, data, { EX: ttl })
            : await this.client.set(key, data);
    }
    async get(key) {
        const data = await this.client.get(key);
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch {
            return data;
        }
    }
    async ttl(key) {
        return this.client.ttl(key);
    }
    async exists(key) {
        return (await this.client.exists(key)) === 1;
    }
    async del(key) {
        return this.client.del(key);
    }
    async mget(...keys) {
        const results = await this.client.mGet(keys);
        return results.map((item) => {
            if (!item)
                return null;
            try {
                return JSON.parse(item);
            }
            catch {
                return item;
            }
        });
    }
    async keys(prefix) {
        return await this.client.keys(`${prefix}*`);
    }
}
export const redisConnection = new RedisService();
