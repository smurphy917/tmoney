import { Component, OnChanges, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { InfiniteDataElement } from './chart.component';

@Component({
    selector: 'g[infinite-sub]',
    template:`
            <svg:path #path_elem stroke="black" stroke-width="50" fill="transparent" [attr.id]="'path_' + p.id"></svg:path>
            <svg:circle #circle_elem [attr.id]="'circle_' + p.id"></svg:circle>
            <svg:foreignObject></svg:foreignObject>
    `
})
export class InfiniteChartSubComponent implements OnChanges{
    @Input()
    p:InfiniteDataElement
    @Output()
    output = new EventEmitter<{element:ElementRef, data:InfiniteDataElement, to:{}}>();
    @ViewChild("path_elem")
    path:ElementRef
    @ViewChild("circle_elem")
    point:ElementRef
    @Input()
    minorScale:number;
    @Input()
    min_x:number;
    ngOnChanges(changes?:{[key: string]:any}){
        let to = this.to;
        if(to){
            this.output.emit({
                element: this.path,
                data: this.p,
                to: to
            });
        }
        this.output.emit({
            element: this.point,
            data: this.p,
            to: {
                cx:(this.p.point.x.valueOf() - this.min_x) * this.minorScale,
                cy:-this.p.point.y,
                r:80
            }
        })
    }
    get to():any{
        let subpaths = new Array<string>();
        let left_x:number;
        if(this.p.point && this.p.point.left_x){
            left_x = (this.p.point.left_x.valueOf() - this.min_x) * this.minorScale;
        }else{
            return null;
        }
        let x = (this.p.point.x.valueOf() - this.min_x) * this.minorScale;
        subpaths.push("M" + left_x + " " + -this.p.point.left_y);
        subpaths.push("L" + x + " " + -this.p.point.y);
        let to = {
            d: subpaths.join(" ")
        };
        
        return to;
    }
}