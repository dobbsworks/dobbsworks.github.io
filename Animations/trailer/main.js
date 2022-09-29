
var canvas;
var ctx;
var images = {};
var sprites = [];
var frameNum = 0;
var musicBeat = 11.7; //magic number for frame updates to match music
var frames = 1000 / 60;

function Initialize() {
    let htmlImages = document.getElementsByTagName("img");
    for (let image of htmlImages) {
        let src = image.src.replace(".png", "");
        image.id = src.split("/")[src.split("/").length - 1];

        let rows = +(image.dataset.rows) || 1;
        let cols = +(image.dataset.cols) || 1;
        images[image.id] = SliceImageToTiles(image.id, rows, cols)
    }
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    setInterval(Loop, frames);
}

setTimeout(Start, 100);
function Start() {
    canvas.style.opacity = 0;
    setTimeout(() => {
        setTimeout(() => {
            canvas.style.opacity = 1;
        }, 50);
        StartScene()
    }, 30);
    let button = document.getElementById("start");
    button.style.display = "none";
    canvas.style.display = "unset";
}

function Loop() {
    ProcessInterps(frameNum);
    Update();
    Draw();
}

function Update() {
    frameNum++;
    for (let sprite of sprites) {
        for (let rule of sprite.updateRules) {
            rule.bind(sprite, frameNum)();
        }
        sprite.Update(frameNum);
    }
    sprites = sprites.filter(a => a.isActive);
}

function Draw() {
    ctx.clearRect(0, 0, 9999, 9999);
    ctx.fillStyle = "#92cddb";
    ctx.fillRect(0,0,9999,9999);
    onBeforeDraw(ctx);
    for (let sprite of sprites) {
        sprite.Draw(ctx, frameNum);
    }
    onAfterDraw(ctx);
}


window.onload = Initialize;




function SliceImageToTiles(imageId, rows, cols) {
    let tiles = {};
    let img = document.getElementById(imageId);
    tiles.image = img;
    tiles.height = img.height / rows;
    tiles.width = img.width / cols;
    tiles.count = rows * cols;
    tiles.rows = rows;
    tiles.cols = cols;
    tiles.drawIndex = () => {
        //image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number
    }
    return tiles;
}
