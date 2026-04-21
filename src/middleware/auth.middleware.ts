import { Request, Response, NextFunction } from "express";
import { UnauthorizedExeption } from "../common/exeptions/application.exeption.js";
import { RedisService } from './../common/services/redis.service.js';
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from './../common/services/token.service.js';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            token?: string;
            decoded?: JwtPayload;
        }
    }
}
export class AuthMiddleware {
    private redisService: RedisService;
    private TokenService: TokenService;
    constructor(redisService: RedisService) {
        this.redisService = redisService;
        this.TokenService = new TokenService();
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
                    const data = this.TokenService.decodeToken(token) as JwtPayload;
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