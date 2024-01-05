"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const responseCodes_1 = require("../constants/responseCodes");
function isAdmin(req, res, next) {
    const currentUser = req.user;
    if (currentUser.role !== "admin") {
        return res
            .status(responseCodes_1.RESPONSE_CODE_UNAUTHORIZED)
            .send("Only admin can delete cart");
    }
    next();
}
exports.isAdmin = isAdmin;
