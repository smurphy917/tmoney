import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.definition';
import { GET_ROOT } from './get-root.static-data'; 

@Injectable()
export class InMemoryTransactionService implements TransactionService {

    private rootUrl = "app/";
    private lastResponseData:any;

    constructor(private http: Http){}

    getTransactions(context?:{last_date?:number,id?:string,size?:number,increasing?:boolean}):Promise<Transaction[]>{
        let q = new Array<string>();
        if(context && context.id){
            q.push("id=" + context.id);
        }else if(context){
            if(context.last_date)q.push("last_date=" + context.last_date);
            if(context.size)q.push("size=" + context.size);
            if(context.increasing)q.push("asc=" + context.increasing);
        }
        let resource = this.rootUrl; 
        if(q)resource+="?"+q.join("&");
        console.debug("TransactionService: resource: " + resource);
        return this.http.get(resource).toPromise().then(r => {
            console.debug("TransactionService resource response: ");
            console.log(r);
            let root = r.json().data as any;
            this.lastResponseData = root;
            let transactions = new Array<Transaction>();
            for (let t of root.accounts[0].transactions.since_last_balance){
                transactions.push({
                    date: new Date(Math.round((t.dates.date+6*3600*1000)/1000/3600/24) * 1000*3600*24),
                    type: t.type,
                    amount: t.amounts.amount/10000,
                    id: t.id
                });
            }
            let result = transactions.sort((a,b) => a.date.valueOf() - b.date.valueOf());
            console.debug("TransactionService: transaction result: ");
            console.log(result);
            return result;
         }).catch(e => {
            console.error("Transaction API error at \"" + this.rootUrl + "\"");
            console.error(e);
         });
    }

    getTransactionsAndBalance(){
        return this.getTransactions().then(transactions => {
            return {
                transactions: transactions,
                balance:{
                    date: new Date(Math.round((this.lastResponseData.accounts[0].balances.last_balance.date+6*3600*1000)/1000/3600/24) * 1000*3600*24),
                    amount: this.lastResponseData.accounts[0].balances.last_balance.amount/10000
                }
            };
        });
    }
}