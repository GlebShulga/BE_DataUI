"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const responseCodes_1 = require("../constants/responseCodes");
async function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(responseCodes_1.RESPONSE_CODE_UNAUTHORIZED).send("Token is required");
    }
    const [tokenType, token] = authHeader.split(" ");
    if (tokenType !== "Bearer") {
        return res.status(responseCodes_1.RESPONSE_CODE_FORBIDDEN).send("Invalid Token");
    }
    try {
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = user;
    }
    catch (err) {
        return res.status(responseCodes_1.RESPONSE_CODE_FORBIDDEN).send("Invalid Token");
    }
    return next();
}
exports.authenticateUser = authenticateUser;
