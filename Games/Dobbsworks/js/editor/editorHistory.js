"use strict";
var EditorHistory = /** @class */ (function () {
    function EditorHistory() {
        this.stack = [];
        this.currentStateIndex = -1;
    }
    EditorHistory.prototype.RecordHistory = function () {
        var mapExport = currentMap.GetExportString();
        var previousState = this.stack[this.currentStateIndex];
        if (previousState && mapExport == previousState) {
            return;
        }
        if (this.currentStateIndex < this.stack.length - 1) {
            // we did some undo-ing, need to delete redo stack
            this.stack.splice(this.currentStateIndex + 1, this.stack.length - (this.currentStateIndex + 1));
            // [ # # # # x x x x x x x x x x]
            //         ^ current state
        }
        this.stack.push(mapExport);
        if (this.stack.length > 20) {
            this.stack.shift();
        }
        else {
            this.currentStateIndex++;
        }
    };
    EditorHistory.prototype.Undo = function () {
        if (this.currentStateIndex <= 0) {
            // no historical states to revert to
            return;
        }
        this.currentStateIndex--;
        var historyState = this.stack[this.currentStateIndex];
        if (historyState) {
            currentMap = LevelMap.FromImportString(historyState);
        }
    };
    EditorHistory.prototype.Redo = function () {
        if (this.currentStateIndex >= this.stack.length - 1) {
            // no historical states to revert to
            // [ # # # # ]
            //         ^ current state
            return;
        }
        this.currentStateIndex++;
        var historyState = this.stack[this.currentStateIndex];
        if (historyState) {
            currentMap = LevelMap.FromImportString(historyState);
        }
    };
    return EditorHistory;
}());
