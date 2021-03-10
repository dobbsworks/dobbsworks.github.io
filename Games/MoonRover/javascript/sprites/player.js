class Player extends Sprite {
    color = "blue";
    maxHp = 10;
    hurtTimer = 0;
    bubbleShieldTimer = 0;
    isOnGround = false;

    shake = 0; // used for ui shake, based on how sprite is jerked around

    Update() {
        let oldSpeedSquared = this.dx **2 + this.dy **2

        if (oldSpeedSquared > 10**2) {
            this.dx *= 0.999;
            this.dy *= 0.999;
        }

        let isShielded = (this.bubbleShieldTimer > 0);

        let isBounced = false;
        if (isMouseDown) {
        // if (isMouseDown && !isShielded) {
            // weapon fired
            weaponHandler.GetCurrent().PullTrigger();
        }
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        this.isOnGround = (touchedBorders.some(x => x instanceof Floor || x instanceof Platform));

        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Enemy) {

                // calculate difference vector (player - enemy)
                let bounceDx = player.x - touchingSprite.x;
                let bounceDy = player.y - touchingSprite.y;
                // scale to set magnitude
                let enemyVelocityMagnitude = Math.sqrt(
                    bounceDx ** 2 + bounceDy ** 2
                );
                let targetMagnitude = 3;
                if (isShielded) {
                    targetMagnitude = Math.sqrt(oldSpeedSquared);
                    let shieldDamage = Math.ceil(targetMagnitude / 4);
                    if (targetMagnitude > 2) {
                        touchingSprite.ApplyDamage(shieldDamage, this, targetMagnitude);
                    }
                }
                if (enemyVelocityMagnitude > 0) {
                    let magnitudeScale = targetMagnitude / enemyVelocityMagnitude;
                    bounceDx *= magnitudeScale;
                    bounceDy *= magnitudeScale;
                    // add enemy velocity
                    bounceDx += touchingSprite.dx;
                    bounceDy += touchingSprite.dy;
                    // bounce off enemy
                    player.dx = bounceDx;
                    player.dy = bounceDy;
                }

                if (isShielded) {
                    audioHandler.PlaySound("notify-04");
                } else if (this.hurtTimer === 0) {
                    this.hp -= 1;
                    if (this.hp <= 0) {
                        // you are dead, not big surprise
                        this.isActive = false;
                        this.Explode();
                        deathCount++;
                        setTimeout(() => {
                            mainMenuHandler.ReturnToMainMenu();
                        }, 3000)
                    } else {
                        this.hurtTimer = 60;
                        audioHandler.PlaySound("pow-03");
                    }
                }
                isBounced = true;
            }
            if (touchingSprite instanceof EnemyBullet) {
                touchingSprite.isActive = false;
            }
            if (touchingSprite instanceof Loot) {
                touchingSprite.isActive = false;
                loot += touchingSprite.value;
                audioHandler.PlaySound("powerup-03");
            }
            if (touchingSprite instanceof LevelExit) {
                // level complete!
                touchingSprite.isActive = false;
                this.shake = 0;
                levelHandler.ExitLevel();
                return;
            }
            if (touchingSprite.OnTouchPlayer) {
                touchingSprite.OnTouchPlayer();
            }
        }
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
        }
        
        let newSpeedSquared = this.dx **2 + this.dy **2
        let jerk = Math.floor(Math.abs(newSpeedSquared - oldSpeedSquared) / 10);
        this.shake += jerk;
        if (isBounced) this.shake += 20;
        if (this.shake > 0) this.shake--;
        if (this.shake > 100) this.shake = 100;
        if (this.bubbleShieldTimer > 0) this.bubbleShieldTimer--;
    }

    GetFrameData() {
        return {
            tileset: tileset.player,
            frame: this.AnimateByFrame(tileset.player),
            xFlip: this.direction > 0,
        };
    }

}