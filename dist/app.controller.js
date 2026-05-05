import express from "express";
import cors from "cors";
import { authRouter, userRouter } from "./modules/index.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { env } from "./config/env.service.js";
import DBConnection from "./database/connection.js";
import { redisConnection } from "./common/services/redis.service.js";
export const bootstrap = async () => {
    try {
        const app = express();
        app.use(cors(), express.json());
        await DBConnection();
        await redisConnection.connect();
        // let user = new userModel({
        //     firstName: "John",
        //     lastName: "Doe", 
        //     email: "john.doe@example.com",
        //     password: "password123",
        //     phone: "1234567890"
        // })
        // await user.save()
        // await userModel.insertMany([{
        //     firstName: "Mohamed",
        //     lastName: "Shawky", 
        //     email: "mohamed.shawky@example.com",
        //     password: "password123",
        //     phone: "1234567890"
        // }])
        // let newUser = await userModel.findById(user._id)
        // if(!newUser){
        //     throw new Error("User Not Found")
        // }
        // newUser.firstName = "Wade"
        // await newUser.save()
        // await userModel.findOne({
        //     email: 'john.doe@example.com',
        //     admin: true
        // })
        // await user?.updateOne({
        //     email: 'wade.doe@example.com'
        // })
        // await userModel.deleteOne({
        //     email: 'john.doe@example.com'
        // })
        if (!redisConnection["client"].isOpen) {
            throw new Error("Redis not connected");
        }
        app.use("/auth", authRouter);
        app.use("/users", userRouter);
        app.use(globalErrorHandler);
        app.listen(env.port, () => {
            console.log(`🚀 Server is running on http://localhost:${env.port}`);
        });
    }
    catch (err) {
        console.error("💥 Failed to start server:", err);
        process.exit(1);
    }
};
