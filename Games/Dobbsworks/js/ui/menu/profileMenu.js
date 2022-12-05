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
var ProfileMenu = /** @class */ (function (_super) {
    __extends(ProfileMenu, _super);
    function ProfileMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#2171cc";
        _this.backgroundColor2 = "#677327";
        return _this;
    }
    ProfileMenu.prototype.CreateElements = function () {
        var ret = [];
        return ret;
    };
    return ProfileMenu;
}(Menu));
