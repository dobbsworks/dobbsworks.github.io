class MinigameWhenPigsFly extends MinigameBase {
    title = "When Pigs Fly";
    instructions = [
        "Some number of pigs have taken the stage, but how many?",
        "Try your best to count the pigs over three rounds."
    ];
    backdropTile: ImageTile = tiles["bgStage"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][2][3];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Up, "Increment counter"),
        new InstructionControl(Control.Down, "Decrement counter"),
    ];
    songId = "jungle";

    roundNum = 1;
    movers: SimpleSprite[] = [];
    leftCurtain!: Sprite;
    rightCurtain!: Sprite;

    confirmDigit1!: SimpleSprite;
    confirmDigit2!: SimpleSprite;

    guessDigit1!: SimpleSprite;
    guessDigit2!: SimpleSprite;

    moverCounts: number[] = [];
    displayedCount = 0;
    playerCount = 0;

    Initialize(): void {
        this.leftCurtain = new SimpleSprite(-240, 0, tiles["curtain"][0][0]);
        this.rightCurtain = new SimpleSprite(240, 0, tiles["curtain"][0][0]);

        this.moverCounts = [
            Random.GetSeededRandInt(15, 20),
            Random.GetSeededRandInt(15, 22),
            Random.GetSeededRandInt(15, 24),
        ];

        this.confirmDigit1 = new SimpleSprite(-300, -1200, tiles["digits"][0][1]);
        this.confirmDigit2 = new SimpleSprite(-225, -1200, tiles["digits"][0][1]);
        this.guessDigit1 = new SimpleSprite(225, -200, tiles["digits"][0][1]);
        this.guessDigit2 = new SimpleSprite(300, -200, tiles["digits"][0][1]);

        this.SetUpMovers();
    }


    SetUpMovers(): void {
        this.sprites = [];
        this.movers = [];
        let actualCount = this.moverCounts[this.roundNum - 1];
        for (let i = 0; i < actualCount; i++) {
            let x = Random.GetSeededRandInt(-400, 400);
            let depth = Random.GetRand() * 4;
            let baseY = 150 - Math.sqrt(depth + 1) * 40;
            let y = baseY; // todo - aviators
            if (this.roundNum == 1) {
                y += 40;
            }
            if (this.roundNum == 3) {
                y -= 100;
            }
            let color = Random.GetSeededRandInt(0, 7);
            let mover = new SimpleSprite(x, y, tiles["pigs"][0][color]).Scale(8) as SimpleSprite;
            mover.name = color.toString();
            let speedBase = Random.GetRand();
            let dx = Math.sqrt(speedBase < 0.5 ? (1 - speedBase) : (speedBase - 0.5)) * 3 * (Random.GetSeededRandInt(0, 1) == 0 ? -1 : 1);
            let scale = ((Math.sqrt(depth) + 5) / 5);
            dx /= scale;
            mover.Scale(1 / scale);
            mover.dx = dx;
            if (dx > 0) mover.xScale *= -1;
            this.movers.push(mover);
        }
        this.movers.sort((a,b) => a.y - b.y);
        this.sprites.push(...this.movers, 
            this.confirmDigit1, this.confirmDigit2, 
            this.guessDigit1, this.guessDigit2, 
            this.leftCurtain, this.rightCurtain);
    }


    // t0 open curtain
    // t15 lock counter, begin counting through movers
    // t18 close curtain
    // t19 add score
    // increment round, reset movers
    // t20 open curtain

    Update(): void {

        let targetCurtainX = 700;
        let timerSeconds = this.timer / 60;
        if (timerSeconds < 0 || timerSeconds >= 58 || (timerSeconds % 20 > 18)) targetCurtainX = 240;

        this.leftCurtain.x = (-targetCurtainX + this.leftCurtain.x * 3) / 4;
        this.rightCurtain.x = (targetCurtainX + this.rightCurtain.x * 3) / 4;

        if (timerSeconds % 20 < 15 && !this.isEnded) {
            // increment/decrement
            if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true) && this.playerCount > 0) {
                this.playerCount--;
                audioHandler.PlaySound("small-beep", true);
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true) && this.playerCount < 100) {
                this.playerCount++;
                audioHandler.PlaySound("small-beep", true);
            }
        }

        if (timerSeconds % 20 == 19) {
            this.roundNum++;
            this.SetUpMovers();

            let difference = Math.abs(this.displayedCount - this.playerCount);
            let scoreAdd = 0;
            if (difference == 0) scoreAdd = 15;
            if (difference == 1) scoreAdd = 10;
            if (difference == 2) scoreAdd = 5;
            if (difference == 3) scoreAdd = 3;
            if (difference == 4) scoreAdd = 2;
            if (difference == 5) scoreAdd = 1;

            if (scoreAdd > 0) {
                this.sprites.push(new ScoreSprite(0,0, 5 - difference));
                if (difference == 0) {
                    this.sprites.push(new ScoreSprite(0,150, 8));
                }
                if (difference == 1) {
                    this.sprites.push(new ScoreSprite(0,150,6));
                }
                this.score += scoreAdd;
                audioHandler.PlaySound("dobbloon", false);
            }

            this.displayedCount = 0;
            this.playerCount = 0;
            this.confirmDigit1.y -= 1000;
            this.confirmDigit2.y -= 1000;
        }

        // starting at t=15.5, begin deleting a mover every 0.1 seconds
        if (timerSeconds % 20 >= 15.5 && timerSeconds % 20 < 19) {
            let timerInCycle = this.timer % (20 * 60);
            let framesSinceDeleteStart = timerInCycle - 930;
            if (framesSinceDeleteStart % 6 == 0) {
                let indexToDelete = (framesSinceDeleteStart / 6);
                let spriteToDelete = this.movers[indexToDelete];
                if (spriteToDelete) {
                    spriteToDelete.isActive = false;
                    audioHandler.PlaySound("erase", true);
                    this.displayedCount++;
                }
            }
        }

        if (timerSeconds % 20 == 15) {
            this.confirmDigit1.y += 1000;
            this.confirmDigit2.y += 1000;
        }

        for (let mover of this.movers) {
            mover.x += mover.dx;
            if (mover.x < -400) {
                mover.dx = Math.abs(mover.dx);
                mover.xScale *= -1;
            }
            if (mover.x > 400) {
                mover.dx = -Math.abs(mover.dx);
                mover.xScale *= -1;
            }

            let color = +mover.name;
            let timer = this.timer + 10000 + this.movers.indexOf(mover)*17;
            if (this.roundNum == 1) {
                let animationSpeed = 0.2 * (Math.abs(mover.dx * 0.7) + 2)/3;
                let frames = [0, 1, 2, 1, 0, 3, 4, 4, 3];
                let frame = frames[Math.floor(timer * animationSpeed) % frames.length];
                mover.imageTile = tiles["pigs"][frame][color];
            }
            if (this.roundNum == 2) {
                mover.dy += 0.2;
                mover.y += mover.dy;
                if (mover.y > 120) {
                    mover.y = 120;
                    mover.dy = -Math.abs(mover.dx) * 5;
                }
                mover.imageTile = tiles["pogos"][0][color];
            }
            if (this.roundNum == 3) {
                let animationSpeed = 0.2 * (Math.abs(mover.dx * 0.7) + 2)/3;
                let frames = [0, 1];
                let frame = frames[Math.floor(timer * animationSpeed) % frames.length];
                mover.imageTile = tiles["aviators"][frame][color];
                mover.y += Math.sin(timer * animationSpeed / 10);
            }
        }

        this.confirmDigit1.imageTile = tiles["digits"][Math.floor(this.displayedCount / 10)][1];
        this.confirmDigit2.imageTile = tiles["digits"][this.displayedCount % 10][1];
        this.guessDigit1.imageTile = tiles["digits"][Math.floor(this.playerCount / 10)][1];
        this.guessDigit2.imageTile = tiles["digits"][this.playerCount % 10][1];

        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    }


    GetRemainingTicks(): number {
        return (60 * 60) - this.timer;
    }
}