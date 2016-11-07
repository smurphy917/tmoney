import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { RockComponent } from './rock.component'
import { Rock } from './rock.definition';
import { ROCKS } from './rocks'
import { RockService } from './rock.service';
import { RockEditorComponent } from './rockEditor.component';

let Snap = require("snapsvg")

export const CURVE_POINTS = 5;
const CONTAINER_HEIGHT = 200;

@Component({
    selector: 'the-hill',
    templateUrl: 'template/hill.component.html',
    styleUrls: ['style/hill.component.css'],
    entryComponents: [RockComponent, RockEditorComponent]
})

export class HillComponent implements OnInit{

    constructor(private rockService:RockService){}

    JSON = JSON;
    rocks: Rock[];// = ROCKS;
    selectedRockIndex: number = -1;
    height: number;
    rockAnimationIds:number[] = new Array<number>();
    rockAnimations:any[] = new Array<any>();
    rockAnimationElems:Element[] = new Array<Element>();

    get ceiling(){
        let base:number = this.rocks[0].baseHeight || 0,
            ceiling:number = base + this.rocks[0].delta,
            max:number = ceiling;
        Object.values(this.rocks).forEach(function(r){
            ceiling = ceiling + r.delta;
            max = Math.max(max,ceiling);
        });
        return max;
    }
    
    get floor(){
        let floor = this.rocks[0].baseHeight || 0, minFloor = 0;
        Object.values(this.rocks).forEach(function(r){
            floor = floor + r.delta;
            minFloor = Math.min(minFloor,floor);
        });
        return minFloor;
    }

    get verticalBuffer():number{
        return 0.1 * (this.ceiling - this.floor);
    }

    get scale():number{
        return CONTAINER_HEIGHT / (this.ceiling - this.floor + 2 * this.verticalBuffer);
    }

    redraw(){
        
    }
    
    animate(){
        //console.debug("Animation triggered");
        //console.debug("Elements:"); console.debug(this.rockAnimationElems);
        //console.debug("Animations:"); console.debug(this.rockAnimations);
        //let Snap = require("snapsvg");
        let set = Snap(this.rockAnimationElems);
        set.animate(this.rockAnimations);
        this.rockAnimationElems = new Array<Element>();
        this.rockAnimations = new Array<any>();
        this.rockAnimationIds = new Array<number>();
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
    }

    animationTrigger(event:any){
        //console.debug("Animation Trigger Fired: ");
        //console.debug(event);
        for(let elem of event.animationElements){
            this.rockAnimationElems.push(elem);
        }
        for(let animation of event.animations){
            this.rockAnimations.push(animation);
        }
        this.rockAnimationIds.push(event.rockId);
        if (this.rockAnimationIds.length === this.rocks.length){ //2 events per rock
            this.animate();
        }
    }

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
    localRocks(rocks:Rock[],i:number){
        let lMin = (CURVE_POINTS - 1)/2
        /*
        let arr = new Array<Rock>();
        if(i > lMin - 1){
            for(let j = 0; j < CURVE_POINTS; j++){
                arrr = 
            }
            arr = [rocks]
        }
        */
        return rocks.slice(i > lMin -1 ? i - lMin : 0, i + lMin + 1);
    }

    copyRocks(rocks:Rock[]){
        return rocks.slice();
    }

    selectRock(rock: Rock){
        this.selectedRockIndex = this.rocks.findIndex(r => r.id === rock.id);
    }

    ngOnInit(){

        //this.setFloor();
        
        var $ = require("jquery");
        /*
        $.fn.draggable = function(){
            var $this = this,
            ns = 'draggable_'+(Math.random()+'').replace('.',''),
            mm = 'mousemove.'+ns,
            mu = 'mouseup.'+ns,
            $w = $(window),
            isFixed = ($this.css('position') === 'fixed'),
            adjX = 0, adjY = 0;

            $this.mousedown(function(ev){
                var pos = $this.offset();
                if (isFixed) {
                    adjX = $w.scrollLeft(); adjY = $w.scrollTop();
                }
                var ox = (ev.pageX - pos.left), oy = (ev.pageY - pos.top);
                $this.data(ns,{ x : ox, y: oy });
                $w.on(mm, function(ev){
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (isFixed) {
                        adjX = $w.scrollLeft(); adjY = $w.scrollTop();
                    }
                    var offset = $this.data(ns);
                    $this.css({left: ev.pageX - adjX - offset.x, top: ev.pageY - adjY - offset.y});
                });
                $w.on(mu, function(){
                    $w.off(mm + ' ' + mu).removeData(ns);
                });
            });

            $this.mouseup(function(ev){
                var style = {}, top = parseInt($this.css('top'),10), left = parseInt($this.css('left'),10);
                if(left >= 0 || top > 0){
                    if(left > 0)
                        style['left'] = 0;
                    if(top > 0)
                        style['top'] = 0;
                }else if(left !== top){
                    if(left < top)
                        style['top'] = left;
                    else if(left > top)
                        style['left'] = top;
                }
                if(!$.isEmptyObject(style)){
                    setTimeout(function(){
                        $this.animate(style,100);
                    },100)
                }
            });

            return this;
        };

        require("jquery");
        $(".content").draggable();
        */
        this.rocks = this.rockService.generateRocks(20);
    }
}