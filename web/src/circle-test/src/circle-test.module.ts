import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { SubComponent } from './sub.component';

NgModule({
    declarations: [
        MainComponent,
        SubComponent
    ],
    exports: [
        MainComponent
    ]
})
export class CircleTestModule {}