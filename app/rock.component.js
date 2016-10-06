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
var core_1 = require('@angular/core');
var rock_1 = require('./rock');
var SVGAnimateOnEnd_directive_1 = require('./SVGAnimateOnEnd.directive');
var curve_function_1 = require('./curve.function');
var hill_component_1 = require('./hill.component');
var vertScale = 20;
var horizScale = 40;
var animationTimeMs = 300;
var RockComponent = (function () {
    function RockComponent() {
        this.path = "M0 0 H40";
        this.scaleX = horizScale;
        this.init = false;
        this.Math = Math;
    }
    Object.defineProperty(RockComponent.prototype, "zeroPath", {
        get: function () {
            return "M0 0 H" + (this.rock.timeSpan * this.scaleX);
        },
        enumerable: true,
        configurable: true
    });
    RockComponent.prototype.endAnimation = function () {
        //replace the path with newPath and kill the <animate> element.s
        //this._path = this.animateToPath;
        this.path = this.animateToPath;
        this.animateToPath = "";
    };
    Object.defineProperty(RockComponent.prototype, "canvasHeight", {
        get: function () {
            return (2 * this.verticalBuffer) + Math.max(this.rock.baseHeight, this.rock.baseHeight + this.rock.delta) - this.floor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RockComponent.prototype, "canvasOrigin", {
        get: function () {
            return -(this.verticalBuffer + Math.max(this.rock.baseHeight, this.rock.baseHeight + this.rock.delta));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RockComponent.prototype, "height", {
        get: function () {
            return this.canvasHeight * this.scale;
        },
        enumerable: true,
        configurable: true
    });
    RockComponent.prototype.draw = function () {
        var _this = this;
        var Snap = require('snapsvg');
        var lMin = (hill_component_1.CURVE_POINTS - 1) / 2;
        var index = this.rocks.findIndex(function (r) { return r.id === _this.rock.id; });
        var localRocks = this.rocks.slice(index > lMin - 1 ? index - lMin : 0, index + lMin + 1);
        index = localRocks.findIndex(function (r) { return r.id === _this.rock.id; });
        var controlPts = curve_function_1.ControlPoints(localRocks);
        var scaledCtrlPts = {
            p1: [
                (1 / 3) * this.rock.timeSpan * this.scaleX,
                -controlPts[index].p1[1]
            ],
            p2: [
                (2 / 3) * this.rock.timeSpan * this.scaleX,
                -controlPts[index].p2[1]
            ]
        };
        var startY = -this.rock.baseHeight;
        var maxY = -(this.rock.baseHeight + this.rock.delta);
        var maxX = this.rock.timeSpan * this.scaleX;
        var M = [0, startY];
        var C3 = [maxX, maxY];
        var newPath = "M" + M.join(' ') + ' C' + scaledCtrlPts.p1.join(' ') + ', ' + scaledCtrlPts.p2.join(' ') + ', ' + C3.join(' ');
        var self = this;
        Snap(this.pathElem.nativeElement).animate({
            d: newPath
        }, animationTimeMs, mina.easeout, function () {
            self.path = newPath;
        });
    };
    RockComponent.prototype.ngOnChanges = function () {
        this.draw();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', rock_1.Rock)
    ], RockComponent.prototype, "rock", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RockComponent.prototype, "rocks", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "floor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "scale", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "ceiling", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "verticalBuffer", void 0);
    __decorate([
        core_1.ViewChild("rockPath"), 
        __metadata('design:type', core_1.ElementRef)
    ], RockComponent.prototype, "pathElem", void 0);
    RockComponent = __decorate([
        core_1.Component({
            selector: 'rock',
            templateUrl: 'app/rock.component.html',
            styleUrls: ['app/rock.component.css'],
            directives: [SVGAnimateOnEnd_directive_1.SVGAnimateOnEnd]
        }), 
        __metadata('design:paramtypes', [])
    ], RockComponent);
    return RockComponent;
}());
exports.RockComponent = RockComponent;
//# sourceMappingURL=rock.component.js.map