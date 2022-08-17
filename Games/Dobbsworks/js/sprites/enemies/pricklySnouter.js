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
var PricklySnouter = /** @class */ (function (_super) {
    __extends(PricklySnouter, _super);
    function PricklySnouter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canBeBouncedOn = false;
        _this.ammo = PricklySnouterBullet;
        _this.frameCol = 1;
        return _this;
    }
    return PricklySnouter;
}(Snouter));
