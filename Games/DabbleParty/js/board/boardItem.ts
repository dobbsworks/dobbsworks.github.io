abstract class BoardItem {
    abstract imageTile: ImageTile;
    abstract name: string;
    abstract description: string;
    abstract OnUse(player: Player, board: BoardMap): void;
}


class GoldenGear extends BoardItem {
    imageTile = tiles["itemIcons"][2][1];
    name: string = "Golden Gear";
    description: string = "Collect the most gears to win the game!";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
}
class GoldenGearX2 extends BoardItem {
    imageTile = tiles["itemIcons"][3][1];
    name: string = "Golden Gear x2";
    description: string = "Collect the most gears to win the game!";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
}
class GoldenGearX3 extends BoardItem {
    imageTile = tiles["itemIcons"][4][1];
    name: string = "Golden Gear x3";
    description: string = "Collect the most gears to win the game!";
    OnUse(player: Player, board: BoardMap): void {
        // this is just a placeholder item for shops rendering, can't be bought
        throw new Error("Method not implemented.");
    }
}


abstract class BoardItemFragileDice extends BoardItem {
    abstract numFaces: number;
    get name(): string { return `Fragile D${this.numFaces}` }
    get description(): string { return `Adds an extra ${this.numFaces}-sided die to this turn's roll` };

    OnUse(player: Player, board: BoardMap): void {
        player.diceBag.fragileFaces.push(this.numFaces as faceCount);
        board.boardUI.StartRoll();
    }
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