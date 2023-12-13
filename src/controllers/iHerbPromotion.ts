import { Request, Response } from "express";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import {
  ItemRewardIHerbPromotion,
  IHerbPromotion,
  PriceBasedIHerbPromotion,
  FreeShippingIHerbPromotion,
} from "../models/iHerbPromotion";
import { createSearchFields } from "./helpers/createSearchFields";
import { PredicateRelation } from "../types/commonTypes";
import { createQuery } from "./helpers/createQuery";

export async function getPromo(req: Request, res: Response) {
  try {
    const promotions = await IHerbPromotion.find(
      {},
      { pmmId: 1, name: 1, description: 1, price: 1 },
    );

    const totalCount = promotions.length;

    res.status(RESPONSE_CODE_OK).json({
      data: promotions,
      totalCount,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error fetching promotions: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function iHerbGetPromoById(req: Request, res: Response) {
  try {
    const pmmId = req.params.promotionId;
    const promo = await IHerbPromotion.findOne({ pmmId });

    if (!promo) {
      return res.status(RESPONSE_CODE_NOT_FOUND).json({
        data: null,
        error: { message: "No promotion with such ID" },
      });
    }

    res.status(RESPONSE_CODE_OK).json(promo);
  } catch (error) {
    const errorMessage =
      "Error fetching promotion: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      results: null,
      error: { message: errorMessage },
    });
  }
}

export async function iHerbSearchPromo(req: Request, res: Response) {
  const { predicates, predicateRelation, type: promotionType } = req.body;

  const queryOperator =
    predicateRelation === PredicateRelation.AND ? "$and" : "$or";

  try {
    const searchFields = createSearchFields(predicates);
    const query = createQuery(
      predicates,
      queryOperator,
      searchFields,
      promotionType,
      "promotionType",
    );

    const promotions = await IHerbPromotion.find(query);
    const totalCount = promotions.length;

    res.status(RESPONSE_CODE_OK).json({
      results: promotions,
      totalCount,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      "Error searching promotions: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function iHerbSavePromo(req: Request, res: Response) {
  try {
    const savedPromo = req.body;
    const pmmId = savedPromo.pmmId;

    let promotion;

    switch (savedPromo.promotionType) {
      case "ITEM_REWARD":
        promotion = await ItemRewardIHerbPromotion.findOne({ pmmId });

        if (!promotion) {
          promotion = new ItemRewardIHerbPromotion(savedPromo);
        } else {
          promotion.set(savedPromo);
        }
        break;
      case "PRICE_BASED":
        promotion = await PriceBasedIHerbPromotion.findOne({ pmmId });

        if (!promotion) {
          promotion = new PriceBasedIHerbPromotion(savedPromo);
        } else {
          promotion.set(savedPromo);
        }
        break;
      case "FREE_SHIPPING":
        promotion = await FreeShippingIHerbPromotion.findOne({ pmmId });

        if (!promotion) {
          promotion = new FreeShippingIHerbPromotion(savedPromo);
        } else {
          promotion.set(savedPromo);
        }
        break;
      default:
        throw new Error("Invalid promotion type");
    }

    const validationError = promotion.validateSync();

    if (validationError) {
      throw validationError;
    }

    const updatedPromo = await promotion.save();

    res.status(RESPONSE_CODE_OK).json(updatedPromo);
  } catch (error) {
    const errorMessage =
      "Error saving promotion: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
