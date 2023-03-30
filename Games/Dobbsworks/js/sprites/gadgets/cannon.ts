class RedCannon extends Sprite {
    public height: number = 10;
    public width: number = 10;
    public respectsSolidTiles: boolean = false;

    public heldPlayer: Player | null = null;
    private shootTimer: number = 0;
    private rotationCounter: number = 0;

    protected autoRotates = true;
    protected power = 4;
    protected frameRow = 0;
    zIndex = 2
    private bigTimer = 0;
    protected autoFireFrames = -1;
    private autoFireTimer = 0;

    Update(): void {
        if (this.autoRotates) {
            this.rotationCounter++;
        } else {
            if (this.heldPlayer) {
                let isUpPressed = KeyboardHandler.IsKeyPressed(KeyAction.Up, false);
                let isLeftPressed = KeyboardHandler.IsKeyPressed(KeyAction.Left, false);
                let isRightPressed = KeyboardHandler.IsKeyPressed(KeyAction.Right, false);
                let isDownPressed = KeyboardHandler.IsKeyPressed(KeyAction.Down, false);

                if (isUpPressed && !isLeftPressed && !isRightPressed) this.rotationCounter = 0;
                if (isUpPressed && isRightPressed) this.rotationCounter = 16;
                if (isRightPressed && !isUpPressed && !isDownPressed) this.rotationCounter = 32;
                if (isRightPressed && isDownPressed) this.rotationCounter = 48;
                if (isDownPressed && !isLeftPressed && !isRightPressed) this.rotationCounter = 64;
                if (isDownPressed && isLeftPressed) this.rotationCounter = 80;
                if (isLeftPressed && !isUpPressed && !isDownPressed) this.rotationCounter = 96;
                if (isLeftPressed && isUpPressed) this.rotationCounter = 112;
            }
        }
        if (this.bigTimer > 0) this.bigTimer--;
        if (this.shootTimer > 0) this.shootTimer--;

        if (!this.heldPlayer) {
            let players = <Player[]>this.layer.sprites.filter(a => a instanceof Player);
            for (let player of players) {
                this.autoFireTimer = 0;
                if (this.IsGoingToOverlapSprite(player) && this.shootTimer <= 0 && !player.yoyoTarget) {
                    this.heldPlayer = player;
                    this.bigTimer = 10;
                    audioHandler.PlaySound("bwump", true);
                }
            }
        }

        if (this.heldPlayer) {
            this.autoFireTimer++;
            this.heldPlayer.x = this.xMid - this.heldPlayer.width / 2;
            this.heldPlayer.y = this.yMid - this.heldPlayer.height / 2;

            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.CannonBlastPlayer();
            } else {
                if (this.autoFireTimer == this.autoFireFrames) {
                    this.CannonBlastPlayer();
                }
            }
        }
    }

    CannonBlastPlayer(): void {
        this.heldPlayer = null;
        this.shootTimer = 30;
        this.bigTimer = 5;

        // 8 frames per 22.5-degree tile
        // all 8 frames of [2], 4 frames each from [1] and [3] will point to [2]

        let theta = -Math.PI / 2 + 2 * Math.PI * Math.floor((this.rotationCounter + 4) / 16) / 8;
        player.dx = this.power * Math.cos(theta);
        player.dy = this.power * Math.sin(theta);
        player.dxFromPlatform = 0;
        player.dyFromPlatform = 0;
        player.neutralTimer = 20;
        player.forcedJumpTimer = 20;
        player.jumpTimer = -1;
        audioHandler.PlaySound("pomp", true);
    }

    GetFrameData(frameNum: number): FrameData[] {
        let col = Math.floor(this.rotationCounter / 8) % 16;
        let frames = [{
            imageTile: tiles["cannon"][col][(this.bigTimer > 0 ? 1 : 0) + this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 3,
            yOffset: 3
        }];
        if (this.heldPlayer && this.autoFireFrames > 0) {
            let remaining = Math.floor((this.autoFireFrames - this.autoFireTimer) / 30);
            let newFrame = {
                imageTile: tiles["numbers"][remaining][0],
                xFlip: false,
                yFlip: false,
                xOffset: -2,
                yOffset: -1
            };
            frames.push(newFrame);
        }
        return frames;
    }
}

class BlueCannon extends RedCannon {
    protected power = 3;
    protected frameRow = 2;
}

class PurpleCannon extends RedCannon {
    protected frameRow = 4;
    protected autoRotates = false;
    protected autoFireFrames = 120;
}