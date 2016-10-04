"use strict";
var Rock = (function () {
    function Rock() {
    }
    Object.defineProperty(Rock.prototype, "delta", {
        set: function (delta) {
            console.log("Delta updated to " + delta + " for rock: " + this.id);
            this.delta = delta;
        },
        enumerable: true,
        configurable: true
    });
    ;
    return Rock;
}());
exports.Rock = Rock;
//# sourceMappingURL=rock.js.map