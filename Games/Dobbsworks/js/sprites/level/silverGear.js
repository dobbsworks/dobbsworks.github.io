"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IronGear = /** @class */ (function (_super) {
    __extends(IronGear, _super);
    function IronGear() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frameRow = 1;
        _this.isRequired = false;
        _this.maxAllowed = 3;
        return _this;
    }
    IronGear.prototype.Update = function () {
        this.y += Math.sin(this.age / 30) / 20;
        var frameIndeces = [
            0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
            0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5
        ];
        this.frame = frameIndeces[this.age % frameIndeces.length] * 20;
        if (!this.isTouched) {
            var player_1 = this.layer.sprites.find(function (a) { return a instanceof Player; });
            if (player_1 && player_1.IsGoingToOverlapSprite(this)) {
                this.isTouched = true;
            }
        }
        else {
            this.frame = (this.age % 6) * 20;
        }
    };
    return IronGear;
}(GoldGear));
