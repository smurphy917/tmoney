import { Component, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { Transaction } from './transaction.definition';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
class RollingTableDateParserFormatter extends NgbDateParserFormatter{
    parse(value:string):NgbDateStruct{
        let d = new Date(value); //just gonna try using plain js Date object for parsing.
        return {
            year: d.getFullYear(),
            month: d.getMonth() - 1,
            day: d.getDate()
        }
    }
    format(date:NgbDateStruct):string{
        if(!date)
            return "";
        return date.month + "/" + date.day + "/" + date.year;
    }
}

@Component({
    selector: 'rolling-table',
    templateUrl: './template/rolling-table.component.html',
    styleUrls: ['./style/rolling-table.component.css'],
    providers: [{provide:NgbDateParserFormatter,useClass:RollingTableDateParserFormatter}],

})
export class RollingTableComponent {
    @Input()
    transactions: Transaction[];
    selectedTransaction:Transaction;
    @Output()
    select = new EventEmitter<{id:string}>();
    _selectedDate:NgbDateStruct;

    selectTransaction(transaction:Transaction){
        if(transaction===this.selectedTransaction){
            return;
        }
        this.selectedTransaction = transaction;
        this._selectedDate = {
            year: transaction.date.getFullYear(),
            month: transaction.date.getMonth() + 1,
            day: transaction.date.getDate()
        }
        this.select.emit({id:transaction.id});
    }

    get selectedDate():NgbDateStruct{
        return this._selectedDate;
    }

    set selectedDate (date:NgbDateStruct){
        this._selectedDate = date;
        this.selectedTransaction.date = new Date(this.selectedDate.year,this.selectedDate.month - 1, this.selectedDate.day);
    }
}