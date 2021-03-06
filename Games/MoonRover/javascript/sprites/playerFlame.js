class PlayerFlame extends PlayerBullet {
    timer = 0;
    duration = 60*2;
    pierce = 0;

    burnedSprites = [];

    Update() {
        this.timer++;
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.length > 0) {
            this.isActive = false;
        }
        
        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Enemy && !(touchingSprite instanceof EnemyBullet)) {
                if (touchingSprite instanceof BossShieldProjection) {
                    this.isActive = false;
                } else if (this.burnedSprites.indexOf(touchingSprite) > -1) {
                    // flame already affected this sprite, we can skip it
                } else {
                    touchingSprite.Ignite();
                    if (this.pierce <= 0) {
                        this.isActive = false;
                    } else {
                        this.pierce--;
                    }
                    this.burnedSprites.push(touchingSprite);
                }
            }
        }

        if (this.timer > this.duration) {
            this.isActive = false;
        }
    }

    GetFrameData() {
        let frameNum = Math.floor(
            (this.timer / this.duration) * tileset.flame.tiles.length
        );
        if (frameNum >= tileset.flame.tiles.length - 1) {
            frameNum = tileset.flame.tiles.length - 1;
        }
        return {
            tileset: tileset.flame,
            frame: frameNum,
            xFlip: Math.random() > 0.5,
        };
    }
}