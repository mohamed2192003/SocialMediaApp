import userModel from "../../database/model/user.model.js";
import { DatabaseRepository } from "../../database/repo/base.repo.js";
import { NotFoundExeption } from "../../common/exeptions/application.exeption.js";
import { S3Service } from "../../common/services/s3.service.js";
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
        let { url, key } = await this.s3Service.createPresignUrl({
            path: `${userId}/profile-pic`
        });
        userData.profilePic = key;
        await userData.save();
        return { userData, url };
    }
    async updateCoverPic(userId, files) {
        const userData = await this.userRepository.findById(userId).select('-password');
        if (!userData) {
            throw new NotFoundExeption('User not found');
        }
        if (files.length > 0) {
            let { key, result } = await this.s3Service.uploadAssets({
                path: `${userData._id}/cover-pic`,
                files
            });
            userData.profileCoverPic = result;
        }
        await userData.save();
        return userData;
    }
}
export const userService = new UserService();
