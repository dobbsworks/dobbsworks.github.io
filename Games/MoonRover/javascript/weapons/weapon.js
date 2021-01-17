class Weapon {
    // weapon stats
    name = "Base Weapon"
    kickbackPower = 4;
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

    upgrades = [];

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

        player.dx += this.kickbackPower * Math.cos(theta);
        player.dy += this.kickbackPower * Math.sin(theta);

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
        bullet.dx += player.dx;
        bullet.dy += player.dy;
        bullet.damage = this.pelletDamage;
        sprites.push(bullet);
    }

    Update() {
        if (this.cooldownTimer > 0) this.cooldownTimer--;
        if (this.deployTimer > 0) this.deployTimer--;
    }

    GetAvailableUpgrades() {
        return this.upgrades.filter(x => !x.isActive).slice(0, 2);
    }

    ApplyUpgrade(upgradeIndex) {
        let upgrade = this.upgrades[upgradeIndex];
        if (upgrade && !upgrade.isActive) {
            upgrade.isActive = true;
            for (let change of upgrade.changes) {
                if (change.type === Upgrade.Type.add) {
                    this[change.prop] += change.delta;
                }
                if (change.type === Upgrade.Type.scale) {
                    this[change.prop] *= change.delta;
                }
            }
        }
    }
}