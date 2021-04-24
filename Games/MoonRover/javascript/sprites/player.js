class Player extends Sprite {
    color = "#0000FF";
    maxHp = 10;
    hurtTimer = 0;
    bubbleShieldTimer = 0;
    isOnGround = false;
    playerStarted = false; // player has made some interaction (fired weapon)

    shake = 0; // used for ui shake, based on how sprite is jerked around

    Initialize() {
        if (currentCharacter && currentCharacter.maxHp) {
            this.maxHp = currentCharacter.maxHp;
        }
        if (currentCharacter && currentCharacter.followers) {
            for (let i = 0; i < currentCharacter.followers; i++) {
                let follower = new Follower(this, (i + 1) * 120);
                sprites.push(follower);
            }
        }
    }

    Update() {
        let oldSpeedSquared = this.dx ** 2 + this.dy ** 2

        if (oldSpeedSquared > 10 ** 2) {
            this.dx *= 0.995;
            this.dy *= 0.995;
        }

        let isShielded = (this.bubbleShieldTimer > 0);

        let isBounced = false;
        if (isMouseDown) {
            // if (isMouseDown && !isShielded) {
            // weapon fired
            this.playerStarted = true;
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
                        console.log(targetMagnitude)
                        achievementHandler.shieldBashDamage = shieldDamage;
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
                } else if (touchingSprite.shortedTimer > 0) {
                    // no damage
                } else if (this.hurtTimer === 0) {
                    this.hp -= 1;
                    this.hurtTimer = 60;
                    audioHandler.PlaySound("pow-03");
                }
                isBounced = true;
            }
            if (touchingSprite instanceof EnemyBullet) {
                touchingSprite.isActive = false;
            }
            if (touchingSprite instanceof Loot) {
                touchingSprite.isActive = false;
                loot += touchingSprite.value;
                achievementHandler.lifetimeLoot += touchingSprite.value;
                audioHandler.PlaySound("powerup-03");

                if (currentCharacter && currentCharacter.damagedOnLoot) {
                    if (this.hurtTimer === 0) {
                        this.hp -= 1;
                        this.hurtTimer = 60;
                        audioHandler.PlaySound("pow-03");
                    }
                    this.BounceFrom(touchingSprite, 3);
                }
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

        if (this.playerStarted) {
            if (currentCharacter && currentCharacter.damagedOnSolid) {
                let hpFraction = 0.1;
                if (touchedBorders.some(x => true)) {
                    // challenge character touched solid
                    this.hp -= hpFraction;
                } else {
                    if (this.hp % 1 > 0) {
                        this.hp += hpFraction;
                        if (this.hp % 1 < hpFraction) this.hp -= this.hp % 1;
                    }
                }
            }

            if (currentCharacter && currentCharacter.mustKeepAttacking) {
                player.hp -= 0.004;
            }
        }

        if (this.hp <= 0) {
            // you are dead, not big surprise
            this.isActive = false;
            this.Explode();
            sprites.push(new PlayerInertCapsule(this.x, this.y));
            deathCount++;
            setTimeout(() => {
                mainMenuHandler.ReturnToMainMenu();
            }, 3000)
        }


        let newSpeedSquared = this.dx ** 2 + this.dy ** 2
        let jerk = Math.floor(Math.abs(newSpeedSquared - oldSpeedSquared) / 10);
        this.shake += jerk;
        if (isBounced) this.shake += 20;
        if (this.shake > 0) this.shake--;
        if (this.shake > 100) this.shake = 100;
        if (this.bubbleShieldTimer > 0) this.bubbleShieldTimer--;

        achievementHandler.playerSpeeds.push(Math.sqrt(newSpeedSquared));
        let targetLength = 60 * 10;
        achievementHandler.playerSpeeds = achievementHandler.playerSpeeds.slice(-targetLength);
    }

    GetFrameData() {
        return {
            tileset: tileset.player,
            frame: currentCharacter.shipIndex || 0,
            xFlip: false,
        };
    }

}