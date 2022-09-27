export class BetterDate extends Date {
    addDays(numDays: number): BetterDate {
        let result = new BetterDate(this);
        result.setDate(result.getDate() + numDays);
        return result;
    }

    toString(): string {
        return new Intl.DateTimeFormat('default', { dateStyle: 'short'}).format(this);
    }

    getDatesOfWeek() : Array<BetterDate> {
        let dates = new Array<BetterDate>();
        for (let i = 0; i < 7; i++) { 
            let day = this.addDays(i);
            day.setUTCHours(0, 0, 0, 0);
            dates.push(day);
        }
        return dates;
    }

    // FIXME: will be wrong Monday on Sunday
    getMonday(): BetterDate {
        let result = new BetterDate();
        result.setDate(result.getDate() - result.getDay() + 1)
        return result;
    }
}