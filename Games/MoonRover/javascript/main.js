var canvas;
var ctx;
var player = new Player(300, 300);
var renderer = new Renderer();
var sprites = [];
var borders = [];
var levelHandler;
var weaponHandler;
var uiHandler;
var shopHandler;
var pauseHandler;
var audioHandler;
var mainMenuHandler;

var loot = 0;
var killCount = 0;
var deathCount = 0;


setTimeout(Initialize, 100);

function Initialize() {
    let allImages = document.getElementsByTagName("img");
    for (let image of allImages) {
        if (image.width === 0) {
            console.log("image not loaded, trying again")
            setTimeout(Initialize, 100);
            return;
        }
    }

    levelHandler = new LevelHandler();
    weaponHandler = new WeaponHandler();
    uiHandler = new UIHandler();
    shopHandler = new ShopHandler();
    pauseHandler = new PauseHandler();
    audioHandler = new AudioHandler();
    mainMenuHandler = new MainMenuHandler();

    audioHandler.Initialize();
    //levelHandler.LoadZone();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    InitMouseHandlers();
    InitKeyHandlers();
    InitializeTilesets();
    setInterval(MainLoop, 1000 / 60);
    mainMenuHandler.StartMainMenu();
}

let p = null;
var performanceData = [];
function MainLoop() {
    let t0 = performance.now();
    uiHandler.Update();
    if (shopHandler.isInShop) {
        shopHandler.Update();
    } else if (!pauseHandler.isPaused) {
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
    let t1 = performance.now();

    Draw();
    let t2 = performance.now();
    UpdateMouseChanged();
    let perf = ({update: t1-t0, draw: t2-t1, total: t2-t0});
    performanceData.push(perf);
    if (performanceData.length > 60) performanceData.splice(0,1);
}

function Draw() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let imageId = "bg0" + levelHandler.currentLevel;
    let bgImage = document.getElementById(imageId);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    if (!shopHandler.isInShop && !pauseHandler.isPaused) {
        renderer.Update();
        for (let border of borders) {
            border.Draw();
        }
        for (let sprite of sprites) {
            sprite.Draw();
        }
    }
    mainMenuHandler.DrawMenuBg();
    uiHandler.Draw();
    levelHandler.DrawLevelTransition();
}