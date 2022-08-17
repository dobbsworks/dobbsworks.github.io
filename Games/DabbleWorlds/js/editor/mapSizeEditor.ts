class MapSizeEditor extends Panel {
    constructor() {
        super(85, 85, camera.canvas.width - 85 * 2, camera.canvas.height - 85 * 2);
        this.layout = "vertical";
        let topPanel = new Panel(0, 0, this.width, 70);
        let midPanel = new Panel(0, 0, this.width, 210);
        let bottomPanel = new Panel(0, 0, this.width, 70);
        [bottomPanel, midPanel, topPanel].forEach(x => {
            this.AddChild(x);
        });
        let leftPanel = new Panel(0, 0, 70, midPanel.height);
        let rightPanel = new Panel(0, 0, 70, midPanel.height);
        midPanel.AddChild(leftPanel);
        midPanel.AddChild(rightPanel);

        [topPanel, bottomPanel].forEach(panel => {
            let ySide: -1 | 1 = panel == topPanel ? -1 : 1;
            let tileRowIndex = panel == topPanel ? 7 : 8;
            panel.AddChild(new Spacer(0, 0, (midPanel.width - 210) / 2, 60));
            panel.AddChild(new EditorMapSizeButton(tiles["editor"][5][1], 0, ySide, -1, this));
            panel.AddChild(new SpacedImagePanel(tiles["editor"][4][tileRowIndex]));
            panel.AddChild(new EditorMapSizeButton(tiles["editor"][5][0], 0, ySide, 1, this));
            if (ySide == -1) panel.AddChild(new Spacer(0, 0, (midPanel.width - 210) / 2, 60));
            if (ySide == 1) panel.AddChild(new Spacer(0, 0, 80, 60));
        });
        [1, 5, 20].forEach(a => bottomPanel.AddChild(new EditorButtonMapSizeChangeAmount(a)));

        [leftPanel, rightPanel].forEach(panel => {
            panel.layout = "vertical";
            let xSide: -1 | 1 = panel == leftPanel ? -1 : 1;
            let tileRowIndex = panel == leftPanel ? 6 : 5;
            panel.AddChild(new EditorMapSizeButton(tiles["editor"][5][1], xSide, 0, -1, this));
            panel.AddChild(new SpacedImagePanel(tiles["editor"][4][tileRowIndex]));
            panel.AddChild(new EditorMapSizeButton(tiles["editor"][5][0], xSide, 0, 1, this));
        });
    }

    margin = 0;
    backColor = "#1138";


    ChangeMapSize(dLeft: number, dRight: number, dTop: number, dBottom: number) {
        let layers = currentMap.GetLayerList();

        // SIZE LIMITS
        if (currentMap.mapHeight + dBottom < 12) {
            dBottom = 12 - currentMap.mapHeight;
        }
        if (currentMap.mapHeight + dTop < 12) {
            dTop = 12 - currentMap.mapHeight;
        }
        let mapWidth = layers[0].tiles.length;
        if (mapWidth + dRight < 20) {
            dRight = 20 - mapWidth;
        }
        if (mapWidth + dLeft < 20) {
            dLeft = 20 - mapWidth;
        }


        // CHANGING RIGHT SIDE
        if (dRight < 0) {
            layers.forEach(a => a.tiles.splice(a.tiles.length + dRight, -dRight));
        }
        if (dRight > 0) {
            layers.forEach(a => {
                let newColIndex = a.tiles.length;
                let colHeight = a.tiles[0].length;
                for (let y = 0; y < colHeight; y++) {
                    for (let i = 0; i < dRight; i++) {
                        a.SetTile(newColIndex + i, y, TileType.Air);
                    }
                }
            });
        }
        
        // CHANGING BOTTOM SIDE
        if (dBottom < 0) {
            currentMap.mapHeight += dBottom;
            layers.forEach(a => a.tiles.forEach(col => col.splice(col.length + dBottom, -dBottom)));
        }
        if (dBottom > 0) {
            currentMap.mapHeight += dBottom;
            for (let i = 0; i < dBottom; i++) {
                layers.forEach(a => {
                    let newRowIndex = a.tiles[0].length;
                    let rowWidth = a.tiles.length;
                    for (let x = 0; x < rowWidth; x++) {
                        a.SetTile(x, newRowIndex, TileType.Air);
                    }
                });
            }
        }
        
        // CHANGING LEFT SIDE
        if (dLeft != 0) {
            layers.forEach(a => {
                if (dLeft < 0) a.tiles.splice(0, -dLeft);
                for (let col of a.tiles) {
                    for (let tile of col) {
                        tile.tileX += dLeft;
                    }
                }
                if (dLeft > 0) {
                    let colHeight = a.tiles[0].length;
                    let newColumns: LevelTile[][] = [];
                    for (let x = 0; x < dLeft; x++) {
                        let newCol: LevelTile[] = [];
                        for (let y = 0; y < colHeight; y++) {
                            newCol.push(new LevelTile(x, y, TileType.Air, a));
                        }
                        newColumns.push(newCol);
                    }
                    a.tiles.unshift(...newColumns);
                    // for (let y = 0; y < colHeight; y++) {
                    //     for (let x = 0; x < dLeft; x++) {
                    //         a.SetTile(x, y, TileType.Air);
                    //     }
                    // }
                }
            });
            editorHandler.playerFrames.forEach(a => a.x += dLeft * 12);
            editorHandler.sprites.forEach(a => {
                a.tileCoord.tileX += dLeft;
                a.spriteInstance.x += dLeft * 12;
            })
            camera.x += dLeft * 12;
        }

        // CHANGING TOP SIDE
        if (dTop != 0) {
            currentMap.mapHeight += dTop;
            layers.forEach(a => {
                if (dTop < 0) a.tiles.forEach(a => a.splice(0, -dTop));
                for (let col of a.tiles) {
                    for (let tile of col) {
                        tile.tileY += dTop;
                    }
                }
                if (dTop > 0) {
                    for (let y = 0; y < a.tiles.length; y++) {
                        let newTiles: LevelTile[] = [];
                        for (let y = 0; y < dTop; y++) {
                            newTiles.push(new LevelTile(y, y, TileType.Air, a));
                        }
                        a.tiles[y].unshift(...newTiles)
                    }
                }
            });
            editorHandler.playerFrames.forEach(a => a.y += dTop * 12);
            editorHandler.sprites.forEach(a => {
                a.tileCoord.tileY += dTop;
                a.spriteInstance.y += dTop * 12;
            })
            camera.y += dTop * 12;
        }

        layers.forEach(a => a.isDirty = true);
    }




    Draw(ctx: CanvasRenderingContext2D) {
        super.Draw(ctx);
        if (!this.isHidden) {

            // draw all layers (no sky) on the panel
            // use cached canvases
            // find scale that fits entire map
            // eventually center it

            let maxWidth = this.width - 80 * 2;
            let maxHeight = this.height - 80 * 2;
            if (maxHeight <= 0 || maxWidth <= 0) return;

            // based on max size, find proportional max panel that can fit within max size
            let subpanelWidth = maxWidth;
            let subpanelHeight = maxHeight;

            let subPanelX = this.x + this.width / 2 - subpanelWidth / 2;
            let subPanelY = this.x + this.height / 2 - subpanelHeight / 2;

            ctx.fillStyle = "#aaa";
            ctx.fillRect(subPanelX, subPanelY, subpanelWidth, subpanelHeight);

            for (let layer of currentMap.GetLayerList()) {
                ctx.drawImage(layer.cachedCanvas, subPanelX, subPanelY, subpanelWidth, subpanelHeight);
            }
        }
    }
}


class SpacedImagePanel extends Panel {
    constructor(imageTile: ImageTile) {
        super(0, 0, 60, 60);
        this.AddChild(new ImageFromTile(0, 0, 50, 50, imageTile));
    }
}

class EditorButtonMapSizeChangeAmount extends EditorButton {

    constructor(public changeAmount: number) {
        super(tiles["editor"][6][changeAmount == 1 ? 3 : (changeAmount == 5 ? 4 : 5)], "Set map size change amount");
        this.onClickEvents.push(() => {
            editorHandler.mapSizeChangeAmount = this.changeAmount;
        })
    }

    Update(): void {
        super.Update();
        let isSelected = editorHandler.mapSizeChangeAmount == this.changeAmount;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    }
}

class EditorMapSizeButton extends EditorButton {
    constructor(imageTile: ImageTile, xSide: -1 | 0 | 1, ySide: -1 | 0 | 1, increaseOrDecrease: -1 | 1, editor: MapSizeEditor) {
        super(imageTile, "Edit map size");
        this.onClickEvents.push(
            () => {
                let dLeft = xSide == -1 ? increaseOrDecrease : 0;
                let dRight = xSide == 1 ? increaseOrDecrease : 0;
                let dTop = ySide == -1 ? increaseOrDecrease : 0;
                let dBottom = ySide == 1 ? increaseOrDecrease : 0;
                editor.ChangeMapSize(
                    dLeft * editorHandler.mapSizeChangeAmount,
                    dRight * editorHandler.mapSizeChangeAmount,
                    dTop * editorHandler.mapSizeChangeAmount,
                    dBottom * editorHandler.mapSizeChangeAmount);
            }
        );
    }
}