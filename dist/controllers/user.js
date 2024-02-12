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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.userRegistration = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const responseCodes_1 = require("../constants/responseCodes");
const mongoose_1 = __importDefault(require("mongoose"));
async function userRegistration(req, res) {
    try {
        const { firstName, lastName, isAdmin, email, password } = req.body;
        if (!(email && password && firstName && lastName)) {
            res.status(responseCodes_1.RESPONSE_CODE_BAD_REQUEST).send("All input is required");
        }
        const oldUser = await models_1.User.findOne({ email });
        if (oldUser) {
            return res
                .status(responseCodes_1.RESPONSE_CODE_BAD_REQUEST)
                .send("User Already Exist. Please Login");
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const encryptedPassword = await bcryptjs_1.default.hash(password, salt);
        await models_1.User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: isAdmin === "true" ? "admin" : "user",
        });
        res.status(responseCodes_1.RESPONSE_CODE_CREATED).send("User successfully registered");
    }
    catch (err) {
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).send("Internal Server Error");
    }
}
exports.userRegistration = userRegistration;
async function userLogin(req, res) {
    try {
        mongoose_1.default.connection.useDb("test");
        // Get user input
        const { email, password } = req.body;
        // Validate user input
        if (!(email && password)) {
            res.status(responseCodes_1.RESPONSE_CODE_BAD_REQUEST).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await models_1.User.findOne({ email });
        if (user && (await bcryptjs_1.default.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ userId: user._id, email, role: user.role }, process.env.TOKEN_KEY, {
                expiresIn: "2h",
            });
            return res.status(responseCodes_1.RESPONSE_CODE_OK).json({
                token,
            });
        }
        res.status(responseCodes_1.RESPONSE_CODE_BAD_REQUEST).send("Invalid Credentials");
    }
    catch (err) {
        res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).send("Internal Server Error");
    }
}
exports.userLogin = userLogin;
