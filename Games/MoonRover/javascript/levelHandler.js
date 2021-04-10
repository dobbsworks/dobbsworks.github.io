class LevelHandler {

    // [-----------------level----------------]
    // [--zone--][--zone--][--zone--][--boss--]

    currentLevel = 0;
    currentZone = 0;
    isArena = false;
    room = null;
    //currentMusic = "music-level-1"
    levelIntroTimer = 0;
    levelOutroTimer = 0;
    levelTimer = 0;


    levels = [
        { name: "Impact Crater", color: "#212" },
        { name: "Mining Site", color: "#343" },
        { name: "Biodome", color: "#121" },
        { name: "Transit Tube", color: "#112" },
        { name: "Scrap Site", color: "#211" },
    ]

    Update() {
        this.levelTimer++;
        if (this.isArena) {
            this.CheckBossDefeat();
            let exit = sprites.find(x => x instanceof LevelExit);
            if (!exit && this.AreAllEnemiesDefeated()) {
                let offset = levelHandler.room.width / 2;
                exit = new LevelExit(offset, levelHandler.room.height + offset);
                sprites.push(exit);
            }
        }
    }

    GetLevelColor() {
        let levelNum = this.currentLevel - 1;
        if (shopHandler.isInShop && shopHandler.fadeOutTimer > 0 && this.currentZone >= 5) {
            // exiting shop into new level
            levelNum++;
        }
        return this.levels[levelNum].color;
    }

    DrawSwoops(ratio) {
        let swoopColor = this.GetLevelColor();
        //if (shopHandler.isInShop) swoopColor = "#020a2e";
        ratio = Math.max(0, Math.min(1, ratio));
        let swoopyCount = 5;
        let swoopyHeight = canvas.height / swoopyCount;
        for (let swoopyIndex = 0; swoopyIndex < swoopyCount; swoopyIndex++) {
            ctx.fillStyle = swoopColor;
            let dir = swoopyIndex % 2 ? -1 : 1;
            let x = canvas.width * (ratio ** 4) * dir;
            ctx.fillRect(x, swoopyHeight * swoopyIndex, canvas.width, swoopyHeight + 1)
        }
    }

    DrawTitle(ratio, text) {
        ratio = Math.max(0, Math.min(1, ratio));
        ctx.font = "italic 46px Arial";
        ctx.textAlign = "center";
        let opacity = Math.floor((1 - ratio) * 15).toString("16");
        ctx.fillStyle = "#FFF" + opacity;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    DrawLevelTransition() {
        if (this.levelIntroTimer <= 0 && this.levelOutroTimer <= 0) return;

        if (this.levelIntroTimer > 0) {
            let ratio = 1 - this.levelIntroTimer / 60;
            this.DrawSwoops(ratio);
            this.DrawTitle(ratio, this.GetLevelName());
            this.levelIntroTimer--;
        }
        if (this.levelOutroTimer > 0) {
            let ratio = this.levelOutroTimer / 60;
            this.DrawSwoops(ratio);
            this.levelOutroTimer--;

            if (this.levelOutroTimer <= 0) {
                if (levelHandler.currentZone === 2 || levelHandler.currentZone === 5) {
                    if (levelHandler.currentLevel === 5) {
                        // VICTORY!
                        achievementHandler.lifetimeRunCompletes++;
                        if (achievementHandler.completeRunCharacters.indexOf(currentCharacter.name) == -1) {
                            achievementHandler.completeRunCharacters.push(currentCharacter.name)
                        }
                        mainMenuHandler.ReturnToMainMenu();
                        mainMenuHandler.OnClickCredits();
                    } else {
                        shopHandler.EnterShop();
                    }
                } else {
                    levelHandler.LoadZone();
                }
            }
        }
    }

    ExitLevel() {
        this.levelOutroTimer = 90;
        //this.levelIntroTimer = 90;
    }

    GetLevelName() {
        if (shopHandler.isInShop) return "";
        let baseName = this.levels[this.currentLevel - 1].name;
        let ret = baseName + " " + this.currentZone;
        return ret;
    }

    SetLevelMusic() {
        let musicName = "music-level-" + this.currentLevel;
        audioHandler.SetBackgroundMusic(musicName);
    }

    GetCurrentLootMultiplier() {
        // loot drops are scaled down over time
        // 0-----30s----60s-----90s-----120s
        // x1----x1-----x0.7----x0.4----x0.1
        let sec = 60;
        if (this.levelTimer < 30 * sec) return 1;
        if (this.levelTimer > 120 * sec) return 0.1;
        return 1.3 - this.levelTimer / (100 * sec);
    }

    EnterLevel() {
        this.levelIntroTimer = 90;
        this.levelTimer = 0;
    }

    LoadZone() {
        if (this.currentLevel === 0) {
            this.currentLevel = 1;
        }
        this.EnterLevel();

        // resets all sprites, walls, etc.

        this.currentZone++;

        if (this.currentZone > 5) {
            this.currentZone = 1;
            this.currentLevel++;
        }
        this.SetLevelMusic();

        let oldHp = player.hp;
        player = new Player(300, 300);
        player.hp = oldHp;

        if (this.currentZone === 1) {
            this.room = this.GetCorridor();
        } else if (this.currentZone === 2 || this.currentZone === 4) {
            this.room = this.GetArena();
            player.x = this.room.width/2;
            player.y = 125;
        } else if (this.currentZone === 3) {
            this.room = this.GetChasm();
        } else if (this.currentZone === 5) {
            this.room = this.GetLair();
            player.x = this.room.width/2;
            player.y = this.room.height;
        }

        borders = this.room.borders;
        let enemies = this.room.sprites;
        enemies = enemies.filter(e => Math.abs(e.x - player.x) > 300 || Math.abs(e.y - player.y) > 300);
        sprites = [player, ...enemies];
        if (this.currentZone === 5) {
            let bossType = [
                BossBodyPlate,
                BossBodyLaser,
                BossBodyMissile,
                BossBodyBlaster,
                BossBodyFinal,
            ][this.currentLevel-1]
            sprites.push(new bossType(this.room.width / 2, this.room.height / 3));
        }
        renderer.target = player;

    }

    AreAllEnemiesDefeated() {
        return sprites.filter(x => x instanceof Enemy).length === 0;
    }

    CheckBossDefeat() {
        let isThisBoss = sprites.some(x => x instanceof BossPartBase)
        if (isThisBoss) {
            let isBossDefeated = !sprites.some(x => x.bossWeapon) ||
                !sprites.some(x => x instanceof BossCoreBase);
            if (isBossDefeated) {
                let totalLoot = 10 * levelHandler.currentLevel + 10;
                let toDestroy = sprites.filter(x => x instanceof BossPartBase);
                let avgLootPer = Math.floor(totalLoot / toDestroy.length);

                for (let part of toDestroy) {
                    part.hp = 0;
                    part.loot = avgLootPer;
                    totalLoot -= avgLootPer;
                }
                // remainder loot
                toDestroy[0].loot += totalLoot;
            }
        }
    }

    GetCorridor() {
        this.isArena = false;
        let height = 700 + 100 * (this.currentLevel - 1);
        return new RoomGenerator().CreateCorridor(10000, height);
    }

    GetChasm() {
        this.isArena = false;
        let width = 1500 + 200 * (this.currentLevel - 1);
        return new RoomGenerator().CreateCorridor(width, 7000);
    }

    GetArena() {
        this.isArena = true;
        return new RoomGenerator().CreateArenaRoom(1500, 1000, true);
    }

    GetLair() {
        this.isArena = true;
        let room = new RoomGenerator().CreateArenaRoom(1500, 600, false);
        room.borders = room.borders.filter(x => !(x instanceof Platform));
        return room;
    }

    GetLevelNumber() {
        return this.currentLevel + "-" + this.currentZone;
    }
}