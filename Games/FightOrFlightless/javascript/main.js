
var canvas;
var ctx;
var images = {};
var sprites = [];
var frames = 1000 / 60;
var frameNum = 0;

var cellHeight = 40;
var cellWidth = 40;
var cellRowCount = 13;
var cellColCount = 13;

function Initialize() {
    InitKeyHandlers();
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
    sprites.push(new Snowman(-3, -1))
    sprites.push(new Snowman(-4, 3))
    sprites.push(new Snowman(-1, -1))
    sprites.push(new Snowman(1, -2))
    sprites.push(new Snowman(1, 2))
    sprites.push(new Snowman(0, 2))
    sprites.push(new Snowman(0, 1))
    sprites.push(new SnowDrift(0, -5))
    sprites.push(new Hat(0, -1))
}

function Loop() {
    Update();
    Draw();
}

function Update() {
    frameNum++;
    if (frameNum % 60 * 3 === 0) {
        sprites.push(new Penguin(Math.random() > 0.5 ? -10 : 10, Math.floor(Math.random() * 10) - 5));
    }
    for (let sprite of sprites) {
        sprite.Update();
    }
    sprites = sprites.filter(a => a.isActive);
}

function Draw() {
    DrawCells();
    for (let sprite of sprites) {
        sprite.Draw(ctx);
    }
}

function DrawCells() {
    ctx.fillStyle = "#3a3c86";
    ctx.fillRect(-5000, -5000, 10000, 10000);

    for (let col = 0; col < cellColCount; col++) {
        for (let row = 0; row < cellRowCount; row++) {
            let xIndex = col - (cellColCount - 1) / 2;
            let yIndex = row - (cellRowCount - 1) / 2;
            let x = xIndex * cellWidth;
            let y = yIndex * cellHeight;
            DrawTile(images.art, 0, canvas.width / 2 + x, canvas.height / 2 + y, 2)
        }
    }

    DrawTile(images.art, 5, canvas.width / 2, canvas.height / 2, 2)
}




function SliceImageToTiles(imageId, rows, cols) {
    let tiles = {};
    let img = document.getElementById(imageId);
    tiles.image = img;
    tiles.height = img.height / rows;
    tiles.width = img.width / cols;
    tiles.count = rows * cols;
    tiles.rows = rows;
    tiles.cols = cols;
    return tiles;
}

function DrawTile(tileset, tileIndex, x, y, scale) {
    let rotation = 0;
    let image = tileset.image;
    let sw = tileset.width;
    let sh = tileset.height;
    let sx = sw * (tileIndex % tileset.cols);
    let sy = sh * Math.floor(tileIndex / tileset.cols);

    // trim edges to reduce bleed
    // sx += 0.05;
    // sy += 0.05;
    // sw -= 0.1;
    // sh -= 0.1;

    let dx = Math.floor(x);
    let dy = Math.floor(y);
    let dw = Math.floor(sw * (scale || 1));
    let dh = Math.floor(sh * (scale || 1));

    ctx.save();
    ctx.transform(1, 0, 0, 1, dx, dy);
    ctx.rotate(rotation);
    ctx.drawImage(image, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}

window.onload = Initialize;