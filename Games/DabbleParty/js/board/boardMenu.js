"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var BoardMenuOption = /** @class */ (function () {
    function BoardMenuOption(Draw, OnSelect, isEnabled) {
        if (isEnabled === void 0) { isEnabled = true; }
        this.Draw = Draw;
        this.OnSelect = OnSelect;
        this.isEnabled = isEnabled;
    }
    return BoardMenuOption;
}());
var BoardMenu = /** @class */ (function () {
    function BoardMenu(options) {
        this.options = options;
        this.selectedMenuItem = 0;
        this.talkingHead = null;
        this.text = "";
        this.shopTimer = 0;
    }
    BoardMenu.prototype.Update = function () {
        if (!board || !board.currentPlayer)
            return;
        this.shopTimer++;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
            var option = this.options[this.selectedMenuItem];
            if (option.isEnabled) {
                board.boardUI.currentMenu = null;
                option.OnSelect();
            }
        }
        else if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true)) {
            if (this.selectedMenuItem > 0) {
                this.selectedMenuItem--;
            }
        }
        else if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true)) {
            if (this.selectedMenuItem < this.options.length - 1) {
                this.selectedMenuItem++;
            }
        }
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
    BoardMenu.CreateItemMenu = function () {
        var _a;
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var ret = new BoardMenu([
            new BoardMenuOption(function (ctx, x, y, isHighlighted) {
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
            })
        ]);
        var _loop_1 = function (item) {
            ret.options.push(new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                // delete item from inventory
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
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var itemsForSale = [
            { price: 5, item: new BoardItemFragileD10() },
            { price: 12, item: new BoardItemFragileD20() }
        ];
        var ret = new BoardMenu([new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                ctx.font = "800 " + 36 + "px " + "arial";
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
            })]);
        var _loop_2 = function (item) {
            var displayPrice = item.price;
            var actualPrice = board.currentPlayer.landedOnShop ? Math.ceil(displayPrice / 2) : displayPrice;
            ret.options.push(new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item.item);
                BoardMenu.DrawPricePanel(ctx, x, y, displayPrice, actualPrice);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
                board.currentPlayer.coins -= actualPrice;
                board.currentPlayer.inventory.push(item.item);
            }, actualPrice <= board.currentPlayer.coins));
        };
        for (var _i = 0, itemsForSale_1 = itemsForSale; _i < itemsForSale_1.length; _i++) {
            var item = itemsForSale_1[_i];
            _loop_2(item);
        }
        ret.talkingHead = tiles["talkingHeads"][0][0];
        ret.text = "Welcome to the porkshop!";
        return ret;
    };
    BoardMenu.CreateGoldGearMenu = function () {
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var availableGears = [new ShopItemGoldenGear()];
        if (board.currentPlayer.landedOnShop) {
            availableGears.push(new ShopItemGoldenGearX2());
        }
        var gearOptions = availableGears.map(function (item, index) {
            var _a;
            var gearPrice = 10 * (index + 1);
            return new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item);
                BoardMenu.DrawPricePanel(ctx, x, y, gearPrice);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
                board.currentPlayer.coins -= gearPrice;
                board.currentPlayer.gears += (index + 1);
                board.currentPlayer.DeductCoinsOverToken(gearPrice);
                board.PlaceGearSpace();
            }, gearPrice < (((_a = board === null || board === void 0 ? void 0 : board.currentPlayer) === null || _a === void 0 ? void 0 : _a.coins) || 0));
        });
        return new BoardMenu(__spreadArrays(gearOptions, [new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                ctx.font = "800 " + 36 + "px " + "arial";
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
            })]));
    };
    BoardMenu.CreateSwapPlacesMenu = function () {
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var user = board.currentPlayer;
        var targetablePlayers = board.players.filter(function (a) { var _a, _b; return ((_a = a.token) === null || _a === void 0 ? void 0 : _a.currentSpace) != ((_b = user.token) === null || _b === void 0 ? void 0 : _b.currentSpace); });
        var ret = new BoardMenu(targetablePlayers.map(function (p) { return (new BoardMenuOption(function (ctx, x, y, isHighlighted) {
            BoardMenu.DrawPlayerPanel(ctx, x, y, isHighlighted, p.avatarIndex, p.avatarName, "Swap places with " + p.avatarName);
        }, function () {
            var _a;
            if (!board || !board.currentPlayer || !board.currentPlayer.token || !p.token)
                return;
            var targetSquare = (_a = p.token) === null || _a === void 0 ? void 0 : _a.currentSpace;
            p.token.currentSpace = board.currentPlayer.token.currentSpace;
            board.currentPlayer.token.currentSpace = targetSquare;
            // and then start the player's roll (NOT THE ITEM MENU)
            board.boardUI.StartRoll();
        })); }));
        return ret;
    };
    BoardMenu.CreateWallopMenu = function () {
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var itemsForSale = [];
        if (board.players.some(function (a) { return a.coins > 0 && a != (board === null || board === void 0 ? void 0 : board.currentPlayer); })) {
            itemsForSale.push({ price: 5, item: new ShopItemStealCoins(), menu: BoardMenu.CreateWallopCoinMenu() });
        }
        if (board.players.some(function (a) { return a.gears > 0 && a != (board === null || board === void 0 ? void 0 : board.currentPlayer); })) {
            itemsForSale.push({ price: 50, item: new ShopItemStealGears(), menu: BoardMenu.CreateWallopGearMenu() });
        }
        var ret = new BoardMenu([new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                ctx.font = "800 " + 36 + "px " + "arial";
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
            })]);
        var _loop_3 = function (item) {
            var displayPrice = item.price;
            var actualPrice = board.currentPlayer.landedOnShop ? displayPrice - 5 : displayPrice;
            ret.options.push(new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item.item);
                BoardMenu.DrawPricePanel(ctx, x, y, displayPrice, actualPrice);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.coins -= actualPrice;
                board.boardUI.currentMenu = item.menu;
            }, actualPrice <= board.currentPlayer.coins));
        };
        for (var _i = 0, itemsForSale_2 = itemsForSale; _i < itemsForSale_2.length; _i++) {
            var item = itemsForSale_2[_i];
            _loop_3(item);
        }
        ret.talkingHead = tiles["talkingHeads"][1][0];
        ret.text = "I'm ready to rock!";
        return ret;
    };
    BoardMenu.CreateWallopCoinMenu = function () {
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var user = board.currentPlayer;
        var targetablePlayers = board.players.filter(function (a) { return a.coins > 0 && a != user; });
        var ret = new BoardMenu(targetablePlayers.map(function (p) { return (new BoardMenuOption(function (ctx, x, y, isHighlighted) {
            BoardMenu.DrawPlayerPanel(ctx, x, y, isHighlighted, p.avatarIndex, p.avatarName, "Steal coins from " + p.avatarName);
        }, function () {
            if (!board || !board.currentPlayer || !board.currentPlayer.token || !p.token)
                return;
            var coinsToSteal = 7 + Math.floor(Math.random() * 8 + p.coins / 20);
            coinsToSteal = Math.min(p.coins, coinsToSteal);
            user.coins += coinsToSteal;
            p.coins -= coinsToSteal;
            user.isInShop = false;
            user.landedOnShop = false;
        })); }));
        return ret;
    };
    BoardMenu.CreateWallopGearMenu = function () {
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var user = board.currentPlayer;
        var targetablePlayers = board.players.filter(function (a) { return a.gears > 0 && a != user; });
        var ret = new BoardMenu(targetablePlayers.map(function (p) { return (new BoardMenuOption(function (ctx, x, y, isHighlighted) {
            BoardMenu.DrawPlayerPanel(ctx, x, y, isHighlighted, p.avatarIndex, p.avatarName, "Steal a golden gear from " + p.avatarName);
        }, function () {
            if (!board || !board.currentPlayer || !board.currentPlayer.token || !p.token)
                return;
            user.gears++;
            p.gears--;
            user.isInShop = false;
            user.landedOnShop = false;
        })); }));
        return ret;
    };
    BoardMenu.CreateBiodomeMenu = function () {
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var itemsForSale = [
            { price: board.biodomePrice, item: new ShopItemEnterBiodome(), action: function () { } },
            { price: board.biodomePrice + 10, item: new ShopItemEnterAndRaise(), action: function () {
                    if (board)
                        board.biodomePrice += 5;
                } }
        ];
        var ret = new BoardMenu([new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                ctx.font = "800 " + 36 + "px " + "arial";
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            }, function () {
                if (!board || !board.currentPlayer || !board.currentPlayer.token)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
                var targetSpace = board.boardSpaces.find(function (x) { return x.label == "65"; });
                board.currentPlayer.token.currentSpace = board.currentPlayer.token.movementStartingSpace;
                board.currentPlayer.token.MoveToSpace(targetSpace);
            })]);
        var _loop_4 = function (item) {
            ret.options.push(new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, item.item);
                BoardMenu.DrawPricePanel(ctx, x, y, item.price, item.price);
            }, function () {
                if (!board || !board.currentPlayer)
                    return;
                board.currentPlayer.coins -= item.price;
                item.action();
                board.currentPlayer.isInShop = false;
            }, item.price <= board.currentPlayer.coins));
        };
        for (var _i = 0, itemsForSale_3 = itemsForSale; _i < itemsForSale_3.length; _i++) {
            var item = itemsForSale_3[_i];
            _loop_4(item);
        }
        ret.talkingHead = tiles["talkingHeads"][2][0];
        ret.text = "You like Pauly Shore movies?";
        return ret;
    };
    BoardMenu.CreateWarpPointMenu = function (targetSpaceLabel) {
        if (!board || !board.currentPlayer)
            return new BoardMenu([]);
        var warpPrice = 5;
        var ret = new BoardMenu([new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                ctx.font = "800 " + 36 + "px " + "arial";
                ctx.textAlign = "left";
                ctx.fillStyle = "#FFF";
                ctx.fillText("No thanks!", x + 40, y + 65);
            }, function () {
                if (!board || !board.currentPlayer || !board.currentPlayer.token)
                    return;
                board.currentPlayer.isInShop = false;
                board.currentPlayer.landedOnShop = false;
            }), new BoardMenuOption(function (ctx, x, y, isHighlighted) {
                if (!board || !board.currentPlayer)
                    return;
                BoardMenu.DrawItemPanel(ctx, x, y, isHighlighted, new ShopItemWarp());
                BoardMenu.DrawPricePanel(ctx, x, y, warpPrice, warpPrice);
            }, function () {
                if (!board || !board.currentPlayer || !board.currentPlayer.token)
                    return;
                board.currentPlayer.coins -= warpPrice;
                board.currentPlayer.isInShop = false;
                var targetSpace = board.boardSpaces.find(function (x) { return x.label == targetSpaceLabel; });
                board.currentPlayer.token.currentSpace = targetSpace;
                board.currentPlayer.token.MoveToSpace(targetSpace.nextSpaces[0]);
            }, warpPrice <= board.currentPlayer.coins)
        ]);
        ret.talkingHead = tiles["talkingHeads"][2][0];
        ret.text = "You ever see The Fly?";
        return ret;
    };
    return BoardMenu;
}());
