import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Rock } from './rock';
import { SVGAnimateOnEnd } from './SVGAnimateOnEnd.directive';
import { ControlPoints } from './curve.function';
import { CURVE_POINTS } from './hill.component'

const vertScale = 20;
const horizScale = 40;
const animationTimeMs = 300;

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
    
    @ViewChild("rockPath") pathElem: ElementRef;

    path:string = "M0 0 H40";
    animateToPath: string;
    scaleX = horizScale;
    init = false;
    Math = Math;


    get zeroPath():string{
        return "M0 0 H" + (this.rock.timeSpan * this.scaleX);
    }

    endAnimation(){
        //replace the path with newPath and kill the <animate> element.s
        //this._path = this.animateToPath;
        this.path = this.animateToPath;
        this.animateToPath = "";
    }

    get canvasHeight():number{
        return (2 * this.verticalBuffer) + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta) - this.floor;
    }

    get canvasOrigin():number{
        return -(this.verticalBuffer + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta));
    }

    get height():number{
        return this.canvasHeight * this.scale;
    }

    private draw(){
        let Snap = require('snapsvg');
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
        var self = this;
        Snap(this.pathElem.nativeElement).animate({
            d: newPath
        },animationTimeMs,mina.easeout,function(){
            self.path = newPath;
        });
        
    }

    ngOnChanges(){
        this.draw();
    }
    
    /*
    getNewPath(){
        let lMin = (CURVE_POINTS - 1)/2
        let index = this.rocks.findIndex(r => r.id === this.rock.id);
        let localRocks = this.rocks.slice(index > lMin - 1 ? index - lMin : 0, index + lMin + 1);
        index = localRocks.findIndex(r => r.id === this.rock.id);
        let controlPts = ControlPoints(localRocks);
        
        this.canvasHeight = (2 * this.verticalBuffer) + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta) - this.floor;
        this.canvasOrigin = -(this.verticalBuffer + Math.max(this.rock.baseHeight,this.rock.baseHeight + this.rock.delta));
        this.height = this.canvasHeight * this.scale;

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
        
        this.path = "M" + M.join(' ') + ' C' + scaledCtrlPts.p1.join(' ') + ', ' + scaledCtrlPts.p2.join(' ') + ', ' + C3.join(' ');
    }
    */

}