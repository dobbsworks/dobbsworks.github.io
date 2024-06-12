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
var EndOfGameBonusGear = /** @class */ (function () {
    function EndOfGameBonusGear(title, description, scoring) {
        this.title = title;
        this.description = description;
        this.scoring = scoring;
    }
    EndOfGameBonusGear.HighRoller = new EndOfGameBonusGear("High Roller", "This gear is awarded to the player with the highest total dice rolls across the game.", function (player) { return player.statDiceTotal; });
    EndOfGameBonusGear.SlowAndSteady = new EndOfGameBonusGear("Slow And Steady", "This gear is awarded to the player with the lowest total dice rolls across the game.", function (player) { return -player.statDiceTotal; });
    EndOfGameBonusGear.BigSpender = new EndOfGameBonusGear("Big Spender", "This gear is awarded to the player who spent the most on non-gear purchases.", function (player) { return player.statNonGearSpending; });
    EndOfGameBonusGear.Thrifty = new EndOfGameBonusGear("Thrifty", "This gear is awarded to the player who spent the least on non-gear purchases.", function (player) { return -player.statNonGearSpending; });
    EndOfGameBonusGear.Tryhard = new EndOfGameBonusGear("Tryhard", "This gear is awarded to the player who earned the most coins from minigames.", function (player) { return player.statMinigameWinnings; });
    EndOfGameBonusGear.Casual = new EndOfGameBonusGear("Casual", "This gear is awarded to the player who earned the least coins from minigames.", function (player) { return -player.statMinigameWinnings; });
    EndOfGameBonusGear.SightSeer = new EndOfGameBonusGear("Sightseer", "This gear is awarded to the player who landed on the highest number of unique space types.", function (player) { return player.statListOfLandings.filter(onlyUnique).length; });
    EndOfGameBonusGear.Random = new EndOfGameBonusGear("Rigged", "In true party game spirit, this rare gear is awarded to a random player. Yes, really.", function (player) { return Math.random(); });
    return EndOfGameBonusGear;
}());
function GetBonusGearTypes() {
    var allBonusGears = Object.values(EndOfGameBonusGear);
    var ret = [];
    var _loop_1 = function (i) {
        var gearType = allBonusGears[Math.floor(Math.random() * allBonusGears.length)];
        allBonusGears = allBonusGears.filter(function (a) { return a != gearType; });
        ret.push(gearType);
    };
    for (var i = 0; i < 3; i++) {
        _loop_1(i);
    }
    return ret;
}
var BoardCutSceneGameEnd = /** @class */ (function (_super) {
    __extends(BoardCutSceneGameEnd, _super);
    function BoardCutSceneGameEnd() {
        return _super.call(this, function () {
            if (!board)
                return;
            board.players.sort(function (a, b) { return a.turnOrder - b.turnOrder; });
            var bonusGears = GetBonusGearTypes();
            var bonusWinnerIndeces = [];
            var _loop_2 = function (bonusGearType) {
                var scores = board.players.map(bonusGearType.scoring);
                var maxScore = Math.max.apply(Math, scores);
                var winners = board.players.map(function (a, i) { return i; }).filter(function (i) { return scores[i] == maxScore; });
                bonusWinnerIndeces.push(winners);
            };
            for (var _i = 0, bonusGears_1 = bonusGears; _i < bonusGears_1.length; _i++) {
                var bonusGearType = bonusGears_1[_i];
                _loop_2(bonusGearType);
            }
            var xs = GetEndOfGameTokenLocations();
            var tokenSprites = board.players.map(function (p, i) { return new SimpleSprite(xs[i], 80, tiles["boardTokens"][p.avatarIndex][0]).Scale(0.5); });
            cutsceneService.AddScene(new BoardCutSceneFadeOut(), new BoardCutSceneSetBackdrop(board.blurTile), new BoardCutSceneSingleAction(function () {
                var _a;
                (_a = BoardCutScene.sprites).push.apply(_a, tokenSprites);
            }), new BoardCutSceneFadeIn(), new BoardCutSceneDialog("That's the end of the rounds. What a game it's been! Now let's get ready to tally up the results.\\Let's see who wound up with the most gears!"), new BoardCutSceneShowGearOrCoinCounts(tiles["uiLargeIcons"][0][0], 2, function (p) { return p.gears; }), new BoardCutSceneDialog("Next let's take a look at the final coin counts."), new BoardCutSceneShowGearOrCoinCounts(tiles["uiLargeIcons"][0][1], 3, function (p) { return p.coins; }), new BoardCutSceneDialog("But we aren't done yet, we still need to award the three bonus gears!"), new BoardCutSceneDialog("This first bonus is the " + bonusGears[0].title + " award! " + bonusGears[0].description + " The winner is..."), new BoardCutSceneAwardBonusGear(bonusWinnerIndeces[0]), new BoardCutSceneDialog(JoinPlayers(bonusWinnerIndeces[0].map(function (i) { return board === null || board === void 0 ? void 0 : board.players[i]; })) + "!\\" +
                ("The second bonus is the " + bonusGears[1].title + " award! " + bonusGears[1].description + " The winner is...")), new BoardCutSceneAwardBonusGear(bonusWinnerIndeces[1]), new BoardCutSceneDialog(JoinPlayers(bonusWinnerIndeces[1].map(function (i) { return board === null || board === void 0 ? void 0 : board.players[i]; })) + "!\\" +
                ("The final bonus is the " + bonusGears[2].title + " award! " + bonusGears[2].description + " The winner is...")), new BoardCutSceneAwardBonusGear(bonusWinnerIndeces[2]), new BoardCutSceneDialog(JoinPlayers(bonusWinnerIndeces[2].map(function (i) { return board === null || board === void 0 ? void 0 : board.players[i]; })) + "!\\" +
                "Now it's time to tally the final results."), new BoardCutSceneFinalResults(tokenSprites), new BoardCutSceneSingleAction(function () { BoardCutScene.sprites = []; }), new BoardCutSceneStats(), new BoardCutSceneFadeOut(), new BoardCutSceneSetBackdrop(null));
        }) || this;
    }
    return BoardCutSceneGameEnd;
}(BoardCutSceneSingleAction));
function GetEndOfGameTokenLocations() {
    if (!board)
        return [];
    var tokenSpread = 600;
    var xIter = -tokenSpread / 2;
    var distanceBetweenTokens = tokenSpread / (board.players.length - 1);
    var ret = [];
    for (var _i = 0, _a = board.players; _i < _a.length; _i++) {
        var token = _a[_i];
        ret.push(xIter);
        xIter += distanceBetweenTokens;
    }
    return ret;
}
var BoardCutSceneShowGearOrCoinCounts = /** @class */ (function (_super) {
    __extends(BoardCutSceneShowGearOrCoinCounts, _super);
    function BoardCutSceneShowGearOrCoinCounts(icon, iconScale, calc) {
        var _this = _super.call(this) || this;
        _this.icon = icon;
        _this.iconScale = iconScale;
        _this.calc = calc;
        _this.timer = 0;
        _this.isDismissed = false;
        _this.y = 0;
        return _this;
    }
    BoardCutSceneShowGearOrCoinCounts.prototype.Update = function () {
        this.timer++;
        if (this.timer == 20 && !this.isDismissed) {
            audioHandler.PlaySound("dobbloon", true);
        }
        if (this.timer <= 30 && !this.isDismissed) {
            this.y = -(Math.sin(this.timer / 30 * Math.PI / 2) * 150);
        }
        if (this.isDismissed) {
            this.y = -450 + (Math.cos(this.timer / 30 * Math.PI / 2) * 300);
            if (this.y < -430)
                this.isDone = true;
        }
        if (this.timer > 100 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.isDismissed = true;
            this.timer = 0;
        }
    };
    BoardCutSceneShowGearOrCoinCounts.prototype.Draw = function (camera) {
        var _this = this;
        if (!board)
            return;
        var cam = new Camera(camera.canvas);
        var xs = GetEndOfGameTokenLocations();
        var maxCount = Math.max.apply(Math, board.players.map(this.calc));
        board.players.forEach(function (p, i) {
            _this.icon.Draw(cam, xs[i], _this.y, _this.iconScale, _this.iconScale, false, false, 0);
            var numScale = 0.75;
            if (_this.calc(p) == maxCount) {
                numScale += Math.sin(_this.timer / 20) / 6;
            }
            DrawNumber(xs[i], _this.y, _this.calc(p), cam, numScale);
        });
    };
    return BoardCutSceneShowGearOrCoinCounts;
}(BoardCutScene));
var BoardCutSceneAwardBonusGear = /** @class */ (function (_super) {
    __extends(BoardCutSceneAwardBonusGear, _super);
    function BoardCutSceneAwardBonusGear(winnerIndeces) {
        var _this = _super.call(this) || this;
        _this.winnerIndeces = winnerIndeces;
        _this.timer = 0;
        _this.y = -400;
        _this.xs = [0];
        return _this;
    }
    BoardCutSceneAwardBonusGear.prototype.Update = function () {
        var _this = this;
        if (!board)
            return;
        this.timer++;
        if (this.timer == 2) {
            audioHandler.PlaySound("drumroll", true);
        }
        var xs = GetEndOfGameTokenLocations();
        if (this.timer < 350) {
            this.y += 2;
            if (this.y > -150)
                this.y = -150;
            var rangeScale = 1;
            if (this.timer > 200) {
                rangeScale = (300 - this.timer) / 100;
                if (rangeScale < 0)
                    rangeScale = 0;
            }
            this.xs = [Math.sin(this.timer / 10) * xs[0] * rangeScale];
        }
        if (this.timer == 350) {
            this.xs = this.winnerIndeces.map(function (a) { return 0; });
            audioHandler.StopSound("drumroll");
            audioHandler.PlaySound("drumrollend", true);
        }
        if (this.timer > 350) {
            this.winnerIndeces.forEach(function (winnerIndex, i) {
                var targetX = xs[winnerIndex];
                _this.xs[i] += (targetX - _this.xs[i]) * 0.2;
                if (_this.timer == 400) {
                    _this.xs[i] = targetX;
                }
            });
        }
        if (this.timer > 400) {
            this.y *= 0.9;
        }
        if (this.timer > 430) {
            this.winnerIndeces.forEach(function (i) {
                if (board)
                    board.players[i].gears += 1;
            });
            this.isDone = true;
        }
    };
    BoardCutSceneAwardBonusGear.prototype.Draw = function (camera) {
        var _this = this;
        var gearIcon = tiles["uiLargeIcons"][0][0];
        if (!board)
            return;
        var cam = new Camera(camera.canvas);
        this.xs.forEach(function (x) {
            gearIcon.Draw(cam, x, _this.y, 2, 2, false, false, 0);
        });
    };
    return BoardCutSceneAwardBonusGear;
}(BoardCutScene));
var BoardCutSceneFinalResults = /** @class */ (function (_super) {
    __extends(BoardCutSceneFinalResults, _super);
    function BoardCutSceneFinalResults(sprites) {
        var _this = _super.call(this) || this;
        _this.sprites = sprites;
        _this.timer = 0;
        _this.removeTimer = 0;
        _this.removeIndeces = []; // player index from last to 2nd place
        _this.fallingSprites = [];
        _this.textY = 500;
        _this.winnerIndeces = [];
        return _this;
    }
    BoardCutSceneFinalResults.prototype.Initialize = function () {
        var _a;
        audioHandler.SetBackgroundMusic("silence");
        audioHandler.PlaySound("drumroll", true);
        if (!board)
            return;
        var targetPlace = Math.max.apply(Math, board.players.map(function (a) { return a.CurrentPlace(); })); // last place
        while (targetPlace > 1) {
            var playersInTargetPlace = board.players.filter(function (a) { return a.CurrentPlace() == targetPlace; });
            (_a = this.removeIndeces).push.apply(_a, playersInTargetPlace.map(function (a) { return board.players.indexOf(a); }));
            targetPlace--;
        }
        this.winnerIndeces = board.players.filter(function (a) { return a.CurrentPlace() == 1; }).map(function (a) { return board === null || board === void 0 ? void 0 : board.players.indexOf(a); });
        this.timer = 2;
    };
    BoardCutSceneFinalResults.prototype.Update = function () {
        var _this = this;
        var _a;
        if (this.timer <= 1)
            this.Initialize();
        this.timer++;
        if (this.timer < 3000) {
            for (var i = 0; i < this.sprites.length; i++) {
                var sprite = this.sprites[i];
                var offset = [5, 15, 1, 3][i % 4];
                sprite.x += Math.cos((this.timer + offset) / 30) * 0.5;
                sprite.y += Math.sin((this.timer + offset) / 30) * 0.5;
                if (this.fallingSprites.indexOf(sprite) > -1) {
                    sprite.y *= 1.05;
                }
            }
            if (this.timer >= 300) {
                this.removeTimer++;
                if (this.removeTimer >= 100) {
                    this.removeTimer = 0;
                    audioHandler.PlaySound("hurt", true);
                    var playerIndex_1 = (_a = this.removeIndeces.shift()) !== null && _a !== void 0 ? _a : -1;
                    var sprite = this.sprites[playerIndex_1];
                    this.fallingSprites.push(sprite);
                    if (this.fallingSprites.length == 2) {
                        this.removeTimer = -200;
                    }
                    if (this.removeIndeces.length == 0) {
                        this.timer = 2900;
                        audioHandler.StopSound("drumroll");
                        audioHandler.PlaySound("drumrollend", true);
                        audioHandler.SetBackgroundMusic("jazzy");
                    }
                }
            }
        }
        else if (this.timer < 3300) {
            var spread = 300 * (this.winnerIndeces.length - 1);
            for (var i = 0; i < this.winnerIndeces.length; i++) {
                var winnerIndex = this.winnerIndeces[i];
                var targetX = (-spread / 2) + 300 * i;
                this.sprites[winnerIndex].x -= (this.sprites[winnerIndex].x - targetX) * 0.05;
            }
            this.sprites.forEach(function (a) { return a.x *= 0.95; });
            this.winnerIndeces.forEach(function (i) { return _this.sprites[i].y -= (_this.sprites[i].y + 30) * 0.05; });
            this.textY *= 0.98;
        }
        else {
            this.sprites.forEach(function (a) { return a.y += 5; });
            this.textY += 5;
            if (this.timer > 3400)
                this.isDone = true;
        }
    };
    BoardCutSceneFinalResults.prototype.Draw = function (camera) {
        if (!board)
            return;
        if (this.winnerIndeces.length) {
            var winnerIndex = this.winnerIndeces[Math.floor(this.timer / 60) % this.winnerIndeces.length];
            var avatarIndex = board.players[winnerIndex].avatarIndex;
            var image = tiles["turnStartText"][2][avatarIndex];
            var cam = new Camera(camera.canvas);
            image.Draw(cam, 0, this.textY + 150, 1, 1, false, false, 0);
        }
        else {
            console.log("UH OH, no winners?!");
        }
    };
    return BoardCutSceneFinalResults;
}(BoardCutScene));
var BoardCutSceneStats = /** @class */ (function (_super) {
    __extends(BoardCutSceneStats, _super);
    function BoardCutSceneStats() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.baseY = 900;
        _this.spaceTypes = [
            { space: BoardSpaceType.BlueBoardSpace, includePasses: false },
            { space: BoardSpaceType.RedBoardSpace, includePasses: false },
            { space: BoardSpaceType.DiceUpgradeSpace, includePasses: false },
            { space: BoardSpaceType.TwitchSpace, includePasses: false },
            { space: BoardSpaceType.GearSpace, includePasses: true },
            { space: BoardSpaceType.ShopSpace, includePasses: true },
            { space: BoardSpaceType.WallopSpace, includePasses: true },
        ];
        _this.playerScroll = 0;
        return _this;
    }
    BoardCutSceneStats.prototype.Update = function () {
        this.baseY *= 0.95;
        if (this.baseY < 1)
            this.baseY = 0;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.isDone = true;
            cutsceneService.AddScene(new BoardCutSceneFadeOut(), new BoardCutSceneSingleAction(function () {
                PostgameCleanup();
            }), new CutsceneMainMenu());
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            this.playerScroll++;
            var max = board.players.length - 4;
            if (this.playerScroll > max)
                this.playerScroll = max;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            this.playerScroll--;
            if (this.playerScroll < 0)
                this.playerScroll = 0;
        }
    };
    BoardCutSceneStats.prototype.Draw = function (camera) {
        if (!board)
            return;
        var cam = new Camera(camera.canvas);
        cam.ctx.fillStyle = "#0006";
        cam.ctx.fillRect(0, 0 + this.baseY, 960, 540);
        cam.x = 480;
        cam.y = 270;
        var headerY = 50 + this.baseY;
        for (var i = 0; i < this.spaceTypes.length; i++) {
            var spaceType = this.spaceTypes[i];
            var x = 355 + i * 90;
            var imageTile = spaceType.space.getImageTile();
            imageTile.Draw(cam, x, headerY, 0.5, 0.5, false, false, 0);
        }
        var gearIcon = tiles["uiLargeIcons"][0][0];
        var coinIcon = tiles["uiLargeIcons"][0][1];
        gearIcon.Draw(cam, 355 - 180, headerY, 1.5, 1.5, false, false, 0);
        coinIcon.Draw(cam, 355 - 90, headerY, 1.5, 1.5, false, false, 0);
        cam.ctx.fillStyle = "#0006";
        cam.ctx.fillRect(125, 100 + this.baseY, 810, 360);
        cam.ctx.fillStyle = "#0002";
        cam.ctx.fillRect(125, 190 + this.baseY, 810, 90);
        cam.ctx.fillRect(125, 370 + this.baseY, 810, 90);
        for (var i = 0; i < 4; i++) {
            cam.ctx.fillRect(125 + 90 + 90 * 2 * i, 100 + this.baseY, 90, 360);
        }
        var mainFontSize = 40;
        cam.ctx.textAlign = "center";
        cam.ctx.fillStyle = "#FFF";
        var players = __spreadArrays(board.players);
        players.sort(function (a, b) { return a.CurrentPlace() - b.CurrentPlace(); });
        for (var pindex = this.playerScroll; pindex < 4 + this.playerScroll; pindex++) {
            var player = players[pindex];
            if (!player)
                continue;
            var y = pindex * 90 + 175 - 10 + this.baseY;
            var avatar = tiles["boardTokens"][player.avatarIndex][0];
            avatar.Draw(cam, 65, y, 0.4, 0.4, false, false, 0);
            cam.ctx.font = "700 " + mainFontSize + "px " + "arial";
            cam.ctx.fillText(player.gears.toString(), 355 - 180, y - mainFontSize / 2 + 20);
            cam.ctx.fillText(player.coins.toString(), 355 - 90, y - mainFontSize / 2 + 20);
            var _loop_3 = function (i) {
                var spaceType = this_1.spaceTypes[i];
                var x = 355 + i * 90;
                var landings = player.statListOfLandings.filter(function (a) { return a == spaceType.space; }).length;
                var passings = player.statListOfPassings.filter(function (a) { return a == spaceType.space; }).length;
                if (spaceType.includePasses) {
                    cam.ctx.font = "700 " + mainFontSize * 0.75 + "px " + "arial";
                    cam.ctx.fillText(landings.toString(), x, y - mainFontSize / 2 - 10);
                    cam.ctx.fillText("(" + passings.toString() + ")", x, y - mainFontSize / 2 + 20);
                }
                else {
                    cam.ctx.font = "700 " + mainFontSize + "px " + "arial";
                    cam.ctx.fillText(landings.toString(), x, y - mainFontSize / 2 + 20);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.spaceTypes.length; i++) {
                _loop_3(i);
            }
        }
        cam.ctx.font = "400 " + 20 + "px " + "arial";
        cam.ctx.textAlign = "right";
        cam.ctx.fillText("(X) is # of times passed without landing", 960 - 25, 530 + this.baseY);
    };
    return BoardCutSceneStats;
}(BoardCutScene));
