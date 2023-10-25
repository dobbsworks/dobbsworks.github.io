

class BoardMenuOption {
    constructor(
        public plainText: string,
        public Draw: (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => void,
        public OnSelect: () => void,
        public isEnabled: boolean = true,
    ) { }

    static DrawCancel(ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) {
        BoardMenuOption.PlainText("No thanks!")(ctx, x, y, isHighlighted);
    }
    static PlainText(text: string) {
        return (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
            ctx.font = `800 ${36}px ${"arial"}`;
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFF";
            ctx.fillText(text, x + 40, y + 65);
        }
    }
    static PlainTextSmall(text: string) {
        return (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
            ctx.font = `800 ${14}px ${"arial"}`;
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFF";
            ctx.fillText(text, x + 40, y + 65);
        }
    }
}
class BoardMenuOptionCancel extends BoardMenuOption {
    constructor(text: string = "No thanks", additionalAction: () => void = () => { }) {
        super(text, BoardMenuOption.DrawCancel,
            () => {
                if (!board || !board.currentPlayer) return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
                additionalAction();
            }
        );
    }
}
class BoardMenuOptionTurnRoll extends BoardMenuOption {
    constructor() {
        super("Roll",
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
            });
    }
}


class BoardMenu {
    selectedMenuItem = 0;
    talkingHead: ImageTile | null = null;
    text = "";
    shopTimer = 0;
    static HalfOff: DiscountLogic = (oldPrice: number) => { return Math.ceil(oldPrice / 2) };
    static Minus5: DiscountLogic = (oldPrice: number) => { return oldPrice - 5 };

    constructor(public options: BoardMenuOption[]) { }

    private waitingForData = false;

    Update(): void {
        if (!board) return;
        this.shopTimer++;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.ChooseHighlightedOption();
        } else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true) || KeyboardHandler.IsKeyPressed(KeyAction.Left, true)) {
            if (this.selectedMenuItem > 0) {
                this.selectedMenuItem--;
            } else {
                this.selectedMenuItem = this.options.length - 1;
            }
        } else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true) || KeyboardHandler.IsKeyPressed(KeyAction.Right, true)) {
            if (this.selectedMenuItem < this.options.length - 1) {
                this.selectedMenuItem++;
            } else {
                this.selectedMenuItem = 0;
            }
        } else {
            if (!this.waitingForData && board!.currentPlayer) {
                if (board.players.indexOf(board.currentPlayer) != clientPlayerIndex) {
                    this.waitingForData = true;
                    this.RequestData();
                }
            }
        }
    }

    ChooseHighlightedOption() {
        let option = this.options[this.selectedMenuItem];
        if (option.isEnabled) {
            board!.boardUI.currentMenu = null;
            option.OnSelect();
        }
    }

    RequestData(): void {
        DataService.GetGameData(board!.gameId).then(dt => {
            let menu = this;
            setTimeout(() => {
                menu.waitingForData = false;
            }, 2000);
            if (dt.latestMenu) {
                if (dt.latestMenu.menuId == board!.boardUI.menuId) {
                    this.selectedMenuItem = dt.latestMenu.selectedIndex;
                    this.ChooseHighlightedOption();
                }
            }
        });
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
            talkingHeadY = 170 + 150 * (1 - Math.sin((this.shopTimer / slideTime) * (Math.PI / 2)))
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



    static CreateTurnStartMenu(): BoardMenu {
        if (!board || !board.currentPlayer) return new BoardMenu([]);
        let ret = new BoardMenu([new BoardMenuOptionTurnRoll()]);
        for (let item of board?.currentPlayer?.inventory) {
            ret.options.push(new BoardMenuOption("Use " + item.name + " - " + item.description,
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item);
                },
                () => {
                    if (!board || !board.currentPlayer) return;
                    board.currentPlayer.inventory = board.currentPlayer.inventory.filter(a => a != item);
                    item.OnUse(board.currentPlayer, board);
                }
            ))
        }
        return ret;
    }

    static CreateShopMenu(): BoardMenu {
        let itemPool: { price: number, item: BoardItem }[] = [
            { price: 25, item: itemList[0] },
            { price: 10, item: itemList[1] },
            { price: 2, item: itemList[2] },
            { price: 4, item: itemList[3] },
            { price: 6, item: itemList[4] },
            { price: 8, item: itemList[5] },
            { price: 10, item: itemList[6] },
            { price: 12, item: itemList[7] }
        ];
        let itemsForSale: { price: number, item: BoardItem }[] = Random.GetShuffledCopy(itemPool).slice(0, 3);
        let ret = new BoardMenuShop(itemsForSale, BoardMenuShop.HalfOff);
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

        let itemPool = availableGears.map((item, index) => {
            let gearPrice = 10 * (index + 1);
            return { item: item, price: gearPrice };
        });

        return new BoardMenuGearShop(itemPool);
    }

    static CreateSwapPlacesMenu(): BoardMenu {
        return new BoardMenuPlayerSelect(
            (p: Player) => true,
            (playerName: string) => `Swap places with ${playerName}`,
            (p) => {
                cutsceneService.AddScene(new BoardCutScenePortalSwap(board!.currentPlayer!, p));
            }
        )
    }

    static CreateWallopMenu(): BoardMenu {
        let ret = new BoardMenuShop([
            { price: 5, item: new ShopItemStealCoins() },
            { price: 30, item: new ShopItemStealGears() }
        ], BoardMenu.Minus5);
        ret.talkingHead = tiles["talkingHeads"][1][0];
        ret.text = "I'm ready to rock!";
        return ret;
    }

    static CreateWallopCoinMenu(): BoardMenu {
        return new BoardMenuPlayerSelect(
            (p: Player) => p.coins > 0,
            (playerName: string) => `Steal coins from ${playerName}`,
            (p) => {
                let coinsToSteal = 7 + Math.floor(Math.random() * 8 + p.coins / 20);
                coinsToSteal = Math.min(p.coins, coinsToSteal);
                cutsceneService.AddScene(new BoardCutSceneAddCoins(-coinsToSteal, p));
                cutsceneService.AddScene(new BoardCutSceneAddCoins(coinsToSteal, board!.currentPlayer!));
            }
        )
    }

    static CreateWallopGearMenu(): BoardMenu {
        return new BoardMenuPlayerSelect(
            (p: Player) => p.gears > 0,
            (playerName: string) => `Steal a gear from ${playerName}`,
            (p) => {
                p.gears--;
                cutsceneService.AddScene(new BoardCutSceneAddItem(new ShopItemGoldenGear(), board!.currentPlayer!));
            }
        )
    }

    static CreateBiodomeMenu(): BoardMenu {
        let ret = new BoardMenuShop([
            { price: board!.biodomePrice, item: new ShopItemEnterBiodome() },
            { price: board!.biodomePrice + 10, item: new ShopItemEnterAndRaise() }
        ]);
        ret.talkingHead = tiles["talkingHeads"][2][0];
        ret.text = "You like Pauly Shore movies?";
        ret.OnCancel = () => {
            if (!board || !board.currentPlayer) return;
            let targetSpace = board.boardSpaces.find(x => x.label == "65") as BoardSpace;
            board.currentPlayer.token.currentSpace = board.currentPlayer.token.movementStartingSpace;
            board.currentPlayer.token.MoveToSpace(targetSpace);
        }
        return ret;
    }

    static CreateWarpPointMenu(targetSpaceLabel: string): BoardMenu {
        let ret = new BoardMenuShop([{ price: 5, item: new ShopItemWarp() }]);
        ret.talkingHead = tiles["talkingHeads"][2][0];
        ret.text = "You ever see The Fly?";
        return ret;
    }

    static CreateClientMenu(id: number, options: string[]): BoardMenu {
        return new BoardMenu(options.map((o, optionIndex) => new BoardMenuOption(o,
            BoardMenuOption.PlainTextSmall(o),
            () => {
                if (board) {
                    board.latestCompletedMenuId = id;
                    board.boardUI.currentMenu = null;
                    DataService.SubmitMenuSelection(board.gameId, id, optionIndex);
                }
            }
        )));
    }
}


class BoardMenuChoosePath extends BoardMenu {

    constructor(private startingSpace: BoardSpace, private player: Player) { 
        super([]);
        var targetSpaces = startingSpace.nextSpaces;
        this.options = targetSpaces.map(a => {
            let angle = Math.atan2((a.gameY - this.startingSpace.gameY) * 2, a.gameX - this.startingSpace.gameX);
            let degrees = ((angle + Math.PI*2) % (Math.PI*2)) / (Math.PI*2) * 360;
            let eighths = Math.floor(degrees / 360 * 8 + 0.5);
            let direction = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"][eighths];
            return new BoardMenuOption(`Take ${direction} path`, ()=>{},
            () => {
                // on select
                if (!board) return;
                let nextSpace = this.startingSpace.nextSpaces[this.selectedMenuItem];
                player.token.MoveToSpace(nextSpace);
                player.isInShop = false;
            })
        })
    }

    Draw(ctx: CanvasRenderingContext2D): void {
        if (!board) return;
        let token = this.player.token;
        let nextSquares = this.startingSpace.nextSpaces;
        for (let i = 0; i < nextSquares.length; i++) {
            let nextSquare = nextSquares[i];
            let isSelected = this.selectedMenuItem == i;
            let pulse = Math.sin((board.timer || 0) / 10);
            let scale = isSelected ? 1 + pulse / 8 : 1;
            let angle = Math.atan2((nextSquare.gameY - this.startingSpace.gameY) * 2, nextSquare.gameX - this.startingSpace.gameX);
            let distance = 75 + (isSelected ? pulse * 5 : 0);
            let arrowImage = tiles["boardArrow"][i][0] as ImageTile;
            arrowImage.Draw(camera, token.x + distance * Math.cos(angle), token.y + distance * Math.sin(angle), 1 * scale, 0.5 * scale, false, false, angle);
        }
    }
}



type DiscountLogic = (oldPrice: number) => number;
type ItemPoolElement = { item: BoardItem, price: number }

class BoardMenuShop extends BoardMenu {
    cancelFirst = true;
    constructor(itemPool: ItemPoolElement[], discountLogic: (oldPrice: number) => number = (oldPrice: number) => oldPrice) {
        super([]);
        itemPool.sort((a, b) => a.price - b.price);
        let options = [];
        for (let item of itemPool) {
            let displayPrice = item.price;
            let actualPrice = board!.currentPlayer!.landedOnShop ? discountLogic(displayPrice) : displayPrice;
            options.push(new BoardMenuOption("Buy " + item.item.name + " for " + actualPrice + " coins",
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
                    if (!item.item.isGear) {
                        board.currentPlayer.statNonGearSpending += actualPrice;
                    }
                    this.OnBuy(item.item, actualPrice);
                    item.item.AfterPurchase(board.currentPlayer);
                },
                actualPrice <= board!.currentPlayer!.coins
            ))
        }

        let cancel = new BoardMenuOptionCancel("No thanks", this.OnCancel)

        if (this.cancelFirst) {
            options.unshift(cancel);
        } else {
            options.push(cancel);
        }

        this.options = options;
    }

    OnCancel(): void { }

    OnBuy(item: BoardItem, price: number): void {
        cutsceneService.AddScene(new BoardCutSceneAddItem(item, board!.currentPlayer!));
    }
}
class BoardMenuGearShop extends BoardMenuShop {
    cancelFirst = false;
    OnBuy(item: BoardItem, price: number): void {
        cutsceneService.AddScene(new BoardCutSceneSingleAction(() => {
            audioHandler.SetBackgroundMusic("silence");
            audioHandler.PlaySound("gearGet", true);
            setTimeout(() => { audioHandler.SetBackgroundMusic("level1"); }, 6000)
        }));
        cutsceneService.AddScene(new BoardCutSceneAddItem(new ShopItemGoldenGear(), board!.currentPlayer!));
        cutsceneService.AddScene(new BoardCutSceneMoveGear(false));
        board!.PlaceGearSpace();
    }
}

class BoardMenuPlayerSelect extends BoardMenu {
    constructor(canSelect: (p: Player) => boolean, choiceDescription: (playerName: string) => string, onSelect: (p: Player) => void) {
        super([]);

        let options = [];
        let availablePlayers = [...board!.players].filter(a => canSelect(a) && a != board!.currentPlayer!);

        for (let player of availablePlayers) {
            options.push(new BoardMenuOption(player.avatarName,
                (ctx: CanvasRenderingContext2D, x: number, y: number, isHighlighted: boolean) => {
                    BoardMenu.DrawPlayerPanel(ctx, x, y, isHighlighted, player.avatarIndex, player.avatarName, choiceDescription(player.avatarName));
                },
                () => {
                    if (!board || !board.currentPlayer) return;
                    board.currentPlayer.isInShop = false;
                    board.currentPlayer.landedOnShop = false;
                    onSelect(player);
                }
            ))
        }
        this.options = options;
    }
}


