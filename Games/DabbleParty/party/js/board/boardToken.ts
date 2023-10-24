class BoardToken extends Sprite {
    public width: number = 10;
    public height: number = 10;

    z = 0;

    xScale = 0.2;
    yScale = 0.2;

    currentSpace: BoardSpace | null = null; // not for animating between moves
    movementStartingSpace: BoardSpace | null = null;
    movementTargetSpace: BoardSpace | null = null;
    latestSpace!: BoardSpace;
    movementTimer = 0;
    movementDuration = 20;
    readyToDraw = false;

    constructor(private player: Player) {
        super(0,0);
    }

    Update(): void {
        if (this.currentSpace) this.readyToDraw = true;
        if (this.movementTargetSpace) this.latestSpace = this.movementTargetSpace;
        if (this.currentSpace) this.latestSpace = this.currentSpace;
        if (this.movementStartingSpace && this.movementTargetSpace) {
            let ratio = this.movementTimer / this.movementDuration;
            let x = this.movementStartingSpace.gameX * (1 - ratio) + this.movementTargetSpace.gameX * ratio;
            let y = this.movementStartingSpace.gameY * (1 - ratio) + this.movementTargetSpace.gameY * ratio;
            this.x = x;
            this.y = y;
            this.z =  -20 * Math.sin(ratio * Math.PI);
            this.rotation = Math.sin(ratio * Math.PI) * 0.5;
            this.movementTimer++;
            if (this.movementTimer == this.movementDuration) {
                this.movementStartingSpace = null;
                this.currentSpace = this.movementTargetSpace;
                audioHandler.PlaySound("tap", true);
            }
        } else if (this.currentSpace) {
            this.x = this.currentSpace.gameX;
            this.y = this.currentSpace.gameY;
            this.z = 0;
        }
    }

    MoveToSpace(targetSpace: BoardSpace): void {
        if (this.currentSpace == null) {
            console.error("Can't move, not on space");
            return;
        }
        this.movementTargetSpace = targetSpace;
        this.movementStartingSpace = this.currentSpace;
        this.currentSpace = null;
        this.movementTimer = 0;
        let distanceBetweenSpaces = Math.sqrt(
            (this.movementTargetSpace.gameX - this.movementStartingSpace.gameX) ** 2 +
            (this.movementTargetSpace.gameY - this.movementStartingSpace.gameY) ** 2);
        this.movementDuration = Math.floor(distanceBetweenSpaces / 4);
        if (this.movementDuration < 20) this.movementDuration = 20;
    }

    GetFrameData(frameNum: number): FrameData {
        if (!this.readyToDraw) {
            return {
                imageTile: tiles["boardTokens"][this.player.avatarIndex][0],
                xFlip: false,
                yFlip: false,
                xOffset: 9999999,
                yOffset: this.z
            };
        }
        return {
            imageTile: tiles["boardTokens"][this.player.avatarIndex][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: this.z
        };
    }
}