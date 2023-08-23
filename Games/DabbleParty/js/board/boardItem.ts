abstract class BoardItem {
    abstract imageTile: ImageTile;
    abstract name: string;
    abstract description: string;
    abstract OnUse(player: Player, board: BoardMap): void;
    OnPurchase(player: Player): void {}
    isPlaceholder = true;
}


class ShopItemGoldenGear extends BoardItem {
    imageTile = tiles["itemIcons"][2][1];
    name: string = "Golden Gear";
    description: string = "Collect the most gears to win the game!";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
    OnPurchase(player: Player): void { player.gears += 1}
}
class ShopItemGoldenGearX2 extends BoardItem {
    imageTile = tiles["itemIcons"][3][1];
    name: string = "Golden Gear x2";
    description: string = "Collect the most gears to win the game!";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
    OnPurchase(player: Player): void { player.gears += 2}
}
class ShopItemGoldenGearX3 extends BoardItem {
    imageTile = tiles["itemIcons"][4][1];
    name: string = "Golden Gear x3";
    description: string = "Collect the most gears to win the game!";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
    OnPurchase(player: Player): void { player.gears += 3}
}
class ShopItemStealCoins extends BoardItem {
    imageTile = tiles["itemIcons"][5][1];
    name: string = "Steal coins";
    description: string = "I'll smack the coins right out of 'em";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
}
class ShopItemStealGears extends BoardItem {
    imageTile = tiles["itemIcons"][2][1];
    name: string = "Steal a golden gear";
    description: string = "All's fair in love, war, and party games";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
}
class ShopItemEnterBiodome extends BoardItem {
    imageTile = tiles["itemIcons"][0][2];
    name: string = "Enter the biodome";
    description: string = "Look, I'm in the shop interface, wheeee";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
}
class ShopItemEnterAndRaise extends BoardItem {
    imageTile = tiles["itemIcons"][1][2];
    name: string = "Enter, & raise price";
    description: string = "How did I get here let me out lol";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
}
class ShopItemWarp extends BoardItem {
    imageTile = tiles["itemIcons"][0][2];
    name: string = "Warpetize me, cap'n!";
    description: string = "4 days since last teleporter accident";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
}


class BoardItemDevExit extends BoardItem {
    imageTile = tiles["itemIcons"][0][1];
    name = "Dev Exit";
    description = "Warps you close to the Golden Gear";
    OnUse(player: Player, board: BoardMap): void {
        let targetSpace = board.boardSpaces.find(a => a.spaceType == BoardSpaceType.GearSpace);
        if (targetSpace) {
            targetSpace = board.boardSpaces.find(a => a.nextSpaces.indexOf(targetSpace as BoardSpace) > -1)
        }
        if (player.token && targetSpace) {
            player.token.currentSpace = targetSpace;
        }
        board.boardUI.StartRoll();
    }
    isPlaceholder = false;
}

class BoardItemWarpPortal extends BoardItem {
    imageTile = tiles["itemIcons"][1][1];
    name = "Warp Portal";
    description = "Swaps your position with any chosen player's";
    OnUse(player: Player, board: BoardMap): void {
        board.boardUI.currentMenu = BoardMenu.CreateSwapPlacesMenu();
    }
    isPlaceholder = false;
}




abstract class BoardItemFragileDice extends BoardItem {
    abstract numFaces: number;
    get name(): string { return `Fragile D${this.numFaces}` }
    get description(): string { return `Adds an extra ${this.numFaces}-sided die to this turn's roll` };

    OnUse(player: Player, board: BoardMap): void {
        player.diceBag.fragileFaces.push(this.numFaces as FaceCount);
        board.boardUI.StartRoll();
    }
    isPlaceholder = false;
}
class BoardItemFragileD4 extends BoardItemFragileDice {
    imageTile = tiles["itemIcons"][0][0];
    numFaces = 4;
}
class BoardItemFragileD6 extends BoardItemFragileDice {
    imageTile = tiles["itemIcons"][1][0];
    numFaces = 6;
}
class BoardItemFragileD8 extends BoardItemFragileDice {
    imageTile = tiles["itemIcons"][2][0];
    numFaces = 8;
}
class BoardItemFragileD10 extends BoardItemFragileDice {
    imageTile = tiles["itemIcons"][3][0];
    numFaces = 10;
}
class BoardItemFragileD12 extends BoardItemFragileDice {
    imageTile = tiles["itemIcons"][4][0];
    numFaces = 12;
}
class BoardItemFragileD20 extends BoardItemFragileDice {
    imageTile = tiles["itemIcons"][5][0];
    numFaces = 20;
}