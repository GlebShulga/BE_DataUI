import { Request, Response } from "express";
export declare function amazonGetPromoById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function amazonSearchPromo(req: Request, res: Response): Promise<void>;
export declare function amazonSavePromo(req: Request, res: Response): Promise<void>;
