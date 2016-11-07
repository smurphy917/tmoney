import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HillComponent } from './hill.component';
import { RockComponent } from './rock.component';
import { RockEditorComponent } from './rockEditor.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  declarations: [ AppComponent, HillComponent, RockComponent, RockEditorComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
