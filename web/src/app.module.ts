import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { InMemoryWebApiModule, InMemoryBackendService } from 'angular-in-memory-web-api';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { InMemoryDataService } from './in-memory-data.service';
import { AppComponent } from './app.component';
import { HillComponent } from './hill.component';
import { RockComponent } from './rock.component';
import { RockEditorComponent } from './rockEditor.component';
import { ChartContainerComponent } from './chart-container.component';
import { RollingTableComponent } from'./rolling-table.component';
import { TopNavComponent } from './nav.component';
import { SidebarComponent } from './sidebar.component';

import { InfiniteChartModule } from './infinite-chart';

@NgModule({
  imports: [
    InfiniteChartModule,
    BrowserModule,
    HttpModule,
    FormsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    NgbModule.forRoot(),
    NgbDatepickerModule.forRoot()
  ],
  declarations: [ 
    AppComponent, 
    HillComponent, 
    RockComponent, 
    RockEditorComponent,
    ChartContainerComponent,
    RollingTableComponent,
    TopNavComponent,
    SidebarComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
