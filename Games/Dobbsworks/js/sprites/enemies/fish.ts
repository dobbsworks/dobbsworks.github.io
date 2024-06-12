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


// 1.11.2;12;0;1;3;0;0|#002c24,#124a1c,0.00,1.00,0.30;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0;#1358eccc;#5f23b8cc;#cf2f17ff|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP|AAsABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAA/AA/AA/AA/AA/AA/AA/AA5|AA/AAAABCAAIABCAAIABCAAIABCAAsABCAAIABCAAIABCAAIABCAA/AA/AA/AA/AA/AA/AA/AA/AAT|AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AA/AAP|AAAEAI;ABA3AI;CwALAF;A6AEAH;A6AEAG;A6AEAF
class Grouper extends Sprite {
    // creates school of fish when scrolled on screen

    public height: number = 8;
    public width: number = 18;
    respectsSolidTiles = true;
    public canMotorHold: boolean = false;
    initialized = false;
    fish: GrouperFish[] = [];
    formation= "fish";
    timer = 0;
    direction = 1;
    public canBeBouncedOn: boolean = false;

    GetThumbnail(): ImageTile {
        return tiles["grouper"][0][0];
    }

    GetFishCoordinates(): Pixel[] {
        let ret: Pixel[] = [];
        if (this.formation == "fish") {
            let fishPositionArray = [
                [2, 4, 6, 9.5],
                [1, 3, 5, 7, 9],
                [0, 2, 4, 6, 8],
                [1, 3, 5, 7, 9],
                [2, 4, 6, 9.5],
            ];
            let fishIndex = 0;
            for (let row = 0; row < fishPositionArray.length; row++) {
                for (let col = 0; col < fishPositionArray[row].length; col++) {
                    let targetX = fishPositionArray[row][col] * 10 + 48;
                    let targetY = (row - 2) * 10;
                    ret.push({xPixel: targetX, yPixel: targetY});
                    fishIndex++;
                }   
            }
        } else if (this.formation == "eat" || this.formation == "spin") {
            let theta = -(Math.PI * 2) / 360 * 120;
            let radius = 48;
            for (let fishIndex = 0; fishIndex < this.fish.length; fishIndex++) {
                let theta2 = theta;
                if (this.formation == "spin") {
                    theta2 += this.timer / 100 * 2;
                    let radiusRatio = (240 - this.timer) / 120;
                    radiusRatio = Math.min(1, Math.max(0.1, radiusRatio));
                    radius = 48 * radiusRatio;
                }
                let x = Math.cos(theta2) * radius;
                let y = Math.sin(theta2) * radius;
                ret.push({xPixel: x, yPixel: y});
                theta += (Math.PI * 2) / 360 * 12;
            }
        } 

        return ret;
    }

    LockOn(): void {
        if (player) {
            this.direction = player.xMid < this.xMid ? -1 : 1;
        }
    }

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        if (!this.initialized) {
            this.initialized = true;

            let fishCount = 23;
            for (let i = 0; i < fishCount; i++) {
                let fish = new GrouperFish(this.x, this.y, this.layer, []);
                this.layer.sprites.push(fish);
                this.fish.push(fish);
            }
            this.LockOn();
        }

        if (this.fish.every(a => !a.isActive)) {
            this.OnDead();
            this.isActive = false;
        }

        this.timer++;

        if (player && (this.formation == "fish" || this.formation == "eat")) {
            this.x = Utility.Lerp(this.x, player.xMid, 0.05);
            this.y = Utility.Lerp(this.y, player.yMid, 0.05);
        }

        if (this.formation == "fish" && this.timer > 360) {
            this.timer = 0;
            this.formation = "eat";
        } else if (this.formation == "eat" && this.timer > 180) {
            this.timer = 0;
            this.formation = "spin";
        } else if (this.formation == "spin" && this.timer > 300) {
            this.timer = 0;
            this.formation = "fish";
            this.LockOn();
        }

        let coords = this.GetFishCoordinates();
        let fishIndex = 0;
        for (let fish of this.fish) {
            let coord = coords.pop();
            if (coord) {
                fish.targetX = (coord.xPixel * this.direction * -1) + this.x + Math.sin(this.age / 30 + fishIndex) * 2;
                fish.targetY = coord.yPixel + this.y + Math.cos(this.age / 30 - fishIndex) * 1;
            }
            fishIndex++;
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
    respectsSolidTiles = false;
    canBeBouncedOn = false;
    targetX = 0;
    targetY = 0;

    Update(): void {
        this.ReactToWater();

        if (player) this.direction = (player.xMid < this.xMid) ? -1 : 1;

        if (this.isInWater) {
            this.ApplyInertia();
            this.ReactToVerticalWind();
            
            let theta = Math.atan2(this.targetY - this.yMid, this.targetX - this.xMid);
            let targetSpeed = 2.0;
            let accel = 0.035;
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