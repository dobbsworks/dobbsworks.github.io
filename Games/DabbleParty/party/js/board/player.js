"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Player = /** @class */ (function () {
    function Player(avatarIndex) {
        this.avatarIndex = avatarIndex;
        this.userId = -1;
        this.userName = "";
        this.coins = 10;
        this.displayedCoins = 10;
        this.gears = 1;
        this.diceBag = new DiceBag();
        this.inventory = [];
        this.turnOrder = 0;
        this.amountOfMovementLeft = 0;
        this.moving = false;
        this.selectedPathIndex = 0;
        this.isInShop = false;
        this.landedOnShop = false;
        // track stats for final bonuses/graph
        this.statDiceTotal = 0;
        this.statNonGearSpending = 0;
        this.statMinigameWinnings = 0;
        this.statListOfLandings = [];
        this.statListOfPassings = [];
    }
    Object.defineProperty(Player.prototype, "avatarName", {
        get: function () {
            return ["GameQueued", "germdove", "Al", "Turtle", "Dobbs", "Hover Cat", "Daesnek", "Panda", "Sunberry", "Ally", "Duffy", "Teddy", "Doopu"][this.avatarIndex];
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.Update = function () {
        var _this = this;
        if (this.token) {
            if (!cutsceneService.isCutsceneActive) {
                if (!this.isInShop) {
                    this.token.Update();
                    if (this.token.currentSpace && this.amountOfMovementLeft > 0) {
                        if (this.token.currentSpace.spaceType.costsMovement && this.moving) {
                            this.amountOfMovementLeft--;
                        }
                        var wasMoving = this.moving;
                        this.moving = true;
                        if (this.amountOfMovementLeft > 0) {
                            var options = this.token.currentSpace.nextSpaces;
                            if (options.length == 1) {
                                var nextSpace = options[0];
                                if (wasMoving) {
                                    this.token.currentSpace.spaceType.OnPass(this);
                                    if (this.token.currentSpace.spaceType.OnPass != BoardSpaceType.DoNothing) {
                                        this.statListOfPassings.push(this.token.currentSpace.spaceType);
                                    }
                                }
                                this.token.MoveToSpace(nextSpace);
                            }
                            else {
                                if (board) {
                                    this.isInShop = true;
                                    board.boardUI.currentMenu = new BoardMenuChoosePath(this.token.currentSpace, this);
                                }
                            }
                        }
                    }
                    if (this.token.currentSpace && this.amountOfMovementLeft == 0 && this.moving) {
                        this.moving = false;
                        this.token.currentSpace.spaceType.OnLand(this);
                        audioHandler.PlaySound("bwump", true);
                        this.statListOfLandings.push(this.token.currentSpace.spaceType);
                        setTimeout(function () {
                            var me = _this;
                            me.TurnOver();
                        }, 1000);
                    }
                }
            }
        }
    };
    Player.prototype.TurnOver = function () {
        var me = this;
        if (this.isInShop || cutsceneService.isCutsceneActive) {
            setTimeout(function () { me.TurnOver(); }, 1000);
        }
        else {
            board === null || board === void 0 ? void 0 : board.CurrentPlayerTurnEnd();
        }
    };
    Player.prototype.DrawToken = function (camera) {
        if (this.token) {
            var displayedMovementRemaining = this.amountOfMovementLeft;
            if (displayedMovementRemaining > 0) {
                DrawNumber(this.token.x, this.token.y - 100, displayedMovementRemaining, camera, 0.5);
            }
            this.token.Draw(camera);
        }
    };
    Player.prototype.CurrentPlace = function () {
        if (board) {
            var playersToSort = __spreadArrays(board.players);
            playersToSort.sort(function (a, b) { return (b.gears - a.gears) * 10000 + (b.displayedCoins - a.coins); });
            for (var rank = 1; rank <= 4; rank++) {
                var p = playersToSort[rank - 1];
                // weird compare below to handle ties
                if (this.gears == p.gears && this.displayedCoins == p.displayedCoins)
                    return rank;
            }
        }
        return -1;
    };
    Player.prototype.CurrentPlaceText = function () {
        var place = this.CurrentPlace();
        if (place < 1 || place > 4)
            return "";
        return NumberToOrdinal(place);
    };
    return Player;
}());
var DiceBag = /** @class */ (function () {
    // represents how many/what face dice a player rolls 
    // which can be upgraded as the game progresses
    function DiceBag(dieFaces) {
        if (dieFaces === void 0) { dieFaces = [6, 6]; }
        this.dieFaces = dieFaces;
        this.fragileFaces = [];
    }
    DiceBag.prototype.GetDiceSprites = function () {
        var ret = [];
        var numDice = this.dieFaces.length + this.fragileFaces.length;
        var space = 200;
        if (numDice == 2)
            space = 250;
        var x = -space * (numDice - 1) / 2;
        for (var _i = 0, _a = this.dieFaces; _i < _a.length; _i++) {
            var f = _a[_i];
            ret.push(new DiceSprite(x, -100, f, false));
            x += space;
        }
        for (var _b = 0, _c = this.fragileFaces; _b < _c.length; _b++) {
            var f = _c[_b];
            ret.push(new DiceSprite(x, -100, f, true));
            x += space;
        }
        this.fragileFaces = [];
        return ret;
    };
    DiceBag.prototype.Upgrade = function () {
        if (this.dieFaces.length > 0) {
            var minVal = Math.min.apply(Math, this.dieFaces);
            var index = this.dieFaces.indexOf(minVal);
            var newValue = (minVal >= 12 ? 20 : (minVal + 2));
            this.dieFaces[index] = newValue;
        }
    };
    DiceBag.prototype.Downgrade = function () {
        if (this.dieFaces.length > 0) {
            var maxValue = Math.max.apply(Math, this.dieFaces);
            var index = this.dieFaces.indexOf(maxValue);
            var newValue = (maxValue == 20 ? 12 : (maxValue == 4 ? 4 : (maxValue - 2)));
            this.dieFaces[index] = newValue;
        }
    };
    return DiceBag;
}());
