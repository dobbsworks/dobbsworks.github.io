var effects = {
    colorBlind: false,
    unity: false
}
function ColorBlind(duration) {
    sprites.push(new TextBubble(200, 100, "Darkness!", true, 80));
    effects.colorBlind = true;
    setTimeout(function () { effects.colorBlind = false; }, duration);
}
function Scramble() {
    sprites.push(new TextBubble(200, 100, "Scramble!", true, 80));
    for (var i = 0; i < lanes.length; i++) {
        lanes[i].catcher.randomShape();
        lanes[i].catcher.initialShape = lanes[i].catcher.shape;
    }
}

function Unity(duration) {
    sprites.push(new TextBubble(200, 100, "Unity!", true, 80));
    effects.unity = true;
    setTimeout(function () { effects.unity = false; }, duration);
}
function Reorder() {
    sprites.push(new TextBubble(200, 100, "Sort!", true, 80));
    for (var i = 0; i < lanes.length; i++) {
        lanes[i].catcher.shape = shapeChoices[i % level.numChoices];
        lanes[i].catcher.initialShape = lanes[i].catcher.shape;
    }
}
function Sizeup() {
    sprites.push(new TextBubble(200, 100, "Size Up!", true, 80));
    scorer.radius + 10;
    scorer.radius *= 1.2;
}