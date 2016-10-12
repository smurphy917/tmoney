var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
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
    Object.defineProperty(SVGAnimateOnEnd.prototype, "onend_c",
        __decorate([
            core_1.Input(), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', [Function])
        ], SVGAnimateOnEnd.prototype, "onend_c", Object.getOwnPropertyDescriptor(SVGAnimateOnEnd.prototype, "onend_c")));
    SVGAnimateOnEnd = __decorate([
        core_1.Directive({
            selector: '(onend_c)'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object, (typeof (_b = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _b) || Object])
    ], SVGAnimateOnEnd);
    return SVGAnimateOnEnd;
    var _a, _b;
})();
exports.SVGAnimateOnEnd = SVGAnimateOnEnd;
//# sourceMappingURL=SVGAnimateOnEnd.directive.js.map