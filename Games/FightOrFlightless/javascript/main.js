
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

var money = 250;

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
    sprites.push(new Hat(0, -1))
    sprites.push(new SouthPole(0, 0));
    sprites.push(new Snowman(-3, -2))
    sprites.push(new Snowman(-4, 3))
    sprites.push(new Snowman(-4, -3))
    sprites.push(new Snowman(4, -2))
    sprites.push(new Snowman(3, 2))
    sprites.push(new Snowman(0, 2))
    sprites.push(new Snowman(0, 4))
    sprites.push(new SnowBank(0, -5))

    for (let row = 0; row < cellRowCount; row++) {
        for (let col = 0; col < cellColCount; col++) {
            let xIndex = col - (cellColCount - 1) / 2;
            let yIndex = row - (cellRowCount - 1) / 2;
            if (Math.random() > 0.05) {
                sprites.push(new GroundTile(xIndex, yIndex));
            }
        }
    }

    navMesh = new NavMesh();
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
        sprite.age++;
    }
    sprites = sprites.filter(a => a.isActive);
}


var navMesh;
function Draw() {
    ClearCanvas();

    // draw sprites by layer, back-to-front for same layer
    sprites.sort((a, b) => {
        if (a.drawOrder == b.drawOrder) {
            return a.y - b.y
        }
        return a.drawOrder - b.drawOrder
    });
    for (let sprite of sprites) {
        sprite.Draw(ctx);
    }
    //DrawNavMesh();
    DrawHUD();
}

function DrawNavMesh() {
    if (navMesh) {
        let offset = (frameNum % 80) / 80 * cellWidth;
        for (let tile of navMesh.mesh) {
            let x = tile.tileX * cellWidth;
            let y = tile.tileY * cellHeight;

            ctx.strokeStyle = "#0b05";
            ctx.fillStyle = "#0b0F";
            ctx.lineWidth = 3;
            if (!tile.critical) {
                ctx.strokeStyle = "#8c8B"
                ctx.fillStyle = "#8c8B";
                ctx.lineWidth = 1;
            }
            for (let route of tile.routes) {
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2 + x, canvas.height / 2 + y);
                ctx.lineTo(canvas.width / 2 + x + route.x * cellWidth, canvas.height / 2 + y + route.y * cellHeight);
                ctx.stroke();
                ctx.fillRect(
                    canvas.width / 2 + x - 2 + route.x * offset,
                    canvas.height / 2 + y - 2 + route.y * offset,
                    4, 4);
            }

            // show distance numbers
            if (tile.trueDistance && tile.trueDistance < 100) {
                ctx.fillStyle = "#F00B";
                ctx.font = "16px Arial";
                ctx.textAlign = "center";
                ctx.fillText(tile.distance.toFixed(0), canvas.width / 2 + x, canvas.height / 2 + y)
            }
        }
    }
}

function ClearCanvas() {
    ctx.fillStyle = "#3a3c86";
    ctx.fillRect(-5000, -5000, 10000, 10000);
}

function DrawHUD() {
    ctx.fillStyle = "#dbfff3";
    ctx.textAlign = "left";
    ctx.font = "16pt Courier";
    ctx.fillText(`Money: ${money.toFixed(0)}`, 10, 30)
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