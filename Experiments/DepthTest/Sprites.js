var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function () {
    function Point(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Point.prototype.copy = function () { return new Point(this.x, this.y, this.z); };
    Point.prototype.moveBy = function (p) {
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;
    };
    Point.prototype.plus = function (a, b, c) {
        return new Point(this.x + a, this.y + b, this.z + c);
    };
    Point.prototype.times = function (ratio) { return this.arithOp(function (n) { return n * ratio; }); };
    Point.prototype.floor = function () { return this.arithOp(function (n) { return Math.floor(n); }); };
    Point.prototype.ceil = function () { return this.arithOp(function (n) { return Math.ceil(n); }); };
    Point.prototype.tileAt = function () {
        var arr = world.mapData[Math.floor(this.z)];
        if (!arr)
            return tileTypes[0];
        var line = arr[Math.floor(this.y)];
        if (!line)
            return tileTypes[0];
        var cell = line[Math.floor(this.x)];
        if (!cell)
            return tileTypes[0];
        return tileTypes[cell];
    };
    Point.prototype.arithOp = function (func) {
        return new Point(func(this.x), func(this.y), func(this.z));
    };
    return Point;
}());
var Region = (function () {
    function Region(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        var a = this.point1;
        var b = this.point2;
        this.upperLeft = new Point(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z)).floor();
        this.lowerRight = new Point(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z)).ceil();
    }
    Region.prototype.toIntegerPointList = function () {
        var ret = [];
        for (var x = this.upperLeft.x; x < this.lowerRight.x; x++)
            for (var y = this.upperLeft.y; y < this.lowerRight.y; y++)
                for (var z = this.upperLeft.z; z <= this.lowerRight.z; z++)
                    ret.push(new Point(x, y, z));
        return ret;
    };
    Region.prototype.applyOperation = function (func) {
        this.toIntegerPointList().map(function (p) {
            try {
                func(p.x, p.y, p.z);
            }
            catch (e) { }
        });
    };
    Region.prototype.draw = function (scaling, cellSize, cameraLocation) {
        ctx.fillStyle = "rgba(255,255,0,0.3)";
        ctx.strokeStyle = "rgba(255,255,0,1)";
        var ulCoord = TranslateToCanvasCoordinates(scaling, cellSize, cameraLocation.x, cameraLocation.y, this.upperLeft.x, this.upperLeft.y);
        var lrCoord = TranslateToCanvasCoordinates(scaling, cellSize, cameraLocation.x, cameraLocation.y, this.lowerRight.x, this.lowerRight.y);
        ctx.fillRect(ulCoord.x, ulCoord.y, lrCoord.x - ulCoord.x, lrCoord.y - ulCoord.y);
        ctx.strokeRect(ulCoord.x, ulCoord.y, lrCoord.x - ulCoord.x, lrCoord.y - ulCoord.y);
    };
    return Region;
}());
var Sprite = (function () {
    function Sprite(location) {
        this.location = location;
        //location: Point = new Point(0, 0, 0);
        this.velocity = new Point(0, 0, 0);
        this.height = 1;
        this.width = 1;
        this.isPlatform = false;
        this.platform = null;
        this.gravity = 0.004;
    }
    Sprite.prototype.update = function () { };
    Sprite.prototype.draw = function (scaling) { };
    Sprite.prototype.moveByVelocity = function () {
        this.location.moveBy(this.velocity);
        if (this.platform)
            this.location.moveBy(this.platform.velocity);
    };
    Sprite.prototype.applyXYFriction = function (ratio) {
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
    Sprite.prototype.reactToGravity = function () {
        var scale = 1;
        //if (Math.abs(this.velocity.y) < 0.05) scale = 0.5;
        this.velocity.y += this.gravity * scale;
    };
    Sprite.prototype.reactToPlatform = function () {
        for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
            var spr = sprites_1[_i];
            if (spr.isPlatform && spr != this && spr.location.z == this.location.z) {
                if (spr.location.x < this.location.x + this.width - 0.01 &&
                    spr.location.x + spr.width - 0.01 > this.location.x) {
                    if (this.location.y + this.height <= spr.location.y &&
                        this.location.y + this.height + this.velocity.y >= spr.location.y + spr.velocity.y) {
                        this.platform = spr;
                    }
                }
            }
        }
        if (this.platform) {
            if (this.location.x + this.width - 0.01 < this.platform.location.x ||
                this.platform.location.x + this.platform.width - 0.01 < this.location.x)
                this.platform = null;
        }
        if (this.platform) {
            this.location.y = this.platform.location.y - this.height;
            this.velocity.y = this.platform.velocity.y;
        }
    };
    Sprite.prototype.reactToSolid = function () {
        if (this.velocity.y > 0) {
            var tileAtProposedBottomLeft = this.location.plus(0, this.velocity.y + this.height, 0).tileAt();
            var tileAtProposedBottomRight = this.location.plus(this.width - 0.01, this.velocity.y + this.height, 0).tileAt();
            if (tileAtProposedBottomLeft.isSolid || tileAtProposedBottomRight.isSolid) {
                this.location.y = Math.floor(this.location.y + this.velocity.y) + 1 - this.height;
                this.velocity.y = 0;
            }
        }
        if (this.velocity.y < 0) {
            var tileAtProposedTopLeft = this.location.plus(0, this.velocity.y - 0.01, 0).tileAt();
            var tileAtProposedTopRight = this.location.plus(this.width - 0.01, this.velocity.y - 0.01, 0).tileAt();
            if (tileAtProposedTopLeft.isSolid || tileAtProposedTopRight.isSolid) {
                this.location.y = Math.ceil(this.location.y + this.velocity.y - 0.01);
                this.velocity.y = 0;
            }
        }
        if (this.velocity.x >= 0) {
            var tileAtProposedTopRight = this.location.plus(this.velocity.x + this.width, 0, 0).tileAt();
            var tileAtProposedBottomRight = this.location.plus(this.velocity.x + this.width, this.height - 0.01, 0).tileAt();
            if (tileAtProposedTopRight.isSolid || tileAtProposedBottomRight.isSolid) {
                this.location.x = Math.floor(this.location.x + this.velocity.x) + 1 - this.width;
                this.velocity.x = 0;
            }
        }
        if (this.velocity.x <= 0) {
            var tileAtProposedTopLeft = this.location.plus(this.velocity.x - 0.01, 0, 0).tileAt();
            var tileAtProposedBottomLeft = this.location.plus(this.velocity.x - 0.01, this.height - 0.01, 0).tileAt();
            if (tileAtProposedTopLeft.isSolid || tileAtProposedBottomLeft.isSolid) {
                this.location.x = Math.ceil(this.location.x + this.velocity.x - 0.01);
                this.velocity.x = 0;
            }
        }
    };
    Sprite.prototype.isInTile = function (tileTypes, leeway) {
        var region = new Region(this.location.plus(leeway, leeway, 0), this.location.plus(this.width - 0.01 - leeway, this.height - 0.01 - leeway, 0));
        var tiles = region.toIntegerPointList().map(function (x) { return x.tileAt(); });
        return tiles.some(function (tile) { return tileTypes.indexOf(tile) > -1; });
    };
    Sprite.prototype.drawAsBox = function (scaling, fillColor) {
        var upperLeft = TranslateToCanvasCoordinates(scaling, getCellSize(), camera.location.x, camera.location.y, this.location.x, this.location.y);
        var lowerRight = TranslateToCanvasCoordinates(scaling, getCellSize(), camera.location.x, camera.location.y, this.location.x + this.width, this.location.y + this.height);
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = "black";
        var width = scaling * getCellSize() / atlas.pixelsPerCell;
        ctx.lineWidth = width;
        ctx.fillRect(upperLeft.x, upperLeft.y, lowerRight.x - upperLeft.x, lowerRight.y - upperLeft.y);
        ctx.strokeRect(upperLeft.x + width / 2, upperLeft.y + width / 2, lowerRight.x - upperLeft.x - width, lowerRight.y - upperLeft.y - width);
    };
    return Sprite;
}());
var debugMode = false;
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(t) {
        _super.call(this, t);
        this.width = 0.8;
        this.height = 0.8;
        this.walkAccel = 0.016;
        this.walkSpeed = 0.08;
        this.airStrafeSpeed = 0.03;
        this.jumpPower = 0.145;
        this.swimUpPower = 0.12;
        this.horizFriction = 0.80;
        this.waterFriction = 0.97;
        this.maxDy = 0.5;
        this.maxWaterDy = 0.05;
        this.isInWater = false;
        this.respawnPoint = null;
    }
    Player.prototype.draw = function (scaling) { this.drawAsBox(scaling, "red"); };
    Player.prototype.zShiftIsOpen = function (shift) {
        return !this.location.plus(0, 0, shift).tileAt().isSolid &&
            !this.location.plus(this.width - 0.01, 0, shift).tileAt().isSolid &&
            !this.location.plus(0, this.height - 0.01, shift).tileAt().isSolid &&
            !this.location.plus(this.width - 0.01, this.height - 0.01, shift).tileAt().isSolid;
    };
    Player.prototype.update = function () {
        var isInWater = this.location.plus(this.width / 2, this.height * 3 / 4, 0).tileAt().isWater;
        if (isInWater && !this.isInWater) {
            //changing state
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        this.isInWater = isInWater;
        var isOnGround = (this.location.plus(0, this.height + 0.01, 0).tileAt().isSolid ||
            this.location.plus(this.width - 0.01, this.height + 0.01, 0).tileAt().isSolid ||
            this.platform !== null);
        if (inputHandler.Jump.pressed && inputHandler.Jump.changed && (isOnGround || isInWater)) {
            this.velocity.y = isInWater ? -this.swimUpPower : -this.jumpPower;
            if (this.platform)
                this.velocity.y += this.platform.velocity.y;
            if (this.platform)
                this.platform = null;
        }
        var isOnForwardWarp = (this.location.plus(0, this.height + 0.01, 0).tileAt().name == "warpforward" ||
            this.location.plus(this.width - 0.01, this.height + 0.01, 0).tileAt().name == "warpforward");
        var isOnBackwardWarp = (this.location.plus(0, this.height + 0.01, 0).tileAt().name == "warpbackward" ||
            this.location.plus(this.width - 0.01, this.height + 0.01, 0).tileAt().name == "warpbackward");
        if (isOnBackwardWarp || isOnForwardWarp)
            this.respawnPoint = this.location.copy();
        if (!inputHandler.Jump.pressed && this.velocity.y < 0)
            this.velocity.y *= 0.9;
        var horizAccel = this.walkAccel;
        if (!isOnGround)
            horizAccel /= 2;
        if (inputHandler.Right.pressed) {
            this.velocity.x += horizAccel;
            if (this.velocity.x > this.walkSpeed)
                this.velocity.x = isOnGround ? this.walkSpeed : this.airStrafeSpeed;
        }
        if (inputHandler.Left.pressed) {
            this.velocity.x -= horizAccel;
            if (this.velocity.x < -this.walkSpeed)
                this.velocity.x = isOnGround ? -this.walkSpeed : -this.airStrafeSpeed;
        }
        if (inputHandler.Forwards.pressed) {
            if (inputHandler.Forwards.changed && this.zShiftIsOpen(-1)) {
                if (isOnForwardWarp || debugMode) {
                    this.location.z -= 1;
                }
            }
        }
        if (inputHandler.Backwards.pressed) {
            if (inputHandler.Backwards.changed && this.zShiftIsOpen(1)) {
                if (isOnBackwardWarp || debugMode) {
                    this.location.z += 1;
                }
            }
        }
        /*if (inputHandler.MiddleMouse.pressed) {
            this.velocity.y -= this.jumpPower;
        }*/
        if (!inputHandler.Right.pressed && !inputHandler.Left.pressed)
            this.velocity.x *= this.horizFriction;
        this.reactToGravity();
        if (this.velocity.y > this.maxDy)
            this.velocity.y = this.maxDy;
        if (isInWater) {
            this.applyXYFriction(this.waterFriction);
            if (this.velocity.y > this.maxWaterDy)
                this.velocity.y = this.maxWaterDy;
        }
        this.reactToPlatform();
        this.reactToSolid();
        this.moveByVelocity();
        if (this.isInTile(tileTypes.filter(function (x) { return x.isDeadly; }), 0.1)) {
            this.location = this.respawnPoint.copy();
            this.velocity = new Point(0, 0, 0);
        }
    };
    return Player;
}(Sprite));
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(target) {
        _super.call(this, target.location.copy());
        this.target = target;
        this.distanceThreshold = 0.5;
        this.acceleration = 0.004;
        this.leading = 2;
    }
    Camera.prototype.update = function () {
        this.location.x = this.target.location.x;
        this.location.y = this.target.location.y;
        //let targetX = this.target.location.x + this.target.velocity.x * this.leading;
        //let targetY = this.target.location.y + this.target.velocity.y * this.leading;
        //let distanceX = targetX - this.location.x;
        //let distanceY = targetY - this.location.y;
        //if (distanceX < -this.distanceThreshold) this.velocity.x -= this.acceleration - distanceX/1000;
        //if (distanceX > this.distanceThreshold) this.velocity.x += this.acceleration + distanceX/1000;
        //if (distanceY < -this.distanceThreshold) this.velocity.y -= this.acceleration - distanceY/1000;
        //if (distanceY > this.distanceThreshold) this.velocity.y += this.acceleration + distanceY/1000;
        //this.applyXYFriction(0.96);
        var targetZ = this.target.location.z;
        if (targetZ > this.location.z)
            this.location.z += 0.1;
        if (targetZ < this.location.z)
            this.location.z -= 0.1;
        if (Math.abs(targetZ - this.location.z) < 0.1)
            this.location.z = targetZ;
        //if (Math.abs(this.target.location.z - this.location.z) < 0.1) this.location.z = this.target.location.z;
        //this.moveByVelocity();
    };
    return Camera;
}(Sprite));
var TestPlatform = (function (_super) {
    __extends(TestPlatform, _super);
    function TestPlatform(t) {
        _super.call(this, t);
        this.isPlatform = true;
        this.timer = 0;
    }
    TestPlatform.prototype.update = function () {
        this.timer += 0.01;
        //this.velocity.x += 0.001 * Math.cos(this.timer);
        this.velocity.y -= 0.001 * Math.cos(this.timer);
        this.velocity.x -= 0.001 * Math.sin(this.timer);
        //this.velocity.y = -0.01
        this.moveByVelocity();
    };
    TestPlatform.prototype.draw = function (scaling) {
        var upperLeft = TranslateToCanvasCoordinates(scaling, getCellSize(), camera.location.x, camera.location.y, this.location.x, this.location.y);
        var lowerRight = TranslateToCanvasCoordinates(scaling, getCellSize(), camera.location.x, camera.location.y, this.location.x + 1, this.location.y + 1);
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "black";
        ctx.lineWidth = scaling * getCellSize() / atlas.pixelsPerCell;
        ctx.fillRect(upperLeft.x, upperLeft.y, lowerRight.x - upperLeft.x, lowerRight.y - upperLeft.y);
        ctx.strokeRect(upperLeft.x, upperLeft.y, lowerRight.x - upperLeft.x, lowerRight.y - upperLeft.y);
    };
    return TestPlatform;
}(Sprite));
var Editor = (function (_super) {
    __extends(Editor, _super);
    function Editor(t) {
        _super.call(this, t);
        this.mouseStart = null;
        this.mouseEnd = null;
        this.selectedTile = null;
        var me = this;
        var container = document.getElementById("tileContainer");
        var _loop_1 = function(i) {
            var tileType = tileTypes[i];
            var button = document.createElement("button");
            button.classList.add("tileButton");
            button.onclick = function (e) { me.selectedTile = tileType; me.setSelectedTile(i); };
            button.innerHTML = tileType.name.substr(0, 1);
            container.appendChild(button);
        };
        for (var i = 0; i < tileTypes.length; i++) {
            _loop_1(i);
        }
        me.setSelectedTile(0);
    }
    Editor.prototype.draw = function (scaling) {
        if (this.mouseStart && this.mouseEnd) {
            var region = new Region(this.mouseStart, this.mouseEnd);
            region.draw(scaling, getCellSize(), camera.location);
        }
    };
    Editor.prototype.setSelectedTile = function (tileIndex) {
        this.selectedTile = tileTypes[tileIndex];
        var items = document.getElementsByClassName("tileButton");
        for (var i = 0; i < items.length; i++)
            items[i].classList.remove("selectedTile");
        items[tileIndex].classList.add("selectedTile");
    };
    Editor.prototype.update = function () {
        //if (inputHandler.Left.down && (inputHandler.Left.changed || inputHandler.Jump.down)) this.location.x += -1;
        //if (inputHandler.Right.down && (inputHandler.Right.changed || inputHandler.Jump.down)) this.location.x += 1;
        //if (inputHandler.Up.down && (inputHandler.Up.changed || inputHandler.Jump.down)) this.location.y += -1;
        //if (inputHandler.Down.down && (inputHandler.Down.changed || inputHandler.Jump.down)) this.location.y += 1;
        //if (inputHandler.Forwards.down && (inputHandler.Forwards.changed || inputHandler.Jump.down)) this.location.z += -1;
        //if (inputHandler.Backwards.down && (inputHandler.Backwards.changed || inputHandler.Jump.down)) this.location.z += 1;
        this.location.z = player.location.z;
        //if (inputHandler.MiddleMouse.pressed) {
        //    this.mouseEnd = TranslateFromCanvasCoordinates(inputHandler.mouseX, inputHandler.mouseY, camera.location.x, camera.location.y, getCellSize());
        //    if (inputHandler.MiddleMouse.changed) this.mouseStart = this.mouseEnd.copy();
        //}
        if (inputHandler.LeftMouse.pressed) {
            var mouseLoc = TranslateFromCanvasCoordinates(inputHandler.mouseX, inputHandler.mouseY, camera.location.x, camera.location.y, getCellSize());
            world.mapData[mouseLoc.z][Math.floor(mouseLoc.y)][Math.floor(mouseLoc.x)] = tileTypes.indexOf(this.selectedTile);
            atlas.SaveSlice(this.location.z, world.mapData[this.location.z]);
        }
        //if (!inputHandler.MiddleMouse.pressed && inputHandler.MiddleMouse.changed) {
        //    let region = new Region(this.mouseStart, this.mouseEnd);
        //    let t0 = performance.now();
        //    region.applyOperation((x, y, z) => { world.mapData[z][y][x] = tileTypes.indexOf(this.selectedTile) });
        //    atlas.SaveSlice(this.location.z, world.mapData[this.location.z]);
        //    console.log(performance.now() - t0);
        //    this.mouseStart = null;
        //}
        if (inputHandler.WheelUp.pressed)
            setCellSize(getCellSize() + 1);
        if (inputHandler.WheelDown.pressed)
            setCellSize(getCellSize() - 1);
        if (inputHandler.Up.pressed)
            document.getElementById("overlay").value = parseFloat(document.getElementById("overlay").value) + 0.001;
        if (inputHandler.Down.pressed)
            document.getElementById("overlay").value = parseFloat(document.getElementById("overlay").value) - 0.0005;
        if (inputHandler.DebugOption.pressed && inputHandler.DebugOption.changed) {
            console.log(world.OutputToJson());
        }
        if (inputHandler.RightMouse.pressed) {
            var mouseLoc = TranslateFromCanvasCoordinates(inputHandler.mouseX, inputHandler.mouseY, camera.location.x, camera.location.y, getCellSize());
            this.setSelectedTile(world.mapData[mouseLoc.z][Math.floor(mouseLoc.y)][Math.floor(mouseLoc.x)]);
        }
    };
    return Editor;
}(Sprite));
var GroundPatrol = (function (_super) {
    __extends(GroundPatrol, _super);
    function GroundPatrol() {
        _super.apply(this, arguments);
        this.width = 0.6;
        this.height = 0.6;
        this.direction = 1;
        this.speed = 0.04;
    }
    GroundPatrol.prototype.draw = function (scaling) { this.drawAsBox(scaling, "purple"); };
    GroundPatrol.prototype.update = function () {
        this.velocity = new Point(this.speed * this.direction, 0, 0);
        this.moveByVelocity();
        if (this.direction == 1 && this.location.plus(this.width + 0.01, 0, 0).tileAt().isSolid) {
            this.direction = -1;
        }
        if (this.direction == -1 && this.location.plus(-0.01, 0, 0).tileAt().isSolid) {
            this.direction = 1;
        }
    };
    return GroundPatrol;
}(Sprite));
var Spawner = (function (_super) {
    __extends(Spawner, _super);
    function Spawner(t, spriteType) {
        _super.call(this, t);
        this.spriteType = spriteType;
        this.initialized = false;
    }
    Spawner.prototype.update = function () {
        if (!this.initialized) {
            this.initialized = true;
            sprites.push(new this.spriteType(this.location));
        }
    };
    return Spawner;
}(Sprite));
//# sourceMappingURL=Sprites.js.map