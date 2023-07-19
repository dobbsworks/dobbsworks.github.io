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
var BoardItem = /** @class */ (function () {
    function BoardItem() {
    }
    return BoardItem;
}());
var BoardItemFragileDice = /** @class */ (function (_super) {
    __extends(BoardItemFragileDice, _super);
    function BoardItemFragileDice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoardItemFragileDice.prototype, "name", {
        get: function () { return "Fragile D" + this.numFaces; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardItemFragileDice.prototype, "description", {
        get: function () { return "Adds an extra " + this.numFaces + "-sided die to this turn's roll"; },
        enumerable: false,
        configurable: true
    });
    ;
    BoardItemFragileDice.prototype.OnUse = function (player, board) {
        player.diceBag.fragileFaces.push(this.numFaces);
        board.boardUI.StartRoll();
    };
    return BoardItemFragileDice;
}(BoardItem));
var BoardItemFragileD4 = /** @class */ (function (_super) {
    __extends(BoardItemFragileD4, _super);
    function BoardItemFragileD4() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][0][0];
        _this.numFaces = 4;
        return _this;
    }
    return BoardItemFragileD4;
}(BoardItemFragileDice));
var BoardItemFragileD6 = /** @class */ (function (_super) {
    __extends(BoardItemFragileD6, _super);
    function BoardItemFragileD6() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][1][0];
        _this.numFaces = 6;
        return _this;
    }
    return BoardItemFragileD6;
}(BoardItemFragileDice));
var BoardItemFragileD8 = /** @class */ (function (_super) {
    __extends(BoardItemFragileD8, _super);
    function BoardItemFragileD8() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][2][0];
        _this.numFaces = 8;
        return _this;
    }
    return BoardItemFragileD8;
}(BoardItemFragileDice));
var BoardItemFragileD10 = /** @class */ (function (_super) {
    __extends(BoardItemFragileD10, _super);
    function BoardItemFragileD10() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][3][0];
        _this.numFaces = 10;
        return _this;
    }
    return BoardItemFragileD10;
}(BoardItemFragileDice));
var BoardItemFragileD12 = /** @class */ (function (_super) {
    __extends(BoardItemFragileD12, _super);
    function BoardItemFragileD12() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][4][0];
        _this.numFaces = 12;
        return _this;
    }
    return BoardItemFragileD12;
}(BoardItemFragileDice));
var BoardItemFragileD20 = /** @class */ (function (_super) {
    __extends(BoardItemFragileD20, _super);
    function BoardItemFragileD20() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][5][0];
        _this.numFaces = 20;
        return _this;
    }
    return BoardItemFragileD20;
}(BoardItemFragileDice));
