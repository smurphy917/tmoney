import { Component } from '@angular/core';
import { HillComponent } from './hill.component';
import { RockService } from './rock.service';

@Component({
    selector: 'app-base',
    templateUrl: 'app/template/app.component.html',
    directives: [HillComponent],
    providers: [RockService]
})

export class AppComponent{
}