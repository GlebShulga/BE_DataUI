import { Predicate, SearchField } from "../../types/commonTypes";

export const createQuery = (
  predicates: Predicate[],
  queryOperator: string,
  searchFields: SearchField[],
  type?: string,
  typePropertyName: string = "type",
) => {
  let query = {};

  if (predicates.length > 0 && type) {
    query = {
      [typePropertyName]: type,
      [queryOperator]: searchFields,
    };
  } else if (type) {
    query = { [typePropertyName]: type };
  } else if (predicates.length > 0) {
    query = {
      [queryOperator]: searchFields,
    };
  }

  return query;
};
