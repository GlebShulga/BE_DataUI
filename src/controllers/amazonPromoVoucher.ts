import { Request, Response } from "express";
import { AmazonPromoVoucherCode } from "../models/amazonPromoVoucher";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";

export async function amazonSearchPromoVoucherCode(
  req: Request,
  res: Response,
) {
  console.log("check");
  const PAGE_SIZE = 15;
  const { voucherId, searchTerm } = req.body;
  try {
    let query = {};
    console.log("req.body", req.body);
    if (!!searchTerm && voucherId) {
      query = {
        voucherId,
        code: searchTerm,
      };
    } else if (voucherId) {
      query = { voucherId };
    }
    console.log("query:", query);
    const voucherCodes = await AmazonPromoVoucherCode.find(query);
    console.log("voucherCodes:", voucherCodes);
    const totalCount = voucherCodes.length;

    res.status(RESPONSE_CODE_OK).json({
      results: voucherCodes,
      pageSize: PAGE_SIZE,
      totalCount,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error searching voucher code: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
