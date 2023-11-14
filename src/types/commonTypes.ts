export enum purchaseType {
  ACTUAL,
  MINIMUM,
}

export interface Zone {
  effectiveFrom: Date;
  effectiveTo: Date;
  modified: Date;
}

export interface PromotionLocalizedDescription {
  pmmId: string;
  locale: string;
  shortDescription: string;
  longDescription: string;
}

export enum LOCALE {
  EN = "en",
  FR = "fr",
}

export enum discountType {
  DOLLAR = "DOLLAR",
  PERCENT = "PERCENT",
}

export enum PredicateRelation {
  AND = "AND",
  OR = "OR",
}

export interface LocalizedDescription {
  locale?: string;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export type Predicate = {
  column: string;
  value: string | number | Date;
  operation: string;
};

export type SearchField = {
  [key: string]: any;
};
