class MatchCard extends SimpleSprite {
    constructor(x: number, y: number, imageTile: ImageTile, public imageIndex: number) {
        super(x,y,tiles["cards"][playerIndex][2], () => { this.Update() });
        this.faceImage = imageTile;
    }

    faceImage!: ImageTile;
    isFlipped = false;
    isFlipping = false;
    flipTimer = 0;
    flipFrames = 20;
    isLocked = false;

    Flip(): void {
        if (this.flipTimer == 0 && !this.isLocked) {
            this.flipTimer = 1;
            this.isFlipping = true;
        }
    }


    Update(): void {
        if (currentMinigame instanceof MinigameMatch) {
            this.xScale = Math.abs(this.flipFrames - (this.flipTimer * 2)) / this.flipFrames * currentMinigame.cardScale;
            if (this.flipTimer > 0) {
                if (this.flipTimer == Math.floor(this.flipFrames / 2)) {
                    if (this.isFlipped) {
                        this.imageTile = tiles["cards"][playerIndex][2];
                    } else {
                        this.imageTile = this.faceImage;
                    }
                }
                this.flipTimer++;
                if (this.flipTimer == this.flipFrames) {
                    this.flipTimer = 0;
                    this.isFlipped = !this.isFlipped;
                    this.isFlipping = false;
                }
            }
        }
    }
}

class MinigameMatch extends MinigameBase {
    title = "Match 'Em Up";
    instructions = [
        "Flip over pairs of cards to find matches.",
        "Once you've found all matching pairs, a new deck",
        "with even more cards will be dealt."
    ];
    backdropTile: ImageTile = tiles["bgCardTable"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][3][1];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Move, "Move cursor"),
        new InstructionControl(Control.Button, "Flip card"),
    ];
    songId = "waltz";

    cursor!: Sprite;
    cards: MatchCard[] = [];
    xs = [0];
    ys = [0]
    cardImages: any[] = [];
    cardScale = 1;
    targetXIndex = 0;
    targetYIndex = 0;
    wrongTimer = 0;
    pairCount = 4;

    Initialize(): void {
        this.cursor = new SimpleSprite(0, 0, tiles["cards"][0][1]);
        this.sprites.push(this.cursor);

        for (let i=0; i<2; i++) {
            for (let j=1; j<6; j++) {
                this.cardImages.push(tiles["cards"][j][i]);
            }
        }

        this.DealCards();
    }

    DealCards(): void {
        audioHandler.PlaySound("spinRing", false);
        this.sprites.filter(a => a instanceof MatchCard).forEach(a => a.isActive = false);

        let numPairs = this.pairCount;
        this.cardScale = 1;

        let rows = 2;
        let cols = numPairs * 1;
        let height = 210;
        let width = 150;

        if (numPairs > 5) {
            rows = 3;
            cols = Math.ceil(numPairs * 2 / rows);
            height *= .8;
            width *= .8;
            this.cardScale *= 0.8;
        }


        let x0 = -width * (cols - 1) / 2;
        this.xs = [];
        for (let x = x0; x <= -x0; x += width) {
            this.xs.push(x);
        }
        let y0 = -height * (rows - 1) / 2;
        this.ys = [];
        for (let y = y0; y <= -y0; y += height) {
            this.ys.push(y);
        }

        // create deck of pairs
        let deck: number[] = [];
        let imageIndeces = [0,1,2,3,4,5,6,7,8,9];
        for (let pair = 0; pair < numPairs; pair++) {
            let imageIndex = Random.RandFrom(imageIndeces);
            imageIndeces = imageIndeces.filter(a => a != imageIndex);
            deck.push(imageIndex, imageIndex);
        }


        // deal out to random positions
        for (let x of this.xs) {
            for (let y of this.ys) {
                if (x == 0 && y == 0 && (rows * cols % 2 == 1)) {
                    // odd number of spaces, skip center
                    continue;
                }
                let deckIndex = Random.GetRandIntFrom1ToNum(deck.length - 1);
                let imageIndex = deck.splice(deckIndex, 1)[0];
                let image = this.cardImages[imageIndex];
                let card = new MatchCard(x, y, image, imageIndex).Scale(this.cardScale);
                this.cards.push(card as MatchCard);
            }
        }
        this.targetXIndex = Math.floor(cols/2);
        this.targetYIndex = Math.floor(rows/2);
        this.sprites = [...this.cards, this.cursor];
    }

    FlipCard(xIndex: number, yIndex: number): void {

    }

    Update(): void {
        this.cursor.xScale = this.cardScale + (Math.sin(this.timer / 20) + 1) / 30 + 0.1;
        this.cursor.yScale = this.cursor.xScale;
        if (KeyboardHandler.IsKeyPressed(KeyAction.Left, true) && this.targetXIndex > 0) {
            this.targetXIndex--;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Up, true) && this.targetYIndex > 0) {
            this.targetYIndex--;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Right, true) && this.targetXIndex < this.xs.length - 1) {
            this.targetXIndex++;
        }
        if (KeyboardHandler.IsKeyPressed(KeyAction.Down, true) && this.targetYIndex < this.ys.length - 1) {
            this.targetYIndex++;
        }
        let cursorTargetX = this.xs[this.targetXIndex];
        let cursorTargetY = this.ys[this.targetYIndex];
        this.cursor.x = (cursorTargetX * 0.15 + this.cursor.x * 0.85);
        this.cursor.y = (cursorTargetY * 0.15 + this.cursor.y * 0.85);
        
        if (!this.isEnded && this.timer >= 0) {
            let areAnyFlipping = this.cards.some(a => a.isFlipping);
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && !areAnyFlipping && this.wrongTimer == 0) {
                let card = this.cards.find(a => a.x == this.xs[this.targetXIndex] && a.y == this.ys[this.targetYIndex]);
                if (card) {
                    card.Flip();
                }
            }

            // check for match
            let pendingCards = this.cards.filter(a => !a.isLocked && a.isFlipped);
            // rolling back non-matching flips
            if (this.wrongTimer > 0) {
                this.wrongTimer++;
                if (this.wrongTimer == 20) {
                    pendingCards.forEach(a => a.Flip());
                    this.wrongTimer = 0;
                }
            }
            if (pendingCards.length == 2) {
                if (pendingCards[0].imageIndex == pendingCards[1].imageIndex) {
                    // a match!
                    pendingCards.forEach(a => a.isLocked = true);
                    this.score++;
                    audioHandler.PlaySound("dobbloon", false);
                } else {
                    this.wrongTimer++;
                    audioHandler.PlaySound("error", false);
                }
            }
        }

        let allMatchesFound = this.cards.every(a => a.isLocked);
        if (allMatchesFound) {
            if (this.pairCount < 10) this.pairCount++;
            this.DealCards();
        }



        let isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }
    }
}