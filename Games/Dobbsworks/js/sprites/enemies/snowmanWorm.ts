class Snoworm extends Enemy {

    public height: number = 9;
    public width: number = 9;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    bodySegments: SnowmanWormBody[] = [];
    initialized = false;
    oldPositions: {x:number, y:number}[] = [];
    bounceTimer: number = 0;
    iframes: number = 0;
    numParts: number = 5;

    Initialize(): void {
        if (!this.initialized) {
            this.initialized = true;
            for (let i=0; i<this.numParts; i++) {
                let body = new SnowmanWormBody(this.x, this.y, this.layer, []);
                body.parent = this;
                body.childNumber = i + 1;
                this.bodySegments.push(body);
            }
            for (let i = this.bodySegments.length - 1; i >=0 ; i--) {
                this.layer.sprites.unshift(this.bodySegments[i]);
            }
        }
    }

    UpdateBodySegments(): void {
        if (this.iframes == 0) {
            this.oldPositions.push({x: this.x, y: this.y});
            if (this.oldPositions.length > 51) this.oldPositions.shift();
        }

        for (let i = 0; i < this.bodySegments.length; i++) {
            let body = this.bodySegments[i];
            let pos = this.oldPositions[i * 10];
            if (!pos) pos = this.oldPositions[this.oldPositions.length - 1];
            body.x = pos.x;
            body.y = pos.y;
        }
    }

    Update(): void {
        this.Initialize();
        if (!this.WaitForOnScreen()) return;
        this.UpdateBodySegments();

        this.GroundPatrol(0.3, true);
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();

        if (this.bounceTimer > 0) this.bounceTimer++;
        if (this.bounceTimer > 20) {
            this.isActive = false;
        }
        if (this.iframes > 0) this.iframes--;
    }
    
    OnBounce(): void {
        if (this.iframes > 0) return;
        let unbrokenBody = this.bodySegments.filter(a => a.bounceTimer == 0);
        let tail = unbrokenBody[0];
        if (tail) {
            tail.bounceTimer++;
            tail.canBeBouncedOn = false;
        } else {
            this.bounceTimer++;
            this.canBeBouncedOn = false;
        }
        this.iframes = 10;
    }

    GetFrameData(frameNum: number): FrameData {
        if (this.bounceTimer > 0) {
            let frame = Math.min(3, Math.floor(this.bounceTimer / 5));
            return {
                imageTile: tiles["snowman"][frame][1],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? 3 : 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["snowman"][1][0],
            xFlip: this.direction == 1,
            yFlip: false,
            xOffset: this.direction == 1 ? 3 : 0,
            yOffset: Math.sin(this.age / 10 + this.iframes/2) + 1
        };
    }
}

class SnowmanWormBody extends Enemy {
    public height: number = 9;
    public width: number = 9;
    respectsSolidTiles = true;
    canBeBouncedOn = true;
    bodySegments: any[] = [];
    initialized = false;
    bumpsEnemies: boolean = false;
    bounceTimer: number = 0;
    parent: Snoworm | null = null;
    childNumber = 0;

    Update(): void {
        if (!this.WaitForOnScreen()) return;
        if (this.bounceTimer > 0) this.bounceTimer++;
        if (this.bounceTimer > 20) {
            this.isActive = false;
        }
        if (!this.parent?.isActive) {
            let deadSprite = new DeadEnemy(this);
            this.layer.sprites.push(deadSprite);
            this.isActive = false;
        }
    }
    
    OnBounce(): void {
        if (this.parent) {
            this.parent.OnBounce();
        }
    }
    
    GetFrameData(frameNum: number): FrameData {
        if (this.bounceTimer > 0) {
            let frame = Math.min(3, Math.floor(this.bounceTimer / 5));
            return {
                imageTile: tiles["snowman"][frame][1],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        return {
            imageTile: tiles["snowman"][0][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: Math.sin(this.age / 10 + this.childNumber + (this.parent ? this.parent.iframes/2 : 0)) + 1
        };
    }
}

class BouncingSnowWorm extends Snoworm {

    leapWaitTimer = 0;

    Update(): void {
        this.Initialize();
        this.UpdateBodySegments();
        
        if (this.isTouchingLeftWall) this.direction = 1;
        if (this.isTouchingRightWall) this.direction = -1;
        if (this.isOnGround) this.leapWaitTimer++;

        if (this.leapWaitTimer > 60) {
            this.leapWaitTimer = 0;
            this.dy = -1.5;
            this.dx = this.direction * 1;
        }



        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();

        if (this.bounceTimer > 0) this.bounceTimer++;
        if (this.bounceTimer > 20) {
            this.isActive = false;
        }
        if (this.iframes > 0) this.iframes--;
    }
}