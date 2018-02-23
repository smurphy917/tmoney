"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const infinite_chart_config_1 = require('./infinite-chart.config');
let Snap = require("snapsvg");
;
class DataPoint {
}
exports.DataPoint = DataPoint;
/*
export interface InfiniteDataElement{
    id: number,
    point: InfinitePoint,
    componentData: any
}
*/
/*
export interface InfiniteChart{
    config:InfiniteChartConfig;
    change:Observable<{element:ElementRef,to:{}}>;
    //dataStream:Observable<{id:number, point:InfinitePoint, componentData:any}>
    refresh(changes:{}[]):void;
}
*/
/*
export interface ChartConfig {
    changeHandler?:Subscriber<{element:ElementRef,to:{}}> | null;
}
*/
class InfiniteChartConfig {
    /**
     * Constructor
     */
    constructor(
        /**
         * Property displayType: 'vertical' | 'horizontal'
         *      Determines vertical infinite scrolling (y direction)
         *       or horizontal infinite scrolling (x direction)
         */
        displayType, 
        /**
         * Property curveType: 'bezier' | 'linear' | 'scatter'
         *      Determines how the curve is to be drawn:
         *          bezier: using bezier control points to smoothly
         *              connect points
         *          linear: connect points with straight lines
         *          scatter: do not connect points at all
         */
        curveType, 
        /**
         * Property xScale:number
         *      Pixels per unit in X direction
         */
        xScale, 
        /**
         * Property yScale:
         */
        yScale, 
        /**
         * Property changeHandler: Subscriber<{element:ElementRef,to:{}}>
         *      A Subscriber that receives changes to chart elements
         *      Can be used to provide animations, etc.
         *      If not provided, a default aniimation will be used (Snapsvg).
         */
        changeHandler, 
        /**
         * Property bufferedChangeHandler: Subscriber<{element:ElementRef,to:{}}[]>
         *      A Subscriber that receives buffered changes to chart elements
         *      Can be used to provide animations, etc.
         *      If not provided, a default aniimation will be used (Snapsvg).
         */
        bufferedChangeHandler, 
        /**
         * Property canvasWidth:number
         *      Defines the size of the canvas in scaled (xScale) units
         */
        canvasWidth, xWindow, width, height) {
        this.displayType = displayType;
        this.curveType = curveType;
        this.xScale = xScale;
        this.yScale = yScale;
        this.changeHandler = changeHandler;
        this.bufferedChangeHandler = bufferedChangeHandler;
        this.canvasWidth = canvasWidth;
        this.xWindow = xWindow;
        this.width = width;
        this.height = height;
    }
    static from(obj) {
        if (!obj) {
            return new this('horizontal', 'linear', 10);
        }
        else if (obj.displayType === 'horizontal') {
            if (!obj.xScale) {
                throw new TypeError("xScale property is required for horizontal display type");
            }
            else if (obj.yScale) {
                console.warn("yScale is ignored for horizontal display type");
            }
            return new this(obj.displayType, obj.curveType, obj.xScale, -1, obj.changeHandler ? obj.changeHandler : null);
        }
        else if (obj.displayType === 'vertical') {
            if (!obj.yScale) {
                throw new TypeError("yScale property is required for vertical display type");
            }
            else if (obj.xScale) {
                console.warn("xScale is ignored for vertical display type");
            }
            return new this(obj.displayType, obj.curveType, -1, obj.yScale, obj.changeHandler ? obj.changeHandler : null);
        }
    }
}
exports.InfiniteChartConfig = InfiniteChartConfig;
let InfiniteChartComponent = class InfiniteChartComponent {
    constructor() {
        this.Array = Array;
        this.data = new Map();
        /*
        @ViewChild("infiniteChartSVG")
        chartSVG: ElementRef;
        */
        this.dataRequest = new core_1.EventEmitter();
        /*
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
        */
        this.xScale = 0;
        this.yScale = 0;
        this.max = 0;
        this.min = 0;
        this.viewWidth = 2 * infinite_chart_config_1.CONFIG.canvasDimensions.view_major;
        this.canvasWidth = 2 * infinite_chart_config_1.CONFIG.canvasDimensions.base_major;
        this.dimensions = infinite_chart_config_1.CONFIG.canvasDimensions;
        /*
        @Output()
        dataEvent = new EventEmitter<{}>();
        */
        this.childChange = new core_1.EventEmitter();
    }
    ngOnChanges() {
        /**
         * Need to determine x scale. We will use a fixed canvas size, but need to know how many points-per.
         */
        let pointsInView = infinite_chart_config_1.CONFIG.canvasConfig.view_points;
        //this.inputData.then(d => {
        //console.debug("inputData:");
        //console.log(this.inputData);
        //console.log(this.inputData.length);
        let inputData = this.translate(this.inputData);
        //onsole.log(inputData);
        let count = 0, start, end, min = 0, max;
        for (let [x, y] of inputData.entries()) {
            if (count === 0) {
                start = x;
                max = y;
            }
            else {
                if (count < pointsInView)
                    end = x;
                max = (y > max ? y : max);
            }
            min = (y < min ? y : min);
            count++;
        }
        let dataRange = end - start;
        if (count < pointsInView) {
            dataRange *= pointsInView / count;
        }
        this.xScale = infinite_chart_config_1.CONFIG.canvasDimensions.base_major / dataRange;
        this.yScale = infinite_chart_config_1.CONFIG.canvasDimensions.base_minor / (max - min);
        this.min = min;
        this.max = max;
        //console.debug("xScale: " + this.xScale + "; yScale: " + this.yScale);
        this.data = inputData;
        //});
        /*
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
                    console.debug("newData: ");
                    console.log(newData);
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
        */
    }
    /*
    get dataArray(){
        return new Array(...this.data.values());
    }
    */
    identify(i, ea) {
        return ea[0];
    }
    /*
    get canvasWidth(){
        let ratio = this.config.width / this.config.xWindow;
        return ratio * this.data.size;
    }
    */
    /*
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
    */
    /*
    getGuideD(g:{xPos:number}){
        return ["M" + (g.xPos - this.min_x)*this.xScale + " " + -(this.min_y - this.verticalBuffer*(this.max_y - this.min_y)), "V-" + (1+2*this.verticalBuffer) * (this.max_y - this.min_y)].join(' ');
    }
    */
    /*
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
    */
    /*
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
    */
    handleScroll(event) {
        //console.debug("handleScroll");
        let self = this;
        //if(!self.dirty){
        let target = event.target;
        let scrollDiff = target.scrollWidth - target.clientWidth - target.scrollLeft;
        let scrollFactor = target.scrollWidth / target.clientWidth;
        //console.debug("scrollDiff: " + scrollDiff + "; scrollFactor: " + scrollFactor);
        //console.debug("scrollWidth: " + target.scrollWidth);
        //console.debug("clientWidth: " + target.clientWidth);
        requestAnimationFrame(function () {
            if (scrollDiff < 0.2 * target.clientWidth) {
                self.dataRequest.emit({
                    action: 'add_right',
                    context: {
                        last_item: self.inputData[self.inputData.length - 1]
                    }
                });
            }
            if (scrollFactor > 5) {
                self.dataRequest.emit({
                    action: 'remove_left'
                });
            }
        });
        //}
    }
    /*
    ngAfterViewChecked(){
        if(!this.inFlight && this.bufferCount){
            console.debug("Closing and emitting buffer...");
            this.closeBuffer.emit(true);
            this.dirty = false;
            this.bufferCount = 0;
        }
        
    }
    */
    ngOnInit() {
        //console.debug("chart init");
        this.childChange
            .subscribe((change) => {
            for (let k in change.to) {
                change.element.nativeElement.setAttribute(k, change.to[k]);
            }
        });
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Array)
], InfiniteChartComponent.prototype, "inputData", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Function)
], InfiniteChartComponent.prototype, "translate", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', InfiniteChartConfig)
], InfiniteChartComponent.prototype, "config", void 0);
__decorate([
    core_1.Output(), 
    __metadata('design:type', Object)
], InfiniteChartComponent.prototype, "dataRequest", void 0);
InfiniteChartComponent = __decorate([
    core_1.Component({
        selector: 'infinite-chart',
        template: require("./template/chart.component.html"),
        styles: [require("./style/chart.component.css")]
    }), 
    __metadata('design:paramtypes', [])
], InfiniteChartComponent);
exports.InfiniteChartComponent = InfiniteChartComponent;
//# sourceMappingURL=chart.component.js.map