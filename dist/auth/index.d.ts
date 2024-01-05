import { Request, Response, NextFunction } from "express";
export interface CurrentUser {
    id: string;
    email: string;
    role: string;
}
declare function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export { authenticateUser };
