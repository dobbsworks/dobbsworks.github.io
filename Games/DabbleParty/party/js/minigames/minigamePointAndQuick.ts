class MinigamePointAndQuick extends MinigameBase {
    title = "Point, And Quick";
    instructions = [
        "Press the directions indicated by the incoming boxes.",
        "Stacked boxes will require you to complete the whole",
        "stack without any mistakes."
    ];
    backdropTile: ImageTile = tiles["bgParty"][0][playerIndex];
    thumbnail: ImageTile = tiles["thumbnails"][1][2];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Move, "Point"),
    ];
    songId = "cherry";

    boxStacks: SimpleSprite[][] = [];
    targetIndex = 0;
    targeter!: SimpleSprite;
    wrongTimer = 0;

    scootTimes = [1, 2, 4, 7, 11, 15, 20, 21, 22, 22, 22, 22, 21, 20, 15, 11, 7, 4, 2, 1]; //total 250
    currentScootTimes: number[] = [];

    Initialize(): void {
        let conveyor = new SimpleSprite(90, 220, tiles["conveyor"][0][0]);
        this.sprites.push(conveyor);

        this.targeter = new SimpleSprite(-180, 103, tiles["directionBox"][0][5], (spr) => {
            spr.xScale = Math.sin(this.timer / 20) / 16 + 1.05;
            spr.yScale = Math.sin(this.timer / 20) / 16 + 1.05;
        });
        this.sprites.push(this.targeter);

        this.CreateBoxStack();
        this.CreateBoxStack();
        this.CreateBoxStack();
        this.CreateBoxStack();
    }

    CreateBoxStack(): SimpleSprite[] {
        let ret: SimpleSprite[] = [];

        let maxSize = 1;
        if (this.score > 4) maxSize = 2;
        if (this.score > 15) maxSize = 3;
        if (this.score > 30) maxSize = 4;

        let minSize = 1;
        if (this.score > 20) minSize = 2;
        if (this.score > 50) minSize = 3;
        if (this.score > 80) minSize = 4;

        let size = Random.GetRandInt(minSize, maxSize);

        let targetX = -180 + this.boxStacks.length * 250;
        let targetY = 103;
        for (let i = 0; i < size; i++) {
            let spr = new SimpleSprite(targetX, targetY, tiles["directionBox"][0][4]);
            spr.name = Random.RandFrom(["up", "down", "left", "right"]);
            ret.push(spr);
            targetY -= 95;
        }

        this.sprites.push(...ret);
        this.boxStacks.push(ret);
        // push targeter to top of sprite order
        this.sprites = [...this.sprites.filter(a => a != this.targeter), this.targeter];

        return ret;
    }


    ScootBoxes(): void {
        let scoot = this.currentScootTimes.shift() || 1;
        this.boxStacks.forEach(a => {
            a.forEach(b => {
                b.x -= scoot;
            })
        })
    }


    Update(): void {
        if (!this.isEnded && this.timer >= 0) {
            if (this.wrongTimer > 0) {
                this.wrongTimer--;

                if (Math.floor(this.wrongTimer / 4) % 2 == 0) {
                    this.targeter.xScale = 0;
                    this.targeter.yScale = 0;
                }
            } else {
                let isStackInPlace = this.boxStacks[0] && this.boxStacks[0][0] && this.boxStacks[0][0].x == -180;

                if (isStackInPlace) {

                    if (this.boxStacks.length <= 3) {
                        this.CreateBoxStack();
                    }

                    let stack = this.boxStacks[0];
                    for (let spr of stack) {
                        if (spr.name == "left") spr.imageTile = tiles["directionBox"][0][0];
                        if (spr.name == "right") spr.imageTile = tiles["directionBox"][0][1];
                        if (spr.name == "up") spr.imageTile = tiles["directionBox"][0][2];
                        if (spr.name == "down") spr.imageTile = tiles["directionBox"][0][3];
                    }

                    let pressedKey = "";
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true)) pressedKey = "left";
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true)) pressedKey = "right";
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) pressedKey = "up";
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) pressedKey = "down";

                    let expectedKey = this.boxStacks[0][this.targetIndex].name;
                    if (pressedKey != "") {

                        if (pressedKey == expectedKey) {
                            // correct
                            this.targetIndex++;
                            if (this.targetIndex >= this.boxStacks[0].length) {
                                // stack complete
                                audioHandler.PlaySound("coin", false);
                                this.score++;
                                this.targetIndex = 0;
                                let completedStack = this.boxStacks.shift() || [];
                                for (let box of completedStack) {
                                    box.isActive = false;

                                    let boxAnim = new SimpleSprite(box.x, box.y, box.imageTile, spr => {
                                        spr.x -= 15;
                                        spr.rotation -= 0.015;
                                        if (spr.x < -800) spr.isActive = false;
                                    });
                                    this.sprites.push(boxAnim);
                                }

                                this.currentScootTimes = [...this.scootTimes];
                                this.ScootBoxes();
                            }
                        } else {
                            // INCORRECT
                            this.targetIndex = 0;
                            this.wrongTimer = 30;
                            audioHandler.PlaySound("error", false);
                        }
                    }
                } else {
                    this.targeter.xScale = 0;
                    this.targeter.yScale = 0;
                    this.ScootBoxes();
                }
            }


            let targetY = 103 - this.targetIndex * 95;
            this.targeter.y += (targetY - this.targeter.y) * 0.2;
        }


        let isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }

    }
}