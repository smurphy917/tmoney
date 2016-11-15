"use strict";
var core_1 = require('@angular/core');
var chart_sub_component_1 = require('./chart-sub.component');
;
;
var InfiniteChartConfig = (function () {
    function InfiniteChartConfig(
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
         * Property change: Observable<{element:ElementRef,to:{}}>
         *      An Observable that emits on any changes to chart elements
         *      Can be subscribed to for animations, etc.
         */
        xScale, 
        /**
         * Property yScale:
         */
        yScale, 
        /**
         * Constructor
         */
        changeHandler) {
        this.displayType = displayType;
        this.curveType = curveType;
        this.xScale = xScale;
        this.yScale = yScale;
        this.changeHandler = changeHandler;
    }
    InfiniteChartConfig.from = function (obj) {
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
    };
    return InfiniteChartConfig;
}());
exports.InfiniteChartConfig = InfiniteChartConfig;
var InfiniteChartComponent = (function () {
    function InfiniteChartComponent() {
        this.change = new core_1.EventEmitter();
        this.subscribed = false;
        this.refreshed = new core_1.EventEmitter();
        this.data = new Array();
    }
    InfiniteChartComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        Promise.resolve(this.input.data)
            .then(function (data) {
            _this.data = data;
        });
    };
    InfiniteChartComponent.prototype.ngOnInit = function () {
        if (this.config && this.config.changeHandler) {
            this.change.subscribe(this.config.changeHandler);
        }
        else {
            this.change
                .buffer(this.refreshed)
                .subscribe(this.refresh);
        }
    };
    InfiniteChartComponent.prototype.refresh = function (changes) {
        //refresh the data
        console.log("refreshing");
        this.refreshed.emit(true);
    };
    InfiniteChartComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'infinite-chart',
                    template: "\n    <div xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n        <svg xmlns:svg=\"http://www.w3.org/2000/svg\">\n            <!--template ngFor let-datum [ngForOf]=\"data\"></:template-->\n            <!--g infinite-sub *ngFor=\"let datum of data;\" [p]=\"datum\" (output)=\"change.emit($event)\"></g-->\n            <g infinite-sub></g>\n        </svg>\n    </div>\n    ",
                    entryComponents: [chart_sub_component_1.InfiniteChartSubComponent]
                },] },
    ];
    /** @nocollapse */
    InfiniteChartComponent.ctorParameters = [];
    InfiniteChartComponent.propDecorators = {
        'input': [{ type: core_1.Input },],
    };
    return InfiniteChartComponent;
}());
exports.InfiniteChartComponent = InfiniteChartComponent;
//# sourceMappingURL=chart.component.js.map