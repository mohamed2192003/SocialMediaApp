import userModel from "../../database/model/user.model.js";
import { DatabaseRepository } from "../../database/repo/base.repo.js";
import { NotFoundExeption } from "../../common/exeptions/application.exeption.js";
import { S3Service } from "../../common/services/s3.service.js";
import { MulterEnum } from "../../common/enums/multer.enum.js";
export class UserService {
    userRepository;
    s3Service;
    constructor() {
        this.userRepository = new DatabaseRepository(userModel);
        this.s3Service = new S3Service();
    }
    async getUserProfile(userId) {
        const userData = await this.userRepository.findById(userId).select('-password');
        if (!userData) {
            throw new NotFoundExeption('User not found');
        }
        return userData;
    }
    async updateUserProfile(userId, file) {
        const userData = await this.userRepository.findById(userId).select('-password');
        if (!userData) {
            throw new NotFoundExeption('User not found');
        }
        if (file) {
            let { Key } = await this.s3Service.uploadBigAssets({
                storageKey: MulterEnum.diskStorage,
                path: `${userId}/profile-pic`,
                file
            });
            if (Key !== undefined) {
                userData.profilePic = Key;
            }
        }
        return userData;
    }
}
export const userService = new UserService();
