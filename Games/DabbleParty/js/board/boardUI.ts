class BoardUI {
    constructor(public board: BoardMap) { }
    dice: DiceSprite[] = [];
    uiCamera = new Camera(camera.canvas);
    combineTimer = 0;
    combinedNumber = 0;
    combinedNumberScale = 1;

    slideFrames = 30;
    waitFrames = 30;
    playerStartTimer = 0;
    useAltStartText = false;

    showMenu = false;
    selectedMenuItem = -1;

    isChoosingMinigame = false;
    minigameTextTime = 0;

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
        this.useAltStartText = (Math.random() > 0.95);
        this.selectedMenuItem = -1;
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

    Update(): void {
        if (this.playerStartTimer > 0) this.playerStartTimer++;
        if (this.playerStartTimer == this.slideFrames * 2 + this.waitFrames) this.showMenu = true;
        if (this.isChoosingMinigame) {
            this.minigameTextTime++;
            this.rouletteTheta += 0.1;
            if (this.minigameTextTime == 540) {
                this.isChoosingMinigame = false;
                this.board.instructions = new Instructions(this.board.pendingMinigame);
            }
        } else {
            this.minigameTextTime = 0;
            this.rouletteTheta = 0;
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

            if (this.combineTimer > 20) {
                this.combinedNumber = this.dice.map(a => a.chosenValue).reduce((a, b) => a + b, 0);
                this.dice = [];

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
        let player = this.board.currentPlayer;
        if (this.showMenu && player) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.showMenu = false;
                if (this.selectedMenuItem == -1) {
                    // Roll the dice!
                    this.StartRoll();
                } else {
                    let item = player.inventory[this.selectedMenuItem];
                    player.inventory = player.inventory.filter(a => a != item);
                    item.OnUse(player, this.board);
                }
            } else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
                if (this.selectedMenuItem >= 0) {
                    this.selectedMenuItem--;
                }
            } else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
                if (this.selectedMenuItem < player.inventory.length - 1) {
                    this.selectedMenuItem++;
                }
            }
        }


    }

    Draw(ctx: CanvasRenderingContext2D): void {
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

        if (this.showMenu) this.DrawItemMenu(ctx);
        this.DrawScoreboard(ctx);

        if (this.isChoosingMinigame) this.DrawMinigameChoose(ctx);
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

    DrawItemMenu(ctx: CanvasRenderingContext2D): void {
        let player = this.board.currentPlayer || this.board.players[0];

        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        ctx.strokeStyle = "#FFF";

        let xOptions = 60;
        let offset = Math.sin(this.board.timer / 10) * 3 + 3;
        for (let i = -1; i < 3; i++) {
            let y = 190 + 110 * i;

            if (i < player.inventory.length) {
                ctx.fillStyle = "#000B";
                ctx.fillRect(xOptions, y, 300, 100);
                if (this.selectedMenuItem == i) {
                    ctx.strokeRect(xOptions - offset, y - offset, 300 + offset * 2, 100 + offset * 2);
                }
            }

            if (i == -1) {
                ctx.font = `800 ${36}px ${"arial"}`;
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("Roll!", y + 20, 145);
                let dice = player.diceBag.GetDiceSprites();
                let dx = -250;
                for (let die of dice) {
                    let image = die.GetImage(this.selectedMenuItem == -1 ? this.board.timer / 5 : 0);
                    image.Draw(this.uiCamera, dx, y - 220, 0.5, 0.5, false, false, 0);
                    dx += 60;
                }
            } else {
                let item = player.inventory[i];
                if (item) {
                    let rotation = this.selectedMenuItem == i ? Math.sin(this.board.timer / 30) / 3 : 0;
                    item.imageTile.Draw(this.uiCamera, xOptions - 480 + 45, y - 230, 0.5, 0.5, false, false, rotation);
                    ctx.fillStyle = "#FFF";
                    ctx.textAlign = "left";
                    ctx.font = `600 ${18}px ${"arial"}`;
                    ctx.fillText(item.name, xOptions + 90, y + 45);
                    ctx.font = `400 ${14}px ${"arial"}`;
                    ctx.fillText(item.description, xOptions + 20, y + 90);
                }
            }
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


class DiceSprite {
    private frame: number = 0;
    private _isStopped = false;
    chosenValue = 0;
    private framesSinceStop = 0;
    private isHiding = false;
    private dieScale = 1.5;
    constructor(public x: number, public y: number, private faces: faceCount, private isFragile: boolean) { }

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