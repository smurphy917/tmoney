import { Injectable } from "@angular/core";
import { Rock, Transaction } from './rock.definition';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RockService{

    private rocksUrl = "app/rocks";
    public TO_RIGHT = "__TO_RIGHT__";
    public TO_LEFT = "__TO_LEFT__";

    constructor(
        private http: Http
    ){}

    getRocks(count=40, startId?:number, direction?:string):Promise<Rock[]>{
        let query = new Array<string>();
        if(count)
            query.push("size=" + count);
        if (startId)
            query.push("sId=" + startId);
        if (direction)
            query.push("inc=" + (direction==this.TO_RIGHT).toString())
        let qStr:string;
        if(query)
            qStr = "?" + query.join("&")
        console.debug("GETTING ROCKS AT URL: " + this.rocksUrl + qStr);
        return this.http.get(this.rocksUrl + qStr)
            .toPromise()
            .then(response => response.json().data as Rock[])
            .catch(this.handleError);
    }

    handleError(error:Error){
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}