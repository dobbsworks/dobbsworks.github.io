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
var MenuElement = /** @class */ (function () {
    function MenuElement(id, centerX, centerY) {
        this.id = id;
        this.centerX = centerX;
        this.centerY = centerY;
        this.cursorAnchorOffsetX = 0;
        this.cursorAnchorOffsetY = 0;
        this.isVisible = true;
        this.defaultVisibility = true;
    }
    MenuElement.prototype.OnLeft = function (handler) { };
    MenuElement.prototype.OnRight = function (handler) { };
    MenuElement.prototype.OnUp = function (handler) { };
    MenuElement.prototype.OnDown = function (handler) { };
    MenuElement.prototype.OnAction = function (handler) { };
    return MenuElement;
}());
var MenuBase = /** @class */ (function (_super) {
    __extends(MenuBase, _super);
    function MenuBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuBase.prototype.Draw = function (camera) {
        var base = tiles["menuBase"][0][0];
        base.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
    };
    return MenuBase;
}(MenuElement));
var MenuButtonBase = /** @class */ (function (_super) {
    __extends(MenuButtonBase, _super);
    function MenuButtonBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuButtonBase.prototype.Draw = function (camera) {
        var base = tiles["menuButton1"][0][0];
        base.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        camera.ctx.font = "800 " + 28 + "px " + "arial";
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#222";
        camera.ctx.fillText(this.text, this.centerX + 480, this.centerY + 5 + 270);
    };
    return MenuButtonBase;
}(MenuElement));
var MenuText = /** @class */ (function (_super) {
    __extends(MenuText, _super);
    function MenuText(id, centerX, centerY, text) {
        var _this = _super.call(this, id, centerX, centerY) || this;
        _this.text = text;
        return _this;
    }
    MenuText.prototype.Draw = function (camera) {
        camera.ctx.font = "800 " + 28 + "px " + "arial";
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#222";
        camera.ctx.fillText(this.text, this.centerX + 480, this.centerY + 5 + 270);
    };
    return MenuText;
}(MenuElement));
var MenuButtonCreateGame = /** @class */ (function (_super) {
    __extends(MenuButtonCreateGame, _super);
    function MenuButtonCreateGame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "Create Game";
        _this.cursorAnchorOffsetX = -110;
        return _this;
    }
    MenuButtonCreateGame.prototype.OnUp = function (handler) { handler.JumpTo("turnSelect"); };
    MenuButtonCreateGame.prototype.OnDown = function (handler) { handler.JumpTo("tab-2"); };
    MenuButtonCreateGame.prototype.OnAction = function (handler) {
        var turnSelector = handler.FindById("turnSelect");
        var turns = turnSelector.turnChoices[turnSelector.selectionIndex];
        var boardSelector = handler.FindById("boardSelect");
        var boardIndex = boardSelector.selectionIndex;
        handler.cursorTarget = null;
        handler.OpenPage(-1);
        var myGameData = {
            boardId: boardIndex,
            currentRound: -1,
            finalRound: turns,
            currentPlayerIndex: -1,
            currentMinigameIndex: -1,
            players: []
        };
        var dt = { id: -1, data: JSON.stringify(myGameData), lastUpdate: new Date(), currentRound: -1, hostId: -1, playerIds: "", hostName: "" };
        DataService.CreateParty(dt).then(function (gameId) {
            handler.OpenPage(2);
            handler.FindById("waitingTextHost").isVisible = false;
            setTimeout(function () {
                var display = handler.FindById("lobbyDisplayHost");
                display.gameId = gameId;
                document.getElementById("inputSection").style.display = "flex";
                display.FetchUpdate(handler);
            }, 1000);
        });
    };
    return MenuButtonCreateGame;
}(MenuButtonBase));
var MenuButtonStartGame = /** @class */ (function (_super) {
    __extends(MenuButtonStartGame, _super);
    function MenuButtonStartGame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "Let's Go!";
        _this.defaultVisibility = false;
        _this.cursorAnchorOffsetX = -110;
        return _this;
    }
    MenuButtonStartGame.prototype.OnAction = function (handler) {
        var lobbyDisplay = handler.FindById("lobbyDisplayHost");
        if (lobbyDisplay.lobbyState) {
            board = new BoardMap(lobbyDisplay.gameId);
            board.Initialize();
            board.FromData(lobbyDisplay.lobbyState);
            //board.CameraFocusSpace(board.boardSpaces[0]);
            handler.cutscene.isDone = true;
            cutsceneService.AddScene(new BoardCutSceneIntro());
        }
    };
    return MenuButtonStartGame;
}(MenuButtonBase));
var MenuButtonSearchForGames = /** @class */ (function (_super) {
    __extends(MenuButtonSearchForGames, _super);
    function MenuButtonSearchForGames() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "Search For Games";
        _this.cursorAnchorOffsetX = -140;
        return _this;
    }
    MenuButtonSearchForGames.prototype.OnUp = function (handler) { handler.JumpTo("selectGame"); };
    MenuButtonSearchForGames.prototype.OnDown = function (handler) { handler.JumpTo("tab-1"); };
    MenuButtonSearchForGames.prototype.OnLeft = function (handler) { handler.JumpTo("avatarChange"); };
    MenuButtonSearchForGames.prototype.OnRight = function (handler) { handler.JumpTo("avatarChange"); };
    MenuButtonSearchForGames.prototype.OnAction = function (handler) {
        var _this = this;
        var selector = handler.FindById("selectGame");
        handler.cursorTarget = null;
        DataService.GetCurrentGames().then(function (games) {
            selector.lobbies = games.filter(function (a) { return a.currentRound < 999; });
            if (selector.lobbies.length > 0) {
                handler.cursorTarget = selector;
            }
            else {
                handler.cursorTarget = _this;
            }
        });
    };
    return MenuButtonSearchForGames;
}(MenuButtonBase));
var MenuSelectGame = /** @class */ (function (_super) {
    __extends(MenuSelectGame, _super);
    function MenuSelectGame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cursorAnchorOffsetX = -310;
        _this.cursorAnchorOffsetY = -45;
        _this.selectionIndex = 0;
        _this.lobbies = [];
        return _this;
    }
    MenuSelectGame.prototype.OnDown = function (handler) {
        if (this.selectionIndex < this.lobbies.length - 1) {
            audioHandler.PlaySound("swim", true);
            this.selectionIndex++;
        }
        else {
            handler.JumpTo("searchForGames");
        }
    };
    MenuSelectGame.prototype.OnUp = function (handler) {
        if (this.selectionIndex > 0) {
            audioHandler.PlaySound("swim", true);
            this.selectionIndex--;
        }
        else {
            handler.JumpTo("tab-1");
        }
    };
    MenuSelectGame.prototype.Draw = function (camera) {
        var embedBgImage = tiles["menuLargeEmbedBack"][0][0];
        embedBgImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        if (this.selectionIndex > 0) {
            var tailImage = tiles["menuButton2Slice"][0][3];
            tailImage.Draw(camera, this.centerX, this.centerY - 105, 1, 1, false, false, 0);
        }
        var lobbyImage = tiles["menuButton2"][0][0];
        var lobbies = [this.lobbies[this.selectionIndex], this.lobbies[this.selectionIndex + 1]];
        var y = 0;
        camera.ctx.font = "600 " + 20 + "px " + "arial";
        camera.ctx.textAlign = "left";
        camera.ctx.fillStyle = "#333";
        for (var _i = 0, _a = lobbies.filter(function (a) { return a; }); _i < _a.length; _i++) {
            var lobby = _a[_i];
            var gameData = JSON.parse(lobby.data);
            lobbyImage.Draw(camera, this.centerX, this.centerY - 50 + y, 1, 1, false, false, 0);
            var boardImage = tiles["boardThumbs"][0][gameData.boardId];
            boardImage.Draw(camera, this.centerX + 274, this.centerY + y - 50, 0.5, 0.5, false, false, 0);
            camera.ctx.fillText("Game " + lobby.id + " - " + lobby.hostName, this.centerX - 300 + 480, this.centerY + y - 60 + 270);
            var subtext = "Looking for players";
            if (gameData.currentRound == 0)
                subtext = "Starting";
            if (gameData.currentRound > 0)
                subtext = "Round " + gameData.currentRound + " of " + gameData.finalRound;
            if (gameData.currentRound >= 999)
                subtext = "Ending";
            camera.ctx.fillText(subtext, this.centerX - 300 + 480, this.centerY + y - 60 + 270 + 30);
            y += 100;
        }
        if (this.lobbies.length > this.selectionIndex + 2) {
            var tailImage = tiles["menuButton2Slice"][0][0];
            tailImage.Draw(camera, this.centerX, this.centerY + 105, 1, 1, false, false, 0);
        }
        var embedImage = tiles["menuLargeEmbed"][0][0];
        embedImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
    };
    MenuSelectGame.prototype.OnAction = function (handler) {
        var lobby = this.lobbies[this.selectionIndex];
        if (lobby) {
            handler.cursorTarget = null;
            handler.OpenPage(-1);
            var avatarSelect = handler.FindById("avatarSelect");
            var selectedAvatar = avatarSelect.selectionIndex;
            DataService.JoinParty(lobby.id, selectedAvatar).then(function (code) {
                if (code == -1) {
                    // can't join party!
                }
                else {
                    // code 1, added to party, wait in the lobby
                    // code 2, rejoining party
                    if (code == 1 || lobby.currentRound < 1) {
                        handler.OpenPage(3);
                        handler.FindById("waitingTextHost").isVisible = false;
                        handler.FindById("lobbyDisplayPlayer").gameId = lobby.id;
                        handler.FindById("lobbyDisplayPlayer").FetchUpdate(handler);
                    }
                    else {
                        MoveToBoardView(lobby.id, handler, JSON.parse(lobby.data));
                    }
                }
            });
        }
    };
    return MenuSelectGame;
}(MenuElement));
var MenuTab = /** @class */ (function (_super) {
    __extends(MenuTab, _super);
    function MenuTab(id, centerX, centerY, text) {
        var _this = _super.call(this, id, centerX, centerY) || this;
        _this.text = text;
        _this.isActive = false;
        _this.cursorAnchorOffsetX = -70;
        return _this;
    }
    MenuTab.prototype.Draw = function (camera) {
        var tabImage = tiles["menuTab"][this.isActive ? 0 : 1][0];
        tabImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        camera.ctx.font = "800 " + 26 + "px " + "arial";
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = this.isActive ? "#513ea3" : "#a79560";
        camera.ctx.fillText(this.text, this.centerX + 480, this.centerY + 270 + 13);
    };
    MenuTab.prototype.OnLeft = function (handler) { this.TabToggle(handler); };
    MenuTab.prototype.OnRight = function (handler) { this.TabToggle(handler); };
    MenuTab.prototype.TabToggle = function (handler) {
        audioHandler.PlaySound("swim", true);
        var targetId = (this.id == "tab-1" ? "tab-2" : "tab-1");
        handler.JumpTo(targetId);
    };
    MenuTab.prototype.OnAction = function (handler) {
        audioHandler.PlaySound("swim", true);
        var pageId = (this.id == "tab-1" ? 0 : 1);
        handler.OpenPage(pageId);
    };
    MenuTab.prototype.OnDown = function (handler) {
        var page = handler.pages[handler.currentPageIndex];
        handler.JumpTo(page[0]);
    };
    MenuTab.prototype.OnUp = function (handler) {
        var page = handler.pages[handler.currentPageIndex];
        handler.JumpTo(page[page.length - 1]);
    };
    return MenuTab;
}(MenuElement));
var MenuBoardSelect = /** @class */ (function (_super) {
    __extends(MenuBoardSelect, _super);
    function MenuBoardSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectionIndex = 0;
        _this.selectionCount = 4;
        _this.selectionTexts = [
            ["A beginner-difficulty board", "featuring a few special", "board events and limited", "branching paths."],
            ["A beginner-difficulty board", "featuring some special", "board events and limited", "branching paths."],
            ["A medium-difficulty board", "featuring some special", "board events and several", "branching paths."],
            ["An expert-difficulty board", "featuring many special", "board events and non-linear", "movement."],
        ];
        _this.cursorAnchorOffsetX = -170;
        _this.embedImage = "menuMediumEmbed";
        _this.textYOffset = 0;
        return _this;
    }
    MenuBoardSelect.prototype.OnLeft = function (handler) {
        audioHandler.PlaySound("swim", true);
        this.selectionIndex--;
        if (this.selectionIndex < 0)
            this.selectionIndex = this.selectionTexts.length - 1;
    };
    MenuBoardSelect.prototype.OnRight = function (handler) {
        audioHandler.PlaySound("swim", true);
        this.selectionIndex++;
        this.selectionIndex %= this.selectionCount;
    };
    MenuBoardSelect.prototype.Draw = function (camera) {
        this.DrawArrows(camera);
        this.DrawSelectionContents(camera);
        var embedImage = tiles[this.embedImage][0][0];
        embedImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        this.DrawSideText(camera);
    };
    MenuBoardSelect.prototype.DrawArrows = function (camera) {
        var arrowImage = tiles["menuArrow"][0][0];
        arrowImage.Draw(camera, this.centerX + 150, this.centerY, 1, 1, false, false, 0);
        arrowImage.Draw(camera, this.centerX - 150, this.centerY, 1, 1, true, false, 0);
    };
    MenuBoardSelect.prototype.DrawSideText = function (camera) {
        var textLines = this.selectionTexts[this.selectionIndex];
        if (textLines) {
            var y = this.centerY - 50 + 270 + this.textYOffset;
            camera.ctx.font = "600 " + 20 + "px " + "arial";
            camera.ctx.textAlign = "left";
            camera.ctx.fillStyle = "#333";
            for (var _i = 0, textLines_1 = textLines; _i < textLines_1.length; _i++) {
                var textLine = textLines_1[_i];
                camera.ctx.fillText(textLine, this.centerX + 200 + 480, y);
                y += 24;
            }
        }
    };
    MenuBoardSelect.prototype.DrawSelectionContents = function (camera) {
        var boardImage = tiles["boardThumbs"][0][this.selectionIndex];
        boardImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
    };
    MenuBoardSelect.prototype.OnUp = function (handler) { handler.JumpTo("tab-2"); };
    MenuBoardSelect.prototype.OnDown = function (handler) { handler.JumpTo("turnSelect"); };
    return MenuBoardSelect;
}(MenuElement));
var MenuTurnSelect = /** @class */ (function (_super) {
    __extends(MenuTurnSelect, _super);
    function MenuTurnSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.turnChoices = [15, 20, 30, 10];
        _this.selectionTexts = [
            ["The default game duration,", "perfectly tailored for optimal", "fun."],
            ["A slightly longer game,", "where careful choices pay", "off over the long run."],
            ["A very long-haul game,", "a party marathon for diehard", "fans."],
            ["A quick game, where luck", "can turn things around more", "easily."],
        ];
        _this.embedImage = "menuSmallEmbed";
        _this.textYOffset = 24;
        return _this;
    }
    MenuTurnSelect.prototype.DrawSelectionContents = function (camera) {
        camera.ctx.font = "800 " + 28 + "px " + "arial";
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#222";
        var textLine = this.turnChoices[this.selectionIndex] + " Rounds";
        camera.ctx.fillText(textLine, this.centerX + 480, this.centerY + 10 + 270);
    };
    MenuTurnSelect.prototype.OnUp = function (handler) { handler.JumpTo("boardSelect"); };
    MenuTurnSelect.prototype.OnDown = function (handler) { handler.JumpTo("createGame"); };
    return MenuTurnSelect;
}(MenuBoardSelect));
var MenuAvatarSelect = /** @class */ (function (_super) {
    __extends(MenuAvatarSelect, _super);
    function MenuAvatarSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectionCount = 13;
        _this.selectionTexts = [
            ["GameQueued", ""],
            ["germdove", ""],
            ["Al", ""],
            ["Turtle", ""],
            ["Dobbs", ""],
            ["Hover Cat", ""],
            ["Daesnek", ""],
            ["Panda", ""],
            ["Sunberry", ""],
            ["Ally", ""],
            ["Duffy", ""],
            ["Teddy", ""],
            ["Doopu", ""],
        ];
        return _this;
    }
    MenuAvatarSelect.prototype.Draw = function (camera) {
        this.DrawArrows(camera);
        this.DrawSelectionContents(camera);
        var embedImage = tiles[this.embedImage][0][0];
        embedImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        camera.ctx.font = "800 " + 30 + "px " + "arial";
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#333";
        var textLine = this.selectionTexts[this.selectionIndex][0];
        camera.ctx.fillText(textLine, 480, 320);
    };
    MenuAvatarSelect.prototype.DrawSelectionContents = function (camera) {
        camera.ctx.fillStyle = "#2224";
        camera.ctx.fillRect(this.centerX + 480 - 120, this.centerY + 270 - 68, 240, 136);
        var avatarImage = tiles["playerIcons"][this.selectionIndex][0];
        avatarImage.Draw(camera, this.centerX, this.centerY, 0.5, 0.5, false, false, 0);
    };
    MenuAvatarSelect.prototype.OnUp = function (handler) { handler.JumpTo("avatarOk"); };
    MenuAvatarSelect.prototype.OnDown = function (handler) { handler.JumpTo("avatarOk"); };
    return MenuAvatarSelect;
}(MenuBoardSelect));
var MenuAvatarDisplay = /** @class */ (function (_super) {
    __extends(MenuAvatarDisplay, _super);
    function MenuAvatarDisplay(handler, id, centerX, centerY) {
        var _this = _super.call(this, id, centerX, centerY) || this;
        _this.handler = handler;
        return _this;
    }
    MenuAvatarDisplay.prototype.Draw = function (camera) {
        var avatarSelect = this.handler.FindById("avatarSelect");
        var avatarImage = tiles["playerIcons"][avatarSelect.selectionIndex][0];
        avatarImage.Draw(camera, this.centerX, this.centerY, 0.25, 0.25, false, false, 0);
    };
    return MenuAvatarDisplay;
}(MenuElement));
var MenuButtonAvatarOk = /** @class */ (function (_super) {
    __extends(MenuButtonAvatarOk, _super);
    function MenuButtonAvatarOk() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "OK";
        _this.cursorAnchorOffsetX = -110;
        return _this;
    }
    MenuButtonAvatarOk.prototype.OnUp = function (handler) { handler.JumpTo("avatarSelect"); };
    MenuButtonAvatarOk.prototype.OnDown = function (handler) { handler.JumpTo("avatarSelect"); };
    MenuButtonAvatarOk.prototype.OnAction = function (handler) {
        handler.OpenPage(0);
        handler.cursorTarget = handler.FindById("avatarChange");
    };
    return MenuButtonAvatarOk;
}(MenuButtonBase));
var MenuButtonChangeAvatar = /** @class */ (function (_super) {
    __extends(MenuButtonChangeAvatar, _super);
    function MenuButtonChangeAvatar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "Character          ";
        _this.cursorAnchorOffsetX = -140;
        return _this;
    }
    MenuButtonChangeAvatar.prototype.OnUp = function (handler) { handler.JumpTo("selectGame"); };
    MenuButtonChangeAvatar.prototype.OnDown = function (handler) { handler.JumpTo("tab-1"); };
    MenuButtonChangeAvatar.prototype.OnLeft = function (handler) { handler.JumpTo("searchForGames"); };
    MenuButtonChangeAvatar.prototype.OnRight = function (handler) { handler.JumpTo("searchForGames"); };
    MenuButtonChangeAvatar.prototype.OnAction = function (handler) {
        handler.OpenPage(4);
        handler.cursorTarget = handler.FindById("avatarSelect");
    };
    return MenuButtonChangeAvatar;
}(MenuButtonBase));
var MenuLobbyStateDisplayHost = /** @class */ (function (_super) {
    __extends(MenuLobbyStateDisplayHost, _super);
    function MenuLobbyStateDisplayHost() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // element will periodically request lobby state from DB
        _this.gameId = -1;
        _this.lobbyState = null;
        return _this;
    }
    MenuLobbyStateDisplayHost.prototype.FetchUpdate = function (handler) {
        var _this = this;
        if (this.gameId != -1) {
            DataService.GetGameData(this.gameId).then(function (dt) {
                var _a, _b;
                _this.lobbyState = JSON.parse(dt.data);
                _this.OnReceiveGameData(dt);
                if (((_a = _this.lobbyState) === null || _a === void 0 ? void 0 : _a.players.length) == 2) {
                    _this.OnLobbyMinPlayers(handler);
                }
                else if (((_b = _this.lobbyState) === null || _b === void 0 ? void 0 : _b.players.length) == 4) {
                    _this.OnLobbyFull(handler);
                }
                else {
                    // wait a bit, check for players again
                    setTimeout(function () {
                        _this.FetchUpdate(handler);
                    }, 5000);
                }
            });
        }
        else {
            console.log("Game id is '-1'");
        }
    };
    MenuLobbyStateDisplayHost.prototype.OnReceiveGameData = function (dt) {
        if (!this.lobbyState)
            return;
        if (dt.playerIds.length == 0)
            return;
        var dtPlayerDatas = dt.playerIds.split(";");
        var _loop_1 = function (dtPlayerData) {
            var playerId = +(dtPlayerData.split(",")[0]);
            var playerName = dtPlayerData.split(",")[1];
            var avatarIndex = +(dtPlayerData.split(",")[2]);
            var correspondingPlayerRecord = this_1.lobbyState.players.find(function (a) { return a.userId == playerId; });
            if (!correspondingPlayerRecord) {
                // add to lobby state, then save to DB
                var newPlayer = {
                    gears: 0,
                    coins: 10,
                    turnOrder: -1,
                    avatarIndex: avatarIndex,
                    spaceIndex: -1,
                    items: [],
                    userId: playerId,
                    userName: playerName,
                    diceBag: [6, 6]
                };
                this_1.lobbyState.players.push(newPlayer);
                dt.data = JSON.stringify(this_1.lobbyState);
                DataService.SaveGameData(dt).then(function (a) { console.log("Game saved to DB"); });
            }
        };
        var this_1 = this;
        for (var _i = 0, dtPlayerDatas_1 = dtPlayerDatas; _i < dtPlayerDatas_1.length; _i++) {
            var dtPlayerData = dtPlayerDatas_1[_i];
            _loop_1(dtPlayerData);
        }
    };
    MenuLobbyStateDisplayHost.prototype.OnLobbyFull = function (handler) { };
    MenuLobbyStateDisplayHost.prototype.OnLobbyMinPlayers = function (handler) {
        handler.FindById("waitingForPlayersTextHost").isVisible = false;
        var button = handler.FindById("startGame");
        button.isVisible = true;
        handler.cursorTarget = button;
    };
    MenuLobbyStateDisplayHost.prototype.Draw = function (camera) {
        if (this.lobbyState) {
            var y = 0;
            camera.ctx.font = "600 " + 20 + "px " + "arial";
            camera.ctx.textAlign = "left";
            for (var _i = 0, _a = this.lobbyState.players; _i < _a.length; _i++) {
                var p = _a[_i];
                camera.ctx.fillStyle = "#ffdd76";
                camera.ctx.fillRect(this.centerX - 250 + 480, this.centerY + y - 155 + 270, 500, 50);
                var image = tiles["playerIcons"][p.avatarIndex][0];
                image.Draw(camera, this.centerX - 200, this.centerY + y - 130, 0.25, 0.25, false, false, 0);
                camera.ctx.fillStyle = "#333";
                camera.ctx.fillText(p.userName, this.centerX - 150 + 480, this.centerY + y - 125 + 270);
                y += 60;
            }
        }
    };
    return MenuLobbyStateDisplayHost;
}(MenuElement));
var MenuLobbyStateDisplayPlayer = /** @class */ (function (_super) {
    __extends(MenuLobbyStateDisplayPlayer, _super);
    function MenuLobbyStateDisplayPlayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuLobbyStateDisplayPlayer.prototype.OnLobbyFull = function (handler) {
        handler.FindById("waitingForPlayersTextPlayer").isVisible = false;
        handler.FindById("waitingTextHost").isVisible = true;
        this.WaitForBoardData(handler);
    };
    MenuLobbyStateDisplayPlayer.prototype.OnLobbyMinPlayers = function (handler) {
    };
    MenuLobbyStateDisplayPlayer.prototype.OnReceiveGameData = function (dt) { };
    MenuLobbyStateDisplayPlayer.prototype.WaitForBoardData = function (handler) {
        var _this = this;
        // keep asking for data until we get turn 1
        if (this.gameId != -1) {
            DataService.GetGameData(this.gameId).then(function (dt) {
                _this.lobbyState = JSON.parse(dt.data);
                if (_this.lobbyState && _this.lobbyState.currentRound >= 1) {
                    MoveToBoardView(_this.gameId, handler, _this.lobbyState);
                }
                else {
                    // wait a bit, check again
                    setTimeout(function () {
                        _this.WaitForBoardData(handler);
                    }, 5000);
                }
            });
        }
    };
    return MenuLobbyStateDisplayPlayer;
}(MenuLobbyStateDisplayHost));
function MoveToBoardView(gameId, handler, boardData) {
    handler.cutscene.isDone = true;
    board = new BoardMap(gameId);
    board.Initialize();
    board.isSpectateMode = true;
    board.FromData(boardData);
    board.CameraFocusSpace(board.boardSpaces[0]);
    board.SpectateUpdateLoop();
}
var MenuHandler = /** @class */ (function () {
    function MenuHandler(cutscene) {
        this.cutscene = cutscene;
        this.timer = 0;
        this.elements = [
            new MenuBase("menuBase", 0, 0),
            new MenuTab("tab-1", -300, -205, "Join Game"),
            new MenuTab("tab-2", -50, -205, "Host Game"),
            new MenuSelectGame("selectGame", 0, -20),
            new MenuButtonChangeAvatar("avatarChange", -200, 170),
            new MenuAvatarDisplay(this, "avatarDisplay", -100, 165),
            new MenuButtonSearchForGames("searchForGames", 200, 170),
            new MenuBoardSelect("boardSelect", -150, -70),
            new MenuTurnSelect("turnSelect", -150, 60),
            new MenuButtonCreateGame("createGame", 0, 170),
            new MenuLobbyStateDisplayHost("lobbyDisplayHost", 0, 0),
            new MenuLobbyStateDisplayPlayer("lobbyDisplayPlayer", 0, 0),
            new MenuText("waitingForPlayersTextHost", 0, 170, "Waiting for players to join..."),
            new MenuText("waitingForPlayersTextPlayer", 0, 170, "Waiting for players to join..."),
            new MenuText("waitingTextHost", 0, 170, "Waiting for host to start game..."),
            new MenuButtonAvatarOk("startGame", 0, 170),
            new MenuAvatarSelect("avatarSelect", 0, -70),
            new MenuButtonAvatarOk("avatarOk", 0, 170),
        ];
        this.currentPageIndex = 0;
        this.pages = [
            ["selectGame", "searchForGames", "avatarChange", "avatarDisplay"],
            ["boardSelect", "turnSelect", "createGame"],
            ["lobbyDisplayHost", "waitingForPlayersTextHost", "startGame"],
            ["lobbyDisplayPlayer", "waitingForPlayersTextPlayer", "waitingTextHost"],
            ["avatarSelect", "avatarOk"],
        ];
        this.isInitialized = false;
        this.cursorTarget = null;
    }
    MenuHandler.prototype.OpenPage = function (pageIndex) {
        this.currentPageIndex = pageIndex;
        for (var _i = 0, _a = this.pages; _i < _a.length; _i++) {
            var page = _a[_i];
            for (var _b = 0, page_1 = page; _b < page_1.length; _b++) {
                var elId = page_1[_b];
                var el = this.FindById(elId);
                if (el) {
                    el.isVisible = (this.pages.indexOf(page) == pageIndex) && el.defaultVisibility;
                }
                else {
                    console.error("No element with id " + elId);
                }
            }
        }
        for (var _c = 0, _d = this.elements.filter(function (a) { return a instanceof MenuTab; }); _c < _d.length; _c++) {
            var el = _d[_c];
            el.isActive = el.id == "tab-" + (pageIndex + 1);
        }
    };
    MenuHandler.prototype.Initialize = function () {
        this.isInitialized = true;
        this.FindById("tab-1").isActive = true;
        var avatarSelect = this.FindById("avatarSelect");
        avatarSelect.selectionIndex = Math.floor(Math.random() * avatarSelect.selectionCount);
        this.cursorTarget = this.FindById("avatarChange");
        this.OpenPage(0);
    };
    MenuHandler.prototype.Update = function () {
        if (!this.isInitialized)
            this.Initialize();
        this.timer++;
        if (this.cursorTarget) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true))
                this.cursorTarget.OnLeft(this);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true))
                this.cursorTarget.OnRight(this);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true))
                this.cursorTarget.OnUp(this);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true))
                this.cursorTarget.OnDown(this);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true))
                this.cursorTarget.OnAction(this);
        }
    };
    MenuHandler.prototype.JumpTo = function (id) {
        audioHandler.PlaySound("swim", true);
        this.cursorTarget = this.FindById(id) || null;
    };
    MenuHandler.prototype.FindById = function (id) {
        return this.elements.find(function (a) { return a.id == id; });
    };
    MenuHandler.prototype.Draw = function (camera) {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el.isVisible)
                el.Draw(camera);
        }
        if (this.cursorTarget) {
            var cursorImage = tiles["cursor"][0][0];
            var targetX = this.cursorTarget.centerX + this.cursorTarget.cursorAnchorOffsetX - 50;
            var targetY = this.cursorTarget.centerY + this.cursorTarget.cursorAnchorOffsetY + 10;
            targetX += Math.sin(this.timer / 10) * 5;
            cursorImage.Draw(camera, targetX, targetY, 1, 1, false, false, 0);
        }
        if (this.currentPageIndex == -1) {
            camera.ctx.fillStyle = "#0005";
            camera.ctx.fillRect(0, 0, 960, 540);
            camera.ctx.fillStyle = "#444034";
            for (var i = 0; i < 8; i++) {
                camera.ctx.beginPath();
                camera.ctx.arc(960 / 2 + Math.sin((this.timer / 60 + i * 0.25) * Math.PI) * 100, 540 / 2 + Math.cos((this.timer / 60 + i * 0.25) * Math.PI) * Math.cos((this.timer / 120) * Math.PI) * 100, 10, 0, Math.PI * 2);
                camera.ctx.fill();
            }
        }
    };
    return MenuHandler;
}());
var CutsceneMainMenu = /** @class */ (function (_super) {
    __extends(CutsceneMainMenu, _super);
    function CutsceneMainMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        _this.menuHandler = new MenuHandler(_this);
        return _this;
    }
    CutsceneMainMenu.prototype.Update = function () {
        this.timer++;
        this.menuHandler.Update();
    };
    CutsceneMainMenu.prototype.Draw = function (camera) {
        // bg + stars
        var bg = tiles["menuBack"][0][0];
        bg.Draw(camera, 0, 0, 1, 1, false, false, 0);
        var starImage = tiles["menuStar"][0][0];
        var starSpeed = 0.5;
        for (var starX = (this.timer * starSpeed) % 200 - 680; starX < 580; starX += 200) {
            for (var starY = (this.timer * starSpeed) % 200 - 470; starY < 370; starY += 200) {
                starImage.Draw(camera, starX, starY, 1, 1, false, false, 0);
                starImage.Draw(camera, starX + 100, starY + 100, 1, 1, false, false, 0);
            }
        }
        this.menuHandler.Draw(camera);
        // fade in
        if (this.timer < 16) {
            camera.ctx.fillStyle = "rgba(0,0,0," + (16 - this.timer) / 16 + ")";
            camera.ctx.fillRect(0, 0, 960, 540);
        }
    };
    return CutsceneMainMenu;
}(BoardCutScene));
