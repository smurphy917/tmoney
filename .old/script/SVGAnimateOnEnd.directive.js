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
var core_1 = require("@angular/core");
var SVGAnimateOnEnd = (function () {
    function SVGAnimateOnEnd(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    Object.defineProperty(SVGAnimateOnEnd.prototype, "onend_c", {
        set: function (onend_c) {
            this.renderer.listen(this.el.nativeElement, 'endEvent', onend_c);
        },
        enumerable: true,
        configurable: true
    });
    return SVGAnimateOnEnd;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function])
], SVGAnimateOnEnd.prototype, "onend_c", null);
SVGAnimateOnEnd = __decorate([
    core_1.Directive({
        selector: '(onend_c)'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" && _a || Object, typeof (_b = typeof core_1.Renderer !== "undefined" && core_1.Renderer) === "function" && _b || Object])
], SVGAnimateOnEnd);
exports.SVGAnimateOnEnd = SVGAnimateOnEnd;
var _a, _b;
//# sourceMappingURL=SVGAnimateOnEnd.directive.js.map