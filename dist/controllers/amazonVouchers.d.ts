import { Request, Response } from "express";
export declare function amazonSearchVoucher(req: Request, res: Response): Promise<void>;
export declare function amazonGetVoucherById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function amazonSaveVoucher(req: Request, res: Response): Promise<void>;
