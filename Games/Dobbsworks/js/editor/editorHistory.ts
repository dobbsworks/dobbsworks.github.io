class EditorHistory {

    public stack: string[] = [];
    public currentStateIndex: number = -1;

    public RecordHistory(): void {
        let mapExport = currentMap.GetExportString();
        let previousState = this.stack[this.currentStateIndex];
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
        } else {
            this.currentStateIndex++;
        }
    }

    public Undo(): void {
        if (this.currentStateIndex <= 0) {
            // no historical states to revert to
            return;
        }
        this.currentStateIndex--;
        let historyState = this.stack[this.currentStateIndex];
        if (historyState) {
            currentMap = LevelMap.FromImportString(historyState);
        }
    }

    public Redo(): void {
        if (this.currentStateIndex >= this.stack.length - 1) {
            // no historical states to revert to
            // [ # # # # ]
            //         ^ current state
            return;
        }
        this.currentStateIndex++;
        let historyState = this.stack[this.currentStateIndex];
        if (historyState) {
            currentMap = LevelMap.FromImportString(historyState);
        }
    }



}