let w = null;

var ball = null;

function StartSim() {
    if (scrambleRequested) ScrambleEntries();
    SetText("");
    planck.testbed('Boxes', function(testbed) {
        var pl = planck, Vec2 = pl.Vec2;
        let scale = 4.685; //window.innerHeight/200;
        var world = pl.World(Vec2(0, -10*scale));
        world.setGravity(Vec2(0, -10*scale));


        let pinStats = {userData: 'pin',restitution: 0.6,friction: 0.1};
        let wallStats = {userData: 'wall', density: 0.0, friction: 0, restitution: 0.5 };
        let ballStats = {userData: 'ball',mass : 10,center : Vec2(),I : 1,restitution: 0.5,friction: 0}

        ball = world.createBody().setDynamic();
        ball.createFixture(pl.Circle(scale/3), ballStats);
        ball.setPosition(Vec2(scale*Math.random()-0.5, scale*10));

        var bottom = world.createBody();
        bottom.createFixture(pl.Edge(Vec2(-120, -4*scale), Vec2(120, -4*scale)));

        for (let row = 0; row <= 10; row++) {
            let y = (row-3)*scale;
            let columnCount = 10;
            if (row%2) columnCount += 1;
            for (let col = 0; col <= columnCount; col++) {
                let x = (col-5)*scale;
                if (row%2) x-= scale/2;
                let pin = world.createBody(Vec2(x,y));
                pin.createFixture(pl.Circle(scale/12), pinStats);

                if (row === 0) {
                    let slot = world.createBody(Vec2(x,y-scale));
                    slot.createFixture(pl.Box(scale/12, scale), wallStats);
                }
            }
            
            var leftWall = world.createBody();
            var rightWall = world.createBody();
            if (row%2) {
                leftWall.createFixture(pl.Edge(Vec2(-5*scale, y+scale), Vec2(-5.5*scale,y)));
                rightWall.createFixture(pl.Edge(Vec2(5*scale, y+scale), Vec2(5.5*scale,y)));
            } else {
                leftWall.createFixture(pl.Edge(Vec2(-5*scale, y), Vec2(-5.5*scale,y+scale)));
                rightWall.createFixture(pl.Edge(Vec2(5*scale, y), Vec2(5.5*scale,y+scale)));
            }
            
        }

        w = world;
        return world;
    });
    setInterval(Loop, 20);
}


let users = null;
let scrambleRequested = false;

function Init() {
    var params = new URL(window.location.href).searchParams;
    var source = params.get("source");
    var streamer = params.get("streamer");
    var items = params.get("items");
    if (params.get("scramble")) {
        scrambleRequested = params.get("scramble").toLowerCase() == "true"; 
    }

    if (source === "warpworld") {
        GetUsersFromUrl(`https://api.warp.world/${streamer}/warp_queue`, (res) => {
            users = res.entries.map(x => (x.subbed ? "★" : "") + x.viewerName2.replace(/"/g,''));
        });
    } else if (source === "viewerlevels") {
        GetUsersFromUrl(`https://viewerlevels.com/queue/streamer/${streamer}.txt`, (res) => {
            users = res.queue.map(x => (x.subscriber ? "★" : "") + x.submitter);
        });
    } else if (items) {
        users = JSON.parse(items);
        StartSim();
    } else {
        SetText("Invalid source, url must include one of the following to define user list: <br/> ?source=warpworld&streamer=streamerName <br/> ?source=viewerlevels&streamer=streamerName <br/> ?items=['user1','user2']" );
    }
}


function ScrambleEntries() {
    let newArray = [];
    while (users.length > 0) {
        let randIndex = Math.floor(Math.random() * users.length);
        let el = users.splice(randIndex,1);
        newArray.push(el);
    }
    users = newArray;
}


function GetUsersFromUrl(url, onResponse) {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = () => {
        onResponse(JSON.parse(request.responseText));
        if (users.length) {
            StartSim();
        } else {
            SetText("No users in the queue!")
        }
    }
    request.send();
}



function SetText(text) {
    let div = document.getElementById("text");
    div.innerHTML = text;
}



function Loop() {
    if (!w) return;

    var canvas = document.getElementById("redraw");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.lineWidth = 4;
    ctx.font = "40px Arial"

    for (var b = w.getBodyList(); b; b = b.getNext()) {
        var p = b.getPosition();
        for (var f = b.getFixtureList(); f; f = f.getNext()) {
            var type = f.getType();
            var shape = f.getShape();
            var userData = f.getUserData();
            if (userData === "pin" || userData === "ball") {

                var r = shape.m_radius;
                ctx.beginPath();
                ctx.arc(X(p.x), Y(p.y), R(r), 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            } 
        }
    }

    ctx.lineWidth = 8;
    let winnerIndex = FindWinnerIndex();
    for (let i=0;i<10;i++) {
        ctx.fillStyle = "white";
        if (i===winnerIndex) ctx.fillStyle = "lime";
        let x = 80 + 57*i;
        let userIndex = i % users.length;
        let user = users[userIndex];
        DrawRotatedText(ctx,x,630,Math.PI/2, user);
    }
}

function FindWinnerIndex() {
    let pos = ball.getPosition();
    //if (pos.y > -16) return null;
    let index = Math.floor((pos.x + 20) / 40 * 9 + 0.5);
    return index;
}

function DrawRotatedText(context, x, y, theta, text) { 
    context.save();
    context.translate(x, y);
    context.rotate(theta);
    context.strokeText(text, 0, 0);
    context.fillText(text, 0, 0);
    context.restore();
}

let drawScale = 12;
function X(x) {
    return x * drawScale + 350;
}
function Y(y) {
    return -y * drawScale + 400;
}
function R(r) {
    return r*drawScale;
}





Init();
