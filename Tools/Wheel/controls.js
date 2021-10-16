function selectLetter() {
    let input = document.getElementById("letterInput");
    let chosenLetter = input.value[0];
    if (chosenLetter && pb) {
        chosenLetter = chosenLetter.toUpperCase();
        if (pb.guessedChars.indexOf(chosenLetter) > -1) {
            input.value = "";
        }

        let toReveal = pb.tiles.filter(a => a.char === chosenLetter && !a.revealed);
        let button = document.getElementById("revealTiles");
        button.innerHTML = `Reveal ${toReveal.length} ${chosenLetter}'s`;

        let awardButton = document.getElementById("awardPoints");
        let toAward = wheelObj.GetCurrentSlice(turnIndex).value * toReveal.length;
        awardButton.dataset.totalPoints = toAward;
        awardButton.innerHTML = `Award ${toAward}`;
    }
}

function awardPoints() {
    let awardButton = document.getElementById("awardPoints");
    let points = (+awardButton.dataset.totalPoints);
    if (points) {
        players[turnIndex].currentPoints += points;
    }
}

function playerWinRound(playerIndex) {
    players[playerIndex].bankedPoints += +(players[playerIndex].currentPoints)
    for (let player of players) {
        player.currentPoints = 0;
    }
}

function revealLetters() {
    let input = document.getElementById("letterInput");
    let chosenLetter = input.value[0];
    if (chosenLetter && pb) {
        pb.OnGuessChar(chosenLetter.toUpperCase());
        input.value = "";
    }
}

function revealRandom() {
    pb.RevealRandomTile();
}

function solveCorrect() {
    pb.Solve();
}

function spinWheel() {
    if (wheelObj.speed > 0) {
        // return;
    } else {
        wheelObj.targetSpeed = 0.03 + 0.01 * Math.random();
        wheelObj.speedSpinTimer = 60 + 60 * Math.random();
        setTimeout(camera3, 1000)
    }
}

function camera1() {
    interps = [];
    camera.x = 0;
    camera.y = 0;
    camera.zoom = 0.2;
}

function camera2() {
    interps = [];
    camera.x = 5000;
    camera.y = 0;
    camera.zoom = 0.6;
}

function camera3() {
    interps = [];
    camera.x = 5000;
    camera.y = 1600;
    camera.zoom = 0.6;
    SetInterp(camera, { zoom: 0.5, y: -80 }, 0, 240, "ease-in-out");

}

function camera4() {
    interps = [];
    camera.x = 10000;
    camera.y = -100;
    camera.zoom = 1;
}

function camera5() {
    camera4();
    
    SetInterp(camera, { zoom: 1, y: 100 }, 0, 120, "ease-in-out");
}

function camera6() {
    interps = [];
    camera.x = -10000;
    camera.y = -200;
    camera.zoom = 1.5;
}

function setPlayerTurn(index) {
    turnIndex = index;
}

function zoomOnPlayer(index) {
    let frames = +(document.querySelector('input[name="zoomSpeed"]:checked').value);
    let targetZoom = +(document.querySelector('input[name="zoomAmount"]:checked').value);
    interps = [];
    if (frames === 0) {
        fastZoomOnPlayer(index, targetZoom);
    } else {
        let distanceFromScene2 = Math.abs(camera.x - 5000) + Math.abs(camera.y);
        if (distanceFromScene2 > 400) camera2();
    
        let targetX = 5000 + (index - 1) * 350;
    
        SetInterp(camera, { x: targetX - camera.x, zoom: targetZoom - camera.zoom }, 0, frames, "ease-in-out");
    }
}

function fastZoomOnPlayer(index, targetZoom) {
    interps = [];
    let targetX = 5000 + (index - 1) * 350;
    camera.x = targetX;
    camera.y = 0;
    camera.zoom = targetZoom;
}


function setPuzzle() {
    let puzzleText = document.getElementById("puzzleInput").value;
    let categoryText = document.getElementById("categoryInput").value;

    if (pb) {
        pb.boardSprites.forEach(a => a.isActive = false);
    }
    pb = new PuzzleBoard(puzzleText, categoryText);
}


function bankToPlayer(index) {
    let awardAmount = +(document.getElementById("awardValueInput").value);
    document.getElementById("awardValueInput").value = "";
    let roundAwardAmount = +(document.getElementById("awardValueRoundInput").value);
    document.getElementById("awardValueRoundInput").value = "";
    if (awardAmount) {
        players[index].bankedPoints += awardAmount;
    }
    if (roundAwardAmount) {
        players[index].currentPoints += roundAwardAmount;
    }
}

function playSoundControl(soundName) {
    playAudio(soundName);
}

function Emote(playerIndex, emoteName) {
    players[playerIndex].avatar[emoteName]();
}

function ToggleScore() {
    showScore = !showScore;
}