

var tileDirectory = {
    "@": { name: "South Pole", isUnique: true, tiles: [GroundTile, SouthPole] },
    "H": { name: "Player Start", isUnique: true, tiles: [GroundTile, Hat] },
    "-": { name: "Ground", isUnique: false, tiles: [GroundTile] },
    " ": { name: "Water", isUnique: false, tiles: [] },
    "#": { name: "Wall", isUnique: false, tiles: [GroundTile, SnowWall] },
    "8": { name: "Snowman", isUnique: false, tiles: [GroundTile, Snowman] },
    "$": { name: "Snowbank", isUnique: false, tiles: [GroundTile, SnowBank] },
};

var currentScenario = null;
var currentScenarioBackup = null;
function LoadScenario(scenario) {
    currentScenario = scenario;
    currentScenarioBackup = JSON.parse(JSON.stringify(scenario));

    LoadScenarioTerrain(scenario.layout);

    navMesh = new NavMesh();
}

function RestartScenario() {
    LoadScenario(currentScenarioBackup);
}

function LoadScenarioTerrain(layout) {
    sprites = [];
    let rows = layout.split('\n');
    // remove blanks from beginning and end
    // while (rows.length > 0 && rows[0].trim().length == 0) {
    //     rows.shift();
    // }
    // while (rows.length > 0 && rows[rows.length - 1].trim().length == 0) {
    //     rows.pop();
    // }

    let maxX = Math.max(...rows.map(a => a.length));
    let maxY = rows.length;
    let xOffset = -Math.floor(maxX / 2);
    let yOffset = -Math.floor(maxY / 2);

    for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
            let char = rows[y][x];
            let tilesToBuild = (tileDirectory[char] || {}).tiles || [];
            for (let tileToBuild of tilesToBuild) {
                sprites.push(new tileToBuild(x + xOffset, y + yOffset));
            }
        }
    }
}

function OnScenarioWin() {
    uiHandler.elements = [];
    currentScenario = null;
    sprites = [];

    let mainMenu = uiHandler.Button("You win! Return to Main Menu", {
        centerX: canvas.width / 2,
        y: 400,
        width: 350,
        height: 100
    }, () => { new MainMenu().LoadMainMenu() });
}

function OnScenarioLose() {
    uiHandler.elements = [];
    currentScenario = null;
    sprites = [];

    let mainMenu = uiHandler.Button("Return to Main Menu", {
        left: canvas.width / 2 + 25,
        y: 400,
        width: 350,
        height: 100
    }, () => { new MainMenu().LoadMainMenu() });

    let retryButton = uiHandler.Button("You lose! Retry?", {
        right: canvas.width / 2 - 25,
        y: 400,
        width: 350,
        height: 100
    }, () => {
        uiHandler.elements = [];
        RestartScenario()
    });
}

function ScenarioUpdate() {
    if (!currentScenario) return;

    let southPole = sprites.find(a => a instanceof SouthPole);
    if (southPole) {
        if (southPole.hp <= 0) {
            this.OnScenarioLose();
            return;
        }
    }

    let currentWave = currentScenario.waves[0];
    if (!currentWave) {
        // no more waves to process, watch for all enemeies dead
        let enemies = sprites.filter(a => a instanceof Enemy);
        if (enemies.length) {
            // keep waiting
            return;
        } else {
            OnScenarioWin();
            return; // scenario complete!
        }
    }
    if (!currentWave.timer) currentWave.timer = 0;

    let framesPerSpawn = 20;

    for (let spawn of currentWave.spawns) {
        if (!spawn.spawnedSoFar) {
            spawn.spawnedSoFar = 0;
        }

        let spawnPoint = spawn.spawnPoint;

        let spawnFreq = spawn.spawnSpeedRatio || 1;
        let targetSpawnCount = Math.min(spawn.count, Math.floor(currentWave.timer / framesPerSpawn * spawnFreq));
        while (spawn.spawnedSoFar < targetSpawnCount) {
            let enemyClass = enemyClasses[spawn.enemy];
            let sprite = new enemyClass(spawnPoint.x, spawnPoint.y);
            sprites.push(sprite);
            spawn.spawnedSoFar++;
        }
    }

    let areSpawnsComplete = currentWave.spawns.every(s => {
        return s.count <= s.spawnedSoFar;
    });

    if (areSpawnsComplete) {
        let delay = currentWave.delay || 0;
        if (!currentWave.delayWaited) currentWave.delayWaited = 0;

        let currentPause = (currentWave.delayWaited / framesPerSpawn);
        if (currentPause >= delay) {
            // wave complete!
            currentScenario.waves.shift();
        }

        currentWave.delayWaited++;
    }



    currentWave.timer++;
}

function ScenarioDraw() {
    if (!currentScenario) return;
    let currentWave = currentScenario.waves[0];
    if (!currentWave) return;
    if (currentWave.timer < 180) {
        ctx.fillStyle = "#dbfff3";
        ctx.strokeStyle = "#3a3c86";
        ctx.textAlign = "center";
        ctx.font = "16pt Courier";
        ctx.lineWidth = 4;
        ctx.strokeText(currentWave.name, canvas.width / 2, 500);
        ctx.fillText(currentWave.name, canvas.width / 2, 500);
    }
}