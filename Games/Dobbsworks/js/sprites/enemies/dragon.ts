class DabbleDragon extends Enemy {

    public height: number = 48;
    public width: number = 18;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    anchor = Direction.Down;
    resetX = 0;
    resetY = 0;
    killedByProjectiles = false;
    hurtTimer = 0;
    hits = 0;

    // health bar?
    // limit 1 per map?

    // script:
    // preview for direct:
    // slow pan across watery scene, shipwreck
    // dabble emerges from water
    // "You've been asking..."
    // rain sounds, dark sky
    // "Be careful what you wish for"
    // lightning illuminates dragon shape
    // Roar as cut to black
    // quick show-off of several smaller new features
    // minecart jumping/ducking
    // spring ring vertical climb
    // nimby
    // flip platform run
    // giant snowman chase
    // jumbo jelly swim
    // meteors? or just fire trigger section
    // 3d rendered dabble falling from balloon, explosions

    // enemy walking by, then peek out of barrel

    // avatars

    // pig snake
    // giant octopus? 
    // tentacle trigger
    // massive wallop

    // jellyfish
    // school of fish in the shape of a big fish
    // net to capture enemies and release them elsewhere?
    // seesaw platforms
    // throw bowling ball on other side, fling up
    // bathysphere-style air bubble
    // apple to eat?
    // bouncy flower platform - makes you spin jump
    // enemy door? Becomes a door once no enemies in range for ~5 seconds

    // phase 1
    // dragon screams from off-screen
    // large fire pillars in auto-scroll
    // have to navigate cave while dodging fire blasts from top and bottom, maybe also from sides?

    // phase 2, climbing the mountain, autoscroll
    // dragon swoops from sides
    // target player but limit based on camera
    // dots indicate path?
    // you can use dragon as platform for some jumps, but damages if you direct hit
    // definitely need to hide a heart up a chain

    // phase 3, top of the mountain
    // dragon lands on arena, screenshake
    // particle fire blasts, leaves fading fire terrain
    // dragon occasionally takes flight, leaves from top of screen, then does either a swoop or fire attack pattern

    // Dragon picks up an enemy with its tail and throws it
    // player has to watch for usable ammo enemies (snails)
    // (need a new enemy that can become ammo after being stomped)

    // After first hit, increase fireball speed, swoop speed

    // After second hit, loud roar shatters all breakable blocks on screen, reducing arena size

    // Third hit, falls off screen, death cry, player gets a key bubble




    // door, checkpoint

    // Ride dragon out of caves
    // Large platform, you can maneuver it up and down while standing on it, or you can jump
    // coin indicators

    // trigger for end of dragon ride, crash to ground
    // trigger final phase: big hands and head boss
    // falling rocks, 1 breaks into heavy stone
    // need to jump on hand, hit head with stone


    fireAimAngle = 0;
    fireballCount = 0;
    currentAttackPattern = 0;
    attackTimer = 0;
    backForthCycle: -1 | 1 = 1;
    swoopDirection: -1 | 1 = 1;
    heldItem: Enemy | null = null;
    // ATTACK PATTERNS
    // 0 - intro roar
    // 1 - Shuffle back and forth
    // 2 - rear back, 
    // 3 -     then spew fire to ground
    // 4 -     then spew fire to sky
    // 5 -     then spew fire to player
    // 6 - squat
    // 7 -     launch into sky
    // 8 - fly across screen
    // 9 - swoop over with item to throw
    // 10- landing, flap
    // 11- dying

    initialized = false;

    Update(): void {
        if (!this.WaitForOnScreen()) return;

        if (!this.initialized) {
            this.initialized = true;
            audioHandler.PlaySound("dragon-roar", false);
        }

        if (player) {
            this.direction = (player.xMid < this.xMid ? -1 : 1);
        }

        this.ApplyInertia();
        this.UpdateAttackPattern();
        this.AttackLogic();

        this.ReactToWater();
        this.ReactToVerticalWind();
        
        if (this.heldItem) {
            if (this.direction == 1) {
                this.heldItem.x = this.x - this.heldItem.width / 2 - 12;
            } else {
                this.heldItem.x = this.xRight - this.heldItem.width / 2 + 12;
            }
            this.heldItem.y = this.yBottom - this.heldItem.height - 5;
            this.heldItem.dx = this.dx;
            this.heldItem.dy = this.dy;
            this.heldItem.direction = this.direction;
        }

        if (this.hurtTimer > 0) {
            this.hurtTimer--;
        }
    }

    AttackLogic(): void {
        this.attackTimer++;
        let fireXOffset = 10;
        let fireYOffset = 10;
        var ignoreGravity = false;

        if (this.currentAttackPattern == 1) {
            if (player) this.direction = (player.xMid < this.xMid ? -1 : 1);
            this.AccelerateHorizontally(1, this.backForthCycle / 8);
        }
        if (this.currentAttackPattern == 2) {
            if (this.attackTimer == 1) {
                audioHandler.PlaySound("fire-charge-up", false);
            }
            let fireX = (this.direction == -1 ? (this.x - fireXOffset) : (this.xRight + fireXOffset)) - 3;
            let fireY = this.y + fireYOffset;
            if (this.attackTimer % 4 == 0) {
                let fire = new SingleFireBreath(fireX, fireY, this.layer, []);
                fire.dx = Random.random() / 2 - 0.25;
                fire.dy = Random.random() / 2 - 0.25;
                this.layer.sprites.push(fire);
            }
            if (player) this.fireAimAngle = Math.atan2(player.yMid - fireY, player.xMid - fireX);
        }

        if (this.currentAttackPattern == 3 || this.currentAttackPattern == 4 || this.currentAttackPattern == 5) {
            if (this.attackTimer == 1) {
                audioHandler.PlaySound("long-fire", false);
            }
        }

        if (this.currentAttackPattern == 3 || this.currentAttackPattern == 4) {
            if (this.currentAttackPattern == 4) {
                // fire rain
                this.fireAimAngle = -Math.PI/2;
                fireXOffset = 0;
                fireYOffset = 0;
                let freq = 35 - this.hits * 5;
                if (this.attackTimer % freq == 1 && player) {
                    let fire = new FireBall(player.x, player.y - 12 * 12, this.layer, []);
                    fire.dx = 0;
                    fire.dy = 1.5;
                    this.layer.sprites.push(fire);
                }
            }
            let fireSpeed = 2.0;
            let fire = new SingleFireBreath((this.direction == -1 ? (this.x - fireXOffset) : (this.xRight + fireXOffset)) - 3, this.y + fireYOffset, this.layer, []);
            fire.dx = fireSpeed * Math.cos(this.fireAimAngle);
            fire.dy = Random.random() / 2 - 0.25 + fireSpeed * Math.sin(this.fireAimAngle);
            this.layer.sprites.push(fire);
        }
        if (this.currentAttackPattern == 5) {
            // direct shot
            let freq = 50 - this.hits * 5;
            if (this.attackTimer % freq == 1) {
                let fireSpeed = 1.5;
                let fire = new FireBall((this.direction == -1 ? (this.x - fireXOffset) : (this.xRight + fireXOffset)) - 3, this.y + fireYOffset, this.layer, []);
                fire.dx = fireSpeed * Math.cos(this.fireAimAngle);
                fire.dy = fireSpeed * Math.sin(this.fireAimAngle);
                this.layer.sprites.push(fire);
                let fireX = (this.direction == -1 ? (this.x - fireXOffset) : (this.xRight + fireXOffset)) - 3;
                let fireY = this.y + fireYOffset;
                if (player) this.fireAimAngle = Math.atan2(player.yMid - fireY, player.xMid - fireX);
            }
        }
        if (this.currentAttackPattern == 6) {
        }
        if (this.currentAttackPattern == 7) {
            this.AccelerateVertically(0.2, -2);
        }
        if (this.currentAttackPattern == 8) {
            this.dy = 0;
            this.dx = 0;
            ignoreGravity = true;
            if (player && this.attackTimer % 120 == 5 && this.attackTimer < 400) {
                this.swoopDirection *= -1;
                let x = this.swoopDirection == 1 ? (camera.GetLeftCameraEdge() - 130) : (camera.GetRightCameraEdge() + 30);
                let swoop = new DragonSwoop(x, player.y, this.layer, []);
                swoop.pauseTimer = 60 - this.hits * 15;
                this.layer.sprites.push(swoop);
            }
        }
        if (this.currentAttackPattern == 9) {
            ignoreGravity = true;
            if (player) {
                let playerDir = (player.xMid < this.xMid) ? -1 : 1;
                let targetY = this.resetY - 24 + Math.sin(this.attackTimer / 10) * 5;
                let targetYSpeed = (targetY < this.y) ? -1 : 1;
                this.AccelerateHorizontally(0.01, playerDir * 2);
                this.AccelerateVertically(0.05, targetYSpeed);
                this.dy *= 0.98;

                if (this.attackTimer == 240 && this.heldItem) {
                    this.heldItem.dx = playerDir;
                    this.heldItem.dy = 1;
                    this.heldItem = null;
                    audioHandler.PlaySound("throw", false);
                }
            }
        }
        if (this.currentAttackPattern == 10) {
            ignoreGravity = true;
            let targetX = this.resetX;
            let targetY = this.resetY - 24 + Math.sin(this.attackTimer / 10) * 5;
            let targetXSpeed = (targetX < this.x) ? -1 : 1;
            let targetYSpeed = (targetY < this.y) ? -1 : 1;
            this.AccelerateHorizontally(0.05, targetXSpeed);
            this.AccelerateVertically(0.05, targetYSpeed);
            this.dx *= 0.98;
            this.dy *= 0.98;
        }
        if (this.currentAttackPattern == 11) {
            ignoreGravity = true;
            if (this.attackTimer == 1) {
                this.dy = -2;
                this.dx = 0.5;
                this.respectsSolidTiles = false;
                this.OnDead();
            }
            if (this.attackTimer % 3 == 0) {
                let fireX = this.x + Math.random() * this.width - 3;
                let fireY = this.y + Math.random() * this.height - 3;
                let fire = new SingleFireBreath(fireX, fireY, this.layer, []);
                fire.hurtsPlayer = false;
                this.layer.sprites.push(fire);
            }
            if (!this.IsOnScreen()) {
                this.isActive = false;
                camera.shakeTimerY = 25;
            }
            this.AccelerateVertically(0.04, 2);
        }

        if (!ignoreGravity) this.ApplyGravity();
    }

    UpdateAttackPattern(): void {
        var newAttackPattern = this.currentAttackPattern;
        if (this.currentAttackPattern == 0 && this.attackTimer > 60) {
            newAttackPattern = 1;
            this.resetX = this.x;
            this.resetY = this.y;
        }
        if (this.currentAttackPattern == 1 && this.attackTimer > 60) { 
            newAttackPattern = 2; 
            this.dx = 0; 
            if (this.fireballCount >= 3) {
                newAttackPattern = 6;
                this.fireballCount = 0;
            }
        }
        if (this.currentAttackPattern == 2 && this.attackTimer > 60) {
            this.fireballCount++;
            newAttackPattern = 3;
            if (player && Math.abs(player.xMid - this.xMid) > 72) {
                newAttackPattern = 5; // direct fire blast
            }
            if (Random.random() < 0.35) {
                newAttackPattern = 4; // air fire blast
            }
        }
        if (this.currentAttackPattern == 3 && this.attackTimer > 60) newAttackPattern = 1;
        if (this.currentAttackPattern == 4 && this.attackTimer > 120) newAttackPattern = 1;
        if (this.currentAttackPattern == 5 && this.attackTimer > 120) newAttackPattern = 1;
        if (this.currentAttackPattern == 6 && this.attackTimer > 96) {
            newAttackPattern = 7;
            for (let i = 0; i < 10; i++) {
                let cloudBit = new CloudBit(this.xMid, this.yBottom, this.layer, []);
                cloudBit.dx = (Math.random() - 0.5) * 3;
                cloudBit.dy = (Math.random() - 0.5) / 1;
                this.layer.sprites.push(cloudBit);
            }
        }
        if (this.currentAttackPattern == 7 && this.attackTimer > 60 && this.yBottom < camera.GetTopCameraEdge()) {
            newAttackPattern = 8;
            this.damagesPlayer = false;
        }
        if (this.currentAttackPattern == 8 && this.attackTimer > 600) {
            newAttackPattern = 9;
            this.damagesPlayer = true;
            let enemyType = this.hits <= 1 ? Snail : Taptop;
            let spr = new enemyType(this.x, this.y, this.layer, []);
            this.layer.sprites.push(spr);
            this.heldItem = spr;
        }
        if (this.currentAttackPattern == 9 && this.attackTimer > 260) {
            newAttackPattern = 10;
        }
        if (this.currentAttackPattern == 10 && this.attackTimer > 200) {
            newAttackPattern = 0;
        }

        if (newAttackPattern != this.currentAttackPattern) {
            this.currentAttackPattern = newAttackPattern;
            this.attackTimer = 0;

            if (newAttackPattern == 1) {
                this.backForthCycle *= -1;
            }
        }
    }

    DestroyCrackedWalls(): void {
        let xPixelLeft = camera.GetLeftCameraEdge();
        let xPixelRight = camera.GetRightCameraEdge();
        let yPixelTop = camera.GetTopCameraEdge();
        let yPixelBottom = camera.GetBottomCameraEdge();

        for (let x = xPixelLeft + 1; x < xPixelRight; x += 12) {
            for (let y = yPixelTop + 1; y < yPixelBottom; y += 12) {
                let tile = this.layer.GetTileByPixel(x, y);
                let wireTile = tile.GetWireNeighbor();
                if (wireTile && wireTile.tileType == TileType.Cracks) {
                    this.layer.map?.wireLayer.SetTile(tile.tileX, tile.tileY, TileType.Air);
                    this.layer.ExplodeTile(tile);
                }
            }
        }
    }

    OnHitByProjectile = (enemy: Enemy, projectile: Sprite) => {
        if (this.hurtTimer <= 0) {
            this.hurtTimer = 60;
            projectile.isActive = false;
            this.hits++;

            if (this.hits == 2) {
                this.DestroyCrackedWalls();
            }

            if (this.hits >= 3) {
                this.currentAttackPattern = 11;
                this.attackTimer = 0;
                this.damagesPlayer = false;
                this.hurtTimer = 6000;
                audioHandler.PlaySound("dragon-defeat", false);
            } else {
                audioHandler.PlaySound("dragon-roar", false);
            }
        }
    }


    GetThumbnail(): ImageTile {
        return tiles["body"][0][0];
    }

    oldFlapFrame = -1;
    GetFrameData(frameNum: number): FrameData[] {
        if (this.currentAttackPattern == 8) return [];

        var hurtOffset = Math.floor(this.hurtTimer / 4) % 2;

        var flapFrames = [0, 1, 2, 3, 4, 5, 5, 5, 5, 4, 4, 4, 3, 3, 2, 2, 1, 1]
        var flapFrame = flapFrames[(Math.floor(this.age / 4)) % flapFrames.length];

        var backLegVertOffset = 0;
        var frontLegVertOffset = 0;
        var armVertOffset = 0;
        var wingVertOffset = 0;
        let bodyVertOffset = 0;

        let armFrame = 0;
        let bodyFrame = 0;
        let legFrame = 0;

        if (this.currentAttackPattern == 1) {
            backLegVertOffset = (this.attackTimer % 60 < 30 ? 1 : 0);
            frontLegVertOffset = (this.attackTimer % 60 < 30 ? 0 : 1);
            armVertOffset = Math.sin(this.attackTimer / 20) / 2;
            wingVertOffset = -Math.sin(this.attackTimer / 20) / 4;
            flapFrame = 3;
        }
        if (this.currentAttackPattern == 2) {
            armFrame = 1;
        }
        if (this.currentAttackPattern == 4) {
            bodyFrame = 1;
        }
        if (this.currentAttackPattern == 6) {
            bodyFrame = 1;
            legFrame = 1;
            bodyVertOffset = -3;
            armVertOffset = -1;
            wingVertOffset = -3;
        }
        if (this.currentAttackPattern == 7) {
            bodyFrame = 1;
            flapFrame = 6;
            armVertOffset = -2;
            wingVertOffset = -24;
        }
        if (this.currentAttackPattern == 11) {
            flapFrame = 0;
        }

        if (!this.isOnGround) {
            backLegVertOffset = -1;
            frontLegVertOffset = -4;
            legFrame = 2;
        }
        if (this.oldFlapFrame != flapFrame && (flapFrame == 5 || flapFrame == 6)) {
            audioHandler.PlaySound("wing-flap", false);
        }

        this.oldFlapFrame = flapFrame;
        return [
            {
                imageTile: tiles["wings"][hurtOffset][flapFrame],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? 48 : 60,
                yOffset: 37 + wingVertOffset
            },
            {
                imageTile: tiles["legs"][hurtOffset*2][legFrame],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? -10 : 3,
                yOffset: -28 + backLegVertOffset
            },
            {
                imageTile: tiles["arms"][hurtOffset*2][armFrame],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? -13 : 6,
                yOffset: -16 + armVertOffset
            },
            {
                imageTile: tiles["body"][hurtOffset][bodyFrame],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? 15 : 10,
                yOffset: 2 + bodyVertOffset
            },
            {
                imageTile: tiles["legs"][hurtOffset*2 + 1][legFrame],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? -1 : -8,
                yOffset: -28 + frontLegVertOffset
            },
            {
                imageTile: tiles["arms"][hurtOffset*2 + 1][armFrame],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? 0 : -2,
                yOffset: -16 + armVertOffset
            },
        ];
    }
}


class SingleFireBreath extends Hazard {
    public height: number = 6;
    public width: number = 6;
    public respectsSolidTiles: boolean = true;
    public hurtsPlayer = true;

    flip1 = Math.floor(Random.random() * 4);
    flip2 = Math.floor(Random.random() * 4);

    maxAge = Random.random() * 4 + 30;

    Update(): void {
        super.Update();

        if (this.age > this.maxAge) this.isActive = false;

        this.ApplyInertia();
        if (this.respectsSolidTiles) this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }

    IsHazardActive(): boolean {
        return this.hurtsPlayer;
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(10 * this.age / this.maxAge);
        if (frame >= 10) frame = 9;
        return {
            imageTile: tiles["fireBreath"][frame][0],
            xFlip: this.age % this.flip1 == 0,
            yFlip: this.age % this.flip2 == 0,
            xOffset: 3,
            yOffset: 3
        };
    }

}

class FireBall extends Sprite {
    public height: number = 6;
    public width: number = 6;
    public respectsSolidTiles = true;
    Update(): void {
        this.MoveByVelocity();
        if (this.standingOn.length > 0 || this.touchedLeftWalls.length > 0 || this.touchedRightWalls.length > 0 || this.touchedCeilings.length > 0) {
            this.isActive = false;
        }

        if (this.age % 4 == 0) {
            let fire = new SingleFireBreath(this.x, this.y, this.layer, []);
            fire.dx = Random.random() / 2 - 0.25;
            fire.dy = Random.random() / 2 - 0.25;
            this.layer.sprites.push(fire);
            fire.respectsSolidTiles = false;
            fire.maxAge = 20;
        }
    }
    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["fireBreath"][3][0],
            xFlip: false,
            yFlip: false,
            xOffset: 3,
            yOffset: 3
        };
    }

}