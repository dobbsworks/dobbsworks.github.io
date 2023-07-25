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
        this.token = null;
        this.coins = 30;
        this.gears = 1;
        this.diceBag = new DiceBag();
        this.inventory = [new BoardItemFragileD4(), new BoardItemFragileD10()];
        this.turnOrder = 0;
        this.amountOfMovementLeft = 0;
        this.moving = false;
        this.choosingPath = false;
        this.selectedPathIndex = 0;
        this.floatingText = "";
        this.floatingTextTimer = 0;
        this.floatingTextDirection = 1;
        this.floatingTextColor = 0;
        this.isInShop = false;
        this.landedOnShop = false;
    }
    Object.defineProperty(Player.prototype, "avatarName", {
        get: function () {
            return ["GameQueued", "germdove", "Al", "Turtle"][this.avatarIndex];
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.Update = function () {
        var _this = this;
        if (this.token) {
            if (!this.isInShop)
                this.token.Update();
            if (this.choosingPath && this.token.currentSpace) {
                var dirKeys = [KeyAction.Left, KeyAction.Right, KeyAction.Up, KeyAction.Down];
                if (dirKeys.some(function (a) { return KeyboardHandler.IsKeyPressed(a, true); })) {
                    this.selectedPathIndex++;
                    if (this.selectedPathIndex >= this.token.currentSpace.nextSpaces.length) {
                        this.selectedPathIndex = 0;
                    }
                }
                else if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                    var nextSpace = this.token.currentSpace.nextSpaces[this.selectedPathIndex];
                    this.token.MoveToSpace(nextSpace);
                    this.choosingPath = false;
                }
            }
            else {
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
                            if (wasMoving)
                                this.token.currentSpace.spaceType.OnPass(this);
                            this.token.MoveToSpace(nextSpace);
                        }
                        else {
                            this.choosingPath = true;
                            this.selectedPathIndex = 0;
                        }
                    }
                }
                if (this.token.currentSpace && this.amountOfMovementLeft == 0 && this.moving) {
                    this.moving = false;
                    this.token.currentSpace.spaceType.OnLand(this);
                    setTimeout(function () {
                        var me = _this;
                        me.TurnOver();
                    }, 1000);
                }
            }
            if (this.floatingText.length > 0) {
                this.floatingTextTimer++;
                if (this.floatingTextTimer > 50) {
                    this.floatingTextTimer = 0;
                    this.floatingText = "";
                }
            }
        }
    };
    Player.prototype.TurnOver = function () {
        var me = this;
        if (this.isInShop) {
            setTimeout(function () { me.TurnOver(); }, 1000);
        }
        else {
            board === null || board === void 0 ? void 0 : board.CurrentPlayerTurnEnd();
        }
    };
    Player.prototype.AddCoinsOverToken = function (amount) {
        this.floatingText = "+" + amount.toString();
        this.floatingTextColor = 3;
        this.floatingTextTimer = 0;
        this.floatingTextDirection = -1;
    };
    Player.prototype.DeductCoinsOverToken = function (amount) {
        this.floatingText = "-" + (Math.abs(amount)).toString();
        this.floatingTextColor = 4;
        this.floatingTextTimer = 0;
        this.floatingTextDirection = 1;
    };
    Player.prototype.DrawToken = function (camera) {
        if (this.token) {
            var currentSpace = this.token.currentSpace;
            if (this.choosingPath && currentSpace) {
                var nextSquares = currentSpace.nextSpaces;
                for (var i = 0; i < nextSquares.length; i++) {
                    var nextSquare = nextSquares[i];
                    var isSelected = this.selectedPathIndex == i;
                    var pulse = Math.sin(((board === null || board === void 0 ? void 0 : board.timer) || 0) / 10);
                    var scale = isSelected ? 1 + pulse / 8 : 1;
                    var angle = Math.atan2((nextSquare.gameY - currentSpace.gameY) * 2, nextSquare.gameX - currentSpace.gameX);
                    var distance = 75 + (isSelected ? pulse * 5 : 0);
                    var arrowImage = tiles["boardArrow"][i][0];
                    arrowImage.Draw(camera, this.token.x + distance * Math.cos(angle), this.token.y + distance * Math.sin(angle), 1 * scale, 0.5 * scale, false, false, angle);
                }
            }
            var displayedMovementRemaining = this.amountOfMovementLeft;
            if (displayedMovementRemaining > 0 && (this.token.currentSpace == null || this.choosingPath)) {
                DrawNumber(this.token.x, this.token.y - 100, displayedMovementRemaining, camera, 0.5);
            }
            this.token.Draw(camera);
            if (this.floatingText.length > 0) {
                var baseY = this.token.y - 100 + (this.floatingTextDirection == 1 ? 0 : 50);
                var y = this.token.y - 100 + this.floatingTextDirection * this.floatingTextTimer * 0.5;
                DrawText(this.token.x, y, this.floatingText, camera, 0.5, this.floatingTextColor);
            }
        }
    };
    Player.prototype.CurrentPlace = function () {
        if (board) {
            var playersToSort = __spreadArrays(board.players);
            playersToSort.sort(function (a, b) { return (b.gears - a.gears) * 10000 + (b.coins - a.coins); });
            for (var rank = 1; rank <= 4; rank++) {
                var p = playersToSort[rank - 1];
                // weird compare below to handle ties
                if (this.gears == p.gears && this.coins == p.coins)
                    return rank;
            }
        }
        return -1;
    };
    Player.prototype.CurrentPlaceText = function () {
        var place = this.CurrentPlace();
        if (place < 1 || place > 4)
            return "";
        return ["1st", "2nd", "3rd", "4th"][place - 1];
    };
    return Player;
}());
var DiceBag = /** @class */ (function () {
    function DiceBag() {
        // represents how many/what face dice a player rolls 
        // which can be upgraded as the game progresses
        this.dieFaces = [4];
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
