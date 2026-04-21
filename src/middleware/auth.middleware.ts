import { Request, Response, NextFunction } from "express";
import { UnauthorizedExeption } from "../common/exeptions/application.exeption.js";
import { decodeToken } from "../common/utils/security/token.security.js";
import { RedisService } from './../common/services/redis.service.js';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            token?: string;
            decoded?: any;
        }
    }
}
export class AuthMiddleware {
    private redisService: RedisService;
    constructor(redisService: RedisService) {
        this.redisService = redisService;
    }
    auth = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authorization = req.headers.authorization;
            if (!authorization) {
                throw new UnauthorizedExeption("Unauthorized");
            }
            const [flag, token] = authorization.split(" ");
            switch (flag) {
                case "Basic": {
                    if (!token) {
                        throw new UnauthorizedExeption("Invalid authorization format");
                    }
                    const basicData = Buffer.from(token, "base64").toString();
                    const [email, password] = basicData.split(":");
                    console.log(email, password);
                    break;
                }
                case "Bearer": {
                    if (!token) {
                        throw new UnauthorizedExeption("Invalid authorization format");
                    }
                    const data = decodeToken(token) as { id: string };
                    console.log(data);
                    const revokedToken = await this.redisService.get(
                        `RevokeToken::${data.id}::${token}`
                    );
                    if (revokedToken !== null) {
                        throw new UnauthorizedExeption("Already Logged Out");
                    }
                    req.userId = data.id;
                    req.token = token;
                    req.decoded = data;
                    break;
                }
                default:
                    throw new UnauthorizedExeption("Invalid authorization type");
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}