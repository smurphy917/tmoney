import { Component, OnInit, Input, Output, OnChanges, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Rock } from './rock';
import { SVGAnimateOnEnd } from './SVGAnimateOnEnd.directive';
import { ControlPoints } from './curve.function';
import { CURVE_POINTS } from './hill.component'
import { ArraySum } from './utils.functions';

const vertScale = 20;
const horizScale = 40;
const animationTimeMs = 200;

@Component({
    selector: 'rock',
    templateUrl: 'app/rock.component.html',
    styleUrls: ['app/rock.component.css'],
    directives: [SVGAnimateOnEnd]
})

export class RockComponent implements OnChanges{

    @Input()
    rock: Rock;

    @Input()
    rocks: Rock[];

    @Input()
    floor: number;

    @Input()
    scale: number;

    @Input()
    ceiling: number;

    @Input()
    verticalBuffer: number;

    @Output()
    animationTrigger = new EventEmitter();
    
    @ViewChild("rockPath") pathElem: ElementRef;
    @ViewChild("rockSVG") svgElem: ElementRef;

    snapPath:any;
    snapSVG:any;
    path:string = "M0 0 H40";
    animateToPath: string;
    scaleX = horizScale;
    init = false;
    Math = Math;

    canvasHeight: number;
    canvasOrigin: number;
    height: number;


    get zeroPath():string{
        return "M0 0 H" + (this.rock.timeSpan * this.scaleX);
    }

    endAnimation(){
        //replace the path with newPath and kill the <animate> element.s
        //this._path = this.animateToPath;
        this.path = this.animateToPath;
        this.animateToPath = "";
    }

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

    private draw(){
        //console.debug("Drawing rock: " + this.rock.id);
        let Snap = require('snapsvg');
        let mina = Snap.mina || function(){};

        console.debug("Rock (" + this.rock.id + ") delta: " + this.rock.delta);

        let lMin = (CURVE_POINTS - 1)/2
        let index = this.rocks.findIndex(r => r.id === this.rock.id);
        let localRocks = this.rocks.slice(index > lMin - 1 ? index - lMin : 0, index + lMin + 1);
        index = localRocks.findIndex(r => r.id === this.rock.id);
        let controlPts = ControlPoints(localRocks);
        let scaledCtrlPts = {
            p1: [
                (1/3) * this.rock.timeSpan * this.scaleX,
                -controlPts[index].p1[1]
            ],
            p2: [
                (2/3) * this.rock.timeSpan * this.scaleX,
                -controlPts[index].p2[1]
            ]
        };
        let startY = - this.rock.baseHeight;
        let maxY = - (this.rock.baseHeight + this.rock.delta);
        let maxX = this.rock.timeSpan * this.scaleX;
        let M = [0, startY];
        let C3 = [maxX, maxY];

        let newPath:string = "M" + M.join(' ') + ' C' + scaledCtrlPts.p1.join(' ') + ', ' + scaledCtrlPts.p2.join(' ') + ', ' + C3.join(' ');
        let newCanvasHeight:number = (2 * this.verticalBuffer + this.ceiling - this.floor);//(2 * this.verticalBuffer) + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta) - this.floor;
        let newCanvasOrigin:number = -(this.verticalBuffer + this.ceiling);//-(this.verticalBuffer + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta));
        let newHeight:number = newCanvasHeight * this.scale;

        console.debug("Rock: " + this.rock.id);
        console.debug("\tInputs (buffer/baseHeight/delta/floor): " + [this.verticalBuffer,this.rock.baseHeight,this.rock.delta,this.floor].join(" / "));
        console.debug("\tNew origin: " + newCanvasOrigin);
        console.debug("\tNew height: " + newCanvasHeight);

        var self = this;

        if(!this.snapPath){
            this.snapPath = Snap(this.pathElem.nativeElement);
        }
        if(!this.snapSVG){
            this.snapSVG = Snap(this.svgElem.nativeElement);
        }

        let animationElements = [
            this.snapPath,
            this.snapSVG
        ];
        let animations=[[
            {d: newPath},
            animationTimeMs,
            mina.easeout,
            function(){
                self.path = newPath;
            }
        ],[
            {
                viewBox: '0 ' + newCanvasOrigin + ' ' + self.rock.timeSpan*self.scaleX + ' ' + newCanvasHeight,
                height: newHeight
            },
            animationTimeMs,
            mina.easeout,
            function(){
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

    }

    ngOnChanges(){
        this.draw();
    }
    

}