class Wooly extends Piggle {
    frameRow = 0;
    imageSource = "sheep";
    turnAtLedges = false;
}


enum BoolyState {
    Patrol,
    WindUp,
    Charging,
}

class WoolyBooly extends Hoggle {
    imageSource = "sheep";
    frameRow = 1;
    state: BoolyState = BoolyState.Patrol;
    windupTimer = 0;

    // enemies
    // canBeHelds
    // hearts
    // special : pop balloons

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.isInDeathAnimation) {
            this.squishTimer++;
            if (this.squishTimer > 30) {
                this.isActive = false;
            }
        } else {
            if (this.state == BoolyState.Patrol) {
                this.GroundPatrol(0.3, this.turnAtLedges);

                if (player) {
                    let isPlayerInLineOfSightVertically =
                        player.yBottom <= this.yBottom + 12 &&
                        player.yBottom >= this.yBottom - 12;

                    let numberOfTilesVision = 10;
                    let isPlayerInLineOfSightHorizontally =
                        this.direction == -1 ?
                            (
                                player.xMid >= this.xMid - 12 * numberOfTilesVision &&
                                player.xMid <= this.xMid
                            ) :
                            (
                                player.xMid <= this.xMid + 12 * numberOfTilesVision &&
                                player.xMid >= this.xMid);

                    if (isPlayerInLineOfSightVertically && isPlayerInLineOfSightHorizontally) {
                        this.state = BoolyState.WindUp;
                        this.windupTimer = 0;
                        this.dx = 0;
                        this.direction = (player.xMid < this.xMid ? -1 : 1);
                    }

                }
            } else if (this.state == BoolyState.WindUp) {
                this.windupTimer++;
                if (this.windupTimer > 60) {
                    this.state = BoolyState.Charging;
                }
            } else if (this.state == BoolyState.Charging) {
                this.dx = 1 * this.direction;

                if (this.touchedLeftWalls.length > 0 && this.direction == -1) {
                    this.Recoil(this.direction);
                } else if (this.touchedRightWalls.length > 0 && this.direction == 1) {
                    this.Recoil(this.direction);
                } else {
                    let sprites = this.GetPotentialBounceSprites()

                    let xLeft = this.direction == -1 ? this.x - 3 : this.xRight;
                    let xRight = this.direction == -1 ? this.x : this.xRight + 3;
                    sprites.sort((a,b) => b.y - a.y)
                    for (let sprite of sprites) {
                        if (sprite.x < xRight && sprite.xRight > xLeft &&
                            sprite.y < this.yBottom && sprite.yBottom > this.y) {
                                this.LaunchSprite(sprite);
                            this.Recoil(this.direction);
                            break;
                        }
                    }
                }
            }

            this.ApplyGravity();
            this.ReactToWater();
        }
    }

    LaunchSprite(sprite: Sprite): void {
        let parentMotor = <Motor>this.layer.sprites.find(a => a instanceof Motor && a.connectedSprite == sprite);
        if (parentMotor) {
            parentMotor.connectedSprite = null;
        }
        if (sprite instanceof RedBalloon) {
            sprite.OnBounce();
        } else if (sprite.canBeHeld) {
            sprite.OnThrow(this, this.direction);
        } else {
            if (!sprite.updatedThisFrame) {
                sprite.updatedThisFrame = true;
                sprite.SharedUpdate();
                sprite.Update();
                if (sprite instanceof Enemy) {
                    sprite.EnemyUpdate();
                }
            }
            sprite.isOnGround = false;
            sprite.dx = this.direction * 2;
            sprite.dy = -2;
            if (sprite instanceof RollingSnailShell) sprite.direction = this.direction;
        }
        if (sprite == player) {
            player.throwTimer = 0;
            player.heldItem = null;
        }
    }

    GetPotentialBounceSprites(): Sprite[] {
        return this.layer.sprites.filter(a => (a instanceof Enemy || a instanceof Player ||
            a.canBeHeld || a instanceof ExtraHitHeart || a instanceof RedBalloon) && !(a instanceof Sparky));
    }

    Recoil(direction: -1 | 1) {
        this.dx = -0.8 * direction;
        this.dy = -0.7;
        this.state = BoolyState.Patrol;
    }

}