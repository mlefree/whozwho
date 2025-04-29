"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const node_cluster_1 = __importDefault(require("node:cluster"));
const node_worker_threads_1 = __importDefault(require("node:worker_threads"));
const node_path_1 = require("node:path");
require('dotenv').config({ path: (0, node_path_1.join)(__dirname, '../..', '.env') });
let _config;
if (process.env.NODE_ENV === 'test') {
    _config = require('./env/test').defaultConfig;
}
else if (process.env.NODE_ENV === 'production') {
    _config = require('./env/production').defaultConfig;
}
else {
    _config = require('./env/development').defaultConfig;
}
if (node_cluster_1.default.isPrimary && node_worker_threads_1.default.isMainThread) {
    console.log('### WHOZWHO App _configEnv: ', process.env.NODE_ENV, JSON.stringify(_config, null, 4));
}
if (node_cluster_1.default.isPrimary && node_worker_threads_1.default.isMainThread && _config.mongodb.isMocked) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('### WHOZWHO App db to start...');
    const mongoServer = new MongoMemoryServer({ instance: { port: _config.mongodb.mockedPort } });
    mongoServer.start().then(() => {
        _config.mongodb.uri = mongoServer.getUri();
        console.log('### WHOZWHO App db started', _config.mongodb.uri);
    });
    process.on('exit', async () => {
        console.warn('### WHOZWHO App about to exit.');
        await mongoServer.stop();
    });
}
exports.config = _config;
//# sourceMappingURL=index.js.map