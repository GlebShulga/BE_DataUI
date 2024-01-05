import { Request, Response } from "express";
export declare function userRegistration(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function userLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
