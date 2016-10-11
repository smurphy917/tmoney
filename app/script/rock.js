var utils_functions_1 = require('./utils.functions');
var Transaction = (function () {
    function Transaction(id, value) {
        var _this = this;
        this.valueOf = function () {
            return _this.value;
        };
        this.id = id;
        this.value = value;
    }
    ;
    return Transaction;
})();
exports.Transaction = Transaction;
var Rock = (function () {
    function Rock() {
        this.timeSpan = 1;
        this._credits = new Array();
        this._debits = new Array();
    }
    Rock.prototype.addTransaction = function (value) {
        if (value >= 0) {
            this._credits.push(new Transaction(this._credits.length, value));
        }
        else {
            this._debits.push(new Transaction(this._debits.length, value));
        }
        this.calcDelta();
    };
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
})();
exports.Rock = Rock;
//# sourceMappingURL=rock.js.map