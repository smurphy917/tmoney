import { NgModule } from '@angular/core';
import { InfiniteChartComponent, InfiniteChartInput, InfiniteChartConfig } from './chart.component';
import { InfiniteChartSubComponent } from './chart-sub.component';

@NgModule({
    declarations: [
        InfiniteChartComponent,
        InfiniteChartSubComponent
    ],
    exports:[
        InfiniteChartComponent
    ]
})
export class InfiniteChartModule {};