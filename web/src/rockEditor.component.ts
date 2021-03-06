import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Rock, Transaction } from './rock.definition';

@Component({
    selector: 'rock-editor',
    templateUrl: 'template/rockEditor.component.html'
})
export class RockEditorComponent{
    @Input()
    rock: Rock;

    @Output()
    redraw = new EventEmitter();

    editingTransaction:Transaction;

    save = function(){
        //save the data
        this.rock
        this.redraw.emit();
        this.editingTransaction = null;
    }
    edit(trans:Transaction){
        this.editingTransaction = trans;
    }
}