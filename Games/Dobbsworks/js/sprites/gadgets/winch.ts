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

    windsDown = false;

    Update(): void {
        this.dx *= 0.9;
        this.dy *= 0.9;
        
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
            this.maxConnectionDistance = this.connectionDistance;
        }

        if ( this.ShouldWindUp()) {
            this.connectionDistance -= this.winchSpeed;
            this.isWinding = true;
        } 
        if (this.ShouldWindDown() ) {
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

        if (this.connectedSprite) {
            this.UpdateConnectedSprite(this.connectedSprite);
            this.MoveConnectedSprite(this.connectedSprite);
            let playerGrabbed = this.HandlePlayerGrab(this.connectedSprite);
            if (playerGrabbed) {
                this.connectedSprite = null;
            } else {
                this.MoveConnectedSprite(this.connectedSprite);
            }
        }
    }

    protected ShouldWindDown(): boolean {
        return !this.ShouldWindUp();
    }

    protected ShouldWindUp(): boolean {
        return Utility.Xor(this.GetIsPowered(), this.windsDown );
    }
    
    GetIsPowered(): boolean { 
        if (this.connectedSprite && this.connectedSprite instanceof PullSwitch && this.connectedSprite.isOn) return true;
        let tile = this.layer.map?.wireLayer.GetTileByPixel(this.xMid, this.yMid);
        return tile?.isPowered() || false;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor( frameNum / 10) % 2;
        let row = 0;
        if (!this.isWinding) col = 0;

        if (this.GetIsPowered()) row += 1;
        return {
            imageTile: tiles["winch"][col][row],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 1
        };
    }
}

class ReverseWinch extends Winch {
    windsDown = true;
}

class ControlledWinch extends Winch {
    protected ShouldWindDown(): boolean {
        return KeyboardHandler.IsKeyPressed(KeyAction.Down, false);
    }
    protected ShouldWindUp(): boolean {
        return KeyboardHandler.IsKeyPressed(KeyAction.Up, false);
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor( frameNum / 10) % 2;
        let row = 2;
        if (!this.isWinding) col = 0;
        
        if (this.ShouldWindUp()) {
            if (this.ShouldWindDown()) {
                row = 5;
            } else {
                row = 3;
            }
        } else {
            if (this.ShouldWindDown()) {
                row = 4;
            } else {
                col = 0;
            }
        }

        return {
            imageTile: tiles["winch"][col][row],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 1
        };
    }
}