import { createClient, RedisClientType } from "redis";
import { env } from "../../config/env.service.js";
import { Types } from "mongoose";
export class RedisService {
    private client: RedisClientType
    constructor() {
        this.client = createClient({
            url: env.redisUrl,
            socket: {
                tls: true,
                rejectUnauthorized: false
            }
        })        
        this.handleConnection()
    }
    handleConnection() {
        this.client.on("error", (err) => {
            return console.log("❌ Redis Client Error")
        })
        this.client.on("ready", () => {
            console.log("✅ Redis Client Connected")
        })
    }
    async connect() {
        await this.client.connect()
        console.log("✅ Connected to Redis successfully");
    }
    createRevokeKey({ userId, token }: { userId: Types.ObjectId, token: string }): string {
        return `RevokeToken::${userId}::${token}`
    }
    async set({ key, value, ttl }: { key: string, value: any, ttl?: number }): Promise<string | null> {
        if (typeof value == "object") {
            value = JSON.stringify(value)
        }
        return ttl ? await this.client.set(key, value, { EX: ttl }) : await this.client.set(key, value)
    }
    async get(key: string): Promise<string | null> {
        let data = await this.client.get(key)
        try {
            if (data) {
                data = JSON.parse(data)
            }
        } catch (err) { }
        return data
    }
    async ttl(key: string): Promise<number> {
        return await this.client.ttl(key)
    }
    async exists(key: string): Promise<number> {
        return await this.client.exists(key)
    }
    async del(key: string): Promise<number> {
        return await this.client.del(key)
    }
    async mget(...keys: string[]): Promise<(string | null)[]> {
        return await this.client.mGet(keys)
    }
    async keys(prefix: string): Promise<string[]> {
        return await this.client.keys(`${prefix}*`)
    }
}
export const redisConnection = new RedisService()