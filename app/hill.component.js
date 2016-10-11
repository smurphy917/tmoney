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
var rock_component_1 = require('./rock.component');
var rock_service_1 = require('./rock.service');
var rockEditor_component_1 = require('./rockEditor.component');
//import { RequirejsService } from './requirejs.service';
exports.CURVE_POINTS = 5;
var CONTAINER_HEIGHT = 200;
var HillComponent = (function () {
    function HillComponent(rockService) {
        this.rockService = rockService;
        this.JSON = JSON;
        this.selectedRockIndex = -1;
        this.rockAnimationIds = new Array();
        this.rockAnimations = new Array();
        this.rockAnimationElems = new Array();
    }
    Object.defineProperty(HillComponent.prototype, "ceiling", {
        get: function () {
            var base = this.rocks[0].baseHeight || 0, ceiling = base + this.rocks[0].delta, max = ceiling;
            Object.values(this.rocks).forEach(function (r) {
                ceiling = ceiling + r.delta;
                max = Math.max(max, ceiling);
            });
            return max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HillComponent.prototype, "floor", {
        get: function () {
            var floor = this.rocks[0].baseHeight || 0, minFloor = 0;
            Object.values(this.rocks).forEach(function (r) {
                floor = floor + r.delta;
                minFloor = Math.min(minFloor, floor);
            });
            return minFloor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HillComponent.prototype, "verticalBuffer", {
        get: function () {
            return 0.1 * (this.ceiling - this.floor);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HillComponent.prototype, "scale", {
        get: function () {
            return CONTAINER_HEIGHT / (this.ceiling - this.floor + 2 * this.verticalBuffer);
        },
        enumerable: true,
        configurable: true
    });
    HillComponent.prototype.redraw = function () {
    };
    HillComponent.prototype.animate = function () {
        //console.debug("Animation triggered");
        //console.debug("Elements:"); console.debug(this.rockAnimationElems);
        //console.debug("Animations:"); console.debug(this.rockAnimations);
        var Snap = require("snapsvg");
        var set = Snap(this.rockAnimationElems);
        set.animate(this.rockAnimations);
        this.rockAnimationElems = new Array();
        this.rockAnimations = new Array();
        this.rockAnimationIds = new Array();
        /*
        for (let a of this.rockAnimationElems){
            for (let b of a){
                set.push(b);
            }
        }
        let animations = [];
        for (let a of this.rockAnimations){
            for (let b of a){
                animations.push(b);
            }
        }
        console.log("elems / animations");
        console.log(animations);
        console.log(this.rockAnimationElems);
        set.animate(animations);
        */
    };
    HillComponent.prototype.animationTrigger = function (event) {
        //console.debug("Animation Trigger Fired: ");
        //console.debug(event);
        for (var _i = 0, _a = event.animationElements; _i < _a.length; _i++) {
            var elem = _a[_i];
            this.rockAnimationElems.push(elem);
        }
        for (var _b = 0, _c = event.animations; _b < _c.length; _b++) {
            var animation = _c[_b];
            this.rockAnimations.push(animation);
        }
        this.rockAnimationIds.push(event.rockId);
        if (this.rockAnimationIds.length === this.rocks.length) {
            this.animate();
        }
    };
    /*
    setFloor(){
        let floor = this.rocks[0].baseHeight || 0, minFloor = 0;
        this.rocks.forEach(function(r){
            floor = floor + r.delta;
            minFloor = Math.min(minFloor,floor);
        });
        this.floor = minFloor;
    }
    */
    HillComponent.prototype.localRocks = function (rocks, i) {
        var lMin = (exports.CURVE_POINTS - 1) / 2;
        /*
        let arr = new Array<Rock>();
        if(i > lMin - 1){
            for(let j = 0; j < CURVE_POINTS; j++){
                arrr =
            }
            arr = [rocks]
        }
        */
        return rocks.slice(i > lMin - 1 ? i - lMin : 0, i + lMin + 1);
    };
    HillComponent.prototype.copyRocks = function (rocks) {
        return rocks.slice();
    };
    HillComponent.prototype.selectRock = function (rock) {
        this.selectedRockIndex = this.rocks.findIndex(function (r) { return r.id === rock.id; });
    };
    HillComponent.prototype.ngOnInit = function () {
        //this.setFloor();
        var $ = require("jquery");
        $.fn.draggable = function () {
            var $this = this, ns = 'draggable_' + (Math.random() + '').replace('.', ''), mm = 'mousemove.' + ns, mu = 'mouseup.' + ns, $w = $(window), isFixed = ($this.css('position') === 'fixed'), adjX = 0, adjY = 0;
            $this.mousedown(function (ev) {
                var pos = $this.offset();
                if (isFixed) {
                    adjX = $w.scrollLeft();
                    adjY = $w.scrollTop();
                }
                var ox = (ev.pageX - pos.left), oy = (ev.pageY - pos.top);
                $this.data(ns, { x: ox, y: oy });
                $w.on(mm, function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (isFixed) {
                        adjX = $w.scrollLeft();
                        adjY = $w.scrollTop();
                    }
                    var offset = $this.data(ns);
                    $this.css({ left: ev.pageX - adjX - offset.x, top: ev.pageY - adjY - offset.y });
                });
                $w.on(mu, function () {
                    $w.off(mm + ' ' + mu).removeData(ns);
                });
            });
            $this.mouseup(function (ev) {
                var style = {}, top = parseInt($this.css('top'), 10), left = parseInt($this.css('left'), 10);
                if (left >= 0 || top > 0) {
                    if (left > 0)
                        style['left'] = 0;
                    if (top > 0)
                        style['top'] = 0;
                }
                else if (left !== top) {
                    if (left < top)
                        style['top'] = left;
                    else if (left > top)
                        style['left'] = top;
                }
                if (!$.isEmptyObject(style)) {
                    setTimeout(function () {
                        $this.animate(style, 100);
                    }, 100);
                }
            });
            return this;
        };
        require("jquery");
        $(".content").draggable();
        this.rocks = this.rockService.generateRocks(20);
    };
    HillComponent = __decorate([
        core_1.Component({
            selector: 'the-hill',
            templateUrl: 'app/hill.component.html',
            styleUrls: ['app/hill.component.css'],
            directives: [rock_component_1.RockComponent, rockEditor_component_1.RockEditorComponent]
        }), 
        __metadata('design:paramtypes', [rock_service_1.RockService])
    ], HillComponent);
    return HillComponent;
}());
exports.HillComponent = HillComponent;
//# sourceMappingURL=hill.component.js.map