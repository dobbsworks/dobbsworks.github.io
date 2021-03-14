class PlayerBullet extends Sprite {
    timer = 0;
    radius = 5;
    damage = 1;
    knockback = 5;
    pierce = 0;
    duration = Infinity;
    gravityScale = 1;
    bounces = 0;
    bounciness = 1;

    damagedSprites = [];

    Update() {
        this.CheckExpiration();
        this.ApplyGravity(this.gravityScale);
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders(this.bounciness);
        if (touchedBorders.length > 0) {
            if (this.explodeOnWall) {
                this.FireSubWeapon();
            }
            this.bounces++;
        }

        if (this.pierce <= 0 && this.bounces > this.maxBounces) {
            this.isActive = false;
        }

        this.CheckForEnemyHits(false);
    }

    CheckForEnemyHits(canHitEnemyBullets) {
        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Enemy) {
                if (!canHitEnemyBullets && touchingSprite instanceof EnemyBullet) continue;

                if (this.explodeOnEnemy) {
                    this.FireSubWeapon();
                }

                let enemyAlreadyDamaged = this.damagedSprites.indexOf(touchingSprite) !== -1;
                if (!enemyAlreadyDamaged) {
                    touchingSprite.ApplyDamage(this.damage, this, this.knockback);
                    this.damagedSprites.push(touchingSprite);
                    this.pierce--;
                }

                // bounce off
                let angleBetween = Math.atan2(touchingSprite.y - this.y, touchingSprite.x - this.x);
                let currentSpeed = Math.sqrt(this.dx ** 2 + this.dy ** 2);
                let currentAngle = Math.atan2(this.dy, this.dx);
                let newAngle = 2*angleBetween + Math.PI - currentAngle;
                this.dx = currentSpeed * Math.cos(newAngle);
                this.dy = currentSpeed * Math.sin(newAngle);
                this.bounces++;

                if (touchingSprite.hp >= 0) {
                    audioHandler.PlaySound("ow-01");
                }
            }
        }
    }

    CheckExpiration() {
        this.timer++;
        if (this.timer > this.duration) {
            if (this.explodeOnExpire) {
                this.FireSubWeapon();
            }
            this.isActive = false;
        }
    }

    FireSubWeapon() {
        if (this.triggeredWeapon) {
            this.triggeredWeapon.Fire(this);
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