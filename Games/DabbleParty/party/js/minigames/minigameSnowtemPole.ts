class MinigameSnowtemPole extends MinigameBase {
    title = "Snowtem Pole";
    instructions = [
        "Drop lines of snowballs to try to build the tallest",
        "snowman you can! The snowballs move faster as you go,",
        "but you'll get lots of chances to build snowmen."
    ];
    backdropTile: ImageTile = tiles["bgSnow"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][3][2];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Button, "Drop snowballs"),
    ];
    songId = "frost";

    snowballCounts = [4, 4, 3, 2, 1, 1];
    snowSpeeds =     [5 ,10,9, 8, 7, 6, 5]
    currentSnowlineIndex = 0;
    snowLine: Sprite[] = [];
    isSnowLineFalling = false;

    Initialize(): void {
        for (let i = -2; i <= 2; i++) {
            let snowball = new SimpleSprite(i * 80, 70 * 3 + 30, tiles["snowman"][0][0]).Scale(0.5);
            this.sprites.push(snowball);
        }
        this.CreateSnowline();
    }

    CreateSnowline(): void {
        let snowLineLength = this.snowballCounts[this.currentSnowlineIndex];
        this.currentSnowlineIndex++;
        if (this.currentSnowlineIndex >= this.snowballCounts.length) {
            this.currentSnowlineIndex = 0;
        }

        this.snowLine = [];
        for (let i = 0; i < snowLineLength; i++) {
            let snowball = new SimpleSprite((i - 6) * 80, -250, tiles["snowman"][this.currentSnowlineIndex == 0 ? 1 : 0][0]).Scale(0.5);
            snowball.name = this.currentSnowlineIndex == 0 ? "head" : "ball";
            this.snowLine.push(snowball);
        }
        this.sprites.push(...this.snowLine);
    }

    MoveSnowline(): void {
        if (this.snowLine.length > 0) {
            this.snowLine.forEach(a => a.x += 80);
            if (this.snowLine[0].x > 80 * 6) {
                this.snowLine.forEach(a => a.x -= 80 * (12 + this.snowLine.length));
            }
        }
    }

    SnowlineDrop(): boolean {
        let fallingInProgress = false;
        for (let snowball of this.snowLine) {
            if (!snowball.isActive) continue;
            let snowballsBelow = this.sprites.filter(a => a.x == snowball.x && a != snowball);

            let ground = Math.min(...snowballsBelow.map(a => a.y), 600) + 5 - 70;

            snowball.dy += 0.1;
            snowball.y += snowball.dy;
            if (snowball.y > ground) {
                snowball.y = ground;
                snowball.dy = 0;
            } else {
                fallingInProgress = true;
            }

            if (snowball.y > 400) snowball.isActive = false;
        }
        return fallingInProgress;
    }

    ClearSnow(): void {
        let head = this.sprites.find(a => a.name == "head");
        let headX = head ? head.x : -1;
        let toBeCleared = this.sprites.filter(a => a.name == "head" || a.name == "ball");
        let scoreUps = [];
        let anims = [];
        for (let snowball of toBeCleared) {
            snowball.isActive = false;
            // create animated snow to fall

            let anim = new SimpleSprite(snowball.x + 1, snowball.y, tiles["snowman"][snowball == head ? 1 : 0][0], (s) => {
                s.dy += 0.2;
                s.y += s.dy;
                if (s.y > 300) s.isActive = false;
            }).Scale(0.5);
            anims.push(anim);

            if (snowball.x == headX) {
                this.score++;
                audioHandler.PlaySound("dobbloon", false);
                
                let scoreUp = new SimpleSprite(snowball.x + 1, snowball.y, tiles["droppingItems"][3][0], (s) => {
                    s.y -= 2;
                    if (s.y < snowball.y - 100) s.isActive = false;
                }).Scale(2);
                scoreUps.push(scoreUp);
            }
        }

        this.sprites.push(...anims, ...scoreUps);
    }


    Update(): void {
        if (!this.isEnded) {
            if (this.isSnowLineFalling ) {
                let isStillFalling = this.SnowlineDrop();
                if (!isStillFalling) {
    
                    if (this.currentSnowlineIndex == 0) {
                        // just placed snowman head
                        this.ClearSnow();
                    }
    
                    this.CreateSnowline();
                    this.isSnowLineFalling = false;
                }
            } else {
                if (this.timer % this.snowSpeeds[this.currentSnowlineIndex] == 0) this.MoveSnowline();
            }
            if (!this.isSnowLineFalling && this.timer >= 0) {
                if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                    this.isSnowLineFalling = true;
                    audioHandler.PlaySound("pomp", false);
                }
            }
        }

        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }

    }

    GetRemainingTicks(): number {
        return 60 * 64 - this.timer;
    }
}