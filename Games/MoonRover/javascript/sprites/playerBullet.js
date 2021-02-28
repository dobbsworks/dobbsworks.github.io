class PlayerBullet extends Sprite {
    color = "cyan";
    radius = 5;
    damage = 1;
    knockback = 5;

    Update() {
        this.ApplyGravity();
        this.UpdatePosition();
        let touchedBorders = this.ReactToBorders();
        if (touchedBorders.length > 0) {
            this.isActive = false;
        }
        
        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Enemy && !(touchingSprite instanceof EnemyBullet)) {
                touchingSprite.hp -= this.damage;
                if (touchingSprite.hp >= 0) {
                    audioHandler.PlaySound("ow-01");
                    if (!(touchingSprite instanceof BossCore)) {
                        // TODO
                        // vector should be normalized to make grazing shots less forceful
                        let theta = Math.atan2(touchingSprite.y - this.y, touchingSprite.x - this.x);
                        touchingSprite.dx += this.knockback * Math.cos(theta);
                        touchingSprite.dy += this.knockback * Math.sin(theta);
                    }
                }
                this.isActive = false;
            }
        }
    }
}