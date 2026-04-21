import { UnauthorizedExeption } from "../common/exeptions/application.exeption.js";
import { TokenService } from './../common/services/token.service.js';
export class AuthMiddleware {
    redisService;
    TokenService;
    constructor(redisService) {
        this.redisService = redisService;
        this.TokenService = new TokenService();
    }
    auth = async (req, res, next) => {
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
                    const data = this.TokenService.decodeToken(token);
                    console.log(data);
                    const revokedToken = await this.redisService.get(`RevokeToken::${data.id}::${token}`);
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
        }
        catch (error) {
            next(error);
        }
    };
}
