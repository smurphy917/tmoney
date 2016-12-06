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
let Snap = require("snapsvg");
;
;
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
        this.output = new core_1.EventEmitter();
        this.bufferedOutput = new core_1.EventEmitter();
        this.change = new core_1.EventEmitter();
        this.subscribed = false;
        this.closeBuffer = new core_1.EventEmitter();
        this.data = new Map();
        this.counter = 0;
        this.init = false;
        this.inFlight = false;
        this.max_y = 0;
        this.min_y = 0;
        this.min_x = 0;
        this.max_x = 0;
        this.firstChangeRun = false;
        this.pointsShown = 40;
        this.verticalBuffer = 0.1;
        this.bufferCount = 0;
        this.verticalGuides = new Array();
        this.dirty = false;
        this.xScale = 0;
        this.dataEvent = new core_1.EventEmitter();
    }
    ngOnChanges(changes) {
        if (!this.init) {
            this.ownInit();
        }
        console.debug("chart component ngOnChanges");
        this.inFlight = true;
        if (this && this.init) {
            Promise.resolve(this.input.data)
                .then(data => {
                console.debug("ngOnChanges promise then started");
                console.log(data);
                let newData = new Map([...data.entries()].sort((a, b) => a[1].point.x.valueOf() - b[1].point.x.valueOf()));
                [...newData.values()].forEach((d, i, arr) => this.buildPointData(d, i, arr));
                console.log({
                    min_x: this.min_x,
                    max_x: this.max_x,
                    min_y: this.min_y,
                    max_y: this.max_y
                });
                for (let d of newData) {
                    this.data.set(d[0], d[1]);
                }
                //this.data = new Map<number,InfiniteDataElement>([...this.data,...newData]);
                this.setXScale();
                this.change.emit({
                    element: this.chartSVG,
                    data: {
                        id: -101
                    },
                    to: {
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
    get dataArray() {
        return new Array(...this.data.values());
    }
    identify(i, ea) {
        return ea.id;
    }
    get canvasWidth() {
        let ratio = this.config.width / this.config.xWindow;
        return ratio * this.data.size;
    }
    setGuides() {
        console.info("setting guides...");
        let numOfVerticalGuides = 5;
        if (!this.guideSpacing) {
            this.guideSpacing = (Math.round(this.config.xWindow / (numOfVerticalGuides + 1)) * ((this.max_x - this.min_x) / (this.data.size - 1)));
            this.guideXPos = this.min_x + this.guideSpacing;
        }
        while (this.guideXPos < this.max_x) {
            this.verticalGuides.push({
                xPos: this.guideXPos
            });
            this.guideXPos += this.guideSpacing;
        }
        console.info("guides set...");
        console.log(this.verticalGuides);
    }
    getGuideD(g) {
        return ["M" + (g.xPos - this.min_x) * this.xScale + " " + -(this.min_y - this.verticalBuffer * (this.max_y - this.min_y)), "V-" + (1 + 2 * this.verticalBuffer) * (this.max_y - this.min_y)].join(' ');
    }
    buildPointData(data, i, allData) {
        if (i === 0) {
        }
        else {
            data.point.left_x = allData[i - 1].point.x;
            data.point.left_y = allData[i - 1].point.y;
        }
        if (!data.point.hasOwnProperty("y") && data.point.hasOwnProperty("dy")) {
            data.point.y = data.point.left_y + data.point.dy;
        }
        if (i === 0) {
            this.max_y = data.point.y;
            this.min_y = data.point.y;
            this.max_x = data.point.x.valueOf();
            this.min_x = data.point.x.valueOf();
        }
        else {
            this.max_y = data.point.y > this.max_y ? data.point.y : this.max_y;
            this.min_y = data.point.y < this.min_y ? data.point.y : this.min_y;
        }
        if (i === allData.length - 1) {
            this.max_x = data.point.x.valueOf();
        }
    }
    setXScale() {
        let yHeight = (this.max_y - this.min_y) * (1 + (2 * this.verticalBuffer));
        let xRange = this.max_x - this.min_x;
        let ratio = this.config.width / this.config.height;
        let scaledWidth = ratio * yHeight;
        let rawXScale = scaledWidth / this.config.xWindow;
        let rangeUnit = xRange / (this.data.size - 1);
        let xScale = rawXScale / rangeUnit;
        console.debug("xScale: " + xScale);
        if (xScale < 0) {
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
    handleScroll(event) {
        let self = this;
        if (!self.dirty) {
            let target = event.target;
            let scrollDiff = target.scrollWidth - target.clientWidth - target.scrollLeft;
            let scrollFactor = target.scrollWidth / target.clientWidth;
            requestAnimationFrame(function () {
                if (scrollDiff < 3 * (self.config.width / self.config.xWindow)) {
                    self.dirty = true;
                    self.dataEvent.emit({
                        action: 'add_right',
                        lastId: [...self.data.values()].pop().id
                    });
                }
                if (scrollFactor > 5) {
                    self.dirty = true;
                    self.dataEvent.emit({
                        action: 'remove_left'
                    });
                }
            });
        }
    }
    ngAfterViewChecked() {
        if (!this.inFlight && this.bufferCount) {
            console.debug("Closing and emitting buffer...");
            this.closeBuffer.emit(true);
            this.dirty = false;
            this.bufferCount = 0;
        }
    }
    ownInit() {
        let count = 0;
        console.debug("chart master ngOnInit");
        //this.refreshed.emit(false);
        if (!this.config && this.input.config) {
            this.config = this.input.config;
        }
        if (this.config && this.config.changeHandler) {
            console.info("using provided change handler");
            this.change.subscribe(this.config.changeHandler);
        }
        else if (this.config && this.config.bufferedChangeHandler) {
            console.info("using provided buffered change handler");
            this.change
                .do(o => {
                //console.debug("buffer++");
                if (o.element === this.chartSVG) {
                    console.debug("SVG emit");
                    console.log(o);
                }
                this.bufferCount++;
            })
                .buffer(this.closeBuffer)
                .subscribe(this.config.bufferedChangeHandler);
        }
        else {
            console.info("using default handler");
            this.change
                .do(o => {
                console.log(o);
                this.output.emit(o);
            })
                .buffer(this.closeBuffer)
                .do(o => {
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
    ngOnInit() {
    }
    refresh(changes) {
        //refresh the data
        console.debug("refreshing...");
        for (let ea of changes) {
            for (let k in ea.to) {
                ea.element.nativeElement.setAttribute(k, ea.to[k]);
            }
        }
        //this.refreshed.emit(false);
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Object)
], InfiniteChartComponent.prototype, "input", void 0);
__decorate([
    core_1.ViewChild("infiniteChartSVG"), 
    __metadata('design:type', core_1.ElementRef)
], InfiniteChartComponent.prototype, "chartSVG", void 0);
__decorate([
    core_1.Output(), 
    __metadata('design:type', Object)
], InfiniteChartComponent.prototype, "output", void 0);
__decorate([
    core_1.Output(), 
    __metadata('design:type', Object)
], InfiniteChartComponent.prototype, "bufferedOutput", void 0);
__decorate([
    core_1.Output(), 
    __metadata('design:type', Object)
], InfiniteChartComponent.prototype, "dataEvent", void 0);
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