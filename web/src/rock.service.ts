import { Injectable } from "@angular/core";
import { Rock, Transaction } from './rock.definition';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RockService{

    constructor(
        private http: Http
    ){}

    generateRocks(count:number):Rock[]{
        let result: Rock[] = new Array<Rock>(),
            startDate = new Date(2016,10,1);
        for (let i=1;i<=count;i++){
            let r = this.generateRock();
            r.id = i;
            r.date = new Date(startDate.setDate(startDate.getDate() + 1));
            result.push(r);
        }
        return result;
    }
    generateRock():Rock{
        let r = new Rock();
        r.timeSpan = 1;
        let MAX_TRANS = 5,
            MAX_AMT = 1000,
            numDebits = Math.round(Math.random() * MAX_TRANS),
            numCredits = Math.round(Math.random() * MAX_TRANS),
            credits = new Array<Transaction>(),
            debits = new Array<Transaction>();
        for(let i=0;i<numDebits;i++){
            debits.push(new Transaction(i,Math.round((Math.random() * MAX_AMT)*100)/100));
        }
        for(let i=0;i<numCredits;i++){
            credits.push(new Transaction(i,Math.round((Math.random() * MAX_AMT)*100)/100));
        }
        r.credits = credits;
        r.debits = debits;
        return r;
    }

}