import mongoose from "mongoose";
import { env } from "../config/env.service.js";
const DBConnection = async () => {
    await mongoose.connect(env.mongoURL).then(() => {
        console.log("✅ Connected to MongoDB successfully");
    }).catch((err) => {
        console.error("❌ Failed to connect to MongoDB:", err);
    });
};
export default DBConnection;
