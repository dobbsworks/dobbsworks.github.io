abstract class BoardSpace {

    // auto-genenerate IDs for each space to make it easier to send cyclical JSON packages of board state
    static numConstructed = 0;
    static GenerateId(): number {
        BoardSpace.numConstructed++;
        return BoardSpace.numConstructed;
    }
    static allConstructedSpaces: {label: string, space: BoardSpace}[] = [];

    constructor(public gameX: number, public gameY: number, public label: string = "") {
        this.id = BoardSpace.GenerateId();
        BoardSpace.allConstructedSpaces.push({label: label, space: this});
    }

    ConnectFromPrevious(): BoardSpace {
        // chain from constructor to connect to space constructed before this one
        let previousSpaces = BoardSpace.allConstructedSpaces.filter(a => a.space !== this);
        let latest = previousSpaces[previousSpaces.length - 1];
        if (latest) {
            latest.space.nextSpaces.push(this);
        } else {
            console.error("Can't connect space", this.id);
        }
        return this;
    }

    ConnectFromLabel(label: string): BoardSpace {
        let target = BoardSpace.allConstructedSpaces.filter(a => a.label === label);
        if (target.length > 1) {
            console.error("Too many spaces to connect from");
        } else if (target.length == 0) {
            console.error("Can't connect space", this.id, label);
        } else {
            target[0].space.nextSpaces.push(this);
        }
        return this;
    }

    static ConnectLabels(from: string, to: string): void {
        let space1 = BoardSpace.allConstructedSpaces.filter(a => a.label === from);
        if (space1.length > 1) {
            console.error("Too many spaces to connect from");
        } else if (space1.length == 0) {
            console.error("Can't connect space", from);
        }
        let space2 = BoardSpace.allConstructedSpaces.filter(a => a.label === to);
        if (space2.length > 1) {
            console.error("Too many spaces to connect from");
        } else if (space2.length == 0) {
            console.error("Can't connect space", to);
        }

        space1[0].space.nextSpaces.push(space2[0].space);
    }

    id!: number;
    imageTile!: ImageTile;
    nextSpaces: BoardSpace[] = [];
    costsMovement: boolean = true;  // if false, this is not a real space, just a link between multiple spaces 

    // on pass event
    // on land event


    Draw(camera: Camera): void {
        this.imageTile.Draw(camera, this.gameX, this.gameY, 0.2, 0.2, false, false, 0, 1);
        let coord1 = camera.GameCoordToCanvas(this.gameX, this.gameY);
        camera.ctx.font = `200 ${10}px ${"arial"}`;
        camera.ctx.fillText(this.id.toString(), coord1.canvasX, coord1.canvasY);
    }

    DrawConnections(camera: Camera): void {

        camera.ctx.strokeStyle = "black";
        camera.ctx.lineWidth = camera.scale * 4;
        camera.ctx.setLineDash([8 * camera.scale, 4 * camera.scale]);
        if (board) {
            camera.ctx.lineDashOffset = (-board.timer) * 0.1;
        }
        
        for (let connection of this.nextSpaces) {
            let coord1 = camera.GameCoordToCanvas(this.gameX, this.gameY);
            let coord2 = camera.GameCoordToCanvas(connection.gameX, connection.gameY);
            camera.ctx.beginPath();
            camera.ctx.moveTo(coord1.canvasX, coord1.canvasY);
            camera.ctx.lineTo(coord2.canvasX, coord2.canvasY);
            camera.ctx.stroke();
        }
    }

    OnLand(player: Player): void {}
}

class BlueBoardSpace extends BoardSpace {
    imageTile = tiles["partySquares"][0][0];
    OnLand(player: Player): void {
        player.coins += 3; // todo add to some sort of animated tick up pool
        player.AddCoinsOverToken(3);
    }
}

class RedBoardSpace extends BoardSpace {
    imageTile = tiles["partySquares"][0][1];
    OnLand(player: Player): void {
        player.coins -= 3; // todo add to some sort of animated tick up pool
        // boundary check to avoid going negative
        if (player.coins < 0) player.coins = 0;
        player.DeductCoinsOverToken(3);
    }
}

class DiceUpgradeSpace extends BoardSpace {
    imageTile = tiles["partySquares"][0][4];
    OnLand(player: Player): void {
        player.diceBag.Upgrade();
    }
}

class GrayBoardSpace extends BoardSpace {
    imageTile = tiles["partySquares"][0][2];
    costsMovement = false;
}