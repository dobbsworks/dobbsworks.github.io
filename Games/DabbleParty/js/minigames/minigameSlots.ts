class MinigameSlots extends MinigameBase {
    title = "Hot Slots";
    instructions = [
        "Test your luck! Get three of a kind to earn points.",
        "Some of the images are more common than others."
    ];
    backdropTile: ImageTile = tiles["bgSlots"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][2][2];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Button, "Stop reel"),
    ];
    songId = "menuJazz";

    overlay!: SimpleSprite;
    reelSprites: SimpleSprite[] = [];
    reelAnimation: number[][] = [[], [], []];
    currentStopIndex = 0;
    reelValues = [
        [1, 3, 2, 1, 3, 2, 1, 3, 2, 1],
        [1, 3, 2, 1, 3, 2, 1, 3, 2, 1],
        [1, 1, 2, 2, 3, 1, 1, 0, 1, 1]
    ];
    scoreTimer = 0;

    Initialize(): void {
        this.overlay = new SimpleSprite(0, 0, tiles["slotsOverlay"][0][0]);

        this.reelSprites = [
            new SimpleSprite(-161, 0, tiles["slotWheels"][0][0]),
            new SimpleSprite(0, 0, tiles["slotWheels"][1][0]),
            new SimpleSprite(164, 0, tiles["slotWheels"][2][0]),
        ]
        this.reelSprites[0].dy = 4;
        this.reelSprites[1].dy = 8;
        this.reelSprites[2].dy = 16;
        this.sprites.push(...this.reelSprites, this.overlay);
    }

    StopReel(index: number): void {
        let passByBuffer = 10;
        let currentY = this.reelSprites[index].y;
        let targetY = Math.ceil((currentY - passByBuffer - 64) / 128) * 128 + 64;

        // bake in the animation to slow to a stop
        // y = ax**2 + bx + c
        // y'= 2ax + b
        // at x (time) 0, we know velocity, so we have b
        // at time 0 we know position, so we have c
        // solve for a
        let targetFrameCount = 15 - index * 5;
        let b = this.reelSprites[index].dy;
        let c = currentY;
        let a = (targetY - b * targetFrameCount - c) / (targetFrameCount ** 2);

        this.reelAnimation[index] = [];
        for (let i = 0; i <= targetFrameCount; i++) {
            this.reelAnimation[index].push(a * i ** 2 + b * i + c);
        }
        this.reelSprites[index].dy = 0;
    }

    ProcessSlots(): void {
        let reelValues = this.reelSprites.map((a, i) => {
            let index = (5 - Math.floor((a.y + 64) / 128));
            let reelValue = this.reelValues[i][index];
            return reelValue;
        });

        let score = 0;
        if (reelValues.every( a=> a == 1)) {
            score = 2;
            this.sprites.push(new ScoreSprite(0, 0, 1));
        }
        if (reelValues.every( a=> a == 2)) {
            score = 5;
            this.sprites.push(new ScoreSprite(0, 0, 3));
        }
        if (reelValues.every( a=> a == 3)) {
            score = 15;
            this.sprites.push(new ScoreSprite(0, 0, 5));
        }

        if (score > 0) {
            this.score += score;
            audioHandler.PlaySound("dobbloon", false);
        }
    }


    Update(): void {
        if (this.timer > 0 && !this.isEnded && KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            if (this.currentStopIndex < 3) {
                this.StopReel(this.currentStopIndex);
                this.currentStopIndex++;
                audioHandler.PlaySound("confirm", false);
            }
        }

        this.reelSprites.forEach((a, i) => {
            if (this.reelAnimation[i].length > 0) {
                let newY = this.reelAnimation[i].splice(0, 1)[0];
                a.y = newY;
            }

            a.y += a.dy;
            if (a.y > 580) a.y -= 1280 - 128;
        })

        if (this.scoreTimer == 0 && this.currentStopIndex == 3 && this.reelAnimation.every(a => a.length == 0) && this.reelSprites.every(a => a.dy == 0)) {
            this.ProcessSlots();
            this.scoreTimer++;
        }

        if (this.scoreTimer >= 1) {
            this.scoreTimer++;
            if (this.scoreTimer == 30) this.reelSprites[0].dy = 4;
            if (this.scoreTimer == 40) this.reelSprites[1].dy = 8;
            if (this.scoreTimer == 50) this.reelSprites[2].dy = 16;
            if (this.scoreTimer == 70) {
                this.currentStopIndex = 0;
                this.scoreTimer = 0;
            }
        }

        let isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }
    }

}