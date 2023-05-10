abstract class BoardSpace {

    // auto-genenerate IDs for each space to make it easier to send cyclical JSON packages of board state
    static numConstructed = 0;
    static GenerateId(): number {
        BoardSpace.numConstructed++;
        return BoardSpace.numConstructed;
    }

    constructor(id: number = -1) {
        if (id == -1) {
            this.id = BoardSpace.GenerateId();
        } else {
            this.id = id;
        }
    }

    id!: number;
    imageTile!: ImageTile;
    gameX: number = 0;
    gameY: number = 0;
    costsMovement: boolean = true;  // if false, this is not a real space, just a link between multiple spaces 

    // on pass event
    // on land event
}

class BlueBoardSpace extends BoardSpace {
    constructor() {
        super();
        this.imageTile = tiles["partySquares"][0][0];
    }
}

class RedBoardSpace extends BoardSpace {
    constructor() {
        super();
        this.imageTile = tiles["partySquares"][0][1];
    }
}