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
var rock_1 = require('./rock');
var SVGAnimateOnEnd_directive_1 = require('./SVGAnimateOnEnd.directive');
var curve_function_1 = require('./curve.function');
var hill_component_1 = require('./hill.component');
var vertScale = 20;
var horizScale = 40;
var animationTimeMs = 200;
var RockComponent = (function () {
    function RockComponent() {
        this.animationTrigger = new core_1.EventEmitter();
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
    /*
    get canvasHeight():number{
        return (2 * this.verticalBuffer) + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta) - this.floor;
    }

    get canvasOrigin():number{
        return -(this.verticalBuffer + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta));
    }

    get height():number{
        return this.canvasHeight * this.scale;
    }
    */
    RockComponent.prototype.draw = function () {
        var _this = this;
        //console.debug("Drawing rock: " + this.rock.id);
        var Snap = require('snapsvg');
        var mina = Snap.mina || function () { };
        console.debug("Rock (" + this.rock.id + ") delta: " + this.rock.delta);
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
        var newCanvasHeight = (2 * this.verticalBuffer + this.ceiling - this.floor); //(2 * this.verticalBuffer) + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta) - this.floor;
        var newCanvasOrigin = -(this.verticalBuffer + this.ceiling); //-(this.verticalBuffer + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta));
        var newHeight = newCanvasHeight * this.scale;
        console.debug("Rock: " + this.rock.id);
        console.debug("\tInputs (buffer/baseHeight/delta/floor): " + [this.verticalBuffer, this.rock.baseHeight, this.rock.delta, this.floor].join(" / "));
        console.debug("\tNew origin: " + newCanvasOrigin);
        console.debug("\tNew height: " + newCanvasHeight);
        var self = this;
        if (!this.snapPath) {
            this.snapPath = Snap(this.pathElem.nativeElement);
        }
        if (!this.snapSVG) {
            this.snapSVG = Snap(this.svgElem.nativeElement);
        }
        var animationElements = [
            this.snapPath,
            this.snapSVG
        ];
        var animations = [[
                { d: newPath },
                animationTimeMs,
                mina.easeout,
                function () {
                    self.path = newPath;
                }
            ], [
                {
                    viewBox: '0 ' + newCanvasOrigin + ' ' + self.rock.timeSpan * self.scaleX + ' ' + newCanvasHeight,
                    height: newHeight
                },
                animationTimeMs,
                mina.easeout,
                function () {
                    self.canvasHeight = newCanvasHeight;
                    self.canvasOrigin = newCanvasOrigin;
                    self.height = newHeight;
                }
            ]];
        this.animationTrigger.emit({
            rockId: self.rock.id,
            animationElements: animationElements,
            animations: animations
        });
    };
    RockComponent.prototype.ngOnChanges = function () {
        this.draw();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', rock_1.Rock)
    ], RockComponent.prototype, "rock");
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RockComponent.prototype, "rocks");
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "floor");
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "scale");
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "ceiling");
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "verticalBuffer");
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RockComponent.prototype, "animationTrigger");
    __decorate([
        core_1.ViewChild("rockPath"), 
        __metadata('design:type', core_1.ElementRef)
    ], RockComponent.prototype, "pathElem");
    __decorate([
        core_1.ViewChild("rockSVG"), 
        __metadata('design:type', core_1.ElementRef)
    ], RockComponent.prototype, "svgElem");
    RockComponent = __decorate([
        core_1.Component({
            selector: 'rock',
            templateUrl: 'app/template/rock.component.html',
            styleUrls: ['app/style/rock.component.css'],
            directives: [SVGAnimateOnEnd_directive_1.SVGAnimateOnEnd]
        }), 
        __metadata('design:paramtypes', [])
    ], RockComponent);
    return RockComponent;
})();
exports.RockComponent = RockComponent;
//# sourceMappingURL=rock.component.js.map