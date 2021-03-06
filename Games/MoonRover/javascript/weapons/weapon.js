class Weapon {

    // weapon stats
    name = "Base Weapon";
    fireSound = "pew-01";
    level = 1;
    isGold = false;
    kickbackPower = 4;
    knockbackPower = 4;
    pelletType = PlayerBullet;
    pelletCount = 1;
    pelletDamage = 1;
    pelletSpeed = 4;
    pelletGravityScale = 1;
    pelletSpread = Math.PI / 12;
    pelletDuration = Infinity;

    effectDuration = 60 * 1;

    pierce = 0; // number of extra enemy hits // TODO
    shieldDuration = 0;
    shieldDamageBonus = 0;
    get cooldownTime() {
        return 60 / this.fireRate;
    }
    fireRate = 2;
    deployTime = 10;
    get reloadTime() {
        return 60 / this.reloadSpeed;
    }
    canReload = true; // some weapons are limited use

    reloadSpeed = 4;
    holsterReloadRatio = 0;
    midAirReloadRatio = 0.15;
    fixedSpread = true;
    initialPelletDistance = 20;

    clipSize = 3;
    shotsRemaining = 0;
    maxBounces = 0;

    // grenade/bomb weapons
    triggeredWeapon = null;
    explodeOnEnemy = false;
    explodeOnWall = false;
    explodeOnExpire = false;

    // state
    cooldownTimer = 0;
    deployTimer = 0;
    reloadTimer = 0;


    cost = 10;
    upgrades = [];
    initialUpgrades = [];
    initialized = false;
    flavor = "A fantastic weapon that sadly has no flavor text";

    SwitchTo() {
        this.deployTimer = this.deployTime;
    }
    SwitchFrom() {
        if (!this.holsterReloadRatio) this.reloadTimer = 0;
    }

    OnFire() { return true; }
    OnPullTrigger() {  }

    PullTrigger() {
        //if (this.shotsRemaining > 0 || player.isOnGround) {
        this.reloadTimer = 0; // cancel current reload
        //}
        this.OnPullTrigger();
        if (this.cooldownTimer <= 0 && this.deployTimer <= 0) {
            if (this.shotsRemaining > 0) {
                let onFireSuccess = this.OnFire();
                if (onFireSuccess) {
                    if (this.follower) {
                        let followers = sprites.filter(a => a instanceof Follower);
                        for (let follower of followers) {
                            this.Fire(follower);
                        }
                        this.Fire(player);
                    } else {
                        this.Fire(player);
                    }
                    this.shotsRemaining--;
                } else {
                    // onFire failed (extra conditions for firing not met)
                    audioHandler.PlaySound("notify-05", true);
                }
            } else {
                audioHandler.PlaySound("notify-05", true);
            }
        }
    }

    GetBreakdownText() {
        let upgrades = [...this.initialUpgrades, ...this.upgrades.filter(a => a.isActive)];
        return upgrades.flatMap(x => x.GetBreakdownText()).join("\n");
    }

    GetSellPrice() {
        let upgradeCost = this.upgrades.filter(x => x.isActive).map(x => x.cost).reduce((a, b) => a + b, 0);
        return Math.floor((this.cost + upgradeCost) / 2);
    }

    Fire(source) {
        if (this.radarPing) {
            let ping = new RadarPing(source, this.radarPing, false);
            ping.color = "#FFFFFF04"
            ping.speed = 20;
            sprites.push(ping);
        } else {
            sprites.push(new RadarPing(source, 300, false));
        }
        audioHandler.PlaySound(this.fireSound);

        let theta = 0;
        if (source === player || source instanceof Follower) {
            let xDif = source.x - GetGameMouseX();
            let yDif = source.y - GetGameMouseY();

            theta = Math.atan2(yDif, xDif);
        } else {
            theta = Math.atan2(-source.dy, -source.dx);
        }

        let firstPelletAngle = - this.pelletSpread / 2;
        if (this.fixedSpread) {
            if (this.pelletCount === 1) firstPelletAngle = 0;
            let spreadBetweenPellets = this.pelletCount === 1 ? 0 : (this.pelletSpread / (this.pelletCount - 1));
            if (this.pelletSpread === Math.PI * 2) {
                spreadBetweenPellets = this.pelletSpread / this.pelletCount;
            }
            for (let i = 0; i < this.pelletCount; i++) {
                let angleDeviation = spreadBetweenPellets * i + firstPelletAngle;
                this.FireBullet(theta + angleDeviation, source);
            }
        } else {
            // random spread
            for (let i = 0; i < this.pelletCount; i++) {
                let angleDeviation = Math.random() * this.pelletSpread + firstPelletAngle;
                this.FireBullet(theta + angleDeviation, source);
            }
        }

        if (source === player) {
            let canKickback = (!currentCharacter || !currentCharacter.grappleOnly);
            if (canKickback) {
                player.dx += this.kickbackPower * Math.cos(theta);
                player.dy += this.kickbackPower * Math.sin(theta);
            }
        }

        this.cooldownTimer = this.cooldownTime;
    }

    OnNoAmmoFire() { } //override


    FireBullet(angle, source) {
        if (this.shieldDuration) {
            player.bubbleShieldTimer = this.shieldDuration;
            player.shieldDamageBonus = this.shieldDamageBonus;
        }
        if (!this.pelletType) return;
        let x = source.x - this.initialPelletDistance * Math.cos(angle);
        let y = source.y - this.initialPelletDistance * Math.sin(angle);
        let bullet = new this.pelletType(x, y);
        bullet.dx = -this.pelletSpeed * Math.cos(angle) * 4;
        bullet.dy = -this.pelletSpeed * Math.sin(angle) * 4;
        bullet.gravityScale = this.pelletGravityScale;
        if (source === player) {
            bullet.dx += player.dx;
            bullet.dy += player.dy;
        }
        bullet.damage = this.pelletDamage;
        bullet.knockback = this.knockbackPower;
        bullet.pierce = this.pierce;
        bullet.duration = this.pelletDuration;
        bullet.effectDuration = this.effectDuration;
        bullet.triggeredWeapon = this.triggeredWeapon;
        bullet.explodeOnEnemy = this.explodeOnEnemy;
        bullet.explodeOnWall = this.explodeOnWall;
        bullet.explodeOnExpire = this.explodeOnExpire;
        bullet.maxBounces = this.maxBounces;
        sprites.push(bullet);
    }

    Update(isHolstered) {
        if (this.cooldownTimer > 0) this.cooldownTimer--;
        if (this.deployTimer > 0) this.deployTimer--;

        let isPlayerOnGround = player && player.isOnGround;
        if (this.shotsRemaining < this.clipSize) {
            let reloadAmount = 1;
            if (isHolstered) reloadAmount *= this.holsterReloadRatio;

            if (currentCharacter && !currentCharacter.midAirReload) {
                if (!isPlayerOnGround) reloadAmount *= this.midAirReloadRatio;
            }
            if (this.canReload) this.reloadTimer += reloadAmount;

            while (this.reloadTimer >= this.reloadTime) {
                this.reloadTimer -= this.reloadTime;
                if (this.shotsRemaining < this.clipSize) {
                    this.shotsRemaining++;
                }
            }

            // just now hit capacity
            if (this.shotsRemaining === this.clipSize) {
                //audioHandler.PlaySound("notify-01");
            }
        }

    }

    GetAvailableUpgrades() {
        let upgradesAndSubUpgrades = this.GetAllUpgradesAndSubWeaponUpgrades();
        let activeUpgrades = upgradesAndSubUpgrades.filter(x => !x.isActive);
        return activeUpgrades.slice(0, 2);
    }

    GetAllUpgradesAndSubWeaponUpgrades() {
        let ret = this.upgrades;
        if (this.triggeredWeapon) ret.push(...this.triggeredWeapon.GetAllUpgradesAndSubWeaponUpgrades());
        return ret;
    }

    ApplyInitialUpgrades() {
        for (let upgrade of this.initialUpgrades) {
            this.ApplyUpgrade(upgrade);
        }
        this.shotsRemaining = this.clipSize;
        if (this.triggeredWeapon) {
            this.triggeredWeapon.ApplyInitialUpgrades();
        }
    }

    ApplyUpgrade(upgrade) {
        if (upgrade && !upgrade.isActive) {
            upgrade.isActive = true;
            for (let change of upgrade.changes) {
                if (change.type === Upgrade.Type.add) {
                    this[change.prop] += change.delta;
                }
                if (change.type === Upgrade.Type.scale) {
                    this[change.prop] *= (change.delta + 1);
                }
            }
        }
    }
    ApplyUpgradeByIndex(upgradeIndex) {
        let upgrade = this.upgrades[upgradeIndex];
        this.ApplyUpgrade(upgrade);
    }

    DoesWeaponHaveAllUpgradesApplied() {
        if (!this.canReload) return false;
        if (this.upgrades.some(a => !a.isActive)) return false;
        if (this.triggeredWeapon) {
            return this.triggeredWeapon.DoesWeaponHaveAllUpgradesApplied();
        } else {
            return true;
        }
    }

    GetDisplayName() {
        let name = this.name;
        if (this.level >= 2) name += " ★";
        if (this.level >= 3) name += "x" + (this.level - 1);
        return name;
    }
}