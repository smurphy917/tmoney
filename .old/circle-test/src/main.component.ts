import { Component } from '@angular/core';

@Component({
    selector: 'circle-test',
    template:`
    <svg>
        <svg:circle *ngFor="let circle of circles;"/>
    </svg>
    `
})
export class MainComponent {
    circles = [1,2,3,4,5];
}