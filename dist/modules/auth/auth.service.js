import userModel from './../../database/model/user.model.js';
import { BadRequestExeption, NotFoundExeption } from "../../common/exeptions/application.exeption.js";
import { DatabaseRepository } from "../../database/repo/base.repo.js";
import { SecurityService } from "../../common/services/security.service.js";
import { sendEmail } from "../../common/utils/email/sendEmail.js";
import { redisConnection } from "../../common/services/redis.service.js";
import { generateToken } from "../../common/utils/security/token.security.js";
class AuthService {
    userModel; // we are defining a private property called userModel that has the type of Model<IUser>, this is the Mongoose model that we will use to interact with the users collection in the database, we are using the IUser interface to define the structure of the user documents in the database, this way we can ensure that the data that we are working with has the correct structure and types.
    userRepo;
    securityService;
    redisService;
    constructor() {
        this.userModel = userModel; // we are assigning the userModel that we imported from the database/model/user.model.ts file to the userModel property of the AuthService class, this way we can use it in the methods of the AuthService class to interact
        this.securityService = new SecurityService;
        this.redisService = redisConnection;
        this.userRepo = new DatabaseRepository(this.userModel); // we are creating a new instance of the DatabaseRepository class and passing the userModel as a parameter to the constructor, this way we can use the methods of the DatabaseRepository class to interact
    }
    async signup(data) {
        data.password = await this.securityService.generateHash({ plainText: data.password });
        //hydrated document is a document that is returned by the Mongoose model after it has been created, it is an instance of the Mongoose model that has all the methods and properties of the model, this way we can use the methods and properties of the model to interact with the document, for example we can use the save method to save the document to the database, or we can use the toObject method to convert the document to a plain JavaScript object that we can use in our application.    
        let result = await this.userRepo.create(data); // we are using the create method of the Mongoose model to create a new user document in the database, we are passing an array of data to the create method because the create method can accept an array of documents to create multiple documents at once, in this case we are only creating one document so we are passing an array with one element, the data that is being passed to the create method has the type of SignupDTO which is inferred from the signupSchema that we defined in the auth.validation.ts file, this way we can ensure that the data that is being passed to the create method has the correct structure and types, we are also defining the return type of the create method as HydratedDocument<IUser>[] which is an array of hydrated documents that have the structure defined by the IUser interface, this way we can ensure that the data that is being returned from the create method has the correct structure and types. 
        // why we are using an array to create a single document? because the create method can accept an array of documents to create multiple documents at once, in this case we are only creating one document so we are passing an array with one element, the data that is being passed to the create method has the type of SignupDTO which is inferred from the signupSchema that we defined in the auth.validation.ts file, this way we can ensure that the data that is being passed to the create method has the correct structure and types, we are also defining the return type of the create method as HydratedDocument<IUser>[] which is an array of hydrated documents that have the structure defined bythe IUser interface, this way we can ensure thatthe data that is being returned fromthe create method hasthe correct structure and types.
        if (!result) {
            throw new BadRequestExeption("Failed to create user");
        }
        let code = Math.floor(Math.random() * 1000000).toString().padStart(4, "0");
        let hashOTP = await this.securityService.generateHash({ plainText: String(code) });
        await this.redisService.set({ key: `OTP::${result._id}`, value: hashOTP });
        await sendEmail({
            to: data.email,
            subject: "Signup",
            html: `<h1>Hello, ${data.userName} you code is ${code}</h1>`
        });
        return result;
    }
    async verifyEmail({ code, email }) {
        if (!code || !email) {
            throw new BadRequestExeption("Code and email are required");
        }
        const user = await this.userRepo.findOne({ email });
        if (!user) {
            throw new NotFoundExeption("User Not Found");
        }
        if (user.EmailConfirmation) {
            throw new BadRequestExeption("Email Already Verified");
        }
        const redisKey = `OTP:signup:${user._id} `;
        const redisCode = await this.redisService.get(redisKey);
        if (!redisCode) {
            throw new BadRequestExeption("OTP Expired");
        }
        const isMatch = await this.securityService.compareHash({ plainText: code, cypherText: redisCode });
        if (!isMatch) {
            throw new BadRequestExeption("Invalid OTP");
        }
        const updatedUser = await this.userRepo.findOneAndUpdate({ _id: user._id }, { EmailConfirmation: true }, { new: true });
        await this.redisService.del(redisKey);
        return updatedUser;
    }
    async login(data, issuer) {
        let result = await this.userRepo.findOne({ email: data.email });
        if (!result) {
            throw new NotFoundExeption("Failed to login");
        }
        let matchedPassword = await this.securityService.compareHash({ plainText: data.password, cypherText: result.password });
        if (!matchedPassword) {
            throw new BadRequestExeption("Password is not matched");
        }
        const { accessToken, refreshToken } = await generateToken({ result, issuer });
        return {
            result,
            accessToken,
            refreshToken
        };
    }
}
export default new AuthService; // we are exporting an instance of the AuthService class, this way we can use it in other parts of the application without having to create a new instance every time we want to use it, this is a common pattern in Node.js applications where we want to have a single instance of a service that can be shared across the application.
