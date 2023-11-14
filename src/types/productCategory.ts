import { Document } from "mongoose";

export interface ProductCategory {
  brandName: string;
  catalogVersion: string;
  code: string;
  description: string;
  name: string;
  priceRange: {};
  styleCode: string;
  url: string;
  hierarchyLevel?: hierarchyItemLevelByType;
}

export enum hierarchyItemLevelByType {
  PRODUCT = 1,
  CATEGORY = 2,
}

export interface ProductCategoryDocument extends ProductCategory, Document {}
