import { Component, Input } from '@angular/core';
import { InfiniteChartSubComponent } from './chart-sub.component';
;
;
export var InfiniteChartConfig = (function () {
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
        this.changeHandler = changeHandler;
    }
    ;
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
export var InfiniteChartComponent = (function () {
    function InfiniteChartComponent() {
        this.subscribed = false;
    }
    InfiniteChartComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        Promise.resolve(this.input.data)
            .then(function (data) {
            _this.data = data;
        });
    };
    InfiniteChartComponent.prototype.ngOnInit = function () {
        if (this.config.changeHandler) {
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
        { type: Component, args: [{
                    selector: 'infinite-chart',
                    templateUrl: './chart.component.html',
                    entryComponents: [InfiniteChartSubComponent]
                },] },
    ];
    /** @nocollapse */
    InfiniteChartComponent.ctorParameters = [];
    InfiniteChartComponent.propDecorators = {
        'input': [{ type: Input },],
    };
    return InfiniteChartComponent;
}());
//# sourceMappingURL=chart.component.js.map