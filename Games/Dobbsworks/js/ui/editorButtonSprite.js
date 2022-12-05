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
var EditorButtonSprite = /** @class */ (function (_super) {
    __extends(EditorButtonSprite, _super);
    function EditorButtonSprite(spriteType) {
        var _this = _super.call(this, (new spriteType(0, 0, currentMap.mainLayer, [])).GetThumbnail(), Utility.PascalCaseToSpaces(spriteType.name)) || this;
        _this.spriteType = spriteType;
        _this.linkedTool = new SpritePlacer(_this.spriteType);
        _this.onClickEvents.push(function () {
            editorHandler.currentTool = _this.linkedTool;
            editorHandler.hotbar.OnToolSelect(_this);
        });
        return _this;
    }
    EditorButtonSprite.prototype.CreateCopy = function () {
        var copy = new EditorButtonSprite(this.spriteType);
        copy.linkedTool = this.linkedTool;
        return copy;
    };
    EditorButtonSprite.prototype.AppendImage = function (imageTile) {
        this.AddChild(new ImageFromTile(0, 0, 50, 50, imageTile));
        return this;
    };
    EditorButtonSprite.prototype.ChangeTooltip = function (newTooltip) {
        this.tooltip = newTooltip;
        return this;
    };
    EditorButtonSprite.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var isSelected = editorHandler.currentTool === this.linkedTool;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    };
    return EditorButtonSprite;
}(EditorButton));
