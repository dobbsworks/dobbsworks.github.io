
class BossPartBase extends Enemy {
    loot = 0;
    isCoreActive = true;
    BossPartUpdate() {
        if (!this.isCoreActive) this.ApplyGravity();
        this.UpdatePosition();
        if (!this.isCoreActive) this.ReactToBorders();
    }
}

class BossCoreBase extends BossPartBase {
    stationary = true;
    color = "#A00";
    maxHp = 5;
    orbitRadius = 200;
    orbitSpeed = 100;
    orbitOffset = 0;
    timer = 0;
    children = [];

    Initialize() {
        let radPerChild = Math.PI * 2 / this.childNodes.length;
        for (let i = 0; i < this.childNodes.length; i++) {
            let childClass = this.childNodes[i];
            let child = new childClass(0,0);
            if (child instanceof BossShield) {
                child.shieldTimer = -(this.orbitOffset / (2 * Math.PI) * 300) % 300
            }
            this.children.push(child);
            if (child instanceof BossCoreBase) {
                child.orbitSpeed += this.orbitSpeed;
                child.orbitOffset += this.orbitOffset + radPerChild * i;
            }
            sprites.push(child);
            child.x = this.x + this.orbitRadius * Math.cos(radPerChild * i);
            child.y = this.y + this.orbitRadius * Math.sin(radPerChild * i);
        }
    }
    Update() {
        this.timer++;
        this.BossPartUpdate();
        let radPerChild = Math.PI * 2 / this.children.length;
        let radOffset = this.timer / 10000 * this.orbitSpeed + this.orbitOffset;
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            let targetX = this.x + this.orbitRadius * Math.cos(radPerChild * i + radOffset);
            let targetY = this.y + this.orbitRadius * Math.sin(radPerChild * i + radOffset);
            let targetDx = targetX - child.x;
            let targetDy = targetY - child.y;
            child.dx += (targetDx - child.dx)/10;
            child.dy += (targetDy - child.dy)/10;
            child.dx *= 0.9;
            child.dy *= 0.9;
        }
    }
    OnDeath() {
        for (let child of this.children) {
            child.isCoreActive = false;
            child.hp = 0;
        }
    }

    GetFrameData() {
        return {
            tileset: tileset.redcore,
            frame: this.AnimateByFrame(tileset.redcore),
            xFlip: this.direction > 0,
        };
    }
}


class BossOrbitPlating1 extends BossCoreBase {
    orbitRadius = 60;
    orbitSpeed = 100;
    childNodes = [
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
    ];
}
class BossOrbitPlating2 extends BossOrbitPlating1 {
    orbitRadius = 120;
    orbitSpeed = -50;
}
class BossOrbitPlating3 extends BossCoreBase {
    orbitRadius = 180;
    orbitSpeed = 150;
    childNodes = [
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
        BossPlating,
    ];
}


/******************
LASER BOSS
******************/
class BossBodyLaser extends BossCoreBase {
    orbitRadius = 0;
    orbitSpeed = 0;
    childNodes = [
        BossArmsLaser,
        BossOrbitPlating1,
        BossOrbitPlating2,
        BossLaserCannon
    ];
}
class BossArmsLaser extends BossCoreBase {
    orbitRadius = 500;
    orbitSpeed = 0;
    childNodes = [
        BossHandLaser,
        BossHandLaser,
    ];
}
class BossHandLaser extends BossCoreBase {
    orbitRadius = 80;
    orbitSpeed = 100;
    childNodes = [
        BossLaserCannon,
        BossLaserCannon,
        BossLaserCannon,
        BossLaserCannon,
    ];
}

/******************
MISSILE BOSS
******************/
class BossBodyMissile extends BossCoreBase {
    orbitRadius = 0;
    orbitSpeed = 0;
    childNodes = [
        BossArmsMissile,
        BossOrbitPlating1,
        BossOrbitPlating2,
        BossOrbitPlating3,
        BossMissileLauncher
    ];
}
class BossArmsMissile extends BossCoreBase {
    orbitRadius = 450;
    orbitSpeed = 0;
    childNodes = [
        BossHandMissile,
        BossHandMissile,
    ];
}
class BossHandMissile extends BossCoreBase {
    orbitRadius = 0;
    orbitSpeed = 0;
    childNodes = [
        BossMissileLauncher,
        BossShieldSmall
    ];
}
class BossShieldSmall extends BossCoreBase {
    orbitRadius = 80;
    orbitSpeed = 100;
    childNodes = [
        BossShield,
        BossShield,
        BossShield,
        BossShield,
    ];
}

/******************
BLASTER BOSS
******************/
class BossBodyBlaster extends BossCoreBase {
    orbitRadius = 0;
    orbitSpeed = 0;
    childNodes = [
        BossArmsBlaster,
        BossOrbitPlating2,
        BossOrbitPlating3,
        BossHandBlaster,
    ];
}
class BossArmsBlaster extends BossCoreBase {
    orbitRadius = 600;
    orbitSpeed = 50;
    childNodes = [
        BossHandBlaster,
        BossHandBlaster,
        BossHandBlaster,
        BossHandBlaster,
    ];
}
class BossHandBlaster extends BossCoreBase {
    orbitRadius = 100;
    orbitSpeed = 30;
    childNodes = [
        BossBlaster,
        BossBlaster,
        BossBlaster,
        BossBlaster,
    ];
}



/******************
PLATE BOSS
******************/

class BossBodyPlate extends BossCoreBase {
    orbitRadius = 0;
    orbitSpeed = 0;
    childNodes = [
        BossHandBlaster,
        BossShieldSmall,
        BossPlateWaveHolder,
    ];
}

class BossPlateWaveHolder extends BossCoreBase {
    orbitRadius = 0;
    orbitSpeed = 30;
    childNodes = [
        BossPlateWave1,
        BossPlateWave2,
        BossPlateWave3,
    ];
}

class BossPlateWave1 extends BossCoreBase {
    orbitRadius = 600;
    orbitSpeed = 0;
    childNodes = [
        BossPlateWall,
        BossPlateWall,
        BossPlateWall,
        BossPlateWall,
        BossPlateWall,
        BossPlateWall,
    ];
}

class BossPlateWave2 extends BossPlateWave1 {
    orbitRadius = 780;
}

class BossPlateWave3 extends BossPlateWave1 {
    orbitRadius = 420;
}

class BossPlateWall extends BossCoreBase {
    orbitRadius = 60;
    orbitSpeed = 0;
    childNodes = [
        BossPlating,
        BossPlating,
    ];
}



/******************
FINAL BOSS
******************/

class BossBodyFinal extends BossCoreBase {
    orbitRadius = 0;
    orbitSpeed = 0;
    childNodes = [
        BossArmsLaserFinal,
        BossHandBlaster,
        BossShieldLarge,
        BossFinalWaveHolder,
    ];
}
class BossFinalWaveHolder extends BossCoreBase {
    orbitRadius = 0;
    orbitSpeed = 30;
    childNodes = [
        BossPlateWave2,
    ];
    
}
class BossShieldLarge extends BossCoreBase {
    orbitRadius = 180;
    orbitSpeed = 100;
    childNodes = [
        BossShield,
        BossShield,
        BossShield,
        BossShield,
        BossShield,
        BossShield,
        BossShield,
        BossShield,
    ];
}

class BossArmsLaserFinal extends BossCoreBase {
    orbitRadius = 500;
    orbitSpeed = 0;
    childNodes = [
        BossHandLaserFinal,
        BossHandLaserFinal,
    ];
}
class BossHandLaserFinal extends BossCoreBase {
    orbitRadius = 80;
    orbitSpeed = 100;
    childNodes = [
        BossLaserCannon,
        BossLaserCannon,
        BossLaserCannon,
        BossLaserCannon,
        BossMissileLauncher,
    ];
}


// class BossCore extends BossCoreBase {
//     orbitRadius = 150;
//     orbitSpeed = 100;
//     childNodes = [
//         BossCore2,
//         BossCore2,
//         BossCore2, 
//         BossCore2, 
//         BossCore2, 
//         BossCore2, 
//         BossCore2, 
//         BossCore2
//     ];
// }

// class BossCore2 extends BossCoreBase {
//     orbitRadius = 80;
//     orbitSpeed = 100;
//     orbitOffset = Math.PI / 2;
//     childNodes = [
//         BossPlating,
//         BossPlating,
//         BossShield,
//         BossLaserCannon,
//         BossMissileLauncher
//     ];
// }