class Player extends Sprite {
    color = "blue";
    maxHp = 10;
    hurtTimer = 0;
    isOnGround = false;

    shake = 0; // used for ui shake, based on how sprite is jerked around

    Update() {
        let oldSpeedSquared = this.dx **2 + this.dy **2
        let isBounced = false;
        if (isMouseDown) {
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

                if (this.hurtTimer === 0) {
                    this.hp -= 1;
                    if (this.hp <= 0) {
                        // you are dead, not big surprise
                        this.isActive = false;
                        deathCount++;
                        setTimeout(() => {
                            player = new Player(0, 0);
                            renderer.target = player;
                            sprites.push(player)
                        }, 1000)
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
                this.shake = 0;
                levelHandler.ExitLevel();
                shopHandler.EnterShop();
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
    }

}