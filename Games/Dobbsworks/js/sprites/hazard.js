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
var Hazard = /** @class */ (function (_super) {
    __extends(Hazard, _super);
    function Hazard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hazard.prototype.Update = function () {
        var player = this.layer.sprites.find(function (a) { return a instanceof Player; });
        if (player) {
            if (this.DoesPlayerOverlap(player) && this.IsHazardActive()) {
                player.OnPlayerHurt();
            }
        }
    };
    Hazard.prototype.DoesPlayerOverlap = function (player) {
        return player.Overlaps(this);
    };
    return Hazard;
}(Sprite));
