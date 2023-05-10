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
var BoardSpace = /** @class */ (function () {
    function BoardSpace(id) {
        if (id === void 0) { id = -1; }
        this.gameX = 0;
        this.gameY = 0;
        this.costsMovement = true; // if false, this is not a real space, just a link between multiple spaces 
        if (id == -1) {
            this.id = BoardSpace.GenerateId();
        }
        else {
            this.id = id;
        }
    }
    BoardSpace.GenerateId = function () {
        BoardSpace.numConstructed++;
        return BoardSpace.numConstructed;
    };
    // auto-genenerate IDs for each space to make it easier to send cyclical JSON packages of board state
    BoardSpace.numConstructed = 0;
    return BoardSpace;
}());
var BlueBoardSpace = /** @class */ (function (_super) {
    __extends(BlueBoardSpace, _super);
    function BlueBoardSpace() {
        var _this = _super.call(this) || this;
        _this.imageTile = tiles["partySquares"][0][0];
        return _this;
    }
    return BlueBoardSpace;
}(BoardSpace));
var RedBoardSpace = /** @class */ (function (_super) {
    __extends(RedBoardSpace, _super);
    function RedBoardSpace() {
        var _this = _super.call(this) || this;
        _this.imageTile = tiles["partySquares"][0][1];
        return _this;
    }
    return RedBoardSpace;
}(BoardSpace));
