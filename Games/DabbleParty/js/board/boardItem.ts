abstract class BoardItem {
    abstract imageTile: ImageTile;
    abstract name: string;
    abstract description: string;
    abstract OnUse(player: Player, board: BoardMap): void;
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