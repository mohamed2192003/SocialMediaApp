import { createClient, RedisClientType } from "redis";
import { env } from "../../config/env.service.js";
import { Types } from "mongoose";
export class RedisService {
  private client: RedisClientType;
  private isConnected = false;
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
  private handleConnection() {
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
    } catch (err) {
      console.error("❌ Redis connection failed:", err);
      throw err;
    }
  }
  createRevokeKey({
    userId,
    token,
  }: {
    userId: Types.ObjectId;
    token: string;
  }): string {
    return `RevokeToken::${userId}::${token}`;
  }
  async set({
    key,
    value,
    ttl,
  }: {
    key: string;
    value: any;
    ttl?: number;
  }): Promise<string | null> {
    const data = typeof value === "object" ? JSON.stringify(value) : value;
    return ttl
      ? await this.client.set(key, data, { EX: ttl })
      : await this.client.set(key, data);
  }
  async get<T = string>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return data as T;
    }
  }
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }
  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
  async mget<T = string>(...keys: string[]): Promise<(T | null)[]> {
    const results = await this.client.mGet(keys);
    return results.map((item) => {
      if (!item) return null;
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    });
  }
  async keys(prefix: string): Promise<string[]> {
    return await this.client.keys(`${prefix}*`)
  }
}
export const redisConnection = new RedisService();