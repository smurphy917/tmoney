import { Injectable } from '@angular/core';
import { Response, ResponseOptions, ResponseType, XHRBackend, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { InMemoryDbService, InMemoryBackendConfig, InMemoryBackendService, HttpMethodInterceptorArgs } from 'angular-in-memory-web-api';
import { Rock } from './rock.definition';
import { GET_ROOT } from './get-root.static-data';
import { Transaction } from './transaction.definition';

@Injectable()
export class InMemoryDataService implements InMemoryDbService{
    
    createDb(){
        let rocks = new Array<Rock>();
        rocks = Rock.generateRocks(300);
        let root = GET_ROOT;
        return {rocks,root};
    }

    get(args:HttpMethodInterceptorArgs):Observable<Response>{
        if(args.requestInfo.collectionName=="rocks"){
            console.debug("API: rocks requested");
            return this.getRocks(args);
        }else if(args.requestInfo.collectionName=="" || args.requestInfo.collectionName in ['/']){
            console.debug("API: root requested");
            return this.getRoot(args);
        }
    }

    getRoot(args:HttpMethodInterceptorArgs):Observable<Response>{
        let respData = {data:GET_ROOT};
        if(args.requestInfo.query){
            let transactions = respData.data.accounts[0].transactions.since_last_balance;
            //this will eventually be done in the SQL call
            transactions.sort((a:{dates:{date:number}},b:{dates:{date:number}})=>a.dates.date - b.dates.date);
            let qData = args.requestInfo.query.paramsMap;
            let size = qData.get("size") ? Number(qData.get("size")[0]) : 100;
            let last_date = qData.get("last_date") ? Number(qData.get("last_date")[0]) : null;
            let increasing = qData.get("asc") ? qData.get("asc")[0]==='true' : true;
            let iterTransactions = increasing ? transactions : transactions.reverse();
            let count = 0;
            respData.data.accounts[0].transactions.since_last_balance = 
                iterTransactions.filter(function(t:{dates:{date:number}}){
                    if(count>=size){
                        return false;
                    }
                    var valid = true;
                    if(last_date && increasing && t.dates.date < last_date){
                        valid = false;
                    }
                    if(last_date && !increasing && t.dates.date > last_date){
                        valid = false;
                    }
                    if(valid){
                        count++;
                    }
                    return valid;
                });
        }
        let resp = new Response(new ResponseOptions({
            body: respData,
            status: 200,
            headers: args.requestInfo.headers,
            statusText: 'OK',
            type: ResponseType.Basic,
            url: args.requestInfo.resourceUrl
        }));
        return Observable.from([resp]);
    }

    getRocks(args:HttpMethodInterceptorArgs):Observable<Response>{
        let currData:Rock[];
        if(args.db.hasOwnProperty('rocks')){
            currData = args.db['rocks'] as Rock[];
        }else{
            currData = new Array<Rock>();
        }
        let respData:{};
        if(!args.requestInfo.query){
            respData = {data:currData};
        }else{
            let qData = args.requestInfo.query.paramsMap,
                size = qData.get("size") ? Number.parseInt(qData.get("size")[0]) : 100,
                startId = qData.get("sId") ? Number.parseInt(qData.get("sId")[0]) : null,
                increasing = qData.get("inc") ? qData.get("inc")[0] : true;
            let count = 0;
            let iterRock = increasing ? currData : currData.reverse();
            respData = {data:
                iterRock.filter(function(rock){
                    if (count>= size)
                        return false;
                    var res = true;
                    if(startId && rock.id <= startId && increasing)
                        res = false
                    if(startId && rock.id >= startId && !increasing)
                        res = false;
                    if(res)
                        count++;
                    return res;
                })    
            }
        }
        let resp = new Response(new ResponseOptions({
            body: respData,
            status: 200,
            headers: args.requestInfo.headers,
            statusText: 'OK',
            type: ResponseType.Basic,
            url: args.requestInfo.resourceUrl
        }));
        return Observable.from([resp]);
    }
}