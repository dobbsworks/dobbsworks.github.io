var Vector = (function () {
    function Vector(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector.prototype.GetMagnitude = function () {
        var m = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
        if (m !== 0)
            return m;
        return m;
    };
    Vector.prototype.Normalize = function () {
        var m = this.GetMagnitude();
        this.x /= m;
        this.y /= m;
        this.z /= m;
        return this;
    };
    Vector.prototype.Add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    };
    Vector.prototype.Scale = function (n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    };
    Vector.prototype.DotProduct = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };
    Vector.prototype.AngleBetween = function (v) {
        return Math.acos(this.DotProduct(v) / (this.GetMagnitude() * v.GetMagnitude()));
    };
    return Vector;
}());
function ChangeHeightGenerator(generator) {
    noise = new generator();
    cache = {};
}
var canvas1, ctx1, outputCanvas, outputCtx, noise, colorThresholdHtmlTemplate, colorThresholdContainer, light;
window.onload = function () {
    outputCanvas = document.getElementById("outputCanvas");
    outputCtx = outputCanvas.getContext("2d");
    canvas1 = document.getElementById("canvas1");
    ctx1 = canvas1.getContext("2d");
    ctx1.imageSmoothingEnabled = false;
    noise = new DemoGenerator();
    colorThresholdHtmlTemplate = document.getElementById("colorThresholdTemplate").innerHTML;
    colorThresholdContainer = document.getElementById("colorThresholds");
    PopulateDropDownFromSubClasses("generatorType", HeightGenerator, true);
    PopulateDropDownFromSubClasses("shapeType", Shape, true);
    PopulateDropDownFromSubClasses("renderType", Renderer, true);
    var lightInputs = document.getElementsByClassName("lightVector");
    for (var i = 0; i < lightInputs.length; i++)
        (lightInputs[i]).onchange = UpdateLightVector;
    UpdateGeneratorParameterPanel();
    GeneratePalette();
    UpdateLightVector();
    DrawLoop();
    canvas1.onmousemove = function (e) { OnMouseEvent(e, true, false); };
    canvas1.onmousedown = function (e) { OnMouseEvent(e, false, true); };
    canvas1.onmousewheel = function (e) {
        var zInput = document.getElementById("lightVectorZ");
        zInput.value = (parseFloat(zInput.value) + (e.wheelDelta < 0 ? 0.01 : -0.01)).toFixed(3);
        UpdateLightVector();
    };
};
function DrawLoop() {
    requestAnimationFrame(function () {
        draw(noise, light);
        DrawLoop();
    });
}
function Regenerate() {
    var generatorSelect = document.getElementById("generatorType");
    var selectedGeneratorName = generatorSelect.value;
    ChangeHeightGenerator(window[selectedGeneratorName]);
}
function UpdateGeneratorParameterPanel() {
    var genParams = document.getElementsByClassName("generatorParameter");
    var container = document.getElementById("generatorParameters");
    try {
        var oldParams = {};
        for (var i = 0; i < genParams.length; i++) {
            var key = genParams[i].id;
            var val = genParams[i].value;
            oldParams[key] = val;
        }
        container.innerHTML = "";
        var generatorSelect = document.getElementById("generatorType");
        var generatorType = (window[generatorSelect.value]);
        var generator = new generatorType();
        var shapeSelect = document.getElementById("shapeType");
        if (generator.useShapeType) {
            shapeSelect.style.display = "initial";
        }
        else {
            shapeSelect.style.display = "none";
        }
        var descrSpan = document.getElementById("generatorDescription");
        descrSpan.innerText = generator.description;
        for (var _i = 0, _a = generator.parameters; _i < _a.length; _i++) {
            var param = _a[_i];
            container.appendChild(param.ToHtmlRow());
        }
        if (generator.parameters.length === 0) {
            container.innerHTML = "For generators with parameters, controls will appear here.";
        }
        for (var key in oldParams) {
            var input = document.getElementById(key);
            if (input)
                input.value = oldParams[key];
        }
    }
    catch (e) {
        container.innerHTML = "Unable to prepare generator for selected options.";
    }
}
function OnMouseEvent(e, isMove, isClick) {
    var lockLightCheckbox = document.getElementById("lockLight");
    var fireOnMove = !lockLightCheckbox.checked;
    if (isClick)
        lockLightCheckbox.checked = !lockLightCheckbox.checked;
    if (!fireOnMove && !isClick)
        return;
    var pageX = e.pageX;
    var pageY = e.pageY;
    for (var node = canvas1; node != null; node = node.offsetParent) {
        if (node.offsetLeft)
            pageX -= node.offsetLeft;
        if (node.offsetTop)
            pageY -= node.offsetTop;
    }
    var x = pageX / canvas1.width;
    var y = pageY / canvas1.height;
    var xInput = document.getElementById("lightVectorX");
    var yInput = document.getElementById("lightVectorY");
    var zInput = document.getElementById("lightVectorZ");
    xInput.value = (x * 2 - 1).toFixed(3);
    yInput.value = (y * 2 - 1).toFixed(3);
    UpdateLightVector();
    draw(noise, light);
}
function UpdateLightVector() {
    var xInput = document.getElementById("lightVectorX");
    var yInput = document.getElementById("lightVectorY");
    var zInput = document.getElementById("lightVectorZ");
    light = new Vector(parseFloat(xInput.value), parseFloat(yInput.value), parseFloat(zInput.value));
}
var cache = {};
function draw(noise, lightVector) {
    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    var colorStops = GetColorStopsFromPage();
    var lightPoint = new Vector(lightVector.x, lightVector.y, lightVector.z);
    for (var x = 0; x < outputCanvas.width; x++) {
        for (var y = 0; y < outputCanvas.height; y++) {
            var cached = cache[x + " " + y];
            if (!cached) {
                cached = cache[x + " " + y] = {
                    v: noise.GetNormal(x / outputCanvas.width, y / outputCanvas.height),
                    z: noise.GetHeight(x / outputCanvas.width, y / outputCanvas.height)
                };
            }
            var normal = cached.v;
            var z = cached.z;
            var renderTypeName = document.getElementById("renderType").value;
            var renderer = (new window[renderTypeName]());
            var position = new Vector(x / outputCanvas.width, y / outputCanvas.height, z);
            var color = renderer.GetColor(lightPoint, normal, position, colorStops);
            outputCtx.fillStyle = color;
            outputCtx.fillRect(x, y, 1, 1);
        }
    }
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx1.drawImage(outputCanvas, 0, 0, canvas1.width, canvas1.height);
    ClipToImage();
}
function ClipToImage() {
    var width = outputCanvas.width;
    var height = outputCanvas.height;
    var tileCanvas = document.getElementById("tileCanvas");
    tileCanvas.width = width * 3;
    tileCanvas.height = height * 3;
    var tileCtx = tileCanvas.getContext("2d");
    tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);
    for (var _i = 0, _a = [0, 1, 2]; _i < _a.length; _i++) {
        var x = _a[_i];
        for (var _b = 0, _c = [0, 1, 2]; _b < _c.length; _b++) {
            var y = _c[_b];
            tileCtx.drawImage(canvas1, width * x, height * y, width, height);
        }
    }
    var outputImage = document.getElementById("output");
    outputImage.width = width;
    outputImage.height = height;
    outputImage.src = outputCanvas.toDataURL("image/png");
}
function ResizeCanvases() {
    var width = parseInt(document.getElementById("tileWidth").value);
    var height = parseInt(document.getElementById("tileHeight").value);
    outputCanvas.width = width;
    outputCanvas.height = height;
    canvas1.width = 640;
    canvas1.height = 640 / width * height;
    ctx1.imageSmoothingEnabled = false;
    cache = {};
}
function CreateMeshFromCurrentHeightMap(w, h) {
    var ret = [];
    for (var y = 0; y <= 1; y += 1 / h) {
        var line = [];
        for (var x = 0; x <= 1; x += 1 / w) {
            var z = noise.GetHeight(x, y);
            line.push(z);
        }
        ret.push(line);
    }
    return ret;
}
function PopulateDropDownFromSubClasses(selectId, baseClass, ignoreExtendedClasses) {
    var generatorSelect = document.getElementById(selectId);
    for (var _i = 0, _a = GetSubClasses(baseClass, ignoreExtendedClasses); _i < _a.length; _i++) {
        var type = _a[_i];
        var option = document.createElement("option");
        option.value = type.name;
        option.text = type.name;
        generatorSelect.appendChild(option);
    }
}
//# sourceMappingURL=app.js.map