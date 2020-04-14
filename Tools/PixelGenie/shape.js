var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shape = (function () {
    function Shape(x, y) {
        this.x = x;
        this.y = y;
        this.zScale = 1;
        this.rotation = 0;
    }
    Shape.prototype.WrapParam = function (n) {
        if (n > 0.5)
            return n - 1;
        if (n < -0.5)
            return n + 1;
        return n;
    };
    Shape.prototype.GetHeight = function (x, y) {
        x -= this.x;
        y -= this.y;
        x = this.WrapParam(x);
        y = this.WrapParam(y);
        if (this.rotation !== 0) {
            var angle = Math.atan2(y, x) + this.rotation / 180 * Math.PI;
            var radius = Math.sqrt(x * x + y * y);
            x = radius * Math.cos(angle);
            y = radius * Math.sin(angle);
        }
        var z = this.zScale * this.GetHeightAt(x, y);
        if (isNaN(z))
            return 0;
        return Math.min(1, Math.max(0, z));
    };
    return Shape;
}());
Shape.defaults = { r: 0.1, innerR: 0.05, h: 0.3, w: 0.4, sides: 5, truncateRatio: 0.5, thickness: 0.5 };
var Cone = (function (_super) {
    __extends(Cone, _super);
    function Cone(x, y, r) {
        var _this = _super.call(this, x, y) || this;
        _this.r = r;
        return _this;
    }
    Cone.prototype.GetHeightAt = function (x, y) {
        return this.r - Math.sqrt(x * x + y * y);
    };
    return Cone;
}(Shape));
var TruncCone = (function (_super) {
    __extends(TruncCone, _super);
    function TruncCone(x, y, r, innerR) {
        var _this = _super.call(this, x, y) || this;
        _this.r = r;
        _this.innerR = innerR;
        return _this;
    }
    TruncCone.prototype.GetHeightAt = function (x, y) {
        return Math.min(this.r - Math.sqrt(x * x + y * y), this.innerR);
    };
    return TruncCone;
}(Shape));
var Pyramid = (function (_super) {
    __extends(Pyramid, _super);
    function Pyramid(x, y, r) {
        var _this = _super.call(this, x, y) || this;
        _this.r = r;
        return _this;
    }
    Pyramid.prototype.GetHeightAt = function (x, y) {
        return this.r - Math.abs(x) - Math.abs(y);
    };
    return Pyramid;
}(Shape));
var GenericPyramid = (function (_super) {
    __extends(GenericPyramid, _super);
    function GenericPyramid(x, y, r, sides, truncateRatio) {
        var _this = _super.call(this, x, y) || this;
        _this.r = r;
        _this.sides = sides;
        _this.truncateRatio = truncateRatio;
        _this.radPerFace = 2 * Math.PI / sides;
        _this.faceLength = r * Math.cos(_this.radPerFace / 2);
        for (var i = 0; i < sides; i++) {
            var p1 = { x: r * Math.cos(_this.radPerFace * i), y: r * Math.sin(_this.radPerFace * i) };
            var p2 = { x: r * Math.cos(_this.radPerFace * (i + 1)), y: r * Math.sin(_this.radPerFace * (i + 1)) };
        }
        return _this;
    }
    GenericPyramid.prototype.GetHeightAt = function (x, y) {
        var theta = Math.atan2(y, x);
        var radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var faceIndex = Math.floor(theta / this.radPerFace);
        var faceAngle = (faceIndex + 0.5) * this.radPerFace;
        var deltaTheta = theta - faceAngle;
        var xOffset = Math.cos(deltaTheta) * radius;
        var xRatio = xOffset / this.faceLength;
        var z = this.r * (1 - xRatio);
        z = Math.min(z, (1 - this.truncateRatio) * this.r);
        return z;
    };
    return GenericPyramid;
}(Shape));
var Sphere = (function (_super) {
    __extends(Sphere, _super);
    function Sphere(x, y, r) {
        var _this = _super.call(this, x, y) || this;
        _this.r = r;
        return _this;
    }
    Sphere.prototype.GetHeightAt = function (x, y) {
        return Math.sqrt(-x * x - y * y + Math.pow(this.r, 2));
    };
    return Sphere;
}(Shape));
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, w, h, thickness) {
        var _this = _super.call(this, x, y) || this;
        _this.w = w;
        _this.h = h;
        _this.thickness = thickness;
        return _this;
    }
    Rectangle.prototype.GetHeightAt = function (x, y) {
        if (x <= this.w / 2 && x >= -this.w / 2 && y <= this.h / 2 && y >= -this.h / 2) {
            return this.thickness;
        }
        return 0;
    };
    return Rectangle;
}(Shape));
var Cylinder = (function (_super) {
    __extends(Cylinder, _super);
    function Cylinder(x, y, r, h) {
        var _this = _super.call(this, x, y) || this;
        _this.r = r;
        _this.h = h;
        return _this;
    }
    Cylinder.prototype.GetHeightAt = function (x, y) {
        if (y > this.h / 2 || y < -this.h / 2)
            return 0;
        return Math.sqrt(-x * x + Math.pow(this.r, 2));
    };
    return Cylinder;
}(Shape));
var RoundedBlock = (function (_super) {
    __extends(RoundedBlock, _super);
    function RoundedBlock(x, y, w, h, r) {
        var _this = _super.call(this, x, y) || this;
        _this.w = w;
        _this.h = h;
        _this.r = r;
        _this.subshapes = [];
        _this.subshapes.push(new Sphere(w / 2 - r, h / 2 - r, r));
        _this.subshapes.push(new Sphere(w / 2 - r, -h / 2 + r, r));
        _this.subshapes.push(new Sphere(-w / 2 + r, -h / 2 + r, r));
        _this.subshapes.push(new Sphere(-w / 2 + r, h / 2 - r, r));
        _this.subshapes.push(new Rectangle(0, 0, w - r * 2, h - r * 2, r));
        var c1 = new Cylinder(0, -h / 2 + r, r, w - r * 2);
        c1.rotation = 90;
        var c2 = new Cylinder(0, h / 2 - r, r, w - r * 2);
        c2.rotation = 90;
        _this.subshapes.push(c1, c2);
        _this.subshapes.push(new Cylinder(-w / 2 + r, 0, r, h - r * 2));
        _this.subshapes.push(new Cylinder(w / 2 - r, 0, r, h - r * 2));
        return _this;
    }
    RoundedBlock.prototype.GetHeightAt = function (x, y) {
        return Math.max.apply(Math, this.subshapes.map(function (s) { return s.GetHeight(x, y); }));
    };
    return RoundedBlock;
}(Shape));
var HalfSphere = (function (_super) {
    __extends(HalfSphere, _super);
    function HalfSphere(x, y, w, h) {
        var _this = _super.call(this, x, y) || this;
        _this.subshapes = [];
        _this.subshapes.push(new Sphere(0, 0, w));
        _this.subshapes.push(new Rectangle(w / 2, 0, w, 1, 1));
        return _this;
    }
    HalfSphere.prototype.GetHeightAt = function (x, y) {
        return Math.min.apply(Math, this.subshapes.map(function (s) { return s.GetHeight(x, y); }));
    };
    return HalfSphere;
}(Shape));
var MeshGrid = (function (_super) {
    __extends(MeshGrid, _super);
    function MeshGrid(x, y, w, h, nodes) {
        var _this = _super.call(this, x, y) || this;
        _this.w = w;
        _this.h = h;
        _this.nodes = nodes;
        return _this;
    }
    MeshGrid.prototype.PadNodePerimter = function (val) {
        // surrounds node array with provided value
        this.nodes.forEach(function (line) {
            line.push(val);
            line.unshift(val);
        });
        this.nodes.push(this.nodes[0].map(function (x) { return val; }));
        this.nodes.unshift(this.nodes[0].map(function (x) { return val; }));
    };
    MeshGrid.prototype.GetHeightAt = function (x, y) {
        x += this.w / 2;
        y += this.h / 2;
        if (x >= this.w || x < 0)
            return 0;
        if (y >= this.h || y < 0)
            return 0;
        var nodeWidth = this.w / (this.nodes[0].length - 1);
        var nodeHeight = this.h / (this.nodes.length - 1);
        var xIndex = Math.floor(x / nodeWidth);
        var yIndex = Math.floor(y / nodeHeight);
        var v1 = this.nodes[yIndex][xIndex];
        var v2 = this.nodes[yIndex][xIndex + 1];
        var v3 = this.nodes[yIndex + 1][xIndex];
        var v4 = this.nodes[yIndex + 1][xIndex + 1];
        var a1 = WeightedAvg(v1, v2, (x % nodeWidth) / nodeWidth);
        var a2 = WeightedAvg(v3, v4, (x % nodeWidth) / nodeWidth);
        var r = WeightedAvg(a1, a2, (y % nodeHeight) / nodeHeight);
        return r;
        /*        x1   x   x2
                  |        |
            y1 ---v1---a1--v2--
                  |        |
                  |        |
            y     |    r   |
            y2 ---v3---a2--v4--
                  |        |
        */
    };
    return MeshGrid;
}(Shape));
//# sourceMappingURL=shape.js.map