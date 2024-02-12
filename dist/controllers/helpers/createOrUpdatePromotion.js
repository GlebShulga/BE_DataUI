"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdatePromotion = void 0;
const uuid_1 = require("uuid");
async function createOrUpdatePromotion(Model, savedPromo, pmmId) {
    let promotion = await Model.findOne({ pmmId });
    let originalEnabled;
    if (!promotion) {
        savedPromo.pmmId = (0, uuid_1.v4)();
        promotion = new Model(savedPromo);
    }
    else {
        originalEnabled = promotion.enabled;
        promotion.set(savedPromo);
    }
    return { promotion, originalEnabled };
}
exports.createOrUpdatePromotion = createOrUpdatePromotion;
