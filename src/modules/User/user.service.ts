import { HydratedDocument } from "mongoose";
import { IUser } from "../../common/interfaces/user.interface.js";
import userModel from "../../database/model/user.model.js";
import { DatabaseRepository } from "../../database/repo/base.repo.js";
import { NotFoundExeption } from "../../common/exeptions/application.exeption.js";
import { s3Service, S3Service } from "../../common/services/s3.service.js";
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
        if (userData.profilePic) {
            await s3Service.deleteAsset({ Key: userData.profilePic })
        }
        let {url, key} = await this.s3Service.createPresignUrl({
        path: `${userId}/profile-pic`
        })
            userData.profilePic = key as string
            await userData.save()
        return { userData, url } as any
    }
    async updateCoverPic(userId: string, files: Express.Multer.File[]) {
        const userData = await this.userRepository.findById(userId).select('-password')
        if (!userData) {
            throw new NotFoundExeption('User not found')
        }
        if(files.length > 0){
            let { key, result } = await this.s3Service.uploadAssets({
                path: `${userData._id}/cover-pic`,
                files
            })
            userData.profileCoverPic = result as string[]
        }
        await userData.save()
        return userData
    }
}
export const userService = new UserService()