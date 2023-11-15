import { Predicate, SearchField } from "../../types/commonTypes";

export const createQuery = (
  predicates: Predicate[],
  type: string,
  queryOperator: string,
  searchFields: SearchField[],
) => {
  let query = {};

  if (predicates.length > 0 && type) {
    query = {
      type,
      [queryOperator]: searchFields,
    };
  } else if (type) {
    query = { type };
  } else if (predicates.length > 0) {
    query = {
      [queryOperator]: searchFields,
    };
  }

  return query;
};
