

class BoardMenuOption {
    constructor(
        public Draw: (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => void,
        public OnSelect: () => void,
        public isEnabled: boolean = true
    ) { }
}

class BoardMenu {
    selectedMenuItem = 0;
    talkingHead: ImageTile | null = null;
    text = "";
    shopTimer = 0;

    constructor(public options: BoardMenuOption[]) {
    }

    Update(): void {
        if (!board || !board.currentPlayer) return;
        this.shopTimer++;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            let option = this.options[this.selectedMenuItem];
            if (option.isEnabled) {
                board.boardUI.currentMenu = null;
                option.OnSelect();
            }
        } else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            if (this.selectedMenuItem > 0) {
                this.selectedMenuItem--;
            }
        } else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            if (this.selectedMenuItem < this.options.length - 1) {
                this.selectedMenuItem++;
            }
        }
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (!board) return;
        let player = board.currentPlayer;
        if (!player) return;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FFF";
        let x = 60;
        let offset = Math.sin(board.timer / 10) * 3 + 3;

        for (let i = 0; i < this.options.length; i++) {
            let y = 80 + 110 * i;
            ctx.fillStyle = this.options[i].isEnabled ? "#000B" : "#444B";
            ctx.fillRect(x, y, 300, 100);
            if (this.selectedMenuItem == i) {
                ctx.strokeRect(x - offset, y - offset, 300 + offset * 2, 100 + offset * 2);
            }
            this.options[i].Draw(ctx, x, y, this.selectedMenuItem == i);
        }

        let talkingHeadY = 170;
        let slideTime = 60;
        if (this.shopTimer < slideTime) {
            talkingHeadY =  170 + 150 * (1 - Math.sin((this.shopTimer / slideTime) * (Math.PI / 2)))
        }
        if (this.talkingHead) {
            this.talkingHead.Draw(new Camera(camera.canvas), 380, talkingHeadY, 1, 1, false, false, 0);
        }

        if (this.text) {
            ctx.fillStyle = "#000E";
            ctx.fillRect(475, talkingHeadY + 270, 275, 60);
            ctx.fillStyle = "#FFF";
            ctx.textAlign = "left";
            ctx.font = `400 ${20}px ${"arial"}`;
            let charCount = Math.floor(this.shopTimer * 0.25);
            ctx.fillText(this.text.substring(0, charCount), 485, talkingHeadY + 270 + 40);
        }
    }

    static DrawItemPanel(ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean, item: BoardItem): void {
        if (!board || !board.currentPlayer) return;
        let rotation = isHighlighted ? Math.sin(board.timer / 30) / 3 : 0;
        item.imageTile.Draw(new Camera(camera.canvas), x - 480 + 45, y - 230, 0.5, 0.5, false, false, rotation);
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "left";
        ctx.font = `600 ${18}px ${"arial"}`;
        ctx.fillText(item.name, x + 90, y + 45);
        ctx.font = `400 ${14}px ${"arial"}`;
        ctx.fillText(item.description, x + 20, y + 90);
    }

    static DrawPricePanel(ctx: CanvasRenderingContext2D, x: number, y: number, displayPrice: number, actualPrice = 0): void {
        let isDiscounted = (actualPrice != 0 && actualPrice < displayPrice);
        if (!board || !board.currentPlayer) return;
        let image = tiles["priceTag"][0][0] as ImageTile;
        image.Draw(new Camera(camera.canvas), x - 121, y - 245, 1, 1, false, false, 0);

        ctx.fillStyle = displayPrice <= board.currentPlayer.coins ? (isDiscounted ? "#0003" : "#000") : "#F00";
        ctx.textAlign = "right";
        ctx.font = `800 ${20}px ${"arial"}`;
        ctx.fillText(displayPrice.toString(), x + 379, y + 30);

        if (isDiscounted) {
            BoardMenu.DrawPricePanel(ctx, x, y + 25, actualPrice);
        }
    }

    static DrawPlayerPanel(ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean, avatarIndex: number, mainText: string, subText: string): void {
        let image = tiles["playerIcons"][avatarIndex][0] as ImageTile;
        image.Draw(new Camera(camera.canvas), x - 480 + 45, y - 230, 0.35, 0.35, false, false, 0);
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "left";
        ctx.font = `600 ${18}px ${"arial"}`;
        ctx.fillText(mainText, x + 90, y + 45);
        ctx.font = `400 ${14}px ${"arial"}`;
        ctx.fillText(subText, x + 20, y + 90);
    }

    static CreateItemMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);
        let ret = new BoardMenu([
            new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    if (!board || !board.currentPlayer) return;
                    ctx.font = `800 ${36}px ${"arial"}`;
                    ctx.textAlign = "left";
                    ctx.fillStyle = "#FFF";
                    ctx.fillText("Roll!", y + 20, 145);
                    let dice = board.currentPlayer.diceBag.GetDiceSprites();
                    let dx = -250;
                    for (let die of dice) {
                        let image = die.GetImage(isHighlighted ? board.timer / 5 : 0);
                        image.Draw(new Camera(camera.canvas), dx, y - 220, 0.5, 0.5, false, false, 0);
                        dx += 60;
                    }
                },
                () => {
                    if (!board || !board.currentPlayer) return;

                    // Roll the dice!
                    board.boardUI.StartRoll();
                }
            )]);
        for (let item of board?.currentPlayer?.inventory) {
            ret.options.push(new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item);
                },
                () => {
                    if (!board || !board.currentPlayer) return;

                    // delete item from inventory
                    board.currentPlayer.inventory = board.currentPlayer.inventory.filter(a => a != item);

                    item.OnUse(board.currentPlayer, board);
                }
            ))
        }
        return ret;
    }

    static CreateShopMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);

        let itemsForSale = [
            { price: 5, item: itemList[6] },
            { price: 12, item: itemList[7] }
        ];

        let ret = new BoardMenu([new BoardMenuOption(
            (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                if (!board || !board.currentPlayer) return;
                ctx.font = `800 ${36}px ${"arial"}`;
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            },
            () => {
                if (!board || !board.currentPlayer) return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
            }
        )]);

        for (let item of itemsForSale) {
            let displayPrice = item.price;
            let actualPrice = board.currentPlayer.landedOnShop ? Math.ceil(displayPrice / 2) : displayPrice;
            ret.options.push(new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    if (!board || !board.currentPlayer) return;
                    BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item.item);
                    BoardMenu.DrawPricePanel(ctx, x, y, displayPrice, actualPrice);
                },
                () => {
                    if (!board || !board.currentPlayer) return;
                    board.currentPlayer.isInShop = false;
                    board.currentPlayer.landedOnShop = false;
                    cutsceneService.AddScene(new BoardCutSceneAddCoins(-actualPrice, board.currentPlayer));
                    board.currentPlayer.statNonGearSpending += actualPrice;
                    cutsceneService.AddScene(new BoardCutSceneAddItem(item.item, board.currentPlayer));
                },
                actualPrice <= board.currentPlayer.coins
            ))


        }

        ret.talkingHead = tiles["talkingHeads"][0][0];
        ret.text = "Welcome to the porkshop!";

        return ret;
    }

    static CreateGoldGearMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);

        let availableGears = [new ShopItemGoldenGear()];
        if (board.currentPlayer.landedOnShop || board.IsInLast5Turns()) {
            availableGears.push(new ShopItemGoldenGearX2());
        }
        if (board.currentPlayer.landedOnShop && board.IsInLast5Turns()) {
            availableGears.push(new ShopItemGoldenGearX3());
        }


        let gearOptions = availableGears.map((item, index) => {
            let gearPrice = 10 * (index + 1);
            return new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    if (!board || !board.currentPlayer) return;
                    BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item);
                    BoardMenu.DrawPricePanel(ctx, x, y, gearPrice);
                },
                () => {
                    if (!board || !board.currentPlayer) return;
                    board.currentPlayer.isInShop = false;
                    board.currentPlayer.landedOnShop = false;
                    cutsceneService.AddScene(new BoardCutSceneAddCoins(-gearPrice, board.currentPlayer));
                    cutsceneService.AddScene(new BoardCutSceneAddItem(new ShopItemGoldenGear(), board.currentPlayer));
                    cutsceneService.AddScene(new BoardCutSceneMoveGear());
                    board.PlaceGearSpace();
                },
                gearPrice < (board?.currentPlayer?.coins || 0)
            )
        });

        return new BoardMenu([...gearOptions, new BoardMenuOption(
            (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                if (!board || !board.currentPlayer) return;
                ctx.font = `800 ${36}px ${"arial"}`;
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            },
            () => {
                if (!board || !board.currentPlayer) return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
            }
        )]);
    }

    static CreateSwapPlacesMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);
        let user = board.currentPlayer;
        let targetablePlayers = board.players.filter(a => a.token?.currentSpace != user.token?.currentSpace);

        let ret = new BoardMenu(
            targetablePlayers.map(p => (new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    BoardMenu.DrawPlayerPanel(ctx, x, y, isHighlighted, p.avatarIndex, p.avatarName, `Swap places with ${p.avatarName}`);
                },
                () => {
                    if (!board || !board.currentPlayer || !board.currentPlayer.token || !p.token) return;
                    let targetSquare = p.token?.currentSpace;
                    p.token.currentSpace = board.currentPlayer.token.currentSpace;
                    board.currentPlayer.token.currentSpace = targetSquare;
                    // and then start the player's roll (NOT THE ITEM MENU)
                    board.boardUI.StartRoll();
                }
            )
            )));
        return ret;
    }

    static CreateWallopMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);

        let itemsForSale = [];
        if (board.players.some(a => a.coins > 0 && a != board?.currentPlayer)) {
            itemsForSale.push({ price: 5, item: new ShopItemStealCoins(), menu: BoardMenu.CreateWallopCoinMenu() });
        }
        if (board.players.some(a => a.gears > 0 && a != board?.currentPlayer)) {
            itemsForSale.push({ price: 50, item: new ShopItemStealGears(), menu: BoardMenu.CreateWallopGearMenu() });
        }

        let ret = new BoardMenu([new BoardMenuOption(
            (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                if (!board || !board.currentPlayer) return;
                ctx.font = `800 ${36}px ${"arial"}`;
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            },
            () => {
                if (!board || !board.currentPlayer) return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
            }
        )]);

        for (let item of itemsForSale) {
            let displayPrice = item.price;
            let actualPrice = board.currentPlayer.landedOnShop ? displayPrice - 5 : displayPrice;
            ret.options.push(new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    if (!board || !board.currentPlayer) return;
                    BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item.item);
                    BoardMenu.DrawPricePanel(ctx, x, y, displayPrice, actualPrice);
                },
                () => {
                    if (!board || !board.currentPlayer) return;
                    cutsceneService.AddScene(new BoardCutSceneAddCoins(-actualPrice, board.currentPlayer));
                    board.boardUI.currentMenu = item.menu;
                },
                actualPrice <= board.currentPlayer.coins
            ))


        }

        ret.talkingHead = tiles["talkingHeads"][1][0];
        ret.text = "I'm ready to rock!";

        return ret;
    }

    static CreateWallopCoinMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);
        let user = board.currentPlayer;
        let targetablePlayers = board.players.filter(a => a.coins > 0 && a != user);

        let ret = new BoardMenu(
            targetablePlayers.map(p => (new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    BoardMenu.DrawPlayerPanel(ctx, x, y, isHighlighted, p.avatarIndex, p.avatarName, `Steal coins from ${p.avatarName}`);
                },
                () => {
                    if (!board || !board.currentPlayer || !board.currentPlayer.token || !p.token) return;

                    let coinsToSteal = 7 + Math.floor(Math.random() * 8 + p.coins / 20);
                    coinsToSteal = Math.min(p.coins, coinsToSteal);
                    cutsceneService.AddScene(new BoardCutSceneAddCoins(-coinsToSteal, p));
                    cutsceneService.AddScene(new BoardCutSceneAddCoins(coinsToSteal, board.currentPlayer));
                    user.isInShop = false;
                    user.landedOnShop = false;
                }
            )
            )));
        return ret;
    }

    static CreateWallopGearMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);
        let user = board.currentPlayer;
        let targetablePlayers = board.players.filter(a => a.gears > 0 && a != user);

        let ret = new BoardMenu(
            targetablePlayers.map(p => (new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    BoardMenu.DrawPlayerPanel(ctx, x, y, isHighlighted, p.avatarIndex, p.avatarName, `Steal a golden gear from ${p.avatarName}`);
                },
                () => {
                    if (!board || !board.currentPlayer || !board.currentPlayer.token || !p.token) return;
                    p.gears--;
                    cutsceneService.AddScene(new BoardCutSceneAddItem(new ShopItemGoldenGear(), user));
                    user.isInShop = false;
                    user.landedOnShop = false;
                }
            )
            )));
        return ret;
    }

    

    static CreateBiodomeMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);

        let itemsForSale = [
            { price: board.biodomePrice, item: new ShopItemEnterBiodome(), action: () => {} },
            { price: board.biodomePrice + 10, item: new ShopItemEnterAndRaise(), action: () => {
                if (board) board.biodomePrice += 5;
            } }
        ];

        let ret = new BoardMenu([new BoardMenuOption(
            (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                if (!board || !board.currentPlayer) return;
                ctx.font = `800 ${36}px ${"arial"}`;
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            },
            () => {
                if (!board || !board.currentPlayer || !board.currentPlayer.token) return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
                let targetSpace = board.boardSpaces.find(x => x.label == "65") as BoardSpace;
                board.currentPlayer.token.currentSpace = board.currentPlayer.token.movementStartingSpace;
                board.currentPlayer.token.MoveToSpace(targetSpace);
            }
        )]);

        for (let item of itemsForSale) {
            ret.options.push(new BoardMenuOption(
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    if (!board || !board.currentPlayer) return;
                    BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item.item);
                    BoardMenu.DrawPricePanel(ctx, x, y, item.price, item.price);
                },
                () => {
                    if (!board || !board.currentPlayer) return;
                    cutsceneService.AddScene(new BoardCutSceneAddCoins(-item.price, board.currentPlayer));
                    board.currentPlayer.statNonGearSpending += item.price;
                    item.action();
                    board.currentPlayer.isInShop = false;
                },
                item.price <= board.currentPlayer.coins
            ))
        }

        ret.talkingHead = tiles["talkingHeads"][2][0];
        ret.text = "You like Pauly Shore movies?";

        return ret;
    }
    

    static CreateWarpPointMenu(targetSpaceLabel: string): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);

        let warpPrice = 5;

        let ret = new BoardMenu([new BoardMenuOption(
            (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                if (!board || !board.currentPlayer) return;
                ctx.font = `800 ${36}px ${"arial"}`;
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            },
            () => {
                if (!board || !board.currentPlayer || !board.currentPlayer.token) return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
            }
        ), new BoardMenuOption(
            (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                if (!board || !board.currentPlayer) return;
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, new ShopItemWarp());
                BoardMenu.DrawPricePanel(ctx, x, y, warpPrice, warpPrice);
            },
            () => {
                if (!board || !board.currentPlayer || !board.currentPlayer.token) return;
                cutsceneService.AddScene(new BoardCutSceneAddCoins(-warpPrice, board.currentPlayer));
                board.currentPlayer.statNonGearSpending += warpPrice;
                board.currentPlayer.isInShop = false;
                let targetSpace = board.boardSpaces.find(x => x.label == targetSpaceLabel) as BoardSpace;
                board.currentPlayer.token.currentSpace = targetSpace;
                board.currentPlayer.token.MoveToSpace(targetSpace.nextSpaces[0]);
            },
            warpPrice <= board.currentPlayer.coins
        )
    ]);


        ret.talkingHead = tiles["talkingHeads"][2][0];
        ret.text = "You ever see The Fly?";

        return ret;
    }
}