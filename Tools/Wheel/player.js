class Player {
    constructor(playerNum, imageSource) {
        let x = (playerNum - 1) * 350 + 5000;
        this.avatar = null;
        if (imageSource) {
            this.avatar = new Avatar(imageSource, 0.4, x, -50)
        }
        this.playerNum = playerNum;

        let color = ["#FF0000", "#FFFF00", "#0000FF"][playerNum]

        this.podium = new Podium(x, 0, color)
    }
    avatar = null;
    name = "Test";
    bankedPoints = 0;
    currentPoints = 0;


    Update() {
        // logic here for whether to show round total or game total
        let score = 1000;
        this.podium.SetText("$" + score.toLocaleString())
    }
}