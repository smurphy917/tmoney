import { Injectable } from "@angular/core";
import { Rock } from './rock';
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
            let deets = this.generateRockDetails(),
                r = new Rock();
            r.id = i;
            r.credits = deets.credits;
            r.debits = deets.debits;
            r.date = new Date(startDate.setDate(startDate.getDate() + 1));
            r.timeSpan = 1;
            result.push(r);
        }
        return result;
    }
    generateRockDetails():{debits:number[],credits:number[]}{
        let details:{debits:number[],credits:number[]} = {
            debits:[],
            credits:[]
        };
        let MAX_TRANS = 5,
            MAX_AMT = 1000,
            numDebits = Math.round(Math.random() * MAX_TRANS),
            numCredits = Math.round(Math.random() * MAX_TRANS);
        for(let i=0;i<numDebits;i++){
            details.debits.push(Math.round((Math.random() * MAX_AMT)*100)/100);
        }
        for (let i=0;i<numCredits;i++){
            details.credits.push(Math.round((Math.random() * MAX_AMT)*100)/100);
        }
        return details;
    }

}