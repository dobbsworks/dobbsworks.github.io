class PipeContent extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    isMovedByWind = false;
    containedSprite: Sprite | null = null;

    spriteFrames: FrameData[] = [];
    direction!: Direction;

    SetContainedSprite(sprite: Sprite): void {
        this.containedSprite = sprite;
        let frames = sprite.GetFrameData(0);
        if ("xFlip" in frames) this.spriteFrames.push(frames);
        else this.spriteFrames.push(...frames);

        for (let frame of this.spriteFrames) {
            frame.imageTile = new ImageTile(frame.imageTile.src, frame.imageTile.xSrc, frame.imageTile.ySrc,
                frame.imageTile.width > 10 ? 10 : frame.imageTile.width,
                frame.imageTile.height > 10 ? 10 : frame.imageTile.height);
            frame.xOffset = -1;
            frame.yOffset = -1;
            if (frame.imageTile.width < 10) frame.xOffset -= (10 - frame.imageTile.width) / 2;
            if (frame.imageTile.height < 10) frame.yOffset -= (10 - frame.imageTile.height) / 2;
        }
        this.dx = 0;
        this.dy = 0;
        this.age = 0;
        if (player == sprite) {
            camera.target = this;
        }
    }

    Update(): void {
        if (this.age % 12 == 0) {
            let oldDirection = this.direction;
            let track = this.layer.map?.wireLayer.GetTileByPixel(this.xMid, this.yMid);

            if (track && track.tileType.isTrackPipe) {
                // if land on pipe tile, pop out sprite, set direction/velocity based on pipe outlet direction
                this.isActive = false;
                if (this.containedSprite) {
                    this.layer.sprites.push(this.containedSprite);
                    this.containedSprite.x = this.xMid - this.containedSprite.width / 2;
                    this.containedSprite.y = this.yMid - this.containedSprite.height / 2;
                    this.containedSprite.isActive = true;
                    this.containedSprite.trackPipeExit = track;

                    if (camera.target == this) {
                        player = this.containedSprite as Player;
                        camera.target = player;
                        player.Jump();
                    }

                    // eject from exit
                    if (track.tileType.trackDirections[0].y == 0) {
                        // horizontal dir
                        this.containedSprite.dx = -track.tileType.trackDirections[0].x;
                        this.containedSprite.dy = -1.5;
                    } else {
                        this.containedSprite.dx = 0;
                        this.containedSprite.dy = -1.7 * track.tileType.trackDirections[0].y;
                    }
                }
            } else if (track && track.tileType.trackDirections.length > 0) {
                // check possible directions
                if (track.tileType.trackDirections.length == 1) {
                    this.direction = track.tileType.trackDirections[0];
                } else if (track.tileType.trackDirections.length == 2) {
                    this.direction = track.tileType.trackDirections.filter(a => a != this.direction.Opposite())[0];
                } else if (track.tileType.trackDirections.length == 4) {
                    // prioritize same as current, override with player input
                    // find directions that have a connecting track
                    let validDirections = track.tileType.trackDirections.filter(a => track && track.Neighbor(a).tileType.trackDirections.indexOf(a.Opposite()) > -1);

                    // unless backwards is the only option, no going backwards
                    if (validDirections.length > 1) {
                        validDirections = validDirections.filter(a => a != this.direction.Opposite());
                    }

                    if (validDirections.length == 1) {
                        this.direction = validDirections[0];
                    } else {
                        let canControlDirection = this.containedSprite instanceof Player;
                        if (canControlDirection && KeyboardHandler.IsKeyPressed(KeyAction.Left, false) && validDirections.indexOf(Direction.Left) > -1) {
                            this.direction = Direction.Left;
                        } else if (canControlDirection && KeyboardHandler.IsKeyPressed(KeyAction.Right, false) && validDirections.indexOf(Direction.Right) > -1) {
                            this.direction = Direction.Right;
                        } else if (canControlDirection && KeyboardHandler.IsKeyPressed(KeyAction.Up, false) && validDirections.indexOf(Direction.Up) > -1) {
                            this.direction = Direction.Up;
                        } else if (canControlDirection && KeyboardHandler.IsKeyPressed(KeyAction.Down, false) && validDirections.indexOf(Direction.Down) > -1) {
                            this.direction = Direction.Down;
                        } else {
                            // making no choice! Can we keep going straight?
                            if (validDirections.indexOf(this.direction) == -1) {
                                // nope! Can we hang a left?

                                if (validDirections.indexOf(this.direction.CounterClockwise()) > -1) {
                                    this.direction = this.direction.CounterClockwise();
                                } else {
                                    this.direction = validDirections[0];
                                }
                            }
                        }
                    }
                } else {
                    this.direction = this.direction.Opposite();
                }

                // confirm chosen direction is valid, else go back
                if (track.Neighbor(this.direction).tileType.trackDirections.indexOf(this.direction.Opposite()) == -1) {
                    this.direction = oldDirection.Opposite();
                }
            }
        }

        this.dx = this.direction.x;
        this.dy = this.direction.y;

        this.MoveByVelocity();
    }

    GetFrameData(frameNum: number): FrameData[] {
        let ret = [{
            imageTile: tiles["motorTrack"][7][4],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        }];
        if (this.spriteFrames) {
            ret.push(...this.spriteFrames);
        }
        return ret;
    }
}