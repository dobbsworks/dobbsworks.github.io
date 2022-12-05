class EditorButtonSprite extends EditorButton {

    constructor(public spriteType: (SpriteType)) {
        super((new spriteType(0, 0, currentMap.mainLayer,[])).GetThumbnail(), Utility.PascalCaseToSpaces(spriteType.name));
        this.linkedTool = new SpritePlacer(this.spriteType);
        this.onClickEvents.push(() => {
            editorHandler.currentTool = this.linkedTool;
            editorHandler.hotbar.OnToolSelect(this);
        })
    }

    CreateCopy() {
        let copy = new EditorButtonSprite(this.spriteType);
        copy.linkedTool = this.linkedTool;
        return copy;
    }
    AppendImage(imageTile: ImageTile): EditorButtonSprite {
        this.AddChild(new ImageFromTile(0, 0, 50, 50, imageTile));
        return this;
    }

    ChangeTooltip(newTooltip: string): EditorButtonSprite {
        this.tooltip = newTooltip;
        return this;
    }

    linkedTool!: SpritePlacer;

    Update(): void {
        super.Update();
        let isSelected = editorHandler.currentTool === this.linkedTool;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    }
}