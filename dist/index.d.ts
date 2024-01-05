/// <reference types="node" />
import { CurrentUser } from "./auth";
declare global {
    namespace Express {
        interface Request {
            user: CurrentUser;
        }
    }
}
export declare const app: import("express-serve-static-core").Express;
export declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
