import { ArraySum } from './utils.functions';

export class Transaction {
    id: number;
    value: number;
    valueOf: () => number = () => {
        return this.value;
    }
    constructor(id: number, value: number) {
        this.id = id;
        this.value = value;
    };
}

export function transArrToNumArr(arr: Transaction[]): number[] {
    return arr.map(t => t.valueOf());
}

export class Rock {
    id: number;
    timeSpan: number = 1;
    baseHeight: number;
    date: Date;
    delta: number;
    private _credits: Transaction[] = new Array<Transaction>();
    private _debits: Transaction[] = new Array<Transaction>();

    addTransaction(value: number) {
        if (value >= 0) {
            this._credits.push(new Transaction(this._credits.length, value));
        } else {
            this._debits.push(new Transaction(this._debits.length, value));
        }
        this.calcDelta();
    }

    set credits(credits: Transaction[]) {
        this._credits = credits;
        if (this._debits) {
            this.calcDelta();
        }
    }

    get credits(): Transaction[] {
        return this._credits;
    }

    set debits(debits: Transaction[]) {
        this._debits = debits;
        if (this._credits) {
            this.calcDelta();
        }
    }

    get debits(): Transaction[] {
        return this._debits;
    }

    calcDelta(): void {
        this.delta = ArraySum(transArrToNumArr(this._credits)) - ArraySum(transArrToNumArr(this._debits));
    }

    static generateRocks(count: number, startId: number = 0): Rock[] {
        let result: Rock[] = new Array<Rock>(), startDate = new Date(2016, 10, 1 + startId);
        for (let i = 1; i <= count; i++) {
            let r = Rock.generateRock();
            r.id = startId + i;
            r.date = new Date(startDate.setDate(startDate.getDate() + 1));
            result.push(r);
        }
        return result;
    }

    static generateRock(): Rock {
        let r = new Rock();
        r.timeSpan = 1;
        let MAX_TRANS = 5,
            MAX_AMT = 1000,
            numDebits = Math.round(Math.random() * MAX_TRANS),
            numCredits = Math.round(Math.random() * MAX_TRANS),
            credits = new Array<Transaction>(),
            debits = new Array<Transaction>();
        for (let i = 0; i < numDebits; i++) {
            debits.push(new Transaction(i, Math.round((Math.random() * MAX_AMT) * 100) / 100));
        }
        for (let i = 0; i < numCredits; i++) {
            credits.push(new Transaction(i, Math.round((Math.random() * MAX_AMT) * 100) / 100));
        }
        r.credits = credits;
        r.debits = debits;
        return r;
    }
}