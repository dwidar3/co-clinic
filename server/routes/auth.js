import { Router } from "express";

import { signup,signin, google, signout, verifyEmail, resetPassword, forgetPassword, verifyCodeForResetPassword } from "../controllers/auth.js";

const router = Router();
router.post("/signup", signup);
router.post("/verify", verifyEmail);
router.post("/signin", signin);
router.post("/send-reset-password-code", forgetPassword);
router.post("/reset-password-verify", verifyCodeForResetPassword);
router.post("/password-reset", resetPassword);

router.post("/google", google);
router.post('/signout', signout)


export default router;