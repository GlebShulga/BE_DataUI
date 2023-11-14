import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import logger from "../logs/logger";
import { User } from "../models";
import {
  RESPONSE_CODE_BAD_REQUEST,
  RESPONSE_CODE_CREATED,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import mongoose from "mongoose";

export async function userRegistration(req: Request, res: Response) {
  try {
    // Get user input
    const { firstName, lastName, isAdmin, email, password } = req.body;

    // Validate user input
    if (!(email && password && firstName && lastName)) {
      res.status(RESPONSE_CODE_BAD_REQUEST).send("All input is required");
    }

    // Validate if user already exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(RESPONSE_CODE_BAD_REQUEST)
        .send("User Already Exist. Please Login");
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role: isAdmin === "true" ? "admin" : "user",
    });

    logger.info(`User ${email} successfully registered`);

    res.status(RESPONSE_CODE_CREATED).send("User successfully registered");
  } catch (err) {
    logger.error("Internal Server Error");
    res.status(RESPONSE_CODE_SERVER_ERROR).send("Internal Server Error");
  }
}

export async function userLogin(req: Request, res: Response) {
  try {
    mongoose.connection.useDb("test");
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(RESPONSE_CODE_BAD_REQUEST).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { userId: user._id, email, role: user.role },
        process.env.TOKEN_KEY!,
        {
          expiresIn: "2h",
        },
      );

      logger.info(`User ${email} successfully logged in`);

      return res.status(RESPONSE_CODE_OK).json({
        token,
      });
    }

    res.status(RESPONSE_CODE_BAD_REQUEST).send("Invalid Credentials");
  } catch (err) {
    logger.error("Internal Server Error");
    res.status(RESPONSE_CODE_SERVER_ERROR).send("Internal Server Error");
  }
}
