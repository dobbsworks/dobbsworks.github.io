
var canvas;
var ctx;
var canvasOver;
var ctxOver;
var images = {};
var sprites = [];
var frameNum = 0;
var frames = 1000 / 60;

var wheelObj = null;
var turnIndex = 0;

function CheckPuzzle(puzzle) {
    let pb = new PuzzleBoard(puzzle);
    let lines = [[],[],[],[]];
    for (let row=0; row<4; row++) {
        for (let col=0; col<14; col++) {
            let tile = pb.tiles.find(a => a.row === row && a.col === col);
            if (tile) lines[row].push(tile.char);
            else lines[row].push(" ");
        }
        console.log(lines[row].join(""))
    }
}


/*
intro sequence
    introduce guests
Regular round
    spin and zoom, then zoom out
    deduct for buy a vowel
    lock in points

Audio
    Jump up, no vocals: https://www.youtube.com/watch?v=C-_a7LP4-yQ
    SMO another world: https://www.youtube.com/watch?v=naiLRCgXG7I
*/


/*
no solving until a certain percentage is revealed?

Haven't you ever seen a pig
Don't look at my games
That's almost a year
Macho Madness
The goose is loose
The Forbidden Sound & Riddle (same name)
The Amiibo of the day
Please do not the cat
Pway my webel stweamer
Gift Sub Sandwich (before & after)
It's like you don't even want a gift
spaaaaace
the sneaky snail
the third one
Wanna become famous?
throwing for content
The rise and fall of germdove
*/

function Initialize() {
    let htmlImages = document.getElementsByTagName("img");
    for (let image of htmlImages) {
        let src = image.src.replace(".png", "");
        image.id = src.split("/")[src.split("/").length - 1];

        let rows = +(image.dataset.rows) || 1;
        let cols = +(image.dataset.cols) || 1;
        images[image.id] = SliceImageToTiles(image.id, rows, cols)
    }
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvasOver = document.getElementById("canvasOver");
    ctxOver = canvasOver.getContext("2d");

    // backgrounds
    
    let bg1 = new StaticImage(images.boardBack, 5, 0, 0);
    let bg2 = new StaticImage(images.wheelBack, 1/0.6, 5000, 0);
    let bg3 = new StaticImage(images.topBack, 1/0.6, 5000, 1600);
    sprites.push(bg1, bg2, bg3);

    wheelObj = new Wheel()
    let wheelSprite = new StaticImage(wheelObj.canvas, 1.5, 0, 250);
    let markerSprites = [0,1,2,3,4,5,6,7,8,9].map(a => new StaticImage(wheelObj.markerCanvas, 1.5, 0, 250 - a * 1))
    let wheelSprites = [wheelSprite, ...markerSprites];
    wheelSprites.forEach(a => {
        a.yScale = 0.2; 
        a.x += 5000;
    });
    let flatWheelSprite = new StaticImage(wheelObj.canvas, 1.5, 5000, 2000);
    let flatWheelMarkers = new StaticImage(wheelObj.markerCanvas, 1.5, 5000, 2000);
    [flatWheelSprite, flatWheelMarkers].forEach(a => {
        a.updateRules.push(() => {
            a.rotation = (-turnIndex + 1) * 7 / 72 * Math.PI * 2;
        })
    })
    sprites.push(...wheelSprites, flatWheelSprite, flatWheelMarkers)
    SetupPlayers()
    setInterval(Loop, frames);
    //SetInterp(camera, { zoom: 0.5 }, 0, 180, "ease-in-out");
    
    //pb = new PuzzleBoard("It's like you don't even want a gift");

    camera1();
}
var pb = null;
var players = [];
function SetupPlayers() {
    players = [
        new Player(0, images.gq),
        new Player(1, images.germdove),
        new Player(2, images.turtle),
    ]
    
}


function Loop() {
    ProcessInterps(frameNum);
    Update();
    Draw();
}

function Update() {
    frameNum++;
    if (pb) pb.Update();
    for (let sprite of sprites) {
        for (let rule of sprite.updateRules) {
            rule.bind(sprite, frameNum)();
        }
        sprite.Update(frameNum);
    }
    sprites = sprites.filter(a => a.isActive);
    players.forEach(a => a.Update());
}

function Draw() {
    ctx.clearRect(0, 0, 9999, 9999);
    ctxOver.clearRect(0, 0, 9999, 9999);
    onBeforeDraw(ctx);
    for (let sprite of sprites) {
        sprite.Draw(ctx, frameNum);
    }
    onAfterDraw(ctx);


    // scores
    let image = document.getElementById("score");
    ctxOver.drawImage(image, 960 - image.width, 0)

    ctxOver.textAlign = "right";
    let x = 850;
    let y = 30;
    for (let player of players) {
        ctxOver.font = "800 16px Verdana";
        ctxOver.fillStyle = "#000E";
        let current = "" + player.currentPoints.toLocaleString()
        ctxOver.fillText(current, x, y);
        ctxOver.font = "800 12px Verdana";
        ctxOver.fillStyle = "#000A";
        let banked = "" + player.bankedPoints.toLocaleString()
        ctxOver.fillText(banked, x + 100, y);

        if (player.playerNum === turnIndex) {
            ctxOver.fillStyle = "#FFFA";
            ctxOver.fillText("->", x - 100 - turnIndex * 10, y - 5);
        }

        y += 20;
        //x -= 10;
    }
}


window.onload = Initialize;


