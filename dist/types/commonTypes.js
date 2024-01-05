"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredicateRelation = exports.discountType = exports.LOCALE = exports.purchaseType = void 0;
var purchaseType;
(function (purchaseType) {
    purchaseType[purchaseType["ACTUAL"] = 0] = "ACTUAL";
    purchaseType[purchaseType["MINIMUM"] = 1] = "MINIMUM";
})(purchaseType || (exports.purchaseType = purchaseType = {}));
var LOCALE;
(function (LOCALE) {
    LOCALE["EN"] = "en";
    LOCALE["FR"] = "fr";
})(LOCALE || (exports.LOCALE = LOCALE = {}));
var discountType;
(function (discountType) {
    discountType["DOLLAR"] = "DOLLAR";
    discountType["PERCENT"] = "PERCENT";
})(discountType || (exports.discountType = discountType = {}));
var PredicateRelation;
(function (PredicateRelation) {
    PredicateRelation["AND"] = "AND";
    PredicateRelation["OR"] = "OR";
})(PredicateRelation || (exports.PredicateRelation = PredicateRelation = {}));
