export declare enum purchaseType {
    ACTUAL = 0,
    MINIMUM = 1
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
export declare enum LOCALE {
    EN = "en",
    FR = "fr"
}
export declare enum discountType {
    DOLLAR = "DOLLAR",
    PERCENT = "PERCENT"
}
export declare enum PredicateRelation {
    AND = "AND",
    OR = "OR"
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
