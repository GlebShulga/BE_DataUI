"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSearchFields = void 0;
const isDateOrNumber_1 = require("./isDateOrNumber");
const createSearchFields = (predicates) => {
    return predicates.map((predicate) => {
        let column = predicate.column;
        if (column !== "pmmId") {
            column = column
                .toLowerCase()
                .replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
        }
        let value;
        switch (predicate.operation) {
            case "CONTAINS":
                value = { $regex: String(predicate.value), $options: "i" };
                break;
            case "EQUALS":
                value = predicate.value;
                break;
            case "STARTS_WITH":
                value = { $regex: "^" + String(predicate.value), $options: "i" };
                break;
            case "ENDS_WITH":
                value = { $regex: String(predicate.value) + "$", $options: "i" };
                break;
            case "GREATER":
                value = { $gt: (0, isDateOrNumber_1.convertToNumberOrDate)(predicate.value) };
                break;
            case "GREATER_OR_EQUAL":
                value = { $gte: (0, isDateOrNumber_1.convertToNumberOrDate)(predicate.value) };
                break;
            case "LESS":
                value = { $lt: (0, isDateOrNumber_1.convertToNumberOrDate)(predicate.value) };
                break;
            case "LESS_OR_EQUAL":
                value = { $lte: (0, isDateOrNumber_1.convertToNumberOrDate)(predicate.value) };
                break;
            case "IS_EMPTY":
                value = { $eq: "" };
                break;
            case "IS_NOT_EMPTY":
                value = { $ne: "" };
                break;
            default:
                value = { $regex: predicate.value, $options: "i" };
        }
        switch (column) {
            case "longDescription":
            case "shortDescription":
                return {
                    localizedDescriptions: { $elemMatch: { [column]: value } },
                };
            case "promotionEndDate":
                return {
                    zones: { $elemMatch: { effectiveTo: value } },
                };
            case "promotionStartDate":
                return {
                    zones: { $elemMatch: { effectiveFrom: value } },
                };
            case "voucherStartDate":
            case "from":
                return {
                    effectiveFrom: value,
                };
            case "voucherEndDate":
            case "to":
                return {
                    effectiveTo: value,
                };
            default:
                return { [column]: value };
        }
    });
};
exports.createSearchFields = createSearchFields;
