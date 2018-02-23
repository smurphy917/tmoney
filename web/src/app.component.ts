import { Component } from '@angular/core';
import { HillComponent } from './hill.component';
import { RockService } from './rock.service';
import { InMemoryTransactionService } from './in-memory.transaction.service';

@Component({
    selector: 'app-base',
    templateUrl: 'template/app.component.html',
    styleUrls: [
        './style/global.css'],
    providers: [RockService, InMemoryTransactionService]
})
export class AppComponent{
}