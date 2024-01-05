import { Request, Response } from "express";
export declare function iHerbGetPromoById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function iHerbSearchPromo(req: Request, res: Response): Promise<void>;
export declare function iHerbSavePromo(req: Request, res: Response): Promise<void>;
