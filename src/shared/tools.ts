export class Tools {
    static GetHostname(): string {
        const os = require('node:os');
        return os.hostname();
    }

    static GetCpuCapacity(): number {
        const os = require('node:os');
        return os.cpus().length;
    }
}
