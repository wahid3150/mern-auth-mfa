import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";
import { loginSchema, registerSchema } from "../validation/zod.js";
import { redisClient } from "../server.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../verifyEmail/sendMail.js";
import {
  getOtpHtml,
  getVerifyEmailHtml,
} from "../verifyEmail/verificationMailTemplate.js";
import { generateToken } from "../config/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);

  const validation = registerSchema.safeParse(sanitizedBody);
  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "Validation failed";
    let allError = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allError = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allError[0]?.message || "Validation Error";
    }

    return res.status(400).json({
      message: firstErrorMessage,
      error: allError,
    });
  }

  const { name, email, password } = validation.data;

  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many request, try again later",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;
  const dataToStore = JSON.stringify({
    name,
    email,
    password: hashedPassword,
  });

  await redisClient.set(verifyKey, dataToStore, { EX: 300 });
  const subject = "Verify your email for account creation";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });
  res.json({
    message:
      "If your email is valid, a verification link has been sent. It will be expire in 5 minutes",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      message: "Verification token is required",
    });
  }
  const verifyKey = `verify:${token}`;
  const userDataJson = await redisClient.get(verifyKey);
  if (!userDataJson) {
    return res.status(400).json({
      message: "Verification link is expired.",
    });
  }

  await redisClient.del(verifyKey);
  const userData = JSON.parse(userDataJson);
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });
  res.status(201).json({
    message: "Email verified successfully! Your account has been created",
    user: { _id: newUser._id, name: newUser.name, email: newUser.email },
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);

  const validation = loginSchema.safeParse(sanitizedBody);
  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "Validation failed";
    let allError = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allError = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allError[0]?.message || "Validation Error";
    }

    return res.status(400).json({
      message: firstErrorMessage,
      error: allError,
    });
  }

  const { email, password } = validation.data;

  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many request, try again later",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, { EX: 300 });

  const subject = "Otp for verification";
  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message:
      "If your email is valid, an otp has been sent. It will be expires in 5 minutes",
  });
});

export const verifyOtp = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide all details",
    });
  }

  const otpKey = `otp:${email}`;

  const storedOtpString = await redisClient.get(otpKey);
  if (!storedOtpString) {
    return res.status(400).json({
      message: "Otp expired",
    });
  }

  const storedOtp = storedOtpString;
  if (storedOtp !== String(otp).trim()) {
    return res.status(400).json({ message: "Invalid otp" });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  const tokenData = await generateToken(user._id, res);

  res.status(200).json({
    message: `Welcome ${user.name}`,
    user,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = req.user;
  res.json(user);
});
