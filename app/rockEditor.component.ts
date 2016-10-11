import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Rock } from './rock';

@Component({
    selector: 'rock-editor',
    templateUrl: 'app/rockEditor.component.html'
})
export class RockEditorComponent{
    @Input()
    rock: Rock;

    @Output()
    redraw = new EventEmitter();

    editingType:string="";
    editingIndex:number=-1;

    save = function(){
        //save the data
        this.redraw.emit();
        this.editingType = "";
        this.editingIndex = -1;
    }
    edit(type:string,index:number){
        this.editingType = type;
        this.editingIndex = index;
    }
}