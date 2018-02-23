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
let InfiniteChartSubComponent = class InfiniteChartSubComponent {
    constructor() {
        this.output = new core_1.EventEmitter();
    }
    ngOnChanges(changes) {
        let to = this.to;
        if (to) {
            this.output.emit({
                element: this.path,
                to: to
            });
        }
        this.output.emit({
            element: this.circle,
            to: {
                cx: (this.point[0]) * this.xScale,
                cy: -this.point[1] * this.yScale,
                r: 40
            }
        });
    }
    get to() {
        let subpaths = new Array();
        let left_x;
        if (this.point && this.leftPoint) {
            left_x = (this.leftPoint[0]) * this.xScale;
        }
        else {
            return null;
        }
        let x = (this.point[0]) * this.xScale;
        subpaths.push("M" + left_x + " " + -(this.leftPoint[1] * this.yScale));
        subpaths.push("L" + x + " " + -(this.point[1] * this.yScale));
        let to = {
            d: subpaths.join(" ")
        };
        return to;
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Array)
], InfiniteChartSubComponent.prototype, "point", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Array)
], InfiniteChartSubComponent.prototype, "leftPoint", void 0);
__decorate([
    core_1.Output(), 
    __metadata('design:type', Object)
], InfiniteChartSubComponent.prototype, "output", void 0);
__decorate([
    core_1.ViewChild("path_elem"), 
    __metadata('design:type', core_1.ElementRef)
], InfiniteChartSubComponent.prototype, "path", void 0);
__decorate([
    core_1.ViewChild("circle_elem"), 
    __metadata('design:type', core_1.ElementRef)
], InfiniteChartSubComponent.prototype, "circle", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Number)
], InfiniteChartSubComponent.prototype, "xScale", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Number)
], InfiniteChartSubComponent.prototype, "yScale", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Number)
], InfiniteChartSubComponent.prototype, "min_x", void 0);
InfiniteChartSubComponent = __decorate([
    core_1.Component({
        selector: 'g[infinite-sub]',
        template: require('./template/chart-sub.component.html')
    }), 
    __metadata('design:paramtypes', [])
], InfiniteChartSubComponent);
exports.InfiniteChartSubComponent = InfiniteChartSubComponent;
//# sourceMappingURL=chart-sub.component.js.map