class BounceMushroom extends Sprite {
    public width: number = 48;
    public height: number = 48;

    targetPositionIndex = 2;
    positions = [-240, -120, 0, 120, 240];
    isLockedIn = true;
    speed = 10;
    private bounceTimer = 0;

    constructor(private minigame: MinigameMushroomBounce) {
        super(0, 0);
    }

    Bounce() {
        this.bounceTimer = 30;
        audioHandler.PlaySound("boing", true);
    }

    Update(): void {
        if (this.bounceTimer > 0) {
            this.bounceTimer--;
        }
        if (this.isLockedIn) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && this.targetPositionIndex > 0) {
                this.targetPositionIndex--;
                this.isLockedIn = false;
            } else if (KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && this.targetPositionIndex < this.positions.length - 1) {
                this.targetPositionIndex++;
                this.isLockedIn = false;
            }
        }

        if (!this.isLockedIn) {
            let targetX = this.positions[this.targetPositionIndex];
            if (Math.abs(this.x - targetX) <= this.speed) {
                // close enough
                this.x = targetX;
                this.isLockedIn = true;
            } else {
                if (this.x < targetX) this.x += this.speed;
                else this.x -= this.speed;
            }
        }

    }
    GetFrameData(frameNum: number): FrameData {
        let col = 2 - Math.floor(Math.sin(this.bounceTimer) / (31 - this.bounceTimer) * 2);
        return {
            imageTile: tiles["bounceMush"][col][playerIndex],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}

class BounceEgg extends Sprite {
    public width: number = 48;
    public height: number = 48;

    public bounceHeight = 240;
    private timer = 0;
    public speed = 1;

    constructor(x: number, y: number, private minigame: MinigameMushroomBounce) {
        super(x, y);
    }

    Update(): void {
        this.timer++;
        let bounceHeight = this.timer < 60 ? 240 : this.bounceHeight;
        this.rotation += 0.2;
        if (this.timer > 60) this.x += this.speed;
        let xForArc = ((this.timer < 60 ? (this.timer - 60) : this.x) + 360) % 120;
        this.y = (bounceHeight / 60 ** 2) * (xForArc - 60) ** 2 - bounceHeight - 35;

        let mush = this.minigame.mushroom;
        if (mush.positions.some(x => Math.abs(this.x - x) < 1) && this.y < 5 && this.timer >= 60) {
            // on a bounce point
            if (mush.isLockedIn && Math.abs(this.x - mush.x) < 1) {
                // bounce!
                mush.Bounce();
            } else {
                // splat
                this.isActive = false;
                let brokenEgg = new SimpleSprite(this.x, this.y, tiles["droppingItems"][2][0], (s) => {
                    s.dy += 0.2;
                    s.y += s.dy;
                    if (s.y > 500) s.isActive = false;
                });
                brokenEgg.dy -= 3;
                brokenEgg.y += 45;
                this.minigame.sprites.push(brokenEgg);
                audioHandler.PlaySound("pop", false);
            }
        } else if (this.x >= 360) {
            // nest!
            this.isActive = false;
            this.minigame.score++;
            audioHandler.PlaySound("dobbloon", false);
            let scoreUp = new SimpleSprite(this.x, this.y, tiles["droppingItems"][3][0], (s) => {
                s.y -= 2;
                if (s.y < -100) {
                    s.isActive = false;
                    console.log(s.age);
                }
            }).Scale(2);
            this.minigame.sprites.push(scoreUp);
        }
    }
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["droppingItems"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

}

class MinigameMushroomBounce extends MinigameBase {
    title = "Fungus Amongus";
    instructions = [
        "Bounce the eggs safely to the nest with the mushroom.",
        "The branch will shake when an egg is about to fall,",
        "so keep your eyes peeled."
    ];
    backdropTile: ImageTile = tiles["forest"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][0][2];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Horizontal, "Move mushroom")
    ];
    songId = "forest";
    mushroom!: BounceMushroom;
    branch!: SimpleSprite;
    branchWiggleTimer = 0;

    Initialize(): void {
        camera.targetX = 30;
        camera.targetY = -100;
        this.mushroom = new BounceMushroom(this);
        for (let pos of this.mushroom.positions) {
            this.sprites.push(new SimpleSprite(pos, this.mushroom.y, tiles["bounceMush"][2][4]));
        }
        this.sprites.push(this.mushroom);
        this.branch = new SimpleSprite(-300, -200, tiles["branch"][0][0]);
        this.sprites.push(this.branch);
        this.sprites.push(new SimpleSprite(0, 142, tiles["ground"][0][0]).Scale(2));
        this.sprites.push(new SimpleSprite(360, 8, tiles["nest"][0][0]));
    }

    Update(): void {
        if (this.branchWiggleTimer > 0) {
            this.branchWiggleTimer--;
            let wiggle = (Math.sin(this.branchWiggleTimer) / (31 - this.branchWiggleTimer) * 2);
            this.branch.x = -300 + wiggle * 10;
        }
        let isSpawnComing = this.eggList.some(a => Math.floor(a.t * 60) == this.timer + 30);
        if (isSpawnComing) this.branchWiggleTimer = 30;
        let spawns = this.eggList.filter(a => Math.floor(a.t * 60) == this.timer);
        for (let spawn of spawns) {
            let egg = new BounceEgg(-240, -240, this);
            egg.bounceHeight = 240 / spawn.s;
            egg.speed = spawn.s;
            this.sprites.push(egg);
            audioHandler.PlaySound("bwump", false);
        }

        let gameOverTime = (Math.max(...this.eggList.map(a => a.t)) + 5) * 60;
        if (gameOverTime == this.timer) {
            this.SubmitScore(this.score);
        }
    }

    eggList = [
        { t: 1, s: 1 },

        { t: 12, s: 1 },
        { t: 14.75, s: 1 },

        { t: 24.5, s: 0.5 },
        { t: 27, s: 1 },
        { t: 28, s: 1 },

        { t: 39.5, s: 1 },
        { t: 42, s: 1 },
        { t: 44.5, s: 1 },
        { t: 51.5, s: 0.75 },
        { t: 54.75, s: 0.75 },
        { t: 55, s: 0.75 },
        { t: 55.25, s: 0.75 },

        { t: 67.5, s: 2 },
        { t: 73.5, s: 2 },
        { t: 74.9, s: 2 },
        { t: 81, s: 3 },

        { t: 87, s: 2 },
        { t: 87.2, s: 2 },
        { t: 87.4, s: 2 },
        { t: 87.6, s: 2 },
    ]

}