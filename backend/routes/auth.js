import express from "express";
const router = express.Router();
import {
  getToken,
  login,
  logout,
  resendMail,
  signup,
  VerifyOTP,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  loginValidator,
  signUpValidator,
  validateHandlor,
} from "../lib/validators.js";
import { singleProfile } from "../middleware/multer.js";

router.post("/login", loginValidator(), validateHandlor, login);
router.post(
  "/signup",
  singleProfile,
  signUpValidator(),
  validateHandlor,
  signup
);
router.post("/verifyOTP", VerifyOTP);
router.post("/resendOTP", resendMail);
router.get("/logout", protectRoute, logout);
router.get("/generate-token/:userId", protectRoute, getToken);

export default router;
