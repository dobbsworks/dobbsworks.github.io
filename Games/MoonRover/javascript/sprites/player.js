class Player extends Sprite {
    color = "blue";
    hp = 5;
    hurtTimer = 0;
    loot = 0;

    Update() {
        if (isMouseClicked()) {
            // weapon fired
            let xDif = this.x - mouseX;
            let yDif = this.y - mouseY;
            let theta = Math.atan2(yDif, xDif);

            let pushbackForce = 4;
            this.dx += pushbackForce * Math.cos(theta);
            this.dy += pushbackForce * Math.sin(theta);

            for (let a of [-0.1, 0, 0.1]) {
                let bullet = new PlayerBullet(this.x, this.y);
                bullet.dx = -pushbackForce * Math.cos(theta + a) * 4;
                bullet.dy = -pushbackForce * Math.sin(theta + a) * 4;
                sprites.push(bullet);
            }
        }
        this.ApplyGravity();
        this.UpdatePosition();
        this.ReactToBorders();

        let touchingSprites = this.GetTouchingSprites();
        for (let touchingSprite of touchingSprites) {
            if (this.hurtTimer === 0) {
                if (touchingSprite instanceof Enemy) {
                    this.hp -= 1;
                    if (this.hp <= 0) {
                        // you are dead, not big surprise
                        this.isActive = false;
                        setTimeout(() => {
                            sprites.push(new Player(0,0))
                        },1000)
                    } else {
                        this.hurtTimer = 60;
                    }
                }
            }
            if (touchingSprite instanceof Loot) {
                touchingSprite.isActive = false;
                this.loot += touchingSprite.value;
            }
        }
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
        }
    }

}