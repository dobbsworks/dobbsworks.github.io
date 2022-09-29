function StartScene() {
    //Scene1();
    Scene18();
}


// blur to focus, show flower
function Scene1() {
    let sky = new Rect("rgba(255,235,98,0)", 0, 0, 4000, 4000);
    sprites.push(sky);

    let grassGradient = ctx.createLinearGradient(0, 25, 0, -25);
    grassGradient.addColorStop(0, "#64b87a");
    grassGradient.addColorStop(1, "#92cddb00");
    let grassBack = new Rect(grassGradient, 0, -40, 4000, 50);
    sprites.push(grassBack);
    let grass = new Rect("#64b87a", 0, 50, 4000, 140);
    sprites.push(grass);
    sprites.push(new Ground(0, 500));
    sprites.push(new Ground(-2559, 500));

    let flower = new StaticImage(images.flower, 4, 0, 32);
    sprites.push(flower);

    camera.zoom = 12;
    camera.y = 30;

    let pig = new Pig(40 * 8, 14);
    sprites.push(pig);


    let blur = 20;
    for (let i = 0; i <= blur; i++) {
        setTimeout(() => {
            let bp = blur - i;
            canvas.style.filter = `blur(${bp}px)`;
            if (blur == i) {
                Scene2(pig, flower);
            }
        }, i * 16 * 8);
    }
}

// wait for pig to walk in
function Scene2(pig, flower) {
    if (pig.x <= 0) Scene3(pig, flower);
    else setTimeout(() => { Scene2(pig, flower) }, 16);
}

// crush flower
function Scene3(pig, flower) {
    flower.tileset = images.flower2;
    setTimeout(() => Scene4(pig), 1000);
}

// pig walking through forest, birds in background
function Scene4(pig) {
    camera.focus = pig;
    camera.zoom = 2;
    camera.y = pig.y;
    //camera.speed = 20;
    SetInterp(camera, { zoom: -1 }, 0, 360, "ease-in-out");

    let trees = [0, 1, 2].flatMap(b => [0, 1, 2, 3, 4].flatMap(a => [
        new StaticImage(images.tree2, 3, 100 - a * 300 + b * 1000, -200),
        new StaticImage(images.tree2, 3, 100 - a * 500 + b * 1000, -150),
        new StaticImage(images.tree2, 2.5, 100 - a * 420 + b * 1000, -150),
        new StaticImage(images.tree2, 2, 100 - a * 225 + b * 1000, -200)
    ]));

    trees.sort((a, b) => a.baseY - b.baseY);
    sprites.push(...trees);

    setTimeout(() => { Scene5(pig) }, 7800);
}


// pan across bush, shift focus
function Scene5(pig) {
    let bush = new StaticImage(images.bush, 4, pig.x - 200, pig.y - 20);
    sprites = sprites.filter(a => a != pig);
    sprites.push(bush, pig);
    camera.focus = bush;
    camera.zoom = 4;
    camera.y = pig.y;
    SetInterp(camera, { zoom: 2 }, 0, 240, "ease-in-out");
    setTimeout(() => Scene6(bush), 4000);
}

// dabble pops out, leaf particles
function Scene6(bush) {
    let lurk = new StaticImage(images.lurk, 4, bush.x, bush.y);
    sprites = sprites.filter(a => a != bush);
    sprites.push(lurk, bush);
    camera.focus = lurk;
    lurk.animated = false;
    SetInterp(lurk, { y: -24.5 }, 0, 10, "ease-in-out");

    LeafEffect(lurk.x, lurk.y);

    setTimeout(() => Scene7(lurk), 1000);
}

function LeafEffect(xCenter, yCenter, scale) {
    if (!scale) scale = 4;
    for (let i = 0; i < 10; i++) {
        let x = (Math.random() * 10 - 5) * scale / 4;
        let y = (Math.random() * 5) * scale / 4;
        let leaf1 = new StaticImage(images.leaf, scale, xCenter + x, yCenter + y);
        leaf1.dx = x;
        leaf1.dy = -2.2;
        leaf1.Update = () => {
            leaf1.dy += 0.1;
            leaf1.y += leaf1.dy;
            leaf1.dx *= 0.9;
            leaf1.x += leaf1.dx;
        }
        sprites.push(leaf1);
    }
}

// looks left, right, left, pulls out binoculurs? 
function Scene7(lurk) {
    let stretch = 0.1;
    SetInterp(lurk, { yScale: -stretch, xScale: stretch }, 0, 10, "ease-in-out");
    SetInterp(lurk, { tile: 1 }, 10, 1, "set");
    SetInterp(lurk, { yScale: stretch * 2, xScale: -stretch * 2 }, 10, 10, "ease-in-out");
    SetInterp(lurk, { yScale: -stretch, xScale: stretch }, 20, 10, "ease-in-out");

    let delay = 30;
    SetInterp(lurk, { yScale: -stretch, xScale: stretch }, delay + 0, 10, "ease-in-out");
    SetInterp(lurk, { tile: 0 }, delay + 10, 1, "set");
    SetInterp(lurk, { yScale: stretch * 2, xScale: -stretch * 2 }, delay + 10, 10, "ease-in-out");
    SetInterp(lurk, { yScale: -stretch, xScale: stretch }, delay + 20, 10, "ease-in-out");
    SetInterp(camera, { focus: null }, delay + 30, 1, "set");


    delay += 30;
    SetInterp(lurk, { yScale: stretch, xScale: -stretch }, delay + 0, 10, "ease-in-out");
    SetInterp(lurk, { yScale: -stretch, xScale: stretch, y: 60 }, delay + 10, 10, "ease-in-out");

    delay += 20;
    SetInterp(lurk, { tileset: images.holding }, delay + 0, 10, "set");
    SetInterp(lurk, { yScale: stretch, xScale: -stretch, y: -62 }, delay + 0, 10, "ease-in-out");
    SetInterp(lurk, { yScale: -stretch, xScale: stretch }, delay + 10, 10, "ease-in-out");

    setTimeout(() => { LeafEffect(lurk.x, -6); }, delay * frames);
    delay += 120;

    SetInterp(lurk, { tileset: images.bino }, delay + 0, 10, "set");
    SetInterp(lurk, { yScale: -stretch, xScale: stretch }, delay + 0, 10, "ease-in-out");
    SetInterp(lurk, { yScale: stretch, xScale: -stretch }, delay + 10, 10, "ease-in-out");
    delay += 40;

    setTimeout(() => {
        ClearScene();
        Scene8();
    }, delay * frames);

}


function ClearScene() {
    sprites = [];
    interps = [];
    camera.focus = null;
    camera.x = 0;
    camera.y = 0;
    camera.zoom = 1;
    camera.speed = 100;
}

function Scene8() {
    for (let i = 0; i < 8; i++) {
        let dove = new StaticImage(images.dove, 4, i * 150 - 650, Math.random() * 100 - 50);
        dove.animationOffset += Math.random() * 60;
        dove.updateRules.push(() => {
            dove.x += 3;
        });
        sprites.push(dove);
    }
    let tree = new StaticImage(images.tree2, 18, 0, 900);
    sprites.push(tree);
    let overlay = new StaticImage(images.overlay, 18, 0, 0);
    sprites.push(overlay);

    setTimeout(() => { Smear(Scene9); }, 1600)
}

function Smear(callback) {
    ClearScene();
    let smear = new StaticImage(images.smear, 10, 0, 0);
    smear.animationSpeed = 2;
    sprites.push(smear);
    let overlay = new StaticImage(images.overlay, 18, 0, 0);
    sprites.push(overlay);

    setTimeout(() => {
        ClearScene();
        callback();
    }, 500)
}

function Scene9() {
    let grassBack = new Rect("#64b87a", 0, 0, 4000, 4000);
    sprites.push(grassBack);

    let turtle = new StaticImage(images.turtle, 8, 0, 0);
    sprites.push(turtle);
    turtle.animationSpeed = 0.5;
    turtle.updateRules.push(() => {
        turtle.x += 1;
    });

    let flower = new StaticImage(images.flower, 8, 300, 0);
    sprites.push(flower);

    let kirb = new StaticImage(images.kirb, 8, -300, 0);
    sprites.push(kirb);

    let gq = new StaticImage(images.gq, 8, -180, 110);
    sprites.push(gq);
    gq.updateRules.push((f) => {
        gq.xScale += Math.sin(f / 4) / 100;
        gq.yScale -= Math.sin(f / 4) / 100;
    });

    let overlay = new StaticImage(images.overlay, 18, 0, 0);
    sprites.push(overlay);
    setTimeout(() => { Smear(Scene10); }, 2400)
}

// look at pig smelling flowers
function Scene10() {
    let grassBack = new Rect("#64b87a", 0, 0, 4000, 4000);
    sprites.push(grassBack);

    let pig = new StaticImage(images.pig, 8, 0, 0);
    pig.animated = false;
    sprites.push(pig);
    pig.updateRules.push((frameNum) => {
        if (frameNum % 16 == 0) pig.tile = (pig.tile == 0 ? 3 : 0)
    });

    for (let i = 0; i < 10; i++) {
        let flower = new StaticImage(images.flower, 8, Math.random() * 200 - 300, i * 10)
        sprites.push(flower);
    }

    let overlay = new StaticImage(images.overlay, 18, 0, 0);
    sprites.push(overlay);

    SetInterp(camera, { zoom: 1 }, 60, 30, "ease-in-out");
    SetInterp(overlay, { scale: -overlay.scale / 2 }, 60, 30, "ease-in-out");

    setTimeout(() => {
        ClearScene();
        Scene11();
    }, 3000)
}

// dismiss binoculur overlay, thought bubble appears
// show cutout dabble jump on cutout pig, cutout points appear
// thought bubble breaks into cloud particles
// dabble sinks back into shrub, more leaf particles
function Scene11() {
    //camera.zoom = 0.25;
    let grassBack = new Rect("#64b87a", 0, 0, 4000, 4000);
    sprites.push(grassBack);

    let holding2 = new StaticImage(images.holding2, 24, 0, 0);
    sprites.push(holding2);

    let bush = new StaticImage(images.bush, 24, 0, 180);
    sprites.push(bush);

    let bubble1 = new StaticImage(images.bubble1, 0, -60, -180);
    sprites.push(bubble1);
    let bubble2 = new StaticImage(images.bubble1, 0, -80, -280);
    sprites.push(bubble2);
    let bubble3 = new StaticImage(images.bubble1, 0, -60, -380);
    sprites.push(bubble3);
    let bubble4 = new StaticImage(images.bubble2, 0, 0, -980);
    bubble4.animationSpeed = 0.25;
    sprites.push(bubble4);

    SetInterp(bubble1, { scale: 12 }, 60, 30, "ease-in-out");
    SetInterp(bubble2, { scale: 12 }, 90, 30, "ease-in-out");
    SetInterp(bubble3, { scale: 12 }, 120, 30, "ease-in-out");
    SetInterp(bubble4, { scale: 28 }, 150, 30, "ease-in-out");
    SetInterp(camera, { zoom: -0.6, y: -400 }, 60, 180, "ease-in-out");

    let paperdobbs = new StaticImage(images.paperdobbs, 0, -500, -650);
    let paperpig = new StaticImage(images.paperpig, 0, 300, -650);
    sprites.push(paperpig);
    sprites.push(paperdobbs);
    SetInterp(paperdobbs, { scale: 3 }, 180, 30, "ease-in-out");
    SetInterp(paperpig, { scale: 3 }, 180, 30, "ease-in-out");

    SetInterp(paperdobbs, { x: 800 }, 210, 210, "ease-in-out");
    SetInterp(paperdobbs, { y: -200 }, 210, 30, "ease-in-out");
    SetInterp(paperdobbs, { y: 200 }, 240, 30, "ease-in-out");
    SetInterp(paperdobbs, { y: -200 }, 270, 30, "ease-in-out");
    SetInterp(paperdobbs, { y: 200 }, 300, 30, "ease-in-out");
    SetInterp(paperdobbs, { y: -400 }, 330, 30, "ease-in-out");
    SetInterp(paperdobbs, { y: 200 }, 360, 30, "ease-in-out");
    SetInterp(paperpig, { tileset: images.paperpigflat }, 390, 1, "set");
    SetInterp(paperdobbs, { y: -200 }, 390, 30, "ease-in-out");
    SetInterp(paperdobbs, { y: 400 }, 420, 30, "ease-in-out");
    SetInterp(paperdobbs, { x: -300 }, 390, 60, "ease-in-out");
    SetInterp(paperpig, { tileset: images.paperpoints }, 450, 1, "set");
    SetInterp(paperpig, { y: -200 }, 450, 30, "linear");
    SetInterp(paperdobbs, { tileset: images.paperdobbs2 }, 480, 1, "set");
    SetInterp(paperpig, { x: -300 }, 480, 20, "ease-in-out");

    let delay = 600;
    [bubble1, bubble2, bubble3].forEach(a => {
        SetInterp(a, { scale: -12 }, delay, 20, "ease-in-out");
    });
    [paperpig, paperdobbs, bubble4].forEach(a => {
        SetInterp(a, { scale: -a.scale }, delay, 1, "set");
    });

    for (let i = 0; i < 100; i++) {
        let x = (Math.random() * 2 - 1) * 1200;
        let y = (Math.random() * 2 - 1) * 400 - 750;
        let dx = Math.random() * 2 - 1;
        let dy = Math.random() * 2 - 1;
        let bubble = new StaticImage(images.bubble1, 0, x, y);
        sprites.push(bubble);
        SetInterp(bubble, { scale: 12 * 4 }, delay, 1, "set");
        SetInterp(bubble, { scale: -12 * 4 }, delay + 1, 30, "ease-in-out");
        bubble.updateRules.push(() => {
            if (bubble.scale > 0) {
                bubble.x += dx * 3;
                bubble.y += dy * 3;
            }
        })
    }

    SetInterp(camera, { zoom: 0.6, y: 400 }, delay, 60, "ease-in-out");

    delay += 30;

    let stretch = 0.1;
    SetInterp(holding2, { yScale: stretch, xScale: -stretch }, delay, 10, "ease-in-out");
    SetInterp(holding2, { y: 200 }, delay + 10, 10, "ease-in-out");

    setTimeout(() => {
        LeafEffect(0, 0, 16);
    }, delay * frames);

    setTimeout(() => {
        ClearScene();
        Scene12();
    }, (delay + 60) * frames);
}


// pig walking around again, pauses at flowers
// shadow appears and grows (slide whistle fall sound)
// dabble lands on pig, pig gets squished unceremoniously
// dabble bounces to ground near squished pig
// beat, look left/right near squished pig
function Scene12() {
    //camera.zoom = 0.25;
    let grassBack = new Rect("#64b87a", 0, 0, 4000, 4000);
    sprites.push(grassBack);
    sprites.push(new Ground(0, 500));

    let shadow = new StaticImage(images.shadow, 0, -15, 50);
    shadow.yScale = 0.2;
    sprites.push(shadow);

    let flower = new StaticImage(images.flower, 8, -80, 36);
    sprites.push(flower);

    let starburst = new StaticImage(images.starburst, 0, 0, 0);
    sprites.push(starburst);

    let pig = new StaticImage(images.pig, 8, 0, 0);
    pig.animated = false;
    sprites.push(pig);

    SetInterp(camera, { zoom: 1 }, 20, 400, "ease-in-out");

    SetInterp(pig, { xScale: 0.1, yScale: -0.1 }, 20, 20, "ease-in-out");
    SetInterp(pig, { xScale: -0.2, yScale: 0.2 }, 40, 40, "ease-in-out");
    SetInterp(pig, { tile: 12 }, 60, 1, "set");
    SetInterp(pig, { xScale: 0.1, yScale: -0.1 }, 100, 20, "ease-in-out");
    SetInterp(pig, { tile: 0, tileset: images.shadowpig }, 100, 1, "set");

    SetInterp(shadow, { scale: 5 }, 100, 200, "ease-in-out");

    for (let i = 0; i < 9; i++) {
        setTimeout(() => {
            pig.tile += 1;
        }, (100 + 10) * frames + (i * 10) * frames);
    }
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            if (pig.tile < 10) pig.tile += 10;
            else pig.tile -= 10;
        }, (200 + 10) * frames + (i * 30) * frames);
    }

    let dobbs = new StaticImage(images.dobbs, 8, 0, -400);
    sprites.push(dobbs);
    dobbs.animated = false;
    dobbs.tile = 3;

    let points = new StaticImage(images.points, 1, 0, -400);
    sprites.push(points);

    // 100 points appears
    // zelda treasure hoist, confetti, starburst background
    let delay = 360;
    SetInterp(shadow, { scale: 0 }, delay, 1, "set");
    SetInterp(pig, { tile: 0, tileset: images.pig }, delay, 1, "set");
    SetInterp(camera, { zoom: 1 }, delay, 1, "set");
    SetInterp(dobbs, { y: 320 }, delay, 20, "linear");
    delay += 20;
    SetInterp(pig, { tile: 5 }, delay, 1, "set");
    SetInterp(dobbs, { y: -30 }, delay, 10, "linear");
    SetInterp(dobbs, { y: 130 }, delay + 10, 10, "linear");
    SetInterp(dobbs, { tile: 0 }, delay + 20, 1, "set");
    SetInterp(pig, { scale: 0 }, delay + 20, 1, "set");
    SetInterp(dobbs, { tile: 8 }, delay + 80, 1, "set");
    SetInterp(dobbs, { tile: 0 }, delay + 140, 1, "set");
    SetInterp(dobbs, { tile: 24 }, delay + 200, 1, "set");
    SetInterp(points, { y: -32 }, delay + 200, 1, "set");
    SetInterp(camera, { zoom: 3 }, delay + 200, 40, "ease-in-out");
    SetInterp(starburst, { scale: 4 }, delay + 200, 40, "ease-in-out");
    SetInterp(starburst, { rotation: 0.5 }, delay + 200, 400, "linear");

    // custom snort puff passes quickly over, starburst disappears
    delay += 500;
    let puft = new StaticImage(images.puft, 0, -160, 0);
    puft.animated = false;
    sprites.push(puft);
    SetInterp(puft, { scale: 4 }, delay, 1, "set");
    SetInterp(puft, { x: 120 }, delay, 50, "linear");
    for (let i = 0; i < 5; i++) SetInterp(puft, { tile: i }, delay + 10 + 10 * i, 1, "set");
    delay += 50;
    SetInterp(puft, { scale: 0 }, delay, 1, "set");
    SetInterp(starburst, { scale: 0 }, delay, 1, "set");

    delay += 50;
    setTimeout(Scene13, delay * frames);
}

// slow pan, zoom out, reveal herd of angry pigs
function Scene13() {

    let snouter = new StaticImage(images.snouter, 8, -240, 0);
    snouter.animated = false;
    snouter.tile = 1;
    sprites.push(snouter);

    SetInterp(camera, { zoom: -2, x: -100 }, 0, 40, "ease-in-out");

    let delay = 40;
    for (let i = 0; i < 2; i++) {
        SetInterp(snouter, { scale: 0.3, y: -3 }, delay, 80, "ease-in-out");
        delay += 80;
        SetInterp(snouter, { scale: -0.3, y: 3 }, delay, 80, "ease-in-out");
        delay += 80;
    }
    let puft = new StaticImage(images.puft, 0, -160, 0);
    puft.animated = false;
    sprites.push(puft);
    SetInterp(snouter, { scale: 0.3, y: -3 }, delay, 80, "ease-in-out");
    delay += 120;
    SetInterp(snouter, { scale: -0.3, y: 3 }, delay, 40, "ease-in-out");
    SetInterp(puft, { scale: 4 }, delay, 1, "set");

    let dobbs = sprites.find(a => a.tileset == images.dobbs)
    SetInterp(dobbs, { tile: 12 }, delay - 60, 1, "set");
    SetInterp(puft, { x: 120 }, delay, 50, "linear");
    for (let i = 0; i < 5; i++) SetInterp(puft, { tile: i }, delay + 10 + 10 * i, 1, "set");
    delay += 50;
    SetInterp(puft, { scale: 0 }, delay, 1, "set");

    // crowd of pigs
    let troops = [];
    let xOffset = 0;
    for (let y = -500; y <= 0; y += 50) {
        xOffset = (xOffset == 0) ? 80 : 0;
        for (let x = -550 + xOffset; x > -1400; x -= 160) {
            let posX = x + Math.random() * 80;
            let posY = y + Math.random() * 20;
            let pig = new StaticImage(images.pig, 8, posX, posY);
            pig.scale = 8 * (1 - ((y / -500) * 0.25));
            pig.animated = false;

            let types = ["pig", "snouter", "prickly", "boar", "pig", "snouter", "prickly", "boar", "pig", "snouter", "prickly", "boar", "pig", "snouter", "prickly", "boar", "big"];
            let chosen = types[Math.floor(Math.random() * types.length)];
            if (chosen == "snouter") {
                pig.tileset = images.snouter;
                pig.tile = 1;
            }
            if (chosen == "prickly") {
                pig.tileset = images.snouter;
            }
            if (chosen == "pig") {
                pig.tile = 13;
            }
            if (chosen == "boar") {
                pig.tile = 6;
            }
            if (chosen == "big") {
                pig.tileset = images.bigpig;
                pig.tile = 5;
                pig.x -= 100;
                pig.y -= 20;
            }

            troops.push(pig);
        }
    }

    troops.sort((a, b) => a.baseY - b.baseY);
    sprites.push(...troops);


    SetInterp(camera, { zoom: -1.5, x: -250 }, delay, 120, "ease-in-out");
    setTimeout(Scene14, (delay + 240) * frames);
}


// beat, place 100 points down
function Scene14() {
    let dobbs = sprites.find(a => a.tileset == images.dobbs);
    camera.x = dobbs.x;
    camera.y = dobbs.y;
    camera.zoom = 3;
    let points = sprites.find(a => a.tileset == images.points);
    let delay = 60;
    SetInterp(points, { scale: 0 }, delay, 1, "set");
    SetInterp(dobbs, { tile: 8 }, delay, 1, "set");

    // scoot. scoot. RUN! Pigs surprised, then chase
    for (let i = 0; i < 2; i++) {
        delay += 60;
        SetInterp(dobbs, { xScale: -0.1, yScale: 0.1 }, delay, 30, "ease-in-out");
        delay += 30;
        SetInterp(dobbs, { xScale: 0.2, yScale: -0.2, x: 20 }, delay, 10, "ease-in-out");
        delay += 10;
        SetInterp(dobbs, { xScale: -0.2, yScale: 0.2, x: 20 }, delay, 10, "ease-in-out");
        delay += 10;
        SetInterp(dobbs, { xScale: 0.1, yScale: -0.1 }, delay, 10, "ease-in-out");
    }
    delay += 60;

    setTimeout(() => {
        dobbs.updateRules.push((frameNum) => {
            if (frameNum % 4 == 0) {
                dobbs.tile = (dobbs.tile == 1) ? 2 : 1;
            }
        });
    }, delay * frames);

    delay += 30;
    SetInterp(dobbs, { xScale: 0.1, yScale: -0.1 }, delay, 10, "ease-in-out");
    delay += 10;
    SetInterp(dobbs, { xScale: -0.2, yScale: 0.2, y: -30 }, delay, 10, "ease-in-out");
    delay += 10;
    SetInterp(dobbs, { xScale: 0.1, yScale: -0.1, y: 30 }, delay, 10, "ease-in-out");
    delay += 10;
    SetInterp(dobbs, { x: 400 }, delay, 30, "ease-in-out");

    let pigs = sprites.filter(a => [images.pig, images.bigpig, images.snouter].indexOf(a.tileset) > -1);
    setTimeout(() => {
        for (let pig of pigs) {
            let offset = Math.random() * 8;
            pig.updateRules.push((frameNum) => {
                let f = Math.floor(frameNum + offset);
                if (f % 8 < 4) {
                    pig.y -= 4;
                } else {
                    pig.y += 4;
                }
                pig.x += 6;
            });
        }
    }, delay * frames);

    delay += 60;

    let flower = sprites.find(a => a.tileset == images.flower)
    setTimeout(() => {
        flower.tileset = images.flower2;
    }, delay * frames);

    delay += 60;
    setTimeout(() => {
        ClearScene();
        Scene15();
    }, delay * frames);
}

// hover panic through trees
function Scene15() {
    let grassBack = new Rect("#64b87a", 0, 0, 9000, 4000);
    sprites.push(grassBack);
    sprites.push(new Ground(0, 550));
    sprites.push(new Ground(2559, 550));
    sprites.push(new StaticImage(images.tree2, 8, 0, -400));
    sprites.push(new StaticImage(images.tree2, 8, 600, -500));
    sprites.push(new StaticImage(images.tree2, 8, 800, -400));
    sprites.push(new StaticImage(images.tree2, 8, 1000, -400));
    sprites.push(new StaticImage(images.tree2, 8, 1500, -500));
    sprites.push(new StaticImage(images.tree2, 8, 1800, -400));
    sprites.push(new StaticImage(images.tree2, 8, 2400, -400));
    sprites.push(new StaticImage(images.tree2, 8, 3000, -400));
    sprites.push(new StaticImage(images.tree2, 8, 3600, -500));
    sprites.push(new StaticImage(images.tree2, 8, 3800, -400));

    let panic = new StaticImage(images.panic, 1, -800, 0);
    panic.animationSpeed = 2;
    sprites.push(panic);

    SetInterp(panic, { x: 8000 }, 0, 1200, "linear");
    camera.focus = panic;

    let delay = 60;
    SetInterp(camera, { speed: -50 }, delay, 60, "ease-in-out");
    SetInterp(panic, { y: -20 }, delay, 60, "ease-in-out");
    delay += 60;
    SetInterp(camera, { speed: -35, zoom: 0.5 }, delay, 60, "ease-in-out");
    SetInterp(panic, { y: 20 }, delay, 60, "ease-in-out");
    delay += 60;
    SetInterp(camera, { speed: -10, zoom: 0.25 }, delay, 60, "ease-in-out");
    SetInterp(panic, { y: -20 }, delay, 60, "ease-in-out");
    delay += 60;
    SetInterp(panic, { y: 20 }, delay, 60, "ease-in-out");
    delay += 240;

    sprites.push(new StaticImage(images.tree2, 18, 1200, -370));
    sprites.push(new StaticImage(images.tree2, 18, 2200, -370));

    setTimeout(() => {
        ClearScene();
        Scene16();
    }, delay * frames)
}

// cinematic shot from base of cliff, dabble screeches to halt, pebbles fall down
function Scene16() {
    let cliffsky = new StaticImage(images.cliffsky, 1.15, 0, 0);
    sprites.push(cliffsky);

    let cliffdobbs = new StaticImage(images.cliffdobbs, 1, -200, 0);
    sprites.push(cliffdobbs);
    SetInterp(cliffdobbs, { x: 200, y: -170 }, 0, 60, "ease-in-out");
    SetInterp(cliffdobbs, { x: -10, y: 5 }, 60, 10, "ease-in-out");

    let cliff = new StaticImage(images.cliff, 1.15, 0, 0);
    sprites.push(cliff);

    for (let i=0; i<10; i++) {
        let pebble1 = new Rect("#111", 0 + Math.random() * i * 5, -145, 0, 0);
        sprites.push(pebble1);
        SetInterp(pebble1, { scale: 20 + Math.random() * i, y: 800 }, 60 + i * 4 * Math.random(), 120, "ease-in-out");
    }

    setTimeout(() => {
        ClearScene();
        Scene17();
    }, 140 * frames)
}

function Scene17() {
    let dobbs = new StaticImage(images.dobbs, 70, 0, 150);
    dobbs.animated = false;
    dobbs.tile = 13;
    sprites.push(dobbs);
    
    let delay = 20;
    let stretch = 0.1;
    SetInterp(dobbs, { yScale: -stretch, xScale: stretch }, delay, 10, "ease-in-out");
    SetInterp(dobbs, { tile: 14 }, delay + 10, 1, "set");
    SetInterp(dobbs, { yScale: stretch * 2, xScale: -stretch * 2 }, delay + 10, 10, "ease-in-out");
    SetInterp(dobbs, { yScale: -stretch, xScale: stretch }, delay + 20, 10, "ease-in-out");
    delay += 40;
    SetInterp(dobbs, { yScale: -stretch, xScale: stretch }, delay, 10, "ease-in-out");
    SetInterp(dobbs, { tile: 13 }, delay + 10, 1, "set");
    SetInterp(dobbs, { yScale: stretch * 2, xScale: -stretch * 2 }, delay + 10, 10, "ease-in-out");
    SetInterp(dobbs, { yScale: -stretch, xScale: stretch }, delay + 20, 10, "ease-in-out");
}

// TIME OUT!
// editor view shows pigs/dabble on left of gap. User adds an umbrella above the gap
// TIME IN!


// resume animation mode, umbrella pops into place
// dabble leaps and grabs it, soaring over pit
function Scene18() {
    let dobbs = new StaticImage(images.dobbs, 16, -100, 350);
    dobbs.animated = false;
    dobbs.tile = 27;
    dobbs.dx = 4;
    dobbs.dy = -6.1;
    sprites.push(dobbs);
    
    let umbrella = new StaticImage(images.umbrella, 16, 0, -50);
    sprites.push(umbrella);

    
    SetInterp(umbrella, { y: 50 }, 0, 90, "linear");
    SetInterp(dobbs, { x: 120, y: -184 }, 60, 30, "linear");

    setTimeout(() => {
        dobbs.updateRules.push(() => {
            dobbs.dy += 0.06;
            dobbs.y += dobbs.dy;
            dobbs.x += dobbs.dx;
            umbrella.y += dobbs.dy;
            umbrella.x += dobbs.dx;
        });
    }, 90 * frames);


    let snouter = new StaticImage(images.snouter, 16, -800, 200);
    snouter.animated = false;
    snouter.tile = 1;
    sprites.push(snouter);

    SetInterp(snouter, { x: 800 }, 90, 90, "ease-in-out");
    snouter.updateRules.push((f) => {
        snouter.y += Math.sin(f) * 2;
    });

    setTimeout(() => {
        ClearScene();
        Scene19();
    }, 210 * frames)
}

// angry pigs stuck at edge of cliff
function Scene19() {
    let sunset = new StaticImage(images.sunset, 1, 0, 0);
    let sunsetground = new StaticImage(images.sunsetground, 1, 0, 0);
    let sunsetpigs = new StaticImage(images.sunsetpigs, 1, 0, 0);
    let sunsettrees = new StaticImage(images.sunsettrees, 1, 0, 0);
    let sunsetballoon = new StaticImage(images.sunsetballoon, 1, 300, 0);
    let sunsetdobbs = new StaticImage(images.sunsetdobbs, 1, 0, 0);
    sprites.push(sunset, sunsetground, sunsetpigs, sunsettrees, sunsetballoon, sunsetdobbs);

    sunsetpigs.updateRules.push((f) => {
        sunsetpigs.y += Math.sin(f/2) * .5;
    });
    sunsetdobbs.updateRules.push((f) => {
        sunsetdobbs.y += Math.sin(f / 20) * .2;
    });

    SetInterp(sunsetballoon, { x: -120, scale: 0.2 }, 0, 600, "linear");
    SetInterp(sunsetpigs, { scale: 1, y: 200 }, 0, 600, "linear");
    SetInterp(sunsettrees, { scale: 1, y: 20 }, 0, 600, "linear");
    SetInterp(sunsetground, { scale: 1, y: 20 }, 0, 600, "linear");
    SetInterp(sunset, { scale: 0.1, y: 0 }, 0, 600, "linear");

    setTimeout(() => {
        ClearScene();
        Scene20();
    }, 300 * frames);
}

// close shot on dabble with umbrella, bumps into balloon basket
function Scene20() {
    let sunset = new StaticImage(images.sunset, 2, 0, 0);
    let hc = new StaticImage(images.hc1, 3, 30, -480);
    let sunsetballoon = new StaticImage(images.balloon2, 12, 800, -1200);
    let sunsetdobbs = new StaticImage(images.sunsetdobbs, 3, -620, 0);
    let rope = new StaticImage(images.rope, 12, 0, -600);
    sprites.push(sunset, hc, sunsetballoon, sunsetdobbs, rope);

    SetInterp(sunsetdobbs, { x: 500 }, 0, 300, "linear");
    SetInterp(sunsetballoon, { x: -700 }, 0, 300, "linear");
    sunsetdobbs.updateRules.push((f) => {
        sunsetdobbs.y += Math.sin(f / 20) * .3;
    });
    SetInterp(sunsetdobbs, { xScale: -0.05, yScale: 0.05 }, 300, 5, "linear");
    SetInterp(sunsetdobbs, { xScale: 0.05, yScale: -0.05 }, 305, 5, "linear");
    SetInterp(rope, { y: 458 }, 335, 20, "ease-in-out");

    SetInterp(sunsetdobbs, { y: 400 }, 400, 100, "ease-in-out");
    SetInterp(sunsetballoon, { y: 400 }, 400, 100, "ease-in-out");
    SetInterp(rope, { y: 400 }, 400, 100, "ease-in-out");
    SetInterp(hc, { y: 400 }, 400, 100, "ease-in-out");


    setTimeout(() => {
        ClearScene();
        Scene21();
    }, 540 * frames)
}

// hover cat helps dabble in
// dabble pulls out 100 points, gives to hover cat
function Scene21() {
    let sunset = new StaticImage(images.sunset, 3, 0, 200);
    let subsetblue = new Rect("#0000FF44", 0, 0, 9000, 4000);
    let dobbsjump = new StaticImage(images.dobbs, 16, -120, 800);
    dobbsjump.animated = false;
    dobbsjump.tile = 3;
    let dobbs = new StaticImage(images.dobbs, 0, -120, 0);
    dobbs.animated = false;
    dobbs.tile = 3;
    let hc = new StaticImage(images.dobbs, 16, 120, 100);
    hc.animated = false;
    hc.tile = 10;
    
    let rope = new StaticImage(images.rope, 12, -120, 410);
    let points = new StaticImage(images.points, 0, -120, -10);

    let sunsetballoon = new StaticImage(images.balloon2, 16, 0, -900);
    sprites.push(sunset, subsetblue, dobbs, hc, points, sunsetballoon, rope, dobbsjump);

    SetInterp(dobbsjump, { y: -800 }, 0, 60, "ease-in-out");
    SetInterp(dobbsjump, { scale: 0 }, 60, 1, "set");
    SetInterp(dobbs, { scale: 16 }, 60, 1, "set");
    SetInterp(dobbs, { y: 100 }, 60, 20, "ease-in-out");
    SetInterp(dobbs, { tile: 0 }, 80, 1, "set");
    SetInterp(dobbs, { xScale: -0.1, yScale: 0.1 }, 120, 10, "ease-in-out");
    SetInterp(dobbs, { xScale: 0.1, yScale: -0.1, y: 300 }, 130, 10, "ease-in-out");
    SetInterp(dobbs, { xScale: 0.1, yScale: -0.1, y: -300 }, 160, 10, "ease-in-out");
    SetInterp(dobbs, { xScale: -0.1, yScale: 0.1 }, 170, 10, "ease-in-out");
    SetInterp(dobbs, { tile: 24 }, 200, 1, "set");
    SetInterp(dobbs, { xScale: -0.1, yScale: 0.1 }, 200, 10, "ease-in-out");
    SetInterp(dobbs, { xScale: 0.1, yScale: -0.1}, 210, 10, "ease-in-out");
    SetInterp(points, { scale: 2 }, 200, 1, "set");
    SetInterp(hc, { tile: 28 }, 280, 1, "set");
    SetInterp(hc, { xScale: -0.1, yScale: 0.1 }, 280, 10, "ease-in-out");
    SetInterp(hc, { xScale: 0.1, yScale: -0.1 }, 290, 10, "ease-in-out");

    setTimeout( () => {
        ClearScene();
        Scene22();
    }, 320 * frames);
}


function Scene22() {
    let sunset = new StaticImage(images.sunset, 1, 0, 0);
    let sunsetballoon = new StaticImage(images.sunsetballoon, 0.5, 300, 30);
    let subsetblue = new Rect("#0000FF11", 0, 0, 9000, 4000);
    sprites.push(sunset, sunsetballoon, subsetblue);
    sunsetballoon.updateRules.push((f) => {
        sunsetballoon.y += Math.sin(f / 60) * .1;
        sunsetballoon.x += 0.2;
    });
    
    let the = new StaticText("THE", 120, "white", "black", -1140, 0);
    let end = new StaticText("END", 120, "white", "black", 1140, 0);
    sprites.push(the, end)
    SetInterp(the, { x: 1000 }, 100, 100, "ease-in-out");
    SetInterp(end, { x: -1000 }, 100, 100, "ease-in-out");

}


// 0.12.0;12;0;0;6|#00dddd,#eeeeff,0.00,1.00,0.40;AA,#ffffff,-0.25,0,0.05,0,0,0;AI,#1818e5,0,0,0.1,-10,1,0;AI,#1818e5,-0.25,0,0.2,-10,1,0;AD,#10a010,0,0,0.3,0,1,0|AA/AA/AA/AAv|AA/AA/AA/AAv|AAIABCAAIABCAAIABCAAIABCAAIABCAAIABCAAIABCAAIABCAAIABCAAIABCAAIABCAA/AAr|AAIABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAAKABAAA/AAt|AA/AA/AA/AAv|AAAKAI;ABA3AI;AFABAH;A4AFAI;AJAHAI;AEADAI;AEAFAH;AEAAAI;AKADAH



// ending card https://www.beepbox.co/#9n31sbk0l00e03t1Da7g0fj07r0i0o432T1v3ue1f0q0y10n73d4aA0F0B7Q0000Pe600E2bb619T1v1u30f0qwx10r511d08A9F4B0Q19e4Pb631E3b7626637T1v1u30f0qwx10r511d08A9F4B0Q19e4Pb631E3b7626637T4v1uf0f0q011z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b4x800000000i4M000000018i0000000000000000000p21PFKDUiegig5dfAEuh7Fw1XxQPYp8ZgZo-Uf83QR3M0-hAzR3O8-Afofjmf0zV683O8ZoUaq_Fn9kOQ98QVdrtjbllQwkPD2uwuywDE7EE9W1Wa2uwuw0
// https://www.beepbox.co/#8n31sbk0l00e0jt2wm0a7g0oj07i0r1o3210T0v2L4u12q1d1f7y1z1C0w2c0h2T0v0L4u11q0d0f8y0z1C2w1c0h0T0v1L4u10q0d0f8y0z1C2w2c0h0T2v2L4u15q0d1f8y0z1C2w0b4z9000000z91k00000004xc0018j1000018Ocz8Ocz8Ock00000h4h4h8ych4g00000p25XFBQHGo6KCC1wqqo2-CCKGOC2IIFwF6hFwp2hFwqqfj8V0zFI8QR-3AkAth7mhV4zA2eCEzM38F8WieQzRAtx7johU3AnAtF7mhSrQs4Iidd7P3O97ohGufbF02FE-yeAzJbVuPq_kBeU1IAtp7onTjZfH_SeUbTjTW_8pIzIBZlir5ns6MIDjyb05cK8bgbkbgb0yQ2M8J0JoJ0JoJ0I0bgb02Q2XNq1q1q1q1q1q1q1qhq1q1q1q1q1q1q1tMJ0J0J0J0J0J0J0JEJ0J0J0J0J0J0J0JjteKDf2PhD1FEOc-syzaCGszaD8OFOacGqFOaqYELGduCALQBZ9uPnBlhbCzaCCqcCqpFA9uEBl9B52ylahhhhhhgERiCO
// new years https://www.beepbox.co/#9n51sbk0l00e0jt2wa7g0oj08r0i0o44234T1v2ub5f0q0x10o51d23A5F4B6Q0001PecaaE4b262963979T1v0ub4f20o72laqw131d23A5F4B3Q0001Pfca8E362963479T5v1u51f0qwx10n511d08H-IHyiih9999998h0E1b6T1v4u97f0q0z10t231d4aA9F3B6Q5428Paa74E3ba63975T5v1uc9f10j5q011d23HXQRRJJHJAAArq8h0E0T4v2uf0f0q011z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b4z97w6000z99k0001mu04x002h8j1000018Ocz8Ocz8Ock00000i4x8i4x8000c000018ik0oQdN8iyg00004h4h4i8z4h400000p2bPFDQwZRgYx1zOdMYzgfrkfn13Oc4ftpF__3TazRSPfVxePnUepcXtzRofkyfGh3RufnupxfE6pcXq8ZtzM63WK3TufnupxfEvVcWxwYzUZnzSrQs5RtfQ-LSxzW1uWu_n-jp7fbQQ-O9D-DB-rBmrfZju22rdfToXdvxRMzL2275TrI5ADjfOCDNYh9X2tjLDQw1YEDF9Xi-nISLR9vK0r9fmjS5ZQ_jW_qCcKwnKDLR_ASgSi-GAENlT1Ib9QUyMjnjfWfhkf1IPUyEZcQijSjof03T3M8Y4fpHYxn7BYWtdfMoZ0YzUZO9VLbWxYQuALwxU4DwrNRc_LUCCn42Q2R2Q2M8J0I2bgbmbgbmbgb02Q2M0J0Jd7-3j7M7A1V0ug7A1V0ug7AxV0ug7A1V0ug7A1V0ve1V0ug7A1V0ug7A1V0uq7A1V0ug7A1V0ug7A1RdQWWsY2VKDU3F8x0V3KitS0FFYcCvD0sEDwcP0sAuEuKEvdV74yv9ctjLDNg1Wp7jnUn22qvH4pHFI_j7AhQR_YBFkQFF-ASfwrdmTOze_TZhN3kuYPY1M3cPsX0d0efOyRcvk3jjjjjjjjjiCR-jnViWCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCPtelgWuVD0gc4WpOxWa2v8GxYH8Gyva7EE9YyGOqGqYi5Y4qZd9vSHMjXgZ51fAlg-lAlhfB3Qk4-hlpdgiZhaGjGa54GkyyyyyyxhGBbA