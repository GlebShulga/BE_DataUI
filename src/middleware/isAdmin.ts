import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user;

  if (currentUser.role !== "admin") {
    return res.status(401).send("Only admin can delete cart");
  }
  next();
}
