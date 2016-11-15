"use strict";
var core_1 = require('@angular/core');
var InfiniteChartSubComponent = (function () {
    function InfiniteChartSubComponent() {
        this.output = new core_1.EventEmitter();
    }
    InfiniteChartSubComponent.prototype.ngOnChanges = function (changes) {
        this.output.emit({
            element: this.path,
            data: this.p
        });
    };
    InfiniteChartSubComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'g[infinite-sub]',
                    template: "\n            <svg:path #path_elem></svg:path>\n            <svg:foreignObject></svg:foreignObject>\n    "
                },] },
    ];
    /** @nocollapse */
    InfiniteChartSubComponent.ctorParameters = [];
    InfiniteChartSubComponent.propDecorators = {
        'p': [{ type: core_1.Input },],
        'output': [{ type: core_1.Output },],
        'path': [{ type: core_1.ViewChild, args: ["path_elem",] },],
    };
    return InfiniteChartSubComponent;
}());
exports.InfiniteChartSubComponent = InfiniteChartSubComponent;
//# sourceMappingURL=chart-sub.component.js.map