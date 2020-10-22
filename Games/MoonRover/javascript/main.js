var canvas;
var ctx;
var player = new Player(300, 300);
var sprites = [
    player,
    new EnemyWisper(400, 200)
];
var borders = [
    new Ceiling(25),
    new Floor(440),
    new LeftWall(100),
    new RightWall(600),
    new Platform(250, 450, 300),
];
var weaponHandler = new WeaponHandler();

var loot = 0;
var killCount = 0;
var deathCount = 0;
setTimeout(Initialize, 100);

function Initialize() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    InitMouseHandlers();
    weaponHandler.CreateInventoryBar();
    setInterval(MainLoop, 1000 / 60);
}

function MainLoop() {
    weaponHandler.Update();
    for (let sprite of sprites) {
        if (sprite.Initialize && !sprite.initialized) {
            sprite.Initialize();
            sprite.initialized = true;
        }
        sprite.oldX = sprite.x;
        sprite.oldY = sprite.y;
        sprite.frame++;
        sprite.Update();
    }
    sprites = sprites.filter(x => x.isActive);
    Draw();
    UpdateMouseChanged();
}

function Draw() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let border of borders) {
        border.Draw();
    }
    for (let sprite of sprites) {
        sprite.Draw();
    }
    if (isMouseDown) {
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Loot: " + loot, 110, 21);
    ctx.fillText("Kills: " + killCount, 210, 21);
    ctx.fillText("Deaths: " + deathCount, 310, 21);
}