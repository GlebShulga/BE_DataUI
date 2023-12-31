import { Request, Response } from "express";
import {
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
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
import { Product } from "../models";
import { PredicateRelation } from "../types/commonTypes";
import { createSearchFields } from "./helpers/createSearchFields";
import { createQuery } from "./helpers/createQuery";

export async function amazonGetPromoById(req: Request, res: Response) {
  try {
    const pmmId = req.params.promotionId;
    const promo = await AmazonPromotion.findOne({ pmmId });

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
      "Error searching promotions: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function amazonSavePromo(req: Request, res: Response) {
  try {
    const savedPromo = req.body;
    const pmmId = savedPromo.pmmId;

    let promotion;
    let originalEnabled;

    switch (savedPromo.promotionType) {
      case "AM_MULTI":
        promotion = await MultiAmazonPromotion.findOne({ pmmId });
        if (!promotion) {
          promotion = new MultiAmazonPromotion(savedPromo);
        } else {
          originalEnabled = promotion.enabled;
          promotion.set(savedPromo);
        }
        break;
      case "AM_PRICE_BASED":
        promotion = await PriceBasedAmazonPromotion.findOne({ pmmId });
        if (!promotion) {
          promotion = new PriceBasedAmazonPromotion(savedPromo);
        } else {
          originalEnabled = promotion.enabled;
          promotion.set(savedPromo);
        }
      case "AM_FIXED_DISCOUNT":
        promotion = await FixedDiscountAmazonPromotion.findOne({ pmmId });
        if (!promotion) {
          promotion = new FixedDiscountAmazonPromotion(savedPromo);
        } else {
          originalEnabled = promotion.enabled;
          promotion.set(savedPromo);
        }
      case "AM_FREE_SHIPPING":
        promotion = await ShippingAmazonPromotion.findOne({ pmmId });
        if (!promotion) {
          promotion = new ShippingAmazonPromotion(savedPromo);
        } else {
          originalEnabled = promotion.enabled;
          promotion.set(savedPromo);
        }
      case "AM_XFORY":
        promotion = await XForYAmazonPromotion.findOne({ pmmId });
        if (!promotion) {
          promotion = new XForYAmazonPromotion(savedPromo);
        } else {
          originalEnabled = promotion.enabled;
          promotion.set(savedPromo);
        }
      case "AM_SPEND_AND_GET_GC":
        promotion = await SpendAndGetAmazonPromotion.findOne({ pmmId });
        if (!promotion) {
          promotion = new SpendAndGetAmazonPromotion(savedPromo);
        } else {
          originalEnabled = promotion.enabled;
          promotion.set(savedPromo);
        }
        break;
      default:
        throw new Error("Invalid promotion type");
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
        const existingItemIds = component.items.map((item) =>
          item.hierarchyLevel === hierarchyItemLevelByType.PRODUCT
            ? item.styleCode
            : item.code,
        );

        component.items = component.items.filter((item) =>
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
      "Error saving promotion: " +
      (error instanceof Error ? error.message : "Unknown error");
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}
