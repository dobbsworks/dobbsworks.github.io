"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SpinRing = /** @class */ (function (_super) {
    __extends(SpinRing, _super);
    function SpinRing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 10;
        _this.width = 22;
        _this.respectsSolidTiles = false;
        _this.allowsSpinJump = true;
        _this.col = 0;
        _this.overlayType = ColorRingOverlay;
        _this.overlay = null;
        _this.direction = Direction.Up;
        _this.spinTimer = 0;
        _this.animationOffset = 0;
        _this.isReusable = true;
        _this.rowOffset = 0;
        _this.spriteInteractList = [];
        return _this;
    }
    Object.defineProperty(SpinRing, "clockwiseRotationSprite", {
        get: function () { return SpinRingRight; },
        enumerable: false,
        configurable: true
    });
    SpinRing.prototype.Update = function () {
        var _this = this;
        if (!this.overlay) {
            this.overlay = (new this.overlayType(this.x, this.y, this.layer, []));
            this.overlay.direction = this.direction;
            this.overlay.width = this.width;
            this.overlay.height = this.height;
            this.layer.sprites.push(this.overlay);
        }
        this.spriteInteractList = this.spriteInteractList.filter(function (a) { return a.Overlaps(_this); });
        if (this.spinTimer > 0) {
            this.spinTimer--;
            this.animationOffset += this.spinTimer / 2;
        }
        this.overlay.x = this.x;
        this.overlay.y = this.y;
        this.overlay.animationOffset = this.animationOffset;
        var touchingSprites = this.layer.sprites.filter(function (a) {
            if (!a.Overlaps(_this))
                return false;
            if (a instanceof SpinRing)
                return false;
            if (a instanceof Yoyo)
                return false;
            if (player.heldItem == a)
                return false;
            var parentMotor = _this.layer.sprites.find(function (spr) { return spr instanceof Motor && spr.connectedSprite == a; });
            if (parentMotor)
                return false;
            return true;
        });
        touchingSprites.forEach(function (spr) { return _this.OnSpriteTouch(spr); });
    };
    SpinRing.prototype.OnSpriteTouch = function (sprite) {
        // void for regular ring
    };
    SpinRing.prototype.OnPlayerUseSpinRing = function () {
        this.spinTimer = 30;
        if (!this.isReusable) {
            this.ReplaceWithSpriteType(Poof);
            if (this.overlay)
                this.overlay.isActive = false;
        }
    };
    SpinRing.prototype.GetFrameData = function (frameNum) {
        var isPointedVertically = this.direction.x == 0;
        var imageSource = isPointedVertically ? "colorRing" : "colorRing2";
        if (editorHandler.isInEditMode) {
            var frames_1 = [{
                    imageTile: isPointedVertically ? tiles[imageSource][0][0 + this.rowOffset] : tiles[imageSource][0 + this.rowOffset][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 2,
                    yOffset: 1
                }, {
                    imageTile: isPointedVertically ? tiles[imageSource][1][0 + this.rowOffset] : tiles[imageSource][0 + this.rowOffset][1],
                    xFlip: false,
                    yFlip: false,
                    xOffset: 2,
                    yOffset: 1
                }];
            if (this.direction) {
                var arrowCol = [Direction.Right, null, Direction.Up, null, Direction.Left, null, Direction.Down, null].indexOf(this.direction);
                frames_1.push({
                    imageTile: tiles["arrows"][arrowCol][0],
                    xFlip: false,
                    yFlip: false,
                    xOffset: this.direction.x == 0 ? -5 : (this.direction.x * -6 + 1),
                    yOffset: this.direction.y == 0 ? -5 : (this.direction.y * -6 + 2)
                });
            }
            return frames_1;
        }
        var row = Math.floor((frameNum + this.animationOffset) / 5) % 3;
        return [{
                imageTile: isPointedVertically ? tiles[imageSource][this.col][row + this.rowOffset] : tiles[imageSource][row + this.rowOffset][this.col],
                xFlip: false,
                yFlip: false,
                xOffset: 2,
                yOffset: 1
            }];
    };
    SpinRing.prototype.GetThumbnail = function () {
        var col = Direction.All.indexOf(this.direction);
        return tiles["colorRingThumb"][col][0 + this.rowOffset / 3];
    };
    return SpinRing;
}(Sprite));
var ColorRingOverlay = /** @class */ (function (_super) {
    __extends(ColorRingOverlay, _super);
    function ColorRingOverlay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.col = 1;
        _this.zIndex = 1;
        return _this;
    }
    ColorRingOverlay.prototype.Update = function () { };
    return ColorRingOverlay;
}(SpinRing));
var SpinRingRight = /** @class */ (function (_super) {
    __extends(SpinRingRight, _super);
    function SpinRingRight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 22;
        _this.width = 10;
        _this.direction = Direction.Right;
        return _this;
    }
    Object.defineProperty(SpinRingRight, "clockwiseRotationSprite", {
        get: function () { return SpinRingDown; },
        enumerable: false,
        configurable: true
    });
    return SpinRingRight;
}(SpinRing));
var SpinRingDown = /** @class */ (function (_super) {
    __extends(SpinRingDown, _super);
    function SpinRingDown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Down;
        return _this;
    }
    Object.defineProperty(SpinRingDown, "clockwiseRotationSprite", {
        get: function () { return SpinRingLeft; },
        enumerable: false,
        configurable: true
    });
    return SpinRingDown;
}(SpinRing));
var SpinRingLeft = /** @class */ (function (_super) {
    __extends(SpinRingLeft, _super);
    function SpinRingLeft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Left;
        return _this;
    }
    Object.defineProperty(SpinRingLeft, "clockwiseRotationSprite", {
        get: function () { return SpinRing; },
        enumerable: false,
        configurable: true
    });
    return SpinRingLeft;
}(SpinRingRight));
var FragileSpinRing = /** @class */ (function (_super) {
    __extends(FragileSpinRing, _super);
    function FragileSpinRing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overlayType = FragileSpinRingOverlay;
        _this.rowOffset = 3;
        _this.isReusable = false;
        return _this;
    }
    Object.defineProperty(FragileSpinRing, "clockwiseRotationSprite", {
        get: function () { return FragileSpinRingRight; },
        enumerable: false,
        configurable: true
    });
    return FragileSpinRing;
}(SpinRing));
var FragileSpinRingOverlay = /** @class */ (function (_super) {
    __extends(FragileSpinRingOverlay, _super);
    function FragileSpinRingOverlay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.col = 1;
        _this.zIndex = 1;
        return _this;
    }
    FragileSpinRingOverlay.prototype.Update = function () { };
    return FragileSpinRingOverlay;
}(FragileSpinRing));
var FragileSpinRingRight = /** @class */ (function (_super) {
    __extends(FragileSpinRingRight, _super);
    function FragileSpinRingRight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 22;
        _this.width = 10;
        _this.direction = Direction.Right;
        return _this;
    }
    Object.defineProperty(FragileSpinRingRight, "clockwiseRotationSprite", {
        get: function () { return FragileSpinRingDown; },
        enumerable: false,
        configurable: true
    });
    return FragileSpinRingRight;
}(FragileSpinRing));
var FragileSpinRingDown = /** @class */ (function (_super) {
    __extends(FragileSpinRingDown, _super);
    function FragileSpinRingDown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Down;
        return _this;
    }
    Object.defineProperty(FragileSpinRingDown, "clockwiseRotationSprite", {
        get: function () { return FragileSpinRingLeft; },
        enumerable: false,
        configurable: true
    });
    return FragileSpinRingDown;
}(FragileSpinRing));
var FragileSpinRingLeft = /** @class */ (function (_super) {
    __extends(FragileSpinRingLeft, _super);
    function FragileSpinRingLeft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Left;
        return _this;
    }
    Object.defineProperty(FragileSpinRingLeft, "clockwiseRotationSprite", {
        get: function () { return FragileSpinRing; },
        enumerable: false,
        configurable: true
    });
    return FragileSpinRingLeft;
}(FragileSpinRingRight));
var PortalRing = /** @class */ (function (_super) {
    __extends(PortalRing, _super);
    function PortalRing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overlayType = PortalRingOverlay;
        _this.rowOffset = 6;
        _this.isReusable = false;
        _this.direction = Direction.Up;
        _this.allowsSpinJump = false;
        return _this;
    }
    Object.defineProperty(PortalRing, "clockwiseRotationSprite", {
        get: function () { return PortalRingRight; },
        enumerable: false,
        configurable: true
    });
    PortalRing.prototype.OnSpriteTouch = function (sprite) {
        if (this.spriteInteractList.indexOf(sprite) > -1) {
            // recently warped this sprite, ignore
            return;
        }
        var destination = this.GetPairedPortal();
        this.spinTimer = 30;
        if (destination) {
            var grantVelocityBoost = true;
            destination.spinTimer = 30;
            sprite.x = destination.xMid - sprite.width / 2;
            sprite.y = destination.yMid - sprite.height / 2;
            if (this.direction == destination.direction) {
                if (this.direction.x == 0) {
                    // both up, or both down
                    sprite.dy *= -1;
                }
                else {
                    // both left, or both right
                    sprite.dx *= -1;
                }
            }
            else {
                if (this.direction.x == destination.direction.x || this.direction.y == destination.direction.y) {
                    // a left and right, or an up and down
                    grantVelocityBoost = false;
                }
                else {
                    // change orientation
                    sprite.dx = destination.direction.x;
                    sprite.dy = destination.direction.y;
                    if (destination.direction.y == -1)
                        sprite.dy = -2;
                }
            }
            if (grantVelocityBoost) {
                if (destination.direction.y == 0 || sprite.dy <= 0) {
                    sprite.dx += destination.direction.x * 1;
                    sprite.dy += Math.abs(destination.direction.y) * -1;
                }
            }
            audioHandler.PlaySound("warp", true);
            destination.spriteInteractList.push(sprite);
        }
    };
    PortalRing.prototype.GetPairedPortal = function () {
        var _this = this;
        var allDoors = this.layer.sprites.filter(function (a) { return a instanceof PortalRing && a != _this && a.zIndex != 1; });
        if (allDoors.length == 0)
            return null;
        if (allDoors.length == 1)
            return allDoors[0];
        var doorHorizontalDistances = allDoors.map(function (a) { return Math.abs(a.x - _this.x); });
        doorHorizontalDistances.sort(function (a, b) { return a - b; });
        var minHorizontalDistance = doorHorizontalDistances[0];
        // grab all doors that are tied for closest horizontally
        var closestDoorsHorizontally = allDoors.filter(function (a) { return Math.abs(a.x - _this.x) == minHorizontalDistance; });
        if (closestDoorsHorizontally.length == 1)
            return closestDoorsHorizontally[0];
        var doorVerticalDistances = allDoors.map(function (a) { return Math.abs(a.y - _this.y); });
        doorVerticalDistances.sort(function (a, b) { return a - b; });
        var minVerticalDistance = doorVerticalDistances[0];
        // grab all doors that are tied for closest vertically AND horizontally
        var closestDoors = closestDoorsHorizontally.filter(function (a) { return Math.abs(a.y - _this.y) == minVerticalDistance; });
        if (closestDoors.length == 1)
            return closestDoors[0];
        closestDoors.sort(function (a, b) { return (a.x - b.x) * 100000 + (a.y - b.y); });
        return closestDoors[0];
    };
    return PortalRing;
}(SpinRing));
var PortalRingOverlay = /** @class */ (function (_super) {
    __extends(PortalRingOverlay, _super);
    function PortalRingOverlay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.col = 1;
        _this.zIndex = 1;
        return _this;
    }
    PortalRingOverlay.prototype.Update = function () { };
    return PortalRingOverlay;
}(PortalRing));
var PortalRingRight = /** @class */ (function (_super) {
    __extends(PortalRingRight, _super);
    function PortalRingRight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 22;
        _this.width = 10;
        _this.direction = Direction.Right;
        return _this;
    }
    Object.defineProperty(PortalRingRight, "clockwiseRotationSprite", {
        get: function () { return PortalRingDown; },
        enumerable: false,
        configurable: true
    });
    return PortalRingRight;
}(PortalRing));
var PortalRingDown = /** @class */ (function (_super) {
    __extends(PortalRingDown, _super);
    function PortalRingDown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Down;
        return _this;
    }
    Object.defineProperty(PortalRingDown, "clockwiseRotationSprite", {
        get: function () { return PortalRingLeft; },
        enumerable: false,
        configurable: true
    });
    return PortalRingDown;
}(PortalRing));
var PortalRingLeft = /** @class */ (function (_super) {
    __extends(PortalRingLeft, _super);
    function PortalRingLeft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Left;
        return _this;
    }
    Object.defineProperty(PortalRingLeft, "clockwiseRotationSprite", {
        get: function () { return PortalRing; },
        enumerable: false,
        configurable: true
    });
    return PortalRingLeft;
}(PortalRingRight));
