import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db.js";

const result = dotenv.config();

export function createToken(user) {
  let role = "user";

  if (user.email === process.env.email) {
    role = "admin";
  }
  const payload = {
    email: user.email,
    role: role,
  };

  if (role !== "admin") {
    payload.userId = user._id;
  }

  const options = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, process.env.cookie_password, options);
}

export function decodeToken(token) {
  const userInfo = {};
  try {
    const decoded = jwt.verify(token, process.env.cookie_password);
    userInfo.email = decoded.email;
    userInfo.role = decoded.role;
    if (decoded.userId) {
      userInfo.userId = decoded.userId;
    }
  } catch (e) {
    console.log(e.message);
  }
  return userInfo;
}

export async function validate(decoded, request) {
  let user;
  if (decoded.role === "admin") {
    user = {
      email: process.env.admin_email,
      password: process.env.admin_password
    };
  } else {
    user = await db.userStore.getUserById(decoded.userId);
  }

  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}
