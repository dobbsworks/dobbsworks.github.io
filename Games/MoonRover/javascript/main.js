var canvas;
var ctx;
var player = new Player(300, 300);
var renderer = new Renderer();
var sprites = [];
var borders = [];
var levelHandler;
var weaponHandler;
var achievementHandler;
var uiHandler;
var shopHandler;
var pauseHandler;
var audioHandler;
var mainMenuHandler;

var loot = 0;
var killCount = 0;
var deathCount = 0;
var currentCharacter = null;


setTimeout(Initialize, 100);

function Initialize() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    let allImages = document.getElementsByTagName("img");
    for (let image of allImages) {
        if (image.width === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Loading resources, please wait...", canvas.width / 2, canvas.height / 2);
            setTimeout(Initialize, 100);
            return;
        }
    }

    achievementHandler = new AchievementHandler();
    levelHandler = new LevelHandler();
    weaponHandler = new WeaponHandler();
    shopHandler = new ShopHandler();
    uiHandler = new UIHandler();
    pauseHandler = new PauseHandler();
    audioHandler = new AudioHandler();
    mainMenuHandler = new MainMenuHandler();

    audioHandler.Initialize();
    InitMouseHandlers();
    InitKeyHandlers();
    InitializeTilesets();
    setInterval(MainLoop, 1000 / 60);
    mainMenuHandler.InitializeMenu();
    achievementHandler.Initialize();
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
        if (levelHandler.levelOutroTimer <= 0) {
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
                    sprite.SharedSpriteUpdate();
                    if (sprite.shortedTimer <= 0) sprite.Update();
                    if (sprite instanceof Enemy) sprite.SharedEnemyUpdate();
                }
            }
        }
        sprites = sprites.filter(x => x.isActive);
    }
    achievementHandler.Update();
    let t1 = performance.now();

    Draw();
    let t2 = performance.now();
    UpdateMouseChanged();
    let perf = ({ update: t1 - t0, draw: t2 - t1, total: t2 - t0 });
    performanceData.push(perf);
    if (performanceData.length > 60) performanceData.splice(0, 1);
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
    achievementHandler.Draw();
}