class EditorHotbar {
    constructor(public panel: Panel) { 
        
    }

    mostRecentlyAdded: EditorButtonTile | EditorButtonSprite | EditorButtonSlopePen | null = null;

    OnToolSelect(editorButton: EditorButtonTile | EditorButtonSprite | EditorButtonSlopePen): void {
        editorHandler.mainToolPanel.Collapse();
        editorHandler.mainToolPanel.containerButton.isSelected = false;
        let existingButton = this.FindToolInHotbar(editorButton);
        if (existingButton) {
            if (existingButton instanceof EditorButtonSprite) {
                editorHandler.currentTool = existingButton.linkedTool;
            }
            if (existingButton instanceof EditorButtonTile) {
                editorHandler.currentTool = new editorHandler.selectedFillBrush(existingButton.linkedFillType);
            }
        } else {
            let copyButton = editorButton.CreateCopy();
            if (copyButton) {
                this.panel.AddChild(copyButton);
                this.mostRecentlyAdded = copyButton;
                if (this.panel.children.length > 9) {
                    this.panel.children.splice(0, 1);
                }
            }
        }
    }

    FindToolInHotbar(editorButton: EditorButtonTile | EditorButtonSprite | EditorButtonSlopePen): EditorButton | null {
        if (editorButton instanceof EditorButtonTile) {
            return <EditorButtonTile | null>this.panel.children.find(a => a instanceof EditorButtonTile && a.linkedFillType == editorButton.linkedFillType);
        }
        if (editorButton instanceof EditorButtonSprite) {
            return <EditorButtonSprite | null>this.panel.children.find(a => a instanceof EditorButtonSprite && a.linkedTool == editorButton.linkedTool);
        }
        if (editorButton instanceof EditorButtonSlopePen) {
            return <EditorButtonSlopePen | null>this.panel.children.find(a => a instanceof EditorButtonSlopePen && a.slopeFill == editorButton.slopeFill);
        }
        return null;
    }
}