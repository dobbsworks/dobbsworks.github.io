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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var BoardCutSceneIntro = /** @class */ (function (_super) {
    __extends(BoardCutSceneIntro, _super);
    function BoardCutSceneIntro() {
        return _super.call(this, function () {
            if (!board)
                return;
            board.currentRound = 0;
            board.players.forEach(function (a) { return a.coins = 10; });
            var xs = GetEndOfGameTokenLocations();
            var tokenSprites = board.players.map(function (p, i) { return new SimpleSprite(xs[i], 380, tiles["boardTokens"][p.avatarIndex][0]).Scale(0.5); });
            var diceSprites = board.players.map(function (p, i) { return new DiceSprite(xs[i], -350, 10, false); });
            cutsceneService.AddScene(new BoardCutSceneSetBackdrop(board.blurTile), new BoardCutSceneSingleAction(function () {
                var _a;
                (_a = BoardCutScene.sprites).push.apply(_a, __spreadArrays(tokenSprites, diceSprites));
            }), new BoardCutSceneFadeIn(), new BoardCutSceneBoardLogo(), new BoardCutSceneDialog(board.introText + " First, let's decide who goes first."), new BoardCutSceneDecideOrder(), new BoardCutSceneFadeOut(), new BoardCutSceneSetBackdrop(null), new BoardCutSceneFadeIn(), new BoardCutSceneMoveGear(true));
        }) || this;
    }
    return BoardCutSceneIntro;
}(BoardCutSceneSingleAction));
var BoardCutSceneBoardLogo = /** @class */ (function (_super) {
    __extends(BoardCutSceneBoardLogo, _super);
    function BoardCutSceneBoardLogo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        _this.y = -400;
        return _this;
    }
    BoardCutSceneBoardLogo.prototype.Update = function () {
        this.timer++;
        if (this.timer < 300) {
            this.y *= 0.98;
        }
        else {
            this.y -= 1;
            this.y *= 1.05;
        }
        if (this.timer > 300) {
            BoardCutScene.sprites.filter(function (a) { return !(a instanceof DiceSprite); }).forEach(function (a) {
                a.y -= (a.y - 80) * 0.05;
            });
        }
        if (this.timer > 400)
            this.isDone = true;
    };
    BoardCutSceneBoardLogo.prototype.Draw = function (camera) {
        var logo = board === null || board === void 0 ? void 0 : board.logo;
        if (logo)
            logo.Draw(camera, 0, this.y, 1.5, 1.5, false, false, 0);
    };
    return BoardCutSceneBoardLogo;
}(BoardCutScene));
var BoardCutSceneDecideOrder = /** @class */ (function (_super) {
    __extends(BoardCutSceneDecideOrder, _super);
    function BoardCutSceneDecideOrder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        _this.jumpTimes = [140, 240, 160, 300];
        _this.rolls = [];
        _this.followUp = null;
        return _this;
    }
    BoardCutSceneDecideOrder.prototype.Update = function () {
        if (this.timer == 0 && board) {
            var possibleRolls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            // if > 10 players, we need more possible numbers!
            while (possibleRolls.length < board.players.length) {
                possibleRolls.push(possibleRolls.length + 1);
            }
            var _loop_1 = function (i) {
                var roll = Random.SeededRandFrom(possibleRolls);
                possibleRolls = possibleRolls.filter(function (a) { return a != roll; });
                this_1.rolls.push(roll);
            };
            var this_1 = this;
            for (var i = 0; i < board.players.length; i++) {
                _loop_1(i);
            }
            while (this.jumpTimes.length < board.players.length) {
                this.jumpTimes.push(120 + Math.floor(Math.random() * 200));
            }
        }
        this.timer++;
        var dice = BoardCutScene.sprites.filter(function (a) { return a instanceof DiceSprite; });
        dice.forEach(function (a) { return a.Update(); });
        if (this.timer < 100)
            dice.forEach(function (a) { return a.y += 2; });
        for (var idx = 0; idx < this.jumpTimes.length; idx++) {
            var time = this.jumpTimes[idx];
            var diceSprite = dice[idx];
            if (diceSprite && this.timer == time) {
                diceSprite.Stop();
                diceSprite.chosenValue = this.rolls[idx];
            }
        }
        if (this.timer > 360) {
            BoardCutScene.sprites.forEach(function (a) { return a.y *= 1.04; });
        }
        if (this.timer == 400) {
            this.isDone = true;
            if (board) {
                board.currentRound = 1;
                // set order
                var turn = 1;
                for (var i = 10; i > 0; i--) {
                    var pIndex = this.rolls.indexOf(i);
                    if (pIndex > -1) {
                        board.players[pIndex].turnOrder = turn;
                        turn++;
                    }
                }
                var playersInOrder = [1, 2, 3, 4].map(function (b) { var _a; return (_a = board.players.find(function (a) { return a.turnOrder == b; })) === null || _a === void 0 ? void 0 : _a.avatarName; });
                var filler = "nobody";
                var text = "First is " + (playersInOrder[0] || filler) + ", second is " + (playersInOrder[1] || filler) + ", " +
                    ("third is " + (playersInOrder[2] || filler) + ", and " + (playersInOrder[3] || filler) + " will go last. ") +
                    "And to get things going, you'll each start with 10 coins. Good luck!";
                this.followUp = new BoardCutSceneDialog(text);
            }
        }
    };
    BoardCutSceneDecideOrder.prototype.Draw = function (camera) { };
    BoardCutSceneDecideOrder.prototype.GetFollowUpCutscenes = function () {
        if (this.followUp)
            return [this.followUp];
        return [];
    };
    return BoardCutSceneDecideOrder;
}(BoardCutScene));
