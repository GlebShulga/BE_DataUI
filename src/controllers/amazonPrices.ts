import { Request, Response } from "express";
import { AmazonPrice } from "../models/amazonPrice";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import { PredicateRelation } from "../types/commonTypes";
import { createSearchFields } from "./helpers/createSearchFields";
import { createQuery } from "./helpers/createQuery";

export async function amazonSearchPrices(req: Request, res: Response) {
  const { predicates } = req.body;
  const predicateRelation = req.body.predicateRelation;

  const queryOperator =
    predicateRelation === PredicateRelation.AND ? "$and" : "$or";
  try {
    const searchFields = createSearchFields(predicates);
    const query = createQuery(predicates, queryOperator, searchFields);

    const price = await AmazonPrice.find(query);

    const totalCount = price.length;

    res.status(RESPONSE_CODE_OK).json({
      results: price,
      totalCount,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error searching price: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function amazonGetPriceById(req: Request, res: Response) {
  try {
    const id = req.params.priceId;

    const price = await AmazonPrice.findOne({ id });

    if (!price) {
      return res.status(RESPONSE_CODE_NOT_FOUND).json({
        data: null,
        error: { message: "No price with such ID" },
      });
    }

    res.status(RESPONSE_CODE_OK).json(price);
  } catch (error) {
    const errorMessage =
      "Error fetching price: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      results: null,
      error: { message: errorMessage },
    });
  }
}

export async function amazonSavePrice(req: Request, res: Response) {
  try {
    const savedPrice = req.body;
    const id = savedPrice.priceId;

    let price;

    price = await AmazonPrice.findOne({ id });
    if (!price) {
      price = new AmazonPrice(savedPrice);
    } else {
      price.set("localizedDescriptions", savedPrice.descriptions);
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
      "Error saving price: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
