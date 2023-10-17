import { Request, Response, NextFunction } from "express";
import { RESPONSE_CODE_UNAUTHORIZED } from "../constants/responseCodes";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user;

  if (currentUser.role !== "admin") {
    return res
      .status(RESPONSE_CODE_UNAUTHORIZED)
      .send("Only admin can delete cart");
  }
  next();
}
