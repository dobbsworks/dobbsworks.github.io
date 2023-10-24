
abstract class MenuElement {
    constructor(public id: string, public centerX: number, public centerY: number) { }
    cursorAnchorOffsetX: number = 0;
    cursorAnchorOffsetY: number = 0;
    isVisible = true;
    defaultVisibility = true;
    OnLeft(handler: MenuHandler): void { }
    OnRight(handler: MenuHandler): void { }
    OnUp(handler: MenuHandler): void { }
    OnDown(handler: MenuHandler): void { }
    OnAction(handler: MenuHandler): void { }
    abstract Draw(camera: Camera): void;
}

class MenuBase extends MenuElement {
    Draw(camera: Camera) {
        let base = tiles["menuBase"][0][0] as ImageTile;
        base.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
    }
}

abstract class MenuButtonBase extends MenuElement {
    abstract text: string;
    Draw(camera: Camera) {
        let base = tiles["menuButton1"][0][0] as ImageTile;
        base.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        camera.ctx.font = `800 ${28}px ${"arial"}`;
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#222";
        camera.ctx.fillText(this.text, this.centerX + 480, this.centerY + 5 + 270);
    }
}

class MenuText extends MenuElement {
    constructor(id: string, centerX: number, centerY: number, private text: string) {
        super(id, centerX, centerY);
    }
    Draw(camera: Camera): void {
        camera.ctx.font = `800 ${28}px ${"arial"}`;
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#222";
        camera.ctx.fillText(this.text, this.centerX + 480, this.centerY + 5 + 270);
    }

}

class MenuButtonCreateGame extends MenuButtonBase {
    text = "Create Game";
    cursorAnchorOffsetX = -110;
    OnUp(handler: MenuHandler): void { handler.JumpTo("turnSelect"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("tab-2"); }
    OnAction(handler: MenuHandler): void {
        let turnSelector = (handler.FindById("turnSelect") as MenuTurnSelect);
        let turns = turnSelector.turnChoices[turnSelector.selectionIndex];

        let boardSelector = (handler.FindById("boardSelect") as MenuBoardSelect);
        let boardIndex = boardSelector.selectionIndex;

        handler.cursorTarget = null;
        handler.OpenPage(-1);

        let myGameData: GameExport = {
            boardId: boardIndex,
            currentRound: -1,
            finalRound: turns,
            currentPlayerIndex: -1,
            currentMinigameIndex: -1,
            players: [],
            gearSpaceId: -1,
            menu: null
        }

        let dt: PartyGameDT = { id: -1, data: JSON.stringify(myGameData), lastUpdate: new Date(), currentRound: -1, hostId: -1, playerIds: "", hostName: "" };
        DataService.CreateParty(dt).then(gameId => {
            handler.OpenPage(2);
            (handler.FindById("waitingTextHost") as MenuElement).isVisible = false;
            setTimeout(() => {
                let display = (handler.FindById("lobbyDisplayHost") as MenuLobbyStateDisplayHost);
                display.gameId = gameId;
                (document.getElementById("inputSection") as HTMLElement).style.display = "flex";
                display.FetchUpdate(handler);
            }, 1000);
        })
    }
}

class MenuButtonStartGame extends MenuButtonBase {
    text = "Let's Go!";
    defaultVisibility = false;
    cursorAnchorOffsetX = -110;
    OnAction(handler: MenuHandler): void {
        let lobbyDisplay = handler.FindById("lobbyDisplayHost") as MenuLobbyStateDisplayHost;
        if (lobbyDisplay.lobbyState) {
            board = new BoardMap(lobbyDisplay.gameId);
            board.Initialize();
            board.FromData(lobbyDisplay.lobbyState);
            //board.CameraFocusSpace(board.boardSpaces[0]);
            handler.cutscene.isDone = true;
            audioHandler.SetBackgroundMusic("silence");
            audioHandler.PlaySound("spaceFanfare", false);
            let hostControls = document.getElementById("inputSection");
            if (hostControls) hostControls.style.display = "block";
            setTimeout(() => {
                audioHandler.SetBackgroundMusic("level1")
            }, 7000);
            cutsceneService.AddScene(new BoardCutSceneIntro());
        }
    }
}

class MenuButtonSearchForGames extends MenuButtonBase {
    text = "Search For Games";
    cursorAnchorOffsetX = -140;
    OnUp(handler: MenuHandler): void { handler.JumpTo("selectGame"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("tab-1"); }
    OnLeft(handler: MenuHandler): void { handler.JumpTo("avatarChange"); }
    OnRight(handler: MenuHandler): void { handler.JumpTo("avatarChange"); }
    OnAction(handler: MenuHandler): void {
        let selector = handler.FindById("selectGame") as MenuSelectGame;
        handler.cursorTarget = null;
        DataService.GetCurrentGames().then(games => {
            selector.lobbies = games.filter(a => a.currentRound < 999);
            if (selector.lobbies.length > 0) {
                handler.cursorTarget = selector;
            } else {
                handler.cursorTarget = this;
            }
        })
    }
}

class MenuSelectGame extends MenuElement {
    cursorAnchorOffsetX = -310;
    cursorAnchorOffsetY = -45;
    selectionIndex: number = 0;
    lobbies: PartyGameDT[] = [];

    OnDown(handler: MenuHandler): void {
        if (this.selectionIndex < this.lobbies.length - 1) {
            audioHandler.PlaySound("swim", true);
            this.selectionIndex++;
        } else {
            handler.JumpTo("searchForGames");
        }
    }

    OnUp(handler: MenuHandler): void {
        if (this.selectionIndex > 0) {
            audioHandler.PlaySound("swim", true);
            this.selectionIndex--;
        } else {
            handler.JumpTo("tab-1");
        }
    }

    Draw(camera: Camera): void {
        let embedBgImage = tiles["menuLargeEmbedBack"][0][0] as ImageTile;
        embedBgImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);

        if (this.selectionIndex > 0) {
            let tailImage = tiles["menuButton2Slice"][0][3] as ImageTile;
            tailImage.Draw(camera, this.centerX, this.centerY - 105, 1, 1, false, false, 0);
        }

        let lobbyImage = tiles["menuButton2"][0][0] as ImageTile;
        let lobbies = [this.lobbies[this.selectionIndex], this.lobbies[this.selectionIndex + 1]];
        let y = 0;
        camera.ctx.font = `600 ${20}px ${"arial"}`;
        camera.ctx.textAlign = "left";
        camera.ctx.fillStyle = "#333";
        for (let lobby of lobbies.filter(a => a)) {
            let gameData: GameExport = JSON.parse(lobby.data);
            lobbyImage.Draw(camera, this.centerX, this.centerY - 50 + y, 1, 1, false, false, 0);
            let boardImage = tiles["boardThumbs"][0][gameData.boardId] as ImageTile;
            boardImage.Draw(camera, this.centerX + 274, this.centerY + y - 50, 0.5, 0.5, false, false, 0);
            camera.ctx.fillText(`Game ${lobby.id} - ${lobby.hostName}`, this.centerX - 300 + 480, this.centerY + y - 60 + 270);

            let subtext = "Looking for players";
            if (gameData.currentRound == 0) subtext = "Starting";
            if (gameData.currentRound > 0) subtext = `Round ${gameData.currentRound} of ${gameData.finalRound}`;
            if (gameData.currentRound >= 999) subtext = "Ending";

            camera.ctx.fillText(subtext, this.centerX - 300 + 480, this.centerY + y - 60 + 270 + 30);
            y += 100;
        }

        if (this.lobbies.length > this.selectionIndex + 2) {
            let tailImage = tiles["menuButton2Slice"][0][0] as ImageTile;
            tailImage.Draw(camera, this.centerX, this.centerY + 105, 1, 1, false, false, 0);
        }
        let embedImage = tiles["menuLargeEmbed"][0][0] as ImageTile;
        embedImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
    }

    OnAction(handler: MenuHandler): void {
        let lobby = this.lobbies[this.selectionIndex];
        if (lobby) {
            handler.cursorTarget = null;
            handler.OpenPage(-1);

            let avatarSelect = (handler.FindById("avatarSelect") as MenuAvatarSelect);
            let selectedAvatar = avatarSelect.selectionIndex;
            playerIndex = avatarSelect.selectionIndex % 4;

            DataService.JoinParty(lobby.id, selectedAvatar).then(code => {
                if (code == -1) {
                    // can't join party!
                } else {
                    clientPlayerIndex = +code;
                    if (lobby.currentRound < 1) {
                        handler.OpenPage(3);
                        (handler.FindById("waitingTextHost") as MenuElement).isVisible = false;
                        (handler.FindById("lobbyDisplayPlayer") as MenuLobbyStateDisplayHost).gameId = lobby.id;
                        (handler.FindById("lobbyDisplayPlayer") as MenuLobbyStateDisplayHost).FetchUpdate(handler);
                    } else {
                        MoveToBoardView(lobby.id, handler, JSON.parse(lobby.data));
                    }
                }
            });
        }
    }
}


class MenuTab extends MenuElement {
    isActive = false;
    cursorAnchorOffsetX = -70;

    private tabList = ["tab-1", "tab-2", "tab-6"];

    constructor(id: string, centerX: number, centerY: number, private text: string) {
        super(id, centerX, centerY);
    }
    Draw(camera: Camera) {
        let tabImage = tiles["menuTab"][this.isActive ? 0 : 1][0] as ImageTile;
        tabImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        camera.ctx.font = `800 ${26}px ${"arial"}`;
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = this.isActive ? "#513ea3" : "#a79560";
        camera.ctx.fillText(this.text, this.centerX + 480, this.centerY + 270 + 13);
    }
    OnLeft(handler: MenuHandler): void { this.TabShift(handler, -1); }
    OnRight(handler: MenuHandler): void { this.TabShift(handler, 1); }

    TabShift(handler: MenuHandler, dir: -1 | 1) {
        let currentIndex = this.tabList.indexOf(this.id);
        let targetIndex = currentIndex + dir;
        if (targetIndex < 0) targetIndex = this.tabList.length - 1;
        if (targetIndex >= this.tabList.length) targetIndex = 0;

        let targetId = this.tabList[targetIndex];
        handler.JumpTo(targetId);
    }

    OnAction(handler: MenuHandler): void {
        if (!isLoggedIn) {
            audioHandler.PlaySound("error", true);
            return;
        }

        audioHandler.PlaySound("swim", true);
        let pageId = (+(this.id.replace("tab-", ""))) - 1;
        handler.OpenPage(pageId);
    }
    OnDown(handler: MenuHandler): void {
        let page = handler.pages[handler.currentPageIndex];
        handler.JumpTo(page[0]);
    }
    OnUp(handler: MenuHandler): void {
        let page = handler.pages[handler.currentPageIndex];
        handler.JumpTo(page[page.length - 1]);
    }
}

class MenuBoardSelect extends MenuElement {
    selectionIndex = 0;
    selectionCount = 4;
    selectionTexts = [
        ["A beginner-difficulty board", "featuring a few special", "board events and limited", "branching paths."],
        ["A beginner-difficulty board", "featuring some special", "board events and limited", "branching paths."],
        ["A medium-difficulty board", "featuring some special", "board events and several", "branching paths."],
        ["An expert-difficulty board", "featuring many special", "board events and non-linear", "movement."],
    ]
    cursorAnchorOffsetX = -170;
    OnLeft(handler: MenuHandler): void {
        audioHandler.PlaySound("swim", true);
        this.selectionIndex--;
        if (this.selectionIndex < 0) this.selectionIndex = this.selectionCount - 1;
    }
    OnRight(handler: MenuHandler): void {
        audioHandler.PlaySound("swim", true);
        this.selectionIndex++;
        this.selectionIndex %= this.selectionCount;
    }

    protected embedImage = "menuMediumEmbed";
    protected textYOffset = 0;
    Draw(camera: Camera): void {
        this.DrawArrows(camera);
        this.DrawSelectionContents(camera);
        let embedImage = tiles[this.embedImage][0][0] as ImageTile;
        embedImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        this.DrawSideText(camera);
    }
    DrawArrows(camera: Camera): void {
        let arrowImage = tiles["menuArrow"][0][0] as ImageTile;
        arrowImage.Draw(camera, this.centerX + 150, this.centerY, 1, 1, false, false, 0);
        arrowImage.Draw(camera, this.centerX - 150, this.centerY, 1, 1, true, false, 0);
    }
    DrawSideText(camera: Camera): void {
        let textLines = this.selectionTexts[this.selectionIndex];
        if (textLines) {
            let y = this.centerY - 50 + 270 + this.textYOffset;
            camera.ctx.font = `600 ${20}px ${"arial"}`;
            camera.ctx.textAlign = "left";
            camera.ctx.fillStyle = "#333";
            for (let textLine of textLines) {
                camera.ctx.fillText(textLine, this.centerX + 200 + 480, y);
                y += 24;
            }
        }
    }
    DrawSelectionContents(camera: Camera): void {
        let boardImage = tiles["boardThumbs"][0][this.selectionIndex] as ImageTile;
        boardImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
    }
    OnUp(handler: MenuHandler): void { handler.JumpTo("tab-2"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("turnSelect"); }
}

class MenuTurnSelect extends MenuBoardSelect {
    turnChoices = [15, 20, 30, 10];
    selectionTexts = [
        ["The default game duration,", "perfectly tailored for optimal", "fun."],
        ["A slightly longer game,", "where careful choices pay", "off over the long run."],
        ["A very long-haul game,", "a party marathon for diehard", "fans."],
        ["A quick game, where luck", "can turn things around more", "easily."],
    ]
    protected embedImage = "menuSmallEmbed";
    protected textYOffset = 24;
    DrawSelectionContents(camera: Camera): void {
        camera.ctx.font = `800 ${28}px ${"arial"}`;
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#222";
        let textLine = `${this.turnChoices[this.selectionIndex]} Rounds`;
        camera.ctx.fillText(textLine, this.centerX + 480, this.centerY + 10 + 270);
    }
    OnUp(handler: MenuHandler): void { handler.JumpTo("boardSelect"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("createGame"); }
}


class MenuMinigameSelect extends MenuBoardSelect {
    selectionCount = minigames.length;
    protected embedImage = "menuMediumEmbed";
    Draw(camera: Camera): void {
        this.DrawArrows(camera);
        this.DrawSelectionContents(camera);
        let embedImage = tiles[this.embedImage][0][0] as ImageTile;
        embedImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        camera.ctx.font = `800 ${30}px ${"arial"}`;
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#333";
        let textLine = new minigames[this.selectionIndex]().title;
        camera.ctx.fillText(textLine, 480, 320);
    }
    DrawSelectionContents(camera: Camera): void {
        let thumb = tiles["thumbnails"][this.selectionIndex % 4][Math.floor(this.selectionIndex / 4)] as ImageTile;
        thumb.Draw(camera, this.centerX, this.centerY, 0.5, 0.5, false, false, 0);
        let pb = MenuHandler.pbs[this.selectionIndex];
        if (pb) {
            let text = `High score: ${pb}`;
            camera.ctx.font = `800 ${30}px ${"arial"}`;
            camera.ctx.textAlign = "center";
            camera.ctx.fillStyle = "#333";
            camera.ctx.fillText(text, 480, 360);

        }
    }
    OnUp(handler: MenuHandler): void { handler.JumpTo("tab-6"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("minigameOk"); }
}

class MenuButtonMinigameOk extends MenuButtonBase {
    text = "Play";
    cursorAnchorOffsetX = -110;
    OnUp(handler: MenuHandler): void { handler.JumpTo("minigameSelect"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("tab-6"); }
    OnAction(handler: MenuHandler): void {
        let minigameSelect = (handler.FindById("minigameSelect") as MenuMinigameSelect);
        let minigame = new minigames[minigameSelect.selectionIndex]();
        currentMinigame = minigame;
        currentMinigame.isFreePlay = true;
        handler.cutscene.isDone = true;
    }
}


class MenuAvatarSelect extends MenuBoardSelect {
    selectionCount = 13;
    selectionTexts = [
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
    ]
    Draw(camera: Camera): void {
        this.DrawArrows(camera);
        this.DrawSelectionContents(camera);
        let embedImage = tiles[this.embedImage][0][0] as ImageTile;
        embedImage.Draw(camera, this.centerX, this.centerY, 1, 1, false, false, 0);
        camera.ctx.font = `800 ${30}px ${"arial"}`;
        camera.ctx.textAlign = "center";
        camera.ctx.fillStyle = "#333";
        let textLine = this.selectionTexts[this.selectionIndex][0];
        camera.ctx.fillText(textLine, 480, 320);
    }
    DrawSelectionContents(camera: Camera): void {
        camera.ctx.fillStyle = "#2224";
        camera.ctx.fillRect(this.centerX + 480 - 120, this.centerY + 270 - 68, 240, 136);
        let avatarImage = tiles["playerIcons"][this.selectionIndex][0] as ImageTile;
        avatarImage.Draw(camera, this.centerX, this.centerY, 0.5, 0.5, false, false, 0);
    }
    OnUp(handler: MenuHandler): void { handler.JumpTo("avatarOk"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("avatarOk"); }
}

class MenuAvatarDisplay extends MenuElement {
    constructor(private handler: MenuHandler, id: string, centerX: number, centerY: number) {
        super(id, centerX, centerY);
    }
    Draw(camera: Camera) {
        let avatarSelect = (this.handler.FindById("avatarSelect") as MenuAvatarSelect);
        let avatarImage = tiles["playerIcons"][avatarSelect.selectionIndex][0] as ImageTile;
        avatarImage.Draw(camera, this.centerX, this.centerY, 0.25, 0.25, false, false, 0);
    }
}

class MenuButtonAvatarOk extends MenuButtonBase {
    text = "OK";
    cursorAnchorOffsetX = -110;
    OnUp(handler: MenuHandler): void { handler.JumpTo("avatarSelect"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("avatarSelect"); }
    OnAction(handler: MenuHandler): void {
        handler.OpenPage(0);
        handler.cursorTarget = handler.FindById("avatarChange") as MenuButtonChangeAvatar;
    }
}

class MenuButtonChangeAvatar extends MenuButtonBase {
    text = "Character          ";
    cursorAnchorOffsetX = -140;
    OnUp(handler: MenuHandler): void { handler.JumpTo("selectGame"); }
    OnDown(handler: MenuHandler): void { handler.JumpTo("tab-1"); }
    OnLeft(handler: MenuHandler): void { handler.JumpTo("searchForGames"); }
    OnRight(handler: MenuHandler): void { handler.JumpTo("searchForGames"); }
    OnAction(handler: MenuHandler): void {
        handler.OpenPage(4);
        handler.cursorTarget = handler.FindById("avatarSelect") as MenuAvatarSelect;
    }
}

class MenuLobbyStateDisplayHost extends MenuElement {

    // element will periodically request lobby state from DB
    gameId = -1;
    lobbyState: GameExport | null = null;
    minPlayersTriggered = false;

    FetchUpdate(handler: MenuHandler): void {
        if (this.gameId != -1) {
            DataService.GetGameData(this.gameId).then(dt => {
                this.lobbyState = JSON.parse(dt.data);
                this.OnReceiveGameData(dt);
                if (this.lobbyState?.players.length || 0 >= 1) {
                    if (!this.minPlayersTriggered) {
                        this.minPlayersTriggered = true;
                        this.OnLobbyMinPlayers(handler);
                    }
                }
                if (this.lobbyState && this.lobbyState.currentRound <= 0) {
                    setTimeout(() => {
                        this.FetchUpdate(handler);
                    }, 5000);
                }
            });
        } else {
            console.log("Game id is '-1'");
        }
    }

    OnReceiveGameData(dt: PartyGameDT): void {
        if (!this.lobbyState) return;
        if (dt.playerIds.length == 0) return;
        let dtPlayerDatas = dt.playerIds.split(";");
        for (let dtPlayerData of dtPlayerDatas) {
            let playerId = +(dtPlayerData.split(",")[0]);
            let playerName = dtPlayerData.split(",")[1];
            let avatarIndex = +(dtPlayerData.split(",")[2]);
            let correspondingPlayerRecord = this.lobbyState.players.find(a => a.userId == playerId);
            if (!correspondingPlayerRecord) {
                // add to lobby state, then save to DB
                let newPlayer = {
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
                this.lobbyState.players.push(newPlayer);
                dt.data = JSON.stringify(this.lobbyState);
                DataService.SaveGameData(dt).then(a => { console.log("Game saved to DB") });
            }
        }
    }

    OnLobbyMinPlayers(handler: MenuHandler): void {
        (handler.FindById("waitingForPlayersTextHost") as MenuElement).isVisible = false;
        let button = (handler.FindById("startGame") as MenuButtonStartGame);
        button.isVisible = true;
        handler.cursorTarget = button;
    }

    Draw(camera: Camera): void {
        if (this.lobbyState) {
            let y = 0;
            camera.ctx.font = `600 ${20}px ${"arial"}`;
            camera.ctx.textAlign = "left";
            for (let p of this.lobbyState.players) {
                camera.ctx.fillStyle = "#ffdd76";
                camera.ctx.fillRect(this.centerX - 250 + 480, this.centerY + y - 155 + 270, 500, 50);
                let image = tiles["playerIcons"][p.avatarIndex][0] as ImageTile;
                image.Draw(camera, this.centerX - 200, this.centerY + y - 130, 0.25, 0.25, false, false, 0);
                camera.ctx.fillStyle = "#333";
                camera.ctx.fillText(p.userName, this.centerX - 150 + 480, this.centerY + y - 125 + 270);
                y += 60;
            }

        }
    }

}

class MenuLobbyStateDisplayPlayer extends MenuLobbyStateDisplayHost {
    FetchUpdate(handler: MenuHandler): void {
        if (this.gameId != -1) {
            DataService.GetGameData(this.gameId).then(dt => {
                this.lobbyState = JSON.parse(dt.data);
                if (this.lobbyState && this.lobbyState.currentRound >= 1) {
                    MoveToBoardView(this.gameId, handler, this.lobbyState);
                } else {
                    // wait a bit, check again
                    setTimeout(() => {
                        this.FetchUpdate(handler);
                    }, 5000);
                }
            });
        } else {
            console.log("Game id is '-1'");
        }
    }

    // OnLobbyMinPlayers(handler: MenuHandler): void {
    //     (handler.FindById("waitingForPlayersTextPlayer") as MenuElement).isVisible = false;
    //     (handler.FindById("waitingTextHost") as MenuElement).isVisible = true;
    // }

}

function MoveToBoardView(gameId: number, handler: MenuHandler, boardData: GameExport): void {
    handler.cutscene.isDone = true;
    board = new BoardMap(gameId);
    board.Initialize();
    board.isSpectateMode = true;
    board.FromData(boardData);
    board.CameraFocusSpace(board.boardSpaces[0]);
    board.SpectateUpdateLoop(false);
}

class MenuHandler {
    constructor(public cutscene: BoardCutScene) { }
    private timer = 0;
    elements: MenuElement[] = [
        new MenuBase("menuBase", 0, 0),
        new MenuTab("tab-1", -300, -205, "Join Game"),
        new MenuTab("tab-2", -50, -205, "Host Game"),
        new MenuTab("tab-6", 200, -205, "Free Play"),
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
        new MenuText("waitingTextHost", 0, 170, "Waiting for game to start..."),
        new MenuButtonStartGame("startGame", 0, 170),
        new MenuAvatarSelect("avatarSelect", 0, -70),
        new MenuButtonAvatarOk("avatarOk", 0, 170),
        new MenuMinigameSelect("minigameSelect", 0, -70),
        new MenuButtonMinigameOk("minigameOk", 0, 170),
    ];
    currentPageIndex = 0;
    pages = [
        ["selectGame", "searchForGames", "avatarChange", "avatarDisplay"],
        ["boardSelect", "turnSelect", "createGame"],
        ["lobbyDisplayHost", "waitingForPlayersTextHost", "startGame"],
        ["lobbyDisplayPlayer", "waitingForPlayersTextPlayer", "waitingTextHost"], // join a game
        ["avatarSelect", "avatarOk"],
        ["minigameSelect", "minigameOk"],
    ];

    OpenPage(pageIndex: number): void {
        this.currentPageIndex = pageIndex;
        for (let page of this.pages) {
            for (let elId of page) {
                let el = (this.FindById(elId) as MenuElement);
                if (el) {
                    el.isVisible = (this.pages.indexOf(page) == pageIndex) && el.defaultVisibility;
                } else {
                    console.error(`No element with id ${elId}`)
                }
            }
        }
        for (let el of this.elements.filter(a => a instanceof MenuTab) as MenuTab[]) {
            el.isActive = el.id == `tab-${pageIndex + 1}`;
        }
    }

    isInitialized = false;
    cursorTarget: MenuElement | null = null;
    static pbs: number[] = [];
    Initialize(): void {
        this.isInitialized = true;
        (this.FindById("tab-1") as MenuTab).isActive = true;
        let avatarSelect = (this.FindById("avatarSelect") as MenuAvatarSelect);
        avatarSelect.selectionIndex = Math.floor(Math.random() * avatarSelect.selectionCount);
        this.cursorTarget = (this.FindById("avatarChange") as MenuElement);
        this.OpenPage(0);

        if (!isLoggedIn) {
            this.OpenPage(5);
            this.cursorTarget = (this.FindById("minigameSelect") as MenuElement);
        }
        MenuHandler.pbs = StorageService.GetAllPBs();
    }

    Update(): void {
        if (!this.isInitialized) this.Initialize();
        this.timer++;
        if (this.cursorTarget) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true)) this.cursorTarget.OnLeft(this);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true)) this.cursorTarget.OnRight(this);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) this.cursorTarget.OnUp(this);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) this.cursorTarget.OnDown(this);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) this.cursorTarget.OnAction(this);
        }
    }

    JumpTo(id: string): void {
        audioHandler.PlaySound("swim", true);
        this.cursorTarget = this.FindById(id) || null;
    }

    FindById(id: string): MenuElement | undefined {
        return this.elements.find(a => a.id == id);
    }

    Draw(camera: Camera): void {
        for (let el of this.elements) {
            if (el.isVisible) el.Draw(camera);
        }
        if (this.cursorTarget) {
            let cursorImage = tiles["cursor"][0][0] as ImageTile;
            let targetX = this.cursorTarget.centerX + this.cursorTarget.cursorAnchorOffsetX - 50;
            let targetY = this.cursorTarget.centerY + this.cursorTarget.cursorAnchorOffsetY + 10;
            targetX += Math.sin(this.timer / 10) * 5;
            cursorImage.Draw(camera, targetX, targetY, 1, 1, false, false, 0);
        }

        if (this.currentPageIndex == -1) {
            camera.ctx.fillStyle = "#0005";
            camera.ctx.fillRect(0, 0, 960, 540);
            camera.ctx.fillStyle = "#444034";
            for (let i = 0; i < 8; i++) {
                camera.ctx.beginPath();
                camera.ctx.arc(960 / 2 + Math.sin((this.timer / 60 + i * 0.25) * Math.PI) * 100,
                    540 / 2 + Math.cos((this.timer / 60 + i * 0.25) * Math.PI) * Math.cos((this.timer / 120) * Math.PI) * 100,
                    10, 0, Math.PI * 2);
                camera.ctx.fill();
            }
        }
    }
}


class CutsceneMainMenu extends BoardCutScene {
    private timer = 0;
    public menuHandler = new MenuHandler(this);
    Update(): void {
        if (this.timer == 1) {
            audioHandler.SetBackgroundMusic("lobby");
        }
        this.timer++;
        this.menuHandler.Update();
    }

    Draw(camera: Camera): void {
        // bg + stars
        let bg = tiles["menuBack"][0][0] as ImageTile;
        bg.Draw(camera, 0, 0, 1, 1, false, false, 0);

        let starImage = tiles["menuStar"][0][0] as ImageTile;
        let starSpeed = 0.5;
        for (let starX = (this.timer * starSpeed) % 200 - 680; starX < 580; starX += 200) {
            for (let starY = (this.timer * starSpeed) % 200 - 470; starY < 370; starY += 200) {
                starImage.Draw(camera, starX, starY, 1, 1, false, false, 0);
                starImage.Draw(camera, starX + 100, starY + 100, 1, 1, false, false, 0);
            }
        }

        this.menuHandler.Draw(camera);


        // fade in
        if (this.timer < 16) {
            camera.ctx.fillStyle = `rgba(0,0,0,${(16 - this.timer) / 16})`;
            camera.ctx.fillRect(0, 0, 960, 540);
        }
    }
}