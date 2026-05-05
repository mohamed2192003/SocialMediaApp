import { Router } from "express";
import { userService } from "./user.service.js";
import { auth } from "../../middleware/auth.middleware.js";
import { SuccessResponse } from "../../common/exeptions/success.response.js";
import { uploadFile } from "../../common/utils/multer/cloud.js";
import { MulterEnum } from "../../common/enums/multer.enum.js";
const router = Router();
router.get('/get-user-profile', auth, async (req, res) => {
    let userData = await userService.getUserProfile(req.userId);
    SuccessResponse({ res, message: "User Profile Data", data: userData });
});
router.patch('/update-user-profile', auth, uploadFile({ storageKey: MulterEnum.diskStorage }).single('file'), async (req, res) => {
    console.log(req.file);
    let userData = await userService.updateUserProfile(req.userId, req.file);
    SuccessResponse({ res, message: "User Profile Data", data: userData });
});
export default router;
