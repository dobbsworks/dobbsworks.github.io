abstract class MinigameBase {
    abstract backdropTile: ImageTile;
    abstract songId: string;
    abstract thumbnail: ImageTile;
    abstract controls: InstructionControl[];
    abstract title: string;
    abstract instructions: string[];
    sprites: Sprite[] = [];
    initialized: boolean = false;
    isFreePlay = false;
    timer = -360;
    score = 0;

    isEnded = false;
    endTimer = 0;
    overlayTextSprite: Sprite | null = null;
    abstract Initialize(): void;
    abstract Update(): void;
    abstract GetRemainingTicks(): number;
    BaseUpdate(): void {
        if (!this.initialized) {
            audioHandler.SetBackgroundMusic(this.songId);
            camera.targetX = 0;
            camera.targetY = 0;
            camera.scale = 1;
            this.Initialize();
            camera.x = camera.targetX;
            camera.y = camera.targetY;
            this.initialized = true;
        }

        if (this.timer == -240) {
            this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][0], (s) => {
                s.x = camera.x;
                s.y = camera.y;
            });
            this.sprites.push(this.overlayTextSprite);
        }
        if (this.timer == -90) {
            if (this.overlayTextSprite) this.overlayTextSprite.isActive = false;
            this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][1], (s) => {
                s.x = camera.x;
                s.y = camera.y;
                s.Scale(0.95);
            }).Scale(2);
            this.sprites.push(this.overlayTextSprite);
        }
        if (this.timer == 0) {
            if (this.overlayTextSprite) this.overlayTextSprite.isActive = false;
        }

        this.timer++;
        for (let spr of this.sprites) {
            spr.age++;
            spr.Update();
        }
        this.Update();

        this.sprites = this.sprites.filter(a => a.isActive);

        if (this.isEnded) {
            this.endTimer++;
            if (this.endTimer > 30 + 120 + 60) {
                currentMinigame = null;
                audioHandler.SetBackgroundMusic("lobby");

                if (this.isFreePlay) {
                    let mainMenu = new CutsceneMainMenu();
                    mainMenu.menuHandler.Initialize();
                    mainMenu.menuHandler.OpenPage(5);
                    mainMenu.menuHandler.cursorTarget = (mainMenu.menuHandler.FindById("minigameSelect") as MenuElement);
                    cutsceneService.AddScene(mainMenu);
                } else {
                    cutsceneService.AddScene(new BoardCutSceneFadeIn());
                }
            }
        }
    }
    OnAfterDraw(camera: Camera): void {}
    OnBeforeDrawSprites(camera: Camera): void {}
    Draw(camera: Camera): void {
        this.backdropTile.Draw(camera, camera.x, camera.y, 1, 1, false, false, 0);
        this.OnBeforeDrawSprites(camera);
        for (let spr of this.sprites) {
            spr.Draw(camera);
        }
        this.OnAfterDraw(camera);
        // this.DrawScore(camera);

        if (this.endTimer > 0) {
            let overlayOpacity = Math.max(0, Math.min(1, (this.endTimer - 120) / 30));
            camera.ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity.toFixed(2)})`;
            camera.ctx.fillRect(0, 0, 960, 540);
        }

        if (this.timer > 0) {
            let ticksLeft = this.GetRemainingTicks();
            let secondsLeft = Math.ceil(ticksLeft / 60);
            let bounce = 0;
            if (secondsLeft == 30 || secondsLeft <= 3) {
                if (ticksLeft % 60 > 40)
                bounce = Math.sin(ticksLeft / 5) / 5;
            }
            if (ticksLeft == 30 * 60 || ticksLeft == 0) {
                audioHandler.PlaySound("roundStart", true);
            }
            if ([3,2,1].some(a => ticksLeft == a * 60)) {
                audioHandler.PlaySound("swim", true);
            }
            if (secondsLeft > 0) {
                DrawNumber(-440, -235, secondsLeft, new Camera(camera.canvas), 0.5 + bounce);
            }
        }
    }
    SubmitScore(score: number): void {
        if (this.isEnded) return;
        
        let minigameIndex = minigames.map(a => new a().title).indexOf(this.title) ?? -1;
        StorageService.SetPbIfBetter(minigameIndex, score);
        
        if (this.isFreePlay) {
            let scoreContainerDiv = document.getElementById("scoreDisplay");
            let newRow = document.createElement("div");
            newRow.innerHTML = `${this.title} - ${score}`;
            if (scoreContainerDiv) {
                scoreContainerDiv.appendChild(newRow);
            }
        } else {
            if (board) {
                DataService.SubmitScore(board.gameId, score, board.currentRound).then(() => {
                    if (board) board.SpectateUpdateLoop(true)
                });
            }
        }

        this.isEnded = true;

        this.overlayTextSprite = new SimpleSprite(camera.x, camera.y, tiles["text"][0][2], (s) => {
            s.x = camera.x;
            s.y = camera.y;
        });
        this.sprites.push(this.overlayTextSprite);
    }

    DrawScore(camera: Camera): void {
        if (this.score <= 0) return;

        let fontSize = 24;
        //if (this.isEnded) fontSize = 96;

        camera.ctx.font = `${fontSize}px ${"arial"}`;
        camera.ctx.textAlign = "right";

        camera.ctx.strokeStyle = "#FFF";
        camera.ctx.fillStyle = "#0006";
        let textWidth = camera.ctx.measureText(Math.floor(this.score).toString()).width;
        let width = Math.max(100, textWidth + 20);
        camera.ctx.fillRect(camera.canvas.width, camera.canvas.height, -width, -(fontSize + fontSize/4));
        // if (this.isEnded) {
        //     camera.ctx.strokeRect(camera.canvas.width, camera.canvas.height, -width, -(fontSize + fontSize/4));
        // }
        camera.ctx.fillStyle = "#FFF9";
        camera.ctx.fillText(Math.floor(this.score).toString(), camera.canvas.width - 5, camera.canvas.height - fontSize/4);
    }
}

class MinigameGenerator {
    static CurrentPool: (new() => MinigameBase)[] = [];

    static RandomGame(): MinigameBase {
        if (MinigameGenerator.CurrentPool.length == 0) {
            MinigameGenerator.CurrentPool = [...minigames];
        }

        let games = MinigameGenerator.CurrentPool;
        let i = Math.floor(Math.random() * games.length);
        let game = games[i];

        MinigameGenerator.CurrentPool = MinigameGenerator.CurrentPool.filter(a => a !== game);
        
        return new game();
    }
}