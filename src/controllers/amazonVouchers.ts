import { Request, Response } from "express";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import {
  AmazonVoucher,
  CustomAmazonVoucher,
  PromotionalAmazonVoucher,
  SerialAmazonVoucher,
} from "../models/amazonVoucher";
import { PredicateRelation } from "../types/commonTypes";
import { createSearchFields } from "./helpers/createSearchFields";
import { createQuery } from "./helpers/createQuery";

export async function amazonSearchVoucher(req: Request, res: Response) {
  const { predicates, predicateRelation, voucherType } = req.body;

  const queryOperator =
    predicateRelation === PredicateRelation.AND ? "$and" : "$or";

  try {
    const searchFields = createSearchFields(predicates);
    const query = createQuery(
      predicates,
      queryOperator,
      searchFields,
      voucherType,
      "voucherType",
    );

    const vouchers = await AmazonVoucher.find(query);

    const totalCount = vouchers.length;

    res.status(RESPONSE_CODE_OK).json({
      results: vouchers,
      totalCount,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error searching vouchers: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function amazonGetVoucherById(req: Request, res: Response) {
  try {
    const id = req.params.voucherId;

    const voucher = await AmazonVoucher.findOne({ id });

    if (!voucher) {
      return res.status(RESPONSE_CODE_NOT_FOUND).json({
        data: null,
        error: { message: "No voucher with such ID" },
      });
    }

    res.status(RESPONSE_CODE_OK).json(voucher);
  } catch (error) {
    const errorMessage =
      "Error fetching voucher: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      results: null,
      error: { message: errorMessage },
    });
  }
}

export async function amazonSaveVoucher(req: Request, res: Response) {
  try {
    const savedVoucher = req.body;
    const id = savedVoucher.id;

    let voucher;

    switch (savedVoucher.voucherType) {
      case "PROMOTIONAL":
        voucher = await PromotionalAmazonVoucher.findOne({ id });
        if (!voucher) {
          voucher = new PromotionalAmazonVoucher(savedVoucher);
        } else {
          voucher.set(savedVoucher);
        }
        break;
      case "CUSTOM":
        voucher = await CustomAmazonVoucher.findOne({ id });
        if (!voucher) {
          voucher = new CustomAmazonVoucher(savedVoucher);
        } else {
          voucher.set(savedVoucher);
        }
        break;
      case "SERIAL":
        voucher = await SerialAmazonVoucher.findOne({ id });
        if (!voucher) {
          voucher = new SerialAmazonVoucher(savedVoucher);
        } else {
          voucher.set(savedVoucher);
        }
        break;
      default:
        throw new Error("Invalid voucher type");
    }

    const validationError = voucher.validateSync();

    if (validationError) {
      throw validationError;
    }

    const updatedPromo = await voucher.save();

    res.status(RESPONSE_CODE_OK).json(updatedPromo);
  } catch (error) {
    const errorMessage =
      "Error saving voucher: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
