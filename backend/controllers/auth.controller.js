import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateToken04,
  generateTokenAndCookie,
} from "../utils/generateToken.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions, uploadFilesToCloudinary } from "../utils/features.js";
import { TryCatch } from "../middleware/error.js";
import nodemailer from "nodemailer";
import { UserOTPVerification } from "../models/userOTPverification.model.js";
import dotenv from "dotenv";
dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_APP_PASSWORD}`,
  },
});

// Wrap in an async IIFE so we can use await.
const sendMail = TryCatch(async ({ _id, email }, res) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

  const mailOptions = {
    from: `"Raaina Whalla" <${process.env.EMAIL}>`,
    to: `${email}`,
    subject: "Verify your email",
    // text: "Hello world?", // plain‑text body
    html: `<p>OTP for your verification is <b>${otp}</b></p>`, // HTML body
  };

  //hash the otp
  const saltRounds = 10;
  const hashedOTP = await bcrypt.hash(otp, saltRounds);

  const newOTPverification = await new UserOTPVerification({
    userId: _id,
    otp: hashedOTP,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000,
  });

  await newOTPverification.save();
  const info = await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return next(new ErrorHandler(err.message));
    } else {
      return info;
    }
  });

  res.json({
    success: true,
    status: "PENDING",
    message: "Verification otp mail sent",
    data: {
      userId: _id,
      email,
    },
  });
});

const login = TryCatch(async (req, res, next) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  const isValidPassword = await bcrypt.compare(password, user?.password || "");

  if (!user || !isValidPassword) {
    return next(new ErrorHandler("Invalid username or password", 404));
    // return res.status(400).json({error: "Invalid username or password"});
  }

  generateTokenAndCookie(user, res, `Welcome back ${user.fullName}`);

  // return res.status(200).json({
  //     _id: user._id,
  //     userName: user.userName,
  //     fullName: user.fullName,
  //     profile: user.profile,
  // })
});

const signup = TryCatch(async (req, res, next) => {
  const { fullName, userName, password, confirmPassword, email, bio } =
    req.body;
  if (password.length < 6)
    return next(new ErrorHandler("Password should have at least 6 digits."));
  if (bio === "") {
    bio = "New User";
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords does not match", 400));
  }

  const file = req.file;

  if (!file) return next(new ErrorHandler("Please upload profile"));

  const result = await uploadFilesToCloudinary([file]);

  const profile = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const user = await User.findOne({ userName });

  if (user) {
    if (user.active) return next(new ErrorHandler("User already exists", 400));
    else {
      await UserOTPVerification.deleteMany({ userId: user._id });
      await sendMail({ _id: user._id, email: user.email });

      return;
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
  // const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
  const newUser = new User({
    fullName: fullName,
    userName: userName,
    password: hashedPassword,
    email: email,
    profile: profile,
    bio: bio,
    active: false,
  });

  await newUser.save().then((result) => {
    sendMail(result, res);
  });

  //   generateTokenAndCookie(newUser, res, "User created");
});

const logout = TryCatch(async (req, res, next) => {
  return res
    .cookie("jwt", "", { ...cookieOptions, maxAge: 0 })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const getToken = TryCatch(async (req, res, next) => {
  const appId = process.env.ZEGO_APPID;
  const serverSecret = process.env.ZEGO_SERVER_SECRET;
  const userId = req.user._id;
  const effectiveTime = 3600;
  const payload = "";
  if (appId && serverSecret && userId) {
    const token = generateToken04(
      parseInt(appId),
      userId.toString(),
      serverSecret,
      effectiveTime,
      payload
    );
    return res.status(200).json({
      appId,
      zego_token: token,
    });
  }
  return res.status(400).send("credentials required");
});

const VerifyOTP = TryCatch(async (req, res, next) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return next(new ErrorHandler("Empty details are not allowed!", 400));
  } else {
    const userOTPverificationRecords = await UserOTPVerification.find({
      userId,
    });
    //check if the record even exists or not
    if (userOTPverificationRecords.length <= 0) {
      return next(
        new ErrorHandler(
          "Account doesn't exist or has been verified already. Please Signup or Login.",
          404
        )
      );
    } else {
      //record exists, now do validation checks of otp
      const { expiresAt } = userOTPverificationRecords[0];
      const hashedOTP = userOTPverificationRecords[0].otp;

      if (expiresAt < Date.now()) {
        await UserOTPVerification.deleteMany({ userId });
        return next(
          new ErrorHandler(
            "OTP has expired already. Please request again.",
            410
          )
        );
      } else {
        const validOTP = await bcrypt.compare(otp, hashedOTP);

        if (!validOTP) {
          return next(new ErrorHandler("Invalid OTP", 400));
        } else {
          //activate the user
          const newUser = await User.findById(userId);
          await User.updateMany({ _id: userId }, { active: true });
          await UserOTPVerification.deleteMany({ userId });

          generateTokenAndCookie(newUser, res, "User VERIFIED");

          // res.json({
          //   status: "VERIFIED",
          //   message: "User has been verified successfully",
          // });
        }
      }
    }
  }
});

const resendMail = TryCatch(async (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return next(new ErrorHandler("Empty details are not allowed", 400));
  } else {
    await UserOTPVerification.deleteMany({ userId });
    sendMail({ _id: userId, email }, res);
  }
});

export { login, signup, logout, getToken, VerifyOTP, resendMail };
