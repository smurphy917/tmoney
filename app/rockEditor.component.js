"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var rock_1 = require('./rock');
var RockEditorComponent = (function () {
    function RockEditorComponent() {
        this.redraw = new core_1.EventEmitter();
        this.save = function () {
            //save the data
            this.redraw.emit();
            this.editingTransaction = null;
        };
    }
    RockEditorComponent.prototype.edit = function (trans) {
        this.editingTransaction = trans;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', rock_1.Rock)
    ], RockEditorComponent.prototype, "rock", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RockEditorComponent.prototype, "redraw", void 0);
    RockEditorComponent = __decorate([
        core_1.Component({
            selector: 'rock-editor',
            templateUrl: 'app/rockEditor.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], RockEditorComponent);
    return RockEditorComponent;
}());
exports.RockEditorComponent = RockEditorComponent;
//# sourceMappingURL=rockEditor.component.js.map