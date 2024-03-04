class RopeConnection {
    constructor(public x1: number, public x2: number, public y: number) {}
}

class RopeMaze {
    constructor(public numColumns: number, numConnections: number) {
        this.xBase = camera.canvas.width / 2 - this.width/2;
        this.yBase = camera.canvas.height / 2 - this.height/2;
        this.xDist = this.width / (numColumns - 1);
        this.yDist = (this.height - this.margin*2) / (numConnections - 1);
        for (let i = 0; i < numConnections; i++) {
            let index = Random.GetRandInt(0, numColumns - 2);

            let x1 = this.xBase + index * this.xDist;
            let x2 = x1 + this.xDist;
            let y = this.yBase + i * this.yDist;

            let connection = new RopeConnection(x1, x2, y);
            this.connections.push(connection);
        }
    }

    private margin: number = 30;
    private width = 600;
    private height = 350;
    public xDist: number = 0;
    public xBase: number = 0;
    private yDist: number = 0;
    public yBase: number = 0;

    public connections: RopeConnection[] = [];
    

    Draw(camera: Camera): void {
        camera.ctx.strokeStyle = "#9c4805";
        camera.ctx.lineWidth = 8;

        for ( let i = 0; i < this.numColumns; i++) {
            camera.ctx.beginPath();
            camera.ctx.moveTo(this.xBase + i * this.xDist, this.yBase);
            camera.ctx.lineTo(this.xBase + i * this.xDist, this.yBase + this.height);
            camera.ctx.stroke();
        }

        for ( let connection of this.connections) {
            camera.ctx.beginPath();
            camera.ctx.moveTo(connection.x1, connection.y + this.margin);
            camera.ctx.lineTo(connection.x2, connection.y + this.margin);
            camera.ctx.stroke();
        }
    }
}


class MinigameRigged extends MinigameBase {
    title = "Rigged";
    instructions = [
        "Ahoy! Select the rope that will lead to the gold",
        "dobbloon! The coin will follow the path down, but",
        "always takes side routes."
    ];
    backdropTile: ImageTile = tiles["bgRigged"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][0][0];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Horizontal, "Change Rope"),
        new InstructionControl(Control.Button, "Confirm Choice")
    ];
    songId = "carnival";

    currentMaze: RopeMaze = new RopeMaze(5, 10);
    currentSelectionIndex = 0;
    isChoosing = false;

    dropCount = 0;
    arrowSprite = new SimpleSprite(0, 0, tiles["boardArrow"][playerIndex][0]);
    coin = new SimpleSprite(0, -400, tiles["dobbloon"][0][0], (spr) => {
        (spr as SimpleSprite).Animate(0.25);
    }).Scale(0.5);
    coinTarget: {x: number, y: number} | null = null;


    Initialize(): void {
        this.GenerateMaze();
        this.arrowSprite.rotation = -Math.PI / 2;
        this.sprites.push(this.arrowSprite, this.coin);
    }

    GenerateMaze(): void {
        let ropeCount = 3 + Math.floor(this.dropCount * 0.6);
        let conns = 6 + this.dropCount * 2;
        this.currentMaze = new RopeMaze(ropeCount, conns);
    }

    PlaceCoin(): void {
        this.isChoosing = true;
        this.coin.y = -200;
        this.coin.x = this.currentMaze.xBase - camera.canvas.width / 2 + this.currentMaze.xDist * Random.GetRandInt(0, this.currentMaze.numColumns - 1);
        this.coinTarget = null;
    }

    SetVerticalConnection() : void {
        let mappedX = this.coin.x + camera.canvas.width / 2;
        let mappedY = this.coin.y + camera.canvas.height / 2;

        let potentialTargets = this.currentMaze.connections.filter(a => a.x1 == mappedX || a.x2 == mappedX);
        let potentialYs = potentialTargets.map(a => a.y).filter(a => a > mappedY + 1);
        potentialYs.sort((a, b) => a - b);
        if (potentialYs.length > 0) {
            this.coinTarget = {x: mappedX, y: potentialYs[0]};
        } else {
            this.coinTarget = {x: mappedX, y: 500};
        }
    }

    CoinMovement(): void {
        if (this.coinTarget == null) {
            this.SetVerticalConnection();
        }

        if (this.coinTarget) {
            let speed = 3 + this.dropCount * 1;
            let targetX = this.coinTarget.x - camera.canvas.width/2;
            let targetY = this.coinTarget.y - camera.canvas.height/2;
            let wasMovingVertically = this.coin.x == targetX;
            if (Math.abs(targetX - this.coin.x) <= speed) {
                this.coin.x = targetX;
            } else {
                if (targetX > this.coin.x) {
                    this.coin.x += speed;
                } else {
                    this.coin.x -= speed;
                }
            }
            if (Math.abs(targetY - this.coin.y) <= speed) {
                this.coin.y = targetY;
            } else {
                if (targetY > this.coin.y) {
                    this.coin.y += speed;
                } else {
                    this.coin.y -= speed;
                }
            }

            if (this.coin.x == targetX && this.coin.y == targetY) {
                // hit target!
                let coinY = this.coinTarget.y;
                let coinX = this.coinTarget.x;
                if (wasMovingVertically) {
                    let conn = this.currentMaze.connections.filter(a => a.y == coinY)[0];
                    if (conn) {
                        let newTargetX = conn.x1 == coinX ? conn.x2 : conn.x1;
                        this.coinTarget = {x: newTargetX, y: coinY};
                    }
                } else {
                    this.SetVerticalConnection();
                }
            }
        }

        if (this.coin.y == 230) {
            if (this.coin.x == this.arrowSprite.x) {
                // yay!
                audioHandler.PlaySound("dobbloon", false);
                this.score++;
            }
            this.GenerateMaze();
            this.PlaceCoin();
            this.isChoosing = true;
        }

    }

    Update(): void {
        if (this.timer == 0) {
            this.PlaceCoin();
        }

        if (this.isChoosing || this.timer < 0) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true)) {
                this.currentSelectionIndex--;
                if (this.currentSelectionIndex < 0) {
                    this.currentSelectionIndex = 0;
                }
            }
            if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true)) {
                this.currentSelectionIndex++;
                if (this.currentSelectionIndex >= this.currentMaze.numColumns) {
                    this.currentSelectionIndex = this.currentMaze.numColumns - 1;
                }
            }
        }
        if (this.isChoosing) {
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                this.isChoosing = false;
                this.dropCount++;
            }
        }

        if (!this.isChoosing && this.timer >= 0 && this.GetRemainingTicks() > 0) {
            this.CoinMovement();
        }

        this.arrowSprite.x = this.currentMaze.xBase + this.currentSelectionIndex * this.currentMaze.xDist - camera.canvas.width / 2;
        this.arrowSprite.y = 240;

        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    }

    GetRemainingTicks(): number {
        return 60 * 60 - this.timer;
    }
    

    OnBeforeDrawSprites(camera: Camera): void {
        this.currentMaze.Draw(camera);
    }


}