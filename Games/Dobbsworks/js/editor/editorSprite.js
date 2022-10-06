"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var EditorSprite = /** @class */ (function () {
    function EditorSprite(spriteType, tileCoord) {
        this.spriteType = spriteType;
        this.tileCoord = tileCoord;
        this.width = 1;
        this.height = 1;
        this.isHeld = false;
        this.wiggle = 0; // used for animation when a sprite is dropped onto the editor
        this.editorProps = [];
        if (currentMap) {
            this.ResetSprite();
            this.frameData = this.spriteInstance.GetFrameData(0);
            this.SetSize();
        }
    }
    EditorSprite.prototype.GetTopRightCoord = function () {
        return { tileX: this.tileCoord.tileX + this.width - 1, tileY: this.tileCoord.tileY };
    };
    EditorSprite.prototype.SetPosition = function (newTileCoord) {
        this.tileCoord = newTileCoord;
        var tileWidth = this.spriteInstance.layer.tileWidth;
        var tileHeight = this.spriteInstance.layer.tileHeight;
        var anchor = this.spriteInstance.anchor;
        var midX = newTileCoord.tileX * tileWidth + (this.width * tileWidth - this.spriteInstance.width) / 2;
        var midY = newTileCoord.tileY * tileHeight + (this.height * tileHeight - this.spriteInstance.height) / 2;
        if (anchor == Direction.Up) {
            this.spriteInstance.x = midX;
            this.spriteInstance.y = newTileCoord.tileY * tileHeight;
        }
        else if (anchor == Direction.Down) {
            this.spriteInstance.x = midX;
            this.spriteInstance.y = (newTileCoord.tileY + this.height) * tileHeight - this.spriteInstance.height;
        }
        else if (anchor == Direction.Left) {
            this.spriteInstance.x = newTileCoord.tileX * tileWidth;
            this.spriteInstance.y = midY;
        }
        else if (anchor == Direction.Right) {
            this.spriteInstance.x = (newTileCoord.tileX + this.width) * tileWidth - this.spriteInstance.width;
            this.spriteInstance.y = midY;
        }
        else {
            this.spriteInstance.x = midX;
            this.spriteInstance.y = midY;
        }
    };
    EditorSprite.prototype.SetSize = function () {
        this.width = Math.max(1, Math.ceil((this.spriteInstance.width - 5) / currentMap.mainLayer.tileWidth));
        this.height = Math.max(1, Math.ceil((this.spriteInstance.height - 5) / currentMap.mainLayer.tileHeight));
    };
    EditorSprite.prototype.ResetSprite = function () {
        var tileWidth = currentMap.mainLayer.tileWidth;
        var tileHeight = currentMap.mainLayer.tileHeight;
        this.spriteInstance = new this.spriteType(this.tileCoord.tileX * tileWidth, this.tileCoord.tileY * tileHeight, currentMap.mainLayer, this.editorProps);
        this.SetPosition(this.tileCoord);
        this.frameData = this.spriteInstance.GetFrameData(0);
    };
    EditorSprite.prototype.ResetStack = function () {
        if (this.spriteInstance instanceof Enemy) {
            var belowCoords = [];
            for (var xOff = 0; xOff < this.width; xOff++) {
                belowCoords.push({ tileX: this.tileCoord.tileX + xOff, tileY: this.tileCoord.tileY + this.height });
            }
            var _loop_1 = function (belowCoord) {
                var spriteBelow = editorHandler.sprites.find(function (a) { return a.ContainsTile(belowCoord); });
                if (spriteBelow && spriteBelow.spriteInstance && spriteBelow.spriteInstance instanceof Enemy) {
                    this_1.spriteInstance.stackedOn = spriteBelow.spriteInstance;
                    return "break";
                }
            };
            var this_1 = this;
            for (var _i = 0, belowCoords_1 = belowCoords; _i < belowCoords_1.length; _i++) {
                var belowCoord = belowCoords_1[_i];
                var state_1 = _loop_1(belowCoord);
                if (state_1 === "break")
                    break;
            }
            this.SetSize();
        }
    };
    EditorSprite.prototype.ContainsTile = function (tileCoord) {
        var xOffset = tileCoord.tileX - this.tileCoord.tileX;
        var yOffset = tileCoord.tileY - this.tileCoord.tileY;
        return (xOffset >= 0 && xOffset < this.width && yOffset >= 0 && yOffset < this.height);
    };
    EditorSprite.prototype.OverlapsSprite = function (sprite) {
        return sprite != this
            && this.tileCoord.tileX < sprite.tileCoord.tileX + sprite.width
            && this.tileCoord.tileX + this.width > sprite.tileCoord.tileX
            && this.tileCoord.tileY < sprite.tileCoord.tileY + sprite.height
            && this.tileCoord.tileY + this.height > sprite.tileCoord.tileY;
    };
    EditorSprite.prototype.Update = function () {
        if (this.wiggle > 0)
            this.wiggle -= 0.05;
        if (this.wiggle < 0)
            this.wiggle = 0;
    };
    EditorSprite.prototype.Wiggle = function (timing) {
        this.wiggle = 0.3 + timing * 0.1;
    };
    EditorSprite.prototype.StackWiggle = function (direction, timing) {
        var _this = this;
        this.Wiggle(timing);
        //this.ResetSprite();
        if (this.spriteInstance instanceof Enemy) {
            if (direction == 1 || direction == 0) {
                var spriteBelow = editorHandler.sprites.find(function (a) { return a.tileCoord.tileX == _this.tileCoord.tileX && a.tileCoord.tileY == _this.tileCoord.tileY + _this.height; });
                if (spriteBelow && spriteBelow.spriteInstance && spriteBelow.spriteInstance instanceof Enemy)
                    spriteBelow.StackWiggle(1, timing + 1);
            }
            if (direction == -1 || direction == 0) {
                var spriteAbove = editorHandler.sprites.find(function (a) { return a.tileCoord.tileX == _this.tileCoord.tileX && a.tileCoord.tileY + a.height == _this.tileCoord.tileY; });
                if (spriteAbove && spriteAbove.spriteInstance && spriteAbove.spriteInstance instanceof Enemy)
                    spriteAbove.StackWiggle(-1, timing + 1);
            }
        }
    };
    EditorSprite.prototype.Draw = function (frameNum) {
        var frameData = this.frameData;
        var totalWiggle = this.wiggle > 0.3 ? 0 : this.wiggle;
        if (this.isHeld) {
            totalWiggle += (Math.sin(frameNum / 15) + 1) / 15;
        }
        if ('xFlip' in frameData) {
            var imgTile = frameData.imageTile;
            imgTile.Draw(camera.ctx, (this.spriteInstance.x - camera.x - frameData.xOffset + this.spriteInstance.width / 2 * totalWiggle) * camera.scale + camera.canvas.width / 2, (this.spriteInstance.y - camera.y - frameData.yOffset - this.spriteInstance.height / 2 * totalWiggle) * camera.scale + camera.canvas.height / 2, camera.scale, frameData.xFlip, frameData.yFlip, 1 + totalWiggle);
        }
        else {
            for (var _i = 0, _a = frameData; _i < _a.length; _i++) {
                var fd = _a[_i];
                var imgTile = fd.imageTile;
                imgTile.Draw(camera.ctx, (this.spriteInstance.x - camera.x - fd.xOffset + imgTile.width / 2 * totalWiggle) * camera.scale + camera.canvas.width / 2, (this.spriteInstance.y - camera.y - fd.yOffset - imgTile.height / 2 * totalWiggle) * camera.scale + camera.canvas.height / 2, camera.scale, fd.xFlip, fd.yFlip, 1 + totalWiggle);
            }
        }
        // camera.ctx.strokeStyle = "#F008";
        // camera.ctx.strokeRect(
        //     (this.tileCoord.tileX * 12 - camera.x) * camera.scale + camera.canvas.width / 2,
        //     (this.tileCoord.tileY * 12 - camera.y) * camera.scale + camera.canvas.height / 2,
        //     12 * camera.scale, 12 * camera.scale);
    };
    EditorSprite.prototype.Copy = function () {
        var spr = new EditorSprite(this.spriteType, __assign({}, this.tileCoord));
        spr.editorProps = __spreadArrays(this.editorProps); // include props
        return spr;
    };
    return EditorSprite;
}());
// todo: list of overwrite values (snowman length), gift contents
