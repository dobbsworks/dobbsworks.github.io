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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var BoardMenuOption = /** @class */ (function () {
    function BoardMenuOption(plainText, Draw, OnSelect, isEnabled) {
        if (isEnabled === void 0) { isEnabled = true; }
        this.plainText = plainText;
        this.Draw = Draw;
        this.OnSelect = OnSelect;
        this.isEnabled = isEnabled;
    }
    BoardMenuOption.DrawCancel = function (ctx, x, y, isHighlighted) {
        BoardMenuOption.PlainText("No thanks!")(ctx, x, y, isHighlighted);
    };
    BoardMenuOption.PlainText = function (text) {
        return function (ctx, x, y, isHighlighted) {
            ctx.font = "800 " + 36 + "px " + "arial";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFF";
            ctx.fillText(text, x + 40, y + 65);
        };
    };
    BoardMenuOption.PlainTextSmall = function (text) {
        return function (ctx, x, y, isHighlighted) {
            ctx.font = "800 " + 14 + "px " + "arial";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFF";
            ctx.fillText(text, x + 40, y + 65);
        };
    };
    return BoardMenuOption;
}());
var BoardMenuOptionCancel = /** @class */ (function (_super) {
    __extends(BoardMenuOptionCancel, _super);
    function BoardMenuOptionCancel(text, additionalAction) {
        if (text === void 0) { text = "No thanks"; }
        if (additionalAction === void 0) { additionalAction = function () { }; }
        return _super.call(this, text, BoardMenuOption.DrawCancel, function () {
            if (!board || !board.currentPlayer)
                return;
            board.currentPlayer.isInShop = false;
            board.currentPlayer.landedOnShop = false;
            additionalAction();
        }) || this;
    }
    return BoardMenuOptionCancel;
}(BoardMenuOption));
var BoardMenuOptionTurnRoll = /** @class */ (function (_super) {
    __extends(BoardMenuOptionTurnRoll, _super);
    function BoardMenuOptionTurnRoll() {
        return _super.call(this, "Roll", function (ctx, x, y, isHighlighted) {
            if (!board || !board.currentPlayer)
                return;
            ctx.font = "800 " + 36 + "px " + "arial";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFF";
            ctx.fillText("Roll!", y + 20, 145);
            var dice = board.currentPlayer.diceBag.GetDiceSprites();
            var dx = -250;
            for (var _i = 0, dice_1 = dice; _i < dice_1.length; _i++) {
                var die = dice_1[_i];
                var image = die.GetImage(isHighlighted ? board.timer / 5 : 0);
                image.Draw(new Camera(camera.canvas), dx, y - 220, 0.5, 0.5, false, false, 0);
                dx += 60;
            }
        }, function () {
            if (!board || !board.currentPlayer)
                return;
            // Roll the dice!
            board.boardUI.StartRoll();
        }) || this;
    }
    return BoardMenuOptionTurnRoll;
}(BoardMenuOption));
var BoardMenu = /** @class */ (function () {
    function BoardMenu(options) {
        this.options = options;
        this.selectedMenuItem = 0;
        this.talkingHead = null;
        this.text = "";
        this.shopTimer = 0;
        this.waitingForData = false;
    }
    BoardMenu.prototype.Update = function () {
        if (!board)
            return;
        this.shopTimer++;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            this.ChooseHighlightedOption();
        }
        else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true) || KeyboardHandler.IsKeyPressed(KeyAction.Left, true)) {
            if (this.selectedMenuItem > 0) {
                this.selectedMenuItem--;
            }
            else {
                this.selectedMenuItem = this.options.length - 1;
            }
        }
        else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true) || KeyboardHandler.IsKeyPressed(KeyAction.Right, true)) {
            if (this.selectedMenuItem < this.options.length - 1) {
                this.selectedMenuItem++;
            }
            else {
                this.selectedMenuItem = 0;
            }
        }
        else {
            if (!this.waitingForData && board.currentPlayer) {
                if (board.players.indexOf(board.currentPlayer) != clientPlayerIndex) {
                    this.waitingForData = true;
                    this.RequestData();
                }
            }
        }
    };
    BoardMenu.prototype.ChooseHighlightedOption = function () {
        var option = this.options[this.selectedMenuItem];
        if (option.isEnabled) {
            board.boardUI.currentMenu = null;
            option.OnSelect();
        }
    };
    BoardMenu.prototype.RequestData = function () {
        var _this = this;
        DataService.GetGameData(board.gameId).then(function (dt) {
            var menu = _this;
            setTimeout(function () {
                menu.waitingForData = false;
            }, 2000);
            if (dt.latestMenu) {
                if (dt.latestMenu.menuId == board.boardUI.menuId) {
                    _this.selectedMenuItem = dt.latestMenu.selectedIndex;
                    _this.ChooseHighlightedOption();
                }
            }
        });
    };
    BoardMenu.prototype.Draw = function (ctx) {
        if (!board)
            return;
        var player = board.currentPlayer;
        if (!player)
            return;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FFF";
        var x = 60;
        var offset = Math.sin(board.timer / 10) * 3 + 3;
        for (var i = 0; i < this.options.length; i++) {
            var y = 80 + 110 * i;
            ctx.fillStyle = this.options[i].isEnabled ? "#000B" : "#444B";
            ctx.fillRect(x, y, 300, 100);
            if (this.selectedMenuItem == i) {
                ctx.strokeRect(x - offset, y - offset, 300 + offset * 2, 100 + offset * 2);
            }
            this.options[i].Draw(ctx, x, y, this.selectedMenuItem == i);
        }
        var talkingHeadY = 170;
        var slideTime = 60;
        if (this.shopTimer < slideTime) {
            talkingHeadY = 170 + 150 * (1 - Math.sin((this.shopTimer / slideTime) * (Math.PI / 2)));
        }
        if (this.talkingHead) {
            this.talkingHead.Draw(new Camera(camera.canvas), 380, talkingHeadY, 1, 1, false, false, 0);
        }
        if (this.text) {
            ctx.fillStyle = "#000E";
            ctx.fillRect(475, talkingHeadY + 270, 275, 60);
            ctx.fillStyle = "#FFF";
            ctx.textAlign = "left";
            ctx.font = "400 " + 20 + "px " + "arial";
            var charCount = Math.floor(this.shopTimer * 0.25);
            ctx.fillText(this.text.substring(0, charCount), 485, talkingHeadY + 270 + 40);
        }
    };
    BoardMenu.DrawItemPanel = function (ctx, x, y, isHighlighted, item) {
        if (!board || !board.currentPlayer)
            return;
        var rotation = isHighlighted ? Math.sin(board.timer / 30) / 3 : 0;
        item.imageTile.Draw(new Camera(camera.canvas), x - 480 + 45, y - 230, 0.5, 0.5, false, false, rotation);
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "left";
        ctx.font = "600 " + 18 + "px " + "arial";
        ctx.fillText(item.name, x + 90, y + 45);
        ctx.font = "400 " + 14 + "px " + "arial";
        ctx.fillText(item.description, x + 20, y + 90);
    };
    BoardMenu.DrawPricePanel = function (ctx, x, y, displayPrice, actualPrice) {
        if (actualPrice === void 0) { actualPrice = 0; }
        var isDiscounted = (actualPrice != 0 && actualPrice < displayPrice);
        if (!board || !board.currentPlayer)
            return;
        var image = tiles["priceTag"][0][0];
        image.Draw(new Camera(camera.canvas), x - 121, y - 245, 1, 1, false, false, 0);
        ctx.fillStyle = displayPrice <= board.currentPlayer.coins ? (isDiscounted ? "#0003" : "#000") : "#F00";
        ctx.textAlign = "right";
        ctx.font = "800 " + 20 + "px " + "arial";
        ctx.fillText(displayPrice.toString(), x + 379, y + 30);
        if (isDiscounted) {
            BoardMenu.DrawPricePanel(ctx, x, y + 25, actualPrice);
        }
    };
    BoardMenu.DrawPlayerPanel = function (ctx, x, y, isHighlighted, avatarIndex, mainText, subText) {
        var image = tiles["playerIcons"][avatarIndex][0];
        image.Draw(new Camera(camera.canvas), x - 480 + 45, y - 230, 0.35, 0.35, false, false, 0);
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "left";
        ctx.font = "600 " + 18 + "px " + "arial";
        ctx.fillText(mainText, x + 90, y + 45);
        ctx.font = "400 " + 14 + "px " + "arial";
        ctx.fillText(subText, x + 20, y + 90);
    };
    BoardMenu.CreateTurnStartMenu = function () {
        var _a;
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var ret = new BoardMenu([new BoardMenuOptionTurnRoll()]);
        var _loop_1 = function (item) {
            ret.options.push(new BoardMenuOption("Use " + item.name + " - " + item.description, function (ctx, x, y, isHighlighted) {
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.inventory = board.currentPlayer.inventory.filter(function (a) { return a != item; });
                item.OnUse(board.currentPlayer, board);
            }));
        };
        for (var _i = 0, _b = (_a = board === null || board === void 0 ? void 0 : board.currentPlayer) === null || _a === void 0 ? void 0 : _a.inventory; _i < _b.length; _i++) {
            var item = _b[_i];
            _loop_1(item);
        }
        return ret;
    };
    BoardMenu.CreateShopMenu = function () {
        var itemPool = [
            { price: 25, item: itemList[0] },
            { price: 10, item: itemList[1] },
            { price: 2, item: itemList[2] },
            { price: 4, item: itemList[3] },
            { price: 6, item: itemList[4] },
            { price: 8, item: itemList[5] },
            { price: 10, item: itemList[6] },
            { price: 12, item: itemList[7] }
        ];
        var itemsForSale = Random.GetShuffledCopy(itemPool).slice(0, 3);
        var ret = new BoardMenuShop(itemsForSale, BoardMenuShop.HalfOff);
        ret.talkingHead = tiles["talkingHeads"][0][0];
        ret.text = "Welcome to the porkshop!";
        return ret;
    };
    BoardMenu.CreateGoldGearMenu = function () {
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var availableGears = [new ShopItemGoldenGear()];
        if (board.currentPlayer.landedOnShop || board.IsInLast5Turns()) {
            availableGears.push(new ShopItemGoldenGearX2());
        }
        if (board.currentPlayer.landedOnShop && board.IsInLast5Turns()) {
            availableGears.push(new ShopItemGoldenGearX3());
        }
        var itemPool = availableGears.map(function (item, index) {
            var gearPrice = 10 * (index + 1);
            return { item: item, price: gearPrice };
        });
        return new BoardMenuGearShop(itemPool);
    };
    BoardMenu.CreateSwapPlacesMenu = function () {
        return new BoardMenuPlayerSelect(function (p) { return true; }, function (playerName) { return "Swap places with " + playerName; }, function (p) {
            cutsceneService.AddScene(new BoardCutScenePortalSwap(board.currentPlayer, p));
        });
    };
    BoardMenu.CreateWallopMenu = function () {
        var ret = new BoardMenuShop([
            { price: 5, item: new ShopItemStealCoins() },
            { price: 30, item: new ShopItemStealGears() }
        ], BoardMenu.Minus5);
        ret.talkingHead = tiles["talkingHeads"][1][0];
        ret.text = "I'm ready to rock!";
        return ret;
    };
    BoardMenu.CreateWallopCoinMenu = function () {
        return new BoardMenuPlayerSelect(function (p) { return p.coins > 0; }, function (playerName) { return "Steal coins from " + playerName; }, function (p) {
            var coinsToSteal = 7 + Math.floor(Math.random() * 8 + p.coins / 20);
            coinsToSteal = Math.min(p.coins, coinsToSteal);
            cutsceneService.AddScene(new BoardCutSceneAddCoins(-coinsToSteal, p));
            cutsceneService.AddScene(new BoardCutSceneAddCoins(coinsToSteal, board.currentPlayer));
        });
    };
    BoardMenu.CreateWallopGearMenu = function () {
        return new BoardMenuPlayerSelect(function (p) { return p.gears > 0; }, function (playerName) { return "Steal a gear from " + playerName; }, function (p) {
            p.gears--;
            cutsceneService.AddScene(new BoardCutSceneAddItem(new ShopItemGoldenGear(), board.currentPlayer));
        });
    };
    BoardMenu.CreateBiodomeMenu = function () {
        var ret = new BoardMenuShop([
            { price: board.biodomePrice, item: new ShopItemEnterBiodome() },
            { price: board.biodomePrice + 10, item: new ShopItemEnterAndRaise() }
        ]);
        ret.talkingHead = tiles["talkingHeads"][2][0];
        ret.text = "You like Pauly Shore movies?";
        ret.OnCancel = function () {
            if (!board || !board.currentPlayer)
                return;
            var targetSpace = board.boardSpaces.find(function (x) { return x.label == "65"; });
            board.currentPlayer.token.currentSpace = board.currentPlayer.token.movementStartingSpace;
            board.currentPlayer.token.MoveToSpace(targetSpace);
        };
        return ret;
    };
    BoardMenu.CreateWarpPointMenu = function (targetSpaceLabel) {
        var ret = new BoardMenuShop([{ price: 5, item: new ShopItemWarp() }]);
        ret.talkingHead = tiles["talkingHeads"][2][0];
        ret.text = "You ever see The Fly?";
        return ret;
    };
    BoardMenu.CreateClientMenu = function (id, options) {
        return new BoardMenu(options.map(function (o, optionIndex) { return new BoardMenuOption(o, BoardMenuOption.PlainTextSmall(o), function () {
            if (board) {
                board.latestCompletedMenuId = id;
                board.boardUI.currentMenu = null;
                DataService.SubmitMenuSelection(board.gameId, id, optionIndex);
            }
        }); }));
    };
    BoardMenu.HalfOff = function (oldPrice) { return Math.ceil(oldPrice / 2); };
    BoardMenu.Minus5 = function (oldPrice) { return oldPrice - 5; };
    return BoardMenu;
}());
var BoardMenuChoosePath = /** @class */ (function (_super) {
    __extends(BoardMenuChoosePath, _super);
    function BoardMenuChoosePath(startingSpace, player) {
        var _this = _super.call(this, []) || this;
        _this.startingSpace = startingSpace;
        _this.player = player;
        var targetSpaces = startingSpace.nextSpaces;
        _this.options = targetSpaces.map(function (a) {
            var angle = Math.atan2((a.gameY - _this.startingSpace.gameY) * 2, a.gameX - _this.startingSpace.gameX);
            var degrees = ((angle + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 360;
            var eighths = Math.floor(degrees / 360 * 8 + 0.5);
            var direction = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"][eighths];
            return new BoardMenuOption("Take " + direction + " path", function () { }, function () {
                // on select
                if (!board)
                    return;
                var nextSpace = _this.startingSpace.nextSpaces[_this.selectedMenuItem];
                player.token.MoveToSpace(nextSpace);
                player.isInShop = false;
            });
        });
        return _this;
    }
    BoardMenuChoosePath.prototype.Draw = function (ctx) {
        if (!board)
            return;
        var token = this.player.token;
        var nextSquares = this.startingSpace.nextSpaces;
        for (var i = 0; i < nextSquares.length; i++) {
            var nextSquare = nextSquares[i];
            var isSelected = this.selectedMenuItem == i;
            var pulse = Math.sin((board.timer || 0) / 10);
            var scale = isSelected ? 1 + pulse / 8 : 1;
            var angle = Math.atan2((nextSquare.gameY - this.startingSpace.gameY) * 2, nextSquare.gameX - this.startingSpace.gameX);
            var distance = 75 + (isSelected ? pulse * 5 : 0);
            var arrowImage = tiles["boardArrow"][i][0];
            arrowImage.Draw(camera, token.x + distance * Math.cos(angle), token.y + distance * Math.sin(angle), 1 * scale, 0.5 * scale, false, false, angle);
        }
    };
    return BoardMenuChoosePath;
}(BoardMenu));
var BoardMenuShop = /** @class */ (function (_super) {
    __extends(BoardMenuShop, _super);
    function BoardMenuShop(itemPool, discountLogic) {
        if (discountLogic === void 0) { discountLogic = function (oldPrice) { return oldPrice; }; }
        var _this = _super.call(this, []) || this;
        _this.cancelFirst = true;
        itemPool.sort(function (a, b) { return a.price - b.price; });
        var options = [];
        var _loop_2 = function (item) {
            var displayPrice = item.price;
            var actualPrice = board.currentPlayer.landedOnShop ? discountLogic(displayPrice) : displayPrice;
            options.push(new BoardMenuOption("Buy " + item.item.name + " for " + actualPrice + " coins", function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item.item);
                BoardMenu.DrawPricePanel(ctx, x, y, displayPrice, actualPrice);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
                cutsceneService.AddScene(new BoardCutSceneAddCoins(-actualPrice, board.currentPlayer));
                if (!item.item.isGear) {
                    board.currentPlayer.statNonGearSpending += actualPrice;
                }
                _this.OnBuy(item.item, actualPrice);
                item.item.AfterPurchase(board.currentPlayer);
            }, actualPrice <= board.currentPlayer.coins));
        };
        for (var _i = 0, itemPool_1 = itemPool; _i < itemPool_1.length; _i++) {
            var item = itemPool_1[_i];
            _loop_2(item);
        }
        var cancel = new BoardMenuOptionCancel("No thanks", _this.OnCancel);
        if (_this.cancelFirst) {
            options.unshift(cancel);
        }
        else {
            options.push(cancel);
        }
        _this.options = options;
        return _this;
    }
    BoardMenuShop.prototype.OnCancel = function () { };
    BoardMenuShop.prototype.OnBuy = function (item, price) {
        cutsceneService.AddScene(new BoardCutSceneAddItem(item, board.currentPlayer));
    };
    return BoardMenuShop;
}(BoardMenu));
var BoardMenuGearShop = /** @class */ (function (_super) {
    __extends(BoardMenuGearShop, _super);
    function BoardMenuGearShop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cancelFirst = false;
        return _this;
    }
    BoardMenuGearShop.prototype.OnBuy = function (item, price) {
        cutsceneService.AddScene(new BoardCutSceneSingleAction(function () {
            audioHandler.SetBackgroundMusic("silence");
            audioHandler.PlaySound("gearGet", true);
            setTimeout(function () { audioHandler.SetBackgroundMusic(board.songId); }, 6000);
        }));
        cutsceneService.AddScene(new BoardCutSceneAddItem(new ShopItemGoldenGear(), board.currentPlayer));
        cutsceneService.AddScene(new BoardCutSceneMoveGear(false));
        board.PlaceGearSpace();
    };
    return BoardMenuGearShop;
}(BoardMenuShop));
var BoardMenuPlayerSelect = /** @class */ (function (_super) {
    __extends(BoardMenuPlayerSelect, _super);
    function BoardMenuPlayerSelect(canSelect, choiceDescription, onSelect) {
        var _this = _super.call(this, []) || this;
        var options = [];
        var availablePlayers = __spreadArrays(board.players).filter(function (a) { return canSelect(a) && a != board.currentPlayer; });
        var _loop_3 = function (player) {
            options.push(new BoardMenuOption(player.avatarName, function (ctx, x, y, isHighlighted) {
                BoardMenu.DrawPlayerPanel(ctx, x, y, isHighlighted, player.avatarIndex, player.avatarName, choiceDescription(player.avatarName));
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
                onSelect(player);
            }));
        };
        for (var _i = 0, availablePlayers_1 = availablePlayers; _i < availablePlayers_1.length; _i++) {
            var player = availablePlayers_1[_i];
            _loop_3(player);
        }
        _this.options = options;
        return _this;
    }
    return BoardMenuPlayerSelect;
}(BoardMenu));
