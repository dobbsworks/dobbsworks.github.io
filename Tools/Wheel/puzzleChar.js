class PuzzleChar {

    alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    constructor(row, col, char) {
        this.row = row;
        this.col = col;
        this.char = char.toUpperCase();
        if (this.alpha.indexOf(this.char) === -1) {
            this.revealed = true;
        }
    }

    Update() {
        if (this.highlighted && !this.revealed) this.sprite.tile = 2;
    }

    revealed = false;
}