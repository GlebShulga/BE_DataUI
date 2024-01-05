"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuery = void 0;
const createQuery = (predicates, queryOperator, searchFields, type, typePropertyName = "type") => {
    let query = {};
    if (predicates.length > 0 && type) {
        query = {
            [typePropertyName]: type,
            [queryOperator]: searchFields,
        };
    }
    else if (type) {
        query = { [typePropertyName]: type };
    }
    else if (predicates.length > 0) {
        query = {
            [queryOperator]: searchFields,
        };
    }
    return query;
};
exports.createQuery = createQuery;
