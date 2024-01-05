"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyItemLevelByType = exports.componentType = void 0;
var componentType;
(function (componentType) {
    componentType[componentType["BUY"] = 0] = "BUY";
    componentType[componentType["GET"] = 1] = "GET";
})(componentType || (exports.componentType = componentType = {}));
var hierarchyItemLevelByType;
(function (hierarchyItemLevelByType) {
    hierarchyItemLevelByType[hierarchyItemLevelByType["PRODUCT"] = 1] = "PRODUCT";
    hierarchyItemLevelByType[hierarchyItemLevelByType["CATEGORY"] = 2] = "CATEGORY";
})(hierarchyItemLevelByType || (exports.hierarchyItemLevelByType = hierarchyItemLevelByType = {}));
