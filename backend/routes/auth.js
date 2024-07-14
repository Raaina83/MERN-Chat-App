import express from 'express';
const router = express.Router();
import {login, logout, signup} from "../controllers/auth.controller.js";
import { protectRoute } from '../middleware/protectRoute.js';
import { loginValidator, signUpValidator, validateHandlor } from '../lib/validators.js';
import { singleProfile } from '../middleware/multer.js';

router.post("/login", loginValidator(), validateHandlor, login);

router.post("/signup", signUpValidator(), singleProfile, validateHandlor ,signup);

router.get("/logout", protectRoute, logout);

export default router;