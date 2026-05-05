import { config } from 'dotenv'; 
import path from 'path';
config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) }); // Load environment variables from the appropriate .env file based on NODE_ENV
const mongoURL = process.env.DB_CONNECTION_URL as string; 
const mood = process.env.MOOD as string;
const port = process.env.PORT as string;
const salt = process.env.SALT as string;
const jwtKey = process.env.JWT_KEY as string;
const adminSignature = process.env.JWT_ADMIN_SIGNATURE as string;
const userSignature = process.env.JWT_USER_SIGNATURE as string;
const adminRefreshSignature = process.env.JWT_ADMIN_REFRESH_SIGNATURE as string;
const userRefreshSignature = process.env.JWT_USER_REFRESH_SIGNATURE as string;
const baseURL = process.env.BASE_URL as string;
const redisUrl = process.env.REDIS_URL as string;
const emailPass = process.env.EMAIL_PASS as string;
const emailSender = process.env.EMAIL_SENDER as string;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID as string; //get this from aws cloud in csv file
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
const awsRegion = process.env.AWS_REGION as string;
const awsBucketName = process.env.AWS_BUCKET_NAME as string;
const awsExpirationTime = process.env.AWS_EXPIRATION_TIME as string;
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
}