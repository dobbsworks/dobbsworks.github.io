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
    constructor(private direction: "up" | "down", private player: Player, private numDiceUpgrades: number) {
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
    constructor() {
        super();
    }
    private timer = 0;
    private paddingTime = 20;
    Update(): void {
        this.timer++;
        if (this.timer == this.paddingTime) {
            this.isDone = true;
        }
    }
    Draw(camera: Camera): void { }
}

class BoardCutSceneMoveGear extends BoardCutScene {
    constructor() {
        super();
    }
    private timer = 0;
    private targetSpace: BoardSpace | null = null;
    Update(): void {
        if (!board) return;
        this.timer++;
        if (this.timer == 1) this.targetSpace = board.PlaceGearSpace();
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
            this.item.OnPurchase(this.player);
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
                    text: Random.RandFrom(action.spams),
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
            el.color = Random.RandFrom(["Blue", " Coral", " DodgerBlue", " SpringGreen", " YellowGreen", " Green", " OrangeRed", " Red", " GoldenRod", " HotPink", " CadetBlue", " SeaGreen", " Chocolate", " BlueViolet", " Firebrick"]);
            camera.ctx.font = `700 ${15}px ${"arial"}`;
            el.name = GetRandomUserName();
            el.nameWidth = camera.ctx.measureText(el.name + ":").width;
            el.text = Random.RandFrom(el.action.spams);
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
        return "";
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
            new BoardCutSceneFadeIn() );

        this.isDone = true;
    }

    GetPlacementText(): string {
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
        let hexOpacity = (opacity * 255).toString(16).split(".")[0].padStart(2, "00").substring(0,2);
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
        let hexOpacity = (opacity * 255).toString(16).split(".")[0].padStart(2, "00").substring(0,2);
        camera.ctx.fillStyle = "#000000" + hexOpacity;
        camera.ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);
    }

}



class BoardCutSceneSingleAction extends BoardCutScene {
    constructor(private action: ()=>void) { super(); }
    Update(): void {
        this.isDone = true;
        this.action();
    }
    Draw(camera: Camera): void {}
}
class BoardCutSceneSetBackdrop extends BoardCutSceneSingleAction {
    constructor(backdrop: ImageTile | null) { super(() => {
        BoardCutScene.backdrop = backdrop;
    }); }
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