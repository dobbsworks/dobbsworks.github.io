class RedCannon extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;

    public holdingPlayer: boolean = false;
    private shootTimer: number = 0;
    private rotationCounter: number = 0;

    protected power = 4;
    protected frameRow = 0;
    zIndex = 2
    private bigTimer = 0;

    Update(): void {
        this.rotationCounter++;
        if (this.bigTimer > 0) this.bigTimer--;

        let player = <Player>this.layer.sprites.find(a => a instanceof Player);
        if (!player) return;

        if (this.shootTimer > 0) this.shootTimer--;

        if (!this.holdingPlayer) {
            if (this.IsGoingToOverlapSprite(player) && this.shootTimer <= 0) {
                this.holdingPlayer = true;
                this.bigTimer = 10;
                audioHandler.PlaySound("bwump", true);
            }
        }
        if (this.holdingPlayer) {
            player.x = this.xMid - player.width / 2;
            player.y = this.yMid - player.height / 2;

            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.holdingPlayer = false;
                this.shootTimer = 30;
                this.bigTimer = 5;

                // 8 frames per 22.5-degree tile
                // all 8 frames of [2], 4 frames each from [1] and [3] will point to [2]

                let theta = -Math.PI / 2 + 2 * Math.PI * Math.floor((this.rotationCounter + 4) / 16) / 8;
                player.dx = this.power * Math.cos(theta);
                player.dy = this.power * Math.sin(theta);
                player.neutralTimer = 20;
                player.forcedJumpTimer = 20;
                player.jumpTimer = -1;
                audioHandler.PlaySound("pomp", true);
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(this.rotationCounter / 8) % 16;
        return {
            imageTile: tiles["cannon"][col][(this.bigTimer > 0 ? 1 : 0) + this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 2,
            yOffset: 2
        };
    }
}

class BlueCannon extends RedCannon {
    protected power = 3;
    protected frameRow = 2;
}