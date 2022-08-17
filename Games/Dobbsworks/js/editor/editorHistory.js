"use strict";
var EditorHistory = /** @class */ (function () {
    function EditorHistory() {
        this.stack = [];
        // public Redo(): void {
        //     let previousState = this.redoStack.pop();
        //     if (previousState) {
        //         let mapExport = currentMap.GetExportString();
        //         this.stack.push(previousState);
        //         currentMap = LevelMap.FromImportString(mapExport);
        //     }
        // }
    }
    //public redoStack: string[] = []
    EditorHistory.prototype.RecordHistory = function () {
        var mapExport = currentMap.GetExportString();
        var previousState = this.stack[this.stack.length - 1];
        if (previousState) {
            if (mapExport == previousState)
                return;
        }
        this.stack.push(mapExport);
        //this.redoStack = [];
        if (this.stack.length > 20)
            this.stack.shift();
    };
    EditorHistory.prototype.Undo = function () {
        // TODO
        // let previousState = this.stack.pop();
        // if (previousState) {
        //     let mapExport = currentMap.GetExportString();
        //     //this.redoStack.push(mapExport);
        //     currentMap = LevelMap.FromImportString(previousState);
        // }
    };
    return EditorHistory;
}());
