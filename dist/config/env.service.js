import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) }); // Load environment variables from the appropriate .env file based on NODE_ENV
const mongoURL = process.env.DB_CONNECTION_URL;
const mood = process.env.MOOD;
const port = process.env.PORT;
const salt = process.env.SALT;
const jwtKey = process.env.JWT_KEY;
const adminSignature = process.env.JWT_ADMIN_SIGNATURE;
const userSignature = process.env.JWT_USER_SIGNATURE;
const adminRefreshSignature = process.env.JWT_ADMIN_REFRESH_SIGNATURE;
const userRefreshSignature = process.env.JWT_USER_REFRESH_SIGNATURE;
const baseURL = process.env.BASE_URL;
const redisUrl = process.env.REDIS_URL;
const emailPass = process.env.EMAIL_PASS;
const emailSender = process.env.EMAIL_SENDER;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID; //get this from aws cloud in csv file
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION;
const awsBucketName = process.env.AWS_BUCKET_NAME;
const awsExpirationTime = process.env.AWS_EXPIRATION_TIME;
export const env = {
    mongoURL,
    mood,
    port,
    salt,
    jwtKey,
    adminSignature,
    userSignature,
    adminRefreshSignature,
    userRefreshSignature,
    baseURL,
    redisUrl,
    emailPass,
    emailSender,
    awsAccessKeyId,
    awsSecretAccessKey,
    awsRegion,
    awsBucketName,
    awsExpirationTime
};
