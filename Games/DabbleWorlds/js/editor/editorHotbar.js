"use strict";
var EditorHotbar = /** @class */ (function () {
    function EditorHotbar(panel) {
        this.panel = panel;
        this.mostRecentlyAdded = null;
    }
    EditorHotbar.prototype.OnToolSelect = function (editorButton) {
        editorHandler.mainToolPanel.Collapse();
        editorHandler.mainToolPanel.containerButton.isSelected = false;
        var existingButton = this.FindToolInHotbar(editorButton);
        if (existingButton) {
            if (existingButton instanceof EditorButtonSprite) {
                editorHandler.currentTool = existingButton.linkedTool;
            }
            if (existingButton instanceof EditorButtonTile) {
                editorHandler.currentTool = new editorHandler.selectedFillBrush(existingButton.linkedFillType);
            }
        }
        else {
            var copyButton = editorButton.CreateCopy();
            if (copyButton) {
                this.panel.AddChild(copyButton);
                this.mostRecentlyAdded = copyButton;
                if (this.panel.children.length > 9) {
                    this.panel.children.splice(0, 1);
                }
            }
        }
    };
    EditorHotbar.prototype.FindToolInHotbar = function (editorButton) {
        if (editorButton instanceof EditorButtonTile) {
            return this.panel.children.find(function (a) { return a instanceof EditorButtonTile && a.linkedFillType == editorButton.linkedFillType; });
        }
        if (editorButton instanceof EditorButtonSprite) {
            return this.panel.children.find(function (a) { return a instanceof EditorButtonSprite && a.linkedTool == editorButton.linkedTool; });
        }
        if (editorButton instanceof EditorButtonSlopePen) {
            return this.panel.children.find(function (a) { return a instanceof EditorButtonSlopePen && a.slopeFill == editorButton.slopeFill; });
        }
        return null;
    };
    return EditorHotbar;
}());
