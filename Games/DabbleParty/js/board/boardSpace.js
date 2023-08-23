"use strict";
var BoardSpace = /** @class */ (function () {
    function BoardSpace(spaceType, gameX, gameY, label) {
        if (label === void 0) { label = ""; }
        this.spaceType = spaceType;
        this.gameX = gameX;
        this.gameY = gameY;
        this.label = label;
        this.nextSpaces = [];
        this.isPotentialGearSpace = false;
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
    BoardSpace.prototype.Draw = function (camera) {
        this.spaceType.getImageTile().Draw(camera, this.gameX, this.gameY, 0.2, 0.2, false, false, 0, 1);
        var coord1 = camera.GameCoordToCanvas(this.gameX, this.gameY);
        camera.ctx.font = "200 " + 10 + "px " + "arial";
        camera.ctx.fillText(this.id.toString(), coord1.canvasX, coord1.canvasY);
    };
    BoardSpace.prototype.DrawConnections = function (camera) {
        camera.ctx.fillStyle = "#3f454a";
        camera.ctx.strokeStyle = "#3f454a";
        camera.ctx.lineWidth = camera.scale * 4;
        if (board) {
            camera.ctx.lineDashOffset = (-board.timer) * 0.1;
        }
        var ratio = (((board === null || board === void 0 ? void 0 : board.timer) || 0) % 60) / 60;
        for (var _i = 0, _a = this.nextSpaces; _i < _a.length; _i++) {
            var connection = _a[_i];
            var coord1 = camera.GameCoordToCanvas(this.gameX, this.gameY);
            var coord2 = camera.GameCoordToCanvas(connection.gameX, connection.gameY);
            var coord3 = {
                canvasX: coord1.canvasX + (coord2.canvasX - coord1.canvasX) * ratio,
                canvasY: coord1.canvasY + (coord2.canvasY - coord1.canvasY) * ratio
            };
            camera.ctx.beginPath();
            camera.ctx.moveTo(coord1.canvasX, coord1.canvasY);
            camera.ctx.lineTo(coord2.canvasX, coord2.canvasY);
            camera.ctx.stroke();
            camera.ctx.beginPath();
            camera.ctx.ellipse(coord3.canvasX, coord3.canvasY, 6 * camera.scale, 4 * camera.scale, 0, 0, 2 * Math.PI);
            camera.ctx.fill();
        }
    };
    // auto-genenerate IDs for each space to make it easier to send cyclical JSON packages of board state
    BoardSpace.numConstructed = 0;
    BoardSpace.allConstructedSpaces = [];
    return BoardSpace;
}());
var BoardSpaceType = /** @class */ (function () {
    function BoardSpaceType(getImageTile, costsMovement, OnLand, OnPass) {
        this.getImageTile = getImageTile;
        this.costsMovement = costsMovement;
        this.OnLand = OnLand;
        this.OnPass = OnPass;
    }
    BoardSpaceType.DoNothing = function () { };
    BoardSpaceType.BlueBoardSpace = new BoardSpaceType(function () { return tiles["partySquares"][0][0]; }, true, function (player) {
        var coinValue = (board === null || board === void 0 ? void 0 : board.IsInLast5Turns()) ? 6 : 3;
        if (board)
            cutsceneService.AddScene(new BoardCutSceneAddCoins(coinValue, player));
    }, BoardSpaceType.DoNothing);
    BoardSpaceType.RedBoardSpace = new BoardSpaceType(function () { return tiles["partySquares"][0][1]; }, true, function (player) {
        if (player.coins < 0)
            player.coins = 0;
        var coinValue = (board === null || board === void 0 ? void 0 : board.IsInLast5Turns()) ? 6 : 3;
        if (board)
            cutsceneService.AddScene(new BoardCutSceneAddCoins(-coinValue, player));
    }, BoardSpaceType.DoNothing);
    BoardSpaceType.DiceUpgradeSpace = new BoardSpaceType(function () { return tiles["partySquares"][0][4]; }, true, function (player) {
        if (board)
            cutsceneService.AddScene(new BoardCutSceneChangeDice("up", player, 2));
    }, BoardSpaceType.DoNothing);
    BoardSpaceType.GrayBoardSpace = new BoardSpaceType(function () { return tiles["partySquares"][0][2]; }, false, BoardSpaceType.DoNothing, BoardSpaceType.DoNothing);
    BoardSpaceType.ShopSpace = new BoardSpaceType(function () { return tiles["partySquares"][1][2]; }, true, function (player) {
        // TODO - full inventory?
        // TODO - special bonus for landing on space?
        player.landedOnShop = true;
        BoardSpaceType.ShopSpace.OnPass(player);
    }, function (player) {
        if (player.inventory.length >= 3) {
            // full inventory
            player.landedOnShop = false;
        }
        else {
            player.isInShop = true;
            if (board)
                board.boardUI.currentMenu = BoardMenu.CreateShopMenu();
        }
    });
    BoardSpaceType.TwitchSpace = new BoardSpaceType(function () { return tiles["partySquares"][0][3]; }, true, function (player) {
        if (board)
            cutsceneService.AddScene(new BoardCutSceneTwitchSpace(player));
    }, BoardSpaceType.DoNothing);
    BoardSpaceType.GearSpace = new BoardSpaceType(function () { return tiles["partySquares"][1][3]; }, true, function (player) {
        player.landedOnShop = true;
        BoardSpaceType.GearSpace.OnPass(player);
    }, function (player) {
        player.isInShop = true;
        if (board)
            board.boardUI.currentMenu = BoardMenu.CreateGoldGearMenu();
    });
    BoardSpaceType.WallopSpace = new BoardSpaceType(function () { return tiles["partySquares"][1][5]; }, true, function (player) {
        player.landedOnShop = true;
        BoardSpaceType.WallopSpace.OnPass(player);
    }, function (player) {
        player.isInShop = true;
        if (board)
            board.boardUI.currentMenu = BoardMenu.CreateWallopMenu();
    });
    BoardSpaceType.BiodomeEntryBoardSpace = new BoardSpaceType(function () { return tiles["partySquares"][0][2]; }, false, BoardSpaceType.DoNothing, function (player) {
        player.isInShop = true;
        if (board)
            board.boardUI.currentMenu = BoardMenu.CreateBiodomeMenu();
    });
    BoardSpaceType.Warp1BoardSpace = new BoardSpaceType(function () { return tiles["partySquares"][0][2]; }, false, BoardSpaceType.DoNothing, function (player) {
        player.isInShop = true;
        if (board)
            board.boardUI.currentMenu = BoardMenu.CreateWarpPointMenu("warp2");
    });
    BoardSpaceType.Warp2BoardSpace = new BoardSpaceType(function () { return tiles["partySquares"][0][2]; }, false, BoardSpaceType.DoNothing, function (player) {
        player.isInShop = true;
        if (board)
            board.boardUI.currentMenu = BoardMenu.CreateWarpPointMenu("warp1");
    });
    return BoardSpaceType;
}());
