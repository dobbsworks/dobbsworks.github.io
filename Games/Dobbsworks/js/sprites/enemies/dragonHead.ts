class ElderDragon extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    public canMotorHold: boolean = false;
    timer = 0;
    maxAllowed = 1;

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        if (this.timer == 0) {
            audioHandler.PlaySound("dragon-roar", false);
            camera.isAutoscrollingVertically = true;
            camera.isAutoscrollingHorizontally = true;
            camera.autoscrollY = 1;
        }

        let cameraDist = Math.abs(camera.targetX - (this.xMid - 3));
        if (cameraDist < 3) {
            camera.autoscrollX = 0;
            this.isActive = false;
            this.SpawnDragon();
        } else {
            camera.autoscrollX = (this.xMid - 3 - camera.targetX) / 100;
        }

        this.timer++;
    }

    SpawnDragon(): void {
        let head = new ElderDragonHead(this.x, this.y + 200, this.layer, []);
        head.x = this.xMid - head.width / 2 - 6;
        head.homeY = this.yMid;
        head.dy = -1;

        let leftEye = new ElderDragonEye(head.x, head.y, head.layer, []);
        let rightEye = new ElderDragonEye(head.x, head.y, head.layer, []);
        head.leftEye = leftEye;
        head.rightEye = rightEye;
        rightEye.flipped = true;

        let leftHand = new ElderDragonHand(head.x + head.width / 2 - 24, head.y, head.layer, []);
        let rightHand = new ElderDragonHand(head.x + head.width / 2 + 24, head.y, head.layer, []);
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

        let gem = new ElderDragonGem(head.x + head.width / 2 + 24, head.y, head.layer, []);
        head.gem = gem;
        gem.head = head;

        if (this.layer.map) {
            this.layer.map.backdropLayer.sprites.push(leftEye, rightEye, head, gem, leftHand, rightHand);
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["dragonHeadThumb"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }
    }
}

class ElderDragonEye extends Sprite {
    public height: number = 15;
    public width: number = 14;
    public respectsSolidTiles: boolean = false;
    flipped = false;
    Update(): void {}
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["dragonEye"][0][0],
            xFlip: this.flipped,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }
    }
}

class ElderDragonHand extends Enemy {
    public height: number = 17;
    public width: number = 48;
    public respectsSolidTiles: boolean = false;
    canBeBouncedOn = false;
    isPlatform = true;
    canStandOn = true;
    head!: ElderDragonHead;
    killedByProjectiles = false;
    immuneToSlideKill = true;
    public zIndex: number = 2;

    flipped = false;
    homeX = 0;
    homeY = 0;

    targetX = 0;
    targetY = 0;

    handOnGround = false;
    private wasFist = false;
    isFist = false;
    canSpawnThrowableMeteor = false;

    Update(): void {
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
        
        let wasOnGround = this.handOnGround;
        this.handOnGround = this.isOnGround;
        if (!wasOnGround && this.handOnGround) {
            audioHandler.PlaySound("bigcrash", false);
            camera.shakeTimerY = 20;

            if (this.head.currentAttackPattern == 4 && this.head.leftHand == this) {

                let tiles = [ Math.floor((Random.random() - 0.5) * 14) ];
                if (this.head.gem.hits == 1) tiles.push(Math.floor((Random.random() - 0.5) * 14));
                if (this.head.gem.hits == 1) tiles.push(Math.floor((Random.random() - 0.5) * 14));
                if (this.head.gem.hits == 2) tiles.push(Math.floor((Random.random() - 0.5) * 14));
                if (this.head.gem.hits == 2) tiles.push(Math.floor((Random.random() - 0.5) * 14));
                tiles = tiles.filter(Utility.OnlyUnique);

                for (let tile of tiles) {
                    let x = this.head.xMid + tile * 14 - 5;
                    let y = camera.GetTopCameraEdge() - 12;
    
                    let meteor = new SmallMeteor(x, y, this.layer, []);
                    this.layer.sprites.push(meteor);
                    meteor.willCoolOff = this.canSpawnThrowableMeteor;
                    this.canSpawnThrowableMeteor = false;
                }

            }

            let oldMeteors = <GrabbableMeteor[]>this.layer.sprites.filter(a => a instanceof GrabbableMeteor && a.age > 300 && a.isOnGround);
            oldMeteors.forEach(a => a.ReplaceWithSpriteType(BrokenMeteor));
        }

        if (player && this.head.currentAttackPattern != -1) {
            // a bit hacky, need to slow down hand so player can land on it
            let xDist  = Math.abs(this.xMid - player.xMid);
            if (player.yBottom - 2 < this.y && xDist < 30) {
                this.dy *= 0.85;
            }
        }

        if (this.isFist) {
            // prevent overlap
            if (this.head.leftHand == this && this.xRight > this.head.xMid) {
                this.dx = 0;
                this.x = this.head.xMid - this.width;
                if (camera.shakeTimerY == 0) camera.shakeTimerY = 20;
            }
            if (this.head.rightHand == this && this.x < this.head.xMid) {
                this.dx = 0;
                this.x = this.head.xMid;
            }
        }
    }

    AttackLogic(): void {
        let targetX = this.targetX; //+ Math.cos(this.age / 90) * 15;
        let targetY = this.targetY; //+ Math.sin(this.age / 30) * 5;

        if (Math.abs(targetY - this.yMid) > 1) this.AccelerateVertically(0.07, (targetY > this.yMid ? 1 : -1)* 3);
        if (Math.abs(targetX - this.xMid) > 1) this.AccelerateHorizontally(0.07, (targetX > this.xMid ? 1 : -1)* 3);
        this.dy *= 0.95;
        this.dx *= 0.95;


    }

    GetFrameData(frameNum: number): FrameData {
        if (this.isFist) {
            return {
                imageTile: tiles["dragonFist"][0][0],
                xFlip: this.flipped,
                yFlip: false,
                xOffset: 6,
                yOffset: 0
            }
        }
        return {
            imageTile: tiles["dragonClaw"][0][0],
            xFlip: this.flipped,
            yFlip: false,
            xOffset: 3,
            yOffset: 5
        }
    }
}

class ElderDragonHead extends Enemy {

    public height: number = 24;
    public width: number = 24;
    respectsSolidTiles = false;
    canBeBouncedOn = false;
    anchor = Direction.Down;
    resetX = 0;
    resetY = 0;
    killedByProjectiles = false;
    immuneToSlideKill = true;
    hurtTimer = 0;

    leftEye!: ElderDragonEye;
    rightEye!: ElderDragonEye;
    leftHand!: ElderDragonHand;
    rightHand!: ElderDragonHand;
    gem!: ElderDragonGem;
    homeX = 0;
    homeY = 0;
    mainLayer: LevelLayer = currentMap.mainLayer;


    // falling rocks, 1 breaks into heavy stone
    // need to jump on hand, hit head with stone

    // attacks
        // flame pillar cascade (1 gap between?)
        // both hands up, then smash down, rocks fall
        // slam hands closer and closer

    currentAttackPattern = -1;
    attackTimer = 0;
    initialized = false;
    
    timeBetweenFlames = 30;
    flameSpacing = 36;
    floorY = 99999;

    movingHand!: ElderDragonHand;

    // -1   pop-up from below screen
    // 0    idle
    // 1    fire line
    // 2    single hand slap
    // 3    fist clap
    // 4    fist bongo, meteors

    Update(): void {
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
            this.leftHand.layer.sprites.forEach(a => {
                if (a instanceof SmallMeteor || a instanceof ThrownMeteor || a instanceof GrabbableMeteor) {
                    a.ReplaceWithSpriteType(BrokenMeteor);
                }
            })
            if (this.attackTimer % 3 == 0) {
                let fireX = this.x + Math.random() * this.width - 3;
                let fireY = this.y + Math.random() * this.height - 3;
                let fire = new SingleFireBreath(fireX, fireY, this.layer, []);
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
    }
    public OnAfterUpdate(): void {
        this.MoveEyes();
    }

    MoveEyes(): void {
        let xOffset = 0;
        let yOffset = 0;
        if (player) {
            if (player.xMid < this.x - 20) xOffset = -1;
            if (player.xMid > this.xRight + 20) xOffset = 1;
            
            if (player.yMid < this.y) yOffset = -1;
            if (player.yMid > this.yBottom) yOffset = 1;
        }
        this.leftEye.x = this.x - 9 + xOffset;
        this.rightEye.x = this.leftEye.x + 30;
        this.leftEye.y = this.y + 14 + yOffset;
        this.rightEye.y = this.leftEye.y;

        this.gem.x = this.x + 9;
        this.gem.y = this.y - 15;
    }

    Dead(): void {
        this.leftHand.respectsSolidTiles = false;
        this.rightHand.respectsSolidTiles = false;
        this.leftHand.damagesPlayer = false;
        this.rightHand.damagesPlayer = false;
    }

    AttackLogic(): void {
        this.attackTimer++;

        if (this.currentAttackPattern == -1) {
            this.AccelerateVertically(0.04, (this.homeY > this.yMid ? 1 : -1)* 2);
            this.dy *= 0.99;
            if (this.yMid < this.homeY) this.dy *= 0.95;
        } else {
            this.x += Math.cos(this.age / 50) / 20;
            this.y += Math.sin(this.age / 20) / 20;
        }

        if (this.currentAttackPattern == 1) {
            if (this.attackTimer % this.timeBetweenFlames == 0) {
                let x = this.x - 12 - 132 + this.flameSpacing * (this.attackTimer / this.timeBetweenFlames);
                let newPillar = new FirePillar(x, this.y, this.mainLayer, []);
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
    }

    UpdateAttackPattern(): void {
        var newAttackPattern = this.currentAttackPattern;
        if (this.currentAttackPattern == -1 && this.attackTimer > 240) {
            newAttackPattern = 0;
            this.leftHand.layer = currentMap.mainLayer;
            this.rightHand.layer = currentMap.mainLayer;
            this.gem.layer = currentMap.mainLayer;
            this.layer.sprites = this.layer.sprites.filter(a => !(a instanceof ElderDragonHand || a instanceof ElderDragonGem));
            currentMap.mainLayer.sprites.push(this.leftHand, this.rightHand, this.gem);
            [this.leftHand, this.rightHand].forEach(a => {
                a.respectsSolidTiles = true;
            })
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
    }


    GetThumbnail(): ImageTile {
        return tiles["dragonHeadThumb"][0][0];
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["dragonHead"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 32,
            yOffset: 36
        }
    }
}

class ElderDragonGem extends Enemy {
    public height: number = 14;
    public width: number = 11;
    public respectsSolidTiles: boolean = false;
    immuneToSlideKill = true;
    killedByProjectiles = false;
    damagesPlayer: boolean = false;
    head!: ElderDragonHead;

    hurtTimer = 0;
    hits = 0;

    Update(): void {
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
        }
    }

    OnHitByProjectile = (enemy: Enemy, projectile: Sprite) => {
        if (this.hurtTimer <= 0) {
            this.hurtTimer = 60;
            projectile.isActive = false;
            this.hits++;

            if (this.hits >= 3) {
                this.hits = 3;
                this.head.Dead();
                this.damagesPlayer = false;
                this.hurtTimer = 6000;
                audioHandler.PlaySound("dragon-defeat", false);
            } else {
                audioHandler.PlaySound("dragon-roar", false);
            }
        }
    }


    GetFrameData(frameNum: number): FrameData {
        var hurtOffset = Math.floor(this.hurtTimer / 4) % 2;
        return {
            imageTile: tiles["dragonCrystal"][this.hits][hurtOffset],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }
    }
    
}