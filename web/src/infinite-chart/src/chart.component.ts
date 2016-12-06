import { Component, ElementRef, Input, Output, OnChanges, OnInit, EventEmitter, ViewChild, AfterViewChecked } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

import { InfiniteChartSubComponent } from './chart-sub.component';

let Snap = require("snapsvg");

export interface InfiniteChartConfigObj{
    displayType: 'vertical' | 'horizontal';
    curveType: 'bezier' | 'linear' | 'scatter';
    xScale?: number;
    yScale?: number;
    canvasWidth?: number;
    changeHandler?: Subscriber<{element:ElementRef,to:{}}>
};

export interface InfinitePoint{
    x:number | Date;
    y?:number;
    dx?:number;
    dy?:number;
    left_x?:number | Date;
    left_y?:number;
};

export interface InfiniteChartInput{
    data: Map<number,InfiniteDataElement> | Promise<Map<number,InfiniteDataElement>>,
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
    /**
     * Constructor
     */
    constructor(
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
         * Property xScale:number
         *      Pixels per unit in X direction
         */
        public xScale?:number,
        /**
         * Property yScale:
         */
        public yScale?:number,
        /**
         * Property changeHandler: Subscriber<{element:ElementRef,to:{}}>
         *      A Subscriber that receives changes to chart elements
         *      Can be used to provide animations, etc.
         *      If not provided, a default aniimation will be used (Snapsvg).
         */
        public changeHandler?:Subscriber<{element:ElementRef,to:{}}>,
        /**
         * Property bufferedChangeHandler: Subscriber<{element:ElementRef,to:{}}[]>
         *      A Subscriber that receives buffered changes to chart elements
         *      Can be used to provide animations, etc.
         *      If not provided, a default aniimation will be used (Snapsvg).
         */
        public bufferedChangeHandler?:Subscriber<{element:ElementRef,to:{}}[]>,
        /**
         * Property canvasWidth:number
         *      Defines the size of the canvas in scaled (xScale) units
         */
        public canvasWidth?:number,
        public xWindow?:number,
        public width?:number,
        public height?:number
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
    template: require("./template/chart.component.html"),
    styles: [require("./style/chart.component.css")]
})
export class InfiniteChartComponent implements InfiniteChart,  OnChanges, OnInit, AfterViewChecked {
    
    @Input()
    input:InfiniteChartInput;
    @ViewChild("infiniteChartSVG")
    chartSVG: ElementRef;
    @Output()
    output = new EventEmitter<{element:ElementRef, to:{}}>();
    @Output()
    bufferedOutput = new EventEmitter<{element:ElementRef, to:{}}[]>();
    config:InfiniteChartConfig;
    change = new EventEmitter<{element:ElementRef,to:{}, data:{id:number}}>();
    subscribed:boolean = false;
    bufferEmit:EventEmitter<boolean>;
    closeBuffer = new EventEmitter<boolean>();
    data = new Map<number,InfiniteDataElement>();
    counter = 0;
    init = false;
    inFlight = false;
    max_y = 0;
    min_y = 0;
    min_x = 0;
    max_x = 0;
    firstChangeRun = false;
    pointsShown = 40;
    verticalBuffer = 0.1;
    bufferCount = 0;
    verticalGuides = new Array<{}>();
    guideSpacing:number;
    guideXPos:number;
    dirty = false;
    xScale = 0;
    @Output()
    dataEvent = new EventEmitter<{}>();
    
    ngOnChanges(changes?:{[key:string]:any}){
        if(!this.init){
            this.ownInit();
        }
        console.debug("chart component ngOnChanges");
        this.inFlight = true;
        if(this && this.init){
            Promise.resolve(this.input.data)
                .then(data => {
                    console.debug("ngOnChanges promise then started");
                    console.log(data);
                    let newData = new Map<number,InfiniteDataElement>(
                        [...data.entries()].sort((a,b) => a[1].point.x.valueOf() - b[1].point.x.valueOf())
                    );
                    [...newData.values()].forEach((d,i,arr) => this.buildPointData(d,i,arr));
                    console.log({
                        min_x:this.min_x,
                        max_x: this.max_x,
                        min_y: this.min_y,
                        max_y: this.max_y
                    });
                    
                    for(let d of newData){
                        this.data.set(d[0],d[1]);
                    }
                    
                    //this.data = new Map<number,InfiniteDataElement>([...this.data,...newData]);
                    this.setXScale();
                    this.change.emit({
                        element:this.chartSVG,
                        data:{
                            id: -101
                        },
                        to:{
                            viewBox: [
                                0,
                                -(this.max_y + ((this.max_y - this.min_y) * this.verticalBuffer)),
                                (this.max_x - this.min_x) * this.xScale, 
                                (this.max_y - this.min_y) * (1 + 2 * this.verticalBuffer)
                                ].join(" ")
                        }
                    });
                    console.log(this.data);
                    this.setGuides();
                    this.inFlight = false;
                    console.debug("ngOnChanges promise then complete");
                });
        }
    }

    get dataArray(){
        return new Array(...this.data.values());
    }

    identify(i:number,ea:InfiniteDataElement){
        return ea.id
    }

    get canvasWidth(){
        let ratio = this.config.width / this.config.xWindow;
        return ratio * this.data.size;
    }

    setGuides(){
        console.info("setting guides...");
        let numOfVerticalGuides = 5;
        if(!this.guideSpacing){
            this.guideSpacing = (Math.round(this.config.xWindow / (numOfVerticalGuides + 1)) * ((this.max_x - this.min_x)/(this.data.size - 1)));
            this.guideXPos = this.min_x + this.guideSpacing;
        }
        while(this.guideXPos < this.max_x){
            this.verticalGuides.push({
                xPos: this.guideXPos
            });
            this.guideXPos += this.guideSpacing;
        }
        console.info("guides set...");
        console.log(this.verticalGuides);
    }

    getGuideD(g:{xPos:number}){
        return ["M" + (g.xPos - this.min_x)*this.xScale + " " + -(this.min_y - this.verticalBuffer*(this.max_y - this.min_y)), "V-" + (1+2*this.verticalBuffer) * (this.max_y - this.min_y)].join(' ');
    }
    
    buildPointData(data:InfiniteDataElement, i:number, allData:InfiniteDataElement[]){
        if(i===0){
            //data.point.left_y = data.point.left_y || 0;
            //data.point.left_x = data.point.left_x || 0;
        }else{
            data.point.left_x= allData[i-1].point.x;
            data.point.left_y = allData[i-1].point.y;
        }
        if(!data.point.hasOwnProperty("y") && data.point.hasOwnProperty("dy")){
            data.point.y = data.point.left_y + data.point.dy;
        }
        if(i===0){
            this.max_y = data.point.y;
            this.min_y = data.point.y;
            this.max_x = data.point.x.valueOf();
            this.min_x = data.point.x.valueOf();
        }else{
            this.max_y = data.point.y > this.max_y ? data.point.y : this.max_y;
            this.min_y = data.point.y < this.min_y ? data.point.y : this.min_y;
        }
        if(i===allData.length - 1){
            this.max_x = data.point.x.valueOf();
        }
    }

    setXScale(){
        let yHeight = (this.max_y - this.min_y) * (1 + (2 * this.verticalBuffer));
        let xRange = this.max_x - this.min_x;
        let ratio = this.config.width/this.config.height;
        let scaledWidth = ratio * yHeight;
        let rawXScale = scaledWidth / this.config.xWindow;
        let rangeUnit = xRange / (this.data.size - 1)
        let xScale = rawXScale / rangeUnit;
        console.debug("xScale: " + xScale);
        if(xScale < 0){
            console.log({
                yHeight: yHeight, 
                xRange: xRange, 
                ratio: ratio, 
                scaledWidth: scaledWidth, 
                rawXScale: rawXScale, 
                rangeUnit: rangeUnit
            });
        }
        this.xScale = xScale;
    }

    handleScroll(event:UIEvent){
        let self = this
        if(!self.dirty){
            let target = <Element>event.target;
            let scrollDiff = target.scrollWidth - target.clientWidth - target.scrollLeft;
            let scrollFactor = target.scrollWidth / target.clientWidth;
            requestAnimationFrame(function(){
                if(scrollDiff < 3*(self.config.width / self.config.xWindow)){
                    self.dirty = true;
                    self.dataEvent.emit({
                        action: 'add_right',
                        lastId: [...self.data.values()].pop().id
                    });
                }
                if(scrollFactor > 5){
                    self.dirty = true;
                    self.dataEvent.emit({
                        action: 'remove_left'
                    })
                }
            });
        }
    }

    ngAfterViewChecked(){
        if(!this.inFlight && this.bufferCount){
            console.debug("Closing and emitting buffer...");
            this.closeBuffer.emit(true);
            this.dirty = false;
            this.bufferCount = 0;
        }
        
    }
    
    ownInit(){
        let count = 0;
        console.debug("chart master ngOnInit");
        //this.refreshed.emit(false);
        if(!this.config && this.input.config){
            this.config = this.input.config;
        }
        if(this.config && this.config.changeHandler){
            console.info("using provided change handler");
            this.change.subscribe(this.config.changeHandler);
        }else if (this.config && this.config.bufferedChangeHandler){
            console.info("using provided buffered change handler");
            this.change
                .do(o => {
                    //console.debug("buffer++");
                    if(o.element === this.chartSVG){
                        console.debug("SVG emit");
                        console.log(o);
                    }
                    this.bufferCount++;
                })
                .buffer(this.closeBuffer)
                .subscribe(this.config.bufferedChangeHandler);    
        }else{
            console.info("using default handler");
            this.change
                .do(o=>{
                    console.log(o);
                    this.output.emit(o);
                })
                .buffer(this.closeBuffer)
                .do(o =>{
                    this.bufferedOutput.emit(o);
                })
                .subscribe(this.refresh);
        }
        this.init = true;
        /*
        if(!this.firstChangeRun){
            this.ngOnChanges();
        }
        */
    }

    ngOnInit(){
        
        
    }
    refresh(changes:[{element:ElementRef, to:{}, data:{id:number}}]){
        //refresh the data
        console.debug("refreshing...");
        for(let ea of changes){
            for(let k in ea.to){
                ea.element.nativeElement.setAttribute(k,ea.to[k]);
            }
        }
        //this.refreshed.emit(false);
    }
}