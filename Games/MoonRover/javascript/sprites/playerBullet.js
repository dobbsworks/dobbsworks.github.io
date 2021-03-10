class PlayerBullet extends Sprite {
    timer = 0;
    radius = 5;
    damage = 1;
    knockback = 5;
    pierce = 0;
    duration = Infinity;

    damagedSprites = [];

    Update() {
        this.CheckExpiration();
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.length > 0) {
            this.isActive = false;
        }

        this.CheckForEnemyHits(false);
    }

    CheckForEnemyHits(canHitEnemyBullets) {
        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Enemy) {
                if (!canHitEnemyBullets && touchingSprite instanceof EnemyBullet) continue;

                touchingSprite.ApplyDamage(this.damage, this, this.knockback);
                if (touchingSprite.hp >= 0) {
                    audioHandler.PlaySound("ow-01");
                }

                this.damagedSprites.push(touchingSprite);
                this.pierce--;
                if (this.pierce < 0) {
                    this.isActive = false;
                }
            }
        }
    }

    CheckExpiration() {
        this.timer++;
        if (this.timer > this.duration) {
            this.isActive = false;
        }
    }

    GetFrameData() {
        return {
            tileset: tileset.pellets,
            frame: 0,
            xFlip: false,
        };
    }
}