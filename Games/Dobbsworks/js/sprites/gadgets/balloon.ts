class RedBalloon extends Motor {
    public height: number = 9;
    public width: number = 8;
    public respectsSolidTiles: boolean = false;
    canBeBouncedOn = true;

    protected isInitialized = false;
    public connectedSprite: Sprite | null = null;
    protected connectionDistance: number = 0;
    protected wireColor = "#AAA";
    protected wireDrawBottomSpace = 12;
    protected horizontalDirection: -1|1 = -1;
    protected frameRow = 0;

    canHangFrom = true;
    popTimer = 0;
    floatTimer = 0;
    
    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }
        

        if (this.popTimer > 0) {
            this.popTimer++;
            if (this.popTimer > 20) this.isActive = false;
        }

        this.Movement();
        this.horizontalDirection = this.dx <= 0 ? -1 : 1;
        this.MoveByVelocity();
        this.MoveConnectedSprite();
    }

    Movement(): void {
        if (this.WaitForOnScreen()) {
            this.floatTimer++;
            this.dx = -0.25;
            this.dy = Math.cos(this.floatTimer / 30) / 5;
        }
    }
    
    OnBounce(): void { 
        this.connectedSprite = null;
        this.popTimer = 1;
        this.canBeBouncedOn = false;
        audioHandler.PlaySound("pop", true);
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 0;
        if (this.popTimer > 0) {
            col = Math.floor(this.popTimer / 3);
            if (col > 6) col = 6;
        }
        return {
            imageTile: tiles["balloon"][col][this.frameRow],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
}

class BlueBalloon extends RedBalloon {
    protected frameRow = 1;
    Movement(): void {
        if (this.WaitForOnScreen()) {
            this.floatTimer++;
            this.dx = 0;
            this.horizontalDirection = -1;
            this.dy = Math.cos(this.floatTimer / 100)  / 4;
        }
    }
}

class YellowBalloon extends RedBalloon {
    protected frameRow = 2;
    Movement(): void {
        if (this.WaitForOnScreen()) {
            this.floatTimer++;
            this.dy = Math.cos(this.floatTimer / 30) / 5;
            this.horizontalDirection = -1;
            this.dx = -Math.cos(this.floatTimer / 100)  / 4;
        }
    }
}

class GreenBalloon extends RedBalloon {
    protected frameRow = 3;
    Movement(): void {
    }
}