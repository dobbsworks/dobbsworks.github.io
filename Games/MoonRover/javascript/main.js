var canvas;
var ctx;
var player = new Player(300, 300);
var renderer = new Renderer();
var sprites = [];
var borders = [];
var levelHandler = new LevelHandler();
var weaponHandler = new WeaponHandler();
var uiHandler = new UIHandler();
var shopHandler = new ShopHandler();

var loot = 0;
var killCount = 0;
var deathCount = 0;
var debugMode = false;

levelHandler.LoadZone();

setTimeout(Initialize, 100);

function Initialize() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    InitMouseHandlers();
    InitKeyHandlers();
    weaponHandler.CreateInventoryBar();
    setInterval(MainLoop, 1000 / 60);

    sprites.push(new BossMissile(100, 100))
}

function MainLoop() {
    if (shopHandler.isInShop) {
        shopHandler.Update();
    } else {
        weaponHandler.Update();
        levelHandler.Update();
        for (let sprite of sprites) {
            if (sprite.isActive) {
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
        }
        sprites = sprites.filter(x => x.isActive);
    }
    uiHandler.Update();
    Draw();
    UpdateMouseChanged();
}

function Draw() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!shopHandler.isInShop) {
        renderer.Update();
        for (let border of borders) {
            border.Draw();
        }
        for (let sprite of sprites) {
            sprite.Draw();
        }
    }

    uiHandler.Draw();
}