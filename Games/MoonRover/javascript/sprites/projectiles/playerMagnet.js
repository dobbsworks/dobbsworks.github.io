class PlayerMagnetPellet extends PlayerBullet {
    radius = 10;
    pierce = 0;
    touchedSprites = [];

    Update() {
        this.CheckExpiration();
        this.ApplyGravity(this.gravityScale);
        this.UpdatePosition();
        
        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Loot) {
                touchingSprite.magnetTimer += 60 * 10;
                continue;
            }

            if (touchingSprite instanceof Enemy) {
                if (touchingSprite instanceof BossShieldProjection) {
                    this.isActive = false;
                } else if (this.touchedSprites.indexOf(touchingSprite) > -1) {
                    // already affected this sprite, we can skip it
                } else {
                    touchingSprite.Magnetize(this.effectDuration);
                    if (this.pierce <= 0) {
                        this.isActive = false;
                    } else {
                        this.pierce--;
                    }
                    this.touchedSprites.push(touchingSprite);
                }
            }
        }
    }

    GetFrameData() {
        let timeLeft = this.duration - this.timer;
        let isRendered = timeLeft > 60 || timeLeft % 2;
        if (!isRendered) return null;
        return {
            tileset: tileset.pellets,
            frame: 3,
            xFlip: false,
        };
    }
}