import { Predicate, SearchField } from "../../types/commonTypes";

export const createQuery = (
  predicates: Predicate[],
  promotionType: string,
  queryOperator: string,
  searchFields: SearchField[],
) => {
  let query = {};

  if (predicates.length > 0 && promotionType) {
    query = {
      promotionType,
      [queryOperator]: searchFields,
    };
  } else if (promotionType) {
    query = { promotionType };
  } else if (predicates.length > 0) {
    query = {
      [queryOperator]: searchFields,
    };
  }

  return query;
};
