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
var ElderDragon = /** @class */ (function (_super) {
    __extends(ElderDragon, _super);
    function ElderDragon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        _this.timer = 0;
        _this.maxAllowed = 1;
        return _this;
    }
    ElderDragon.prototype.Update = function () {
        if (!this.WaitForOnScreen())
            return;
        if (this.timer == 0) {
            audioHandler.PlaySound("dragon-roar", false);
            camera.isAutoscrollingVertically = true;
            camera.isAutoscrollingHorizontally = true;
            camera.autoscrollY = 1;
        }
        var cameraDist = Math.abs(camera.targetX - (this.xMid - 3));
        if (cameraDist < 3) {
            camera.autoscrollX = 0;
            this.isActive = false;
            this.SpawnDragon();
        }
        else {
            camera.autoscrollX = (this.xMid - 3 - camera.targetX) / 100;
        }
        this.timer++;
    };
    ElderDragon.prototype.SpawnDragon = function () {
        var head = new ElderDragonHead(this.x, this.y + 200, this.layer, []);
        head.x = this.xMid - head.width / 2 - 6;
        head.homeY = this.yMid;
        head.dy = -1;
        var leftEye = new ElderDragonEye(head.x, head.y, head.layer, []);
        var rightEye = new ElderDragonEye(head.x, head.y, head.layer, []);
        head.leftEye = leftEye;
        head.rightEye = rightEye;
        rightEye.flipped = true;
        var leftHand = new ElderDragonHand(head.x + head.width / 2 - 24, head.y, head.layer, []);
        var rightHand = new ElderDragonHand(head.x + head.width / 2 + 24, head.y, head.layer, []);
        leftHand.homeY = head.homeY + 24;
        rightHand.homeY = leftHand.homeY;
        leftHand.x -= 48;
        rightHand.x += 48;
        rightHand.flipped = true;
        head.leftHand = leftHand;
        head.rightHand = rightHand;
        leftHand.homeX = leftHand.x;
        rightHand.homeX = rightHand.x;
        leftHand.targetY = leftHand.homeY;
        leftHand.targetX = leftHand.homeX;
        rightHand.targetY = rightHand.homeY;
        rightHand.targetX = rightHand.homeX;
        leftHand.head = head;
        rightHand.head = head;
        var gem = new ElderDragonGem(head.x + head.width / 2 + 24, head.y, head.layer, []);
        head.gem = gem;
        gem.head = head;
        if (this.layer.map) {
            this.layer.map.backdropLayer.sprites.push(leftEye, rightEye, head, gem, leftHand, rightHand);
        }
    };
    ElderDragon.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["dragonHeadThumb"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ElderDragon;
}(Sprite));
var ElderDragonEye = /** @class */ (function (_super) {
    __extends(ElderDragonEye, _super);
    function ElderDragonEye() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 15;
        _this.width = 14;
        _this.respectsSolidTiles = false;
        _this.flipped = false;
        return _this;
    }
    ElderDragonEye.prototype.Update = function () { };
    ElderDragonEye.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["dragonEye"][0][0],
            xFlip: this.flipped,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ElderDragonEye;
}(Sprite));
var ElderDragonHand = /** @class */ (function (_super) {
    __extends(ElderDragonHand, _super);
    function ElderDragonHand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 17;
        _this.width = 48;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = false;
        _this.isPlatform = true;
        _this.canStandOn = true;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        _this.zIndex = 2;
        _this.flipped = false;
        _this.homeX = 0;
        _this.homeY = 0;
        _this.targetX = 0;
        _this.targetY = 0;
        _this.handOnGround = false;
        _this.wasFist = false;
        _this.isFist = false;
        _this.canSpawnThrowableMeteor = false;
        return _this;
    }
    ElderDragonHand.prototype.Update = function () {
        this.width = this.isFist ? 18 : 48;
        this.height = this.isFist ? 36 : 17;
        if (this.wasFist && !this.isFist) {
            this.x -= 15;
        }
        if (!this.wasFist && this.isFist) {
            this.x += 15;
        }
        this.wasFist = this.isFist;
        this.AttackLogic();
        var wasOnGround = this.handOnGround;
        this.handOnGround = this.isOnGround;
        if (!wasOnGround && this.handOnGround) {
            audioHandler.PlaySound("bigcrash", false);
            camera.shakeTimerY = 20;
            if (this.head.currentAttackPattern == 4 && this.head.leftHand == this) {
                var tiles_2 = [Math.floor((Random.random() - 0.5) * 14)];
                if (this.head.gem.hits == 1)
                    tiles_2.push(Math.floor((Random.random() - 0.5) * 14));
                if (this.head.gem.hits == 1)
                    tiles_2.push(Math.floor((Random.random() - 0.5) * 14));
                if (this.head.gem.hits == 2)
                    tiles_2.push(Math.floor((Random.random() - 0.5) * 14));
                if (this.head.gem.hits == 2)
                    tiles_2.push(Math.floor((Random.random() - 0.5) * 14));
                tiles_2 = tiles_2.filter(Utility.OnlyUnique);
                for (var _i = 0, tiles_1 = tiles_2; _i < tiles_1.length; _i++) {
                    var tile = tiles_1[_i];
                    var x = this.head.xMid + tile * 14 - 5;
                    var y = camera.GetTopCameraEdge() - 12;
                    var meteor = new SmallMeteor(x, y, this.layer, []);
                    this.layer.sprites.push(meteor);
                    meteor.willCoolOff = this.canSpawnThrowableMeteor;
                    this.canSpawnThrowableMeteor = false;
                }
            }
            var oldMeteors = this.layer.sprites.filter(function (a) { return a instanceof GrabbableMeteor && a.age > 300 && a.isOnGround; });
            oldMeteors.forEach(function (a) { return a.ReplaceWithSpriteType(BrokenMeteor); });
        }
        if (player && this.head.currentAttackPattern != -1) {
            // a bit hacky, need to slow down hand so player can land on it
            var xDist = Math.abs(this.xMid - player.xMid);
            if (player.yBottom - 2 < this.y && xDist < 30) {
                this.dy *= 0.85;
            }
        }
        if (this.isFist) {
            // prevent overlap
            if (this.head.leftHand == this && this.xRight > this.head.xMid) {
                this.dx = 0;
                this.x = this.head.xMid - this.width;
                if (camera.shakeTimerY == 0)
                    camera.shakeTimerY = 20;
            }
            if (this.head.rightHand == this && this.x < this.head.xMid) {
                this.dx = 0;
                this.x = this.head.xMid;
            }
        }
    };
    ElderDragonHand.prototype.AttackLogic = function () {
        var targetX = this.targetX; //+ Math.cos(this.age / 90) * 15;
        var targetY = this.targetY; //+ Math.sin(this.age / 30) * 5;
        if (Math.abs(targetY - this.yMid) > 1)
            this.AccelerateVertically(0.07, (targetY > this.yMid ? 1 : -1) * 3);
        if (Math.abs(targetX - this.xMid) > 1)
            this.AccelerateHorizontally(0.07, (targetX > this.xMid ? 1 : -1) * 3);
        this.dy *= 0.95;
        this.dx *= 0.95;
    };
    ElderDragonHand.prototype.GetFrameData = function (frameNum) {
        if (this.isFist) {
            return {
                imageTile: tiles["dragonFist"][0][0],
                xFlip: this.flipped,
                yFlip: false,
                xOffset: 6,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["dragonClaw"][0][0],
            xFlip: this.flipped,
            yFlip: false,
            xOffset: 3,
            yOffset: 5
        };
    };
    return ElderDragonHand;
}(Enemy));
var ElderDragonHead = /** @class */ (function (_super) {
    __extends(ElderDragonHead, _super);
    function ElderDragonHead() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 24;
        _this.width = 24;
        _this.respectsSolidTiles = false;
        _this.canBeBouncedOn = false;
        _this.anchor = Direction.Down;
        _this.resetX = 0;
        _this.resetY = 0;
        _this.killedByProjectiles = false;
        _this.immuneToSlideKill = true;
        _this.hurtTimer = 0;
        _this.homeX = 0;
        _this.homeY = 0;
        _this.mainLayer = currentMap.mainLayer;
        // falling rocks, 1 breaks into heavy stone
        // need to jump on hand, hit head with stone
        // attacks
        // flame pillar cascade (1 gap between?)
        // both hands up, then smash down, rocks fall
        // slam hands closer and closer
        _this.currentAttackPattern = -1;
        _this.attackTimer = 0;
        _this.initialized = false;
        _this.timeBetweenFlames = 30;
        _this.flameSpacing = 36;
        _this.floorY = 99999;
        return _this;
    }
    // -1   pop-up from below screen
    // 0    idle
    // 1    fire line
    // 2    single hand slap
    // 3    fist clap
    // 4    fist bongo, meteors
    ElderDragonHead.prototype.Update = function () {
        this.dx *= 0.99;
        this.dy *= 0.99;
        this.UpdateAttackPattern();
        this.AttackLogic();
        this.ReactToWater();
        this.ReactToVerticalWind();
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
        }
        if (this.gem.hits >= 3) {
            this.leftHand.layer.sprites.forEach(function (a) {
                if (a instanceof SmallMeteor || a instanceof ThrownMeteor || a instanceof GrabbableMeteor) {
                    a.ReplaceWithSpriteType(BrokenMeteor);
                }
            });
            if (this.attackTimer % 3 == 0) {
                var fireX = this.x + Math.random() * this.width - 3;
                var fireY = this.y + Math.random() * this.height - 3;
                var fire = new SingleFireBreath(fireX, fireY, this.layer, []);
                fire.hurtsPlayer = false;
                this.layer.sprites.push(fire);
            }
            if (this.attackTimer % 10 == 0) {
                audioHandler.PlaySound("bigcrash", false);
            }
            if (!this.IsOnScreen()) {
                this.isActive = false;
                camera.shakeTimerY = 25;
                camera.autoscrollX = 0.25;
            }
            this.AccelerateVertically(0.04, 2);
        }
    };
    ElderDragonHead.prototype.OnAfterUpdate = function () {
        this.MoveEyes();
    };
    ElderDragonHead.prototype.MoveEyes = function () {
        var xOffset = 0;
        var yOffset = 0;
        if (player) {
            if (player.xMid < this.x - 20)
                xOffset = -1;
            if (player.xMid > this.xRight + 20)
                xOffset = 1;
            if (player.yMid < this.y)
                yOffset = -1;
            if (player.yMid > this.yBottom)
                yOffset = 1;
        }
        this.leftEye.x = this.x - 9 + xOffset;
        this.rightEye.x = this.leftEye.x + 30;
        this.leftEye.y = this.y + 14 + yOffset;
        this.rightEye.y = this.leftEye.y;
        this.gem.x = this.x + 9;
        this.gem.y = this.y - 15;
    };
    ElderDragonHead.prototype.Dead = function () {
        this.leftHand.respectsSolidTiles = false;
        this.rightHand.respectsSolidTiles = false;
        this.leftHand.damagesPlayer = false;
        this.rightHand.damagesPlayer = false;
    };
    ElderDragonHead.prototype.AttackLogic = function () {
        this.attackTimer++;
        if (this.currentAttackPattern == -1) {
            this.AccelerateVertically(0.04, (this.homeY > this.yMid ? 1 : -1) * 2);
            this.dy *= 0.99;
            if (this.yMid < this.homeY)
                this.dy *= 0.95;
        }
        else {
            this.x += Math.cos(this.age / 50) / 20;
            this.y += Math.sin(this.age / 20) / 20;
        }
        if (this.currentAttackPattern == 1) {
            if (this.attackTimer % this.timeBetweenFlames == 0) {
                var x = this.x - 12 - 132 + this.flameSpacing * (this.attackTimer / this.timeBetweenFlames);
                var newPillar = new FirePillar(x, this.y, this.mainLayer, []);
                this.mainLayer.sprites.push(newPillar);
            }
        }
        if (this.currentAttackPattern == 2 && player) {
            if (this.attackTimer == 1) {
                this.movingHand = player.xMid < this.xMid ? this.leftHand : this.rightHand;
                this.movingHand.targetX = player.x;
                this.movingHand.targetY = camera.GetTopCameraEdge();
            }
            if (this.attackTimer == 90) {
                this.movingHand.targetY = camera.GetBottomCameraEdge();
            }
            if (this.attackTimer == 180) {
                this.movingHand.targetX = this.movingHand.homeX;
                this.movingHand.targetY = this.movingHand.homeY;
            }
        }
        if (this.currentAttackPattern == 3 && player) {
            if (this.attackTimer == 1) {
                this.leftHand.targetX = this.xMid - 112;
                this.rightHand.targetX = this.xMid + 112;
                this.leftHand.targetY = this.y;
                this.rightHand.targetY = this.y;
            }
            if (this.attackTimer == 60) {
                this.leftHand.isFist = true;
                this.rightHand.isFist = true;
                this.leftHand.targetY = this.floorY;
                this.rightHand.targetY = this.floorY;
            }
            if (this.attackTimer == 120) {
                this.leftHand.targetX = this.xMid;
                this.rightHand.targetX = this.xMid;
            }
            if (this.attackTimer == 220) {
                this.leftHand.targetX = this.leftHand.homeX;
                this.leftHand.targetY = this.leftHand.homeY;
                this.rightHand.targetX = this.rightHand.homeX;
                this.rightHand.targetY = this.rightHand.homeY;
                this.leftHand.isFist = false;
                this.rightHand.isFist = false;
            }
        }
        if (this.currentAttackPattern == 4) {
            if (this.attackTimer == 1) {
                this.leftHand.targetX = this.xMid - 112;
                this.rightHand.targetX = this.xMid + 112;
                this.leftHand.targetY = this.y;
                this.rightHand.targetY = this.y;
            }
            if (this.attackTimer > 1 && this.attackTimer < 220) {
                this.leftHand.isFist = true;
                this.rightHand.isFist = true;
                if (this.attackTimer % 30 == 0) {
                    this.leftHand.targetY = this.floorY;
                    this.rightHand.targetY = this.floorY;
                }
                if (this.attackTimer % 30 == 15) {
                    this.leftHand.targetY = this.leftHand.homeY + 12;
                    this.rightHand.targetY = this.rightHand.homeY + 12;
                }
                if (this.attackTimer == 185) {
                    this.leftHand.canSpawnThrowableMeteor = true;
                }
            }
            if (this.attackTimer == 340) {
                this.leftHand.targetX = this.leftHand.homeX;
                this.leftHand.targetY = this.leftHand.homeY;
                this.rightHand.targetX = this.rightHand.homeX;
                this.rightHand.targetY = this.rightHand.homeY;
                this.leftHand.isFist = false;
                this.rightHand.isFist = false;
            }
        }
    };
    ElderDragonHead.prototype.UpdateAttackPattern = function () {
        var newAttackPattern = this.currentAttackPattern;
        if (this.currentAttackPattern == -1 && this.attackTimer > 240) {
            newAttackPattern = 0;
            this.leftHand.layer = currentMap.mainLayer;
            this.rightHand.layer = currentMap.mainLayer;
            this.gem.layer = currentMap.mainLayer;
            this.layer.sprites = this.layer.sprites.filter(function (a) { return !(a instanceof ElderDragonHand || a instanceof ElderDragonGem); });
            currentMap.mainLayer.sprites.push(this.leftHand, this.rightHand, this.gem);
            [this.leftHand, this.rightHand].forEach(function (a) {
                a.respectsSolidTiles = true;
            });
        }
        if (this.currentAttackPattern == 0 && this.attackTimer > 60) {
            newAttackPattern = 1;
        }
        if (this.currentAttackPattern == 1 && this.attackTimer > (264 / this.flameSpacing * this.timeBetweenFlames)) {
            newAttackPattern = 2;
        }
        if (this.currentAttackPattern == 2 && this.attackTimer > 200) {
            newAttackPattern = 3;
        }
        if (this.currentAttackPattern == 3 && this.attackTimer > 240) {
            newAttackPattern = 4;
        }
        if (this.currentAttackPattern == 4 && this.attackTimer > 360) {
            newAttackPattern = 0;
        }
        if (newAttackPattern != this.currentAttackPattern) {
            this.currentAttackPattern = newAttackPattern;
            this.attackTimer = 0;
        }
    };
    ElderDragonHead.prototype.GetThumbnail = function () {
        return tiles["dragonHeadThumb"][0][0];
    };
    ElderDragonHead.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["dragonHead"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 32,
            yOffset: 36
        };
    };
    return ElderDragonHead;
}(Enemy));
var ElderDragonGem = /** @class */ (function (_super) {
    __extends(ElderDragonGem, _super);
    function ElderDragonGem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 14;
        _this.width = 11;
        _this.respectsSolidTiles = false;
        _this.immuneToSlideKill = true;
        _this.killedByProjectiles = false;
        _this.damagesPlayer = false;
        _this.hurtTimer = 0;
        _this.hits = 0;
        _this.OnHitByProjectile = function (enemy, projectile) {
            if (_this.hurtTimer <= 0) {
                _this.hurtTimer = 60;
                projectile.isActive = false;
                _this.hits++;
                if (_this.hits >= 3) {
                    _this.hits = 3;
                    _this.head.Dead();
                    _this.damagesPlayer = false;
                    _this.hurtTimer = 6000;
                    audioHandler.PlaySound("dragon-defeat", false);
                }
                else {
                    audioHandler.PlaySound("dragon-roar", false);
                }
            }
        };
        return _this;
    }
    ElderDragonGem.prototype.Update = function () {
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
        }
    };
    ElderDragonGem.prototype.GetFrameData = function (frameNum) {
        var hurtOffset = Math.floor(this.hurtTimer / 4) % 2;
        return {
            imageTile: tiles["dragonCrystal"][this.hits][hurtOffset],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    };
    return ElderDragonGem;
}(Enemy));
