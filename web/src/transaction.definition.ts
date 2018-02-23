export class Transaction{
    date: Date;
    type: "credit" | "debit";
    amount: number;
    id: string;

    constructor(id?:string,type?:string,date?:Date,amount?:number){}
}