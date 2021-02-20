function GetNewModel() {
    return {
        tileIndex: 0,
        x: 0,
        y: 0,
        xOffset: 0,
        yOffset: 0,
        hueOffset: 0,
        rotation: 0,
        zIndex: 1,
        effects: [],
        children: [],
    }
}

var tileData = [
    { x: 28, y: 3, w: 13, h: 13, id: 4, name: "Core" },
    { x: 28, y: 3, w: 13, h: 6, id: 8, name: "Half-core" },
    { x: 0, y: 0, w: 8, h: 15, id: 1, name: "Left plate" },
    { x: 19, y: 5, w: 6, h: 11, id: 3, name: "Right plate" },
    { x: 43, y: 6, w: 6, h: 6, id: 6, name: "Center plate" },
    { x: 49, y: 1, w: 9, h: 7, id: 7, name: "Lower plate" },
    { x: 10, y: 11, w: 5, h: 5, id: 2, name: "Wheel" },
    { x: 8, y: 6, w: 4, h: 4, id: 10, name: "Ring" },
    { x: 13, y: 6, w: 4, h: 4, id: 11, name: "Cap" },
    { x: 43, y: 1, w: 4, h: 4, id: 5, name: "Eye" },
    { x: 11, y: 3, w: 6, h: 2, id: 0, name: "Exhaust" },
    { x: 26, y: 5, w: 1, h: 10, id: 12, name: "Antenna" },
    { x: 19, y: 0, w: 7, h: 4, id: 9, name: "Light panel" },
    { x: 51, y: 10, w: 6, h: 6, id: 13, name: "Big wheel" },
]

var modelRoot = JSON.parse(`{"root":{"tileIndex":4,"x":6,"y":5,"xOffset":1,"yOffset":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0}}],"children":[{"tileIndex":1,"x":5,"y":2,"xOffset":1,"yOffset":0,"zIndex":50,"effects":[{"name":"WaveY","params":{"speed":1,"amplitude":2,"offset":0.25}},{"name":"Shading","params":{}}],"children":[{"tileIndex":5,"x":5,"y":3,"xOffset":1,"yOffset":2,"zIndex":99,"effects":[{"name":"WaveY","params":{"speed":-1,"amplitude":2,"offset":0}}],"children":[],"hueOffset":0,"rotation":0}],"hueOffset":0,"rotation":0},{"tileIndex":2,"x":6,"y":15,"xOffset":1,"yOffset":0,"zIndex":1,"effects":[],"children":[],"hueOffset":0,"rotation":0},{"tileIndex":2,"x":14,"y":15,"xOffset":1,"yOffset":0,"zIndex":1,"effects":[],"children":[],"hueOffset":0,"rotation":0},{"tileIndex":0,"x":16,"y":14,"xOffset":1,"yOffset":1,"zIndex":1,"effects":[{"name":"WaveY","params":{"speed":2,"amplitude":1,"offset":0}}],"children":[],"hueOffset":0,"rotation":0},{"tileIndex":3,"x":16,"y":5,"xOffset":1,"yOffset":1,"zIndex":1,"effects":[{"name":"WaveY","params":{"speed":1,"amplitude":1,"offset":0}},{"name":"Shading","params":{}}],"children":[],"hueOffset":0,"rotation":0},{"tileIndex":12,"x":14,"y":0,"xOffset":2,"yOffset":0,"hueOffset":0,"rotation":0,"zIndex":0,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":-0.25,"ignoreChildren":0}}],"children":[]}],"hueOffset":0,"rotation":0},"vars":{"frames":24}}`).root;
var selectedNode = null;
var vars = {
    frames: 24
}

window.onload = () => {
    CreateTiles();
    RedrawNodeEditor();
    RedrawVars();
    setInterval(Draw, 1000 / 60);

    let canvas = document.getElementById("overlayCanvas");
    canvas.addEventListener("mousedown", OnMouseDown, false);
    canvas.addEventListener("mouseup", OnMouseUp, false);
    canvas.addEventListener("mouseleave", OnMouseUp, false);
    canvas.addEventListener("mousemove", OnMouseMove, false);
}

var scale = 10;
var oscillationParameters = [
    { name: "speed", tooltip: "How many times this node oscillates during the animation" },
    { name: "amplitude", tooltip: "How maxy pixels this node oscillates during the animation" },
    { name: "offset", tooltip: "How far to start into the wave (0.5 for halfway through)" },
    { name: "ignoreChildren", tooltip: "Do not allow this effect to trickle down to child nodes" }
];
var getWave = (paramName) => {
    return (model, t, params) => {
        model[paramName] += +(((Math.cos((params.speed * t + params.offset) * (Math.PI * 2)) + 1) / 2 * params.amplitude).toFixed(0));
    }
}
var effectTypes = [
    {
        name: "WaveX",
        params: oscillationParameters,
        tooltip: "Cause the node to oscillate horizontally",
        func: getWave("xOffset")
    },
    {
        name: "WaveY",
        params: oscillationParameters,
        tooltip: "Cause the node to oscillate vertically",
        func: getWave("yOffset")
    },
    {
        name: "Mirror",
        params: [],
        tooltip: "Reflects the node horizontally"
    },
    {
        name: "Rotation",
        params: oscillationParameters.filter(x => x.name !== "amplitude"),
        tooltip: "Cause the node to rotate clockwise",
        func: (model, t, params) => {
            model.rotation += ((params.speed * t * 360) + params.offset) / 360 * (2 * Math.PI);
        }
    },
    {
        name: "HueShift",
        params: oscillationParameters,
        func: getWave("hueOffset")
    },
    {
        name: "Shading",
        params: [],
        tooltip: "Draws a darker version of the tile"
    }
]

var mouseX = 0;
var mouseY = 0;
var mouseStartX = -1;
var mouseStartY = -1;
var mouseDeltaX = 0;
var mouseDeltaY = 0;
var isMouseDown = false;
function OnMouseDown(e) {
    if (e.button === 0) {
        isMouseDown = true;
        mouseStartX = e.layerX;
        mouseStartY = e.layerY;
    }
}
function OnMouseUp(e) {
    if (e.button === 0) {
        isMouseDown = false;
        if (selectedNode) {
            selectedNode.x += mouseDeltaX;
            selectedNode.y += mouseDeltaY;
            RefreshEditPanel();
        }
        mouseDeltaX = 0;
        mouseDeltaY = 0;
    }
}
function OnMouseMove(e) {
    mouseX = e.layerX;
    mouseY = e.layerY;
    if (isMouseDown) UpdateMouseDelta();
}
function UpdateMouseDelta() {
    mouseDeltaX = Math.floor((mouseX - mouseStartX) / scale);
    mouseDeltaY = Math.floor((mouseY - mouseStartY) / scale);
}




function ExportData() {
    let target = document.getElementById("exportData");
    target.innerText = JSON.stringify({ root: modelRoot, vars: vars });
}
function CopyExportToClipboard() {
    let target = document.getElementById("exportData");
    navigator.clipboard.writeText(target.innerText);
}
function ImportData() {
    let target = document.getElementById("importData");
    let text = target.value;
    let importData = JSON.parse(text);
    modelRoot = importData.root;
    vars = importData.vars;
    target.value = "";
}




function RedrawVars() {
    let container = document.getElementById("varsContainer");
    for (let variableName in vars) {
        let div = document.createElement("div");
        let input = document.createElement("input");
        input.value = vars[variableName];
        input.type = "number";
        input.id = "vars-" + variableName;
        input.onchange = (e) => OnChangeVarInput(e, variableName, input);
        div.appendChild(input);

        let label = document.createElement("label");
        label.innerText = variableName;
        label.htmlFor = input.id;
        div.appendChild(label);
        container.appendChild(div);
    }
}

function OnChangeVarInput(e, variableName, input) {
    input.value = +(input.value);
    vars[variableName] = +(input.value);
    input.focus();
    ExportData();
}

function RedrawNodeEditor() {
    let treeContainer = document.getElementById("treeContainer");
    let element = GetDomElementsFromModel(modelRoot);
    treeContainer.innerHTML = "";
    treeContainer.appendChild(element);
    ExportData();
}
function GetDomElementsFromModel(model) {
    let tile = tiles.find(a => a.id === model.tileIndex);

    let div = document.createElement("div");
    div.className = "node";
    div.innerHTML = tile ? tile.name : "NODE!";
    div.onclick = (e) => OnSelectNode(e, model);
    if (model === selectedNode) {
        div.classList.add("selected");
    }

    if (tile) {
        let image = TileToImage(tile);
        div.appendChild(image);
    }

    let addButton = document.createElement("button");
    addButton.className = "newNodeButton";
    addButton.innerHTML = "+";
    addButton.onclick = (e) => OnClickNewNode(e, model);
    div.appendChild(addButton);

    if (model != modelRoot) {
        let deleteButton = document.createElement("button");
        deleteButton.className = "deleteNodeButton";
        deleteButton.innerHTML = "x";
        deleteButton.onclick = (e) => OnClickDeleteNode(e, model);
        div.appendChild(deleteButton);
    }

    for (let child of model.children) {
        let childNode = GetDomElementsFromModel(child);
        div.appendChild(childNode);
    }

    return div;
}

function OnClickNewNode(e, model) {
    let newObj = GetNewModel();
    model.children.push(newObj)
    RedrawNodeEditor();
    e.stopPropagation();
    OnSelectNode(e, newObj)
}

function OnClickDeleteNode(e, model) {
    let allNodes = GetRecursiveNodeList(modelRoot);
    for (let node of allNodes) {
        let list = node.children;
        let index = list.indexOf(model);
        if (index > -1) {
            list.splice(index, 1);
        }
    }
    if (selectedNode === model) selectedNode = null;
    RedrawNodeEditor();
    RefreshEditPanel();
}

function OnSelectNode(e, model) {
    if (selectedNode === model) {
        selectedNode = null;
    } else {
        selectedNode = model;
    }
    RedrawNodeEditor(modelRoot);
    RefreshEditPanel();
    e.stopPropagation();
}

function RefreshEditPanel() {
    let model = selectedNode;
    let panel = document.getElementById("topBar");
    panel.innerHTML = "";
    if (!model) return;

    panel.appendChild(CreateTileSelector(model));
    panel.appendChild(CreatePropertyEditor(model, "x"));
    panel.appendChild(CreatePropertyEditor(model, "y"));
    panel.appendChild(CreatePropertyEditor(model, "zIndex"));
    for (let effect of effectTypes) {
        panel.appendChild(CreateEffectEditor(model, effect));
    }
    ExportData();
}

function CreatePropertyEditor(model, propName) {
    let div = document.createElement("div");
    div.className = "editorBlock";

    let input = document.createElement("input");
    input.type = "number";
    input.step = "1";
    input.value = model[propName];
    input.id = "edit-" + propName;
    input.onchange = (e) => OnChangeEditorInput(e, model, propName, input);
    div.appendChild(input);

    let label = document.createElement("label");
    label.innerHTML = propName;
    label.htmlFor = "edit-" + propName;
    div.appendChild(label);

    return div;
}

function CreateEffectEditor(model, effect) {
    let modelEffect = model.effects.find(x => x.name === effect.name);
    let container = document.createElement("div");
    container.className = "effectContainer";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "effect-" + effect.name;
    checkbox.checked = !!modelEffect;
    checkbox.onchange = (e) => OnChangeEffectSelection(e, model, effect, checkbox.checked)
    container.appendChild(checkbox);

    let label = document.createElement("label");
    label.innerHTML = effect.name;
    if (effect.tooltip) label.title = effect.tooltip;
    label.htmlFor = "effect-" + effect.name;
    container.appendChild(label);

    if (modelEffect) {
        let paramContainer = document.createElement("div");
        paramContainer.className = "paramContainer";
        for (let param of effect.params) {
            let input = document.createElement("input");
            input.type = "number";
            input.step = "1";
            input.value = modelEffect.params[param.name];
            input.id = "edit-" + effect.name + "-" + param.name;
            input.onchange = (e) => OnChangeEditorParamInput(e, modelEffect, param.name, input);
            paramContainer.appendChild(input);

            let paramLabel = document.createElement("label");
            paramLabel.innerHTML = param.name;
            paramLabel.htmlFor = input.id;
            if (param.tooltip) paramLabel.title = param.tooltip;
            paramContainer.appendChild(paramLabel);
        }
        container.appendChild(paramContainer);
    }

    return container;
}

function OnChangeEffectSelection(e, model, effect, checked) {
    if (checked) {
        let params = {}
        for (let p of effect.params) params[p.name] = 0;
        model.effects.push({ name: effect.name, params: params });
    } else {
        model.effects = model.effects.filter(x => x.name !== effect.name);
    }
    RefreshEditPanel();
}

function OnChangeEditorParamInput(e, modelEffect, paramName, input) {
    input.value = +(input.value);
    modelEffect.params[paramName] = +(input.value);
    input.focus();
}

function CreateTileSelector(model) {
    let container = document.createElement("div");
    for (let tile of tiles) {
        let image = TileToImage(tile);
        let button = document.createElement("button");
        button.appendChild(image);
        button.className = "tileButton";
        button.title = tile.name;
        button.onclick = (e) => OnClickTileButton(e, model, tile);
        container.appendChild(button);
    }
    return container;
}

function OnClickTileButton(e, model, tile) {
    model.tileIndex = tile.id;
    RedrawNodeEditor();
}

function OnChangeEditorInput(e, model, propName, input) {
    input.value = +(input.value);
    model[propName] = +(input.value);
    RedrawNodeEditor();
    input.focus();
}



let tiles = [];
function CreateTile(x, y, w, h, id, name, source) {
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(source, x, y, w, h, 0, 0, w, h);
    tiles.push({ x: x, y: y, w: w, h: h, id: id, name: name, srcText: canvas.toDataURL("image/png") });
}
function TileToImage(tile) {
    let image = new Image();
    image.src = tile.srcText;
    image.width = tile.w;
    image.height = tile.h;
    return image;
}
function CreateTiles() {
    let source = document.getElementById("enemy-parts-01");
    if (!source.width) {
        setTimeout(CreateTiles, 100);
    } else {
        for (let t of tileData) {
            CreateTile(t.x, t.y, t.w, t.h, t.id, t.name, source);
        }
        RedrawNodeEditor();
    }
}


let frame = 0;
function Draw() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 10000, 10000)
    let source = document.getElementById("enemy-parts-01");

    let models = GetRecursiveNodeList(modelRoot);
    models.forEach(a => {
        a.xOffset = 0;
        a.yOffset = 0;
        a.hueOffset = 0;
        a.rotation = 0;
    })
    models.sort((a, b) => a.zIndex - b.zIndex);
    DrawSelectionOutline() //clear outline
    for (let model of models) {
        DrawModelToCanvas(model, ctx, tiles, source, frame);
    }

    let resizeCanvas = document.getElementById("resizeCanvas");
    let resizeCtx = resizeCanvas.getContext("2d");
    resizeCtx.imageSmoothingEnabled = false;
    resizeCtx.clearRect(0, 0, 10000, 10000);
    resizeCtx.drawImage(canvas, 0, 0, canvas.width * scale, canvas.height * scale);
    frame++;
    frame %= vars.frames;
}

function GetRecursiveNodeList(model) {
    return [model, ...model.children.flatMap(x => GetRecursiveNodeList(x))];
}

function DrawModelToCanvas(model, ctx, tiles, source, frameNum) {
    for (let modelEffect of model.effects) {
        let effectType = effectTypes.find(x => x.name === modelEffect.name);
        if (effectType.func) {
            if (!modelEffect.params.ignoreChildren) {
                GetRecursiveNodeList(model).forEach(a => {
                    effectType.func(a, frameNum / vars.frames, modelEffect.params);
                })
            } else {
                effectType.func(model, frameNum / vars.frames, modelEffect.params);
            }
        }
    }
    let tile = tiles.find(a => a.id === model.tileIndex);
    if (model === selectedNode) {
        DrawSelectionOutline(source, tile);
    }

    if (tile) {
        TranslateContext(ctx, model, tile);

        if (model.hueOffset) {
            let recolorFunc = PixelHueShift(model.hueOffset % 360);
            source = GetRecolor(source, recolorFunc);
        }

        if (model.effects.some(a => a.name === "Shading")) {
            let recolorFunc = PixelDarken();
            let recolored = GetRecolor(source, recolorFunc);
            ctx.drawImage(recolored, tile.x, tile.y, tile.w, tile.h,
                Math.sin(model.rotation) - tile.w / 2, Math.cos(model.rotation) - tile.h / 2 + 1, tile.w, tile.h);
        }
        ctx.drawImage(source, tile.x, tile.y, tile.w, tile.h,
            Math.ceil(-tile.w / 2), Math.ceil(-tile.h / 2), tile.w, tile.h);
    }

    ctx.restore();
}

function TranslateContext(ctx, model, tile) {
    let x = model.x + model.xOffset;
    let y = model.y + model.yOffset;
    ctx.save();
    if (tile) ctx.translate(x + tile.w / 2, y + tile.h / 2);
    if (model.effects.some(a => a.name === "Mirror")) {
        ctx.scale(-1, 1);
    }
    if (model.rotation) {
        ctx.rotate(model.rotation);
    }
}


var selectionPattern = null;
function DrawSelectionOutline(source, tile) {
    let overlayCanvas = document.getElementById("overlayCanvas");
    let overlayCtx = overlayCanvas.getContext("2d");
    overlayCtx.imageSmoothingEnabled = false;
    overlayCtx.clearRect(0, 0, 10000, 10000);

    if (selectionPattern == null) {
        let size = 5;
        let selectionCanvas = document.createElement("canvas");
        selectionCanvas.width = size * 2;
        selectionCanvas.height = size * 2;
        let selectionCtx = selectionCanvas.getContext("2d");
        selectionCtx.fillStyle = "red";
        selectionCtx.fillRect(0, 0, size, size);
        selectionCtx.fillRect(size, size, size, size);
        selectionCtx.fillStyle = "white";
        selectionPattern = selectionCtx.createPattern(selectionCanvas, "repeat");
    }

    if (tile) {
        // TranslateContext(overlayCtx, selectedNode, tile);
        // ctx.scale(scale)
        let x = selectedNode.x + selectedNode.xOffset + mouseDeltaX;
        let y = selectedNode.y + selectedNode.yOffset + mouseDeltaY;
        for (let a of [-2, 0, 2]) for (let b of [-2, 0, 2]) {
            overlayCtx.drawImage(source, tile.x, tile.y, tile.w, tile.h,
                x * scale + a, y * scale + b,
                tile.w * scale, tile.h * scale);
        }
        overlayCtx.globalCompositeOperation = "xor";
        overlayCtx.drawImage(source, tile.x, tile.y, tile.w, tile.h,
            x * scale, y * scale,
            tile.w * scale, tile.h * scale);
        overlayCtx.globalCompositeOperation = "source-atop";
        overlayCtx.fillStyle = "gray"; //selectionPattern
        overlayCtx.fillRect(0, 0, 10000, 10000);
        overlayCtx.globalCompositeOperation = "source-over";
        //overlayCtx.restore();
    }
}



function GetRecolor(source, recolorFunc) {
    let newCanvas = document.createElement("canvas");
    newCanvas.width = source.width;
    newCanvas.height = source.height;
    let newCtx = newCanvas.getContext("2d");
    newCtx.drawImage(source, 0, 0);
    let imageData = newCtx.getImageData(0, 0, source.width, source.height);
    let data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        let newColor = recolorFunc(data[i], data[i + 1], data[i + 2]);
        data[i] = newColor.r;
        data[i + 1] = newColor.g;
        data[i + 2] = newColor.b;
    }
    newCtx.putImageData(imageData, 0, 0);
    return newCanvas;
}



function PixelHueShift(hueShift) {
    return (r, g, b) => {
        let hsl = RgbToHsl(r, g, b);
        let newColor = HslToRgb(hsl.h + hueShift / 360, hsl.s, hsl.l);
        return newColor;
    }
}
function PixelDarken() {
    return (r, g, b) => {
        let hsl = RgbToHsl(r, g, b);
        let newColor = HslToRgb(hsl.h, hsl.s, hsl.l / 2);
        return newColor;
    }
}

function RgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, l: l };
}
function HslToRgb(h, s, l) {
    var r = 1, g = 1, b = 1;
    if (s !== 0) {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = Math.floor(hue2rgb(p, q, h + 1 / 3) * 255);
        g = Math.floor(hue2rgb(p, q, h) * 255);
        b = Math.floor(hue2rgb(p, q, h - 1 / 3) * 255);
    }
    return { r: r, g: g, b: b };
}


function ExportFrames() {
    let exportCanvas = document.getElementById("exportCanvas");
    exportCanvas.width = 24 * vars.frames;
    exportCanvas.height = 24;

    let exportCtx = exportCanvas.getContext("2d");
    let source = document.getElementById("enemy-parts-01");
    exportCtx.imageSmoothingEnabled = false;

    let models = GetRecursiveNodeList(modelRoot);

    for (let frameNum = 0; frameNum < vars.frames; frameNum++) {

        models.forEach(a => {
            a.xOffset = 0;
            a.yOffset = 0;
            a.hueOffset = 0;
            a.rotation = 0;
        })
        models.sort((a, b) => a.zIndex - b.zIndex);
        for (let model of models) {
            DrawModelToCanvas(model, exportCtx, tiles, source, frameNum);
        }
        exportCtx.translate(24,0);

    }
}


// limebot
// {"root":{"tileIndex":8,"x":4,"y":3,"xOffset":0,"yOffset":0,"zIndex":1,"effects":[{"name":"WaveY","params":{"speed":1,"amplitude":1,"offset":0,"ignoreChildren":0}},{"name":"HueShift","params":{"speed":0,"amplitude":90,"offset":0,"ignoreChildren":0}}],"children":[{"tileIndex":8,"x":5,"y":13,"xOffset":0,"yOffset":1,"hueOffset":90,"rotation":3.141592653589793,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":180,"ignoreChildren":0}},{"name":"WaveY","params":{"speed":1,"amplitude":1,"offset":0.8,"ignoreChildren":0}}],"children":[{"tileIndex":12,"x":16,"y":15,"xOffset":0,"yOffset":1,"hueOffset":90,"rotation":3.141592653589793,"zIndex":1,"effects":[],"children":[{"tileIndex":12,"x":12,"y":15,"xOffset":0,"yOffset":1,"hueOffset":90,"rotation":3.141592653589793,"zIndex":1,"effects":[],"children":[]},{"tileIndex":12,"x":5,"y":15,"xOffset":0,"yOffset":1,"hueOffset":90,"rotation":3.141592653589793,"zIndex":1,"effects":[],"children":[]},{"tileIndex":12,"x":8,"y":15,"xOffset":0,"yOffset":1,"hueOffset":90,"rotation":3.141592653589793,"zIndex":1,"effects":[],"children":[]}]}]},{"tileIndex":7,"x":3,"y":2,"xOffset":0,"yOffset":1,"hueOffset":90,"rotation":1.5707963267948966,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":90,"ignoreChildren":0}},{"name":"WaveY","params":{"speed":1,"amplitude":0.75,"offset":0.6,"ignoreChildren":0}}],"children":[]},{"tileIndex":7,"x":10,"y":3,"xOffset":0,"yOffset":0,"hueOffset":90,"rotation":1.5707963267948966,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":90,"ignoreChildren":0}},{"name":"Mirror","params":{}}],"children":[]},{"tileIndex":0,"x":8,"y":11,"xOffset":0,"yOffset":0,"hueOffset":180,"rotation":1.5707963267948966,"zIndex":0,"effects":[{"name":"Rotation","params":{"speed":0,"offset":90,"ignoreChildren":0}},{"name":"HueShift","params":{"speed":0,"amplitude":90,"offset":0,"ignoreChildren":0}}],"children":[{"tileIndex":0,"x":4,"y":11,"xOffset":0,"yOffset":0,"hueOffset":180,"rotation":1.5707963267948966,"zIndex":0,"effects":[],"children":[{"tileIndex":0,"x":12,"y":11,"xOffset":0,"yOffset":0,"hueOffset":180,"rotation":1.5707963267948966,"zIndex":0,"effects":[],"children":[]}]}]}],"hueOffset":90,"rotation":0},"vars":{"frames":32}}

// tealbot
// {"root":{"tileIndex":4,"x":4,"y":5,"xOffset":0,"yOffset":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0}},{"name":"HueShift","params":{"speed":0,"amplitude":140,"offset":0,"ignoreChildren":0}}],"children":[{"tileIndex":1,"x":9,"y":8,"xOffset":0,"yOffset":0,"hueOffset":140,"rotation":4.71238898038469,"zIndex":2,"effects":[{"name":"Rotation","params":{"speed":0,"offset":270,"ignoreChildren":1}},{"name":"WaveY","params":{"speed":1,"amplitude":1,"offset":0,"ignoreChildren":0}},{"name":"Mirror","params":{}}],"children":[{"tileIndex":2,"x":3,"y":16,"xOffset":1,"yOffset":0,"hueOffset":140,"rotation":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0.7,"ignoreChildren":0}}],"children":[]},{"tileIndex":2,"x":13,"y":16,"xOffset":1,"yOffset":0,"hueOffset":140,"rotation":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0.8,"ignoreChildren":0}}],"children":[]}]},{"tileIndex":1,"x":9,"y":-1,"xOffset":0,"yOffset":1,"hueOffset":140,"rotation":1.5707963267948966,"zIndex":2,"effects":[{"name":"Rotation","params":{"speed":0,"offset":90,"ignoreChildren":1}},{"name":"WaveY","params":{"speed":1,"amplitude":1,"offset":0.8,"ignoreChildren":0}}],"children":[]},{"tileIndex":5,"x":5,"y":10,"xOffset":0,"yOffset":0,"hueOffset":140,"rotation":0,"zIndex":1,"effects":[],"children":[]},{"tileIndex":0,"x":11,"y":11,"xOffset":0,"yOffset":0,"hueOffset":140,"rotation":1.5707963267948966,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":90,"ignoreChildren":0}},{"name":"WaveX","params":{"speed":1,"amplitude":2,"offset":0,"ignoreChildren":0}}],"children":[]},{"tileIndex":12,"x":16,"y":1,"xOffset":0,"yOffset":0,"hueOffset":140,"rotation":0,"zIndex":1,"effects":[],"children":[]}],"hueOffset":140,"rotation":0},"vars":{"frames":24}}

// cyanbot
// {"root":{"tileIndex":4,"x":4,"y":5,"xOffset":1,"yOffset":0,"zIndex":1,"effects":[{"name":"HueShift","params":{"speed":0,"amplitude":170,"offset":0,"ignoreChildren":0}},{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0,"ignoreChildren":0}}],"children":[{"tileIndex":1,"x":13,"y":5,"xOffset":2,"yOffset":0,"hueOffset":170,"rotation":3.141592653589793,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":180,"ignoreChildren":0}},{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0.8,"ignoreChildren":0}}],"children":[]},{"tileIndex":7,"x":2,"y":12,"xOffset":2,"yOffset":0,"hueOffset":170,"rotation":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0.7,"ignoreChildren":0}}],"children":[]},{"tileIndex":7,"x":2,"y":4,"xOffset":2,"yOffset":0,"hueOffset":170,"rotation":3.141592653589793,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":180,"ignoreChildren":0}},{"name":"Mirror","params":{}},{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0.9,"ignoreChildren":0}}],"children":[]},{"tileIndex":6,"x":8,"y":9,"xOffset":2,"yOffset":0,"hueOffset":170,"rotation":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0.75,"ignoreChildren":0}}],"children":[]},{"tileIndex":0,"x":9,"y":12,"xOffset":1,"yOffset":0,"hueOffset":506,"rotation":0,"zIndex":0,"effects":[{"name":"HueShift","params":{"speed":1,"amplitude":360,"offset":0,"ignoreChildren":0}}],"children":[{"tileIndex":11,"x":0,"y":0,"xOffset":20,"yOffset":5,"hueOffset":506,"rotation":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":20,"offset":0,"ignoreChildren":0}},{"name":"WaveY","params":{"speed":1,"amplitude":20,"offset":0.25,"ignoreChildren":0}}],"children":[]},{"tileIndex":10,"x":0,"y":0,"xOffset":2,"yOffset":15,"hueOffset":506,"rotation":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":20,"offset":0.5,"ignoreChildren":0}},{"name":"WaveY","params":{"speed":1,"amplitude":20,"offset":0.75,"ignoreChildren":0}}],"children":[]}]}],"hueOffset":170,"rotation":0},"vars":{"frames":48}}

// bluebot
// {"root":{"tileIndex":4,"x":4,"y":5,"xOffset":0,"yOffset":0,"zIndex":1,"effects":[{"name":"WaveX","params":{"speed":1,"amplitude":1,"offset":0}},{"name":"HueShift","params":{"speed":0,"amplitude":200,"offset":0,"ignoreChildren":0}}],"children":[{"tileIndex":1,"x":3,"y":2,"xOffset":0,"yOffset":2,"zIndex":50,"effects":[{"name":"WaveY","params":{"speed":1,"amplitude":2,"offset":0.25}},{"name":"Shading","params":{}}],"children":[{"tileIndex":0,"x":8,"y":13,"xOffset":0,"yOffset":2,"hueOffset":200,"rotation":0,"zIndex":1,"effects":[],"children":[{"tileIndex":0,"x":9,"y":8,"xOffset":0,"yOffset":2,"hueOffset":200,"rotation":0,"zIndex":1,"effects":[],"children":[]}]}],"hueOffset":200,"rotation":0},{"tileIndex":2,"x":3,"y":15,"xOffset":0,"yOffset":0,"zIndex":1,"effects":[],"children":[{"tileIndex":2,"x":9,"y":15,"xOffset":0,"yOffset":0,"hueOffset":200,"rotation":0,"zIndex":1,"effects":[],"children":[]}],"hueOffset":200,"rotation":0},{"tileIndex":2,"x":15,"y":15,"xOffset":0,"yOffset":0,"zIndex":1,"effects":[],"children":[],"hueOffset":200,"rotation":0},{"tileIndex":0,"x":16,"y":14,"xOffset":0,"yOffset":0,"zIndex":1,"effects":[{"name":"WaveY","params":{"speed":2,"amplitude":1,"offset":0}}],"children":[],"hueOffset":200,"rotation":0},{"tileIndex":3,"x":16,"y":5,"xOffset":0,"yOffset":0,"zIndex":1,"effects":[{"name":"WaveY","params":{"speed":1,"amplitude":1,"offset":0}},{"name":"Shading","params":{}}],"children":[{"tileIndex":3,"x":12,"y":5,"xOffset":0,"yOffset":0,"hueOffset":200,"rotation":3.141592653589793,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":180,"ignoreChildren":0}}],"children":[]}],"hueOffset":200,"rotation":0}],"hueOffset":200,"rotation":0},"vars":{"frames":24}}

// core
// {"root":{"tileIndex":4,"x":4,"y":5,"xOffset":0,"yOffset":0,"zIndex":1,"effects":[],"children":[{"tileIndex":7,"x":3,"y":13,"xOffset":0,"yOffset":0,"zIndex":50,"effects":[],"children":[{"tileIndex":7,"x":3,"y":4,"xOffset":0,"yOffset":0,"hueOffset":0,"rotation":1.5707963267948966,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":90,"ignoreChildren":0}}],"children":[]},{"tileIndex":7,"x":12,"y":4,"xOffset":0,"yOffset":0,"hueOffset":0,"rotation":3.141592653589793,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":180,"ignoreChildren":0}}],"children":[]},{"tileIndex":7,"x":12,"y":13,"xOffset":0,"yOffset":0,"hueOffset":0,"rotation":4.71238898038469,"zIndex":1,"effects":[{"name":"Rotation","params":{"speed":0,"offset":270,"ignoreChildren":0}}],"children":[]}],"hueOffset":0,"rotation":0},{"tileIndex":6,"x":9,"y":9,"xOffset":0,"yOffset":0,"hueOffset":0,"rotation":0,"zIndex":1,"effects":[],"children":[]}],"hueOffset":0,"rotation":0},"vars":{"frames":24}}