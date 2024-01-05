import { Request, Response } from "express";
export declare function amazonSearchPrices(req: Request, res: Response): Promise<void>;
export declare function amazonGetPriceById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function amazonSavePrice(req: Request, res: Response): Promise<void>;
