import { Request, Response } from "express";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import {
  ERROR_FETCH_PROMO,
  ERROR_FIND_PROMO,
  ERROR_PROMO_TYPE,
  ERROR_SAVE_PROMO,
  ERROR_SEARCH_PROMO,
  UNKNOWN_ERROR,
} from "../constants/responses";
import { Product } from "../models/productCategory";
import {
  AmazonPromotion,
  FixedDiscountAmazonPromotion,
  MultiAmazonPromotion,
  PriceBasedAmazonPromotion,
  ShippingAmazonPromotion,
  SpendAndGetAmazonPromotion,
  XForYAmazonPromotion,
} from "../models/amazonPromotion";
import { AmazonPromotionItem } from "../types/amazonPromoTypes";
import { getCategoryById, getProductById } from "./product";
import {
  ProductCategory,
  hierarchyItemLevelByType,
} from "../types/productCategory";
import { PredicateRelation } from "../types/commonTypes";
import {
  createSearchFields,
  createQuery,
  createOrUpdatePromotion,
} from "./helpers";

export async function amazonGetPromoById(req: Request, res: Response) {
  try {
    const pmmId = req.params.promotionId;
    const promo = await AmazonPromotion.findOne({ pmmId });

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

export async function amazonSearchPromo(req: Request, res: Response) {
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

    const promotions = await AmazonPromotion.find(query);
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

export async function amazonSavePromo(req: Request, res: Response) {
  try {
    const savedPromo = req.body;
    const { pmmId } = savedPromo;

    let promotion;
    let originalEnabled;

    switch (savedPromo.promotionType) {
      case "AM_MULTI":
        ({ promotion, originalEnabled } = await createOrUpdatePromotion(
          MultiAmazonPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      case "AM_PRICE_BASED":
        ({ promotion, originalEnabled } = await createOrUpdatePromotion(
          PriceBasedAmazonPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      case "AM_FIXED_DISCOUNT":
        ({ promotion, originalEnabled } = await createOrUpdatePromotion(
          FixedDiscountAmazonPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      case "AM_FREE_SHIPPING":
        ({ promotion, originalEnabled } = await createOrUpdatePromotion(
          ShippingAmazonPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      case "AM_XFORY":
        ({ promotion, originalEnabled } = await createOrUpdatePromotion(
          XForYAmazonPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      case "AM_SPEND_AND_GET_GC":
        ({ promotion, originalEnabled } = await createOrUpdatePromotion(
          SpendAndGetAmazonPromotion,
          savedPromo,
          pmmId,
        ));
        break;
      default:
        throw new Error(ERROR_PROMO_TYPE);
    }

    if (!Array.isArray(promotion.zones)) {
      promotion.zones = [];
    }

    promotion.zones[0] = {
      effectiveFrom: savedPromo.effectiveFrom,
      effectiveTo: savedPromo.effectiveTo ?? savedPromo.zones[0]?.effectiveTo,
      modified: new Date(),
    };

    if (originalEnabled !== savedPromo.enabled) {
      promotion.actionLog = promotion.actionLog ?? [];
      promotion.actionLog.push({
        pmmId: req.body.pmmId,
        date: new Date(),
        enabled: req.body.enabled,
      });
    }

    if (savedPromo.buyComponent && savedPromo.buyComponent.items) {
      const newItems = savedPromo.buyComponent.items;
      const itemIds = newItems.map((item: AmazonPromotionItem) => item.item);
      promotion.components = promotion.components ?? [];

      for (const component of promotion.components) {
        const existingItemIds = component.items.map((item: ProductCategory) =>
          item.hierarchyLevel === hierarchyItemLevelByType.PRODUCT
            ? item.styleCode
            : item.code,
        );

        component.items = component.items.filter((item: ProductCategory) =>
          itemIds.includes(
            item.hierarchyLevel === hierarchyItemLevelByType.PRODUCT
              ? item.styleCode
              : item.code,
          ),
        );

        const newItemIds = itemIds.filter(
          (id: string) => !existingItemIds.includes(id),
        );
        for (const itemId of newItemIds) {
          let itemDocument;
          const newItem = newItems.find(
            (item: AmazonPromotionItem) => item.item === itemId,
          );
          if (newItem.hierarchyLevel === hierarchyItemLevelByType.PRODUCT) {
            const product: ProductCategory = await getProductById(itemId);
            itemDocument = new Product(product);
          } else if (
            newItem.hierarchyLevel === hierarchyItemLevelByType.CATEGORY
          ) {
            const category: ProductCategory = await getCategoryById(itemId);
            itemDocument = new Product(category);
          }

          if (itemDocument) {
            component.items.push({
              ...itemDocument.toObject(),
              hierarchyLevel: newItem.hierarchyLevel,
            });
          }
        }
      }
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
