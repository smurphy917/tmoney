import { Component, OnChanges, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { DataPoint } from './chart.component';

@Component({
    selector: 'g[infinite-sub]',
    template: require('./template/chart-sub.component.html')
})
export class InfiniteChartSubComponent implements OnChanges{
    @Input()
    point:[number,number];
    @Input()
    leftPoint:[number,number];
    @Output()
    output = new EventEmitter<{element:ElementRef, to:{}}>();
    @ViewChild("path_elem")
    path:ElementRef
    @ViewChild("circle_elem")
    circle:ElementRef;
    @Input()
    xScale:number;
    @Input()
    yScale:number;
    @Input()
    min_x:number;
    ngOnChanges(changes?:{[key: string]:any}){
        let to = this.to;
        if(to){
            this.output.emit({
                element: this.path,
                to: to
            });
        }
        this.output.emit({
            element: this.circle,
            to: {
                cx:(this.point[0]) * this.xScale,
                cy:-this.point[1] * this.yScale,
                r:40
            }
        })
    }
    get to():any{
        let subpaths = new Array<string>();
        let left_x:number;
        if(this.point && this.leftPoint){
            left_x = (this.leftPoint[0]) * this.xScale;
        }else{
            return null;
        }
        let x = (this.point[0]) * this.xScale;
        subpaths.push("M" + left_x + " " + -(this.leftPoint[1] * this.yScale));
        subpaths.push("L" + x + " " + -(this.point[1] * this.yScale));
        let to = {
            d: subpaths.join(" ")
        };
        
        return to;
    }
}