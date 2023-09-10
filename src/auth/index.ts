import { Request, Response, NextFunction } from "express";
import { USERS_FILE_PATH } from "../constants/filePaths";
import { readFile } from "fs/promises";
import { RESPONSE_CODE_SERVER_ERROR } from "../constants/responseCodes";

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

    const usersData = await readFile(USERS_FILE_PATH, "utf8");
    const users = JSON.parse(usersData);

    const foundUser = users.find((user: { id: string }) => user.id === userId);

    if (!foundUser) {
      return res.status(401).json({
        data: null,
        error: {
          message: "No user with such id",
        },
      });
    }

    (req as any).user = foundUser;
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
