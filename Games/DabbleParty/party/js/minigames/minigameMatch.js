"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var MatchCard = /** @class */ (function (_super) {
    __extends(MatchCard, _super);
    function MatchCard(x, y, imageTile, imageIndex) {
        var _this = _super.call(this, x, y, tiles["cards"][playerIndex][2], function () { _this.Update(); }) || this;
        _this.imageIndex = imageIndex;
        _this.isFlipped = false;
        _this.isFlipping = false;
        _this.flipTimer = 0;
        _this.flipFrames = 20;
        _this.isLocked = false;
        _this.faceImage = imageTile;
        return _this;
    }
    MatchCard.prototype.Flip = function () {
        if (this.flipTimer == 0 && !this.isLocked) {
            this.flipTimer = 1;
            this.isFlipping = true;
        }
    };
    MatchCard.prototype.Update = function () {
        if (currentMinigame instanceof MinigameMatch) {
            this.xScale = Math.abs(this.flipFrames - (this.flipTimer * 2)) / this.flipFrames * currentMinigame.cardScale;
            if (this.flipTimer > 0) {
                if (this.flipTimer == Math.floor(this.flipFrames / 2)) {
                    if (this.isFlipped) {
                        this.imageTile = tiles["cards"][playerIndex][2];
                    }
                    else {
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
    };
    return MatchCard;
}(SimpleSprite));
var MinigameMatch = /** @class */ (function (_super) {
    __extends(MinigameMatch, _super);
    function MinigameMatch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = "Match 'Em Up";
        _this.instructions = [
            "Flip over pairs of cards to find matches.",
            "Once you've found all matching pairs, a new deck",
            "with even more cards will be dealt."
        ];
        _this.backdropTile = tiles["bgCardTable"][0][0];
        _this.thumbnail = tiles["thumbnails"][3][1];
        _this.controls = [
            new InstructionControl(Control.Move, "Move cursor"),
            new InstructionControl(Control.Button, "Flip card"),
        ];
        _this.songId = "waltz";
        _this.cards = [];
        _this.xs = [0];
        _this.ys = [0];
        _this.cardImages = [];
        _this.cardScale = 1;
        _this.targetXIndex = 0;
        _this.targetYIndex = 0;
        _this.wrongTimer = 0;
        _this.pairCount = 4;
        return _this;
    }
    MinigameMatch.prototype.Initialize = function () {
        this.cursor = new SimpleSprite(0, 0, tiles["cards"][0][1]);
        this.sprites.push(this.cursor);
        for (var i = 0; i < 2; i++) {
            for (var j = 1; j < 6; j++) {
                this.cardImages.push(tiles["cards"][j][i]);
            }
        }
        this.DealCards();
    };
    MinigameMatch.prototype.DealCards = function () {
        audioHandler.PlaySound("spinRing", false);
        this.sprites.filter(function (a) { return a instanceof MatchCard; }).forEach(function (a) { return a.isActive = false; });
        var numPairs = this.pairCount;
        this.cardScale = 1;
        var rows = 2;
        var cols = numPairs * 1;
        var height = 210;
        var width = 150;
        if (numPairs > 5) {
            rows = 3;
            cols = Math.ceil(numPairs * 2 / rows);
            height *= .8;
            width *= .8;
            this.cardScale *= 0.8;
        }
        var x0 = -width * (cols - 1) / 2;
        this.xs = [];
        for (var x = x0; x <= -x0; x += width) {
            this.xs.push(x);
        }
        var y0 = -height * (rows - 1) / 2;
        this.ys = [];
        for (var y = y0; y <= -y0; y += height) {
            this.ys.push(y);
        }
        // create deck of pairs
        var deck = [];
        var imageIndeces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var _loop_1 = function (pair) {
            var imageIndex = Random.RandFrom(imageIndeces);
            imageIndeces = imageIndeces.filter(function (a) { return a != imageIndex; });
            deck.push(imageIndex, imageIndex);
        };
        for (var pair = 0; pair < numPairs; pair++) {
            _loop_1(pair);
        }
        // deal out to random positions
        for (var _i = 0, _a = this.xs; _i < _a.length; _i++) {
            var x = _a[_i];
            for (var _b = 0, _c = this.ys; _b < _c.length; _b++) {
                var y = _c[_b];
                if (x == 0 && y == 0 && (rows * cols % 2 == 1)) {
                    // odd number of spaces, skip center
                    continue;
                }
                var deckIndex = Random.GetRandIntFrom1ToNum(deck.length - 1);
                var imageIndex = deck.splice(deckIndex, 1)[0];
                var image = this.cardImages[imageIndex];
                var card = new MatchCard(x, y, image, imageIndex).Scale(this.cardScale);
                this.cards.push(card);
            }
        }
        this.targetXIndex = Math.floor(cols / 2);
        this.targetYIndex = Math.floor(rows / 2);
        this.sprites = __spreadArrays(this.cards, [this.cursor]);
    };
    MinigameMatch.prototype.Update = function () {
        var _this = this;
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
        var cursorTargetX = this.xs[this.targetXIndex];
        var cursorTargetY = this.ys[this.targetYIndex];
        this.cursor.x = (cursorTargetX * 0.15 + this.cursor.x * 0.85);
        this.cursor.y = (cursorTargetY * 0.15 + this.cursor.y * 0.85);
        if (!this.isEnded && this.timer >= 0) {
            var areAnyFlipping = this.cards.some(function (a) { return a.isFlipping; });
            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && !areAnyFlipping && this.wrongTimer == 0) {
                var card = this.cards.find(function (a) { return a.x == _this.xs[_this.targetXIndex] && a.y == _this.ys[_this.targetYIndex]; });
                if (card) {
                    card.Flip();
                }
            }
            // check for match
            var pendingCards = this.cards.filter(function (a) { return !a.isLocked && a.isFlipped; });
            // rolling back non-matching flips
            if (this.wrongTimer > 0) {
                this.wrongTimer++;
                if (this.wrongTimer == 20) {
                    pendingCards.forEach(function (a) { return a.Flip(); });
                    this.wrongTimer = 0;
                }
            }
            if (pendingCards.length == 2) {
                if (pendingCards[0].imageIndex == pendingCards[1].imageIndex) {
                    // a match!
                    pendingCards.forEach(function (a) { return a.isLocked = true; });
                    this.score++;
                    audioHandler.PlaySound("dobbloon", false);
                }
                else {
                    this.wrongTimer++;
                    audioHandler.PlaySound("error", false);
                }
            }
        }
        var allMatchesFound = this.cards.every(function (a) { return a.isLocked; });
        if (allMatchesFound) {
            if (this.pairCount < 10)
                this.pairCount++;
            this.DealCards();
        }
        if (this.GetRemainingTicks() == 0) {
            this.SubmitScore(Math.floor(this.score));
        }
    };
    MinigameMatch.prototype.GetRemainingTicks = function () {
        return 60 * 60 - this.timer;
    };
    return MinigameMatch;
}(MinigameBase));
