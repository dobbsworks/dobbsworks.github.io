class AFish extends Enemy {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = true;
    canBeBouncedOn = true;

    lastX = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        let wasInWater = this.isInWater;
        this.ReactToWater();
        if (wasInWater && !this.isInWater) {
            this.x = this.lastX;
            this.direction *= -1;
            this.ReactToWater();
        }
        
        this.lastX = this.x;
        if (this.isInWater) {
            this.ApplyInertia();
            if (Math.abs(this.dy) > 0.035) this.dy *= 0.9;
            if (this.direction == 1 && this.isTouchingRightWall) {
                this.direction = -1;
            }
            if (this.direction == -1 && this.isTouchingLeftWall) {
                this.direction = 1;
            }
            let targetDx = this.direction * 0.3;
            if (this.direction == 1 && this.dx < 0) this.dx = 0;
            if (this.direction == -1 && this.dx > 0) this.dx = 0;
            if (this.dx != targetDx) {
                this.dx += (targetDx - this.dx) * 0.1;
            }
            this.dy += Math.cos(this.age / 30) / 1000;
            this.ReactToVerticalWind();
        } else {
            this.ApplyGravity();
            this.ReplaceWithSpriteType(FloppingFish);
        }

        this.canBeBouncedOn = (player && !player.isInWater);
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }

    OnBounce(): void {
        this.ReplaceWithSprite(new DeadEnemy(this));
        this.OnDead();
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(frameNum / 10) % 2;
        return {
            imageTile: tiles["fish"][col][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 0
        };
    }
}

class FloppingFish extends Sprite {

    public height: number = 6;
    public width: number = 12;
    respectsSolidTiles = true;
    direction: -1 | 1 = 1;

    Update(): void {
        this.ApplyGravity();
        this.ReactToPlatformsAndSolids();
        this.ReactToWater();
        this.ApplyInertia();
        this.MoveByVelocity();
        if (this.isInWater) {
            this.ReplaceWithSpriteType(AFish);
        }

        if (this.standingOn.length) {
            this.dy = -1;
            this.direction *= -1;
            this.dx = this.direction * 0.5;
        }

        if (player && this.IsGoingToOverlapSprite(player)) {
            let dead = this.ReplaceWithSprite(new DeadEnemy(this));
            dead.dy = -1;
            dead.dx = 0.5;
            this.OnDead();
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let col = 2;
        let yFlip = Math.floor(frameNum / 10) % 2 == 0;
        return {
            imageTile: tiles["fish"][col][0],
            xFlip: false,
            yFlip: yFlip,
            xOffset: 2,
            yOffset: 6
        };
    }
}

class Grouper extends Sprite {
    // creates school of fish when scrolled on screen

    public height: number = 8;
    public width: number = 18;
    respectsSolidTiles = true;
    public canMotorHold: boolean = false;
    initialized = false;
    fish: GrouperFish[] = [];

    GetThumbnail(): ImageTile {
        return tiles["grouper"][0][0];
    }

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        let fishPositionArray = [
            [2, 4, 6, 9.5],
            [1, 3, 5, 7, 9],
            [0, 2, 4, 6, 8],
            [1, 3, 5, 7, 9],
            [2, 4, 6, 9.5],
        ];
        if (!this.initialized) {
            this.initialized = true;

            let fishCount = fishPositionArray.flat().length;
            for (let i = 0; i < fishCount; i++) {
                let fish = new GrouperFish(this.x, this.y, this.layer, []);
                this.layer.sprites.push(fish);
                this.fish.push(fish);
            }
        }

        let formation = "fish";
        if (formation == "fish") {
            let fishIndex = 0;
            for (let row = 0; row < fishPositionArray.length; row++) {
                for (let col = 0; col < fishPositionArray[row].length; col++) {
                    let targetX = fishPositionArray[row][col] * 10
                    let targetY = (row - 2) * 10;
                    let fish = this.fish[fishIndex];

                    fish.targetX = targetX + this.x + Math.sin(this.age / 30 + fishIndex) * 2;
                    fish.targetY = targetY + this.y + Math.cos(this.age / 30 - fishIndex) * 1;
                    // todo - rotate and bob around player for a few seconds, then create big boo ring?

                    fishIndex++;
                }   
            }
        }

    }

    GetFrameData(frameNum: number): FrameData {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["grouper"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 6,
                yOffset: 2
            };
        } else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 6,
                yOffset: 2
            };
        }
    }
}

class GrouperFish extends Enemy {
    public height: number = 8;
    public width: number = 18;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    targetX = 0;
    targetY = 0;

    Update(): void {
        this.ReactToWater();
        if (this.isInWater) {
            this.ApplyInertia();
            this.ReactToVerticalWind();
            
            let theta = Math.atan2(this.targetY - this.yMid, this.targetX - this.xMid);
            let targetSpeed = 0.75;
            let accel = 0.010;
            this.AccelerateHorizontally(accel, targetSpeed * Math.cos(theta));
            this.AccelerateVertically(accel, targetSpeed * Math.sin(theta));
            this.dx *= 0.97;
            this.dy *= 0.97;
        } else {
            this.ApplyGravity();
            if (this.isOnGround) {
                this.ReplaceWithSprite(new DeadEnemy(this));
            }
        }
        this.canBeBouncedOn = (player && !player.isInWater);
    }
    
    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }

    OnBounce(): void {
        this.ReplaceWithSprite(new DeadEnemy(this));
        this.OnDead();
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["grouper"][0][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: 6,
            yOffset: 2
        };
    }
}