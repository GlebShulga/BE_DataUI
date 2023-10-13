import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface CurrentUser {
  id: string;
  email: string;
  role: string;
}

async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Token is required");
  }

  const [tokenType, token] = authHeader.split(" ");

  if (tokenType !== "Bearer") {
    return res.status(403).send("Invalid Token");
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY!) as CurrentUser;

    req.user = user;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
}

export { authenticateUser };
