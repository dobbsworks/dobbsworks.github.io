class BoardUI {
    constructor(public board: BoardMap) { }
    dice: DiceSprite[] = [];
    uiCamera = new Camera(camera.canvas);
    combineTimer = 0;
    combinedNumber = 0;
    combinedNumberScale = 1;

    roundStarttimer = 0;
    slideFrames = 30;
    waitFrames = 30;
    playerStartTimer = 0;
    useAltStartText = false;

    currentMenu: BoardMenu | null = null;

    isChoosingMinigame = false;
    minigameTextTime = 0;
    isShowingScores = false;
    scoreBoxes: { player: Player, y: number, targetY: number }[] = []; // indexes into board.players

    fakeMinigameNames = [
        "Turtle Will Love This One",
        "The Rise And Fall",
        "Dev Exit",
        "Goose On The Loose",
        "Snek In The Grass",
        "Circle of Birds",
        "The Third One",
        "Mammoth Wooly",
        "Which Switch?",
        "Pollen Fallin'",
        "Surfing The Web",
        "Something Fishay",
        "Berry Sunny",
        "SIX",
        "Nightmare Bistro",
        "Crushing Wheelie",
        "Wall o' Wallops",
        "Popplin' Off",
        "TTS Censor Simulator 2000",
        "Casual Trolling",
        "Snail of a Time",
        "Grand Ham",
        "Submarine Soon",
        "Minigames Done Badly",
        "Midar's Revenge",
        "For Whom The Bell Ends",
        "Haven't You Ever...",
        "Chickadee's Putt-Putts",
    ];
    fakeMinigamePool: string[] = [];
    currentRouletteTexts: string[] = [];

    Clear(): void {
        this.combineTimer = 0;
        this.combinedNumber = 0;
        this.minigameTextTime = 0;
        this.rouletteTheta = 0;
    }

    StartPlayerStartText(): void {
        this.playerStartTimer = 1;
        this.useAltStartText = (Math.random() > 0.95 && this.board.currentRound > 3);
    }

    StartRoll(): void {
        if (this.board.currentPlayer) {
            this.dice = this.board.currentPlayer.diceBag.GetDiceSprites();
        }
    }


    GenerateMinigameRouletteTexts(targetMinigame: MinigameBase): void {
        this.currentRouletteTexts = [targetMinigame.title];
        for (let i = 0; i < 4; i++) {
            if (this.fakeMinigamePool.length == 0) {
                this.fakeMinigamePool = [...this.fakeMinigameNames];
            }
            let drawn = Random.RandFrom(this.fakeMinigamePool);
            this.fakeMinigamePool = this.fakeMinigamePool.filter(a => a != drawn);
            this.currentRouletteTexts.push(drawn);
        }
    }

    UpdateScoreboxes(): void {
        let players = [...this.board.players];
        // sort by place, tiebreaker uses turn order
        players.sort((a, b) => (a.CurrentPlace() + a.turnOrder / 10) - (b.CurrentPlace() + b.turnOrder / 10));
        if (this.scoreBoxes.length == 0) {
            this.scoreBoxes = players.map(a => ({ player: a, y: 0, targetY: 0 }));
        } else {
            // sort by placement
            this.scoreBoxes.sort((a,b) => players.indexOf(a.player) - players.indexOf(b.player))
        }

        for (let i = 0; i < this.scoreBoxes.length; i++) {
            this.scoreBoxes[i].targetY = i * 110 + 95;
        }

        let boxSpeed = 4;
        for (let scorebox of this.scoreBoxes) {
            if (Math.abs(scorebox.y - scorebox.targetY) < boxSpeed) scorebox.y = scorebox.targetY;

            if (scorebox.y < scorebox.targetY) scorebox.y += boxSpeed;
            if (scorebox.y > scorebox.targetY) scorebox.y -= boxSpeed;
        }
    }

    Update(): void {
        if (this.playerStartTimer > 0) this.playerStartTimer++;
        if (this.playerStartTimer == this.slideFrames * 2 + this.waitFrames) {
            this.currentMenu = BoardMenu.CreateItemMenu();
        }
        if (this.isChoosingMinigame) {
            this.minigameTextTime++;
            this.rouletteTheta += 0.1;
            if (this.minigameTextTime == 540) {
                this.isChoosingMinigame = false;
                cutsceneService.AddScene(new Instructions(this.board.pendingMinigame));
                this.board.CreateButtonToToggleToUserViewInOBS();
            }
        } else {
            this.minigameTextTime = 0;
            this.rouletteTheta = 0;
        }

        if (this.isShowingScores) {
            this.UpdateScoreboxes();
        }


        if (cutsceneService.isCutsceneActive) return;


        if (this.roundStarttimer > 0) {
            this.roundStarttimer++;
            if (this.roundStarttimer > 100) {
                this.roundStarttimer = 0;
                this.board.CurrentPlayerTurnEnd();
            }
        }

        this.dice.forEach(a => a.Update());

        if (this.dice.some(a => !a.IsStopped())) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                let d = this.dice.find(a => !a.IsStopped());
                if (d) {
                    d.Stop();
                }
            }
        }

        if (this.dice.length > 0 && this.dice.every(a => a.IsDoneAnimating())) {
            if (this.combineTimer == 0) this.dice.forEach(a => a.HideDie());

            let moveScale = [1.05, 1.03, 1.01, 0.99, 0.98, 0.95][this.combineTimer] || 0.9;
            for (let die of this.dice) {
                if (die.x !== 0) {
                    die.x *= moveScale;
                }
            }
            this.combineTimer++;

            if (this.combineTimer == 20) {
                this.combinedNumber = this.dice.map(a => a.chosenValue).reduce((a, b) => a + b, 0);
                this.dice = [];

                if (this.board.currentPlayer) this.board.currentPlayer.statDiceTotal += this.combinedNumber;
            }
        }

        if (this.combinedNumber > 0) {
            this.combineTimer++;
            this.combinedNumberScale = Math.sin(Math.PI * (this.combineTimer - 20) / 20) + 1;
            if (this.combineTimer > 40) this.combinedNumberScale = 1;
            if (this.combineTimer >= 80 && this.board.currentPlayer) {
                this.board.currentPlayer.amountOfMovementLeft = this.combinedNumber;
                this.Clear();
            }
        }

        // item menu handling
        if (this.currentMenu) {
            this.currentMenu.Update();
        }


    }

    DrawForSpectator(ctx: CanvasRenderingContext2D): void {
        this.DrawScoreboard(ctx);
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (cutsceneService.isCutsceneActive) return;
        if (this.playerStartTimer > 0) {
            let turnStartName = tiles["turnStartText"][this.useAltStartText ? 1 : 0][this.board.currentPlayer?.avatarIndex || 0] as ImageTile;
            let x = (this.playerStartTimer - this.slideFrames) ** 2;
            if (this.playerStartTimer > this.slideFrames && this.playerStartTimer < this.slideFrames + this.waitFrames) x = 0;
            if (this.playerStartTimer >= this.slideFrames + this.waitFrames) x = -((this.playerStartTimer - this.slideFrames - this.waitFrames) ** 2);
            let y = -50;
            turnStartName.Draw(this.uiCamera, x, y, 1, 1, false, false, 0);
        }

        this.dice.forEach(a => a.Draw(this.uiCamera));
        if (this.combinedNumber > 0) {
            DrawNumber(0, -100, this.combinedNumber, this.uiCamera, this.combinedNumberScale);
        }

        if (this.roundStarttimer > 0) this.DrawRoundStart(ctx);

        if (this.currentMenu) this.currentMenu.Draw(ctx);

        if (this.isShowingScores) {
            this.DrawScoreboxes(ctx);
        } else {
            if (this.roundStarttimer == 0) {
                this.DrawScoreboard(ctx);
            }
        }
        if (this.isChoosingMinigame) this.DrawMinigameChoose(ctx);
    }

    DrawRoundStart(ctx: CanvasRenderingContext2D): void {
        let fontSize = 72 + (20 - this.roundStarttimer) * 100;
        if (this.roundStarttimer >= 20) fontSize = 72;
        if (this.roundStarttimer > 80) fontSize = (this.roundStarttimer - 80) * -4 + 72;
        if (fontSize > 0) {
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#FFF";
            ctx.lineWidth = 12;
            ctx.font = `900 ${fontSize}px ${"arial"}`;
            ctx.textAlign = "center";

            let text = `ROUND ${this.board.currentRound} START`;
            let lastXRound = this.board.finalRound - this.board.currentRound + 1;
            if (lastXRound <= 5) text = `LAST ${lastXRound} ROUNDS`;
            if (lastXRound == 1) text = `FINAL ROUND!`;
            ctx.strokeText(text, 480, 270);
            ctx.fillText(text, 480, 270);
            ctx.textBaseline = "alphabetic";
        }
    }

    DrawScoreboard(ctx: CanvasRenderingContext2D): void {
        let x = 510;
        for (let turn = 1; turn <= 4; turn++) {
            let player = this.board.players.find(a => a.turnOrder == turn);
            if (player) {
                if (player == this.board.currentPlayer) {
                    ctx.fillStyle = "#0008";
                    ctx.fillRect(x - 25, 65, 110, -100);
                }

                let gearIcon = tiles["uiSmallIcons"][0][0] as ImageTile;
                gearIcon.Draw(this.uiCamera, x - 480 + 35, -247 - 8, 1, 1, false, false, 0);
                let coinIcon = tiles["uiSmallIcons"][0][1] as ImageTile;
                coinIcon.Draw(this.uiCamera, x - 480 + 35, -247 + 10, 1, 1, false, false, 0);

                ctx.fillStyle = "#FFF";
                let image = tiles["playerIcons"][player.avatarIndex][0] as ImageTile;
                image.Draw(this.uiCamera, x - 480, -247, 0.2, 0.2, false, false, 0);
                ctx.textAlign = "right";
                ctx.font = `600 ${14}px ${"arial"}`;
                ctx.fillText(player.gears.toString(), x + 75, 20);
                ctx.fillText(player.coins.toString(), x + 75, 37);
                ctx.fillRect(x - 20, 45, 100, 1);
                ctx.textAlign = "left";
                ctx.font = `800 ${14}px ${"arial"}`;
                ctx.fillText(player.CurrentPlaceText(), x - 20, 58);

                let diceIcons = player.diceBag.GetDiceSprites();
                let diceX = x - 460;
                for (let diceIcon of diceIcons) {
                    diceIcon.GetImage().Draw(this.uiCamera, diceX, -215, 0.15, 0.15, false, false, 0);
                    diceX += 15;
                }

                let itemX = x - 425
                let itemSpacing = 30 / player.inventory.length;
                for (let item of player.inventory) {
                    item.imageTile.Draw(this.uiCamera, itemX, -215, 0.15, 0.15, false, false, 0);
                    itemX += itemSpacing;
                }
            }
            x += 120;
        }
    }

    DrawScoreboxes(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#000B";
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 4;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = `800 ${36}px ${"arial"}`;
        ctx.textAlign = "right";

        let title = tiles["minigameText"][0][1] as ImageTile;
        title.Draw(this.uiCamera, 0, -220, 1, 1, false, false, 0);

        let x = 180;
        let gearIcon = tiles["uiLargeIcons"][0][0] as ImageTile;
        let coinIcon = tiles["uiLargeIcons"][0][1] as ImageTile;
        for (let scorebox of this.scoreBoxes) {
            let image = tiles["playerIcons"][scorebox.player.avatarIndex][0] as ImageTile;
            let y = scorebox.y;
            let imageY = y - 270 + 50;
            ctx.fillStyle = "#000D";
            ctx.fillRect(x, y, 600, 100);
            ctx.strokeRect(x, y, 600, 100);
            image.Draw(this.uiCamera, x - 480 + 50, imageY, 0.4, 0.4, false, false, 0);
            gearIcon.Draw(this.uiCamera, x - 480 + 300, imageY, 1, 1, false, false, 0);
            coinIcon.Draw(this.uiCamera, x - 480 + 470, imageY, 1, 1, false, false, 0);
            ctx.fillStyle = "#FFF";
            ctx.fillText(scorebox.player.CurrentPlaceText(), x + 200, y + 50 + 14);
            ctx.fillText(scorebox.player.gears.toString(), x + 400, y + 50 + 14);
            ctx.fillText(scorebox.player.coins.toString(), x + 570, y + 50 + 14);
        }
    }

    rouletteTheta = 0;
    DrawMinigameChoose(ctx: CanvasRenderingContext2D): void {
        let textImage = tiles["minigameText"][0][0] as ImageTile;
        let titleY = (this.minigameTextTime - 60) ** 2;
        if (this.minigameTextTime > 60 && this.minigameTextTime < 120) titleY = 0;
        if (this.minigameTextTime >= 120 && this.minigameTextTime < 180) titleY = (1 - Math.cos((this.minigameTextTime - 120) / 60 * Math.PI)) * -75;
        if (this.minigameTextTime >= 180) titleY = -150;
        textImage.Draw(this.uiCamera, 0, titleY, 1, 1, false, false, 0);

        let rouletteCenterY = titleY + 200;
        if (this.minigameTextTime < 180) rouletteCenterY += (180 - this.minigameTextTime) ** 2;

        ctx.font = `${20}px ${"arial"}`;
        ctx.textAlign = "center";
        let largeRadius = 1;
        let smallRadius = 1;
        if (this.minigameTextTime > 300) {
            largeRadius = 1 + (this.minigameTextTime - 300) / 10;
            smallRadius = 1 - (this.minigameTextTime - 300) / 100;
        }
        if (this.minigameTextTime > 400) {
            smallRadius = 0;
        }
        for (let i = 0; i < this.currentRouletteTexts.length; i++) {
            let theta = i * (Math.PI * 2 / this.currentRouletteTexts.length) + (this.rouletteTheta);
            let text = this.currentRouletteTexts[i];
            let x = (i == 0 ? smallRadius : largeRadius) * 300 * Math.cos(theta) + this.uiCamera.canvas.width / 2;
            let y = (i == 0 ? smallRadius : largeRadius) * 100 * Math.sin(theta) + rouletteCenterY + this.uiCamera.canvas.height / 2;

            ctx.fillStyle = "#000";
            ctx.fillRect(x - 180, y - 35, 360, 50);
            ctx.fillStyle = "#FFF";
            ctx.fillText(text, x, y);
        }

        if (this.minigameTextTime > 440) {
            let opacity = Math.min(1, (this.minigameTextTime - 400) / 100);
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity.toFixed(2)})`;
            ctx.fillRect(0, 0, 960, 540);
        }
    }
}


class DiceSprite extends Sprite {
    public width: number = 0;
    public height: number = 0;
    GetFrameData(frameNum: number): FrameData | FrameData[] {
        throw new Error("Method not implemented.");
    }
    public frame: number = 0;
    private _isStopped = false;
    chosenValue = 0;
    private framesSinceStop = 0;
    private isHiding = false;
    private dieScale = 1.5;
    constructor(public x: number, public y: number, public faces: FaceCount, private isFragile: boolean) {
        super(x, y);
    }

    IsDoneAnimating(): boolean { return this._isStopped && this.framesSinceStop > 20; }
    IsStopped(): boolean { return this._isStopped; }

    HideDie(): void {
        this.isHiding = true;
    }

    Update(): void {
        if (this._isStopped) {
            this.framesSinceStop++;
        } else {
            this.frame++;
        }
        if (this.isHiding) {
            this.dieScale -= 0.04;
            if (this.dieScale < 0) this.dieScale = 0;
        }
    }
    Stop(): void {
        this._isStopped = true;
        this.frame = 0;
        this.chosenValue = Math.ceil(Math.random() * this.faces);
    }

    GetImage(offset: number = 0): ImageTile {
        let frameSheet = "d" + this.faces.toString();
        if (this.isFragile) frameSheet += "-fragile";
        let frame = this.frame + offset;
        let f = Math.floor(frame) % 48;
        let row = f % 6;
        let col = Math.floor(f / 6);
        return tiles[frameSheet][col][row] as ImageTile;
    }

    Draw(camera: Camera): void {
        let dieImage = this.GetImage();

        if (this.dieScale > 0) {
            dieImage.Draw(camera, this.x, this.y, this.dieScale, this.dieScale, false, false, 0);
        }

        if (this._isStopped) {
            let digitScale = 1;
            if (this.framesSinceStop < 20) {
                digitScale = Math.sin(Math.PI * this.framesSinceStop / 20) + 1;
            }
            DrawNumber(this.x, this.y, this.chosenValue, camera, digitScale);
        }
    }
}

function DrawNumber(centerX: number, centerY: number, number: number, camera: Camera, scale: number): void {
    DrawText(centerX, centerY, number.toString(), camera, scale, 2);
}
function DrawText(centerX: number, centerY: number, text: string, camera: Camera, scale: number, color: number): void {
    let x = (text.length - 1) / 2 * -65 * scale;
    for (let char of text) {
        if ('0123456789+-'.indexOf(char) == -1) {
            console.error("invalid char", char);
            return;
        }
        let col = +char;
        if (char == "+") col = 10;
        if (char == "-") col = 11;
        let digitImage = tiles["digits"][col][color] as ImageTile;
        digitImage.Draw(camera, centerX + x, centerY, scale, scale, false, false, 0);
        x += 65 * scale;
    }
}