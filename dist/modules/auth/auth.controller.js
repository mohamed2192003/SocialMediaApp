import { Router } from "express";
import authService from "./auth.service.js";
import { SuccessResponse } from "../../common/exeptions/success.response.js";
import { signupSchema } from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = Router(); // 3andha type esmo Router mn express
router.post("/signup", validation(signupSchema), async (req, res) => {
    const data = await authService.signup(req.body);
    SuccessResponse({ res, message: "signup successfully", data });
});
router.post("/login", async (req, res) => {
    const data = await authService.login(req.body);
    SuccessResponse({ res, message: "Login successfully", data });
});
router.put('/verify-email', async (req, res) => {
    let data = await authService.verifyEmail(req.body);
    SuccessResponse({ res, message: 'Email Verified Successfully', status: 200, data });
});
//router.get("/test", authService.login({req: Request, res: Response}))                     // yenfa3 teshtaghal 3la http 
export default router;
