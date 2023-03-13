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
var WindTrigger = /** @class */ (function (_super) {
    __extends(WindTrigger, _super);
    function WindTrigger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 12;
        _this.width = 12;
        _this.respectsSolidTiles = false;
        _this.canMotorHold = false;
        _this.frameRow = 3;
        return _this;
    }
    WindTrigger.prototype.Update = function () {
    };
    WindTrigger.prototype.GetFrameData = function (frameNum) {
        if (editorHandler.isInEditMode) {
            return {
                imageTile: tiles["gust"][this.frameCol][this.frameRow],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
        else {
            return {
                imageTile: tiles["empty"][0][0],
                xFlip: false,
                yFlip: false,
                xOffset: 0,
                yOffset: 0
            };
        }
    };
    return WindTrigger;
}(Sprite));
var WindTriggerUp = /** @class */ (function (_super) {
    __extends(WindTriggerUp, _super);
    function WindTriggerUp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Up;
        _this.frameCol = 1;
        return _this;
    }
    Object.defineProperty(WindTriggerUp, "clockwiseRotationSprite", {
        get: function () { return WindTriggerRight; },
        enumerable: false,
        configurable: true
    });
    return WindTriggerUp;
}(WindTrigger));
var WindTriggerDown = /** @class */ (function (_super) {
    __extends(WindTriggerDown, _super);
    function WindTriggerDown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Down;
        _this.frameCol = 3;
        return _this;
    }
    Object.defineProperty(WindTriggerDown, "clockwiseRotationSprite", {
        get: function () { return WindTriggerLeft; },
        enumerable: false,
        configurable: true
    });
    return WindTriggerDown;
}(WindTrigger));
var WindTriggerLeft = /** @class */ (function (_super) {
    __extends(WindTriggerLeft, _super);
    function WindTriggerLeft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Left;
        _this.frameCol = 2;
        return _this;
    }
    Object.defineProperty(WindTriggerLeft, "clockwiseRotationSprite", {
        get: function () { return WindTriggerUp; },
        enumerable: false,
        configurable: true
    });
    return WindTriggerLeft;
}(WindTrigger));
var WindTriggerRight = /** @class */ (function (_super) {
    __extends(WindTriggerRight, _super);
    function WindTriggerRight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = Direction.Right;
        _this.frameCol = 0;
        return _this;
    }
    Object.defineProperty(WindTriggerRight, "clockwiseRotationSprite", {
        get: function () { return WindTriggerDown; },
        enumerable: false,
        configurable: true
    });
    return WindTriggerRight;
}(WindTrigger));
var WindTriggerReset = /** @class */ (function (_super) {
    __extends(WindTriggerReset, _super);
    function WindTriggerReset() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.direction = null;
        _this.frameCol = 4;
        return _this;
    }
    return WindTriggerReset;
}(WindTrigger));
