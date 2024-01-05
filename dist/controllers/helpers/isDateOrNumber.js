"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToNumberOrDate = void 0;
const convertToNumberOrDate = (value) => {
    const parsedDate = Date.parse(value);
    return Number.isNaN(parsedDate) ? Number(value) : new Date(parsedDate);
};
exports.convertToNumberOrDate = convertToNumberOrDate;
