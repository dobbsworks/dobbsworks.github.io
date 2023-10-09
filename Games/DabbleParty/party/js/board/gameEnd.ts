class EndOfGameBonusGear {
    constructor(public title: string, public description: string, public scoring: (player: Player) => number) { }

    static HighRoller = new EndOfGameBonusGear("High Roller",
        "This gear is awarded to the player with the highest total dice rolls across the game.",
        (player: Player) => player.statDiceTotal);
    static SlowAndSteady = new EndOfGameBonusGear("Slow And Steady",
        "This gear is awarded to the player with the lowest total dice rolls across the game.",
        (player: Player) => -player.statDiceTotal);
    static BigSpender = new EndOfGameBonusGear("Big Spender",
        "This gear is awarded to the player who spent the most on non-gear purchases.",
        (player: Player) => player.statNonGearSpending);
    static Thrifty = new EndOfGameBonusGear("Thrifty",
        "This gear is awarded to the player who spent the least on non-gear purchases.",
        (player: Player) => -player.statNonGearSpending);
    static Tryhard = new EndOfGameBonusGear("Tryhard",
        "This gear is awarded to the player who earned the most coins from minigames.",
        (player: Player) => player.statMinigameWinnings);
    static Casual = new EndOfGameBonusGear("Casual",
        "This gear is awarded to the player who earned the least coins from minigames.",
        (player: Player) => -player.statMinigameWinnings);
    static SightSeer = new EndOfGameBonusGear("Sightseer",
        "This gear is awarded to the player who landed on the highest number of unique space types.",
        (player: Player) => player.statListOfLandings.filter(onlyUnique).length);
    static Random = new EndOfGameBonusGear("Rigged",
        "In true party game spirit, this rare gear is awarded to a random player. Yes, really.",
        (player: Player) => Math.random());
}



function GetBonusGearTypes(): EndOfGameBonusGear[] {
    let allBonusGears = Object.values(EndOfGameBonusGear) as EndOfGameBonusGear[];
    let ret: EndOfGameBonusGear[] = [];
    for (let i = 0; i < 3; i++) {
        let gearType = allBonusGears[Math.floor(Math.random() * allBonusGears.length)];
        allBonusGears = allBonusGears.filter(a => a != gearType);
        ret.push(gearType);
    }
    return ret;
}


class BoardCutSceneGameEnd extends BoardCutSceneSingleAction {
    constructor() {
        super(() => {
            if (!board) return;

            board.players.sort((a,b) => a.turnOrder - b.turnOrder);

            let bonusGears = GetBonusGearTypes();
            let bonusWinnerIndeces: number[][] = [];

            for (let bonusGearType of bonusGears) {
                let scores = board.players.map(bonusGearType.scoring);
                let maxScore = Math.max(...scores);
                let winners: number[] = board.players.map((a, i) => i).filter(i => scores[i] == maxScore);
                bonusWinnerIndeces.push(winners);
            }


            let xs = GetEndOfGameTokenLocations();
            let tokenSprites = board.players.map((p, i) => new SimpleSprite(xs[i], 80, tiles["boardTokens"][p.avatarIndex][0]).Scale(0.5));

            cutsceneService.AddScene(
                new BoardCutSceneFadeOut(),
                new BoardCutSceneSetBackdrop(tiles["spaceBoardBlur"][0][0]),
                new BoardCutSceneSingleAction(() => { BoardCutScene.sprites.push(...tokenSprites) }),
                new BoardCutSceneFadeIn(),
                new BoardCutSceneDialog("That's the end of the rounds. What a game it's been! Now let's get ready to tally up the results.\\Let's see who wound up with the most gears!"),
                new BoardCutSceneShowGearOrCoinCounts(tiles["uiLargeIcons"][0][0], 2, (p: Player) => p.gears),
                new BoardCutSceneDialog("Next let's take a look at the final coin counts."),
                new BoardCutSceneShowGearOrCoinCounts(tiles["uiLargeIcons"][0][1], 3, (p: Player) => p.coins),
                new BoardCutSceneDialog("But we aren't done yet, we still need to award the three bonus gears!"),
                new BoardCutSceneDialog(`This first bonus is the ${bonusGears[0].title} award! ${bonusGears[0].description} The winner is...`),
                new BoardCutSceneAwardBonusGear(bonusWinnerIndeces[0]),
                new BoardCutSceneDialog(JoinPlayers(bonusWinnerIndeces[0].map(i => board?.players[i] as Player)) + "!\\" +
                    `The second bonus is the ${bonusGears[1].title} award! ${bonusGears[1].description} The winner is...`),
                new BoardCutSceneAwardBonusGear(bonusWinnerIndeces[1]),
                new BoardCutSceneDialog(JoinPlayers(bonusWinnerIndeces[1].map(i => board?.players[i] as Player)) + "!\\" +
                    `The final bonus is the ${bonusGears[2].title} award! ${bonusGears[2].description} The winner is...`),
                new BoardCutSceneAwardBonusGear(bonusWinnerIndeces[2]),
                new BoardCutSceneDialog(JoinPlayers(bonusWinnerIndeces[2].map(i => board?.players[i] as Player)) + "!\\" +
                    `Now it's time to tally the final results.`),
                new BoardCutSceneFinalResults(tokenSprites),
                new BoardCutSceneSingleAction(() => { BoardCutScene.sprites = [] }),
                new BoardCutSceneStats(),
                new BoardCutSceneFadeOut(),
                new BoardCutSceneSetBackdrop(null),
                // TODO - return to main menu
            );

        });
    }
}

function GetEndOfGameTokenLocations(): number[] {
    if (!board) return [];
    let tokenSpread = 600;
    let xIter = -tokenSpread / 2;
    let distanceBetweenTokens = tokenSpread / (board.players.length - 1);
    let ret: number[] = [];

    for (let token of board.players) {
        ret.push(xIter); xIter += distanceBetweenTokens;
    }

    return ret;
}

class BoardCutSceneShowGearOrCoinCounts extends BoardCutScene {
    constructor(private icon: ImageTile, private iconScale: number, private calc: (p: Player) => number) { super(); }

    private timer = 0;
    private isDismissed = false;
    private y = 0;
    Update(): void {
        this.timer++;

        if (this.timer == 20 && !this.isDismissed) {
            audioHandler.PlaySound("dobbloon", true);
        }

        if (this.timer <= 30 && !this.isDismissed) {
            this.y = -(Math.sin(this.timer / 30 * Math.PI / 2) * 150);
        }
        if (this.isDismissed) {
            this.y = -450 + (Math.cos(this.timer / 30 * Math.PI / 2) * 300);
            if (this.y < -430) this.isDone = true;
        }

        if (this.timer > 100 && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.isDismissed = true;
            this.timer = 0;
        }
    }
    Draw(camera: Camera): void {
        if (!board) return;
        let cam = new Camera(camera.canvas);
        let xs = GetEndOfGameTokenLocations();
        let maxCount = Math.max(...board.players.map(this.calc));
        board.players.forEach((p, i) => {
            this.icon.Draw(cam, xs[i], this.y, this.iconScale, this.iconScale, false, false, 0);
            let numScale = 0.75;
            if (this.calc(p) == maxCount) {
                numScale += Math.sin(this.timer / 20) / 6;
            }
            DrawNumber(xs[i], this.y, this.calc(p), cam, numScale);
        });
    }
}

class BoardCutSceneAwardBonusGear extends BoardCutScene {
    constructor(private winnerIndeces: number[]) { super(); }
    private timer = 0;
    private y = -400;
    private xs = [0];
    Update(): void {
        if (!board) return;
        this.timer++;

        if (this.timer == 2) {
            audioHandler.PlaySound("drumroll", true);
        }

        let xs = GetEndOfGameTokenLocations();

        if (this.timer < 350) {
            this.y += 2;
            if (this.y > -150) this.y = -150;
            let rangeScale = 1;
            if (this.timer > 200) {
                rangeScale = (300 - this.timer) / 100;
                if (rangeScale < 0) rangeScale = 0;
            }
            this.xs = [Math.sin(this.timer / 10) * xs[0] * rangeScale];
        }
        if (this.timer == 350) {
            this.xs = this.winnerIndeces.map(a => 0);
            audioHandler.StopSound("drumroll");
            audioHandler.PlaySound("drumrollend", true);
        }
        if (this.timer > 350) {
            this.winnerIndeces.forEach((winnerIndex, i) => {
                let targetX = xs[winnerIndex];
                this.xs[i] += (targetX - this.xs[i]) * 0.2;
                if (this.timer == 400) {
                    this.xs[i] = targetX;
                }
            });
        }
        if (this.timer > 400) {
            this.y *= 0.9;
        }
        if (this.timer > 430) {
            this.winnerIndeces.forEach(i => {
                if (board) board.players[i].gears += 1;
            })
            this.isDone = true;
        }
    }
    Draw(camera: Camera): void {
        let gearIcon = tiles["uiLargeIcons"][0][0] as ImageTile;
        if (!board) return;
        let cam = new Camera(camera.canvas);

        this.xs.forEach(x => {
            gearIcon.Draw(cam, x, this.y, 2, 2, false, false, 0);
        })
    }

}

class BoardCutSceneFinalResults extends BoardCutScene {
    constructor(private sprites: Sprite[]) {
        super();
    }
    private timer = 0;
    private removeTimer = 0;
    private removeIndeces: number[] = []; // player index from last to 2nd place
    private fallingSprites: Sprite[] = [];
    private textY = 500;
    private winnerIndeces: number[] = [];

    Initialize(): void {
        audioHandler.SetBackgroundMusic("silence");
        audioHandler.PlaySound("drumroll", true);
        if (!board) return;
        let targetPlace = Math.max(...board.players.map(a => a.CurrentPlace())); // last place
        while (targetPlace > 1) {
            let playersInTargetPlace = board.players.filter(a => a.CurrentPlace() == targetPlace);
            this.removeIndeces.push(
                ...playersInTargetPlace.map(a => (board as BoardMap).players.indexOf(a))
            );
            targetPlace--;
        }
        this.winnerIndeces = board.players.filter(a => a.CurrentPlace() == 1).map(a => board?.players.indexOf(a) as number);
        this.timer = 2;
    }

    Update(): void {
        if (this.timer <= 1) this.Initialize();
        this.timer++;

        if (this.timer < 3000) {
            for (let i = 0; i < this.sprites.length; i++) {
                let sprite = this.sprites[i];
                let offset = [5, 15, 1, 3][i % 4];
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
                    let playerIndex = this.removeIndeces.shift() ?? -1;
                    let sprite = this.sprites[playerIndex];
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
        } else if (this.timer < 3300) {
            let spread = 300 * (this.winnerIndeces.length - 1);
            for (let i = 0; i < this.winnerIndeces.length; i++) {
                let winnerIndex = this.winnerIndeces[i];
                let targetX = (-spread / 2) + 300 * i;
                this.sprites[winnerIndex].x -= (this.sprites[winnerIndex].x - targetX) * 0.05
            }
            this.sprites.forEach(a => a.x *= 0.95);
            this.winnerIndeces.forEach(i => this.sprites[i].y -= (this.sprites[i].y + 30) * 0.05)
            this.textY *= 0.98;
        } else {
            this.sprites.forEach(a => a.y += 5);
            this.textY += 5;
            if (this.timer > 3400) this.isDone = true;
        }

    }
    Draw(camera: Camera): void {
        if (!board) return;
        if (this.winnerIndeces.length) {
            let winnerIndex = this.winnerIndeces[Math.floor(this.timer / 60) % this.winnerIndeces.length];
            let avatarIndex = board.players[winnerIndex].avatarIndex;
            let image = tiles["turnStartText"][2][avatarIndex] as ImageTile;
    
            let cam = new Camera(camera.canvas);
            image.Draw(cam, 0, this.textY + 150, 1, 1, false, false, 0);
        } else {
            console.log("UH OH, no winners?!");
        }
    }
}

class BoardCutSceneStats extends BoardCutScene {
    private baseY = 900;

    private spaceTypes = [
        {space: BoardSpaceType.BlueBoardSpace, includePasses: false},
        {space: BoardSpaceType.RedBoardSpace, includePasses: false},
        {space: BoardSpaceType.DiceUpgradeSpace, includePasses: false},
        {space: BoardSpaceType.TwitchSpace, includePasses: false},
        {space: BoardSpaceType.GearSpace, includePasses: true},
        {space: BoardSpaceType.ShopSpace, includePasses: true},
        {space: BoardSpaceType.WallopSpace, includePasses: true},
    ];

    Update(): void {
        this.baseY *= 0.95;
        if (this.baseY < 1) this.baseY = 0;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.isDone = true;
            cutsceneService.AddScene(
                new BoardCutSceneFadeOut(), 
                new BoardCutSceneSingleAction(() => {
                    board = null;
                }), 
                new CutsceneMainMenu());
        }
    }
    Draw(camera: Camera): void {
        if (!board) return;
        let cam = new Camera(camera.canvas);
        cam.ctx.fillStyle = "#0006";
        cam.ctx.fillRect(0, 0 + this.baseY, 960, 540);
        cam.x = 480;
        cam.y = 270;
        let headerY = 50 + this.baseY;
        for (let i = 0; i < this.spaceTypes.length; i++) {
            let spaceType = this.spaceTypes[i];
            let x = 355 + i * 90;
            let imageTile = spaceType.space.getImageTile();
            imageTile.Draw(cam, x, headerY, 0.5, 0.5, false, false, 0);
        }
        let gearIcon = tiles["uiLargeIcons"][0][0] as ImageTile;
        let coinIcon = tiles["uiLargeIcons"][0][1] as ImageTile;
        gearIcon.Draw(cam, 355 - 180, headerY, 1.5, 1.5, false, false, 0);
        coinIcon.Draw(cam, 355 - 90, headerY, 1.5, 1.5, false, false, 0);

        cam.ctx.fillStyle = "#0006";
        cam.ctx.fillRect(125, 100 + this.baseY, 810, 360);
        cam.ctx.fillStyle = "#0002";
        cam.ctx.fillRect(125, 190 + this.baseY, 810, 90);
        cam.ctx.fillRect(125, 370 + this.baseY, 810, 90);
        for (let i = 0; i < 4; i++) {
            cam.ctx.fillRect(125+90 + 90*2*i, 100 + this.baseY, 90, 360);
        }

        let mainFontSize = 40;
        cam.ctx.textAlign = "center";
        cam.ctx.fillStyle = "#FFF";

        let players = [...board.players];
        players.sort((a,b) => a.CurrentPlace() - b.CurrentPlace());
        for (let pindex = 0; pindex < players.length; pindex++) {
            let player = players[pindex];
            let y = pindex * 90 + 175-10 + this.baseY;
            let avatar = tiles["boardTokens"][player.avatarIndex][0] as ImageTile;
            avatar.Draw(cam, 65, y, 0.4, 0.4, false, false, 0);
            
            cam.ctx.font = `700 ${mainFontSize}px ${"arial"}`;
            cam.ctx.fillText(player.gears.toString(), 355 - 180, y - mainFontSize/2 + 20);
            cam.ctx.fillText(player.coins.toString(), 355 - 90, y - mainFontSize/2 + 20);

            for (let i = 0; i < this.spaceTypes.length; i++) {
                let spaceType = this.spaceTypes[i];
                let x = 355 + i * 90;

                let landings = player.statListOfLandings.filter(a => a == spaceType.space).length;
                let passings = player.statListOfPassings.filter(a => a == spaceType.space).length;

                if (spaceType.includePasses) {
                    cam.ctx.font = `700 ${mainFontSize * 0.75}px ${"arial"}`;
                    cam.ctx.fillText(landings.toString(), x, y - mainFontSize/2 - 10);
                    cam.ctx.fillText(`(${passings.toString()})`, x, y - mainFontSize/2 + 20);
                } else {
                    cam.ctx.font = `700 ${mainFontSize}px ${"arial"}`;
                    cam.ctx.fillText(landings.toString(), x, y - mainFontSize/2 + 20);
                }
                
            }

        }

        
        cam.ctx.font = `400 ${20}px ${"arial"}`;
        cam.ctx.textAlign = "right";
        cam.ctx.fillText("(X) is # of times passed without landing", 960-25, 530 + this.baseY);

    }

}