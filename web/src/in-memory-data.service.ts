import { Injectable } from '@angular/core';
import { Response, ResponseOptions, ResponseType, XHRBackend, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { InMemoryDbService, InMemoryBackendConfig, InMemoryBackendService, HttpMethodInterceptorArgs } from 'angular-in-memory-web-api';
import { Rock } from './rock.definition';

@Injectable()
export class InMemoryDataService implements InMemoryDbService{
    
    createDb(){
        let rocks = new Array<Rock>();
        rocks = Rock.generateRocks(100);
        return {rocks};
    }

    get(args:HttpMethodInterceptorArgs):Observable<Response>{
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
            console.debug("size/startId/increasing", [size,startId,increasing].join(" / "));
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
        console.log(respData);
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