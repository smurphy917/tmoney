import { Component, ElementRef, Input, Output, OnChanges, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

import { InfiniteChartSubComponent } from './chart-sub.component';

export interface InfiniteChartConfigObj{
    displayType: 'vertical' | 'horizontal';
    curveType: 'bezier' | 'linear' | 'scatter';
    xScale?: number;
    yScale?: number;
    changeHandler?: Subscriber<{element:ElementRef,to:{}}>
};

export interface InfinitePoint{
    x:number;
    y:number;
};

export interface InfiniteChartInput{
    data: InfiniteDataElement[] | Promise<InfiniteDataElement[]>,
    config:InfiniteChartConfig
}

export interface InfiniteDataElement{
    id: number,
    point: InfinitePoint,
    componentData: any
}

export interface InfiniteChart{
    config:InfiniteChartConfig;
    change:Observable<{element:ElementRef,to:{}}>;
    //dataStream:Observable<{id:number, point:InfinitePoint, componentData:any}>
    refresh(changes:{}[]):void;
}

export interface ChartConfig {
    changeHandler?:Subscriber<{element:ElementRef,to:{}}> | null;
}

export class InfiniteChartConfig implements ChartConfig{
    
    private constructor(
        /**
         * Property displayType: 'vertical' | 'horizontal'
         *      Determines vertical infinite scrolling (y direction)
         *       or horizontal infinite scrolling (x direction)
         */
        public displayType: 'vertical' | 'horizontal',
        /**
         * Property curveType: 'bezier' | 'linear' | 'scatter'
         *      Determines how the curve is to be drawn:
         *          bezier: using bezier control points to smoothly
         *              connect points
         *          linear: connect points with straight lines
         *          scatter: do not connect points at all
         */
        public curveType: 'bezier' | 'linear' | 'scatter',
        /**
         * Property change: Observable<{element:ElementRef,to:{}}>
         *      An Observable that emits on any changes to chart elements
         *      Can be subscribed to for animations, etc.
         */
        public xScale?:number,
        /**
         * Property yScale:
         */
        public yScale?:number,
        /**
         * Constructor
         */
        public changeHandler?:Subscriber<{element:ElementRef,to:{}}>,
        /**
         * Property xScale:number
         *      Pixels per unit in X direction
         */
    ){}

    static from(obj?:InfiniteChartConfigObj){
        if(!obj){
            return new this('horizontal','linear',10);
        }else if(obj.displayType==='horizontal'){
            if(!obj.xScale){
                throw new TypeError("xScale property is required for horizontal display type");
            }else if(obj.yScale){
                console.warn("yScale is ignored for horizontal display type");
            }
            return new this(
                obj.displayType, 
                obj.curveType, 
                obj.xScale, 
                -1, 
                obj.changeHandler ? obj.changeHandler : null
            );
        }else if(obj.displayType==='vertical'){
            if(!obj.yScale){
                throw new TypeError("yScale property is required for vertical display type");
            }else if(obj.xScale){
                console.warn("xScale is ignored for vertical display type");
            }
            return new this(
                obj.displayType, 
                obj.curveType, 
                -1, obj.yScale, 
                obj.changeHandler ? obj.changeHandler : null
            );
        }
    }

}

@Component({
    selector: 'infinite-chart',
    template: `
    <div>
        <svg>
            <!--template ngFor let-datum [ngForOf]="data"></:template-->
            <!--g infinite-sub *ngFor="let datum of data;" [p]="datum" (output)="change.emit($event)"></g-->
            <svg:circle *ngFor="let c of circles"></svg:circle>
        </svg>
    </div>
    `,
    entryComponents: [InfiniteChartSubComponent]
})
export class InfiniteChartComponent implements InfiniteChart, OnChanges, OnInit {
    
    @Input()
    input:InfiniteChartInput;
    config:InfiniteChartConfig;
    change = new EventEmitter<{element:ElementRef,to:{}}>();
    subscribed:boolean = false;
    refreshed = new EventEmitter<boolean>();
    data = new Array<InfiniteDataElement>();
    circles = [1,2,3];
    private _data:{};
    ngOnChanges(changes?:{[key:string]:any}){
        Promise.resolve(this.input.data)
            .then(data => {
                this.data = data;
            });
    }
    ngOnInit(){
        if(this.config && this.config.changeHandler){
            this.change.subscribe(this.config.changeHandler);
        }else{
            this.change
                .buffer(this.refreshed)
                .subscribe(this.refresh);
        }
    }
    refresh(changes:[{element:ElementRef, to:{}}]){
        //refresh the data
        console.log("refreshing");
        this.refreshed.emit(true);
    }
}