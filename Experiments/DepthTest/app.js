var mapSize = 32;
var world = new World();
var inputHandler;
var ImageAtlas = (function () {
    function ImageAtlas(mapData) {
        this.slicesPerRow = 10;
        this.pixelsPerCell = 8;
        this.marginBetweenImages = 1;
        this.borderWidth = 1;
        this.rows = 0;
        this.sliceWidth = 0;
        this.sliceHeight = 0;
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.canvas = null;
        this.ctx = null;
        this.tiles = (document.getElementById("Tiles"));
        var t0 = performance.now();
        var slices = mapData.length;
        this.rows = Math.ceil(slices / this.slicesPerRow);
        this.mapWidth = mapData[0][0].length;
        this.mapHeight = mapData[0].length;
        this.sliceWidth = (mapData[0][0].length) * this.pixelsPerCell + this.marginBetweenImages + this.borderWidth * 2;
        this.sliceHeight = mapData[0].length * this.pixelsPerCell + this.borderWidth * 2 + this.marginBetweenImages;
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.sliceWidth * this.slicesPerRow;
        this.canvas.height = this.sliceHeight * this.rows;
        this.ctx = this.canvas.getContext("2d");
        for (var z = 0; z < mapData.length; z++) {
            this.SaveSlice(z, mapData[z]);
        }
        console.log(performance.now() - t0);
    }
    ImageAtlas.prototype.SaveSlice = function (z, arr) {
        var tempCtx = this.ctx;
        var tiles = this.tiles;
        var leftIndex = z % this.slicesPerRow;
        var topIndex = Math.floor(z / this.slicesPerRow);
        tempCtx.fillStyle = "rgba(0,0,0,1)";
        tempCtx.strokeStyle = "rgba(0,0,255,1)";
        tempCtx.lineWidth = 1;
        tempCtx.clearRect(this.sliceWidth * leftIndex, this.sliceHeight * topIndex, this.sliceWidth, this.sliceHeight);
        // Border shading
        for (var y = 0; y < arr.length; y++) {
            var line = arr[y];
            for (var x = 0; x < line.length; x++) {
                var tileType = tileTypes[line[x]];
                if (tileType) {
                    if (tileType.hasSolidBorder)
                        tempCtx.fillRect(x * this.pixelsPerCell + this.sliceWidth * leftIndex, y * this.pixelsPerCell + this.sliceHeight * topIndex, this.pixelsPerCell + this.borderWidth * 2, this.pixelsPerCell + this.borderWidth * 2);
                }
            }
        }
        // Image drawing
        for (var y = 0; y < arr.length; y++) {
            var line = arr[y];
            for (var x = 0; x < line.length; x++) {
                var tileType = tileTypes[line[x]];
                if (tileType) {
                    tempCtx.drawImage(tiles, tileType.sourceLeft, tileType.sourceTop, tileType.sourceWidth, tileType.sourceHeight, (x * this.pixelsPerCell) + this.sliceWidth * leftIndex + this.borderWidth, this.sliceHeight * topIndex + y * this.pixelsPerCell + this.borderWidth, this.pixelsPerCell, this.pixelsPerCell);
                    if (tileType.isWater) {
                        if (arr[y - 1][x] != line[x]) {
                            tempCtx.beginPath();
                            var x1 = x * this.pixelsPerCell + this.sliceWidth * z + this.borderWidth;
                            var y1 = 0.5 + (y * this.pixelsPerCell);
                            tempCtx.moveTo(x1, y1);
                            tempCtx.lineTo(x1 + this.pixelsPerCell, y1);
                            tempCtx.stroke();
                            tempCtx.closePath();
                        }
                    }
                }
            }
        }
    };
    ImageAtlas.prototype.RenderSlice = function (zIndex, scaling, cameraX, cameraY) {
        var borderOffset = this.borderWidth / this.pixelsPerCell;
        var upperLeft = TranslateToCanvasCoordinates(scaling, getCellSize(), camera.location.x, camera.location.y, -borderOffset, -borderOffset);
        var lowerRight = TranslateToCanvasCoordinates(scaling, getCellSize(), camera.location.x, camera.location.y, this.mapWidth + borderOffset, this.mapHeight + borderOffset);
        var leftIndex = zIndex % this.slicesPerRow;
        var topIndex = Math.floor(zIndex / this.slicesPerRow);
        ctx.drawImage(this.canvas, this.sliceWidth * leftIndex, this.sliceHeight * topIndex, this.sliceWidth - this.marginBetweenImages, this.sliceHeight - this.marginBetweenImages, upperLeft.x, upperLeft.y, lowerRight.x - upperLeft.x, lowerRight.y - upperLeft.y);
    };
    return ImageAtlas;
}());
function TranslateFromCanvasCoordinates(canvasX, canvasY, cameraX, cameraY, cellSize) {
    var x = (canvasX - canvas.width / 2) / cellSize + cameraX;
    var y = (canvasY - canvas.height / 2) / cellSize + cameraY;
    return new Point(x, y, camera.location.z);
}
function TranslateToCanvasCoordinates(scaling, cellSize, cameraX, cameraY, x, y) {
    var canvasX = cellSize * (scaling * (x - cameraX) + cameraX) - cameraX * cellSize + canvas.width / 2;
    var canvasY = cellSize * (scaling * (y - cameraY) + cameraY) - cameraY * cellSize + canvas.height / 2;
    return { x: (canvasX), y: (canvasY) };
    //return { x: Math.floor(newX), y: Math.floor(newY) }; // floor for minor performance boost on draw calls
}
var TileType = (function () {
    function TileType(name, sourceLeft, sourceTop, sourceWidth, sourceHeight, isSolid, hasSolidBorder, isWater, isDeadly) {
        this.name = name;
        this.sourceLeft = sourceLeft;
        this.sourceTop = sourceTop;
        this.sourceWidth = sourceWidth;
        this.sourceHeight = sourceHeight;
        this.isSolid = isSolid;
        this.hasSolidBorder = hasSolidBorder;
        this.isWater = isWater;
        this.isDeadly = isDeadly;
    }
    return TileType;
}());
var tileTypes = [
    new TileType("air", 0, 0, 0, 0, false, false, false, false),
    new TileType("grass", 0, 0, 8, 8, true, true, false, false),
    new TileType("dirt", 8, 0, 8, 8, true, true, false, false),
    new TileType("stone", 16, 0, 8, 8, true, true, false, false),
    new TileType("water", 24, 0, 8, 8, false, false, true, false),
    new TileType("wood", 0, 8, 8, 8, true, true, false, false),
    new TileType("leaves", 8, 8, 8, 8, true, true, false, false),
    new TileType("thorn", 16, 8, 8, 8, false, false, false, true),
    new TileType("warpforward", 0, 16, 8, 8, true, true, false, false),
    new TileType("warpbackward", 8, 16, 8, 8, true, true, false, false)
];
var canvas = null;
var ctx = null;
var atlas;
window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    atlas = new ImageAtlas(world.mapData);
    InitSprites();
    ctx.imageSmoothingEnabled = false;
    inputHandler = new InputHandler(canvas);
    requestAnimationFrame(loop);
};
var sprites = [];
var timer = 0;
var lastTime = performance.now();
var performances = [];
function loop() {
    performances.push(performance.now() - lastTime);
    if (performances.length > 60)
        performances.splice(0, 1);
    //performances.push(draw());
    //console.log(Math.floor(1000 / (performances.reduce((a, b) => a + b, 0) / performances.length)), (performances.reduce((a, b) => a + b, 0) / performances.length));
    for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
        var sprite = sprites_1[_i];
        try {
            sprite.update();
        }
        catch (e) {
            console.error(e);
        }
    }
    lastTime = performance.now();
    timer++;
    draw();
    inputHandler.update();
    requestAnimationFrame(loop);
}
var pixelsPerCell = 8;
var marginBetweenImages = 1;
var camera = null;
var player = null;
var editor = null;
function InitSprites() {
    sprites = [];
    var startPoint = new Point(16, 17.2, 99);
    if (!player)
        player = new Player(startPoint);
    sprites.push(player);
    player.location = startPoint.copy();
    //if (!editor) editor = new Editor(player.location.copy());
    //sprites.push(editor);
    //editor.location = startPoint.copy();
    if (!camera)
        camera = new Camera(player);
    sprites.push(camera);
    //var platform = new TestPlatform(player.location.plus(0, 2, 0));
    //sprites.push(platform);
}
function getCellSize() {
    // Number of pixels for a single cell when z == cameraZ (i.e., when it's the active slice)
    return parseInt(document.getElementById("cellSize").value);
}
function setCellSize(x) {
    if (x < 1)
        x = 1;
    document.getElementById("cellSize").value = x.toString();
}
function DrawSky(opacity) {
    ctx.fillStyle = "rgba(155,216,250," + opacity.toString() + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
var hackyMagicNumber = 0.5;
function draw() {
    var t0 = performance.now();
    var minZ = 0;
    var maxZ = world.mapData.length - 1;
    if (maxZ > camera.location.z + 1)
        maxZ = camera.location.z + 1;
    var highlightZ = camera.location.z;
    DrawSky(1);
    ctx.fillStyle = "gray";
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    var _loop_1 = function(z) {
        var zDistance = (camera.location.z - z);
        var arr = world.mapData[z];
        var scaling = Math.pow(0.94, camera.location.z - z);
        var borderOffset = atlas.borderWidth / atlas.pixelsPerCell;
        ctx.globalAlpha = z > camera.location.z ? 1 - (z - camera.location.z) : 1.0;
        atlas.RenderSlice(z, scaling, camera.location.x, camera.location.y);
        ctx.globalAlpha = 1;
        for (var _i = 0, _a = sprites.filter(function (s) { return s.location.z === z; }); _i < _a.length; _i++) {
            var sprite = _a[_i];
            sprite.draw(scaling);
        }
        var zFrac = zDistance - Math.floor(zDistance); // (0,1]
        if (zFrac === 0)
            zFrac = 1;
        if (Math.ceil(zDistance) === 1)
            DrawSky(0.32 * zFrac);
        if (Math.ceil(zDistance) === 2)
            DrawSky(0.32 + 0.08 * zFrac);
        if (Math.ceil(zDistance) === 3)
            DrawSky(0.40 + 0.08 * zFrac);
        if (Math.ceil(zDistance) === 4)
            DrawSky(hackyMagicNumber * (1 - zFrac));
    };
    for (var z = minZ; z <= maxZ; z++) {
        _loop_1(z);
    }
    ctx.fillStyle = "rgba(255,255,255," + document.getElementById("overlay").value + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return performance.now() - t0;
}
//# sourceMappingURL=app.js.map