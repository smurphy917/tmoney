import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteChartComponent } from './chart.component';
import { InfiniteChartSubComponent } from './chart-sub.component';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        InfiniteChartComponent,
        InfiniteChartSubComponent
    ],
    exports:[
        InfiniteChartComponent
    ]
})
export class InfiniteChartModule {};