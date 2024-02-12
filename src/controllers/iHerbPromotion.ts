import { Request, Response } from "express";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import {
  ERROR_FETCH_PROMO,
  ERROR_FIND_PROMO,
  ERROR_SEARCH_PROMO,
  ERROR_SAVE_PROMO,
  ERROR_PROMO_TYPE,
  UNKNOWN_ERROR,
} from "../constants/responses";
import {
  ItemRewardIHerbPromotion,
  IHerbPromotion,
  PriceBasedIHerbPromotion,
  FreeShippingIHerbPromotion,
} from "../models/iHerbPromotion";
import { PredicateRelation } from "../types/commonTypes";
import {
  createSearchFields,
  createQuery,
  createOrUpdatePromotion,
} from "./helpers";

export async function iHerbGetPromoById(req: Request, res: Response) {
  try {
    const pmmId = req.params.promotionId;
    const promo = await IHerbPromotion.findOne({ pmmId });

    if (!promo) {
      return res.status(RESPONSE_CODE_NOT_FOUND).json({
        data: null,
        error: { message: ERROR_FIND_PROMO },
      });
    }

    res.status(RESPONSE_CODE_OK).json(promo);
  } catch (error) {
    const errorMessage =
      ERROR_FETCH_PROMO +
      (error instanceof Error ? error.message : UNKNOWN_ERROR);
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
      ERROR_SEARCH_PROMO +
      (error instanceof Error ? error.message : UNKNOWN_ERROR);
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function iHerbSavePromo(req: Request, res: Response) {
  try {
    const savedPromo = req.body;
    const { pmmId } = savedPromo;

    let promotion;

    switch (savedPromo.promotionType) {
      case "ITEM_REWARD":
        ({ promotion } = await createOrUpdatePromotion(
          ItemRewardIHerbPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      case "PRICE_BASED":
        ({ promotion } = await createOrUpdatePromotion(
          PriceBasedIHerbPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      case "FREE_SHIPPING":
        ({ promotion } = await createOrUpdatePromotion(
          FreeShippingIHerbPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      default:
        throw new Error(ERROR_PROMO_TYPE);
    }

    const validationError = promotion.validateSync();

    if (validationError) {
      throw validationError;
    }

    const updatedPromo = await promotion.save();

    res.status(RESPONSE_CODE_OK).json(updatedPromo);
  } catch (error) {
    const errorMessage =
      ERROR_SAVE_PROMO +
      (error instanceof Error ? error.message : UNKNOWN_ERROR);
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
