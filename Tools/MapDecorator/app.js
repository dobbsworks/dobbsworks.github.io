
var canvasScale = 1.0;
var sourceGridSize = 50;
var editGridSize = 10;
var outputGridSize = 20;
var mapData = [];
var editCanvas;
var editCtx;
var loadedImage;

var isLeftClick = false;
var isRightClick = false;

var cellType = {
    "solid": 0,
    "open": 1,
    "door": 2,
    "horizontalDoor": 3,
    "verticalDoor": 4,
}

window.onload = () => {
    document.getElementById("commandText").value = "";
    var editCanvas = document.getElementById("editcanvas");
    editCanvas.addEventListener("mousedown", (event) => {
        event.preventDefault();
        var rect = editCanvas.getBoundingClientRect()
        var cellX = Math.floor((event.clientX - rect.left) / editGridSize);
        var cellY = Math.floor((event.clientY - rect.top) / editGridSize);

        var cellValue = null;
        if (event.button == 0) {
            isLeftClick = true;
            isRightClick = false;
            cellValue = cellType.solid;
        }
        if (event.button == 1) {
            isLeftClick = false;
            isRightClick = false;
            cellValue = GetDoorTypeForCell(cellX, cellY);
        }
        if (event.button == 2) {
            isLeftClick = false;
            isRightClick = true;
            cellValue = cellType.open;
        }
        OnClickEditGrid(cellX, cellY, cellValue);
    });
    editCanvas.addEventListener("mouseup", (event) => {
        event.preventDefault();
        if (event.button == 0) {
            isLeftClick = false;
        }
        if (event.button == 2) {
            isRightClick = false;
        }
    });
    editCanvas.addEventListener("mousemove", (event) => {
        var rect = editCanvas.getBoundingClientRect()
        if (isLeftClick) {
            OnClickEditGrid(event.clientX - rect.left, event.clientY - rect.top, cellType.solid);
        } else if (isRightClick) {
            OnClickEditGrid(event.clientX - rect.left, event.clientY - rect.top, cellType.open);
        }
    });
    editCanvas.addEventListener("contextmenu", (event) => {
         event.preventDefault();
    });
    PrepareWallTextures();
    loadedImage = document.getElementById("sampleMap");
    UpdateCanvas();
}


function PrepareWallTextures() {
    var sourceImage = document.getElementById("baseWallTexture");
    var dirs = ["up", "left", "down", "right"];
    var canvases = dirs.map(a => document.getElementById(a + "SolidWall"))

    canvases.forEach((canvas, i) => {
        canvas.width = outputGridSize * (i % 2 == 0 ? 3 : 2);
        canvas.height = outputGridSize * (i % 2 != 0 ? 3 : 2);
    })

    var ctxs = canvases.map(a => a.getContext("2d"));
    ctxs.forEach((a,i) => a.clearRect(0, 0, canvases[i].width, canvases[i].height))

    ctxs[0].save();
    ctxs[0].rotate(Math.PI/2);
    ctxs[0].drawImage(sourceImage, 0, -canvases[1].height, canvases[1].width, canvases[1].height);
    ctxs[0].restore();

    ctxs[1].drawImage(sourceImage, 0, 0, canvases[1].width, canvases[1].height);

    ctxs[2].save();
    ctxs[2].scale(1, -1);
    ctxs[2].drawImage(canvases[0], 0, -canvases[0].height, canvases[0].width, canvases[0].height);
    ctxs[2].restore();

    ctxs[3].save();
    ctxs[3].scale(-1, 1);
    ctxs[3].drawImage(canvases[1], -canvases[1].width, 0, canvases[1].width, canvases[1].height);
    ctxs[3].restore();
}



function OnFileChange() {
    var loader = document.getElementById("fileLoad");
    if (loader.files && loader.files[0] && loader.files[0].name) {
        var img = document.getElementById('loadedImage');
        img.onload = () => {
            URL.revokeObjectURL(img.src);  // no longer needed, free memory
            loadedImage = img;
            UpdateCanvas();
        }
        img.src = URL.createObjectURL(loader.files[0]);
    }
}

function OnSetupChange() {
    var gridSizeInput = document.getElementById("sourceCellSize");
    sourceGridSize = +(gridSizeInput.value);
    UpdateCanvas();
}

function UpdateCanvas() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var widthPerHeightRatio = loadedImage.width / loadedImage.height;
    var canvasRatio = canvas.width / canvas.height;

    if (widthPerHeightRatio > canvasRatio) {
        canvasScale = canvas.width / loadedImage.width
    } else {
        canvasScale = canvas.height / loadedImage.height
    }

    ctx.drawImage(loadedImage, 0, 0, loadedImage.width * canvasScale, loadedImage.height * canvasScale)

    DrawGridLines(ctx, loadedImage);
}

function DrawGridLines(ctx, loadedImage) {
    ctx.strokeStyle = "#00000088";
    ctx.lineWidth = 1;
    for (let gridXSourcePixel = 0; gridXSourcePixel < loadedImage.width; gridXSourcePixel += sourceGridSize) {
        ctx.beginPath();
        ctx.moveTo(gridXSourcePixel * canvasScale, 0);
        ctx.lineTo(gridXSourcePixel * canvasScale, loadedImage.height * canvasScale);
        ctx.stroke();
    }
    for (let gridYSourcePixel = 0; gridYSourcePixel < loadedImage.height; gridYSourcePixel += sourceGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gridYSourcePixel * canvasScale);
        ctx.lineTo(loadedImage.width * canvasScale, gridYSourcePixel * canvasScale);
        ctx.stroke();
    }
}

function ConvertToMapData() {
    var canvas = document.createElement("canvas");
    canvas.width = loadedImage.width;
    canvas.height = loadedImage.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(loadedImage, 0, 0);
    var imageData = ctx.getImageData(0, 0, loadedImage.width, loadedImage.height);

    mapData = [];
    for (var topLeftX = 0; topLeftX < loadedImage.width; topLeftX += sourceGridSize) {
        var column = [];
        for (var topLeftY = 0; topLeftY < loadedImage.height; topLeftY += sourceGridSize) {
            var pixelIndex = GetImageDataIndex(loadedImage, topLeftX + sourceGridSize / 2, topLeftY + sourceGridSize / 2);
            var redValue = imageData.data[pixelIndex];
            column.push(redValue > 128 ? cellType.open : cellType.solid);
        }
        mapData.push(column);
    }
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    DrawEditGrid();
}

function GetImageDataIndex(image, pixelX, pixelY) {
    return (Math.floor(pixelY) * image.width + Math.floor(pixelX)) * 4;
}

function DrawEditGrid() {
    var scale = editGridSize;
    editCanvas = document.getElementById("editcanvas");
    editCanvas.width = mapData.length * scale;
    editCanvas.height = mapData[0].length * scale;
    
    editCtx = editCanvas.getContext("2d");
    editCtx.fillStyle = "#000";
    editCtx.fillRect(0, 0, editCanvas.width, editCanvas.height);
    editCtx.fillStyle = "#FFF";

    for (var xCell = 0; xCell < mapData.length; xCell++) {
        for (var yCell = 0; yCell < mapData[xCell].length; yCell++) {
            DrawEditCell(xCell, yCell, mapData[xCell][yCell])
        }
    }
}

function OnEditSetupChange() {
    var gridSizeInput = document.getElementById("editCellSize");
    editGridSize = +(gridSizeInput.value);
    DrawEditGrid();
}

function AutoPlaceDoors() {
    for (var xCell = 0; xCell < mapData.length; xCell++) {
        for (var yCell = 0; yCell < mapData[xCell].length; yCell++) {
            var cellValue = GetDoorTypeForCell(xCell, yCell)
            if (cellValue != cellType.door) {
                mapData[xCell][yCell] = cellValue;
            }
        }
    }
    DrawEditGrid();
}

function GetDoorTypeForCell(xCell, yCell) {
    var isCellEmpty = mapData[xCell][yCell] == cellType.open;
    var isUpEmpty = yCell <= 0 || mapData[xCell][yCell - 1] == cellType.open;
    var isDownEmpty = yCell >= mapData[xCell].length - 1 || mapData[xCell][yCell + 1] == cellType.open;
    var isLeftEmpty = xCell <= 0 || mapData[xCell - 1][yCell] == cellType.open;
    var isRightEmpty = xCell >= mapData.length  - 1 || mapData[xCell + 1][yCell] == cellType.open;

    if (isCellEmpty) {
        if (isUpEmpty && isDownEmpty && !isLeftEmpty && !isRightEmpty) {
            // vertical hall
            let cellBlocks = [[
                {x: xCell, y: yCell - 2},
                {x: xCell + 1, y: yCell - 1},
                {x: xCell - 1, y: yCell - 1}
            ], [
                {x: xCell, y: yCell+ 2},
                {x: xCell + 1, y: yCell + 1},
                {x: xCell - 1, y: yCell + 1}
            ]];
            if (cellBlocks.some(block => block.filter(cellCoord => mapData[cellCoord.x] && mapData[cellCoord.x][cellCoord.y] == cellType.open).length >= 2)) {
                // at least one side has at least 2 open spots, place a door here
                return cellType.horizontalDoor;
            }
        } else if (!isUpEmpty && !isDownEmpty && isLeftEmpty && isRightEmpty) {
            // horizontal hall
            let cellBlocks = [[
                {x: xCell - 2, y: yCell},
                {x: xCell - 1, y: yCell + 1},
                {x: xCell - 1, y: yCell - 1}
            ], [
                {x: xCell + 2, y: yCell},
                {x: xCell + 1, y: yCell + 1},
                {x: xCell + 1, y: yCell - 1}
            ]];
            if (cellBlocks.some(block => block.filter(cellCoord => mapData[cellCoord.x] && mapData[cellCoord.x][cellCoord.y] == cellType.open).length >= 2)) {
                // at least one side has at least 2 open spots, place a door here
                return cellType.verticalDoor;
            }
        }
    }
    return cellType.door;
}

function DrawEditCell(xCell, yCell, value) {
    var scale = editGridSize;
    if (value == cellType.solid || value == cellType.open) {
        editCtx.fillStyle = value == cellType.solid ? "#000" : "#FFF";
        editCtx.fillRect(xCell * scale, yCell * scale, scale - 1, scale - 1);
    } else {
        editCtx.fillStyle = "#FFF";
        editCtx.fillRect(xCell * scale, yCell * scale, scale - 1, scale - 1);
        editCtx.strokeStyle = "#000";

        if (value == cellType.door) {
            editCtx.beginPath();
            editCtx.moveTo(xCell * scale, yCell * scale);
            editCtx.lineTo((xCell + 1) * scale, (yCell + 1) * scale);
            editCtx.stroke();
            editCtx.beginPath();
            editCtx.moveTo((xCell + 1) * scale, yCell * scale);
            editCtx.lineTo(xCell * scale, (yCell + 1) * scale);
            editCtx.stroke();
        }
        if (value == cellType.horizontalDoor) {
            editCtx.beginPath();
            editCtx.moveTo(xCell * scale, (yCell + 0.5) * scale);
            editCtx.lineTo((xCell + 1) * scale, (yCell + 0.5) * scale);
            editCtx.stroke();
        }
        if (value == cellType.verticalDoor) {
            editCtx.beginPath();
            editCtx.moveTo((xCell + 0.5) * scale, yCell * scale);
            editCtx.lineTo((xCell + 0.5) * scale, (yCell + 1) * scale);
            editCtx.stroke();
        }
    }
}

function OnClickEditGrid(xCell, yCell, cellValue) {
    mapData[xCell][yCell] = cellValue;
    DrawEditCell(xCell, yCell, cellValue);
}


function OnOutputSetupChange() {
    var gridSizeInput = document.getElementById("outputCellSize");
    outputGridSize = +(gridSizeInput.value);
    PrepareWallTextures();
    GenerateFinalImages();
}

function GenerateFinalImages() {
    var scale = outputGridSize;
    var wallCanvas = document.getElementById("wallOutputCanvas");
    var floorCanvas = document.getElementById("floorOutputCanvas");
    wallCanvas.width = scale * mapData.length;
    wallCanvas.height = scale * mapData[0].length;
    floorCanvas.width = scale * mapData.length;
    floorCanvas.height = scale * mapData[0].length;
    var wallCtx = wallCanvas.getContext("2d");
    var floorCtx = floorCanvas.getContext("2d");
    var floorTexture = document.getElementById("floorTexture");

    var verticalWallCoordinates = [];
    var horizontalWallCoordinates = [];

    wallCanvas.style.width = editGridSize * mapData.length + "px";
    floorCanvas.style.width = editGridSize * mapData.length + "px";
    
    var dirs = ["up", "left", "down", "right"];
    var canvases = dirs.map(a => document.getElementById(a + "SolidWall"))

    wallCtx.fillStyle = document.getElementById("backdropColor").value;
    for (var xCell = 0; xCell < mapData.length; xCell++) {
        for (var yCell = 0; yCell < mapData[xCell].length; yCell++) {
            if (mapData[xCell][yCell] == cellType.solid) {
                wallCtx.fillRect(scale * xCell, scale * yCell, scale, scale);
            }
        }
    }
    for (var xCell = 0; xCell < mapData.length; xCell++) {
        for (var yCell = 0; yCell < mapData[xCell].length; yCell++) {
            var isCellEmpty = mapData[xCell][yCell] != cellType.solid;
            var isUpEmpty = yCell <= 0 || mapData[xCell][yCell - 1] != cellType.solid;
            var isDownEmpty = yCell >= mapData[xCell].length - 1 || mapData[xCell][yCell + 1] != cellType.solid;
            var isLeftEmpty = xCell <= 0 || mapData[xCell - 1][yCell] != cellType.solid;
            var isRightEmpty = xCell >= mapData.length  - 1 || mapData[xCell + 1][yCell] != cellType.solid;

            if (isCellEmpty) {
                floorCtx.drawImage(floorTexture, 100 * (xCell % 4), 100 * (yCell % 4), 100, 100, scale * xCell, scale * yCell, scale, scale);
            
                if (!isLeftEmpty) {
                    wallCtx.drawImage(canvases[1], scale * (xCell - 1), scale * (yCell - 1));
                    verticalWallCoordinates.push({x: scale * xCell, y: scale * yCell});
                }
                if (!isRightEmpty) {
                    wallCtx.drawImage(canvases[3], scale * (xCell), scale * (yCell - 1));
                    verticalWallCoordinates.push({x: scale * (xCell + 1), y: scale * yCell});
                }
                if (!isUpEmpty) {
                    wallCtx.drawImage(canvases[0], scale * (xCell - 1), scale * (yCell - 1));
                    horizontalWallCoordinates.push({x: scale * xCell, y: scale * yCell});
                }
                if (!isDownEmpty) {
                    wallCtx.drawImage(canvases[2], scale * (xCell - 1), scale * (yCell));
                    horizontalWallCoordinates.push({x: scale * xCell, y: scale * (yCell + 1)});
                }
            }
        }
    }

    var finalWalls = [];
    verticalWallCoordinates.sort((a,b) => {return a.x == b.x ? (a.y - b.y) : (a.x - b.x)});
    while (verticalWallCoordinates.length > 0) {
        var wallStart = verticalWallCoordinates.shift();
        var yEnd = wallStart.y + scale;

        while (verticalWallCoordinates.length > 0 && verticalWallCoordinates[0].x == wallStart.x && verticalWallCoordinates[0].y == yEnd) {
            verticalWallCoordinates.shift();
            yEnd += scale;
        }
        finalWalls.push({x1: wallStart.x, y1: wallStart.y, x2: wallStart.x, y2: yEnd});
    }

    horizontalWallCoordinates.sort((a,b) => {return a.y == b.y ? (a.x - b.x) : (a.y - b.y)});
    while (horizontalWallCoordinates.length > 0) {
        var wallStart = horizontalWallCoordinates.shift();
        var xEnd = wallStart.x + scale;

        while (horizontalWallCoordinates.length > 0 && horizontalWallCoordinates[0].y == wallStart.y && horizontalWallCoordinates[0].x == xEnd) {
            horizontalWallCoordinates.shift();
            xEnd += scale;
        }
        finalWalls.push({x1: wallStart.x, y1: wallStart.y, x2: xEnd, y2: wallStart.y});
    }

    var doorWalls = []
    for (var xCell = 0; xCell < mapData.length; xCell++) {
        for (var yCell = 0; yCell < mapData[xCell].length; yCell++) {
            if (mapData[xCell][yCell] == cellType.horizontalDoor) {
                doorWalls.push({x1: scale * xCell, y1: scale * (yCell + 0.5), x2: scale * (xCell + 1), y2: scale * (yCell + 0.5)});
            }
            if (mapData[xCell][yCell] == cellType.verticalDoor) {
                doorWalls.push({x1: scale * (xCell + 0.5), y1: scale * yCell, x2: scale * (xCell + 0.5), y2: scale * (yCell + 1)});
            }
        }
    }
    
    var foundryCommand = "canvas.scene.createEmbeddedDocuments(\"Wall\", [";
    for (var a of finalWalls) {
        if (!foundryCommand.endsWith("[")) foundryCommand += ",";
        foundryCommand += `{c: [${a.x1},${a.y1},${a.x2},${a.y2}]}`;
    }
    for (var a of doorWalls) {
        if (!foundryCommand.endsWith("[")) foundryCommand += ",";
        foundryCommand += `{c: [${a.x1},${a.y1},${a.x2},${a.y2}], door: 1}`;
    }
    foundryCommand += "])";
    document.getElementById("commandText").value = foundryCommand;
}
