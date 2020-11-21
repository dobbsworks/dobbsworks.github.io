class Weapon {
    // weapon stats
    name = "Base Weapon"
    knockbackPower = 4;
    pelletType = PlayerBullet;
    pelletCount = 3;
    pelletDamage = 1;
    pelletSpeed = 4;
    pelletSpread = Math.PI/12;
    cooldownTime = 30;
    deployTime = 10;
    fixedSpread = true;

    maxShotsBeforeLanding = 3;
    shotsSinceLastLanding = 0;

    // state
    cooldownTimer = 0;
    deployTimer = 0;

    SwitchTo() {
        this.deployTimer = this.deployTime;
    }

    PullTrigger() {
        if (this.shotsSinceLastLanding >= this.maxShotsBeforeLanding) {
            return;
        }
        if (this.cooldownTimer <= 0 && this.deployTimer <= 0) {
            this.Fire();
            this.shotsSinceLastLanding++;
        }
    }

    Fire() {
        let xDif = player.x - GetGameMouseX();
        let yDif = player.y - GetGameMouseY();
        let theta = Math.atan2(yDif, xDif);

        player.dx += this.knockbackPower * Math.cos(theta);
        player.dy += this.knockbackPower * Math.sin(theta);

        let firstPelletAngle = - this.pelletSpread/2;
        if (this.fixedSpread) {
            if (this.pelletCount === 1) firstPelletAngle = 0;
            let spreadBetweenPellets = this.pelletSpread / this.pelletCount;
            for (let i=0; i<this.pelletCount; i++) {
                let angleDeviation = spreadBetweenPellets*i + firstPelletAngle;
                this.FireBullet(theta + angleDeviation);
            }
        } else {
            // random spread
            for (let i=0; i<this.pelletCount; i++) {
                let angleDeviation = Math.random() * this.pelletSpread + firstPelletAngle;
                this.FireBullet(theta + angleDeviation);
            }
        }

        this.cooldownTimer = this.cooldownTime;
    }


    FireBullet(angle) {
        let x = player.x;
        let y = player.y;
        let bullet = new this.pelletType(x, y);
        bullet.dx = -this.pelletSpeed * Math.cos(angle) * 4;
        bullet.dy = -this.pelletSpeed * Math.sin(angle) * 4;
        bullet.damage = this.pelletDamage;
        sprites.push(bullet);
    }

    Update() {
        if (this.cooldownTimer > 0) this.cooldownTimer--;
        if (this.deployTimer > 0) this.deployTimer--;
    }
}