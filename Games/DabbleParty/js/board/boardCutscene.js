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
        this.timer++;
        if (this.timer > 50) {
            this.isDone = true;
        }
    };
    BoardCutSceneAddCoins.prototype.Draw = function (camera) {
        if (!this.player.token)
            return;
        //let baseY = this.player.token.y - 100 + (this.floatingTextDirection == 1 ? 0 : 50)
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
                this.PerformUpgrade();
            }
            else {
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
    function BoardCutScenePadding() {
        var _this = _super.call(this) || this;
        _this.timer = 0;
        _this.paddingTime = 20;
        return _this;
    }
    BoardCutScenePadding.prototype.Update = function () {
        this.timer++;
        if (this.timer == this.paddingTime) {
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
                    text: Random.RandFrom(action.spams),
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
            el.color = Random.RandFrom(["Blue", " Coral", " DodgerBlue", " SpringGreen", " YellowGreen", " Green", " OrangeRed", " Red", " GoldenRod", " HotPink", " CadetBlue", " SeaGreen", " Chocolate", " BlueViolet", " Firebrick"]);
            camera.ctx.font = "700 " + 15 + "px " + "arial";
            el.name = GetRandomUserName();
            el.nameWidth = camera.ctx.measureText(el.name + ":").width;
            el.text = Random.RandFrom(el.action.spams);
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
        return "";
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
