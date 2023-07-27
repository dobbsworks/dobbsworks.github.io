class BoardSpace {

    // auto-genenerate IDs for each space to make it easier to send cyclical JSON packages of board state
    static numConstructed = 0;
    static GenerateId(): number {
        BoardSpace.numConstructed++;
        return BoardSpace.numConstructed;
    }
    static allConstructedSpaces: { label: string, space: BoardSpace }[] = [];

    id!: number;
    nextSpaces: BoardSpace[] = [];
    isPotentialGearSpace = false;

    constructor(public spaceType: BoardSpaceType, public gameX: number, public gameY: number, public label: string = "") {
        this.id = BoardSpace.GenerateId();
        BoardSpace.allConstructedSpaces.push({ label: label, space: this });
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

    Draw(camera: Camera): void {
        this.spaceType.getImageTile().Draw(camera, this.gameX, this.gameY, 0.2, 0.2, false, false, 0, 1);
        let coord1 = camera.GameCoordToCanvas(this.gameX, this.gameY);
        camera.ctx.font = `200 ${10}px ${"arial"}`;
        camera.ctx.fillText(this.id.toString(), coord1.canvasX, coord1.canvasY);
    }

    DrawConnections(camera: Camera): void {
        camera.ctx.fillStyle = "#3f454a";
        camera.ctx.strokeStyle = "#3f454a";
        camera.ctx.lineWidth = camera.scale * 4;
        if (board) {
            camera.ctx.lineDashOffset = (-board.timer) * 0.1;
        }

        let ratio = ((board?.timer || 0) % 60) / 60;
        for (let connection of this.nextSpaces) {
            let coord1 = camera.GameCoordToCanvas(this.gameX, this.gameY);
            let coord2 = camera.GameCoordToCanvas(connection.gameX, connection.gameY);
            let coord3 = {
                canvasX: coord1.canvasX + (coord2.canvasX - coord1.canvasX) * ratio,
                canvasY: coord1.canvasY + (coord2.canvasY - coord1.canvasY) * ratio
            }
            camera.ctx.beginPath();
            camera.ctx.moveTo(coord1.canvasX, coord1.canvasY);
            camera.ctx.lineTo(coord2.canvasX, coord2.canvasY);
            camera.ctx.stroke();

            camera.ctx.beginPath();
            camera.ctx.ellipse(coord3.canvasX, coord3.canvasY, 6 * camera.scale, 4 * camera.scale, 0, 0, 2 * Math.PI);
            camera.ctx.fill();
        }
    }

}


class BoardSpaceType {
    constructor(
        public getImageTile: () => ImageTile,
        public costsMovement: boolean,
        public OnLand: (player: Player) => void,
        public OnPass: (player: Player) => void
    ) { }

    static BlueBoardSpace = new BoardSpaceType(
        () => tiles["partySquares"][0][0],
        true,
        (player: Player) => {
            player.coins += 3; // todo add to some sort of animated tick up pool
            player.AddCoinsOverToken(3);
        },
        () => { });
    static RedBoardSpace = new BoardSpaceType(
        () => tiles["partySquares"][0][1],
        true,
        (player: Player) => {
            player.coins -= 3;
            if (player.coins < 0) player.coins = 0;
            player.DeductCoinsOverToken(3);
        },
        () => { });
    static DiceUpgradeSpace = new BoardSpaceType(
        () => tiles["partySquares"][0][4],
        true,
        (player: Player) => {
            player.diceBag.Upgrade();
        },
        () => { });
    static GrayBoardSpace = new BoardSpaceType(
        () => tiles["partySquares"][0][2],
        false,
        () => { },
        () => { });
    static ShopSpace = new BoardSpaceType(
        () => tiles["partySquares"][1][2],
        true,
        (player: Player) => {
            // TODO - full inventory?
            // TODO - special bonus for landing on space?
            player.landedOnShop = true;
            BoardSpaceType.ShopSpace.OnPass(player);
        },
        (player: Player) => {
            if (player.inventory.length >= 3) {
                // full inventory
                player.landedOnShop = false;
            } else {
                player.isInShop = true;
                if (board) board.boardUI.currentMenu = BoardMenu.CreateShopMenu();
            }
        });
    static GearSpace = new BoardSpaceType(
        () => tiles["partySquares"][1][3],
        true,
        (player: Player) => {
            player.landedOnShop = true;
            BoardSpaceType.GearSpace.OnPass(player);
        },
        (player: Player) => {
            player.isInShop = true;
            if (board) board.boardUI.currentMenu = BoardMenu.CreateGoldGearMenu();
        });
    static WallopSpace = new BoardSpaceType(
        () => tiles["partySquares"][1][5],
        true,
        (player: Player) => {
            player.landedOnShop = true;
            BoardSpaceType.WallopSpace.OnPass(player);
        },
        (player: Player) => {
            player.isInShop = true;
            if (board) board.boardUI.currentMenu = BoardMenu.CreateWallopMenu();
        });
    static BiodomeEntryBoardSpace = new BoardSpaceType(
        () => tiles["partySquares"][0][2],
        false,
        () => { },
        (player: Player) => {
            player.isInShop = true;
            if (board) board.boardUI.currentMenu = BoardMenu.CreateBiodomeMenu();
        });
    static Warp1BoardSpace = new BoardSpaceType(
        () => tiles["partySquares"][0][2],
        false,
        () => { },
        (player: Player) => {
            player.isInShop = true;
            if (board) board.boardUI.currentMenu = BoardMenu.CreateWarpPointMenu("warp2");
        });
    static Warp2BoardSpace = new BoardSpaceType(
        () => tiles["partySquares"][0][2],
        false,
        () => { },
        (player: Player) => {
            player.isInShop = true;
            if (board) board.boardUI.currentMenu = BoardMenu.CreateWarpPointMenu("warp1");
        });
}