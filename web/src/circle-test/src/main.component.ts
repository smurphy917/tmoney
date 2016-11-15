import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'circle-test',
    template:`
    <svg>
        <svg:circle *ngFor="let circle of circles;"/>
    </svg>
    `
})
export class MainComponent implements OnInit {
    circles = [1,2,3,4,5];
    ngOnInit(){
        console.debug("test");
    }
}