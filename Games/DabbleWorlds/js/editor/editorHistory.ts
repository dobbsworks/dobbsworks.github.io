class EditorHistory {

    public stack: string[] = [];
    //public redoStack: string[] = []

    public RecordHistory(): void {
        let mapExport = currentMap.GetExportString();
        let previousState = this.stack[this.stack.length - 1];
        if (previousState) {
            if (mapExport == previousState) return;
        }
        this.stack.push(mapExport);
        //this.redoStack = [];
        if (this.stack.length > 20) this.stack.shift();
    }

    public Undo(): void {
        // TODO
        // let previousState = this.stack.pop();
        // if (previousState) {
        //     let mapExport = currentMap.GetExportString();
        //     //this.redoStack.push(mapExport);
        //     currentMap = LevelMap.FromImportString(previousState);
        // }
    }

    // public Redo(): void {
    //     let previousState = this.redoStack.pop();
    //     if (previousState) {
    //         let mapExport = currentMap.GetExportString();
    //         this.stack.push(previousState);
    //         currentMap = LevelMap.FromImportString(mapExport);
    //     }
    // }

    

}