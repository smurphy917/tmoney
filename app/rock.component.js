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
var pathD_directive_1 = require('./pathD.directive');
var curve_function_1 = require('./curve.function');
var hill_component_1 = require('./hill.component');
var vertScale = 20;
var horizScale = 40;
var VERTICAL_BUFFER = 1;
var RockComponent = (function () {
    function RockComponent() {
        this.scaleX = horizScale;
        this.scaleY = vertScale;
        this.init = false;
        this.Math = Math;
        this.vertBuffer = VERTICAL_BUFFER;
    }
    RockComponent.prototype.ngOnChanges = function (changes) {
        if (!this.init) {
            this.draw();
            this.zeroPath = "M0 0 H" + (this.rock.timeSpan * this.scaleX);
        }
        if (!this.init) {
            this.draw();
            return;
        }
        if (changes.rock) {
            this.draw();
            return;
        }
        if (changes.rocks) {
            this.draw();
        }
    };
    RockComponent.prototype.draw = function () {
        var _this = this;
        //console.log("ratio: " + ((this.rock.baseHeight + this.rock.delta)/this.ceiling));
        var lMin = (hill_component_1.CURVE_POINTS - 1) / 2;
        var index = this.rocks.findIndex(function (r) { return r.id === _this.rock.id; });
        var localRocks = this.rocks.slice(index > lMin - 1 ? index - lMin : 0, index + lMin + 1);
        index = localRocks.findIndex(function (r) { return r.id === _this.rock.id; });
        var controlPts = curve_function_1.ControlPoints(localRocks);
        this.vbHeight = Math.max(this.rock.baseHeight, this.rock.baseHeight + this.rock.delta) - this.floor;
        this.stHeight = ((this.vbHeight - this.floor) / this.ceiling) * 180;
        if (this.rock.id === 5) {
            console.log("delta: " + this.rock.delta);
            console.log("base: " + this.rock.baseHeight);
            console.log("floor: " + this.floor);
            console.log("vbHeight: " + this.vbHeight);
        }
        console.log("height ratio: " + (this.vbHeight / this.stHeight));
        var scaledCtrlPts = {
            p1: [
                (1 / 3) * this.rock.timeSpan * this.scaleX,
                -controlPts[index].p1[1] * this.scaleY
            ],
            p2: [
                (2 / 3) * this.rock.timeSpan * this.scaleX,
                -controlPts[index].p2[1] * this.scaleY
            ]
        };
        var startY = -this.rock.baseHeight * this.scaleY;
        var maxY = -(this.rock.baseHeight * this.scaleY + this.rock.delta * this.scaleY);
        var maxX = this.rock.timeSpan * this.scaleX;
        var M = [0, startY];
        var C3 = [maxX, maxY];
        this.path = "M" + M.join(' ') + ' C' + scaledCtrlPts.p1.join(' ') + ', ' + scaledCtrlPts.p2.join(' ') + ', ' + C3.join(' ');
        this.init = true;
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
        __metadata('design:type', Array)
    ], RockComponent.prototype, "localRocks", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "floor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RockComponent.prototype, "ceiling", void 0);
    RockComponent = __decorate([
        core_1.Component({
            selector: 'rock',
            templateUrl: 'app/rock.component.html',
            styleUrls: ['app/rock.component.css'],
            directives: [pathD_directive_1.PathDDirective]
        }), 
        __metadata('design:paramtypes', [])
    ], RockComponent);
    return RockComponent;
}());
exports.RockComponent = RockComponent;
//# sourceMappingURL=rock.component.js.map