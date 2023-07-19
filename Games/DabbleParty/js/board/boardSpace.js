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
    function BoardSpace(gameX, gameY, label) {
        if (label === void 0) { label = ""; }
        this.gameX = gameX;
        this.gameY = gameY;
        this.label = label;
        this.nextSpaces = [];
        this.costsMovement = true; // if false, this is not a real space, just a link between multiple spaces 
        this.id = BoardSpace.GenerateId();
        BoardSpace.allConstructedSpaces.push({ label: label, space: this });
    }
    BoardSpace.GenerateId = function () {
        BoardSpace.numConstructed++;
        return BoardSpace.numConstructed;
    };
    BoardSpace.prototype.ConnectFromPrevious = function () {
        var _this = this;
        // chain from constructor to connect to space constructed before this one
        var previousSpaces = BoardSpace.allConstructedSpaces.filter(function (a) { return a.space !== _this; });
        var latest = previousSpaces[previousSpaces.length - 1];
        if (latest) {
            latest.space.nextSpaces.push(this);
        }
        else {
            console.error("Can't connect space", this.id);
        }
        return this;
    };
    BoardSpace.prototype.ConnectFromLabel = function (label) {
        var target = BoardSpace.allConstructedSpaces.filter(function (a) { return a.label === label; });
        if (target.length > 1) {
            console.error("Too many spaces to connect from");
        }
        else if (target.length == 0) {
            console.error("Can't connect space", this.id, label);
        }
        else {
            target[0].space.nextSpaces.push(this);
        }
        return this;
    };
    BoardSpace.ConnectLabels = function (from, to) {
        var space1 = BoardSpace.allConstructedSpaces.filter(function (a) { return a.label === from; });
        if (space1.length > 1) {
            console.error("Too many spaces to connect from");
        }
        else if (space1.length == 0) {
            console.error("Can't connect space", from);
        }
        var space2 = BoardSpace.allConstructedSpaces.filter(function (a) { return a.label === to; });
        if (space2.length > 1) {
            console.error("Too many spaces to connect from");
        }
        else if (space2.length == 0) {
            console.error("Can't connect space", to);
        }
        space1[0].space.nextSpaces.push(space2[0].space);
    };
    // on pass event
    // on land event
    BoardSpace.prototype.Draw = function (camera) {
        this.imageTile.Draw(camera, this.gameX, this.gameY, 0.2, 0.2, false, false, 0, 1);
        var coord1 = camera.GameCoordToCanvas(this.gameX, this.gameY);
        camera.ctx.font = "200 " + 10 + "px " + "arial";
        camera.ctx.fillText(this.id.toString(), coord1.canvasX, coord1.canvasY);
    };
    BoardSpace.prototype.DrawConnections = function (camera) {
        camera.ctx.strokeStyle = "black";
        camera.ctx.lineWidth = camera.scale * 4;
        camera.ctx.setLineDash([8 * camera.scale, 4 * camera.scale]);
        if (board) {
            camera.ctx.lineDashOffset = (-board.timer) * 0.1;
        }
        for (var _i = 0, _a = this.nextSpaces; _i < _a.length; _i++) {
            var connection = _a[_i];
            var coord1 = camera.GameCoordToCanvas(this.gameX, this.gameY);
            var coord2 = camera.GameCoordToCanvas(connection.gameX, connection.gameY);
            camera.ctx.beginPath();
            camera.ctx.moveTo(coord1.canvasX, coord1.canvasY);
            camera.ctx.lineTo(coord2.canvasX, coord2.canvasY);
            camera.ctx.stroke();
        }
    };
    BoardSpace.prototype.OnLand = function (player) { };
    // auto-genenerate IDs for each space to make it easier to send cyclical JSON packages of board state
    BoardSpace.numConstructed = 0;
    BoardSpace.allConstructedSpaces = [];
    return BoardSpace;
}());
var BlueBoardSpace = /** @class */ (function (_super) {
    __extends(BlueBoardSpace, _super);
    function BlueBoardSpace() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["partySquares"][0][0];
        return _this;
    }
    BlueBoardSpace.prototype.OnLand = function (player) {
        player.coins += 3; // todo add to some sort of animated tick up pool
        player.AddCoinsOverToken(3);
    };
    return BlueBoardSpace;
}(BoardSpace));
var RedBoardSpace = /** @class */ (function (_super) {
    __extends(RedBoardSpace, _super);
    function RedBoardSpace() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["partySquares"][0][1];
        return _this;
    }
    RedBoardSpace.prototype.OnLand = function (player) {
        player.coins -= 3; // todo add to some sort of animated tick up pool
        // boundary check to avoid going negative
        if (player.coins < 0)
            player.coins = 0;
        player.DeductCoinsOverToken(3);
    };
    return RedBoardSpace;
}(BoardSpace));
var DiceUpgradeSpace = /** @class */ (function (_super) {
    __extends(DiceUpgradeSpace, _super);
    function DiceUpgradeSpace() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["partySquares"][0][4];
        return _this;
    }
    DiceUpgradeSpace.prototype.OnLand = function (player) {
        player.diceBag.Upgrade();
    };
    return DiceUpgradeSpace;
}(BoardSpace));
var GrayBoardSpace = /** @class */ (function (_super) {
    __extends(GrayBoardSpace, _super);
    function GrayBoardSpace() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["partySquares"][0][2];
        _this.costsMovement = false;
        return _this;
    }
    return GrayBoardSpace;
}(BoardSpace));
