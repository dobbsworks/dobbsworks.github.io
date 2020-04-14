var canvas;
var ctx;
var cols = 4;
var rows = 12;
var requiredRows = 8;
var images = [];
var audios = [];
var playerColumn;
var generatorColumn;
var stackHeight;
var fallingRow;
var score;
var lastUpdate = +(new Date());
var msPerTick;
var loseAnimation = false;
var animationTimer;
var successAnimation = false;
var isMuted = false;
window.onload = Init;
function Init() {
    canvas = (document.getElementById("canvas"));
    ctx = canvas.getContext('2d');
    document.onkeydown = HandleKeyDown;
    document.onkeyup = HandleKeyUp;
    for (var i = 0; i < 8; i++)
        images.push(document.getElementById("img" + i));
    for (var i = 0; i < 2; i++)
        audios.push(document.getElementById("audio" + i));
    Reset();
    Loop();
}
function Reset() {
    playerColumn = 1;
    generatorColumn = 2;
    stackHeight = 1;
    fallingRow = 0;
    score = 0;
    animationTimer = 8;
    msPerTick = 200;
}
function Loop() {
    var now = +(new Date());
    var diff = now - lastUpdate;
    if (diff >= msPerTick) {
        if (loseAnimation) {
            LoseAnimation();
        }
        else if (successAnimation) {
            SuccessAnimation();
        }
        else {
            Update();
        }
        lastUpdate = now;
    }
    Draw();
    requestAnimationFrame(Loop);
}
function Update() {
    fallingRow++;
    if (rows - stackHeight <= fallingRow) {
        if (generatorColumn === playerColumn) {
            // LANDING
            Play(audios[1]);
            score++;
            fallingRow = 0;
            stackHeight++;
            generatorColumn = (1 + generatorColumn + Math.floor(Math.random() * (cols - 1))) % cols;
            if (stackHeight >= requiredRows) {
                msPerTick *= 0.92;
                successAnimation = true;
            }
        }
        else {
            // LOSE
            loseAnimation = true;
        }
    }
}
function SuccessAnimation() {
    stackHeight--;
    score++;
    if (stackHeight === 0)
        successAnimation = false;
}
function LoseAnimation() {
    msPerTick = 200;
    animationTimer--;
    fallingRow *= -1;
    if (animationTimer <= 0) {
        loseAnimation = false;
        Reset();
    }
}
function Draw() {
    ctx.fillStyle = "rgba(135,140,114,1.0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(2, 2);
    for (var i = 0; i < cols; i++) {
        ctx.drawImage(images[0], 100 * i, 290);
        ctx.drawImage(images[1], 100 * i, 0);
        for (var j = rows - 1; j >= 0; j--) {
            ctx.drawImage(images[2], 100 * i + 56, j * 20 + 62);
        }
    }
    DrawNumber(888);
    ctx.drawImage(images[6], 10, 402);
    ctx.drawImage(images[7], 150, 402);
    ctx.translate(-2, -2);
    ctx.fillStyle = "rgba(135,140,114,0.90)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[0], 100 * playerColumn, 290);
    ctx.drawImage(images[1], 100 * generatorColumn, 0);
    for (var j = rows - 1; j >= 0 && stackHeight + j >= rows; j--) {
        ctx.drawImage(images[2], 100 * playerColumn + 56, j * 20 + 62);
    }
    if (fallingRow >= 0)
        ctx.drawImage(images[2], 100 * generatorColumn + 56, fallingRow * 20 + 62);
    else
        Play(audios[0]);
    if (loseAnimation)
        ctx.drawImage(images[6], 10, 402);
    if (successAnimation)
        ctx.drawImage(images[7], 150, 402);
    DrawNumber(score);
}
function DrawNumber(num) {
    var offset = 0;
    for (var place = 1; place <= 100; place *= 10) {
        var digit = Math.floor(num / place) % 10;
        DrawDigit(digit, offset);
        offset -= 35;
    }
}
function DrawDigit(num, offset) {
    var x = 370 + offset;
    var y = 402;
    if ([0, 2, 3, 5, 6, 7, 8, 9].indexOf(num) > -1)
        ctx.drawImage(images[3], x, y);
    if ([0, 4, 5, 6, 8, 9].indexOf(num) > -1)
        ctx.drawImage(images[4], x - 4, y + 4);
    if ([0, 1, 2, 3, 4, 7, 8, 9].indexOf(num) > -1)
        ctx.drawImage(images[4], x + 17, y + 4);
    if ([2, 3, 4, 5, 6, 8, 9].indexOf(num) > -1)
        ctx.drawImage(images[3], x, y + 20);
    if ([0, 2, 6, 8].indexOf(num) > -1)
        ctx.drawImage(images[4], x - 4, y + 24);
    if ([0, 1, 3, 4, 5, 6, 7, 8, 9].indexOf(num) > -1)
        ctx.drawImage(images[4], x + 17, y + 24);
    if ([0, 2, 3, 5, 6, 8, 9].indexOf(num) > -1)
        ctx.drawImage(images[3], x, y + 40);
}
function Play(audio) {
    if (!isMuted)
        audio.play();
}
function Mute() {
    isMuted = !isMuted;
}
function Left() {
    if (loseAnimation || successAnimation)
        return;
    playerColumn--;
    if (playerColumn < 0)
        playerColumn = 0;
}
function Right() {
    if (loseAnimation || successAnimation)
        return;
    playerColumn++;
    if (playerColumn >= cols)
        playerColumn = cols - 1;
}
var keyboardState = {};
function HandleKeyDown(e) {
    e = e || window.event;
    if (!keyboardState[e.keyCode]) {
        if (e.keyCode == 65 || e.keyCode == 37)
            Left();
        if (e.keyCode == 68 || e.keyCode == 39)
            Right();
    }
    keyboardState[e.keyCode] = true;
}
;
function HandleKeyUp(e) {
    e = e || window.event;
    keyboardState[e.keyCode] = false;
}
;
//# sourceMappingURL=app.js.map