import { Component } from '@angular/core';
import { HillComponent } from './hill.component';
import { RockService } from './rock.service';

@Component({
    selector: 'app-base',
    templateUrl: 'template/app.component.html',
    entryComponents: [HillComponent],
    providers: [RockService]
})

export class AppComponent{
}