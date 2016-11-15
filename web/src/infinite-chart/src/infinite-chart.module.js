"use strict";
var core_1 = require('@angular/core');
var chart_component_1 = require('./chart.component');
var chart_sub_component_1 = require('./chart-sub.component');
var InfiniteChartModule = (function () {
    function InfiniteChartModule() {
    }
    InfiniteChartModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        chart_component_1.InfiniteChartComponent,
                        chart_sub_component_1.InfiniteChartSubComponent
                    ],
                    exports: [
                        chart_component_1.InfiniteChartComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    InfiniteChartModule.ctorParameters = [];
    return InfiniteChartModule;
}());
exports.InfiniteChartModule = InfiniteChartModule;
;
//# sourceMappingURL=infinite-chart.module.js.map