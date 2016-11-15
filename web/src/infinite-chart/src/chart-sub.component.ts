import { Component, OnChanges, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { InfiniteDataElement } from './chart.component';

@Component({
    selector: 'svg[infinite-sub]',
    template:`
            <svg:path #path_elem></svg:path>
            <svg:foreignObject></svg:foreignObject>
    `
})
export class InfiniteChartSubComponent implements OnChanges{
    @Input()
    p:InfiniteDataElement
    @Output()
    output = new EventEmitter<{element:ElementRef, data:InfiniteDataElement}>();
    @ViewChild("path_elem")
    path:ElementRef
    ngOnChanges(changes?:{[key: string]:any}){
        this.output.emit({
            element: this.path,
            data:this.p
        });
    }
}