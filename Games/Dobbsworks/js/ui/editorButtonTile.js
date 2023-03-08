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
var EditorButtonTile = /** @class */ (function (_super) {
    __extends(EditorButtonTile, _super);
    function EditorButtonTile(tileType, tooltip) {
        var _this = _super.call(this, tileType.editorTile ? tileType.editorTile : tileType.imageTile, tooltip) || this;
        _this.tileType = tileType;
        _this.tooltip = tooltip;
        _this.linkedFillType = new SimpleFill(tileType);
        _this.onClickEvents.push(function () {
            editorHandler.currentTool = new editorHandler.selectedFillBrush(_this.linkedFillType);
            editorHandler.hotbar.OnToolSelect(_this);
        });
        EditorButtonTile.AllTileButtons.push(_this);
        return _this;
    }
    EditorButtonTile.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var isSelected = editorHandler.currentTool instanceof FillBrush && editorHandler.currentTool.fillType === this.linkedFillType;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    };
    EditorButtonTile.prototype.AppendImage = function (imageTile) {
        if (imageTile == tiles["uiButtonAdd"][0][0]) {
            var image = new ImageFromTile(0, 0, 60, 60, imageTile);
            image.zoom = 1;
            this.AddChild(image);
        }
        else {
            this.AddChild(new ImageFromTile(0, 0, 50, 50, imageTile));
        }
        return this;
    };
    EditorButtonTile.prototype.CreateCopy = function () {
        var copy = new EditorButtonTile(this.tileType, this.tooltip);
        copy.linkedFillType = this.linkedFillType;
        copy.children = [];
        copy.AddChild(new ImageFromTile(0, 0, 50, 50, this.children[0].imageTile));
        for (var _i = 0, _a = this.children.slice(1); _i < _a.length; _i++) {
            var child = _a[_i];
            var img = child.imageTile;
            copy.AppendImage(img);
        }
        return copy;
    };
    EditorButtonTile.AllTileButtons = [];
    return EditorButtonTile;
}(EditorButton));
