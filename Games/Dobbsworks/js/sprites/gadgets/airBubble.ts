class AirBubble extends Sprite {
    public height: number = 10;
    public width: number  = 10;
    public respectsSolidTiles: boolean = false;
    
    private popTimer = 0;

    Update(): void {
        if (this.popTimer == 0 && player) {
            if (player.IsGoingToOverlapSprite(this)) {
                player.currentBreath = player.maxBreath;
                this.popTimer = 1;
                audioHandler.PlaySound("airBubble", false);
            }
        }
        if (this.popTimer > 0) this.popTimer++;
        if (this.popTimer > 18) this.isActive = false;
        this.y += Math.sin(this.age / 30) / 20;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 1;
        if (this.popTimer > 6) col = 2;
        if (this.popTimer > 12) col = 3;
        return {
            imageTile: tiles["fluids"][col][3],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }
    
}