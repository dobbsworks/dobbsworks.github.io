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
        this.isPlaceholder = true;
    }
    BoardItem.prototype.OnPurchase = function (player) { };
    return BoardItem;
}());
var ShopItemGoldenGear = /** @class */ (function (_super) {
    __extends(ShopItemGoldenGear, _super);
    function ShopItemGoldenGear() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][2][1];
        _this.name = "Golden Gear";
        _this.description = "Collect the most gears to win the game!";
        return _this;
    }
    ShopItemGoldenGear.prototype.OnUse = function (player, board) {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    };
    ShopItemGoldenGear.prototype.OnPurchase = function (player) { player.gears += 1; };
    return ShopItemGoldenGear;
}(BoardItem));
var ShopItemGoldenGearX2 = /** @class */ (function (_super) {
    __extends(ShopItemGoldenGearX2, _super);
    function ShopItemGoldenGearX2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][3][1];
        _this.name = "Golden Gear x2";
        _this.description = "Collect the most gears to win the game!";
        return _this;
    }
    ShopItemGoldenGearX2.prototype.OnUse = function (player, board) {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    };
    ShopItemGoldenGearX2.prototype.OnPurchase = function (player) { player.gears += 2; };
    return ShopItemGoldenGearX2;
}(BoardItem));
var ShopItemGoldenGearX3 = /** @class */ (function (_super) {
    __extends(ShopItemGoldenGearX3, _super);
    function ShopItemGoldenGearX3() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][4][1];
        _this.name = "Golden Gear x3";
        _this.description = "Collect the most gears to win the game!";
        return _this;
    }
    ShopItemGoldenGearX3.prototype.OnUse = function (player, board) {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    };
    ShopItemGoldenGearX3.prototype.OnPurchase = function (player) { player.gears += 3; };
    return ShopItemGoldenGearX3;
}(BoardItem));
var ShopItemStealCoins = /** @class */ (function (_super) {
    __extends(ShopItemStealCoins, _super);
    function ShopItemStealCoins() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][5][1];
        _this.name = "Steal coins";
        _this.description = "I'll smack the coins right out of 'em";
        return _this;
    }
    ShopItemStealCoins.prototype.OnUse = function (player, board) {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    };
    return ShopItemStealCoins;
}(BoardItem));
var ShopItemStealGears = /** @class */ (function (_super) {
    __extends(ShopItemStealGears, _super);
    function ShopItemStealGears() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][2][1];
        _this.name = "Steal a golden gear";
        _this.description = "All's fair in love, war, and party games";
        return _this;
    }
    ShopItemStealGears.prototype.OnUse = function (player, board) {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    };
    return ShopItemStealGears;
}(BoardItem));
var ShopItemEnterBiodome = /** @class */ (function (_super) {
    __extends(ShopItemEnterBiodome, _super);
    function ShopItemEnterBiodome() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][0][2];
        _this.name = "Enter the biodome";
        _this.description = "Look, I'm in the shop interface, wheeee";
        return _this;
    }
    ShopItemEnterBiodome.prototype.OnUse = function (player, board) {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    };
    return ShopItemEnterBiodome;
}(BoardItem));
var ShopItemEnterAndRaise = /** @class */ (function (_super) {
    __extends(ShopItemEnterAndRaise, _super);
    function ShopItemEnterAndRaise() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][1][2];
        _this.name = "Enter, & raise price";
        _this.description = "How did I get here let me out lol";
        return _this;
    }
    ShopItemEnterAndRaise.prototype.OnUse = function (player, board) {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    };
    return ShopItemEnterAndRaise;
}(BoardItem));
var ShopItemWarp = /** @class */ (function (_super) {
    __extends(ShopItemWarp, _super);
    function ShopItemWarp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][0][2];
        _this.name = "Warpetize me, cap'n!";
        _this.description = "4 days since last teleporter accident";
        return _this;
    }
    ShopItemWarp.prototype.OnUse = function (player, board) {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    };
    return ShopItemWarp;
}(BoardItem));
var BoardItemDevExit = /** @class */ (function (_super) {
    __extends(BoardItemDevExit, _super);
    function BoardItemDevExit() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][0][1];
        _this.name = "Dev Exit";
        _this.description = "Warps you close to the Golden Gear";
        _this.isPlaceholder = false;
        return _this;
    }
    BoardItemDevExit.prototype.OnUse = function (player, board) {
        var targetSpace = board.boardSpaces.find(function (a) { return a.spaceType == BoardSpaceType.GearSpace; });
        if (targetSpace) {
            targetSpace = board.boardSpaces.find(function (a) { return a.nextSpaces.indexOf(targetSpace) > -1; });
        }
        if (player.token && targetSpace) {
            player.token.currentSpace = targetSpace;
        }
        board.boardUI.StartRoll();
    };
    return BoardItemDevExit;
}(BoardItem));
var BoardItemWarpPortal = /** @class */ (function (_super) {
    __extends(BoardItemWarpPortal, _super);
    function BoardItemWarpPortal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imageTile = tiles["itemIcons"][1][1];
        _this.name = "Warp Portal";
        _this.description = "Swaps your position with any chosen player's";
        _this.isPlaceholder = false;
        return _this;
    }
    BoardItemWarpPortal.prototype.OnUse = function (player, board) {
        board.boardUI.currentMenu = BoardMenu.CreateSwapPlacesMenu();
    };
    return BoardItemWarpPortal;
}(BoardItem));
var BoardItemFragileDice = /** @class */ (function (_super) {
    __extends(BoardItemFragileDice, _super);
    function BoardItemFragileDice() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isPlaceholder = false;
        return _this;
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
var itemList = [];
function InitializeItemList() {
    itemList = [
        new BoardItemDevExit(),
        new BoardItemWarpPortal(),
        new BoardItemFragileD4(),
        new BoardItemFragileD6(),
        new BoardItemFragileD8(),
        new BoardItemFragileD10(),
        new BoardItemFragileD12(),
        new BoardItemFragileD20(),
    ];
}
