abstract class BoardCutScene {
    isDone = false;
    static backdrop: ImageTile | null = null;
    static sprites: Sprite[] = [];
    abstract Update(): void;
    abstract Draw(camera: Camera): void;
    GetFollowUpCutscenes(): BoardCutScene[] { return [] };
}

class BoardCutSceneAddCoins extends BoardCutScene {
    constructor(private numCoins: number, private player: Player) {
        super();
        this.floatingText = numCoins > 0 ? ("+" + numCoins.toString()) : numCoins.toString();
        this.floatingTextColor = numCoins > 0 ? 3 : 4;
        this.floatingTextDirection = numCoins > 0 ? -1 : 1;
    }
    private timer = 0;
    private floatingText!: string;
    private floatingTextColor!: number;
    private floatingTextDirection!: number;

    Update(): void {
        if (this.timer == 0) this.player.coins += this.numCoins;
        if (this.player.coins < 0) this.player.coins = 0;
        this.timer++;
        if (this.timer > 50) {
            this.isDone = true;
        }
    }
    Draw(camera: Camera): void {
        if (!this.player.token) return;
        let y = this.player.token.y - 100 + this.floatingTextDirection * this.timer * 0.5;
        DrawText(this.player.token.x, y, this.floatingText, camera, 0.5, this.floatingTextColor);
    }
}

class BoardCutSceneChangeDice extends BoardCutScene {
    constructor(private direction: "up" | "down", private player: Player, numDiceUpgrades: number) {
        super();

        let currentFaces = [...player.diceBag.dieFaces];
        currentFaces.sort((a, b) => a - b); // numeric sort
        if (direction == "down") currentFaces.reverse();

        let facesToChange = currentFaces.slice(0, numDiceUpgrades);
        for (let faceToChange of facesToChange) {
            let index = player.diceBag.dieFaces.findIndex((a, i) => a == faceToChange && this.diceIndecesToChange.indexOf(i) == -1);
            // find first dicebag index that matches AND hasn't already been pulled in to our index list
            if (index == -1) {
                console.error("CAN'T FIND MATCHING DICE FACE");
            } else {
                this.diceIndecesToChange.push(index);
            }
        }
    }
    private timer = 0;
    private diceIndecesToChange: number[] = [];
    private diceYOffset = 500;
    private scale = 1;

    Update(): void {
        this.timer++;

        if (this.timer <= 120) {
            this.diceYOffset = ((Math.cos((this.timer / 120) * Math.PI) + 1) / 2) * 200 + 50;
        }

        if (this.timer == 150) {
            this.scale = 1.5;
            if (this.direction == "up") {
                audioHandler.PlaySound("hit2", true);
                this.PerformUpgrade();
            } else {
                audioHandler.PlaySound("erase", true);
                this.PerformDowngrade();
            }
        }

        if (this.timer > 150) {
            this.scale **= 0.9;
        }

        if (this.timer > 240) {
            this.diceYOffset = ((Math.cos(((360 - this.timer) / 120) * Math.PI) + 1) / 2) * 200 + 50;
        }

        if (this.timer == 360) {
            this.isDone = true;
        }
    }

    PerformUpgrade(): void {
        for (let diceIndexToChange of this.diceIndecesToChange) {
            let oldValue = this.player.diceBag.dieFaces[diceIndexToChange];
            let newValue = (oldValue >= 12 ? 20 : (oldValue + 2)) as FaceCount;
            this.player.diceBag.dieFaces[diceIndexToChange] = newValue;
        }
    }

    PerformDowngrade(): void {
        for (let diceIndexToChange of this.diceIndecesToChange) {
            let oldValue = this.player.diceBag.dieFaces[diceIndexToChange];
            let newValue = (oldValue == 20 ? 12 : (oldValue == 4 ? 4 : (oldValue - 2))) as FaceCount;
            this.player.diceBag.dieFaces[diceIndexToChange] = newValue;
        }
    }

    Draw(camera: Camera): void {
        if (!this.player.token) return;

        let totalSpace = 100;
        let spaceBetween = 0;
        let x = this.player.token.x;

        if (this.diceIndecesToChange.length > 1) {
            spaceBetween = totalSpace / (this.diceIndecesToChange.length - 1);
            x = this.player.token.x - totalSpace / 2;
        }

        let scale = 0.5 * this.scale;
        for (let diceIndex of this.diceIndecesToChange) {
            let faces = this.player.diceBag.dieFaces[diceIndex];
            let frameSheet = "d" + faces.toString();
            let dieImage = tiles[frameSheet][0][0] as ImageTile;

            dieImage.Draw(camera, x, this.player.token.y - this.diceYOffset, scale, scale, false, false, 0);

            x += spaceBetween;
        }
    }
}

class BoardCutScenePadding extends BoardCutScene {
    constructor(private paddingTicks = 20) {
        super();
    }
    private timer = 0;
    Update(): void {
        this.timer++;
        if (this.timer == this.paddingTicks) {
            this.isDone = true;
        }
    }
    Draw(camera: Camera): void { }
}

class BoardCutSceneMoveGear extends BoardCutScene {
    constructor(private isInitial: boolean) {
        super();
    }
    private timer = 0;
    private targetSpace: BoardSpace | null = null;
    Update(): void {
        if (!board) return;
        this.timer++;
        if (this.timer == 1) {
            if (this.isInitial) {
                this.targetSpace = board.boardSpaces.find(a => a.spaceType == BoardSpaceType.GearSpace) || board.boardSpaces[0];
            } else {
                this.targetSpace = board.PlaceGearSpace();
            }
        }
        if (this.targetSpace) board.CameraFocusSpace(this.targetSpace);
        if (this.timer > 60) this.isDone = true;
    }
    Draw(camera: Camera): void { }

    GetFollowUpCutscenes(): BoardCutScene[] {
        return [
            new BoardCutScenePadding(),
            new BoardCutSceneDialog("This is where the golden gear is now. Be the first one \nthere to buy a golden gear!"),
            board?.currentPlayer ? new BoardCutSceneFocusPlayer(board.currentPlayer) : new BoardCutScenePadding(),
            new BoardCutScenePadding(),
            new BoardCutScenePadding(),
            new BoardCutScenePadding()
        ]
    };
}

class BoardCutSceneAddItem extends BoardCutScene {
    constructor(private item: BoardItem, private player: Player) {
        super();
    }
    private timer = 0;
    private targetTimer = 70;

    Update(): void {
        this.timer++;
        if (this.timer == this.targetTimer) {
            if (!this.item.isPlaceholder) {
                this.player.inventory.push(this.item);
            }
            this.item.OnCollectItem(this.player);
            audioHandler.PlaySound("dobbloon", true);
            this.isDone = true;
        }
    }
    Draw(camera: Camera): void {
        let token = this.player.token;
        if (!token) return;
        if (this.timer > this.targetTimer) return;

        let timeLeft = this.targetTimer - this.timer;
        let scale = (timeLeft / this.targetTimer + 1) / 4;

        this.item.imageTile.Draw(camera, token.x, token.y - timeLeft - 30, scale, scale, false, false, 0);
    }

    GetFollowUpCutscenes(): BoardCutScene[] {
        return [
            new BoardCutScenePadding(),
            new BoardCutSceneEmote(0, this.player),
            new BoardCutScenePadding()
        ]
    };
}

class BoardCutSceneEmote extends BoardCutScene {
    constructor(private emoteIndex: number, private player: Player) {
        super();
    }
    private timer = 0;
    private targetTimer = 100;

    Update(): void {
        this.timer++;
        if (this.timer == this.targetTimer) {
            this.isDone = true;
        }
    }
    Draw(camera: Camera): void {
        let token = this.player.token;
        if (!token) return;
        if (this.timer > this.targetTimer) return;

        let imageTile = tiles["emote"][this.emoteIndex][0] as ImageTile;
        let scale = 0.2;

        imageTile.Draw(camera, token.x + 40, token.y - 40, scale, scale, false, false, 0);
    }
}

class BoardCutSceneFocusPlayer extends BoardCutScene {
    constructor(private player: Player) { super(); }
    Update(): void {
        if (board) {
            board.CameraFollow(this.player);
            let camDistance = (camera.x - (this.player.token?.x || 0)) + (camera.y - (this.player.token?.y || 0));
            if (camDistance < 5) this.isDone = true;
        }
    }
    Draw(camera: Camera): void { }
}


type Spam = { name: string, text: string, action: TwitchSpaceAction, y: number, color: string, nameWidth: number };
class BoardCutSceneTwitchSpace extends BoardCutScene {
    constructor(private player: Player) { super(); }
    private timer = 0;
    private ready = false;
    private panelWidth = 350;
    private chatOffset = 0;
    private isLocked = false;
    private lockTimer = 0;
    private timeToLockSpam = 360;
    private spams: Spam[] = [];
    private selectedSpam: Spam | null = null;
    Update(): void {
        if (!this.ready) {
            let now = +(new Date());
            let timeSinceConfirm = now - twitchSpaceLockInTime;
            if (timeSinceConfirm < 1000 * 15) {
                // less than 15 seconds
                this.ready = true;
                this.InitializeSpam();
            } else {
                return;
            }
        }

        board?.CameraFollow(this.player);
        if (this.lockTimer < this.timeToLockSpam) {
            camera.targetX += 100;
            camera.targetScale = 2.5;
        }

        this.timer++;

        if (this.timer > 100 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.isLocked = true;
            this.selectedSpam = this.spams.find(a => a.y - this.chatOffset == 280) || null;
        }

        if (!this.isLocked && Math.random() < 0.1) {
            this.chatOffset += 20;
            audioHandler.PlaySound("swim", true);
        }

        if (this.isLocked) {
            this.lockTimer++;
        }

        let totalHeight = Math.max(...this.spams.map(a => a.y)) + 20;
        if (this.chatOffset > totalHeight) this.chatOffset -= totalHeight;

        if (this.lockTimer == this.timeToLockSpam + 30) {
            if (this.selectedSpam) this.selectedSpam.action.processEvent(this.player);
            this.isDone = true;
        }
    }

    InitializeSpam(): void {
        let weights = Array.from(document.querySelectorAll("#twitchSpaceInput input")).map(a => +((a as HTMLInputElement).value));
        let actions = Object.values(TwitchSpaceAction) as TwitchSpaceAction[];
        for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
            let action = actions[actionIndex];
            let weight = weights[actionIndex];

            for (let i = 0; i < weight; i++) {
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

        let heightPerRow = 20;
        let copyCount = Math.ceil(540 / heightPerRow);
        let originalCopy = this.spams.map(a => ({ ...a }));
        for (let i = 0; i < copyCount; i++) {
            this.spams.push(...originalCopy.map(a => ({ ...a })));

        }
        this.spams = Random.GetShuffledCopy(this.spams);
        this.spams.forEach((el, i) => {
            el.y = i * heightPerRow;
            el.color = Random.SeededRandFrom(["Blue", " Coral", " DodgerBlue", " SpringGreen", " YellowGreen", " Green", " OrangeRed", " Red", " GoldenRod", " HotPink", " CadetBlue", " SeaGreen", " Chocolate", " BlueViolet", " Firebrick"]);
            camera.ctx.font = `700 ${15}px ${"arial"}`;
            el.name = GetRandomUserName();
            el.nameWidth = camera.ctx.measureText(el.name + ":").width;
            el.text = Random.SeededRandFrom(el.action.spams);
        });
    }

    Draw(camera: Camera): void {
        let panelX = 960 - this.panelWidth;
        if (this.timer < 60) {
            panelX += (((60 - this.timer) / 60) ** 2) * this.panelWidth
        }
        if (this.lockTimer > this.timeToLockSpam) {
            panelX += (((this.lockTimer - this.timeToLockSpam) / 60) ** 2) * this.panelWidth
        }

        camera.ctx.fillStyle = "#18181b";
        camera.ctx.fillRect(panelX, 0, this.panelWidth, 540);
        camera.ctx.textAlign = "left";

        let totalHeight = Math.max(...this.spams.map(a => a.y)) + 20;
        for (let spam of this.spams) {
            for (let lineY of [spam.y, spam.y + totalHeight]) {
                let x = panelX + 20;
                if (this.selectedSpam && this.selectedSpam != spam) {
                    x += (((this.lockTimer - 20) / 20) ** 2) * 5;
                }

                camera.ctx.font = `700 ${15}px ${"arial"}`;
                camera.ctx.fillStyle = spam.color;
                camera.ctx.fillText(spam.name + ": ", x, lineY - this.chatOffset);
                camera.ctx.font = `400 ${15}px ${"arial"}`;
                camera.ctx.fillStyle = "#efeff1";
                camera.ctx.fillText(spam.text, x + spam.nameWidth + 5, lineY - this.chatOffset);
            }
        }
    }
}



class BoardCutSceneDialog extends BoardCutScene {
    constructor(private text: string) {
        super();
        this.pages = text.split("\\").map(page => page.split("\n"));
        this.AutoSplitLines();
    }

    public AutoSplitLines(): void {
        // split each page into lines. Pages are expected to be manually split.

        camera.ctx.font = `400 ${20}px ${"arial"}`;
        for (let i = 0; i < this.pages.length; i++) {
            // only operate on single-line pages; ignore pre-cut lines
            if (this.pages[i].length != 1) continue;

            let words = this.pages[i][0].split(" ");
            let line = "";
            let nextword = words.splice(0, 1)[0];
            let maxWidth = 520;

            let newPage: string[] = [];

            while (true) {
                let width = camera.ctx.measureText(line + " " + nextword).width;
                if (width < maxWidth) {
                    if (nextword) line += " " + nextword;
                    nextword = words.splice(0, 1)[0];
                    if (nextword == undefined) {
                        // page done! 
                        newPage.push(line.trimStart());
                        break;
                    } else {
                        continue;
                    }
                } else {
                    newPage.push(line.trimStart());
                    line = nextword;
                    nextword = words.splice(0, 1)[0];
                }
            }
            this.pages[i] = newPage;
        }

    }

    private timer = 0;
    private appearMax = 20;
    private appearTimer = 0;
    private textTimer = 0;
    private pages: string[][] = [];
    private charIndex = 0;

    Update(): void {
        this.timer++;
        if (this.pages.length > 0 && this.appearTimer < this.appearMax) {
            this.appearTimer++;
        } else {
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
            if (this.appearTimer <= 0) this.isDone = true;
        }
    }

    IsPageDone(): boolean {
        return this.pages.length > 0 && this.charIndex > this.pages[0].join("\n").length + 3;
    }

    Draw(camera: Camera): void {
        let cam = new Camera(camera.canvas);

        let width = 560;
        if (this.appearTimer < this.appearMax) width *= (this.appearTimer / this.appearMax);
        let panelX = cam.canvas.width / 2 - width / 2;
        cam.ctx.fillStyle = "#013C";
        cam.ctx.fillRect(panelX, 380, width, 150);

        cam.ctx.fillStyle = "#EEE";
        cam.ctx.textAlign = "left";
        cam.ctx.font = `400 ${20}px ${"arial"}`;
        let page = this.pages[0];
        if (page) {
            let y = 420;
            let x = panelX + 20;
            let charCount = this.charIndex;
            for (let line of page) {
                let substring = line.substring(0, charCount);
                charCount -= line.length;
                cam.ctx.fillText(substring, x, y);
                y += 30;
            }
        }

        if (this.IsPageDone()) {
            let image = tiles["controls"][0][0] as ImageTile;
            let scale = Math.sin(this.timer / 10) / 8 + 1.25;
            image.Draw(cam, 250, 230, scale, scale, false, false, 0);
        }

    }
}


function JoinPlayers(players: Player[]): string {
    if (players.length == 4) {
        return `${players[0].avatarName}, ${players[1].avatarName}, ${players[2].avatarName}, and ${players[3].avatarName}`;
    } else if (players.length == 3) {
        return `${players[0].avatarName}, ${players[1].avatarName}, and ${players[2].avatarName}`;
    } else if (players.length == 2) {
        return `${players[0].avatarName} and ${players[1].avatarName}`;
    } else if (players.length == 1) {
        return players[0].avatarName;
    } else {
        return players.map(a => a.avatarName).join(" & ");
    }
}
class BoardCutSceneLast5Turns extends BoardCutScene {
    Update(): void {
        if (!board) return;

        let texts = [
            "Well everyone, we're down to the final five turns of the game! And what a game it's been. Let's take a moment to look at the standings.",
            this.GetPlacementText(),
            "But it's still anyone's game! There's a few rule changes coming up that could let anyone swoop in for a surprise victory!",
            "The value of blue and red coin spaces are now doubled, adding or subtracting 6 coins instead of 3.",
            "Additionally, passing a golden gear space will now let you buy a pair of gears. And if you land on the space, you'll have the option to buy three!",
            "It's not over until it's over! Best of luck to all the players!"
        ];

        cutsceneService.AddScene(
            new BoardCutSceneFadeOut(),
            new BoardCutSceneSetBackdrop(tiles["spaceBoardBlur"][0][0]),
            new BoardCutSceneFadeIn(),
            new BoardCutSceneDialog(texts.join("\\")),
            new BoardCutSceneFadeOut(),
            new BoardCutSceneSetBackdrop(null),
            new BoardCutSceneFadeIn());

        this.isDone = true;
    }

    GetPlacementText(): string {
        let totalPlayerCount = (board as BoardMap).players.length;
        if (totalPlayerCount <= 4) {
            let playerPlacements = [1, 2, 3, 4].map(p => (board as BoardMap).players.filter(a => a.CurrentPlace() == p));
            let placementText = "";

            if (playerPlacements[0].length == 4) {
                // 4-way tie for first
                placementText = `Amazingly, we have a 4-way tie for 1st place! ${JoinPlayers(playerPlacements[0])} are all tied for the lead.`;
            } else if (playerPlacements[0].length == 3) {
                // 3-way tie for first, 1 person in last
                placementText = `It looks like we have a 3-way tie for 1st place! ${JoinPlayers(playerPlacements[0])} are tied for the lead, while ${JoinPlayers(playerPlacements[3])} is in dead last.`;
            } else if (playerPlacements[0].length == 2) {
                // 2-way tie for first
                placementText = `We have a 2-way tie for 1st place! ${JoinPlayers(playerPlacements[0])} are vying for the win, `;
                if (playerPlacements[2].length == 2) {
                    // 2-way tie for third
                    placementText += `and ${JoinPlayers(playerPlacements[2])} are tied for 3rd.`;
                } else {
                    //3rd place, 4th place
                    placementText += `${JoinPlayers(playerPlacements[2])} is sitting in 3rd, and ${JoinPlayers(playerPlacements[3])} is in last place.`;
                }
            } else {
                // 1st place
                placementText = `${JoinPlayers(playerPlacements[0])} is in a commanding first place, `;

                if (playerPlacements[1].length == 3) {
                    // 3-way tie for 2nd
                    placementText += `while ${JoinPlayers(playerPlacements[1])} are all fighting for 2nd.`;
                } else if (playerPlacements[1].length == 2) {
                    // 2-way tie for 2nd, 4th place
                    placementText += `${JoinPlayers(playerPlacements[1])} are fighting for 2nd, and ${JoinPlayers(playerPlacements[3])} is in last place.`;
                } else {
                    // 2nd place
                    placementText += `${JoinPlayers(playerPlacements[1])} is in a close 2nd, `;
                    if (playerPlacements[2].length == 2) {
                        // 2-way tie for 3rd
                        placementText += `and ${JoinPlayers(playerPlacements[2])} are tied for last.`;
                    } else {
                        // all 4 places
                        placementText += `${JoinPlayers(playerPlacements[2])} is in 3rd, and ${JoinPlayers(playerPlacements[3])} is in last place.`;
                    }
                }
            }
            return placementText;
        } else {
            // Alt less-pretty for more players
            let lines: string[] = [];
            let possiblePlaces: number[] = [];
            for (let i = 0; i < totalPlayerCount; i++) possiblePlaces.push(i + 1); // [1,2,3,4,5...]
            let playerPlacements = possiblePlaces.map(p => (board as BoardMap).players.filter(a => a.CurrentPlace() == p));
            for (let placeIndex = 0; placeIndex < playerPlacements.length; placeIndex++) {
                let playersInPlace = playerPlacements[placeIndex];
                if (playersInPlace.length == 0) continue;
                let ordinal = NumberToOrdinal(placeIndex + 1);

                let joinedPlayerNames = JoinPlayers(playersInPlace);

                let text = `${joinedPlayerNames} ${playersInPlace.length == 1 ? "is" : "are"} in ${ordinal} place`;
                lines.push(text);
            }

            return lines.join(", ") + ".";
        }
    }
    Draw(camera: Camera): void { }

}

class BoardCutSceneFadeOut extends BoardCutScene {
    private timer = 0;
    private targetTime = 60;
    Update(): void {
        this.timer++;
        if (this.timer >= this.targetTime) this.isDone = true;
    }
    Draw(camera: Camera): void {
        let opacity = this.timer / this.targetTime;
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        let hexOpacity = (opacity * 255).toString(16).split(".")[0].padStart(2, "00").substring(0, 2);
        camera.ctx.fillStyle = "#000000" + hexOpacity;
        camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
    }

}
class BoardCutSceneFadeIn extends BoardCutScene {
    private timer = 0;
    private targetTime = 60;
    Update(): void {
        this.timer++;
        if (this.timer >= this.targetTime) this.isDone = true;
    }
    Draw(camera: Camera): void {
        let opacity = (this.targetTime - this.timer) / this.targetTime;
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        let hexOpacity = (opacity * 255).toString(16).split(".")[0].padStart(2, "00").substring(0, 2);
        camera.ctx.fillStyle = "#000000" + hexOpacity;
        camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
    }

}



class BoardCutSceneSingleAction extends BoardCutScene {
    constructor(private action: () => void) { super(); }
    Update(): void {
        this.isDone = true;
        this.action();
    }
    Draw(camera: Camera): void { }
}
class BoardCutSceneSetBackdrop extends BoardCutSceneSingleAction {
    constructor(backdrop: ImageTile | null) {
        super(() => {
            BoardCutScene.backdrop = backdrop;
        });
    }
}

class BoardCutScenePortalSwap extends BoardCutScene {
    constructor(private triggerPlayer: Player, private targetPlayer: Player) {
        super();
        this.baseX = triggerPlayer.token.x;
        this.baseY = triggerPlayer.token.y;
    }
    baseX = 0;
    baseY = 0;
    timer = 0;
    Update(): void {
        this.timer++;
        if (this.timer == 1) {
            audioHandler.PlaySound("warp", false);
        }
        if (this.timer == 60) {
            let targetSquare = this.targetPlayer.token?.currentSpace;
            this.targetPlayer.token.currentSpace = this.triggerPlayer.token.currentSpace;
            this.triggerPlayer.token.currentSpace = targetSquare;
            this.targetPlayer.token?.Update();
            this.triggerPlayer.token?.Update();
        }
        if (this.timer == 150) {
            this.isDone = true;
            // and then start the player's roll (NOT THE ITEM MENU)
            if (board) board.boardUI.StartRoll();
        }
    }

    Draw(camera: Camera): void {
        if (this.timer < 120) {
            let tile = tiles["itemIcons"][1][1] as ImageTile;
            let size = (60 - Math.abs(60 - this.timer)) / 10;
            tile.Draw(camera, this.baseX, this.baseY, size, size, false, false, this.timer / 10);
        }
    }
}

class BoardCutSceneDevExit extends BoardCutScene {
    constructor(private triggerPlayer: Player) {
        super();
        this.baseX = triggerPlayer.token.x;
        this.baseY = triggerPlayer.token.y;
    }
    baseX = 0;
    baseY = 0;
    timer = 0;
    Update(): void {
        this.timer++;
        if (this.timer == 1) {
            audioHandler.PlaySound("boing", false);
        }
        if (this.timer == 60 && board) {
            let targetSpace = board.boardSpaces.find(a => a.spaceType == BoardSpaceType.GearSpace);
            if (targetSpace) {
                targetSpace = board.boardSpaces.find(a => a.nextSpaces.indexOf(targetSpace as BoardSpace) > -1)
            }
            if (this.triggerPlayer.token && targetSpace) {
                this.triggerPlayer.token.currentSpace = targetSpace;
            }
            this.triggerPlayer.token?.Update();
        }
        if (this.timer < 150 && this.timer > 90 && board) {
            board.CameraFollow(this.triggerPlayer);
        }
        if (this.timer == 150) {
            this.isDone = true;
            // and then start the player's roll (NOT THE ITEM MENU)
            if (board) board.boardUI.StartRoll();
        }
    }

    Draw(camera: Camera): void {
        if (this.timer < 120) {
            let tile = tiles["itemIcons"][0][1] as ImageTile;
            let sizeWiggle = this.timer > 30 ? 0 : ((this.timer - 30) / 30);
            let size = Math.cos(this.timer / 4) * sizeWiggle + 1;

            if (this.timer > 60) {
                size = (80 - this.timer) / 20;
                if (size < 0) size = 0;
            }

            tile.Draw(camera, this.baseX, this.baseY, size, size, false, false, 0);
        }
    }
}



abstract class BoardCutScenePlayerList extends BoardCutScene {
    x = 180;
    scoreBoxes: { player: Player, y: number, targetY: number }[] = []; // indexes into board.players
    localPlayerList: Player[] = [];
    headingRow = 1;
    headingTimer = 0;
    opacity = 180;

    abstract PlayerSorter(a: Player, b: Player): number;
    abstract AdditionalUpdateLogic(): void;
    abstract Complete(): void;
    abstract AdditionalDraw(playerIndex: number, y: number): void;

    GetImageY(boxY: number) { return boxY - 270 + 50}

    Update(): void {
        this.headingTimer++;
        this.localPlayerList.sort(this.PlayerSorter.bind(this));
        if (this.scoreBoxes.length == 0) {
            //init
            this.localPlayerList = [...board!.players];
            this.scoreBoxes = this.localPlayerList.map(a => ({ player: a, y: 600, targetY: 600 }));
        } else {
            // sort by placement
            this.scoreBoxes.sort((a,b) => this.localPlayerList.indexOf(a.player) - this.localPlayerList.indexOf(b.player))
        }

        for (let i = 0; i < this.scoreBoxes.length; i++) {
            this.scoreBoxes[i].targetY = i * 110 + 95;
        }
        this.AdditionalUpdateLogic();
        this.UpdateBoxPositions();
    }

    UpdateBoxPositions(): void {
        let boxSpeed = 4;
        for (let scorebox of this.scoreBoxes) {
            if (Math.abs(scorebox.y - scorebox.targetY) < boxSpeed) scorebox.y = scorebox.targetY;
            if (scorebox.y < scorebox.targetY) scorebox.y += boxSpeed;
            if (scorebox.y > scorebox.targetY) scorebox.y -= boxSpeed;
        }
    }

    Draw(camera: Camera): void {
        if (this.opacity <= 0) return;
        var ctx = camera.ctx;
        ctx.fillStyle = "#000000" + Math.floor(this.opacity).toString(16).padStart(2, "00");
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 4;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = `800 ${36}px ${"arial"}`;
        ctx.textAlign = "right";

        let title = tiles["minigameText"][0][this.headingRow] as ImageTile;
        title.Draw(camera, this.x - 180, Math.min(-220, this.headingTimer - 350), 1, 1, false, false, 0);

        for (let playerIndex = 0; playerIndex < board!.players.length; playerIndex++) {
            let scorebox = this.scoreBoxes[playerIndex];
            if (scorebox) {
                this.DrawBasePlayerBox(playerIndex, scorebox.y);
                this.AdditionalDraw(playerIndex, scorebox.y);
            }
        }
    }

    DrawBasePlayerBox(playerIndex: number, y: number): void {
        let player = this.scoreBoxes[playerIndex].player;
        let cam = board!.boardUI.uiCamera;
        let image = tiles["playerIcons"][player.avatarIndex][0] as ImageTile;
        cam.ctx.fillStyle = "#000D";
        cam.ctx.fillRect(this.x, y, 600, 100);
        cam.ctx.strokeRect(this.x, y, 600, 100);
        image.Draw(cam, this.x - 480 + 50, this.GetImageY(y), 0.4, 0.4, false, false, 0);
    }

}

class BoardCutSceneStandings extends BoardCutScenePlayerList {
    constructor(private awards: {player: Player, coins: number}[]) {
        super();
    }

    timer = 0;
    PlayerSorter(a: Player, b: Player): number {
        return (a.CurrentPlace() + a.turnOrder / 10) - (b.CurrentPlace() + b.turnOrder / 10);
    }

    AdditionalUpdateLogic(): void {
        this.timer++;

        if (this.timer > 150) {
            if (this.timer % 8 == 0) {
                let playSound = false;
                for (let award of this.awards) {
                    if (award.coins > 0) {
                        award.coins--;
                        award.player.coins++;
                        award.player.displayedCoins++;
                        playSound = true;
                    }
                }
                if (playSound) audioHandler.PlaySound("coin", true);
            }
        }

        let endTime = 400;

        if (this.timer >= endTime) {
            this.x += (this.timer - endTime)/2;
            if (this.x > 1100) {
                this.opacity -= 3;
            }
            if (this.opacity <= 0) this.Complete();
        }


    }

    Complete(): void {
        if (!board) return;
        this.isDone = true;
        board.currentRound++;
        board.SaveGameStateToDB();
        board.boardUI.roundStarttimer = 1;
        if (board.finalRound - board.currentRound + 1 == 5) {
            cutsceneService.AddScene(new BoardCutSceneLast5Turns());
        }
        if (board.finalRound - board.currentRound + 1 == 0) {
            audioHandler.SetBackgroundMusic(board.songId);
            cutsceneService.AddScene(new BoardCutSceneGameEnd());
        }
    }

    AdditionalDraw(playerIndex: number, y: number): void {
        // Draw placement, gears, coins
        let player = this.scoreBoxes[playerIndex].player;
        let cam = board!.boardUI.uiCamera;
        let gearIcon = tiles["uiLargeIcons"][0][0] as ImageTile;
        let coinIcon = tiles["uiLargeIcons"][0][1] as ImageTile;
        gearIcon.Draw(cam, this.x - 480 + 300, this.GetImageY(y), 1, 1, false, false, 0);
        coinIcon.Draw(cam, this.x - 480 + 470, this.GetImageY(y), 1, 1, false, false, 0);
        cam.ctx.fillStyle = "#FFF";
        cam.ctx.textAlign = "right";
        cam.ctx.font = `800 ${36}px ${"arial"}`;
        cam.ctx.fillText(player.CurrentPlaceText(), this.x + 200, y + 50 + 14);
        cam.ctx.fillText(player.gears.toString(),this.x + 400, y + 50 + 14);
        cam.ctx.fillText(player.displayedCoins.toString(), this.x + 570, y + 50 + 14);
        
        for (let scorebox of this.scoreBoxes) {
            let award = this.awards.find(a => a.player == scorebox.player);
            if (award && award.coins > 0) {
                DrawText(this.x + 160, this.GetImageY(scorebox.y), "+" + award.coins, cam, 0.3, 3);
            }
        }
    }
}


class BoardCutSceneMinigameResults  extends BoardCutScenePlayerList {
    headingRow = 2;
    fetchedScores: {playerUserId: number, score: number}[] = [];
    countDown = 120;
    isFetching = false;
    fetchTimer = 0;

    Complete(): void {
        this.isDone = true;
        
        if (board) board.pendingMinigame = null;

        // coins are distributed based on minigame placement
        // 10 for 1st, 3 for 2nd, 2 for 3rd
        // If tie for 1st, we get [10, 10, 2, 0]
        // If 3-way tie for 2nd, we get [10, 3, 3, 3]
        let coinDistribution = [10, 3, 2];
        
        let sortedScores = this.fetchedScores.map(a => a.score); 
        sortedScores.sort((a, b) => b - a);
        let awards: {player: Player, coins: number}[] = [];

        for (let fetchedScore of this.fetchedScores) {
            let scorePlacement = sortedScores.indexOf(fetchedScore.score);
            // 0 for 1st (or if tying for 1st!)
            let winnings = coinDistribution[scorePlacement] || 0;
            let player = board!.players.find(a => a.userId == fetchedScore.playerUserId);
            if (player) {
                awards.push({player: player, coins: winnings});
                player.statMinigameWinnings += winnings;
            }
        }
        
        cutsceneService.AddScene(new BoardCutSceneStandings(awards));
    }

    AdditionalDraw(playerIndex: number, y: number): void {
        // draw scores
        let player = this.scoreBoxes[playerIndex].player;
        let score = this.fetchedScores.find(x => x.playerUserId == player.userId);
        if (score) {
            let cam = board!.boardUI.uiCamera;
            cam.ctx.fillStyle = "#FFF";
            cam.ctx.textAlign = "right";
            cam.ctx.font = `800 ${36}px ${"arial"}`;
            cam.ctx.fillText(score.score.toString(), this.x + 570, y + 50 + 14);
        }
    }

    AdditionalUpdateLogic(): void {
        audioHandler.SetBackgroundMusic("lobby")
        for (let scorebox of this.scoreBoxes) {
            let matchingScore = this.fetchedScores.find(a => a.playerUserId == scorebox.player.userId);
            if (!matchingScore) scorebox.targetY = 600;
        }
        if (this.fetchedScores.length == this.scoreBoxes.length && this.scoreBoxes.every(a => a.targetY == a.y && a.targetY != 600)) {
            // all scores fetched, all locations right
            this.countDown--;
            if (this.countDown <= 0) {
                this.x += this.countDown/2;
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
                let me = this;
                DataService.GetScores(board!.gameId, board!.currentRound).then(scores => {
                    me.fetchedScores = scores.map(a => ({playerUserId: a.playerId, score: a.score}));
                    if (playmode == PlayMode.playinghost) {
                        me.fetchedScores.push({playerUserId: board!.players[clientPlayerIndex].userId, score: latestMinigameScore});
                    }
                });
            }
        }
    }

    PlayerSorter(a: Player, b: Player): number {
        let scoreA = this.fetchedScores.find(x => x.playerUserId == a.userId);
        let scoreB = this.fetchedScores.find(x => x.playerUserId == b.userId);

        if (!scoreA && !scoreB) return 0;
        if (scoreA && !scoreB) return -1;
        if (!scoreA && scoreB) return 1;
        if (scoreA && scoreB) return scoreB.score - scoreA.score;
        return 0;
    }
}