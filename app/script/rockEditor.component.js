var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
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
            this.rock;
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
    ], RockEditorComponent.prototype, "rock");
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RockEditorComponent.prototype, "redraw");
    RockEditorComponent = __decorate([
        core_1.Component({
            selector: 'rock-editor',
            templateUrl: 'app/template/rockEditor.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], RockEditorComponent);
    return RockEditorComponent;
})();
exports.RockEditorComponent = RockEditorComponent;
//# sourceMappingURL=rockEditor.component.js.map