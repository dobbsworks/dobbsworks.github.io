var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GeneratorParameter = (function () {
    function GeneratorParameter(parentGenerator, name, defaultVal) {
        this.name = name;
        this.defaultVal = defaultVal;
        parentGenerator.parameters.push(this);
    }
    GeneratorParameter.prototype.GetVal = function () {
        var input = document.getElementById(this.name);
        var val = this.defaultVal;
        if (input) {
            val = parseFloat(input.value);
        }
        return val;
    };
    GeneratorParameter.prototype.ToInputEl = function () {
        var input = document.createElement("input");
        input.value = this.defaultVal.toString();
        input.type = "number";
        input.id = this.name;
        input.className = "generatorParameter";
        return input;
    };
    GeneratorParameter.prototype.ToHtmlRow = function () {
        var row = document.createElement("div");
        row.className = "row";
        var input = this.ToInputEl();
        var span = document.createElement("span");
        span.innerText = this.name;
        row.appendChild(input);
        row.appendChild(span);
        // Collapse matching min/max input boxes
        if (input.id.indexOf(" Max") > -1) {
            var match = document.getElementById(input.id.replace(" Max", " Min"));
            if (match) {
                match.parentElement.remove();
                row.insertBefore(match, input);
                span.innerText = this.name.replace(" Max", " Range");
            }
        }
        return row;
    };
    return GeneratorParameter;
}());
var HeightGenerator = (function () {
    function HeightGenerator() {
        this.parameters = [];
        this.useShapeType = false;
        this.description = "";
    }
    HeightGenerator.prototype.GetNormal = function (x, y) {
        var offset = 0.0001;
        var xa = this.GetHeight(x - offset, y);
        var xb = this.GetHeight(x + offset, y);
        var ya = this.GetHeight(x, y - offset);
        var yb = this.GetHeight(x, y + offset);
        return new Vector(xa - xb, ya - yb, (offset * 2)).Normalize();
    };
    HeightGenerator.prototype.GetParam = function (paramName) {
        return this.parameters.find(function (x) { return x.name === paramName; });
    };
    return HeightGenerator;
}());
var DemoGenerator = (function (_super) {
    __extends(DemoGenerator, _super);
    function DemoGenerator() {
        var _this = _super.call(this) || this;
        _this.shapes = [];
        _this.description = "Sample of shapes to demonstrate how the defined palette's color stops are applied to the generated height map. Generates a Sphere, Cone, TruncCone, and Pyramid.";
        _this.shapes.push(new Sphere(0.25, 0.25, 0.25));
        _this.shapes.push(new Cone(0.75, 0.25, 0.25));
        _this.shapes.push(new TruncCone(0.25, 0.75, 0.25, 0.025));
        _this.shapes.push(new Pyramid(0.75, 0.75, 0.25));
        return _this;
    }
    DemoGenerator.prototype.GetHeight = function (x, y) {
        return Math.max.apply(Math, this.shapes.map(function (s) { return s.GetHeight(x, y); }));
    };
    return DemoGenerator;
}(HeightGenerator));
var BrickGenerator = (function (_super) {
    __extends(BrickGenerator, _super);
    function BrickGenerator() {
        var _this = _super.call(this) || this;
        _this.description = "A streamlined version of the ShapeArray generator that only uses the RoundedBlock shape. Useful for quick results over fine-tuning.";
        _this.shapes = [];
        var bricksPerRow = new GeneratorParameter(_this, "Bricks Per Row", 2).GetVal();
        var rowsPerTile = new GeneratorParameter(_this, "Rows Per Tile", 4).GetVal();
        var extraWidthMin = new GeneratorParameter(_this, "Extra Width Min", 0).GetVal();
        var extraWidthMax = new GeneratorParameter(_this, "Extra Width Max", 0.2).GetVal();
        var extraHeightMin = new GeneratorParameter(_this, "Extra Height Min", 0).GetVal();
        var extraHeightMax = new GeneratorParameter(_this, "Extra Height Max", 0.1).GetVal();
        var roundingMin = new GeneratorParameter(_this, "Rounding Min", 0.05).GetVal();
        var roundingMax = new GeneratorParameter(_this, "Rounding Max", 0.125).GetVal();
        var brickWidth = 1 / bricksPerRow;
        var brickHeight = 1 / rowsPerTile;
        for (var x = 0; x < bricksPerRow; x++) {
            for (var y = 0; y < rowsPerTile; y++) {
                var brickX = (x + (y % 2 === 0 ? 0 : 0.5)) * brickWidth;
                var brickY = y * brickHeight;
                var brick = _this.MakeBrick(brickX, brickY, brickWidth + extraWidthMin, brickWidth + extraWidthMax, brickHeight + extraHeightMin, brickHeight + extraHeightMax, roundingMin, roundingMax);
                _this.shapes.push(brick);
            }
        }
        return _this;
    }
    BrickGenerator.prototype.MakeBrick = function (x, y, minW, maxW, minH, maxH, minR, maxR) {
        var w = RandBetween(minW, maxW);
        var h = RandBetween(minH, maxH);
        var r = RandBetween(minR, maxR);
        var b = new RoundedBlock(x, y + 0.25, w, h, r);
        b.zScale *= 1 + Math.random();
        return b;
    };
    BrickGenerator.prototype.GetHeight = function (x, y) {
        return Math.max.apply(Math, this.shapes.map(function (s) { return s.GetHeight(x, y); }));
    };
    return BrickGenerator;
}(HeightGenerator));
var BubbleGenerator = (function (_super) {
    __extends(BubbleGenerator, _super);
    function BubbleGenerator() {
        var _this = _super.call(this) || this;
        _this.description = "A streamlined version of the ShapeScatter generator that only uses the Sphere shape. Useful for quick results over fine-tuning.";
        _this.shapes = [];
        var bubbleCount = new GeneratorParameter(_this, "Bubble Count", 60).GetVal();
        var radiusMin = new GeneratorParameter(_this, "Radius Min", 0.125).GetVal();
        var radiusMax = new GeneratorParameter(_this, "Radius Max", 0.2).GetVal();
        for (var i = 0; i < bubbleCount; i++) {
            var sphere = new Sphere(Math.random(), Math.random(), RandBetween(radiusMin, radiusMax));
            sphere.zScale = Math.random();
            _this.shapes.push(sphere);
        }
        return _this;
    }
    BubbleGenerator.prototype.GetHeight = function (x, y) {
        return Math.max.apply(Math, this.shapes.map(function (s) { return s.GetHeight(x, y); }));
    };
    return BubbleGenerator;
}(HeightGenerator));
var LeafGenerator = (function (_super) {
    __extends(LeafGenerator, _super);
    function LeafGenerator() {
        var _this = _super.call(this) || this;
        _this.description = "A streamlined version of the ShapeScatter generator that only uses the HalfSphere shape. Useful for quick results over fine-tuning.";
        _this.shapes = [];
        var leafCount = new GeneratorParameter(_this, "Leaf Count", 20).GetVal();
        var leafWidthMin = new GeneratorParameter(_this, "Leaf Width Min", 0.125).GetVal();
        var leafWidthMax = new GeneratorParameter(_this, "Leaf Width Max", 0.25).GetVal();
        var leafHeightMin = new GeneratorParameter(_this, "Leaf Height Min", 0.25).GetVal();
        var leafHeightMax = new GeneratorParameter(_this, "Leaf Height Max", 0.5).GetVal();
        var rotationMin = new GeneratorParameter(_this, "Rotation Min (degrees)", -45).GetVal();
        var rotationMax = new GeneratorParameter(_this, "Rotation Max (degrees)", 45).GetVal();
        for (var i = 0; i < leafCount; i++) {
            var l = new HalfSphere(Math.random(), Math.random(), RandBetween(leafWidthMin, leafWidthMax), RandBetween(leafHeightMin, leafHeightMax));
            l.rotation = RandBetween(rotationMin, rotationMax);
            l.zScale = Math.random() * Math.random();
            _this.shapes.push(l);
        }
        return _this;
    }
    LeafGenerator.prototype.GetHeight = function (x, y) {
        return Math.max.apply(Math, this.shapes.map(function (s) { return s.GetHeight(x, y); }));
    };
    return LeafGenerator;
}(HeightGenerator));
var BarkGenerator = (function (_super) {
    __extends(BarkGenerator, _super);
    function BarkGenerator() {
        var _this = _super.call(this) || this;
        _this.description = "Generates a bark-like tree texture.";
        _this.shapes = [];
        var zScale = new GeneratorParameter(_this, "zScale", 0.5).GetVal();
        var vertSmooth = new GeneratorParameter(_this, "Vertical smoothing", 2).GetVal();
        var granularity = new GeneratorParameter(_this, "Granularity", 32).GetVal();
        var noise = new GeneratorParameter(_this, "Noise", 0.125).GetVal();
        var nodes = [];
        var rows = granularity / Math.pow(2, vertSmooth) - 1;
        rows = Math.max(2, rows);
        for (var i = 0; i < rows; i++) {
            var line = [];
            for (var j = 0; j < granularity; j++) {
                var noiseRatio = RandBetween(1 - noise, 1);
                var z = Math.sqrt(-(Math.pow((j / granularity - 0.5), 2)) + Math.pow(0.5, 2));
                line.push(noiseRatio * z);
            }
            nodes.push(line);
        }
        nodes.push(nodes[0]); //loop vertically
        var m = new MeshGrid(0.5, 0.49, 1, 1.01, nodes);
        m.zScale = zScale;
        _this.shapes.push(m);
        return _this;
    }
    BarkGenerator.prototype.GetHeight = function (x, y) {
        return Math.max.apply(Math, this.shapes.map(function (s) { return s.GetHeight(x, y); }));
    };
    return BarkGenerator;
}(HeightGenerator));
var ArgRange = (function () {
    function ArgRange(prop, min, max) {
        this.prop = prop;
        this.min = min;
        this.max = max;
    }
    return ArgRange;
}());
var ShapeGenerator = (function (_super) {
    __extends(ShapeGenerator, _super);
    function ShapeGenerator() {
        var _this = _super.call(this) || this;
        _this.shapes = [];
        _this.useShapeType = true;
        _this.argRanges = [];
        _this.shapeName = document.getElementById("shapeType").value;
        var shapeType = window[_this.shapeName];
        var args = GetFuncArgs(shapeType);
        if (args.indexOf("nodes") > -1)
            throw "Can't create generator";
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var arg = args_1[_i];
            var def = null;
            if (shapeType.defaults[arg])
                def = shapeType.defaults[arg];
            var argMin = new GeneratorParameter(_this, arg + " Min", def === null ? 0 : def).GetVal();
            var argMax = new GeneratorParameter(_this, arg + " Max", def === null ? 1 : def).GetVal();
            _this.argRanges.push(new ArgRange(arg, argMin, argMax));
        }
        _this.rotateMin = new GeneratorParameter(_this, "Rotation Min (degrees)", 0).GetVal();
        _this.rotateMax = new GeneratorParameter(_this, "Rotation Max (degrees)", 0).GetVal();
        _this.zScaleMin = new GeneratorParameter(_this, "Z Scale Min", 1).GetVal();
        _this.zScaleMax = new GeneratorParameter(_this, "Z Scale Max", 1).GetVal();
        return _this;
    }
    ShapeGenerator.prototype.AddShape = function (params) {
        var myShape = Create(this.shapeName, params);
        myShape.rotation = RandBetween(this.rotateMin, this.rotateMax);
        myShape.zScale = RandBetween(this.zScaleMin, this.zScaleMax);
        this.shapes.push(myShape);
    };
    ShapeGenerator.prototype.GetHeight = function (x, y) {
        return Math.max.apply(Math, this.shapes.map(function (s) { return s.GetHeight(x, y); }));
    };
    ShapeGenerator.prototype.GetArg = function (argName) {
        return this.argRanges.find(function (x) { return x.prop === argName; });
    };
    return ShapeGenerator;
}(HeightGenerator));
var SingleShape = (function (_super) {
    __extends(SingleShape, _super);
    function SingleShape() {
        var _this = _super.call(this) || this;
        _this.description = "Displays a single shape from provided parameters (no random ranges).";
        _this.parameters = _this.parameters.filter(function (x) { return x.name.indexOf(" Max") === -1; });
        _this.rotateMax = _this.rotateMin;
        _this.zScaleMax = _this.zScaleMin;
        _this.AddShape(_this.argRanges.map(function (x) { return x.min; }));
        return _this;
    }
    return SingleShape;
}(ShapeGenerator));
var ShapeScatter = (function (_super) {
    __extends(ShapeScatter, _super);
    function ShapeScatter() {
        var _this = _super.call(this) || this;
        _this.description = "Randomly distributes a set of shapes across the provided x-y range.";
        var numElements = new GeneratorParameter(_this, "Object Count", 5).GetVal();
        for (var i = 0; i < numElements; i++) {
            var shapeArgs = [];
            for (var _i = 0, _a = _this.argRanges; _i < _a.length; _i++) {
                var argRange = _a[_i];
                shapeArgs.push(RandBetween(argRange.min, argRange.max));
            }
            _this.AddShape(shapeArgs);
        }
        return _this;
    }
    return ShapeScatter;
}(ShapeGenerator));
var ShapeArray = (function (_super) {
    __extends(ShapeArray, _super);
    function ShapeArray() {
        var _this = _super.call(this) || this;
        _this.description = "Uniformly distributes a set of shapes across the provided x-y range in a grid.";
        var numRows = new GeneratorParameter(_this, "Row Count", 5).GetVal();
        var numCols = new GeneratorParameter(_this, "Col Count", 5).GetVal();
        var minX = _this.GetArg("x").min;
        var maxX = _this.GetArg("x").max;
        var minY = _this.GetArg("y").min;
        var maxY = _this.GetArg("y").max;
        var xJitterMin = new GeneratorParameter(_this, "x Jitter per shape Min", 0).GetVal();
        var xJitterMax = new GeneratorParameter(_this, "x Jitter per shape Max", 0).GetVal();
        var yJitterMin = new GeneratorParameter(_this, "y Jitter per shape Min", 0).GetVal();
        var yJitterMax = new GeneratorParameter(_this, "y Jitter per shape Max", 0).GetVal();
        var xOffsetPerRow = new GeneratorParameter(_this, "x Offset Per Row", 0.2).GetVal();
        var yOffsetPerCol = new GeneratorParameter(_this, "y Offset Per Column", 0).GetVal();
        for (var i = 0; i < numRows; i++) {
            var xOffset = i * xOffsetPerRow;
            for (var j = 0; j < numCols; j++) {
                var yOffset = j * yOffsetPerCol;
                var shapeArgs = [];
                for (var _i = 0, _a = _this.argRanges; _i < _a.length; _i++) {
                    var argRange = _a[_i];
                    if (argRange.prop === "x") {
                        shapeArgs.push(j / numCols * (maxX - minX) + minX + RandBetween(xJitterMin, xJitterMax) + xOffset);
                    }
                    else if (argRange.prop === "y") {
                        shapeArgs.push(i / numRows * (maxY - minY) + minY + RandBetween(yJitterMin, yJitterMax) + yOffset);
                    }
                    else {
                        shapeArgs.push(RandBetween(argRange.min, argRange.max));
                    }
                }
                _this.AddShape(shapeArgs);
            }
        }
        return _this;
    }
    return ShapeArray;
}(ShapeGenerator));
//# sourceMappingURL=generator.js.map