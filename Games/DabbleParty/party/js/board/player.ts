class Player {
    userId: number = -1;
    userName: string = "";
    token!: BoardToken;
    coins: number = 10;
    displayedCoins = 10;

    gears: number = 1;
    diceBag = new DiceBag();
    inventory: BoardItem[] = [itemList[0]];

    turnOrder: number = 0;
    amountOfMovementLeft = 0;
    moving = false;
    choosingPath = false;
    selectedPathIndex = 0;

    isInShop = false;
    landedOnShop = false;

    // track stats for final bonuses/graph
    statDiceTotal = 0;
    statNonGearSpending = 0;
    statMinigameWinnings = 0;
    statListOfLandings: BoardSpaceType[] = [];
    statListOfPassings: BoardSpaceType[] = [];

    constructor(public avatarIndex: number) { }

    get avatarName(): string {
        return ["GameQueued", "germdove", "Al", "Turtle", "Dobbs", "Hover Cat", "Daesnek", "Panda", "Sunberry", "Ally", "Duffy", "Teddy", "Doopu"][this.avatarIndex];
    }

    Update(): void {
        if (this.token) {
            if (!cutsceneService.isCutsceneActive) {
                if (!this.isInShop) this.token.Update();
                if (this.choosingPath && this.token.currentSpace) {
                    let dirKeys = [KeyAction.Left, KeyAction.Right, KeyAction.Up, KeyAction.Down];
                    if (dirKeys.some(a => KeyboardHandler.IsKeyPressed(a, true))) {
                        this.selectedPathIndex++;
                        if (this.selectedPathIndex >= this.token.currentSpace.nextSpaces.length) {
                            this.selectedPathIndex = 0;
                        }
                    } else if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true)) {
                        let nextSpace = this.token.currentSpace.nextSpaces[this.selectedPathIndex];
                        this.token.MoveToSpace(nextSpace);
                        this.choosingPath = false;
                    }
                } else {
                    if (this.token.currentSpace && this.amountOfMovementLeft > 0) {
                        if (this.token.currentSpace.spaceType.costsMovement && this.moving) {
                            this.amountOfMovementLeft--;
                        }
                        let wasMoving = this.moving;
                        this.moving = true;

                        if (this.amountOfMovementLeft > 0) {
                            let options = this.token.currentSpace.nextSpaces;
                            if (options.length == 1) {
                                let nextSpace = options[0];
                                if (wasMoving) {
                                    this.token.currentSpace.spaceType.OnPass(this);
                                    if (this.token.currentSpace.spaceType.OnPass != BoardSpaceType.DoNothing) {
                                        this.statListOfPassings.push(this.token.currentSpace.spaceType);
                                    }
                                }
                                this.token.MoveToSpace(nextSpace);
                            } else {
                                this.choosingPath = true;
                                this.selectedPathIndex = 0;
                            }
                        }
                    }

                    if (this.token.currentSpace && this.amountOfMovementLeft == 0 && this.moving) {
                        this.moving = false;
                        this.token.currentSpace.spaceType.OnLand(this);
                        audioHandler.PlaySound("bwump", true);
                        this.statListOfLandings.push(this.token.currentSpace.spaceType);
                        setTimeout(() => {
                            let me = this;
                            me.TurnOver();
                        }, 1000);
                    }
                }
            }
        }
    }

    TurnOver(): void {
        let me = this;
        if (this.isInShop || cutsceneService.isCutsceneActive) {
            setTimeout(() => { me.TurnOver() }, 1000);
        } else {
            board?.CurrentPlayerTurnEnd();
        }
    }

    DrawToken(camera: Camera): void {
        if (this.token) {

            let currentSpace = this.token.currentSpace;
            if (this.choosingPath && currentSpace) {
                let nextSquares = currentSpace.nextSpaces;
                for (let i = 0; i < nextSquares.length; i++) {
                    let nextSquare = nextSquares[i];
                    let isSelected = this.selectedPathIndex == i;
                    let pulse = Math.sin((board?.timer || 0) / 10);
                    let scale = isSelected ? 1 + pulse / 8 : 1;
                    let angle = Math.atan2((nextSquare.gameY - currentSpace.gameY) * 2, nextSquare.gameX - currentSpace.gameX);
                    let distance = 75 + (isSelected ? pulse * 5 : 0);
                    let arrowImage = tiles["boardArrow"][i][0] as ImageTile;
                    arrowImage.Draw(camera, this.token.x + distance * Math.cos(angle), this.token.y + distance * Math.sin(angle), 1 * scale, 0.5 * scale, false, false, angle);
                }
            }

            let displayedMovementRemaining = this.amountOfMovementLeft;
            if (displayedMovementRemaining > 0 && (this.token.currentSpace == null || this.choosingPath)) {
                DrawNumber(this.token.x, this.token.y - 100, displayedMovementRemaining, camera, 0.5);
            }

            this.token.Draw(camera);
        }
    }

    CurrentPlace(): number {
        if (board) {
            let playersToSort = [...board.players];
            playersToSort.sort((a, b) => (b.gears - a.gears) * 10000 + (b.displayedCoins - a.coins));
            for (let rank = 1; rank <= 4; rank++) {
                let p = playersToSort[rank - 1];
                // weird compare below to handle ties
                if (this.gears == p.gears && this.displayedCoins == p.displayedCoins) return rank;
            }
        }
        return -1;
    }

    CurrentPlaceText(): string {
        let place = this.CurrentPlace();
        if (place < 1 || place > 4) return "";
        return ["1st", "2nd", "3rd", "4th"][place - 1];
    }
}

class DiceBag {
    // represents how many/what face dice a player rolls 
    // which can be upgraded as the game progresses

    constructor(public dieFaces: FaceCount[] = [6, 6]) {}

    fragileFaces: FaceCount[] = [];

    GetDiceSprites(): DiceSprite[] {
        let ret: DiceSprite[] = [];

        let numDice = this.dieFaces.length + this.fragileFaces.length;
        let space = 200;
        if (numDice == 2) space = 250;
        let x = -space * (numDice - 1) / 2;
        for (let f of this.dieFaces) {
            ret.push(new DiceSprite(x, -100, f, false));
            x += space;
        }
        for (let f of this.fragileFaces) {
            ret.push(new DiceSprite(x, -100, f, true));
            x += space;
        }
        this.fragileFaces = [];
        return ret;
    }

    Upgrade(): void {
        if (this.dieFaces.length > 0) {
            let minVal = Math.min(...this.dieFaces) as FaceCount;
            let index = this.dieFaces.indexOf(minVal);
            let newValue = (minVal >= 12 ? 20 : (minVal + 2)) as FaceCount;
            this.dieFaces[index] = newValue;
        }
    }
    Downgrade(): void {
        if (this.dieFaces.length > 0) {
            let maxValue = Math.max(...this.dieFaces) as FaceCount;
            let index = this.dieFaces.indexOf(maxValue);
            let newValue = (maxValue == 20 ? 12 : (maxValue == 4 ? 4 : (maxValue - 2))) as FaceCount;
            this.dieFaces[index] = newValue;
        }
    }

}