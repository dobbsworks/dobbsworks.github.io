class Motor extends Sprite {
    public height: number = 12;
    public width: number = 12;
    public respectsSolidTiles: boolean = false;

    protected isInitialized = false;
    public connectedSprite: Sprite | null = null;
    protected connectionDistance: number = 0;
    private isOnTrack = false;

    protected motorSpeed = 0.5;
    protected wireColor = "#222";
    protected wireDrawBottomSpace: number = 11;
    protected connectionDirectionY: -1 | 1 = 1;
    public motorSpeedRatio = 1; // for connected sprite to slow down motor in some situations
    private trackTile: LevelTile | null = null;

    private frame: number = 0;
    protected frameX: number = 0;
    protected frameY: number = 0;
    protected direction: Direction = Direction.Right;

    Initialize(): void {
        let currentTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor();
        if (currentTile?.tileType.trackDirections.length) this.isOnTrack = true;
        // find closest non-player sprite below motor
        let possibleConnectionSprites = this.connectionDirectionY == 1 ?
            this.layer.sprites.filter(a => a.x < this.xRight && a.xRight > this.x && a.y >= this.yBottom && a.canMotorHold) :
            this.layer.sprites.filter(a => a.x < this.xRight && a.xRight > this.x && a.yBottom <= this.y && a.canMotorHold);
        if (possibleConnectionSprites.length == 0) {
            return;
        }
        if (this.connectionDirectionY == 1) possibleConnectionSprites.sort((a, b) => a.y - b.y);
        if (this.connectionDirectionY == -1) possibleConnectionSprites.sort((a, b) => -a.y + b.y);
        this.connectedSprite = possibleConnectionSprites[0];
        this.connectionDistance = this.connectedSprite.y - this.y;
    }

    GetTileRatio(num: number): number {
        return (num % 12) / 12;
    }

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }

        let oldTrack = this.trackTile;
        this.trackTile = this.layer.GetTileByPixel(this.xMid, this.yMid).GetWireNeighbor() || null;
        if (this.isOnTrack && this.trackTile?.tileType.trackDirections.length) {

            let trackDirections = this.trackTile.tileType.trackDirections;
            let tileXMid = this.trackTile.tileX * 12 + 6;
            let tileYMid = this.trackTile.tileY * 12 + 6;

            let speedRatio = 1;
            if (this.trackTile.tileType.trackDirections.length == 1) {
                let distanceFromCenter = Math.abs(this.GetTileRatio(this.xMid) - 0.5) + Math.abs(this.GetTileRatio(this.yMid) - 0.5);
                distanceFromCenter = Math.max(0, Math.min(0.5, distanceFromCenter)) * 2; // distance is [0, 1]
                let distanceToCircleMap = Math.sqrt(-((distanceFromCenter - 1) ** 2) + 1.1);
                speedRatio = distanceToCircleMap;
            }
            speedRatio *= this.motorSpeed * this.motorSpeedRatio;
            this.frame += speedRatio;

            if (trackDirections.length == 1) {
                // TRACK CAP
                // +-----------+
                // |           |
                // |           |
                // |     o     |
                // |     |     |
                // |     |     |
                // +-----------+

                // safety to keep direction lined up
                if (this.direction != trackDirections[0] && this.direction != trackDirections[0].Opposite()) {
                    this.direction = trackDirections[0];
                }
                if (this.direction == trackDirections[0].Opposite()) {
                    if (this.direction == Direction.Up && this.yMid % 12 < 6) { this.direction = Direction.Down; this.y -= this.y % 12 }
                    if (this.direction == Direction.Down && this.yMid % 12 > 6) { this.direction = Direction.Up; this.y -= this.y % 12 }
                    if (this.direction == Direction.Left && this.xMid % 12 < 6) { this.direction = Direction.Right; this.x -= this.x % 12 }
                    if (this.direction == Direction.Right && this.xMid % 12 > 6) { this.direction = Direction.Left; this.x -= this.x % 12 }
                }
                this.dx = speedRatio * this.direction.x;
                this.dy = speedRatio * this.direction.y;
                if (this.direction.x == 0) this.x -= this.x % 12;
                if (this.direction.y == 0) this.y -= this.y % 12;
            } else if (trackDirections.length == 4) {
                // TRACK BRIDGE
                // +-----------+
                // |     |     |
                // |     |     |
                // |-----+-----|
                // |     |     |
                // |     |     |
                // +-----------+
                this.dx = speedRatio * this.direction.x;
                this.dy = speedRatio * this.direction.y;
                if (this.direction.x == 0) this.x = this.trackTile.tileX * 12;
                if (this.direction.y == 0) this.y = this.trackTile.tileY * 12;
            } else if (trackDirections[0] == trackDirections[1].Opposite()) {
                // safety to keep direction lined up
                if (this.direction != trackDirections[0] && this.direction != trackDirections[0].Opposite()) {
                    this.direction = trackDirections[0];
                }
                this.dx = speedRatio * this.direction.x;
                this.dy = speedRatio * this.direction.y;
                if (this.direction.x == 0) this.x = this.trackTile.tileX * 12;
                if (this.direction.y == 0) this.y = this.trackTile.tileY * 12;
            } else {
                // CURVED TRACK
                // +-----------+
                // |           |
                // |           |
                // |==._       |
                // |    \      |
                // |     |     |
                // +-----------+

                let dirX = trackDirections[0].y == 0 ? trackDirections[0] : trackDirections[1];
                let dirY = trackDirections[0].x == 0 ? trackDirections[0] : trackDirections[1];
                let arcCenterX = tileXMid + 6 * dirX.x;
                let arcCenterY = tileYMid + 6 * dirY.y;
                // arcCenter is lower-left corner in above diagram

                let theta = Math.atan2(this.yMid - arcCenterY, this.xMid - arcCenterX);
                // theta 0 == direct right
                //      -0.7 == up-right
                //      3.14 == left
                //      0.7 == down-right

                let targetSpin = 0; // 1 for clockwise, -1 for counterclockwise
                if (this.direction == dirX || this.direction == dirY.Opposite()) {
                    // heading out to side or in from top/bottom
                    targetSpin = (dirX.x == dirY.y ? 1 : -1);
                } else {
                    // heading out to top/bottom or in from side
                    targetSpin = (dirX.x == dirY.y ? -1 : 1);
                }
                let targetTheta = theta + speedRatio / 6 * targetSpin;
                let targetX = arcCenterX + Math.cos(targetTheta) * 6;
                let targetY = arcCenterY + Math.sin(targetTheta) * 6;
                this.dx = targetX - this.xMid;
                this.dy = targetY - this.yMid;

                let fortyfives = [Math.PI/4, -Math.PI/4, 3*Math.PI/4, -3*Math.PI/4];
                if (fortyfives.some(a => Utility.IsBetween(a, theta, targetTheta))) {
                    // crossed a 45 degree split
                    if (this.direction == dirX.Opposite()) this.direction = dirY;
                    else this.direction = dirX;
                }
            }
/*
// Weird test case
1.7.0;12;0;0;3|#0acf2f,#ed697a,0.00,1.00,0.30;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0|AA/AA/AA/AAv|AA/AA/AA/AAv|AAIABBACAAAIABCAAIACAABBAAIABAACAABAAAIABCAAIABCAAIABBACAAAIACAABBAAHAGAABCAAIABCAAIABCAAGABBACAABBAAGABEAAGABDACAAAGABEAAGABBACAABBAAGABEAAHABDAAHACAABAACAABAAAHABD|AAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAALABAAAKABAAAKABAAAC|AAnAkAAAKAkAAAAAtDAAFAkAAAAAtDAAFAkAAAAAtDAAFAkAAAAAtBAAAAtAAAFAkAAAAAtAAqDAAEAkAAAAAqAAtCAAFAkBAtDAAFAkBAtDAAFAqAAkAAAJAqAAsAAAJAqAAkAAAJAqAAkAAAUAlHAAY|ABCGAF;A6AYAC;AEAPAG;AEAgAI;AzAiAG;AzAjAF;AzAkAG;AEAxAE;AbA8AGAD;A0A9AC;AlA2AJ;AlA/AH;A5BIAE;AEBLAG;AEBOAI;A4BcAJ;AzBZAG;AzBYAG;AzBXAG;AEBiAG;AEBiAF;AdBoAIAD;AdBtAI;AEB0AG;AFCAAH;AAAEAI;AvAMAF
1.7.0;12;0;0;3|#641db4,#df422f,0.00,1.00,0.30;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0|AA/AA/AA/AAv|AA/AA/AA/AAv|AAIABBACAAAIABCAAIACAABBAAIABAACAABAAAIABCAAIABCAAIABBACAAAIACAABBAAHAGAABCAAIABCAAIABCAAGABBACAABBAAGABEAAGABDACAAAGABEAAGABBACAABBAAGABEAAHABDAAHACAABAACAABAAAHABD|AAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAALABAAAKABAAAKABAAAC|AA+AmAApAAmAApAAAHAkAAnAAoAAkAAAHAkAAAAAmAAoAAAHAnAApAAnAApAAAIAnAAlAAoAAA/AA8|ABCGAF;A6AYAC;AEAPAG;AEAgAI;AzAiAG;AzAjAF;AzAkAG;AEAxAE;AbA8AGAD;A0A9AC;AlA2AJ;AlA/AH;A5BIAE;AEBLAG;AEBOAI;A4BcAJ;AzBZAG;AzBYAG;AzBXAG;AEBiAG;AEBiAF;AdBoAIAD;AdBtAI;AEB0AG;AFCAAH;AAAEAI;AvAGAG
1.7.0;12;0;0;3|#93ddf6,#7b81bf,0.00,1.00,0.30;AA,#ffffff,-0.25,0,0.05,0,0,0;AB,#5959a5,0,0,0.1,0,1,0;AC,#14b714,0,0,0.2,0,1,0;AD,#10a010,0,0,0.3,0,1,0|AA/AA/AA/AAv|AA/AA/AA/AAv|AAIABBACAAAIABCAAIACAABBAAIABAACAABAAAIABCAAIABCAAIABBACAAAIACAABBAAHAGAABCAAIABCAAIABCAAGABBACAABBAAGABEAAGABDACAAAGABEAAGABBACAABBAAGABEAAHABDAAHACAABAACAABAAAHABD|AAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAALABAAAKABAAAKABAAAC|AAWADAAAOADGAAEADAAmAApAAACADAAAEADAAAAAoAAAJAnAApAAAJAnAAoAAA/AA/AAV|ABCGAF;A6AYAC;AEAPAG;AEAgAI;AzAiAG;AzAjAF;AzAkAG;AEAxAE;AbA8AGAD;A0A9AC;AlA2AJ;AlA/AH;A5BIAE;AEBLAG;AEBOAI;A4BcAJ;AzBZAG;AzBYAG;AzBXAG;AEBiAG;AEBiAF;AdBoAIAD;AdBtAI;AEB0AG;AFCAAH;AAAFAI;AfAEAI;AvAHAF
*/
            this.MoveByVelocity();
        } else {
            this.isOnTrack = false;
            this.ApplyGravity();
            let oldX = this.x;
            let oldY = this.y;
            this.MoveByVelocity();

            if (this.trackTile?.tileType.trackDirections.length) {
                let previousTile = this.layer.GetTileByPixel(oldX + this.width / 2, oldY + this.height / 2).GetWireNeighbor();
                if (this.trackTile == previousTile) {
                    // check if we "crossed" the track
                    let motorMidpoint = { x: this.xMid, y: this.yMid };
                    let tileXMid = this.trackTile.tileX * 12 + 6;
                    let tileYMid = this.trackTile.tileY * 12 + 6;

                    let trackDirections = this.trackTile.tileType.trackDirections;
                    if (trackDirections.length == 1) {
                        // TRACK CAP
                        // +-----------+
                        // |           |
                        // |           |
                        // |     o     |
                        // |     |     |
                        // |     |     |
                        // +-----------+
                        let dir = trackDirections[0];
                        let crosses = Utility.DoLinesIntersect(motorMidpoint, { x: oldX + 6, y: oldY + 6 }, { x: tileXMid, y: tileYMid }, { x: tileXMid + 6 * dir.x, y: tileYMid + 6 * dir.y });
                        if (crosses) {
                            this.isOnTrack = true;
                            if (dir.y == 0) {
                                this.y = this.trackTile.tileY * 12;
                            }
                            if (dir.x == 0) {
                                this.x = this.trackTile.tileX * 12;
                            }

                            if (dir.x == 0) {
                                this.direction = this.dy < 0 ? Direction.Up : Direction.Down;
                            } else {
                                this.direction = this.dx < 0 ? Direction.Left : Direction.Right;
                            }
                        }
                    } else if (trackDirections.length == 4) {
                        // TRACK BRIDGE
                        // +-----------+
                        // |     |     |
                        // |     |     |
                        // |-----+-----|
                        // |     |     |
                        // |     |     |
                        // +-----------+
                        let crossesHorizontal = Utility.DoLinesIntersect(motorMidpoint, { x: oldX + 6, y: oldY + 6 }, { x: tileXMid - 6, y: tileYMid },  { x: tileXMid + 6, y: tileYMid });
                        if (crossesHorizontal) {
                            this.isOnTrack = true;
                            this.y = this.trackTile.tileY * 12;
                            this.direction = this.dx < 0 ? Direction.Left : Direction.Right;
                        } else {
                            let crossesVertical = Utility.DoLinesIntersect(motorMidpoint, { x: oldX + 6, y: oldY + 6 }, { x: tileXMid , y: tileYMid - 6 },  { x: tileXMid, y: tileYMid + 6 });
                            if (crossesVertical) {
                                this.isOnTrack = true;
                                this.x = this.trackTile.tileX * 12;
                                this.direction = this.dy < 0 ? Direction.Up : Direction.Down;
                            }
                        }
                        
                    } else if (trackDirections.length == 2) {
                        if (trackDirections[0] == trackDirections[1].Opposite()) {
                            // STRAIGHT TRACK
                            if (trackDirections[0].x == 0) {
                                // VERTICAL
                                // +-----------+
                                // |     |     |
                                // |     |     |
                                // |     |     |
                                // |     |     |
                                // |     |     |
                                // +-----------+
                                let crosses = (oldX <= tileXMid && this.xMid >= tileXMid) || (oldX >= tileXMid && this.xMid <= tileXMid);
                                if (crosses) {
                                    this.isOnTrack = true;
                                    this.x = this.trackTile.tileX * 12;
                                    this.direction = this.dy < 0 ? Direction.Up : Direction.Down;
                                }
                            } else {
                                // HORIZONTAL
                                // +-----------+
                                // |           |
                                // |           |
                                // |===========|
                                // |           |
                                // |           |
                                // +-----------+
                                let crosses = (oldY <= tileYMid && this.yMid >= tileYMid) || (oldY >= tileYMid && this.yMid <= tileYMid);
                                if (crosses) {
                                    this.isOnTrack = true;
                                    this.y = this.trackTile.tileY * 12;
                                    this.direction = this.dx < 0 ? Direction.Left : Direction.Right;
                                }
                            }
                        } else {
                            // CURVED TRACK
                            // +-----------+
                            // |           |
                            // |           |
                            // |==._       |
                            // |    \      |
                            // |     |     |
                            // +-----------+
                            let dir1 = trackDirections[0], dir2 = trackDirections[1];
                            let arcCenterX = tileXMid + 6 * (dir1.x + dir2.x);
                            let arcCenterY = tileYMid + 6 * (dir1.y + dir2.y);
                            // arcCenter is lower-left corner in above diagram
                            let oldDist = Math.sqrt((oldX - arcCenterX) ** 2 + (oldY - arcCenterY) ** 2);
                            let newDist = Math.sqrt((this.x - arcCenterX) ** 2 + (this.y - arcCenterY) ** 2);
                            let crosses = (oldDist <= 6 && newDist >= 6) || (oldDist >= 6 && newDist <= 6);
                            if (crosses) {
                                this.isOnTrack = true;
                                let theta = Math.atan2(this.y - arcCenterY, this.x - arcCenterX);
                                this.x = Math.cos(theta) * 6 + arcCenterX;
                                this.y = Math.sin(theta) * 6 + arcCenterY;
                                if (dir1 == Direction.Down || dir2 == Direction.Down) {
                                    this.direction = Direction.Down;
                                } else if (dir1 == Direction.Left || dir2 == Direction.Left) {
                                    this.direction = Direction.Left;
                                } else {
                                    this.direction = Direction.Right;
                                }
                            }
                        }
                    } else {
                        // WHAT
                        console.error("Invalid track directions");
                    }
                }
            }
        }
        if (!this.trackTile) this.isOnTrack = false;

        if (this.connectedSprite) {
            this.UpdateConnectedSprite(this.connectedSprite);
            this.MoveConnectedSprite(this.connectedSprite);
            let playerGrabbed = this.HandlePlayerGrab(this.connectedSprite);
            if (playerGrabbed) {
                this.connectedSprite = null;
            } else {
                this.MoveConnectedSprite(this.connectedSprite);
            }
        }
    }

    UpdateConnectedSprite(sprite: Sprite): void {
        if (!sprite) return;
        if (!sprite.updatedThisFrame) {
            sprite.SharedUpdate();
            sprite.Update();
            if (sprite instanceof Enemy) {
                sprite.EnemyUpdate();
            }
            sprite.updatedThisFrame = true;
        }
    }

    HandlePlayerGrab(sprite: Sprite): boolean {
        let players = <Player[]>this.layer.sprites.filter(a => a instanceof Player);
        for (let player of players) {
            if (player.heldItem == sprite && player.heldItem.canBeHeld) {
                return true;
            }
        }
        return false;
    }

    MoveConnectedSprite(sprite: Sprite): void {
        if (sprite instanceof Enemy) {
            if (this.direction.x == 1 || this.direction.x == -1)
                sprite.direction = this.direction.x;
        }

        sprite.x = this.xMid - sprite.width / 2;
        sprite.y = this.y + this.connectionDistance;
        sprite.dx = this.dx;
        sprite.dy = this.dy;
    }

    GetFrameData(frameNum: number): FrameData {
        let col = Math.floor(Math.abs(this.frame) / 4) % 2;
        return {
            imageTile: tiles["motorTrack"][col + this.frameX][this.frameY],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

    OnBeforeDraw(camera: Camera): void {
        if (this.connectionDistance == 0 || this.connectedSprite == null) return;
        let x = (this.xMid - camera.x) * camera.scale + camera.canvas.width / 2;
        let yGameStart = (this.connectionDirectionY == 1) ? (this.y + this.wireDrawBottomSpace) : this.y + 2;
        let y = (yGameStart - camera.y) * camera.scale + camera.canvas.height / 2;
        let yGameEnd = (this.connectionDirectionY == 1) ? this.connectedSprite.y : this.connectedSprite.yBottom;
        let drawHeight = (yGameEnd - yGameStart) * camera.scale;

        camera.ctx.fillStyle = this.wireColor;
        camera.ctx.fillRect(x - 0.5 * camera.scale, y, 1 * camera.scale, drawHeight);
    }

}

class SlowMotor extends Motor {
    protected motorSpeed: number = 0.25;
    protected frameX: number = 0;
    protected frameY: number = 3;
}

class FastMotor extends Motor {
    protected motorSpeed: number = 1;
    protected frameX: number = 2;
    protected frameY: number = 3;
}

class UpwardMotor extends Motor {
    protected motorSpeed: number = 0.5;
    protected frameX: number = 0;
    protected frameY: number = 4;
    protected connectionDirectionY: -1 | 1 = -1
}

class FerrisMotorRight extends Motor {
    public connectedSprites: (Sprite | null)[] = [];
    public angle = 0;
    private spinSpeed!: number; // rads per frame
    protected rotationDirection: number = 1;

    Initialize(): void {
        super.Initialize();

        if (this.connectedSprite) {
            if (!(this.connectedSprite instanceof Checkpoint)) {
                this.connectionDistance = this.connectedSprite.yMid - this.yMid;
                this.connectedSprites.push(this.connectedSprite);

                let spriteFromEditor = editorHandler.sprites.find(a => a.spriteInstance == this.connectedSprite);
                if (spriteFromEditor) {
                    for (let i = 1; i < 4; i++) {
                        let spriteType = <SpriteType>this.connectedSprite.constructor;
                        let instance = new spriteType(
                            spriteFromEditor.tileCoord.tileX * this.layer.tileWidth,
                            spriteFromEditor.tileCoord.tileY * this.layer.tileHeight,
                            currentMap.mainLayer, spriteFromEditor.editorProps);
                        this.connectedSprites.push(instance);
                        this.layer.sprites.push(instance);
                    }
                }
            }
            this.spinSpeed = 0.02 / this.connectionDistance * 24 * this.rotationDirection;
        }
    }

    Update(): void {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.Initialize();
        }

        this.angle += this.spinSpeed;

        for (let sprite of this.connectedSprites) {
            if (!sprite) continue;
            this.UpdateConnectedSprite(sprite);
            this.MoveConnectedSprite(sprite);
            let spriteIndex = this.connectedSprites.indexOf(sprite);
            let playerGrabbed = this.HandlePlayerGrab(sprite);
            if (playerGrabbed) {
                this.connectedSprites[spriteIndex] = null;
            } else {
                this.MoveConnectedSpriteToAngle(sprite, this.angle + (Math.PI / 2 * spriteIndex));
            }
        }
    }

    MoveConnectedSpriteToAngle(sprite: Sprite, angle: number): void {
        let x = Math.cos(angle) * this.connectionDistance;
        let y = Math.sin(angle) * this.connectionDistance;
        let speed = this.connectionDistance * this.spinSpeed;
        let dx = Math.cos(angle + Math.PI / 2) * speed;
        let dy = Math.sin(angle + Math.PI / 2) * speed;

        if (sprite instanceof Enemy) {
            sprite.direction = dx > 0 ? 1 : -1;
        }

        sprite.x = this.xMid - sprite.width / 2 + x;
        sprite.y = this.yMid - sprite.height / 2 + y;
        sprite.dx = this.dx + dx;
        sprite.dy = this.dy + dy;
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["motorTrack"][2][4],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }

    OnBeforeDraw(camera: Camera): void {
        if (this.connectionDistance == 0 || this.connectedSprites.length == 0) return;

        camera.ctx.fillStyle = "#724200";
        for (let i = 0; i < 4; i++) {
            let angle = this.angle + i * Math.PI / 2;
            //let sprite = this.connectedSprites[i];

            for (let r = 6; r < this.connectionDistance; r += 6) {
                let gameX = r * Math.cos(angle) + this.xMid - 1;
                let gameY = r * Math.sin(angle) + this.yMid - 1;

                let destX = (gameX - camera.x) * camera.scale + camera.canvas.width / 2;
                let destY = (gameY - camera.y) * camera.scale + camera.canvas.height / 2;

                camera.ctx.fillRect(destX, destY, 2 * camera.scale, 2 * camera.scale)
            }
        }
    }
}

class FerrisMotorLeft extends FerrisMotorRight {
    protected rotationDirection: number = -1;
}

class FastFerrisMotorLeft extends FerrisMotorRight {
    protected rotationDirection: number = -2;
}

class FastFerrisMotorRight extends FerrisMotorRight {
    protected rotationDirection: number = 2;
}