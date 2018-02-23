import { Transaction } from './transaction.definition';
import { TransactionService } from './transaction.service';
import { InMemoryTransactionService } from './in-memory.transaction.service';
import { Component, Input, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { InfiniteChartInput } from './infinite-chart';
import { RoundDigits } from './utils.functions';

/**
 * Container that holds the InfiniteChart component.
 * 
 * Responds to events from the InfiniteChartComponent and modifies data as needed.
 * Events: scrolling
 */

@Component({
    selector: "chart-container",
    templateUrl: "./template/chart-container.component.html",
    styleUrls: ['./style/chart-container.component.css']
})
export class ChartContainerComponent implements OnInit, OnChanges{
    //chartData: Promise<Map<number,number>>;
    //_chartData = new Map<number,number>();
    transactions = new Array<Transaction>();
    balance: {date:Date, amount:number};

    private _newTransactions: Transaction[];

    constructor(private transactionService:InMemoryTransactionService){}

    retrieveData(event:{action:string,context:{last_item?:Transaction}}){
        //handle the scrolling. event should provide details of needed data.
        console.debug("retrieveData:");
        console.log(event);

        let context:{last_date?:number,id?:string,size?:number,increasing?:boolean} = {};
        if(event.action==="add_right"){
            context.increasing = true;
            context.last_date = event.context.last_item.date.valueOf() + ((23*60 + 59)*60 + 59)*1000
        }

        this.transactionService.getTransactions(context)
            .then((transactions:Transaction[])=>{
                for(let t of transactions){
                    this.transactions.push(t);
                }
            });
        
    }

    ngOnInit(){
        let self = this;
        //this.chartData = new Promise(function(resolve,reject){
            self.transactionService.getTransactionsAndBalance().then((r:{balance:{date:Date,amount:number},transactions:Transaction[]}) => {
                //console.debug("ChartContainer: transaction service return");
                //console.log(r);
                self.balance = r.balance;
                self.newTransactions = r.transactions;
                //resolve(self._chartData);
            });
        //});
    }

    ngOnChanges(changes:any){
        let self = this;
        /*
        this.chartData = new Promise(function(resolve,reject){
            self.updateChartData([]);
            resolve(self._chartData);
        })
        */
    }
    /*
    get aggregatedDateAmounts():Map<number,number>{
        let aggregatedDateAmounts = new Map<number,number>();
        for(let t of this.transactions){
            if(t.date.valueOf() <= this.balance.date.valueOf())
                continue;
            /*
            console.debug("date: " + new Date(t.date));
            console.debug("amount: " + t.amount);
            console.debug("current value: " + aggregatedDateAmounts.get(t.date.valueOf()));
            console.debug("type: " + t.type);
            console.debug("type===credit: " + (t.type==="credit"));
            console.debug("new value: " + ((aggregatedDateAmounts.get(t.date.valueOf()) || 0) + (t.type==='credit' ? t.amount : -t.amount)));
            *//*
            aggregatedDateAmounts.set(
                t.date.valueOf(),
                (aggregatedDateAmounts.get(t.date.valueOf()) || 0) + (t.type==='credit' ? t.amount : -t.amount)
            );
        }
        return aggregatedDateAmounts;
    }
    
    get chartData():Map<number,number>{
        let chartData = new Map<number,number>();
        let runningBalance = this.balance.amount;
        let thisAda = this.aggregatedDateAmounts;
        let ada = new Map<number,number>();
        if(thisAda && thisAda.size){
            ada = thisAda;
        }
        console.debug("ada:");
        console.log(ada);
        console.log(ada.entries());
        for (let [date,amount] of ada.entries()){
            //console.log(new Date(date).toString() + " - " + amount);
            runningBalance = RoundDigits(runningBalance + amount,4);
            //console.debug("balance date: " + this.balance.date + "; transaction date: " + new Date(date));
            chartData.set(0,this.balance.amount);
            chartData.set((date.valueOf() - this.balance.date.valueOf())/1000/3600/24,runningBalance);
        }
        return chartData;
    }
    */

    translator():(t:Transaction[])=>Map<number,number>{
        let thisBalance = this.balance;
        return function translate(transactions:Transaction[]):Map<number,number>{
            if(!transactions.length){
                return new Map<number,number>();
            }
            let aggregatedDateAmounts = new Map<number,number>();
            for(let t of transactions){
                if(t.date.valueOf() <= thisBalance.date.valueOf())
                    continue;
                /*
                console.debug("date: " + new Date(t.date));
                console.debug("amount: " + t.amount);
                console.debug("current value: " + aggregatedDateAmounts.get(t.date.valueOf()));
                console.debug("type: " + t.type);
                console.debug("type===credit: " + (t.type==="credit"));
                console.debug("new value: " + ((aggregatedDateAmounts.get(t.date.valueOf()) || 0) + (t.type==='credit' ? t.amount : -t.amount)));
                */
                aggregatedDateAmounts.set(
                    t.date.valueOf(),
                    (aggregatedDateAmounts.get(t.date.valueOf()) || 0) + (t.type==='credit' ? t.amount : -t.amount)
                );
            }
            let chartData = new Map<number,number>();
            let runningBalance = thisBalance.amount;
            for (let [date,amount] of aggregatedDateAmounts.entries()){
                //console.log(new Date(date).toString() + " - " + amount);
                runningBalance = RoundDigits(runningBalance + amount,4);
                //console.debug("balance date: " + this.balance.date + "; transaction date: " + new Date(date));
                chartData.set(0,thisBalance.amount);
                chartData.set((date.valueOf() - thisBalance.date.valueOf())/1000/3600/24,runningBalance);
            }
            return chartData;
        };
    }

    set newTransactions(newTransactions:Transaction[]){
        this._newTransactions = newTransactions;
        this.updateChartData(newTransactions);
        for(let t of newTransactions){
            this.transactions.push(t);
        }
        /*
        console.debug("transactions");
        console.log(newTransactions);
        console.log(this.transactions);
        */
    }

    select(event:any){
        let self = this;
        //console.log(event);
        //console.log(self.transactions.filter(t => t.id===event.id));
        /*this.chartData = new Promise(function(resolve,reject){
            self.updateChartData(self.transactions.filter(t => t.id===event.id));
            resolve(self._chartData);
        });
        */
    }

    updateChartData(newTransactions:Transaction[]){
        
        /*
        console.debug(new Date(this.balance.date) + " - " + this.balance.amount);
        for(let [date,amount] of aggregatedDateAmounts.entries()){
            console.debug(new Date(date) + " - " + amount);
        }
        */
    }

    
}