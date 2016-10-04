import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Rock } from './rock';
import { PathDDirective } from './pathD.directive';
import { ControlPoints } from './curve.function';
import { CURVE_POINTS } from './hill.component'

const vertScale = 20;
const horizScale = 40;
const VERTICAL_BUFFER = 1;

@Component({
    selector: 'rock',
    templateUrl: 'app/rock.component.html',
    styleUrls: ['app/rock.component.css'],
    directives: [PathDDirective]
})

export class RockComponent implements OnChanges{

    @Input()
    rock: Rock;

    @Input()
    rocks: Rock[];

    @Input()
    localRocks: Rock[];

    @Input()
    floor: number;

    @Input()
    ceiling:number;

    stHeight:number;
    vbHeight: number;
    path: string;
    zeroPath: string;
    scaleX = horizScale;
    scaleY = vertScale;
    init = false;
    _rocksCopy: Rock[];
    Math = Math;
    vertBuffer = VERTICAL_BUFFER;

    
    ngOnChanges(changes){
        if(!this.init){
            this.draw();
             this.zeroPath = "M0 0 H" + (this.rock.timeSpan * this.scaleX);
        }
        if(!this.init){
            this.draw();
            return;
        }
        if(changes.rock){
            this.draw();
            return;
        }
        if(changes.rocks){
            this.draw();
        }
        
    }
    
    draw(){
        //console.log("ratio: " + ((this.rock.baseHeight + this.rock.delta)/this.ceiling));
        let lMin = (CURVE_POINTS - 1)/2
        let index = this.rocks.findIndex(r => r.id === this.rock.id);
        let localRocks = this.rocks.slice(index > lMin - 1 ? index - lMin : 0, index + lMin + 1);
        index = localRocks.findIndex(r => r.id === this.rock.id);
        let controlPts = ControlPoints(localRocks);
        
        this.vbHeight = Math.max(this.rock.baseHeight, this.rock.baseHeight + this.rock.delta) - this.floor;
        this.stHeight = ((this.vbHeight - this.floor)/this.ceiling) * 180;
        if(this.rock.id===5){
            console.log("delta: " + this.rock.delta);
            console.log("base: " + this.rock.baseHeight);
            console.log("floor: " + this.floor);
            console.log("vbHeight: " + this.vbHeight);
        }
        console.log("height ratio: "+ (this.vbHeight/this.stHeight));
        let scaledCtrlPts = {
            p1: [
                (1/3) * this.rock.timeSpan * this.scaleX,
                -controlPts[index].p1[1] * this.scaleY
            ],
            p2: [
                (2/3) * this.rock.timeSpan * this.scaleX,
                -controlPts[index].p2[1] * this.scaleY
            ]
        };
        let startY = - this.rock.baseHeight * this.scaleY;
        let maxY = - (this.rock.baseHeight * this.scaleY + this.rock.delta * this.scaleY);
        let maxX = this.rock.timeSpan * this.scaleX;
        let M = [0, startY];
        let C3 = [maxX, maxY];
        
        this.path = "M" + M.join(' ') + ' C' + scaledCtrlPts.p1.join(' ') + ', ' + scaledCtrlPts.p2.join(' ') + ', ' + C3.join(' ');
        
        this.init = true;
    }

}