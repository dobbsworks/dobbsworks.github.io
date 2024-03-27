class DragonSwoop extends Enemy {

    public height: number = 10;
    public width: number = 102;
    respectsSolidTiles = false;
    canBeBouncedOn = false;
    isPlatform = true;
    canStandOn = true;
    anchor = Direction.Down;
    initialized = false;
    pauseTimer = 60;
    playedAudio = false;

    Update(): void {
        if (!this.playedAudio) {
            this.playedAudio = true;
            audioHandler.PlaySound("alert", false);
        }

        if (this.pauseTimer > 0) {
            this.pauseTimer--; 
            return;
        }

        if (!this.initialized) {
            this.initialized = true;
            if (player) {
                this.direction = (player.xMid < this.xMid ? -1 : 1);
                this.dx = 3 * this.direction;
            }
        }

        this.AccelerateHorizontally(0.01, 3 * this.direction);
        this.ApplyInertia();
        this.ReactToVerticalWind();

    }

    GetFrameData(frameNum: number): FrameData {
        
        var leftScreenEdge = camera.x - camera.canvas.width / 2 / camera.scale;
        var rightScreenEdge = camera.x + camera.canvas.width / 2 / camera.scale;

        if (frameNum % 4 < 2) {
            if (this.xRight < leftScreenEdge && this.dx >= 0) {
                return {
                    imageTile: tiles["dragonwarning"][0][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: -(leftScreenEdge - this.x),
                    yOffset: 0
                }
            }
            if (this.x > rightScreenEdge && this.dx <= 0) {
                return {
                    imageTile: tiles["dragonwarning"][0][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: -(rightScreenEdge - 24 - this.x),
                    yOffset: 0
                }
            }
        }

        return {
            imageTile: tiles["flying"][0][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: this.direction == 1 ? 8 : 8,
            yOffset: 7
        };
    }
}