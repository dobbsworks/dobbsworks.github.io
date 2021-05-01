class PlayerGrapplePellet extends PlayerBullet {
    radius = 10;

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
            this.GrapplePosition();
        }
    }

    GrapplePosition() {
        this.GrappleObject({x: this.x, y: this.y});
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