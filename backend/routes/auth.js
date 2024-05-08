import express from 'express';
const router = express.Router();
import {login, logout, signup} from "../controllers/auth.controller.js";
import { protectRoute } from '../middleware/protectRoute.js';
import { loginValidator, signUpValidator, validateHandlor } from '../lib/validators.js';

router.post("/login", loginValidator(), validateHandlor, login);

router.post("/signup", signUpValidator(), validateHandlor ,signup);

router.post("/logout", protectRoute, logout);

export default router;