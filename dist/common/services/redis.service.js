import { createClient } from "redis";
import { env } from "../../config/env.service.js";
export class RedisService {
    client;
    constructor() {
        this.client = createClient({
            url: env.redisUrl,
            socket: {
                tls: true,
                rejectUnauthorized: false
            }
        });
        this.handleConnection();
    }
    handleConnection() {
        this.client.on("error", (err) => {
            return console.log("❌ Redis Client Error");
        });
        this.client.on("ready", () => {
            console.log("✅ Redis Client Connected");
        });
    }
    async connect() {
        await this.client.connect();
        console.log("✅ Connected to Redis successfully");
    }
    createRevokeKey({ userId, token }) {
        return `RevokeToken::${userId}::${token}`;
    }
    async set({ key, value, ttl }) {
        if (typeof value == "object") {
            value = JSON.stringify(value);
        }
        return ttl ? await this.client.set(key, value, { EX: ttl }) : await this.client.set(key, value);
    }
    async get(key) {
        let data = await this.client.get(key);
        try {
            if (data) {
                data = JSON.parse(data);
            }
        }
        catch (err) { }
        return data;
    }
    async ttl(key) {
        return await this.client.ttl(key);
    }
    async exists(key) {
        return await this.client.exists(key);
    }
    async del(key) {
        return await this.client.del(key);
    }
    async mget(...keys) {
        return await this.client.mGet(keys);
    }
    async keys(prefix) {
        return await this.client.keys(`${prefix}*`);
    }
}
export const redisConnection = new RedisService();
