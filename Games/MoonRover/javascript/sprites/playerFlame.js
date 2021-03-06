class PlayerFlame extends PlayerBullet {
    timer = 0;
    duration = 60*2;

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
                //this.ApplyDamage(touchingSprite);
                touchingSprite.Ignite();
                this.isActive = false;
                // TODO handle fire isActive
                // TODO also special case on shield
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