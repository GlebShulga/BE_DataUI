import { Request, Response, NextFunction } from "express";
import {
  RESPONSE_CODE_SERVER_ERROR,
  RESPONSE_CODE_UNAUTHORIZED,
} from "../constants/responseCodes";
import { User } from "../models";

async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.header("x-user-id") as string;
    if (!userId) {
      return res.status(401).json({
        data: null,
        error: {
          message: "Header x-user-id is missing",
        },
      });
    }

    const user = await User.findOne({ _id: userId }).exec();

    if (!user) {
      return res.status(RESPONSE_CODE_UNAUTHORIZED).json({
        data: null,
        error: {
          message: "No user with such id",
        },
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);

    return res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: {
        message: "Error authenticating user",
      },
    });
  }
}

export { authenticateUser };
