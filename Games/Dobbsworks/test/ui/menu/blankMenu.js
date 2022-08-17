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
var BlankMenu = /** @class */ (function (_super) {
    __extends(BlankMenu, _super);
    function BlankMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // just used as placeholder in menu stack
        _this.stopsMapUpdate = false;
        _this.blocksPause = false;
        return _this;
    }
    BlankMenu.prototype.CreateElements = function () {
        return [];
    };
    return BlankMenu;
}(Menu));
