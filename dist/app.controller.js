import express from "express";
import cors from "cors";
import { authRouter } from "./modules/index.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { env } from "./config/env.service.js";
import DBConnection from "./database/connection.js";
import { redisConnection } from "./common/services/redis.service.js";
export const bootstrap = async () => {
    const app = express();
    app.use(cors(), express.json());
    await DBConnection();
    await redisConnection.connect();
    app.use("/auth", authRouter);
    app.use(globalErrorHandler);
    app.listen(env.port, () => {
        console.log(`🚀 Server is running on http://localhost:${env.port}`);
    });
};
