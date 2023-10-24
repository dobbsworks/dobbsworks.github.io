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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var BoardCutScene = /** @class */ (function () {
    function BoardCutScene() {
        this.isDone = false;
    }
    BoardCutScene.prototype.GetFollowUpCutscenes = function () { return []; };
    ;
    BoardCutScene.backdrop = null;
    BoardCutScene.sprites = [];
    return BoardCutScene;
}());
var BoardCutSceneAddCoins = /** @class */ (function (_super) {
    __extends(BoardCutSceneAddCoins, _super);
    function BoardCutSceneAddCoins(numCoins, player) {
        var _this = _super.call(this) || this;
        _this.numCoins = numCoins;
        _this.player = player;
        _this.timer = 0;
        _this.floatingText = numCoins > 0 ? ("+" + numCoins.toString()) : numCoins.toString();
        _this.floatingTextColor = numCoins > 0 ? 3 : 4;
        _this.floatingTextDirection = numCoins > 0 ? -1 : 1;
        return _this;
    }
    BoardCutSceneAddCoins.prototype.Update = function () {
        if (this.timer == 0)
            this.player.coins += this.numCoins;
        if (this.player.coins < 0)
            this.player.coins = 0;
        this.timer++;
        if (this.timer > 50) {
            this.isDone = true;
        }
    };
    BoardCutSceneAddCoins.prototype.Draw = function (camera) {
        if (!this.player.token)
            return;
        var y = this.player.token.y - 100 + this.floatingTextDirection * this.timer * 0.5;
        DrawText(this.player.token.x, y, this.floatingText, camera, 0.5, this.floatingTextColor);
    };
    return BoardCutSceneAddCoins;
}(BoardCutScene));
var BoardCutSceneChangeDice = /** @class */ (function (_super) {
    __extends(BoardCutSceneChangeDice, _super);
    function BoardCutSceneChangeDice(direction, player, numDiceUpgrades) {
        var _this = _super.call(this) || this;
        _this.direction = direction;
        _this.player = player;
        _this.numDiceUpgrades = numDiceUpgrades;
        _this.timer = 0;
        _this.diceIndecesToChange = [];
        _this.diceYOffset = 500;
        _this.scale = 1;
        var currentFaces = __spreadArrays(player.diceBag.dieFaces);
        currentFaces.sort(function (a, b) { return a - b; }); // numeric sort
        if (direction == "down")
            currentFaces.reverse();
        var facesToChange = currentFaces.slice(0, numDiceUpgrades);
        var _loop_1 = function (faceToChange) {
            var index = player.diceBag.dieFaces.findIndex(function (a, i) { return a == faceToChange && _this.diceIndecesToChange.indexOf(i) == -1; });
            // find first dicebag index that matches AND hasn't already been pulled in to our index list
            if (index == -1) {
                console.error("CAN'T FIND MATCHING DICE FACE");
            }
            else {
                this_1.diceIndecesToChange.push(index);
            }
        };
        var this_1 = this;
        for (var _i = 0, facesToChange_1 = facesToChange; _i < facesToChange_1.length; _i++) {
            var faceToChange = facesToChange_1[_i];
            _loop_1(faceToChange);
        }
        return _this;
    }
    BoardCutSceneChangeDice.prototype.Update = function () {
        var _a;
        this.timer++;
        if (this.timer <= 120) {
            this.diceYOffset = ((Math.cos((this.timer / 120) * Math.PI) + 1) / 2) * 200 + 50;
        }
        if (this.timer == 150) {
            this.scale = 1.5;
            if (this.direction == "up") {
                audioHandler.PlaySound("hit2", true);
                this.PerformUpgrade();
            }
            else {
                audioHandler.PlaySound("erase", true);
                this.PerformDowngrade();
            }
        }
        if (this.timer > 150) {
            (_a = this).scale = Math.pow(_a.scale, 0.9);
        }
        if (this.timer > 240) {
            this.diceYOffset = ((Math.cos(((360 - this.timer) / 120) * Math.PI) + 1) / 2) * 200 + 50;
        }
        if (this.timer == 360) {
            this.isDone = true;
        }
    };
    BoardCutSceneChangeDice.prototype.PerformUpgrade = function () {
        for (var _i = 0, _a = this.diceIndecesToChange; _i < _a.length; _i++) {
            var diceIndexToChange = _a[_i];
            var oldValue = this.player.diceBag.dieFaces[diceIndexToChange];
            var newValue = (oldValue >= 12 ? 20 : (oldValue + 2));
            this.player.diceBag.dieFaces[diceIndexToChange] = newValue;
        }
    };
    BoardCutSceneChangeDice.prototype.PerformDowngrade = function () {
        for (var _i = 0, _a = this.diceIndecesToChange; _i < _a.length; _i++) {
            var diceIndexToChange = _a[_i];
            var oldValue = this.player.diceBag.dieFaces[diceIndexToChange];
            var newValue = (oldValue == 20 ? 12 : (oldValue == 4 ? 4 : (oldValue - 2)));
            this.player.diceBag.dieFaces[diceIndexToChange] = newValue;
        }
    };
    BoardCutSceneChangeDice.prototype.Draw = function (camera) {
        if (!this.player.token)
            return;
        var totalSpace = 100;
        var spaceBetween = 0;
        var x = this.player.token.x;
        if (this.diceIndecesToChange.length > 1) {
            spaceBetween = totalSpace / (this.diceIndecesToChange.length - 1);
            x = this.player.token.x - totalSpace / 2;
        }
        var scale = 0.5 * this.scale;
        for (var _i = 0, _a = this.diceIndecesToChange; _i < _a.length; _i++) {
            var diceIndex = _a[_i];
            var faces = this.player.diceBag.dieFaces[diceIndex];
            var frameSheet = "d" + faces.toString();
            var dieImage = tiles[frameSheet][0][0];
            dieImage.Draw(camera, x, this.player.token.y - this.diceYOffset, scale, scale, false, false, 0);
            x += spaceBetween;
        }
    };
    return BoardCutSceneChangeDice;
}(BoardCutScene));
var BoardCutScenePadding = /** @class */ (function (_super) {
    __extends(BoardCutScenePadding, _super);
    function BoardCutScenePadding(paddingTicks) {
        if (paddingTicks === void 0) { paddingTicks = 20; }
        var _this = _super.call(this) || this;
        _this.paddingTicks = paddingTicks;
        _this.timer = 0;
        return _this;
    }
    BoardCutScenePadding.prototype.Update = function () {
        this.timer++;
        if (this.timer == this.paddingTicks) {
            this.isDone = true;
        }
    };
    BoardCutScenePadding.prototype.Draw = function (camera) { };
    return BoardCutScenePadding;
}(BoardCutScene));
var BoardCutSceneMoveGear = /** @class */ (function (_super) {
    __extends(BoardCutSceneMoveGear, _super);
    function BoardCutSceneMoveGear() {
        var _this = _super.call(this) || this;
        _this.timer = 0;
        _this.targetSpace = null;
        return _this;
    }
    BoardCutSceneMoveGear.prototype.Update = function () {
        if (!board)
            return;
        this.timer++;
        if (this.timer == 1)
            this.targetSpace = board.PlaceGearSpace();
        if (this.targetSpace)
            board.CameraFocusSpace(this.targetSpace);
        if (this.timer > 60)
            this.isDone = true;
    };
    BoardCutSceneMoveGear.prototype.Draw = function (camera) { };
    BoardCutSceneMoveGear.prototype.GetFollowUpCutscenes = function () {
        return [
            new BoardCutScenePadding(),
            new BoardCutSceneDialog("This is where the golden gear is now. Be the first one \nthere to buy a golden gear!"),
            (board === null || board === void 0 ? void 0 : board.currentPlayer) ? new BoardCutSceneFocusPlayer(board.currentPlayer) : new BoardCutScenePadding(),
            new BoardCutScenePadding(),
            new BoardCutScenePadding(),
            new BoardCutScenePadding()
        ];
    };
    ;
    return BoardCutSceneMoveGear;
}(BoardCutScene));
var BoardCutSceneAddItem = /** @class */ (function (_super) {
    __extends(BoardCutSceneAddItem, _super);
    function BoardCutSceneAddItem(item, player) {
        var _this = _super.call(this) || this;
        _this.item = item;
        _this.player = player;
        _this.timer = 0;
        _this.targetTimer = 70;
        return _this;
    }
    BoardCutSceneAddItem.prototype.Update = function () {
        this.timer++;
        if (this.timer == this.targetTimer) {
            if (!this.item.isPlaceholder) {
                this.player.inventory.push(this.item);
            }
            this.item.OnCollectItem(this.player);
            audioHandler.PlaySound("dobbloon", true);
            this.isDone = true;
        }
    };
    BoardCutSceneAddItem.prototype.Draw = function (camera) {
        var token = this.player.token;
        if (!token)
            return;
        if (this.timer > this.targetTimer)
            return;
        var timeLeft = this.targetTimer - this.timer;
        var scale = (timeLeft / this.targetTimer + 1) / 4;
        this.item.imageTile.Draw(camera, token.x, token.y - timeLeft - 30, scale, scale, false, false, 0);
    };
    BoardCutSceneAddItem.prototype.GetFollowUpCutscenes = function () {
        return [
            new BoardCutScenePadding(),
            new BoardCutSceneEmote(0, this.player),
            new BoardCutScenePadding()
        ];
    };
    ;
    return BoardCutSceneAddItem;
}(BoardCutScene));
var BoardCutSceneEmote = /** @class */ (function (_super) {
    __extends(BoardCutSceneEmote, _super);
    function BoardCutSceneEmote(emoteIndex, player) {
        var _this = _super.call(this) || this;
        _this.emoteIndex = emoteIndex;
        _this.player = player;
        _this.timer = 0;
        _this.targetTimer = 100;
        return _this;
    }
    BoardCutSceneEmote.prototype.Update = function () {
        this.timer++;
        if (this.timer == this.targetTimer) {
            this.isDone = true;
        }
    };
    BoardCutSceneEmote.prototype.Draw = function (camera) {
        var token = this.player.token;
        if (!token)
            return;
        if (this.timer > this.targetTimer)
            return;
        var imageTile = tiles["emote"][this.emoteIndex][0];
        var scale = 0.2;
        imageTile.Draw(camera, token.x + 40, token.y - 40, scale, scale, false, false, 0);
    };
    return BoardCutSceneEmote;
}(BoardCutScene));
var BoardCutSceneFocusPlayer = /** @class */ (function (_super) {
    __extends(BoardCutSceneFocusPlayer, _super);
    function BoardCutSceneFocusPlayer(player) {
        var _this = _super.call(this) || this;
        _this.player = player;
        return _this;
    }
    BoardCutSceneFocusPlayer.prototype.Update = function () {
        var _a, _b;
        if (board) {
            board.CameraFollow(this.player);
            var camDistance = (camera.x - (((_a = this.player.token) === null || _a === void 0 ? void 0 : _a.x) || 0)) + (camera.y - (((_b = this.player.token) === null || _b === void 0 ? void 0 : _b.y) || 0));
            if (camDistance < 5)
                this.isDone = true;
        }
    };
    BoardCutSceneFocusPlayer.prototype.Draw = function (camera) { };
    return BoardCutSceneFocusPlayer;
}(BoardCutScene));
var BoardCutSceneTwitchSpace = /** @class */ (function (_super) {
    __extends(BoardCutSceneTwitchSpace, _super);
    function BoardCutSceneTwitchSpace(player) {
        var _this = _super.call(this) || this;
        _this.player = player;
        _this.timer = 0;
        _this.ready = false;
        _this.panelWidth = 350;
        _this.chatOffset = 0;
        _this.isLocked = false;
        _this.lockTimer = 0;
        _this.timeToLockSpam = 360;
        _this.spams = [];
        _this.selectedSpam = null;
        return _this;
    }
    BoardCutSceneTwitchSpace.prototype.Update = function () {
        var _this = this;
        if (!this.ready) {
            var now = +(new Date());
            var timeSinceConfirm = now - twitchSpaceLockInTime;
            if (timeSinceConfirm < 1000 * 15) {
                // less than 15 seconds
                this.ready = true;
                this.InitializeSpam();
            }
            else {
                return;
            }
        }
        board === null || board === void 0 ? void 0 : board.CameraFollow(this.player);
        if (this.lockTimer < this.timeToLockSpam) {
            camera.targetX += 100;
            camera.targetScale = 2.5;
        }
        this.timer++;
        if (this.timer > 100 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.isLocked = true;
            this.selectedSpam = this.spams.find(function (a) { return a.y - _this.chatOffset == 280; }) || null;
        }
        if (!this.isLocked && Math.random() < 0.1) {
            this.chatOffset += 20;
            audioHandler.PlaySound("swim", true);
        }
        if (this.isLocked) {
            this.lockTimer++;
        }
        var totalHeight = Math.max.apply(Math, this.spams.map(function (a) { return a.y; })) + 20;
        if (this.chatOffset > totalHeight)
            this.chatOffset -= totalHeight;
        if (this.lockTimer == this.timeToLockSpam + 30) {
            if (this.selectedSpam)
                this.selectedSpam.action.processEvent(this.player);
            this.isDone = true;
        }
    };
    BoardCutSceneTwitchSpace.prototype.InitializeSpam = function () {
        var _a;
        var weights = Array.from(document.querySelectorAll("#twitchSpaceInput input")).map(function (a) { return +(a.value); });
        var actions = Object.values(TwitchSpaceAction);
        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
            var action = actions[actionIndex];
            var weight = weights[actionIndex];
            for (var i = 0; i < weight; i++) {
                this.spams.push({
                    name: "test",
                    text: Random.SeededRandFrom(action.spams),
                    action: action,
                    y: 0,
                    color: "#FFF",
                    nameWidth: 0
                });
            }
        }
        var heightPerRow = 20;
        var copyCount = Math.ceil(540 / heightPerRow);
        var originalCopy = this.spams.map(function (a) { return (__assign({}, a)); });
        for (var i = 0; i < copyCount; i++) {
            (_a = this.spams).push.apply(_a, originalCopy.map(function (a) { return (__assign({}, a)); }));
        }
        this.spams = Random.GetShuffledCopy(this.spams);
        this.spams.forEach(function (el, i) {
            el.y = i * heightPerRow;
            el.color = Random.SeededRandFrom(["Blue", " Coral", " DodgerBlue", " SpringGreen", " YellowGreen", " Green", " OrangeRed", " Red", " GoldenRod", " HotPink", " CadetBlue", " SeaGreen", " Chocolate", " BlueViolet", " Firebrick"]);
            camera.ctx.font = "700 " + 15 + "px " + "arial";
            el.name = GetRandomUserName();
            el.nameWidth = camera.ctx.measureText(el.name + ":").width;
            el.text = Random.SeededRandFrom(el.action.spams);
        });
    };
    BoardCutSceneTwitchSpace.prototype.Draw = function (camera) {
        var panelX = 960 - this.panelWidth;
        if (this.timer < 60) {
            panelX += (Math.pow(((60 - this.timer) / 60), 2)) * this.panelWidth;
        }
        if (this.lockTimer > this.timeToLockSpam) {
            panelX += (Math.pow(((this.lockTimer - this.timeToLockSpam) / 60), 2)) * this.panelWidth;
        }
        camera.ctx.fillStyle = "#18181b";
        camera.ctx.fillRect(panelX, 0, this.panelWidth, 540);
        camera.ctx.textAlign = "left";
        var totalHeight = Math.max.apply(Math, this.spams.map(function (a) { return a.y; })) + 20;
        for (var _i = 0, _a = this.spams; _i < _a.length; _i++) {
            var spam = _a[_i];
            for (var _b = 0, _c = [spam.y, spam.y + totalHeight]; _b < _c.length; _b++) {
                var lineY = _c[_b];
                var x = panelX + 20;
                if (this.selectedSpam && this.selectedSpam != spam) {
                    x += (Math.pow(((this.lockTimer - 20) / 20), 2)) * 5;
                }
                camera.ctx.font = "700 " + 15 + "px " + "arial";
                camera.ctx.fillStyle = spam.color;
                camera.ctx.fillText(spam.name + ": ", x, lineY - this.chatOffset);
                camera.ctx.font = "400 " + 15 + "px " + "arial";
                camera.ctx.fillStyle = "#efeff1";
                camera.ctx.fillText(spam.text, x + spam.nameWidth + 5, lineY - this.chatOffset);
            }
        }
    };
    return BoardCutSceneTwitchSpace;
}(BoardCutScene));
var BoardCutSceneDialog = /** @class */ (function (_super) {
    __extends(BoardCutSceneDialog, _super);
    function BoardCutSceneDialog(text) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.timer = 0;
        _this.appearMax = 20;
        _this.appearTimer = 0;
        _this.textTimer = 0;
        _this.pages = [];
        _this.charIndex = 0;
        _this.pages = text.split("\\").map(function (page) { return page.split("\n"); });
        _this.AutoSplitLines();
        return _this;
    }
    BoardCutSceneDialog.prototype.AutoSplitLines = function () {
        // split each page into lines. Pages are expected to be manually split.
        camera.ctx.font = "400 " + 20 + "px " + "arial";
        for (var i = 0; i < this.pages.length; i++) {
            // only operate on single-line pages; ignore pre-cut lines
            if (this.pages[i].length != 1)
                continue;
            var words = this.pages[i][0].split(" ");
            var line = "";
            var nextword = words.splice(0, 1)[0];
            var maxWidth = 520;
            var newPage = [];
            while (true) {
                var width = camera.ctx.measureText(line + " " + nextword).width;
                if (width < maxWidth) {
                    if (nextword)
                        line += " " + nextword;
                    nextword = words.splice(0, 1)[0];
                    if (nextword == undefined) {
                        // page done! 
                        newPage.push(line.trimStart());
                        break;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    newPage.push(line.trimStart());
                    line = nextword;
                    nextword = words.splice(0, 1)[0];
                }
            }
            this.pages[i] = newPage;
        }
    };
    BoardCutSceneDialog.prototype.Update = function () {
        this.timer++;
        if (this.pages.length > 0 && this.appearTimer < this.appearMax) {
            this.appearTimer++;
        }
        else {
            this.textTimer++;
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, false)) {
                this.textTimer += 5;
            }
            if (this.textTimer > 3) {
                this.textTimer -= 3;
                this.charIndex++;
            }
            if (this.IsPageDone() && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.charIndex = 0;
                this.pages.shift();
            }
        }
        if (this.pages.length == 0) {
            this.appearTimer--;
            if (this.appearTimer <= 0)
                this.isDone = true;
        }
    };
    BoardCutSceneDialog.prototype.IsPageDone = function () {
        return this.pages.length > 0 && this.charIndex > this.pages[0].join("\n").length + 3;
    };
    BoardCutSceneDialog.prototype.Draw = function (camera) {
        var cam = new Camera(camera.canvas);
        var width = 560;
        if (this.appearTimer < this.appearMax)
            width *= (this.appearTimer / this.appearMax);
        var panelX = cam.canvas.width / 2 - width / 2;
        cam.ctx.fillStyle = "#013C";
        cam.ctx.fillRect(panelX, 380, width, 150);
        cam.ctx.fillStyle = "#EEE";
        cam.ctx.textAlign = "left";
        cam.ctx.font = "400 " + 20 + "px " + "arial";
        var page = this.pages[0];
        if (page) {
            var y = 420;
            var x = panelX + 20;
            var charCount = this.charIndex;
            for (var _i = 0, page_1 = page; _i < page_1.length; _i++) {
                var line = page_1[_i];
                var substring = line.substring(0, charCount);
                charCount -= line.length;
                cam.ctx.fillText(substring, x, y);
                y += 30;
            }
        }
        if (this.IsPageDone()) {
            var image = tiles["controls"][0][0];
            var scale = Math.sin(this.timer / 10) / 8 + 1.25;
            image.Draw(cam, 250, 230, scale, scale, false, false, 0);
        }
    };
    return BoardCutSceneDialog;
}(BoardCutScene));
function JoinPlayers(players) {
    if (players.length == 4) {
        return players[0].avatarName + ", " + players[1].avatarName + ", " + players[2].avatarName + ", and " + players[3].avatarName;
    }
    else if (players.length == 3) {
        return players[0].avatarName + ", " + players[1].avatarName + ", and " + players[2].avatarName;
    }
    else if (players.length == 2) {
        return players[0].avatarName + " and " + players[1].avatarName;
    }
    else if (players.length == 1) {
        return players[0].avatarName;
    }
    else {
        return players.map(function (a) { return a.avatarName; }).join(" & ");
    }
}
var BoardCutSceneLast5Turns = /** @class */ (function (_super) {
    __extends(BoardCutSceneLast5Turns, _super);
    function BoardCutSceneLast5Turns() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoardCutSceneLast5Turns.prototype.Update = function () {
        if (!board)
            return;
        var texts = [
            "Well everyone, we're down to the final five turns of the game! And what a game it's been. Let's take a moment to look at the standings.",
            this.GetPlacementText(),
            "But it's still anyone's game! There's a few rule changes coming up that could let anyone swoop in for a surprise victory!",
            "The value of blue and red coin spaces are now doubled, adding or subtracting 6 coins instead of 3.",
            "Additionally, passing a golden gear space will now let you buy a pair of gears. And if you land on the space, you'll have the option to buy three!",
            "It's not over until it's over! Best of luck to all the players!"
        ];
        cutsceneService.AddScene(new BoardCutSceneFadeOut(), new BoardCutSceneSetBackdrop(tiles["spaceBoardBlur"][0][0]), new BoardCutSceneFadeIn(), new BoardCutSceneDialog(texts.join("\\")), new BoardCutSceneFadeOut(), new BoardCutSceneSetBackdrop(null), new BoardCutSceneFadeIn());
        this.isDone = true;
    };
    BoardCutSceneLast5Turns.prototype.GetPlacementText = function () {
        var totalPlayerCount = board.players.length;
        if (totalPlayerCount <= 4) {
            var playerPlacements = [1, 2, 3, 4].map(function (p) { return board.players.filter(function (a) { return a.CurrentPlace() == p; }); });
            var placementText = "";
            if (playerPlacements[0].length == 4) {
                // 4-way tie for first
                placementText = "Amazingly, we have a 4-way tie for 1st place! " + JoinPlayers(playerPlacements[0]) + " are all tied for the lead.";
            }
            else if (playerPlacements[0].length == 3) {
                // 3-way tie for first, 1 person in last
                placementText = "It looks like we have a 3-way tie for 1st place! " + JoinPlayers(playerPlacements[0]) + " are tied for the lead, while " + JoinPlayers(playerPlacements[3]) + " is in dead last.";
            }
            else if (playerPlacements[0].length == 2) {
                // 2-way tie for first
                placementText = "We have a 2-way tie for 1st place! " + JoinPlayers(playerPlacements[0]) + " are vying for the win, ";
                if (playerPlacements[2].length == 2) {
                    // 2-way tie for third
                    placementText += "and " + JoinPlayers(playerPlacements[2]) + " are tied for 3rd.";
                }
                else {
                    //3rd place, 4th place
                    placementText += JoinPlayers(playerPlacements[2]) + " is sitting in 3rd, and " + JoinPlayers(playerPlacements[3]) + " is in last place.";
                }
            }
            else {
                // 1st place
                placementText = JoinPlayers(playerPlacements[0]) + " is in a commanding first place, ";
                if (playerPlacements[1].length == 3) {
                    // 3-way tie for 2nd
                    placementText += "while " + JoinPlayers(playerPlacements[1]) + " are all fighting for 2nd.";
                }
                else if (playerPlacements[1].length == 2) {
                    // 2-way tie for 2nd, 4th place
                    placementText += JoinPlayers(playerPlacements[1]) + " are fighting for 2nd, and " + JoinPlayers(playerPlacements[3]) + " is in last place.";
                }
                else {
                    // 2nd place
                    placementText += JoinPlayers(playerPlacements[1]) + " is in a close 2nd, ";
                    if (playerPlacements[2].length == 2) {
                        // 2-way tie for 3rd
                        placementText += "and " + JoinPlayers(playerPlacements[2]) + " are tied for last.";
                    }
                    else {
                        // all 4 places
                        placementText += JoinPlayers(playerPlacements[2]) + " is in 3rd, and " + JoinPlayers(playerPlacements[3]) + " is in last place.";
                    }
                }
            }
            return placementText;
        }
        else {
            // Alt less-pretty for more players
            var lines = [];
            var possiblePlaces = [];
            for (var i = 0; i < totalPlayerCount; i++)
                possiblePlaces.push(i + 1); // [1,2,3,4,5...]
            var playerPlacements = possiblePlaces.map(function (p) { return board.players.filter(function (a) { return a.CurrentPlace() == p; }); });
            for (var placeIndex = 0; placeIndex < playerPlacements.length; placeIndex++) {
                var playersInPlace = playerPlacements[placeIndex];
                if (playersInPlace.length == 0)
                    continue;
                var ordinal = NumberToOrdinal(placeIndex + 1);
                var joinedPlayerNames = JoinPlayers(playersInPlace);
                var text = joinedPlayerNames + " " + (playersInPlace.length == 1 ? "is" : "are") + " in " + ordinal + " place";
                lines.push(text);
            }
            return lines.join(", ") + ".";
        }
    };
    BoardCutSceneLast5Turns.prototype.Draw = function (camera) { };
    return BoardCutSceneLast5Turns;
}(BoardCutScene));
var BoardCutSceneFadeOut = /** @class */ (function (_super) {
    __extends(BoardCutSceneFadeOut, _super);
    function BoardCutSceneFadeOut() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        _this.targetTime = 60;
        return _this;
    }
    BoardCutSceneFadeOut.prototype.Update = function () {
        this.timer++;
        if (this.timer >= this.targetTime)
            this.isDone = true;
    };
    BoardCutSceneFadeOut.prototype.Draw = function (camera) {
        var opacity = this.timer / this.targetTime;
        if (opacity < 0)
            opacity = 0;
        if (opacity > 1)
            opacity = 1;
        var hexOpacity = (opacity * 255).toString(16).split(".")[0].padStart(2, "00").substring(0, 2);
        camera.ctx.fillStyle = "#000000" + hexOpacity;
        camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
    };
    return BoardCutSceneFadeOut;
}(BoardCutScene));
var BoardCutSceneFadeIn = /** @class */ (function (_super) {
    __extends(BoardCutSceneFadeIn, _super);
    function BoardCutSceneFadeIn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        _this.targetTime = 60;
        return _this;
    }
    BoardCutSceneFadeIn.prototype.Update = function () {
        this.timer++;
        if (this.timer >= this.targetTime)
            this.isDone = true;
    };
    BoardCutSceneFadeIn.prototype.Draw = function (camera) {
        var opacity = (this.targetTime - this.timer) / this.targetTime;
        if (opacity < 0)
            opacity = 0;
        if (opacity > 1)
            opacity = 1;
        var hexOpacity = (opacity * 255).toString(16).split(".")[0].padStart(2, "00").substring(0, 2);
        camera.ctx.fillStyle = "#000000" + hexOpacity;
        camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
    };
    return BoardCutSceneFadeIn;
}(BoardCutScene));
var BoardCutSceneSingleAction = /** @class */ (function (_super) {
    __extends(BoardCutSceneSingleAction, _super);
    function BoardCutSceneSingleAction(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        return _this;
    }
    BoardCutSceneSingleAction.prototype.Update = function () {
        this.isDone = true;
        this.action();
    };
    BoardCutSceneSingleAction.prototype.Draw = function (camera) { };
    return BoardCutSceneSingleAction;
}(BoardCutScene));
var BoardCutSceneSetBackdrop = /** @class */ (function (_super) {
    __extends(BoardCutSceneSetBackdrop, _super);
    function BoardCutSceneSetBackdrop(backdrop) {
        return _super.call(this, function () {
            BoardCutScene.backdrop = backdrop;
        }) || this;
    }
    return BoardCutSceneSetBackdrop;
}(BoardCutSceneSingleAction));
var BoardCutScenePortalSwap = /** @class */ (function (_super) {
    __extends(BoardCutScenePortalSwap, _super);
    function BoardCutScenePortalSwap(triggerPlayer, targetPlayer) {
        var _this = _super.call(this) || this;
        _this.triggerPlayer = triggerPlayer;
        _this.targetPlayer = targetPlayer;
        _this.baseX = 0;
        _this.baseY = 0;
        _this.timer = 0;
        _this.baseX = triggerPlayer.token.x;
        _this.baseY = triggerPlayer.token.y;
        return _this;
    }
    BoardCutScenePortalSwap.prototype.Update = function () {
        var _a, _b, _c;
        this.timer++;
        if (this.timer == 1) {
            audioHandler.PlaySound("warp", false);
        }
        if (this.timer == 60) {
            var targetSquare = (_a = this.targetPlayer.token) === null || _a === void 0 ? void 0 : _a.currentSpace;
            this.targetPlayer.token.currentSpace = this.triggerPlayer.token.currentSpace;
            this.triggerPlayer.token.currentSpace = targetSquare;
            (_b = this.targetPlayer.token) === null || _b === void 0 ? void 0 : _b.Update();
            (_c = this.triggerPlayer.token) === null || _c === void 0 ? void 0 : _c.Update();
        }
        if (this.timer == 150) {
            this.isDone = true;
            // and then start the player's roll (NOT THE ITEM MENU)
            if (board)
                board.boardUI.StartRoll();
        }
    };
    BoardCutScenePortalSwap.prototype.Draw = function (camera) {
        if (this.timer < 120) {
            var tile = tiles["itemIcons"][1][1];
            var size = (60 - Math.abs(60 - this.timer)) / 10;
            tile.Draw(camera, this.baseX, this.baseY, size, size, false, false, this.timer / 10);
        }
    };
    return BoardCutScenePortalSwap;
}(BoardCutScene));
var BoardCutSceneDevExit = /** @class */ (function (_super) {
    __extends(BoardCutSceneDevExit, _super);
    function BoardCutSceneDevExit(triggerPlayer) {
        var _this = _super.call(this) || this;
        _this.triggerPlayer = triggerPlayer;
        _this.baseX = 0;
        _this.baseY = 0;
        _this.timer = 0;
        _this.baseX = triggerPlayer.token.x;
        _this.baseY = triggerPlayer.token.y;
        return _this;
    }
    BoardCutSceneDevExit.prototype.Update = function () {
        var _a;
        this.timer++;
        if (this.timer == 1) {
            audioHandler.PlaySound("boing", false);
        }
        if (this.timer == 60 && board) {
            var targetSpace_1 = board.boardSpaces.find(function (a) { return a.spaceType == BoardSpaceType.GearSpace; });
            if (targetSpace_1) {
                targetSpace_1 = board.boardSpaces.find(function (a) { return a.nextSpaces.indexOf(targetSpace_1) > -1; });
            }
            if (this.triggerPlayer.token && targetSpace_1) {
                this.triggerPlayer.token.currentSpace = targetSpace_1;
            }
            (_a = this.triggerPlayer.token) === null || _a === void 0 ? void 0 : _a.Update();
        }
        if (this.timer < 150 && this.timer > 90 && board) {
            board.CameraFollow(this.triggerPlayer);
        }
        if (this.timer == 150) {
            this.isDone = true;
            // and then start the player's roll (NOT THE ITEM MENU)
            if (board)
                board.boardUI.StartRoll();
        }
    };
    BoardCutSceneDevExit.prototype.Draw = function (camera) {
        if (this.timer < 120) {
            var tile = tiles["itemIcons"][0][1];
            var sizeWiggle = this.timer > 30 ? 0 : ((this.timer - 30) / 30);
            var size = Math.cos(this.timer / 4) * sizeWiggle + 1;
            if (this.timer > 60) {
                size = (80 - this.timer) / 20;
                if (size < 0)
                    size = 0;
            }
            tile.Draw(camera, this.baseX, this.baseY, size, size, false, false, 0);
        }
    };
    return BoardCutSceneDevExit;
}(BoardCutScene));
var BoardCutScenePlayerList = /** @class */ (function (_super) {
    __extends(BoardCutScenePlayerList, _super);
    function BoardCutScenePlayerList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 180;
        _this.scoreBoxes = []; // indexes into board.players
        _this.localPlayerList = [];
        _this.headingRow = 1;
        _this.headingTimer = 0;
        _this.opacity = 180;
        return _this;
    }
    BoardCutScenePlayerList.prototype.GetImageY = function (boxY) { return boxY - 270 + 50; };
    BoardCutScenePlayerList.prototype.Update = function () {
        var _this = this;
        this.headingTimer++;
        this.localPlayerList.sort(this.PlayerSorter.bind(this));
        if (this.scoreBoxes.length == 0) {
            //init
            this.localPlayerList = __spreadArrays(board.players);
            this.scoreBoxes = this.localPlayerList.map(function (a) { return ({ player: a, y: 600, targetY: 600 }); });
        }
        else {
            // sort by placement
            this.scoreBoxes.sort(function (a, b) { return _this.localPlayerList.indexOf(a.player) - _this.localPlayerList.indexOf(b.player); });
        }
        for (var i = 0; i < this.scoreBoxes.length; i++) {
            this.scoreBoxes[i].targetY = i * 110 + 95;
        }
        this.AdditionalUpdateLogic();
        this.UpdateBoxPositions();
    };
    BoardCutScenePlayerList.prototype.UpdateBoxPositions = function () {
        var boxSpeed = 4;
        for (var _i = 0, _a = this.scoreBoxes; _i < _a.length; _i++) {
            var scorebox = _a[_i];
            if (Math.abs(scorebox.y - scorebox.targetY) < boxSpeed)
                scorebox.y = scorebox.targetY;
            if (scorebox.y < scorebox.targetY)
                scorebox.y += boxSpeed;
            if (scorebox.y > scorebox.targetY)
                scorebox.y -= boxSpeed;
        }
    };
    BoardCutScenePlayerList.prototype.Draw = function (camera) {
        if (this.opacity <= 0)
            return;
        var ctx = camera.ctx;
        ctx.fillStyle = "#000000" + Math.floor(this.opacity).toString(16).padStart(2, "00");
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 4;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "800 " + 36 + "px " + "arial";
        ctx.textAlign = "right";
        var title = tiles["minigameText"][0][this.headingRow];
        title.Draw(camera, this.x - 180, Math.min(-220, this.headingTimer - 350), 1, 1, false, false, 0);
        for (var playerIndex_1 = 0; playerIndex_1 < board.players.length; playerIndex_1++) {
            var scorebox = this.scoreBoxes[playerIndex_1];
            this.DrawBasePlayerBox(playerIndex_1, scorebox.y);
            this.AdditionalDraw(playerIndex_1, scorebox.y);
        }
    };
    BoardCutScenePlayerList.prototype.DrawBasePlayerBox = function (playerIndex, y) {
        var player = this.scoreBoxes[playerIndex].player;
        var cam = board.boardUI.uiCamera;
        var image = tiles["playerIcons"][player.avatarIndex][0];
        cam.ctx.fillStyle = "#000D";
        cam.ctx.fillRect(this.x, y, 600, 100);
        cam.ctx.strokeRect(this.x, y, 600, 100);
        image.Draw(cam, this.x - 480 + 50, this.GetImageY(y), 0.4, 0.4, false, false, 0);
    };
    return BoardCutScenePlayerList;
}(BoardCutScene));
var BoardCutSceneStandings = /** @class */ (function (_super) {
    __extends(BoardCutSceneStandings, _super);
    function BoardCutSceneStandings(awards) {
        var _this = _super.call(this) || this;
        _this.awards = awards;
        _this.timer = 0;
        return _this;
    }
    BoardCutSceneStandings.prototype.PlayerSorter = function (a, b) {
        return (a.CurrentPlace() + a.turnOrder / 10) - (b.CurrentPlace() + b.turnOrder / 10);
    };
    BoardCutSceneStandings.prototype.AdditionalUpdateLogic = function () {
        this.timer++;
        if (this.timer > 150) {
            if (this.timer % 8 == 0) {
                var playSound = false;
                for (var _i = 0, _a = this.awards; _i < _a.length; _i++) {
                    var award = _a[_i];
                    if (award.coins > 0) {
                        award.coins--;
                        award.player.coins++;
                        award.player.displayedCoins++;
                        playSound = true;
                    }
                }
                if (playSound)
                    audioHandler.PlaySound("coin", true);
            }
        }
        var endTime = 400;
        if (this.timer >= endTime) {
            this.x += (this.timer - endTime) / 2;
            if (this.x > 1100) {
                this.opacity -= 3;
            }
            if (this.opacity <= 0)
                this.Complete();
        }
    };
    BoardCutSceneStandings.prototype.Complete = function () {
        if (!board)
            return;
        this.isDone = true;
        board.currentRound++;
        board.SaveGameStateToDB();
        board.boardUI.roundStarttimer = 1;
        if (board.finalRound - board.currentRound + 1 == 5) {
            cutsceneService.AddScene(new BoardCutSceneLast5Turns());
        }
        if (board.finalRound - board.currentRound + 1 == 0) {
            audioHandler.SetBackgroundMusic("level1");
            cutsceneService.AddScene(new BoardCutSceneGameEnd());
        }
    };
    BoardCutSceneStandings.prototype.AdditionalDraw = function (playerIndex, y) {
        // Draw placement, gears, coins
        var player = this.scoreBoxes[playerIndex].player;
        var cam = board.boardUI.uiCamera;
        var gearIcon = tiles["uiLargeIcons"][0][0];
        var coinIcon = tiles["uiLargeIcons"][0][1];
        gearIcon.Draw(cam, this.x - 480 + 300, this.GetImageY(y), 1, 1, false, false, 0);
        coinIcon.Draw(cam, this.x - 480 + 470, this.GetImageY(y), 1, 1, false, false, 0);
        cam.ctx.fillStyle = "#FFF";
        cam.ctx.textAlign = "right";
        cam.ctx.font = "800 " + 36 + "px " + "arial";
        cam.ctx.fillText(player.CurrentPlaceText(), this.x + 200, y + 50 + 14);
        cam.ctx.fillText(player.gears.toString(), this.x + 400, y + 50 + 14);
        cam.ctx.fillText(player.displayedCoins.toString(), this.x + 570, y + 50 + 14);
        var _loop_2 = function (scorebox) {
            var award = this_2.awards.find(function (a) { return a.player == scorebox.player; });
            if (award && award.coins > 0) {
                DrawText(this_2.x + 160, this_2.GetImageY(scorebox.y), "+" + award.coins, cam, 0.3, 3);
            }
        };
        var this_2 = this;
        for (var _i = 0, _a = this.scoreBoxes; _i < _a.length; _i++) {
            var scorebox = _a[_i];
            _loop_2(scorebox);
        }
    };
    return BoardCutSceneStandings;
}(BoardCutScenePlayerList));
var BoardCutSceneMinigameResults = /** @class */ (function (_super) {
    __extends(BoardCutSceneMinigameResults, _super);
    function BoardCutSceneMinigameResults() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.headingRow = 2;
        _this.fetchedScores = [];
        _this.countDown = 120;
        _this.isFetching = false;
        _this.fetchTimer = 0;
        return _this;
    }
    BoardCutSceneMinigameResults.prototype.Complete = function () {
        this.isDone = true;
        if (board)
            board.pendingMinigame = null;
        // coins are distributed based on minigame placement
        // 10 for 1st, 3 for 2nd, 2 for 3rd
        // If tie for 1st, we get [10, 10, 2, 0]
        // If 3-way tie for 2nd, we get [10, 3, 3, 3]
        var coinDistribution = [10, 3, 2];
        var sortedScores = this.fetchedScores.map(function (a) { return a.score; });
        sortedScores.sort(function (a, b) { return b - a; });
        var topScore = sortedScores[0];
        var awards = [];
        var _loop_3 = function (fetchedScore) {
            var scorePlacement = sortedScores.indexOf(fetchedScore.score);
            // 0 for 1st (or if tying for 1st!)
            var winnings = coinDistribution[scorePlacement] || 0;
            var player = board.players.find(function (a) { return a.userId == fetchedScore.playerUserId; });
            if (player) {
                awards.push({ player: player, coins: winnings });
                player.statMinigameWinnings += winnings;
            }
        };
        for (var _i = 0, _a = this.fetchedScores; _i < _a.length; _i++) {
            var fetchedScore = _a[_i];
            _loop_3(fetchedScore);
        }
        cutsceneService.AddScene(new BoardCutSceneStandings(awards));
    };
    BoardCutSceneMinigameResults.prototype.AdditionalDraw = function (playerIndex, y) {
        // draw scores
        var player = this.scoreBoxes[playerIndex].player;
        var score = this.fetchedScores.find(function (x) { return x.playerUserId == player.userId; });
        if (score) {
            var cam = board.boardUI.uiCamera;
            cam.ctx.fillStyle = "#FFF";
            cam.ctx.textAlign = "right";
            cam.ctx.font = "800 " + 36 + "px " + "arial";
            cam.ctx.fillText(score.score.toString(), this.x + 570, y + 50 + 14);
        }
    };
    BoardCutSceneMinigameResults.prototype.AdditionalUpdateLogic = function () {
        var _this = this;
        audioHandler.SetBackgroundMusic("lobby");
        var _loop_4 = function (scorebox) {
            var matchingScore = this_3.fetchedScores.find(function (a) { return a.playerUserId == scorebox.player.userId; });
            if (!matchingScore)
                scorebox.targetY = 600;
        };
        var this_3 = this;
        for (var _i = 0, _a = this.scoreBoxes; _i < _a.length; _i++) {
            var scorebox = _a[_i];
            _loop_4(scorebox);
        }
        if (this.fetchedScores.length == this.scoreBoxes.length && this.scoreBoxes.every(function (a) { return a.targetY == a.y; })) {
            // all scores fetched, all locations right
            this.countDown--;
            if (this.countDown <= 0) {
                this.x += this.countDown / 2;
                if (this.x < -1000) {
                    this.Complete();
                }
                // auto proceed
            }
        }
        if (this.fetchedScores.length < this.scoreBoxes.length && !this.isFetching) {
            this.fetchTimer++;
            if (this.fetchTimer > 120) {
                this.fetchTimer = 0;
                this.isFetching = true;
                DataService.GetScores(board.gameId, board.currentRound).then(function (scores) {
                    _this.fetchedScores = scores.map(function (a) { return ({ playerUserId: a.playerId, score: a.score }); });
                });
            }
        }
    };
    BoardCutSceneMinigameResults.prototype.PlayerSorter = function (a, b) {
        var scoreA = this.fetchedScores.find(function (x) { return x.playerUserId == a.userId; });
        var scoreB = this.fetchedScores.find(function (x) { return x.playerUserId == b.userId; });
        if (!scoreA && !scoreB)
            return 0;
        if (scoreA && !scoreB)
            return -1;
        if (!scoreA && scoreB)
            return 1;
        if (scoreA && scoreB)
            return scoreB.score - scoreA.score;
        return 0;
    };
    return BoardCutSceneMinigameResults;
}(BoardCutScenePlayerList));
