import { ArraySum } from './utils.functions';

export class Transaction{
        id:number;
        value:number;
        valueOf: ()=>number = () =>{
                return this.value;
        }
        constructor(id:number,value:number){
                this.id = id;
                this.value = value;
        };
}

export class Rock {
        id: number;
        timeSpan: number = 1;
        baseHeight: number;
        date: Date;
        delta:number;
        private _credits:Transaction[] = new Array<Transaction>();
        private _debits:Transaction[] = new Array<Transaction>();

        addTransaction(value:number){
                if(value>=0){
                        this._credits.push(new Transaction(this._credits.length,value));
                }else{
                        this._debits.push(new Transaction(this._debits.length,value));
                }
                this.calcDelta();
        }
        
        set credits(credits:Transaction[]){
                this._credits = credits;
                if(this._debits){
                        this.calcDelta();
                }
        }
        
        get credits():Transaction[]{
                return this._credits;
        }
        
        set debits(debits:Transaction[]){
                this._debits = debits;
                if(this._credits){
                        this.calcDelta();
                }
        }
        
        get debits():Transaction[]{
                return this._debits;
        }

        calcDelta():void{
                this.delta = ArraySum(<number[]> this._credits) - ArraySum(<number[]> this._debits);
        }
}