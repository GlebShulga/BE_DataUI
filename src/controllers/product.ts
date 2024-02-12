import { Request, Response } from "express";
import { Product, Category } from "../models/productCategory";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import {
  ERROR_FETCH_PRODUCT,
  ERROR_FIND_CATEGORY,
  ERROR_FIND_PRODUCT,
  ERROR_SEARCH_PRODUCT_OR_CATEGORY,
  ERROR_SEARCH_TYPE,
  UNKNOWN_ERROR,
} from "../constants/responses";

export async function amazonSearchProductOrCategory(
  req: Request,
  res: Response,
) {
  const PRODUCT_SEARCH_TYPE = "STYLE_SEARCH";
  const BULK_PRODUCT_SEARCH_TYPE = "STYLE_BULK_SEARCH";
  const CATEGORY_SEARCH_TYPE = "CATEGORY_SEARCH";
  const BULK_CATEGORY_SEARCH_TYPE = "CATEGORY_BULK_SEARCH";
  const PAGE_SIZE = 5;

  const { query: searchTerm, searchType: type, currentPage = 0 } = req.body;

  try {
    let query = {};

    if (searchTerm) {
      if (
        type === BULK_PRODUCT_SEARCH_TYPE ||
        type === BULK_CATEGORY_SEARCH_TYPE
      ) {
        const styleCodes = searchTerm
          .split(",")
          .map((code: string) => code.trim());
        query = { styleCode: { $in: styleCodes } };
      } else {
        const searchFields = [
          { styleCode: { $regex: searchTerm, $options: "i" } },
          { catalogVersion: { $regex: searchTerm, $options: "i" } },
          { brandName: { $regex: searchTerm, $options: "i" } },
        ];
        query = {
          $or: searchFields,
        };
      }
    }

    let Model;
    if (type === PRODUCT_SEARCH_TYPE || type === BULK_PRODUCT_SEARCH_TYPE) {
      Model = Product;
    } else if (
      type === CATEGORY_SEARCH_TYPE ||
      type === BULK_CATEGORY_SEARCH_TYPE
    ) {
      Model = Category;
    } else {
      throw new Error(ERROR_SEARCH_TYPE);
    }

    const totalResults = await Model.countDocuments(query);
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);

    const productCategory = await Model.find(query)
      .skip(currentPage * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.status(RESPONSE_CODE_OK).json({
      products: productCategory,
      pagination: {
        currentPage,
        pageSize: PAGE_SIZE,
        totalPages,
        totalResults,
      },
      error: null,
    });
  } catch (error) {
    const errorMessage =
      ERROR_SEARCH_PRODUCT_OR_CATEGORY +
      (error instanceof Error ? error.message : UNKNOWN_ERROR);
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: errorMessage },
    });
  }
}

export async function getProductById(styleCode: string) {
  const product = await Product.findOne({ styleCode });

  if (!product) {
    throw new Error(ERROR_FIND_PRODUCT);
  }
  return product;
}

export async function getCategoryById(code: string) {
  const product = await Product.findOne({ code });

  if (!product) {
    throw new Error(ERROR_FIND_CATEGORY);
  }
  return product;
}

export async function amazonGetProductById(req: Request, res: Response) {
  try {
    const styleCode = req.params.productId;
    const product = await getProductById(styleCode);
    res.status(RESPONSE_CODE_OK).json(product);
  } catch (error) {
    const errorMessage =
      ERROR_FETCH_PRODUCT +
      (error instanceof Error ? error.message : UNKNOWN_ERROR);
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      results: null,
      error: { message: errorMessage },
    });
  }
}
