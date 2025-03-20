"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
class Tools {
    static GetHostname() {
        const os = require('node:os');
        return os.hostname();
    }
    static GetCpuCapacity() {
        const os = require('node:os');
        return os.cpus().length;
    }
}
exports.Tools = Tools;
//# sourceMappingURL=tools.js.map