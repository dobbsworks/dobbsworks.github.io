class PlayerGrapplePellet extends PlayerBullet {
    radius = 10;
    arePlatformsSolidFromBelow = true;

    Update() {
        player.grappleTarget = null;
        this.CheckExpiration();
        this.ApplyGravity(this.gravityScale);
        this.UpdatePosition();
        
        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Enemy) {
                if (touchingSprite instanceof BossShieldProjection) {
                    this.isActive = false;
                } else if (touchingSprite instanceof EnemyBullet) {
                    // Do nothing
                } else {
                    // grapple!
                    this.isActive = false;
                    this.GrappleObject(touchingSprite);
                }
            }
        }
        
        let touchedBorders = this.ReactToBorders(this.bounciness);
        if (touchedBorders[0]) {
            // grapple!
            this.isActive = false;
            this.GrapplePosition(touchedBorders[0]);
        }
    }

    GrapplePosition(border) {
        let xOffset = 0;
        let yOffset = this.radius;
        if (border instanceof LeftWall) xOffset -= this.radius;
        if (border instanceof RightWall) xOffset += this.radius;
        if (border instanceof Ceiling) yOffset -= this.radius + 5;
        this.GrappleObject({x: this.x + xOffset, y: this.y + yOffset});
    }

    GrappleObject(target) {
        if (player) {
            player.grappleTarget = target;
        }
    }

    OnBeforeDraw() {
        ctx.strokeStyle = `rgba(255,128,50,0.5)`;
        renderer.Line(this.x, this.y, player.x, player.y);
    }

    GetFrameData() {
        return {
            tileset: tileset.pellets,
            frame: 4,
            xFlip: false,
        };
    }
}