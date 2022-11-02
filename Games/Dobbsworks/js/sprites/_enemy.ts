abstract class Enemy extends Sprite {
    direction: -1 | 1 = -1;
    bumpsEnemies: boolean = true;
    isInDeathAnimation: boolean = false;
    stackStun: { x: number, y: number, frames: number } | null = null;
    stackedOn: Enemy | null = null;
    stackIndex: number = 0;
    destackForgiveness: number = -1;
    killedByProjectiles: boolean = true;
    canStandOn: boolean = false;
    damagesPlayer: boolean = true;

    bounceSoundId: string = "bop";

    public EnemyUpdate() {
        if (this.respectsSolidTiles) this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();

        if (this.killedByProjectiles) {
            // check for taking damage
            let sprites = this.layer.sprites.filter(a => a.hurtsEnemies && a.IsGoingToOverlapSprite(this));

            // special case for Booly
            let boolyLaunched = false;
            for (let projectile of sprites) {
                if ((this instanceof WoolyBooly && this.state !== BoolyState.Patrol) && ((projectile.x < this.x && this.direction == -1) || (projectile.xRight > this.xRight && this.direction == 1))) {
                    this.LaunchSprite(projectile, this.xMid < projectile.xMid ? -1 : 1);
                    boolyLaunched = true;
                }
            }

            if (!boolyLaunched) {
                if (sprites.length) {
                    this.isActive = false;
                    let deadSprite = new DeadEnemy(this);
                    this.layer.sprites.push(deadSprite);
                    for (let sprite of sprites) {
                        sprite.OnStrikeEnemy(this);
                    }
                    if (!this.isExemptFromSpriteKillCheck) {
                        this.OnDead();
                    }
                }
            }
        }
        if (this.stackedOn) {
            this.dx = this.stackedOn.dx;
            this.dy = this.stackedOn.dy;
            if (this.destackForgiveness > 0) this.destackForgiveness--;
            if (this.destackForgiveness == -1) {
                this.destackForgiveness = 0;
                this.y = this.stackedOn.y - this.height;
            }
            this.stackIndex = this.stackedOn.stackIndex + 1;
            this.direction = this.stackedOn.direction;
            if (!this.stackedOn.isActive) {
                this.stackedOn = this.stackedOn.stackedOn;
                this.destackForgiveness = 10;
            }
            if (this.stackedOn) {
                let targetX = this.stackedOn.xMid - this.width / 2 + Math.sin(this.age / 15 + this.stackIndex) / 2;
                let distanceFromTargetX = Math.abs(this.x - targetX);
                let horizontalRestackSpeed = 0.5;
                if (this.x < targetX) {
                    // stack is to right
                    if (!this.isTouchingRightWall) {
                        if (distanceFromTargetX <= horizontalRestackSpeed) this.x = targetX;
                        else this.x += horizontalRestackSpeed;
                    }
                } else {
                    // stack is to left
                    if (!this.isTouchingLeftWall) {
                        if (distanceFromTargetX <= horizontalRestackSpeed) this.x = targetX;
                        else this.x -= horizontalRestackSpeed;
                    }
                }

                if (distanceFromTargetX > (this.width + this.stackedOn.width) / 2) {
                    this.stackedOn = null;
                } else {
                    let targetY = this.stackedOn.y - this.height;
                    let distanceFromTargetY = Math.abs(this.y - targetY);
                    let verticalRestackSpeed = 1.5;
                    if (this.y < targetY) {
                        // stack is low
                        if (!this.isOnGround) {
                            if (distanceFromTargetY <= verticalRestackSpeed) this.y = targetY;
                            else this.y += verticalRestackSpeed;
                        }
                    } else {
                        // stack is high
                        if (!this.isOnCeiling) {
                            if (distanceFromTargetY <= verticalRestackSpeed) this.y = targetY;
                            else this.y -= verticalRestackSpeed;
                            this.destackForgiveness = 3;
                        }
                    }
                    if (this.destackForgiveness <= 0 && distanceFromTargetY > 4) {
                        this.stackedOn = null;
                    }
                }
            }
        }
        if (this.stackStun) {
            this.x = this.stackStun.x;
            this.y = this.stackStun.y;
            this.stackStun.frames--;
            if (this.stackStun.frames <= 0) this.stackStun = null;
        }

        if (this.y < 12 * -4) {
            // went too far, delete
            this.isActive = false;
        }
    }

    private ApplyStackStun(): void {
        let enemyBelow = this.stackedOn;
        if (enemyBelow) {
            enemyBelow.stackStun = { x: enemyBelow.x, y: enemyBelow.y, frames: 20 };
            enemyBelow.ApplyStackStun();
        }
    }

    public SharedOnBounce(): void {
        this.ApplyStackStun();
        audioHandler.PlaySound(this.bounceSoundId, true);
    }

    public SkyPatrol(speed: number) {
        this.AccelerateHorizontally(0.3, speed * this.direction);
        if (this.isTouchingLeftWall) {
            this.direction = 1;
        } else if (this.isTouchingRightWall) {
            this.direction = -1;
        }
    }

    public GroundPatrol(speed: number, turnAtLedge: boolean) {
        if (this.isOnGround) this.AccelerateHorizontally(0.3, speed * this.direction);
        if (this.isTouchingLeftWall) {
            this.direction = 1;
        } else if (this.isTouchingRightWall) {
            this.direction = -1;
        } else {
            if (!this.isOnGround) return;
            let slopeFloor = this.standingOn.find(a => a.tileType.solidity instanceof SlopeSolidity && a.tileType.solidity.verticalSolidDirection == 1);
            if (this.isOnCeiling && slopeFloor) {
                let solidity = <SlopeSolidity>(slopeFloor.tileType.solidity);
                this.direction = <-1 | 1>-solidity.horizontalSolidDirection;
            } else {
                // check for sprites
                let touchingSprites = this.layer.sprites.filter(a => a instanceof Enemy && a.bumpsEnemies && !a.isInDeathAnimation && a.IsGoingToOverlapSprite(this) && a.stackedOn != this && this.stackedOn != a);
                if (touchingSprites && touchingSprites[0]) {
                    if (touchingSprites[0].xMid < this.xMid) {
                        this.direction = 1;
                    } else {
                        this.direction = -1;
                    }
                } else if (turnAtLedge) {
                    // check for ledge
                    let belowTile = this.layer.GetTileByPixel(this.xMid, this.yBottom + 0.1);
                    let isOnSlope = (belowTile.tileType.solidity instanceof SlopeSolidity);

                    let rightFootTile = isOnSlope && (<SlopeSolidity>belowTile.tileType.solidity).horizontalSolidDirection == -1 ?
                        this.layer.GetTileByPixel(this.xRight + 2, this.yBottom + 0.1 + this.layer.tileHeight)
                        : this.layer.GetTileByPixel(this.xRight + 2, this.yBottom + 0.1);
                    let isGroundToRight = belowTile == rightFootTile || rightFootTile.tileType.solidity.IsSolidFromTop(this.direction) || rightFootTile.GetSemisolidNeighbor()?.tileType.solidity.IsSolidFromTop(this.direction);
                    let leftFootTile = isOnSlope && (<SlopeSolidity>belowTile.tileType.solidity).horizontalSolidDirection == 1 ?
                        this.layer.GetTileByPixel(this.x - 2, this.yBottom + 0.1 + this.layer.tileHeight)
                        : this.layer.GetTileByPixel(this.x - 2, this.yBottom + 0.1);
                    let isGroundToLeft = belowTile == leftFootTile || leftFootTile.tileType.solidity.IsSolidFromTop(this.direction) || leftFootTile.GetSemisolidNeighbor()?.tileType.solidity.IsSolidFromTop(this.direction);

                    if (!isGroundToRight) {
                        //console.log(belowTile, rightFootTile)
                        isGroundToRight = this.layer.sprites.some(a => a.isPlatform && Math.abs(a.y - this.yBottom) <= 0.11 && this.xRight >= a.x && this.xRight < a.xRight);
                        if (!isGroundToRight) {
                            if (belowTile.tileType.solidity == Solidity.HalfSlopeUpLeft && rightFootTile.tileType.solidity == Solidity.HalfSlopeUpRight) isGroundToRight = true;
                        }
                    }
                    if (!isGroundToLeft) {
                        isGroundToLeft = this.layer.sprites.some(a => a.isPlatform && Math.abs(a.y - this.yBottom) <= 0.11 && this.x <= a.xRight && this.x > a.x);
                        if (!isGroundToLeft) {
                            if (belowTile.tileType.solidity == Solidity.HalfSlopeDownRight && leftFootTile.tileType.solidity == Solidity.HalfSlopeDownLeft) isGroundToLeft = true;
                        }
                    }

                    if (this.parentSprite) {
                        if (!isGroundToRight) {
                            if (this.parentSprite.xRight >= this.xRight) isGroundToRight = true;
                        }
                        if (!isGroundToLeft) {
                            if (this.parentSprite.x <= this.x) isGroundToLeft = true;
                        }
                    }

                    if (isGroundToLeft && !isGroundToRight) this.direction = -1;
                    if (!isGroundToLeft && isGroundToRight) this.direction = 1;
                }
            }
        }
    }


}