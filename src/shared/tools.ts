export class Tools {

    static Is5mnCompliant(date: Date) {
        return (date.getMinutes() % 5) === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0;
    }

    static Create5mnCompliantDate(date: Date) {
        let refDate = new Date(date);
        if (isNaN(refDate.getTime())) {
            refDate = new Date();
        }
        const nowMinutes = refDate.getMinutes();
        const remainder = nowMinutes % 5;
        const nearestMinutes = remainder >= 2.5 ? nowMinutes + (5 - remainder) : nowMinutes - remainder;
        return new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), refDate.getHours(), nearestMinutes);
    }

    static GetHostname(): string {
        const os = require('node:os');
        return os.hostname();
    }

    static GetCpuCapacity(): number {
        const os = require('node:os');
        return os.cpus().length;
    }

    static GetPeriodFromFrequency(givenDate: Date, frequencyMinutes: number) {

        // Calculate the start of the period
        const remainder = givenDate.getMinutes() % frequencyMinutes;
        const startDate = new Date(givenDate);
        startDate.setMinutes(givenDate.getMinutes() - remainder);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);

        // Calculate the end of the period
        const endDate = new Date(startDate);
        endDate.setMinutes(startDate.getMinutes() + frequencyMinutes);

        return {
            minDate: startDate,
            maxDate: endDate
        };
    }
}
