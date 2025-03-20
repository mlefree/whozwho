"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$mongoose = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const mongoose_1 = __importDefault(require("mongoose"));
exports.$mongoose = (async () => {
    // Bootstrap synchronously models
    const models = (0, node_path_1.join)(__dirname, '../models');
    const regex = /.*\.(js|ts)$/;
    (0, node_fs_1.readdirSync)(models)
        .filter(file => regex.test(file))
        .forEach((file) => {
        if (file.indexOf('.spec') < 0 && file.indexOf('.d.ts') < 0) {
            return require((0, node_path_1.join)(models, file));
        }
    });
    return mongoose_1.default;
})();
//# sourceMappingURL=mongoose.js.map