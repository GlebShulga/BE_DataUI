import { Predicate, SearchField } from "../../types/commonTypes";
import { convertToNumberOrDate } from "./isDateOrNumber";

export const createSearchFields = (predicates: Predicate[]): SearchField[] => {
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
        value = { $gt: convertToNumberOrDate(predicate.value) };
        break;
      case "GREATER_OR_EQUAL":
        value = { $gte: convertToNumberOrDate(predicate.value) };
        break;
      case "LESS":
        value = { $lt: convertToNumberOrDate(predicate.value) };
        break;
      case "LESS_OR_EQUAL":
        value = { $lte: convertToNumberOrDate(predicate.value) };
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
        return {
          $elemMatch: { effectiveFrom: value },
        };
      case "voucherEndDate":
        return {
          $elemMatch: { effectiveTo: value },
        };
      default:
        return { [column]: value };
    }
  });
};
