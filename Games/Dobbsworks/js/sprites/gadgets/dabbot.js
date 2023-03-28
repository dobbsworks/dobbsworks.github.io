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
var Dabbot = /** @class */ (function (_super) {
    __extends(Dabbot, _super);
    function Dabbot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 9;
        _this.width = 5;
        _this.direction = 1;
        _this.respectsSolidTiles = true;
        _this.heldItem = null;
        _this.throwTimer = 999; // how long since throwing something
        _this.coyoteTimer = 999; // how long since not on ground // start this value above threshold so that player cannot immediately jump if starting in air, must hit ground first
        _this.jumpTimer = -1; // how long have we been ascending for current jump
        _this.canBeHeld = true;
        return _this;
    }
    Dabbot.prototype.Update = function () {
        this.Movement(); // includes gravity
        this.ItemUpdate();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
        this.UpdateHeldItemLocation();
        this.ApplyGravity();
        this.ApplyInertia();
        this.ReactToWater();
    };
    Dabbot.prototype.Movement = function () {
        var isJumpPressed = KeyboardHandler.IsKeyPressed(KeyAction.Action1, true);
        if (isJumpPressed && this.isOnGround) {
            this.dy -= 1.5;
        }
        var leftHeld = KeyboardHandler.IsKeyPressed(KeyAction.Left, false);
        var rightHeld = KeyboardHandler.IsKeyPressed(KeyAction.Right, false);
        var targetDirection = 0;
        if (leftHeld && !rightHeld) {
            targetDirection = -1;
        }
        if (!leftHeld && rightHeld) {
            targetDirection = 1;
        }
        if (targetDirection != 0) {
            this.direction = targetDirection == 1 ? 1 : -1;
            this.dx += targetDirection * 0.1;
            if (this.dx > 1)
                this.dx = 1;
            if (this.dx < -1)
                this.dx = -1;
        }
    };
    Dabbot.prototype.ItemUpdate = function () {
        var _a;
        this.throwTimer++;
        var startedHolding = false;
        if (!this.heldItem
            && KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)
            && this.throwTimer > 20) {
            // try to grab item?
            for (var _i = 0, _b = this.layer.sprites.filter(function (a) { return a.canBeHeld; }); _i < _b.length; _i++) {
                var sprite = _b[_i];
                if (sprite.age < 10)
                    continue; // can't grab items that just spawned (prevent grabbing shell after shell jump)
                if (sprite instanceof Dabbot) {
                    var d = sprite;
                    while (d.heldItem instanceof Dabbot)
                        d = d.heldItem;
                    if (d == this)
                        continue;
                }
                if (this.IsGoingToOverlapSprite(sprite)) {
                    this.heldItem = sprite;
                    startedHolding = true;
                    audioHandler.PlaySound("pick-up", true);
                    break;
                }
            }
            if (this.heldItem == null) {
                // check for items we can hang from
                var myX = this.x + this.GetTotalDx();
                var myY = this.y + this.GetTotalDy();
                for (var _c = 0, _d = this.layer.sprites.filter(function (a) { return a.canHangFrom && (a.framesSinceThrown > 30 || a.framesSinceThrown == -1); }); _c < _d.length; _c++) {
                    var sprite = _d[_c];
                    // special overlap logic for y coords:
                    var spriteX = sprite.x + sprite.GetTotalDx();
                    var spriteYBottom = sprite.yBottom + sprite.GetTotalDy();
                    var isXOverlap = myX < spriteX + sprite.width && myX + this.width > spriteX;
                    var isYOverlap = Math.abs(spriteYBottom - myY) < 2.5;
                    if (isXOverlap && isYOverlap) {
                        this.heldItem = sprite;
                        startedHolding = true;
                        audioHandler.PlaySound("pick-up", true);
                        break;
                    }
                }
            }
        }
        if (this.heldItem) {
            var players = this.layer.sprites.filter(function (a) { return a instanceof Player; });
            for (var _e = 0, players_1 = players; _e < players_1.length; _e++) {
                var player_1 = players_1[_e];
                if (player_1.heldItem == this.heldItem) {
                    this.heldItem = null;
                    return;
                }
            }
            if (this.parentSprite == this.heldItem) {
                this.parentSprite = null;
            }
            this.heldItem.parentSprite = null;
            if (!this.heldItem.updatedThisFrame) {
                this.heldItem.updatedThisFrame = true;
                this.heldItem.Update();
            }
            if (this.heldItem && this.heldItem.canBeHeld) {
                this.UpdateHeldItemLocation();
                if (!startedHolding && !KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) {
                    if (KeyboardHandler.IsKeyPressed(KeyAction.Up, false)) {
                        this.heldItem.OnUpThrow(this, this.direction);
                    }
                    else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, false)) {
                        this.heldItem.OnDownThrow(this, this.direction);
                    }
                    else {
                        this.heldItem.OnThrow(this, this.direction);
                    }
                    this.heldItem.GentlyEjectFromSolids();
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                    this.throwTimer = 0;
                    audioHandler.PlaySound("throw", true);
                }
            }
            else if (this.heldItem && this.heldItem.canHangFrom) {
                if (this.isOnCeiling) {
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                }
                else if (this.isOnGround) {
                    this.heldItem.framesSinceThrown = 1;
                    this.heldItem = null;
                }
                else {
                    this.x = this.heldItem.xMid - this.width / 2;
                    this.y = this.heldItem.yBottom;
                    this.dx = this.heldItem.dx;
                    this.dy = this.heldItem.dy;
                    this.dxFromPlatform = 0;
                    this.dyFromPlatform = 0;
                    this.GentlyEjectFromSolids();
                    if (!KeyboardHandler.IsKeyPressed(KeyAction.Action2, false)) {
                        this.heldItem.framesSinceThrown = 1;
                        this.heldItem = null;
                    }
                    if (this.heldItem) {
                        var xDistanceFromTarget = Math.abs(this.heldItem.xMid - this.width / 2 - this.x);
                        var yDistanceFromTarget = Math.abs(this.heldItem.yBottom - this.y);
                        if (xDistanceFromTarget > 2 || yDistanceFromTarget > 2) {
                            this.heldItem.framesSinceThrown = 1;
                            this.heldItem = null;
                        }
                    }
                }
            }
            if (!((_a = this.heldItem) === null || _a === void 0 ? void 0 : _a.isActive))
                this.heldItem = null;
        }
    };
    Dabbot.prototype.UpdateHeldItemLocation = function () {
        if (this.heldItem && this.heldItem.canBeHeld) {
            this.heldItem.x = this.x + this.width / 2 - this.heldItem.width / 2;
            this.heldItem.y = this.y - this.heldItem.height;
            this.heldItem.dx = 0;
            this.heldItem.dy = 0;
            this.heldItem.dxFromPlatform = 0;
            this.heldItem.dyFromPlatform = 0;
        }
    };
    Dabbot.prototype.GetFrameData = function (frameNum) {
        return {
            imageTile: tiles["dabbot"][0][0],
            xFlip: this.direction != 1,
            yFlip: false,
            xOffset: 2,
            yOffset: 3
        };
    };
    return Dabbot;
}(Sprite));
