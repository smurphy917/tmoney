import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';
import { RockComponent } from './rock.component'
import { Rock } from './rock.definition';
import { ROCKS } from './rocks'
import { RockService } from './rock.service';
import { RockEditorComponent } from './rockEditor.component';
import { Observable, Subscriber } from 'rxjs';

import { InfiniteChartInput, InfiniteDataElement } from './infinite-chart';

let Snap = require("snapsvg");
let mina = Snap.mina;

export const CURVE_POINTS = 5;
const CONTAINER_HEIGHT = 200;

@Component({
    selector: 'the-hill',
    templateUrl: 'template/hill.component.html',
    styleUrls: ['style/hill.component.css']
})
export class HillComponent implements OnInit{

    constructor(private rockService:RockService, ){}

    JSON = JSON;
    rocks: Rock[];// = ROCKS;
    selectedRockIndex: number = -1;
    height: number;
    rockAnimationIds:number[] = new Array<number>();
    rockAnimations:any[] = new Array<any>();
    rockAnimationElems:Element[] = new Array<Element>();
    scrollStream = new EventEmitter();
    chartChanges = new EventEmitter();
    animationTimeMs = 500;

    //chartData:{data:{},config:{}};
    chartData:InfiniteChartInput;

    @ViewChild("scrollContainer") container: ElementRef;

    get ceiling(){
        let base:number = this.rocks[0].baseHeight || 0,
            ceiling:number = base,
            max:number = ceiling;
        [...this.rocks.values()].forEach(function(r){
            ceiling = ceiling + r.delta;
            max = Math.max(max,ceiling);
        });
        return max;
    }
    
    get floor(){
        let floor = this.rocks[0].baseHeight || 0, minFloor = 0;
        [...this.rocks.values()].forEach(function(r){
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
    
    animate = new Subscriber<[{element:ElementRef, to:{}, data:{id:number}}]>(changes => {
        //animate the new element or buffer or whatever...
        let elements = new Array<HTMLElement>();
        let animations = new Array<any[]>();
        //console.log(changes)
        for (let ea of changes){
            elements.push(ea.element.nativeElement);
            animations.push([
                ea.to,
                this.animationTimeMs,
                mina.easeout,
                function(){
                    for (let k in ea.to){
                        ea.element.nativeElement.setAttribute(k,ea.to[k]);
                    }
                }
            ]);
        }
        Snap(elements).animate(animations);

        /*
        for(let ea of changes){
            for(let k in ea.to){
                ea.element.nativeElement.setAttribute(k,ea.to[k]);
            }
        }
        */
    });/*{
        //console.debug("Animation triggered");
        //console.debug("Elements:"); console.debug(this.rockAnimationElems);
        //console.debug("Animations:"); console.debug(this.rockAnimations);
        //let Snap = require("snapsvg");
        /*
        let set = Snap(this.rockAnimationElems);
        set.animate(this.rockAnimations);
        this.rockAnimationElems = new Array<Element>();
        this.rockAnimations = new Array<any>();
        this.rockAnimationIds = new Array<number>();
        */
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
        *//*
    }*/

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
            //this.animate();
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
        let arr = new Array<Rock>();s
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
        /*
        this.rockService.getRocks(40)
            .then(rocks => this.rocks = rocks as Rock[])
            .catch(err => console.error("Error receiving rocks",err));
        
        let self = this;
        let cScrollStream = this.scrollStream
            .debounceTime(200)
            .map(
                function(o:{width:number,cWidth:number,left:number}){
                    return {
                        doAddRocksRight: (o.width - o.cWidth - o.left) < 120,
                        doRemoveRocksLeft: (o.width / o.cWidth) > 6
                    };
                }
            )
            .share();
        cScrollStream.subscribe(
            function handleScroll(o){
                //console.log("handleScroll");
                //console.log(o);
                if(o.doAddRocksRight){
                    return self.rockService.getRocks(10,self.rocks[self.rocks.length - 1].id,self.rockService.TO_RIGHT)
                        .then(function(newRocks:Rock[]){self.rocks = self.rocks.concat(newRocks as Rock[])});
                }
            },
            function error(err){
                console.error("Error",err);
            },
            function complete(){
                console.log("addRocksRight complete");
            }
        );
        cScrollStream.subscribe(
            function handleScroll(o){
                //console.log("handleScroll");
                //console.log(o);
                if(o.doRemoveRocksLeft){
                    let numRocks = 10;
                    self.rocks = self.rocks.slice(numRocks);
                    self.container.nativeElement.scrollLeft = 
                        self.container.nativeElement.scrollLeft + (numRocks * 40)
                    console.log("Removed");
                }
            },
            function error(err){
                console.error("Error encountered",err);
            },
            function complete(){
                console.log("addRocksLeft complete");
            }
        );
        */
        //console.debug("InfiniteChartConfig");
        //console.log(InfiniteChartConfig);
        /*
        this.chartChanges
            .subscribe(this.animate)
        */
        this.chartData = {
            data: this.getChartData(this.rockService.getRocks(100)),
            config:{
                displayType: 'horizontal',
                curveType: 'bezier',
                xWindow: 40, //how many x units to show without scrolling
                height: 200,
                width: 800,
                bufferedChangeHandler: this.animate
            }
        };
    }

    getChartData(rocks?: Promise<Rock[]>):Promise<Map<number,InfiniteDataElement>>{
        if(!rocks){
            rocks = Promise.resolve(this.rocks);
        }
        return rocks.then(rocks => {
            this.rocks = rocks;
            let innerRocks = new Map(rocks.map(this.mapRock));
            innerRocks.set(
                -1,
                {
                    id:-1,
                    point: this.leftPoint(),
                    componentData:{}
                }
            );
            return innerRocks;
        })
        .catch(err => console.error("Error receiving rocks",err));
    }

    leftPoint():{x:Date,y:number}{
        let leftMost = this.rocks[0].date;
        return {
            x: new Date(leftMost.getFullYear(),leftMost.getMonth(),leftMost.getDate() - 1),
            y: 0
        }
    }

    mapRock(rock:Rock):[number,InfiniteDataElement]{
        return [
            rock.id,
            {
                id: rock.id,
                point:{
                    x: rock.date,
                    dy: rock.delta,
                },
                componentData:rock
            }
        ];
    }

    appendRocksRight(id?:number){
        console.log("adding 10 rocks right...");
        this.chartData = {
            data: this.getChartData(this.rockService.getRocks(10,id || this.rocks[this.rocks.length - 1].id,this.rockService.TO_RIGHT).then(newRocks => this.rocks.concat(newRocks))),
            config: this.chartData.config
        }
        /*
        this.rockService.getRocks(10,id || this.rocks[this.rocks.length - 1].id,this.rockService.TO_RIGHT)
            .then(newRocks => {
                this.rocks = this.rocks.concat(newRocks)
                this.chartData = {
                    data: this.rocks.map(this.mapRock),
                    config: this.chartData.config
                };
            })
            .catch(err => console.error("Error appending right",err));
        */
    }

    removeRocksLeft(){
        console.log("removing 10 rocks...");
        this.rocks = this.rocks.slice(10);
        this.chartData = {
            data: this.getChartData(),
            config: this.chartData.config
        };
    }

    handleDataEvent(event:{action:string,lastId:number}){
        if(event.action==="add_right"){
            this.appendRocksRight(event.lastId || null);
        }else if(event.action==="remove_left"){
            this.removeRocksLeft();
        }
    }

    handleScroll(event:UIEvent){
        //let scrollPct = event.target.scrollLeft / (event.target.scrollWidth - event.target.clientWidth);
        let self = this,
            handling = false;
        if(!handling){
            let target = <Element>event.target;
            let scrollDiff = target.scrollWidth - target.clientWidth - target.scrollLeft;
            let scrollFactor = target.scrollWidth / target.clientWidth;
            requestAnimationFrame(function(){
                if(scrollDiff < 120){
                    self.appendRocksRight();
                }
                if(scrollFactor > 5){
                    self.removeRocksLeft();
                }
                handling = false;
            });
            handling = true;
        }
        
        
    }

}