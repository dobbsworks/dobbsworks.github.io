class LevelHandler {

    // [-----------------level----------------]
    // [--zone--][--zone--][--zone--][--boss--]

    currentLevel = 1;
    currentZone = 0;
    isArena = false;
    room = null;

    Update() {
        if (this.isArena) {
            let exit = sprites.find(x => x instanceof LevelExit);
            if (!exit && this.AreAllEnemiesDefeated()) {
                exit = new LevelExit(player.x, player.y);
                sprites.push(exit);
            }
        }
    }

    LoadZone() {
        // resets all sprites, walls, etc.

        this.currentZone++;

        if (this.currentZone > 5) {
            this.currentZone = 1;
            this.currentLevel++;
        }

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
        if (this.currentZone === 5) sprites.push(new BossCore(700, 300));
        renderer.target = player;

    }

    AreAllEnemiesDefeated() {
        return sprites.filter(x => x instanceof Enemy).length === 0;
    }

    GetCorridor() {
        this.isArena = false;
        return new RoomGenerator().CreateCorridor(10000, 1500);
    }

    GetChasm() {
        this.isArena = false;
        return new RoomGenerator().CreateCorridor(1500, 10000);
    }

    GetArena() {
        this.isArena = true;
        return new RoomGenerator().CreateArenaRoom(1500, 1000);
    }

    GetLair() {
        this.isArena = true;
        return new RoomGenerator().CreateArenaRoom(3000, 3000);
    }

    GetLevelNumber() {
        return this.currentLevel + "-" + this.currentZone;
    }
}