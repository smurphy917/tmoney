import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { DomSanitizationService } from '@angular/platform-browser';
import { RockComponent } from './rock.component'
import { Rock } from './rock';
import { ROCKS } from './rocks'
//import { RequirejsService } from './requirejs.service';

export const CURVE_POINTS = 5;
const CONTAINER_HEIGHT = 180;

@Component({
    selector: 'the-hill',
    templateUrl: 'app/hill.component.html',
    styleUrls: ['app/hill.component.css'],
    directives: [RockComponent]
})

export class HillComponent implements OnInit{

    //constructor(private requirejs: RequirejsService){}
    JSON = JSON;
    rocks: Rock[] = ROCKS;
    selectedRockIndex: number = -1;
    height: number;

    get ceiling(){
        let base = this.rocks[0].baseHeight || 0,
        ceiling = base + this.rocks[0].delta,
        max = ceiling;
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
        return CONTAINER_HEIGHT / (this.ceiling - this.floor);
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
        
    }
}