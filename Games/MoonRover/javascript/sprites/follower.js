class Follower extends Sprite {

    leader = null;
    distance = 0;
    tempRecoil = 0;
    radius = 30;

    constructor(leader, distance) {
        super(leader.x - distance, leader.y);
        this.leader = leader;
        this.distance = distance;
    }

    Update() {
        let deltaX = this.leader.x - this.x;
        let deltaY = this.leader.y - this.y;
        let currentDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        let targetDistance = this.distance - this.tempRecoil;
        if (currentDistance > targetDistance) {
            let theta = Math.atan2(deltaY, deltaX);
            this.x = this.leader.x - targetDistance * Math.cos(theta);
            this.y = this.leader.y - targetDistance * Math.sin(theta);
        }

        let touchingSprites = this.GetTouchingSprites();
        let isHurt = false;
        for (let touchingSprite of touchingSprites) {
            if (touchingSprite instanceof Enemy) {
                this.tempRecoil += 2;
                isHurt = true;
                if (touchingSprite.shortedTimer > 0) {
                    // no damage
                } else if (player.hurtTimer === 0) {
                    player.hp -= 1;
                    player.hurtTimer = 60;
                    audioHandler.PlaySound("pow-03");
                    if (touchingSprite.x < this.x) {
                        player.dx = 2;
                    } else {
                        player.dx = -2;
                    }
                }
                if (touchingSprite instanceof EnemyBullet) {
                    touchingSprite.isActive = false;
                }
            }
            
            if (touchingSprite instanceof Loot) {
                touchingSprite.isActive = false;
                loot += touchingSprite.value;
                achievementHandler.lifetimeLoot += touchingSprite.value;
                audioHandler.PlaySound("powerup-03");
            }
        }
        if (!isHurt && player.hurtTimer === 0) {
            this.tempRecoil -= 1;
            if (this.tempRecoil <= 0) this.tempRecoil = 0;
        }
    }


    GetFrameData() {
        return {
            tileset: tileset.player,
            frame: 0,
            xFlip: false,
        };
    }

}