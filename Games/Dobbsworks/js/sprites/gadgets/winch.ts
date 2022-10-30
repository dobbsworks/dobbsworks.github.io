class Winch extends Motor {
    public height: number = 6;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canBeBouncedOn = false;

    protected isInitialized = false;
    public connectedSprite: Sprite | null = null;
    protected connectionDistance: number = 0;
    protected wireColor = "#482413";
    protected wireDrawBottomSpace = 6;
    protected horizontalDirection: -1|1 = -1;
    isPlatform = true;

    minConnectionDistance = 8;
    maxConnectionDistance = 0;
    winchSpeed = 0.2;
    isWinding = false;

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
            this.maxConnectionDistance = this.connectionDistance;
        }

        if (this.GetIsPowered()) {
            this.connectionDistance -= this.winchSpeed;
            this.isWinding = true;
        } else {
            this.connectionDistance += this.winchSpeed;
            this.isWinding = true;
        }

        if (this.connectionDistance > this.maxConnectionDistance) {
            this.connectionDistance = this.maxConnectionDistance;
            this.isWinding = false;
        }
        if (this.connectionDistance < this.minConnectionDistance) {
            this.connectionDistance = this.minConnectionDistance;
            this.isWinding = false;
        }

        this.MoveConnectedSprite();
    }
    
    GetIsPowered(): boolean { 
        if (this.connectedSprite && this.connectedSprite instanceof PullSwitch && this.connectedSprite.isOn) return true;
        let tile = this.layer.map?.wireLayer.GetTileByPixel(this.xMid, this.yMid);
        return tile?.isPowered() || false;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor( frameNum / 10) % 2;
        if (!this.isWinding) col = 0;

        if (this.GetIsPowered()) col += 2;
        return {
            imageTile: tiles["motorTrack"][col][5],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 1
        };
    }
}