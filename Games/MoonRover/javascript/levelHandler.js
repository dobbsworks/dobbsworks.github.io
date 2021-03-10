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


    levels = [
        { name: "Impact Crater", color: "#212" },
        { name: "Mining Site", color: "#343" },
        { name: "Biodome", color: "#121" },
        { name: "Transit Tube", color: "#112" },
        { name: "Scrap Site", color: "#211" },
    ]

    Update() {
        if (this.isArena) {
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
                    shopHandler.EnterShop();
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

    EnterLevel() {
        this.levelIntroTimer = 90;
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
            player.x = 750;
            player.y = 250;
        } else if (this.currentZone === 3) {
            this.room = this.GetChasm();
        } else if (this.currentZone === 5) {
            this.room = this.GetLair();
        }

        borders = this.room.borders;
        let enemies = this.room.sprites;
        enemies = enemies.filter(e => Math.abs(e.x - player.x) > 300 || Math.abs(e.y - player.y) > 300);
        sprites = [player, ...enemies];
        if (this.currentZone === 5) sprites.push(new BossCore(this.room.width / 2, this.room.height / 3));
        renderer.target = player;

    }

    AreAllEnemiesDefeated() {
        return sprites.filter(x => x instanceof Enemy).length === 0;
    }

    GetCorridor() {
        this.isArena = false;
        return new RoomGenerator().CreateCorridor(10000, 700);
    }

    GetChasm() {
        this.isArena = false;
        return new RoomGenerator().CreateCorridor(1500, 7000);
    }

    GetArena() {
        this.isArena = true;
        return new RoomGenerator().CreateArenaRoom(1500, 1000);
    }

    GetLair() {
        this.isArena = true;
        return new RoomGenerator().CreateArenaRoom(1500, 1000);
    }

    GetLevelNumber() {
        return this.currentLevel + "-" + this.currentZone;
    }
}