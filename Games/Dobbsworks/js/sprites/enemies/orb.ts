class Orbbit extends Enemy {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;
    canBeBouncedOn = true;

    canSpinBounceOn: boolean = true;
    bumpsEnemies = false;

    frameCol = 0;
    connectedSprite: Sprite | null = null;
    protected connectionDistance: number = 0;
    private theta = -Math.PI / 2;

    Update(): void {
        if (!this.connectedSprite) {
            // search for sprite below
            let possibleConnectionSprites =
                this.layer.sprites.filter(a => a.x < this.xRight && a.xRight > this.x && a.yMid >= this.yBottom && !(a instanceof Player || a instanceof DeadEnemy));
            if (possibleConnectionSprites.length) {
                possibleConnectionSprites.sort((a, b) => a.y - b.y);

                let targetSprite = possibleConnectionSprites[0];
                // check for cyclical reference
                let iter = targetSprite;
                let circularRefFound = false;
                while (iter instanceof Orbbit) {
                    if (!iter.connectedSprite) break;
                    iter = iter.connectedSprite;
                    if (iter == this) {
                        circularRefFound = true;
                        break;
                    }
                }
                if (!circularRefFound) {
                    this.connectedSprite = targetSprite;
                    this.connectionDistance = Math.sqrt((this.connectedSprite.yMid - this.yMid) ** 2 + (this.connectedSprite.xMid - this.xMid) ** 2);
                    this.theta = Math.atan2(this.connectedSprite.yMid - this.yMid, this.connectedSprite.xMid - this.xMid);
                    console.log(this.theta)
                }

            }
        } else if (this.connectedSprite) {
            this.stackedOn = null;
            // theta change is based on orbit radius
            let deltaTheta = 1 / this.connectionDistance;
            this.theta += deltaTheta;
            let targetX = this.connectedSprite.xMid + this.connectionDistance * -Math.cos(this.theta);
            let targetY = (this.connectedSprite.yMid + this.connectionDistance * -Math.sin(this.theta));
            this.dx = targetX - this.xMid;
            this.dy = targetY - this.yMid;

            if (!this.connectedSprite.isActive) this.connectedSprite = null;
        }

        if (!this.connectedSprite) {
            this.dx = 0;
            this.dy = 0;
        }


    }

    OnBounce(): void {
        this.isActive = false;
        let deadSprite = new DeadEnemy(this);
        this.layer.sprites.push(deadSprite);
        this.OnDead();
    }

    OnSpinBounce(): void { this.ReplaceWithSpriteType(Poof); }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["orb"][this.frameCol][0],
            xFlip: false,
            yFlip: false,
            xOffset: 1,
            yOffset: 1
        };
    }

}

class Keplurk extends Orbbit {
    canBeBouncedOn = false;
    frameCol = 1;
    OnSpinBounce(): void { }
}