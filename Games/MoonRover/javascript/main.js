var canvas;
var ctx;
var sprites = [];
setTimeout(Initialize, 100);

function Initialize() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    InitMouseHandlers();
    setInterval(MainLoop, 1000/60);

    for (let i=0; i<10; i++) {
        let newSprite = new Player(Math.random()*500,Math.random()*500);
        newSprite.dx = Math.random()-0.5;
        newSprite.dy = Math.random()-0.5;
        sprites.push(newSprite);
    }

}

function MainLoop() {
    for (let sprite of sprites) {
        sprite.Update();
    }
    UpdateMouseChanged();
    Draw();
}

function Draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    for (let sprite of sprites) {
        sprite.Draw();
    }
}