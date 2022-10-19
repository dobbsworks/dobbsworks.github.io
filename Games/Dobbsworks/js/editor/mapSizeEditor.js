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
var MapSizeEditor = /** @class */ (function (_super) {
    __extends(MapSizeEditor, _super);
    function MapSizeEditor() {
        var _this = _super.call(this, 85, 85, camera.canvas.width - 85 * 2, camera.canvas.height - 85 * 2) || this;
        _this.margin = 0;
        _this.backColor = "#1138";
        _this.layout = "vertical";
        var topPanel = new Panel(0, 0, _this.width, 70);
        var midPanel = new Panel(0, 0, _this.width, 210);
        var bottomPanel = new Panel(0, 0, _this.width, 70);
        [topPanel, midPanel, bottomPanel,].forEach(function (x) {
            _this.AddChild(x);
        });
        var leftPanel = new Panel(0, 0, 70, midPanel.height);
        var rightPanel = new Panel(0, 0, 70, midPanel.height);
        midPanel.AddChild(leftPanel);
        midPanel.AddChild(rightPanel);
        [topPanel, bottomPanel].forEach(function (panel) {
            var ySide = panel == topPanel ? -1 : 1;
            var tileRowIndex = panel == topPanel ? 7 : 8;
            panel.AddChild(new Spacer(0, 0, (midPanel.width - 210) / 2, 60));
            panel.AddChild(new EditorMapSizeButton(tiles["editor"][5][1], 0, ySide, -1, _this));
            panel.AddChild(new SpacedImagePanel(tiles["editor"][4][tileRowIndex]));
            panel.AddChild(new EditorMapSizeButton(tiles["editor"][5][0], 0, ySide, 1, _this));
            if (ySide == -1)
                panel.AddChild(new Spacer(0, 0, (midPanel.width - 210) / 2, 60));
            if (ySide == 1)
                panel.AddChild(new Spacer(0, 0, 80, 60));
        });
        [1, 5, 20].forEach(function (a) { return bottomPanel.AddChild(new EditorButtonMapSizeChangeAmount(a)); });
        [leftPanel, rightPanel].forEach(function (panel) {
            panel.layout = "vertical";
            var xSide = panel == leftPanel ? -1 : 1;
            var tileRowIndex = panel == leftPanel ? 6 : 5;
            panel.AddChild(new EditorMapSizeButton(tiles["editor"][5][0], xSide, 0, 1, _this));
            panel.AddChild(new SpacedImagePanel(tiles["editor"][4][tileRowIndex]));
            panel.AddChild(new EditorMapSizeButton(tiles["editor"][5][1], xSide, 0, -1, _this));
        });
        return _this;
    }
    MapSizeEditor.prototype.ChangeMapSize = function (dLeft, dRight, dTop, dBottom) {
        var layers = currentMap.GetLayerList();
        // SIZE LIMITS
        if (currentMap.mapHeight + dBottom < 12) {
            dBottom = 12 - currentMap.mapHeight;
        }
        if (currentMap.mapHeight + dTop < 12) {
            dTop = 12 - currentMap.mapHeight;
        }
        var mapWidth = layers[0].tiles.length;
        if (mapWidth + dRight < 20) {
            dRight = 20 - mapWidth;
        }
        if (mapWidth + dLeft < 20) {
            dLeft = 20 - mapWidth;
        }
        // CHANGING RIGHT SIDE
        if (dRight < 0) {
            layers.forEach(function (a) { return a.tiles.splice(a.tiles.length + dRight, -dRight); });
        }
        if (dRight > 0) {
            layers.forEach(function (a) {
                var newColIndex = a.tiles.length;
                var colHeight = a.tiles[0].length;
                for (var y = 0; y < colHeight; y++) {
                    for (var i = 0; i < dRight; i++) {
                        a.SetTile(newColIndex + i, y, TileType.Air);
                    }
                }
            });
        }
        // CHANGING BOTTOM SIDE
        if (dBottom < 0) {
            currentMap.mapHeight += dBottom;
            layers.forEach(function (a) { return a.tiles.forEach(function (col) { return col.splice(col.length + dBottom, -dBottom); }); });
        }
        if (dBottom > 0) {
            currentMap.mapHeight += dBottom;
            for (var i = 0; i < dBottom; i++) {
                layers.forEach(function (a) {
                    var newRowIndex = a.tiles[0].length;
                    var rowWidth = a.tiles.length;
                    for (var x = 0; x < rowWidth; x++) {
                        a.SetTile(x, newRowIndex, TileType.Air);
                    }
                });
            }
        }
        // CHANGING LEFT SIDE
        if (dLeft != 0) {
            layers.forEach(function (a) {
                var _a;
                if (dLeft < 0)
                    a.tiles.splice(0, -dLeft);
                for (var _i = 0, _b = a.tiles; _i < _b.length; _i++) {
                    var col = _b[_i];
                    for (var _c = 0, col_1 = col; _c < col_1.length; _c++) {
                        var tile = col_1[_c];
                        tile.tileX += dLeft;
                    }
                }
                if (dLeft > 0) {
                    var colHeight = a.tiles[0].length;
                    var newColumns = [];
                    for (var x = 0; x < dLeft; x++) {
                        var newCol = [];
                        for (var y = 0; y < colHeight; y++) {
                            newCol.push(new LevelTile(x, y, TileType.Air, a));
                        }
                        newColumns.push(newCol);
                    }
                    (_a = a.tiles).unshift.apply(_a, newColumns);
                    // for (let y = 0; y < colHeight; y++) {
                    //     for (let x = 0; x < dLeft; x++) {
                    //         a.SetTile(x, y, TileType.Air);
                    //     }
                    // }
                }
            });
            editorHandler.playerFrames.forEach(function (a) { return a.x += dLeft * 12; });
            editorHandler.sprites.forEach(function (a) {
                a.tileCoord.tileX += dLeft;
                a.spriteInstance.x += dLeft * 12;
            });
            camera.x += dLeft * 12;
        }
        // CHANGING TOP SIDE
        if (dTop != 0) {
            currentMap.mapHeight += dTop;
            layers.forEach(function (a) {
                var _a;
                if (dTop < 0)
                    a.tiles.forEach(function (a) { return a.splice(0, -dTop); });
                for (var _i = 0, _b = a.tiles; _i < _b.length; _i++) {
                    var col = _b[_i];
                    for (var _c = 0, col_2 = col; _c < col_2.length; _c++) {
                        var tile = col_2[_c];
                        tile.tileY += dTop;
                    }
                }
                if (dTop > 0) {
                    for (var y = 0; y < a.tiles.length; y++) {
                        var newTiles = [];
                        for (var y_1 = 0; y_1 < dTop; y_1++) {
                            newTiles.push(new LevelTile(y_1, y_1, TileType.Air, a));
                        }
                        (_a = a.tiles[y]).unshift.apply(_a, newTiles);
                    }
                }
            });
            editorHandler.playerFrames.forEach(function (a) { return a.y += dTop * 12; });
            editorHandler.sprites.forEach(function (a) {
                a.tileCoord.tileY += dTop;
                a.spriteInstance.y += dTop * 12;
            });
            camera.y += dTop * 12;
        }
        layers.forEach(function (a) { return a.isDirty = true; });
        editorHandler.history.RecordHistory();
    };
    MapSizeEditor.prototype.Draw = function (ctx) {
        _super.prototype.Draw.call(this, ctx);
        if (!this.isHidden) {
            // draw all layers (no sky) on the panel
            // use cached canvases
            // find scale that fits entire map
            // eventually center it
            var maxWidth = this.width - 80 * 2;
            var maxHeight = this.height - 80 * 2;
            if (maxHeight <= 0 || maxWidth <= 0)
                return;
            // based on max size, find proportional max panel that can fit within max size
            var subpanelWidth = maxWidth;
            var subpanelHeight = maxHeight;
            var subPanelX = this.x + this.width / 2 - subpanelWidth / 2;
            var subPanelY = this.x + this.height / 2 - subpanelHeight / 2;
            ctx.fillStyle = "#aaa";
            ctx.fillRect(subPanelX, subPanelY, subpanelWidth, subpanelHeight);
            for (var _i = 0, _a = currentMap.GetLayerList(); _i < _a.length; _i++) {
                var layer = _a[_i];
                ctx.drawImage(layer.cachedCanvas, subPanelX, subPanelY, subpanelWidth, subpanelHeight);
            }
        }
    };
    return MapSizeEditor;
}(Panel));
var SpacedImagePanel = /** @class */ (function (_super) {
    __extends(SpacedImagePanel, _super);
    function SpacedImagePanel(imageTile) {
        var _this = _super.call(this, 0, 0, 60, 60) || this;
        _this.AddChild(new ImageFromTile(0, 0, 50, 50, imageTile));
        return _this;
    }
    return SpacedImagePanel;
}(Panel));
var EditorButtonMapSizeChangeAmount = /** @class */ (function (_super) {
    __extends(EditorButtonMapSizeChangeAmount, _super);
    function EditorButtonMapSizeChangeAmount(changeAmount) {
        var _this = _super.call(this, tiles["editor"][6][changeAmount == 1 ? 3 : (changeAmount == 5 ? 4 : 5)], "Set map size change amount") || this;
        _this.changeAmount = changeAmount;
        _this.onClickEvents.push(function () {
            editorHandler.mapSizeChangeAmount = _this.changeAmount;
        });
        return _this;
    }
    EditorButtonMapSizeChangeAmount.prototype.Update = function () {
        _super.prototype.Update.call(this);
        var isSelected = editorHandler.mapSizeChangeAmount == this.changeAmount;
        this.borderColor = isSelected ? "#FF2E" : "#FF20";
    };
    return EditorButtonMapSizeChangeAmount;
}(EditorButton));
var EditorMapSizeButton = /** @class */ (function (_super) {
    __extends(EditorMapSizeButton, _super);
    function EditorMapSizeButton(imageTile, xSide, ySide, increaseOrDecrease, editor) {
        var _this = _super.call(this, imageTile, "Edit map size") || this;
        _this.onClickEvents.push(function () {
            var dLeft = xSide == -1 ? increaseOrDecrease : 0;
            var dRight = xSide == 1 ? increaseOrDecrease : 0;
            var dTop = ySide == -1 ? increaseOrDecrease : 0;
            var dBottom = ySide == 1 ? increaseOrDecrease : 0;
            editor.ChangeMapSize(dLeft * editorHandler.mapSizeChangeAmount, dRight * editorHandler.mapSizeChangeAmount, dTop * editorHandler.mapSizeChangeAmount, dBottom * editorHandler.mapSizeChangeAmount);
        });
        return _this;
    }
    return EditorMapSizeButton;
}(EditorButton));
