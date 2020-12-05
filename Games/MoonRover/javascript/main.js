var canvas;
var ctx;
var player = new Player(300, 300);
var renderer = new Renderer();
var sprites = [];
var borders = [];
var levelHandler = new LevelHandler();
var weaponHandler = new WeaponHandler();
var overlayHandler = new OverlayHandler();

var loot = 0;
var killCount = 0;
var deathCount = 0;

levelHandler.LoadZone();

setTimeout(Initialize, 100);

function Initialize() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    InitMouseHandlers();
    InitKeyHandlers();
    weaponHandler.CreateInventoryBar();
    setInterval(MainLoop, 1000 / 60);
}

function MainLoop() {
    weaponHandler.Update();
    levelHandler.Update();
    for (let sprite of sprites) {
        if (!sprite.initialized) {
            if (sprite.Initialize) sprite.Initialize();
            sprite.initialized = true;
            sprite.hp = sprite.maxHp;
        }
        sprite.oldX = sprite.x;
        sprite.oldY = sprite.y;
        sprite.frame++;
        sprite.Update();
        if (sprite instanceof Enemy) sprite.SharedEnemyUpdate();
    }
    sprites = sprites.filter(x => x.isActive);
    Draw();
    UpdateMouseChanged();
}

function Draw() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderer.Update();
    for (let border of borders) {
        border.Draw();
    }
    for (let sprite of sprites) {
        sprite.Draw();
    }
    if (isMouseDown) {
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    overlayHandler.Draw();
}