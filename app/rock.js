"use strict";
var utils_functions_1 = require('./utils.functions');
var Rock = (function () {
    function Rock() {
        this.timeSpan = 1;
    }
    Object.defineProperty(Rock.prototype, "credits", {
        get: function () {
            return this._credits;
        },
        set: function (credits) {
            this._credits = credits;
            if (this._debits) {
                this.calcDelta();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rock.prototype, "debits", {
        get: function () {
            return this._debits;
        },
        set: function (debits) {
            this._debits = debits;
            if (this._credits) {
                this.calcDelta();
            }
        },
        enumerable: true,
        configurable: true
    });
    Rock.prototype.calcDelta = function () {
        this.delta = utils_functions_1.ArraySum(this._credits) - utils_functions_1.ArraySum(this._debits);
    };
    return Rock;
}());
exports.Rock = Rock;
//# sourceMappingURL=rock.js.map