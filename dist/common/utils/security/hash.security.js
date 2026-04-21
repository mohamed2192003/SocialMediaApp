import { env } from "../../../config/env.service.js";
import bcrypt from "bcrypt";
export const generateHash = async ({ plainText, salt = env.salt }) => {
    return await bcrypt.hash(plainText, Number(salt));
};
export const compareHash = async ({ plainText, cypherText }) => {
    return await bcrypt.compare(plainText, cypherText);
};
