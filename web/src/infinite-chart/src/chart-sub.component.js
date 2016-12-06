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
                data: this.p,
                to: to
            });
        }
        this.output.emit({
            element: this.point,
            data: this.p,
            to: {
                cx: (this.p.point.x.valueOf() - this.min_x) * this.minorScale,
                cy: -this.p.point.y,
                r: 80
            }
        });
    }
    get to() {
        let subpaths = new Array();
        let left_x;
        if (this.p.point && this.p.point.left_x) {
            left_x = (this.p.point.left_x.valueOf() - this.min_x) * this.minorScale;
        }
        else {
            return null;
        }
        let x = (this.p.point.x.valueOf() - this.min_x) * this.minorScale;
        subpaths.push("M" + left_x + " " + -this.p.point.left_y);
        subpaths.push("L" + x + " " + -this.p.point.y);
        let to = {
            d: subpaths.join(" ")
        };
        return to;
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Object)
], InfiniteChartSubComponent.prototype, "p", void 0);
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
], InfiniteChartSubComponent.prototype, "point", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Number)
], InfiniteChartSubComponent.prototype, "minorScale", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Number)
], InfiniteChartSubComponent.prototype, "min_x", void 0);
InfiniteChartSubComponent = __decorate([
    core_1.Component({
        selector: 'g[infinite-sub]',
        template: `
            <svg:path #path_elem stroke="black" stroke-width="50" fill="transparent" [attr.id]="'path_' + p.id"></svg:path>
            <svg:circle #circle_elem [attr.id]="'circle_' + p.id"></svg:circle>
            <svg:foreignObject></svg:foreignObject>
    `
    }), 
    __metadata('design:paramtypes', [])
], InfiniteChartSubComponent);
exports.InfiniteChartSubComponent = InfiniteChartSubComponent;
//# sourceMappingURL=chart-sub.component.js.map