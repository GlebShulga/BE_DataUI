import { Request, Response } from "express";
import { IHerbPrice } from "../models/iHerbPrice";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import {
  ERROR_FETCH_PRICE,
  ERROR_FIND_PRICE,
  ERROR_SAVE_PRICE,
  ERROR_SEARCH_PRICE,
  UNKNOWN_ERROR,
} from "../constants/responses";
import { PredicateRelation } from "../types/commonTypes";
import { createSearchFields } from "./helpers/createSearchFields";
import { createQuery } from "./helpers/createQuery";

export async function iHerbSearchPrices(req: Request, res: Response) {
  const { predicates, predicateRelation, type: priceType } = req.body;

  const queryOperator =
    predicateRelation === PredicateRelation.AND ? "$and" : "$or";

  try {
    const searchFields = createSearchFields(predicates);
    const query = createQuery(
      predicates,
      queryOperator,
      searchFields,
      priceType,
    );

    const price = await IHerbPrice.find(query);
    const totalCount = price.length;

    res.status(RESPONSE_CODE_OK).json({
      results: price,
      totalCount,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      ERROR_SEARCH_PRICE +
      (error instanceof Error ? error.message : UNKNOWN_ERROR);
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function iHerbGetPriceById(req: Request, res: Response) {
  try {
    const priceEventId = req.params.priceId;

    const price = await IHerbPrice.findOne({ priceEventId });

    if (!price) {
      return res.status(RESPONSE_CODE_NOT_FOUND).json({
        data: null,
        error: { message: ERROR_FIND_PRICE },
      });
    }

    res.status(RESPONSE_CODE_OK).json(price);
  } catch (error) {
    const errorMessage =
      ERROR_FETCH_PRICE +
      (error instanceof Error ? error.message : UNKNOWN_ERROR);
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      results: null,
      error: { message: errorMessage },
    });
  }
}

export async function iHerbSavePrice(req: Request, res: Response) {
  try {
    const savedPrice = req.body;
    const { priceEventId } = savedPrice;

    let price;

    price = await IHerbPrice.findOne({ priceEventId });
    if (!price) {
      price = new IHerbPrice(savedPrice);
    } else {
      price.set(savedPrice);
    }

    const validationError = price.validateSync();

    if (validationError) {
      throw validationError;
    }

    const updatedPromo = await price.save();

    res.status(RESPONSE_CODE_OK).json(updatedPromo);
  } catch (error) {
    const errorMessage =
      ERROR_SAVE_PRICE +
      (error instanceof Error ? error.message : UNKNOWN_ERROR);
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
