class BoardCutSceneIntro extends BoardCutSceneSingleAction {
    constructor() {
        super(() => {
            if (!board) return;
            board.currentRound = 0;
            board.players.forEach(a => a.coins = 10);

            let xs = GetEndOfGameTokenLocations();
            let tokenSprites = board.players.map((p, i) => new SimpleSprite(xs[i], 380, tiles["boardTokens"][p.avatarIndex][0]).Scale(0.5));

            let diceSprites = board.players.map((p, i) => new DiceSprite(xs[i], -350, 10, false));

            cutsceneService.AddScene(
                new BoardCutSceneSetBackdrop(tiles["spaceBoardBlur"][0][0]),
                new BoardCutSceneSingleAction(() => { BoardCutScene.sprites.push(...tokenSprites, ...diceSprites) }),
                new BoardCutSceneFadeIn(),
                new BoardCutSceneBoardLogo(),
                // TODO title drop, music cue?
                new BoardCutSceneDialog("Welcome to Rover's Space Base! This lunar level is full of treasures to win amidst the technological wonders up here on the moon. First, let's decide who goes first."),
                new BoardCutSceneDecideOrder(),
                new BoardCutSceneFadeOut(),
                new BoardCutSceneSetBackdrop(null),
            );
        });
    }
}

class BoardCutSceneBoardLogo extends BoardCutScene {
    private timer = 0;
    private y = -400;
    Update(): void {
        this.timer++;

        if (this.timer < 200) {
            this.y *= 0.98;
        } else {
            this.y -= 1;
            this.y *= 1.05;
        }

        if (this.timer > 200) {
            BoardCutScene.sprites.filter(a => !(a instanceof DiceSprite)).forEach(a => {
                a.y -= (a.y - 80) * 0.05;
            })
        }
        if (this.timer > 300) this.isDone = true;
    }
    Draw(camera: Camera): void {
        let logo = tiles["spaceBoardTitle"][0][0] as ImageTile;
        logo.Draw(camera, 0, this.y, 1.5, 1.5, false, false, 0);
    }

}

class BoardCutSceneDecideOrder extends BoardCutScene {
    private timer = 0;
    private jumpTimes = [140, 240, 160, 300];

    private rolls: number[] = []
    private followUp: BoardCutSceneDialog | null = null;

    Update(): void {
        if (this.timer == 0) {
            let possibleRolls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            for (let i = 0; i < 4; i++) {
                let roll = Random.RandFrom(possibleRolls);
                possibleRolls = possibleRolls.filter(a => a != roll);
                this.rolls.push(roll);
            }
        }

        this.timer++;
        let dice = BoardCutScene.sprites.filter(a => a instanceof DiceSprite);
        dice.forEach(a => a.Update());
        if (this.timer < 100) dice.forEach(a => a.y += 2);

        for (let idx = 0; idx < this.jumpTimes.length; idx++) {
            let time = this.jumpTimes[idx];
            let diceSprite = dice[idx] as DiceSprite;
            if (this.timer == time) {
                diceSprite.Stop();
                diceSprite.chosenValue = this.rolls[idx];
            }
        }

        if (this.timer > 360) {
            BoardCutScene.sprites.forEach(a => a.y *= 1.04);
        }
        if (this.timer == 400) {
            this.isDone = true;

            if (board) {
                board.currentRound = 1;
                // set order
                let turn = 1;
                for (let i = 10; i > 0; i--) {
                    let pIndex = this.rolls.indexOf(i);
                    if (pIndex > -1) {
                        board.players[pIndex].turnOrder = turn;
                        turn++;
                    }
                }

                let text = `First is ${board.players[0].avatarName}, second is ${board.players[1].avatarName}, ` +
                    `third is ${board.players[2].avatarName}, and ${board.players[3].avatarName} will go last. ` + 
                    `And to get things going, you'll each start with 10 coins. Good luck!`;

                this.followUp = new BoardCutSceneDialog(text);

            }
        }
    }
    Draw(camera: Camera): void { }
    GetFollowUpCutscenes(): BoardCutScene[] {
        if (this.followUp) return [this.followUp];
        return [];
    }


}