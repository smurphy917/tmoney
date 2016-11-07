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
var core_1 = require("@angular/core");
var rock_1 = require("./rock");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var RockService = (function () {
    function RockService(http) {
        this.http = http;
    }
    RockService.prototype.generateRocks = function (count) {
        var result = new Array(), startDate = new Date(2016, 10, 1);
        for (var i = 1; i <= count; i++) {
            var r = this.generateRock();
            r.id = i;
            r.date = new Date(startDate.setDate(startDate.getDate() + 1));
            result.push(r);
        }
        return result;
    };
    RockService.prototype.generateRock = function () {
        var r = new rock_1.Rock();
        r.timeSpan = 1;
        var MAX_TRANS = 5, MAX_AMT = 1000, numDebits = Math.round(Math.random() * MAX_TRANS), numCredits = Math.round(Math.random() * MAX_TRANS), credits = new Array(), debits = new Array();
        for (var i = 0; i < numDebits; i++) {
            debits.push(new rock_1.Transaction(i, Math.round((Math.random() * MAX_AMT) * 100) / 100));
        }
        for (var i = 0; i < numCredits; i++) {
            credits.push(new rock_1.Transaction(i, Math.round((Math.random() * MAX_AMT) * 100) / 100));
        }
        r.credits = credits;
        r.debits = debits;
        return r;
    };
    return RockService;
}());
RockService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object])
], RockService);
exports.RockService = RockService;
var _a;
//# sourceMappingURL=rock.service.js.map