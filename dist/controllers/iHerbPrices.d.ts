import { Request, Response } from "express";
export declare function iHerbSearchPrices(req: Request, res: Response): Promise<void>;
export declare function iHerbGetPriceById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function iHerbSavePrice(req: Request, res: Response): Promise<void>;
