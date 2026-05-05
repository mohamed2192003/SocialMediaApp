import { HydratedDocument } from "mongoose";
import { IUser } from "../../common/interfaces/user.interface.js";
import userModel from "../../database/model/user.model.js";
import { DatabaseRepository } from "../../database/repo/base.repo.js";
import { NotFoundExeption } from "../../common/exeptions/application.exeption.js";
import { S3Service } from "../../common/services/s3.service.js";
import { MulterEnum } from "../../common/enums/multer.enum.js";
export class UserService {
    private userRepository: DatabaseRepository<IUser>
    private s3Service: S3Service
    constructor() {
        this.userRepository = new DatabaseRepository<IUser>(userModel)
        this.s3Service = new S3Service()
    }
    async getUserProfile(userId: string): Promise<HydratedDocument<IUser>> {
        const userData = await this.userRepository.findById(userId).select('-password')
        if (!userData) {
            throw new NotFoundExeption('User not found')
        }
        return userData
    }
    async updateUserProfile(userId: string, file?: Express.Multer.File): Promise<HydratedDocument<IUser>> {
        const userData = await this.userRepository.findById(userId).select('-password')
        if (!userData) {
            throw new NotFoundExeption('User not found')
        }
        if(file){
            let { Key } = await this.s3Service.uploadBigAssets({
                storageKey: MulterEnum.diskStorage,
                path: `${userId}/profile-pic`,
                file
             })
             if (Key !== undefined) {
                 userData.profilePic = Key
             }
        }
        return userData
    }
}
export const userService = new UserService()