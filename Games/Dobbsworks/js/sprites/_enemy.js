"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = -1;
        _this.bumpsEnemies = true;
        _this.isInDeathAnimation = false;
        _this.stackStun = null;
        _this.stackedOn = null;
        _this.stackIndex = 0;
        _this.destackForgiveness = -1;
        _this.killedByProjectiles = true;
        _this.canStandOn = false;
        _this.damagesPlayer = true;
        _this.canSpinBounceOn = false;
        _this.immuneToSlideKill = false;
        _this.bounceSoundId = "bop";
        _this.OnHitByProjectile = Enemy.defaultProjectileHandler;
        return _this;
    }
    Enemy.prototype.EnemyUpdate = function () {
        var _this = this;
        if (this.respectsSolidTiles)
            this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        if (this.OnHitByProjectile != Enemy.defaultProjectileHandler) {
            var sprites = this.layer.sprites.filter(function (a) { return a.hurtsEnemies && a.IsGoingToOverlapSprite(_this); });
            for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
                var projectile = sprites_1[_i];
                this.OnHitByProjectile(this, projectile);
            }
        }
        if (this.killedByProjectiles) {
            // check for taking damage
            var sprites = this.layer.sprites.filter(function (a) { return a.hurtsEnemies && a.IsGoingToOverlapSprite(_this); });
            // special case for Booly
            var boolyLaunched = false;
            for (var _a = 0, sprites_2 = sprites; _a < sprites_2.length; _a++) {
                var projectile = sprites_2[_a];
                var isLaunchingBooly = (this instanceof WoolyBooly && this.state !== BoolyState.Patrol) && ((projectile.x < this.x && this.direction == -1) || (projectile.xRight > this.xRight && this.direction == 1));
                var isLaunchingSkitter = (this instanceof Skitter && this.isHiding);
                if (isLaunchingBooly || isLaunchingSkitter) {
                    this.LaunchSprite(projectile, this.xMid > projectile.xMid ? -1 : 1);
                    boolyLaunched = true;
                    if (projectile instanceof Bullet) {
                        audioHandler.PlaySound("plink", true);
                    }
                }
            }
            if (!boolyLaunched) {
                if (sprites.length > 0) {
                    this.isActive = false;
                    var deadSprite = new DeadEnemy(this);
                    this.layer.sprites.push(deadSprite);
                    for (var _b = 0, sprites_3 = sprites; _b < sprites_3.length; _b++) {
                        var sprite = sprites_3[_b];
                        sprite.OnStrikeEnemy(this);
                    }
                    if (!this.isExemptFromSpriteKillCheck) {
                        this.OnDead();
                    }
                    audioHandler.PlaySound("bop", true);
                }
            }
        }
        if (this.stackedOn) {
            this.dx = this.stackedOn.dx;
            this.dy = this.stackedOn.dy;
            if (this.destackForgiveness > 0)
                this.destackForgiveness--;
            if (this.destackForgiveness == -1) {
                this.destackForgiveness = 0;
                this.y = this.stackedOn.y - this.height;
            }
            if (this.stackedOn instanceof Enemy) {
                this.stackIndex = this.stackedOn.stackIndex + 1;
                this.direction = this.stackedOn.direction;
                if (!this.stackedOn.isActive) {
                    this.stackedOn = this.stackedOn.stackedOn;
                    this.destackForgiveness = 10;
                }
            }
            if (this.stackedOn) {
                var targetX = this.stackedOn.xMid - this.width / 2 + Math.sin(this.age / 15 + this.stackIndex) / 2;
                var distanceFromTargetX = Math.abs(this.x - targetX);
                var horizontalRestackSpeed = 0.5;
                if (this.x < targetX) {
                    // stack is to right
                    if (!this.isTouchingRightWall) {
                        if (distanceFromTargetX <= horizontalRestackSpeed)
                            this.x = targetX;
                        else
                            this.x += horizontalRestackSpeed;
                    }
                }
                else {
                    // stack is to left
                    if (!this.isTouchingLeftWall) {
                        if (distanceFromTargetX <= horizontalRestackSpeed)
                            this.x = targetX;
                        else
                            this.x -= horizontalRestackSpeed;
                    }
                }
                if (distanceFromTargetX > (this.width + this.stackedOn.width) / 2) {
                    this.stackedOn = null;
                }
                else {
                    var targetY = this.stackedOn.y - this.height;
                    var distanceFromTargetY = Math.abs(this.y - targetY);
                    var verticalRestackSpeed = 1.5;
                    if (this.y < targetY) {
                        // stack is low
                        if (!this.isOnGround) {
                            if (distanceFromTargetY <= verticalRestackSpeed)
                                this.y = targetY;
                            else
                                this.y += verticalRestackSpeed;
                        }
                    }
                    else {
                        // stack is high
                        if (!this.isOnCeiling) {
                            if (distanceFromTargetY <= verticalRestackSpeed)
                                this.y = targetY;
                            else
                                this.y -= verticalRestackSpeed;
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
            if (this.stackStun.frames <= 0)
                this.stackStun = null;
        }
        if (this.y < 12 * -8) {
            // went too far, delete
            this.isActive = false;
        }
    };
    Enemy.prototype.ApplyStackStun = function () {
        var enemyBelow = this.stackedOn;
        if (enemyBelow && enemyBelow instanceof Enemy) {
            enemyBelow.stackStun = { x: enemyBelow.x, y: enemyBelow.y, frames: 20 };
            enemyBelow.ApplyStackStun();
        }
    };
    Enemy.prototype.SharedOnBounce = function () {
        this.ApplyStackStun();
        audioHandler.PlaySound(this.bounceSoundId, true);
    };
    Enemy.prototype.SkyPatrol = function (speed) {
        this.AccelerateHorizontally(0.3, speed * this.direction);
        if (this.isTouchingLeftWall) {
            this.direction = 1;
        }
        else if (this.isTouchingRightWall) {
            this.direction = -1;
        }
    };
    Enemy.prototype.GroundPatrol = function (speed, turnAtLedge) {
        var _this = this;
        var _a, _b;
        if (this.isOnGround)
            this.AccelerateHorizontally(0.3, speed * this.direction);
        if (this.isTouchingLeftWall) {
            this.direction = 1;
        }
        else if (this.isTouchingRightWall) {
            this.direction = -1;
        }
        else {
            if (!this.isOnGround)
                return;
            var slopeFloor = this.standingOn.find(function (a) { return a.tileType.solidity instanceof SlopeSolidity && a.tileType.solidity.verticalSolidDirection == 1; });
            if (this.isOnCeiling && slopeFloor) {
                var solidity = (slopeFloor.tileType.solidity);
                this.direction = -solidity.horizontalSolidDirection;
            }
            else {
                // check for sprites
                var touchingSprites = this.layer.sprites.filter(function (a) { return a instanceof Enemy && a.bumpsEnemies && !a.isInDeathAnimation && a.IsGoingToOverlapSprite(_this) && a.stackedOn != _this && _this.stackedOn != a; });
                if (touchingSprites && touchingSprites[0]) {
                    if (touchingSprites[0].xMid < this.xMid) {
                        this.direction = 1;
                    }
                    else {
                        this.direction = -1;
                    }
                }
                else if (turnAtLedge) {
                    // check for ledge
                    var belowTile = this.layer.GetTileByPixel(this.xMid, this.yBottom + 0.1);
                    var isOnSlope = (belowTile.tileType.solidity instanceof SlopeSolidity);
                    var rightFootTile = isOnSlope && belowTile.tileType.solidity.horizontalSolidDirection == -1 ?
                        this.layer.GetTileByPixel(this.xRight + 2, this.yBottom + 0.1 + this.layer.tileHeight)
                        : this.layer.GetTileByPixel(this.xRight + 2, this.yBottom + 0.1);
                    var isGroundToRight = belowTile == rightFootTile || rightFootTile.tileType.solidity.IsSolidFromTop(this.direction) || ((_a = rightFootTile.GetSemisolidNeighbor()) === null || _a === void 0 ? void 0 : _a.tileType.solidity.IsSolidFromTop(this.direction));
                    var leftFootTile = isOnSlope && belowTile.tileType.solidity.horizontalSolidDirection == 1 ?
                        this.layer.GetTileByPixel(this.x - 2, this.yBottom + 0.1 + this.layer.tileHeight)
                        : this.layer.GetTileByPixel(this.x - 2, this.yBottom + 0.1);
                    var isGroundToLeft = belowTile == leftFootTile || leftFootTile.tileType.solidity.IsSolidFromTop(this.direction) || ((_b = leftFootTile.GetSemisolidNeighbor()) === null || _b === void 0 ? void 0 : _b.tileType.solidity.IsSolidFromTop(this.direction));
                    if (!isGroundToRight) {
                        //console.log(belowTile, rightFootTile)
                        isGroundToRight = this.layer.sprites.some(function (a) { return a.isPlatform && Math.abs(a.y - _this.yBottom) <= 0.11 && _this.xRight >= a.x - 2 && _this.xRight < a.xRight; });
                        if (!isGroundToRight) {
                            if (belowTile.tileType.solidity == Solidity.HalfSlopeUpLeft && rightFootTile.tileType.solidity == Solidity.HalfSlopeUpRight)
                                isGroundToRight = true;
                        }
                    }
                    if (!isGroundToLeft) {
                        isGroundToLeft = this.layer.sprites.some(function (a) { return a.isPlatform && Math.abs(a.y - _this.yBottom) <= 0.11 && _this.x <= a.xRight + 2 && _this.x > a.x; });
                        if (!isGroundToLeft) {
                            if (belowTile.tileType.solidity == Solidity.HalfSlopeDownRight && leftFootTile.tileType.solidity == Solidity.HalfSlopeDownLeft)
                                isGroundToLeft = true;
                        }
                    }
                    if (this.parentSprite) {
                        if (!isGroundToRight) {
                            if (this.parentSprite.xRight >= this.xRight)
                                isGroundToRight = true;
                        }
                        if (!isGroundToLeft) {
                            if (this.parentSprite.x <= this.x)
                                isGroundToLeft = true;
                        }
                    }
                    if (isGroundToLeft && !isGroundToRight)
                        this.direction = -1;
                    if (!isGroundToLeft && isGroundToRight)
                        this.direction = 1;
                }
            }
        }
    };
    Enemy.prototype.IsPlayerInLineOfSight = function () {
        if (player) {
            var isPlayerInLineOfSightVertically = player.yBottom <= this.yBottom + 12 &&
                player.yBottom >= this.yBottom - 12;
            var numberOfTilesVision = 10;
            var isPlayerInLineOfSightHorizontally = this.direction == -1 ?
                (player.xMid >= this.xMid - 12 * numberOfTilesVision &&
                    player.xMid <= this.xMid) :
                (player.xMid <= this.xMid + 12 * numberOfTilesVision &&
                    player.xMid >= this.xMid);
            if (isPlayerInLineOfSightVertically && isPlayerInLineOfSightHorizontally) {
                return true;
            }
        }
        return false;
    };
    return Enemy;
}(Sprite));
