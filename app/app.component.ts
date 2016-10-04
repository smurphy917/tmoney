import { Component } from '@angular/core';
import { HillComponent } from './hill.component';

@Component({
    selector: 'app-base',
    templateUrl: 'app/app.component.html',
    directives: [HillComponent]
})

export class AppComponent{
}