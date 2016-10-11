import { ArraySum } from './utils.functions';
export class Rock {
        id: number;
        timeSpan: number = 1;
        baseHeight: number;
        date: Date;
        delta:number;
        private _credits:number[];
        private _debits:number[];

        set credits(credits:number[]){
                this._credits = credits;
                if(this._debits){
                        this.calcDelta();
                }
        }

        get credits():number[]{
                return this._credits;
        }

        set debits(debits:number[]){
                this._debits = debits;
                if(this._credits){
                        this.calcDelta();
                }
        }

        get debits():number[]{
                return this._debits;
        }

        calcDelta():void{
                this.delta = ArraySum(this._credits) - ArraySum(this._debits);
        }
}