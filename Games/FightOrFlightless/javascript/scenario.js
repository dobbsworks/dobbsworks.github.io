
var sampleScenario = {
    waves: [
        {
            name: "Wave 1",
            announcement: "Here they come!",
            delay: 0,
            spawns: [
                {
                    enemy: "Penguin",
                    count: 16,
                    spawnPoint: { x: -10, y: 0 },
                    spawnSpeedRatio: 0.5
                }
            ]
        },
        {
            name: "Wave 2",
            announcement: "Incoming from the flank!",
            delay: 0,
            spawns: [
                {
                    enemy: "Penguin",
                    count: 8,
                    spawnPoint: { x: -10, y: 0 },
                },
                {
                    enemy: "Penguin",
                    count: 64,
                    spawnPoint: { x: 10, y: 0 },
                    spawnSpeedRatio: 2
                }
            ]
        },
        {
            name: "Rest",
            announcement: "Rebuild, quickly!",
            spawns: [],
            delay: 16
        },
        {
            name: "Wave 3",
            announcement: "Huge wave approaching from the iceberg!",
            delay: 0,
            spawns: [
                {
                    enemy: "Penguin",
                    count: 64,
                    spawnPoint: { x: -10, y: 0 },
                }
            ]
        },
    ],
    layout: `
 -------
----H----
-8#---#8-
-8#-@-#8-
-8#---#8-
---------
 ---$---
    `,
    rules: {
    //    "startingMoney": 0
    }
}

var tileDirectory = {
    "#": [GroundTile, SnowWall],
    "-": [GroundTile],
    "@": [GroundTile, SouthPole],
    "8": [GroundTile, Snowman],
    "H": [GroundTile, Hat],
    "$": [GroundTile, SnowBank],
};

var currentScenario = null;
function LoadScenario(scenario) {
    currentScenario = scenario;
    sprites = [];

    let rows = scenario.layout.split('\n');
    // remove blanks from beginning and end
    while (rows.length > 0 && rows[0].trim().length == 0) {
        rows.shift();
    }
    while (rows.length > 0 && rows[rows.length - 1].trim().length == 0) {
        rows.pop();
    }

    let maxX = Math.max(...rows.map(a => a.length));
    let maxY = rows.length;
    let xOffset = -Math.floor(maxX / 2);
    let yOffset = -Math.floor(maxY / 2);

    for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
            let char = rows[y][x];
            let tilesToBuild = tileDirectory[char] || [];
            for (let tileToBuild of tilesToBuild) {
                sprites.push(new tileToBuild(x + xOffset, y + yOffset));
            }
        }
    }

    navMesh = new NavMesh();
}

function ScenarioUpdate() {
    if (!currentScenario) return;

    let currentWave = currentScenario.waves[0];
    if (!currentWave) return; // scenario complete!
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
        ctx.strokeText(currentWave.name, canvas.width/2, 500);
        ctx.fillText(currentWave.name, canvas.width/2, 500);
    }
}