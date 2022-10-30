class Wooly extends Piggle {
    frameRow = 0;
    imageSource = "sheep";
    turnAtLedges = false;
    bounceSoundId = "baa-dead";
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
    bounceSoundId = "baa-dead";

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
                        audioHandler.PlaySound("baa", false);
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
                this.AccelerateHorizontally(0.25, this.direction);

                if (this.touchedLeftWalls.length > 0 && this.direction == -1) {
                    this.Recoil(this.direction);
                } else if (this.touchedRightWalls.length > 0 && this.direction == 1) {
                    this.Recoil(this.direction);
                } else {
                    let sprites = this.GetPotentialBounceSprites()

                    let xLeft = this.direction == -1 ? this.x - 3 : this.xRight;
                    let xRight = this.direction == -1 ? this.x : this.xRight + 3;
                    sprites.sort((a, b) => b.y - a.y)
                    for (let sprite of sprites) {
                        if (sprite.x < xRight && sprite.xRight > xLeft &&
                            sprite.y < this.yBottom && sprite.yBottom > this.y) {
                            this.LaunchSprite(sprite, this.direction);
                            this.Recoil(this.direction);
                            if (sprite == player) {
                                player.throwTimer = 0;
                                player.heldItem = null;
                            }
                            break;
                        }
                    }
                }
            }

            this.ApplyGravity();
            this.ReactToWater();
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
        audioHandler.PlaySound("crash", false);
    }

}