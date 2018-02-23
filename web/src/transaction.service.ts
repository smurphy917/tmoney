import { Transaction } from './transaction.definition';

export interface TransactionService {
    getTransactions(context?:{last_date?:number,id?:string,size?:number,increasing?:boolean}):Promise<Transaction[]>;
    getTransactionsAndBalance():Promise<{transactions:Transaction[],balance:{date:Date, amount:number}}>;
}