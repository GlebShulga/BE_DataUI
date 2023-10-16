import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { RESPONSE_CODE_BAD_REQUEST } from "../constants/responseCodes";

export async function userRegistration(req: Request, res: Response) {
  try {
    // Get user input
    const { first_name, last_name, isAdmin, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(RESPONSE_CODE_BAD_REQUEST).send("All input is required");
    }

    // Validate if user already exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(RESPONSE_CODE_BAD_REQUEST)
        .send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role: isAdmin === "true" ? "admin" : "user",
    });

    res.status(201).send("User successfully registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

export async function userLogin(req: Request, res: Response) {
  try {
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
        }
      );

      return res.status(200).json({
        token,
      });
    }
    res.status(RESPONSE_CODE_BAD_REQUEST).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}
