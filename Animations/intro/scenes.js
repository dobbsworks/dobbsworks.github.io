

function Temp() {
    let skyGradient = ctx.createLinearGradient(0, 1200, 0, -800);
    skyGradient.addColorStop(0.00, "rgba(255,235,98,0)");
    skyGradient.addColorStop(0.12, "rgba(255,235,98,1)");
    skyGradient.addColorStop(0.20, "rgba(255,146,103,1)");
    skyGradient.addColorStop(0.35, "rgba(255,97,97,1)");
    skyGradient.addColorStop(0.60, "rgba(22,39,97,1)");
    skyGradient.addColorStop(0.80, "rgba(11,20,50,1)");
    //skyGradient.addColorStop(0.90, "rgba(0,0,0,1)");
    let sky = new Rect(skyGradient, 0, 150 - 2400, 2800, 4800)
    sprites.push(sky);
    SetInterp(sky, { y: 3600 }, 0, 150, "linear");
    
    let swapDelayFrame = 310;
    for (let i=0; i< 2000; i++) {
        let x = ((Math.random() - 0.5) * 2) * 226;
        let y = ((Math.random() - 0.5) * 2) * 122;
        let dx = (x > 0 ? 1 : -1) * Math.random() * 3;
        let panel = new Rect("#FFFFFF", x, y - 1000, 4, 4);
        panel.dy = (Math.random() * 5 - 3);
        sprites.push(panel);
        SetInterp(panel, { y: 1000 }, swapDelayFrame + 120, 1, "linear");
        panel.Update = () => {
            if (panel.y > -500) {
                panel.y += panel.dy;
                panel.x += dx;
                panel.dy += 0.05;
            }
        }
    }


    let skyGear = new StaticImage(images.gears, 6, 0, 400);
    SetInterp(skyGear, { y: -800 }, 0, 150, "linear");
    skyGear.animationSpeed = 11.7 / 3;
    sprites.push(skyGear);

    let logoNoGearBlack = new StaticImage(images.logonogearblack, 4, 0, -400);
    SetInterp(logoNoGearBlack, { y: 400 }, 160, 40, "ease-in-out");
    sprites.push(logoNoGearBlack);

    
    let logoGear = new StaticImage(images.logogear, 4, -55, -400 + 33);
    logoGear.animated = false
    SetInterp(logoGear, { y: 400 }, 190, 120, "ease-in-out");
    sprites.push(logoGear);

    let logo = new StaticImage(images.dwlogo, 4, 0, -400);
    sprites.push(logo);

    SetInterp(logoNoGearBlack, { y: -10000 }, swapDelayFrame, 1, "set");
    SetInterp(logoGear, { y: -10000 }, swapDelayFrame, 1, "set");
    SetInterp(logo, { y: 0 }, swapDelayFrame, 1, "set");



}




// Player 1 start
function Scene1() {
    let song = document.getElementById("theme");
    song.volume = 1;
    song.play();

    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 8; j++) {
            let x = (i - 6) * 100;
            let y = -(j - 4) * 100;
            let panel = new Rect("#000000", x, y, 100, 100);
            sprites.push(panel);
            let delay = 120 + ((j * 10) + (j % 2 ? i : (12 - i))) * 0.5;
            SetInterp(panel, { y: 1000, x: 0, xScale: -100 }, delay, 45, "ease-in-out");
            panel.Update = () => {
                if (panel.y > 600) panel.isActive = false;
            }
        }
    }
    var lifeCount = [
        new StaticImage(images.dobbshead, 2, -100, 0),
        new StaticText("x", 50, "white", "black", 0, 0),
        new StaticText("03", 50, "white", "black", 100, 0)
    ];
    sprites.push(...lifeCount);
    lifeCount.forEach(a => {
        SetInterp(a, { scale: 1, rotation: 0.2 }, 90, 30, "ease-in-out");
        SetInterp(a, { scale: 1, rotation: -0.4 }, 120, 30, "ease-in-out");
        SetInterp(a, { y: -1000, x: 0, scale: 20, rotation: 1 }, 150, 30, "ease-in-out");
        a.Update = () => {
            if (a.y < - 600) a.isActive = false;
        }
    });
    setTimeout(Scene2, 2200);
}

// dobbs run, jump, grab coins 
function Scene2() {
    let grassGradient = ctx.createLinearGradient(0, 25, 0, -25);
    grassGradient.addColorStop(0, "#64b87a");
    grassGradient.addColorStop(1, "#92cddb00");

    let terrain = [];
    for (let i = 0; i < 10; i++) {
        terrain.push(new StaticImage(images.flower, 4, 200 + Math.random() * 400, -150 - Math.random() * 50))
    }

    let trees = [0, 1, 2].flatMap(b => [0, 1, 2].flatMap(a => [
        new StaticImage(images.tree, 3, 500 - a * 300 + b * 1000, -200),
        new StaticImage(images.tree, 3, 700 - a * 500 + b * 1000, -150),
        new StaticImage(images.tree, 2.5, 700 - a * 400 + b * 1000, -150),
        new StaticImage(images.tree, 2, 300 - a * 250 + b * 1000, -200)
    ]));

    trees.sort((a, b) => a.baseY - b.baseY);
    terrain.push(...trees)

    let dobbs = new Dobbs(0, 0);
    let dobbsname = new StaticText("Dobbs", 50, "white", "black", 1250, 40);
    SetInterp(dobbsname, { x: -1050 }, 90, 45, "ease-in-out");
    SetInterp(dobbsname, { x: -1950 }, 240, 45, "ease-in-out");
    let coins = [0, 1, 2].map(x => new Dobbloon(1000 + x * 100, -180));
    let initialS2s = [
        new Rect(grassGradient, 0, -40, 1800, 50),
        new Rect("#64b87a", 0, 50, 1800, 140),
        ...terrain,
        new Ground(0, 500),
        dobbs,
        dobbsname,
        ...coins,
    ];
    sprites.push(...initialS2s);
    initialS2s.forEach(a => {
        a.y += 1000;
        SetInterp(a, { y: -1000, x: 0 }, 0, 45, "ease-in-out");
    })
    terrain.forEach(a => {
        a.Update = () => {
            let deltaY = (dobbs.baseY - a.baseY);
            a.x -= 4 / (deltaY / 150) * 0.5;
            if (a.x < -1000) a.isActive = false;
        }
    })
    setTimeout(() => { camera.focus = dobbs; }, 45 * frames)
    setTimeout(() => { dobbs.Jump(); }, 210 * frames)

    for (let coinIndex of [0, 1]) {
        setTimeout(() => {
            coins[coinIndex].isActive = false;
            let points = new StaticImage(images.points, 1, coins[coinIndex].x, coins[coinIndex].y);
            points.Update = () => {
                points.x -= 4;
                points.y -= 0.2;
                //points.scale *= 0.99;
                if (points.x < -1000) points.isActive = false;
            }
            sprites.push(points);

        }, (220 + 30 * coinIndex) * frames)
    }

    SetInterp(camera, { zoom: 0.5 }, 90, 120, "ease-in-out");
    SetInterp(camera, { zoom: -0.5 }, 210, 60, "ease-in-out");

    setTimeout(Scene3, 4200);
}

// others in background
function Scene3() {
    var cameos = [
    //    new StaticImage(images.tank, 10, -600, -100),
        new StaticImage(images.al, 12, -850, -80),
        new StaticImage(images.gq, 6, -650, 20),
        new StaticImage(images.kirb, 6, -750, 20),
        new StaticImage(images.turtle, 6, -800, 80),
        new StaticImage(images.snek, 6, -700, 80),
        new StaticImage(images.dove, 3, -700, -100),
        new StaticImage(images.doopu, 6, -850, 20),
    ];
    sprites.push(...cameos);
    cameos.forEach(a => {
        SetInterp(a, { x: 400 }, 60, 120, "ease-in-out");
        let offset = Math.random() * 50;
        a.updateRules.push((frameNum) => {
            a.x += Math.cos((frameNum + offset) / 30);
            if (a.x > 1000) a.isActive = false;
        })
    });

    for (let i = 0; i < cameos.length; i++) {
        setTimeout(() => { camera.focus = cameos[i]; }, (i + 1) * 45 * frames)
    }

    SetInterp(camera, { zoom: 0.2 }, 50, 120, "ease-in-out");

    let chargeTime = (cameos.length + 1) * 45 * frames;
    setTimeout(() => {
        camera.focus = null;
        SetInterp(camera, { zoom: -0.2, x: -camera.x, y: -camera.y }, 0, 30, "ease-in-out");

        cameos.forEach(a => {
            SetInterp(a, { x: 1200 }, 0, 120, "ease-in-out");
        });
    }, chargeTime)

    let flyTime = chargeTime + 30 * frames;
    setTimeout(() => {
        let dobbs = sprites.find(a => a instanceof Dobbs);
        dobbs.Fly();
    }, flyTime);

    setTimeout(Scene4, flyTime + 60 * frames);
}

// balloon
function Scene4() {
    let song = document.getElementById("theme");
    if (song.currentTime === 0) {
        song.volume = 0.2;
        song.currentTime = 13.86;
        song.play();
    }

    sprites.forEach(a => {
        SetInterp(a, { y: 800 }, 0, 60, "ease-in-out");
        SetInterp(a, { isActive: false }, 60, 1, "set");
    });
    let skyGradient = ctx.createLinearGradient(0, 400, 0, -400);

    skyGradient.addColorStop(0.00, "rgba(255,235,98,0)");
    skyGradient.addColorStop(0.52, "rgba(255,235,98,1)");
    skyGradient.addColorStop(0.66, "rgba(255,146,103,1)");
    skyGradient.addColorStop(0.75, "rgba(255,97,97,1)");
    skyGradient.addColorStop(1.00, "rgba(22,39,97,1)");
    let sky = new Rect(skyGradient, 0, 150 - 2400, 1800, 1200)
    sprites.push(sky);
    SetInterp(sky, { y: 2400 }, 0, 60, "ease-in-out");


    let hills = new StaticImage(images.smwhills, 1, 800, 150);
    SetInterp(hills, { x: -2400 }, 60, 600, "linear");
    sprites.push(hills)

    let mountain = new StaticImage(images.mountain, 2, 800, 250);
    SetInterp(mountain, { x: -2400 }, 0, 400, "linear");
    sprites.push(mountain)
    let flag = new StaticImage(images.flag, 1, 797, 135);
    SetInterp(flag, { x: -2400 }, 0, 400, "linear");
    sprites.push(flag)



    let balloon = new StaticImage(images.balloon, 6, -200, 0);
    balloon.animated = false;
    let hovercat = new StaticImage(images.dobbs, 6, -197, 90);
    hovercat.tile = 4;
    hovercat.animated = false;
    let hovercatname = new StaticText("Hover Cat", 70, "white", "black", 1200, 100);
    SetInterp(hovercatname, { x: -1050 }, 90, 45, "ease-in-out");
    SetInterp(hovercatname, { x: -1950 }, 240, 45, "ease-in-out");
    sprites.push(hovercatname);
    let basket = new StaticImage(images.basket, 6, -200, 120);
    hovercat.updateRules.push((frameNum) => {
        if (frameNum % 120 === 0) {
            if (hovercat.tile == 4) hovercat.tile = 10;
            else hovercat.tile = 4;
        }
    })

    for (let i = 0; i < 40; i++) {
        let cloud = new StaticImage(images.cloud, 4 + Math.random() * 8,
            1200 + Math.random() * 600,
            -200 + Math.random() * 400);
        sprites.push(cloud)
        SetInterp(cloud, { x: -3600 }, 0, 480 + Math.random() * 480, "ease-in-out");
        SetInterp(cloud, { isActive: false }, 1200, 1, "set");
    }

    let balloonSet = [balloon, hovercat, basket];
    balloonSet.forEach(a => {
        a.updateRules.push((frameNum) => {
            a.y += Math.cos(frameNum / 50);
        })
        a.y += 400;
        SetInterp(a, { y: -400 }, 0, 60, "ease-in-out");
    });
    camera.focus = hovercat;
    SetInterp(camera, { x: 400 }, 0, 240, "ease-in-out");
    sprites.push(...balloonSet)
    SetInterp(camera, { zoom: 0.5 }, 120, 240, "ease-in-out");
    SetInterp(camera, { zoom: -0.5 }, 360, 120, "ease-in-out");


    for (let i = 0; i < 9; i++) {
        let pos = Math.ceil(i / 2);
        let sign = i % 2 ? -0.4 : 1;
        let dove = new StaticImage(images.dove, 3, -1200 - pos * 60, 120 + (pos * 20) * sign);
        dove.animationOffset += Math.random() * 60;
        SetInterp(dove, { x: 800 }, 0, 240, "ease-in-out");
        SetInterp(dove, { x: 1200 }, 360, 240, "ease-in-out");
        sprites.push(dove)
    }

    let flyingDobbs = new StaticImage(images.dobbs, 6, -600, 1200);
    flyingDobbs.animated = false;
    flyingDobbs.tile = 11;
    SetInterp(flyingDobbs, { y: -1600, rotation: 10, x: 200 }, 360, 120, "linear");
    SetInterp(flyingDobbs, { isActive: false }, 480, 1, "set");
    sprites.push(flyingDobbs);

    setTimeout(() => {
        Scene5(hovercat, balloon, basket)
    }, 480 * frames);
}

// fire, panic
function Scene5(hovercat, balloon, basket) {
    let impactTime = 30;
    let fallingDobbs = new StaticImage(images.dobbs, 6, -300, -300);
    fallingDobbs.animated = false;
    fallingDobbs.tile = 11;
    SetInterp(fallingDobbs, { y: 200, rotation: 10, x: 100 }, 0, impactTime, "linear");
    SetInterp(fallingDobbs, { isActive: false }, impactTime, 1, "set");
    SetInterp(hovercat, { isActive: false }, impactTime, 1, "set");
    sprites.push(fallingDobbs);

    setTimeout(() => {
        let panic = new StaticImage(images.hoverpanic, 0.4, hovercat.x, hovercat.y - 5);
        balloon.updateRules = [];
        balloon.tile = 1;
        basket.updateRules = [];
        panic.animationSpeed *= 0.1;
        panic.updateRules.push((frameNum) => {
            panic.y -= Math.sin(frameNum / 4);
        })
        camera.focus = panic;
        sprites.push(panic);
        sprites = sprites.filter(a => a != basket); // move to front
        sprites.push(basket);
        SetInterp(camera, { zoom: 0.5 }, 0, 60, "ease-in-out");

        Scene6(panic, balloon, basket);
    }, impactTime * frames);

}

//rocket
function Scene6(panic, balloon, basket) {
    camera.focus = null;
    SetInterp(camera, { y: 42 - camera.y }, 0, 30, "ease-in-out");
    let impactTime = 250 * frames;
    setTimeout(() => {
        panic.isActive = false;
        basket.isActive = false;
        SetInterp(balloon, { x: 1000, y: -200, rotation: 30, scale: 24 }, 0, 120, "linear");
        SetInterp(balloon, { x: 2000, y: -200, scale: -24 }, 60, 20, "linear");
    }, impactTime)

    let panelBorder = new Rect("black", 1500, 0, 1000, 1000);
    SetInterp(panelBorder, { x: -1100 }, 0, 30, "ease-in-out");
    SetInterp(camera, { x: 200 }, 0, 30, "ease-in-out");

    let comicPanel1 = new StaticImage(images.dogbg, 1, 40, -47);
    let rover = new StaticImage(images.rover, 2, 40, -24);
    let roverwink = new StaticImage(images.roverwink, 2, 40, -44);
    roverwink.animationSpeed = 0.04;
    roverwink.animationOffset = 80;
    let panel1 = [comicPanel1, rover, roverwink];
    panel1.forEach(a => {
        a.y -= 500;
        SetInterp(a, { y: 500 }, 30, 30, "ease-in-out");
    })

    let comicPanel2 = new StaticImage(images.dogpanel, 1, 40, 122);
    let paw = new StaticImage(images.paw, 4, 44, 162);
    paw.y += 150;
    SetInterp(paw, { y: -150 }, 135, 15, "ease-in-out");
    let panel2 = [comicPanel2, paw];
    panel2.forEach(a => {
        a.y += 500;
        SetInterp(a, { y: -500 }, 90, 30, "ease-in-out");
    })

    let comicPanel3 = new Rect("#92cddb", 250, 37, 148, 320);
    let ground = new Rect("#64b87a", 250, 167, 148, 60);
    let readyShip = new StaticImage(images.ship1, 0.2, 250, 100);
    readyShip.rotation = -Math.PI / 2;
    readyShip.updateRules.push((frameNum) => {
        readyShip.x += (frameNum % 2 ? -3 : 3);

        if (readyShip.y < 100 && readyShip.y > -600) {
            let smoke = new StaticImage(images.explosion, 2, readyShip.x, readyShip.y + 50);

            let dx = (Math.random() - 0.5) * 3;
            let dy = (Math.random() - 0.5) * 3;
            smoke.updateRules.push((frameNumSmoke) => {
                smoke.scale += 0.03;
                smoke.x += dx + 2;
                smoke.y += dy;
            })
            sprites.push(smoke);
        }
    });
    SetInterp(readyShip, { y: -1500 }, 190, 30, "ease-in-out");
    let panel3 = [comicPanel3, ground, readyShip];
    panel3.forEach(a => {
        a.x += 500;
        SetInterp(a, { x: -500 }, 150, 30, "ease-in-out");
    })

    let comicContents = [panelBorder, ...panel1, ...panel2, ...panel3];
    sprites.push(...comicContents);

    comicContents.forEach(a => {
        SetInterp(a, { x: 2000 }, 210, 30, "ease-in-out");
    })


    let ship = new StaticImage(images.ship1, 1, -2000, 250);
    ship.rotation = -0.2;
    ship.updateRules.push((frameNum) => {
        if (ship.x > -100 && ship.x < 1000) {
            let smoke = new StaticImage(images.explosion, 2, ship.x - 200, ship.y + 50);

            let dx = (Math.random() - 0.5) * 3;
            let dy = (Math.random() - 0.5) * 3 - 2;
            smoke.updateRules.push((frameNumSmoke) => {
                smoke.scale += 0.1;
                smoke.x += dx;
                smoke.y += dy;
            })
            sprites.push(smoke);
        }
    })
    SetInterp(ship, { x: 3000, y: -200 }, 180, 120, "linear");
    sprites.push(ship);

    setTimeout(() => {
        let transition = new Rect("white", 0, 500, 10000, 100);
        SetInterp(transition, { yScale: 2000 }, 0, 45, "ease-in-out");
        sprites.push(transition);

        setTimeout(Scene7, 45 * frames);
    }, 300 * frames)
}

// transition to theater
function Scene7() {
    let song = document.getElementById("theme");
    if (song.currentTime === 0) {
        song.volume = 0.2;
        song.currentTime = 28.14;
        song.play();
    }
    // cleanup
    sprites = [];
    interps = [];
    camera.focus = null;
    camera.x = 0;
    camera.y = 0;
    Scene8();
}

// slow zoom out on theater projector light
function Scene8() {
    camera.zoom = 15;
    SetInterp(camera, { zoom: 1 - camera.zoom, y: 100 }, 0, 90, "ease-in-out");
    SetInterp(camera, { y: 100 }, 60, 60, "ease-in-out");
    sprites.push(new Rect("black", 0, 0, 20000, 20000));
    for (let i = 0; i < 5; i++) {
        let projLight = new StaticImage(images.light, 10, 0, 0);
        projLight.updateRules.push((numFrames) => {
            if (numFrames % 3 !== 0) return;
            projLight.xScale = 0.5 + (Math.random())
            projLight.yScale = 0.5 + (Math.random())
        })
        projLight.z = -4;
        sprites.push(projLight);
    }

    var crowd = [
        "vidz", "riddle", "yosh", "jen", "ehnu", "typ",
        "gfe", "hudson", "mantis", "mushu", "owley", "richard",
        "crow", "", "", "burger", "", "sceptile"
    ]

    function GetShuffledArray(array) {
        let scrambled = [];
        let startArray = [...array]; // copy to avoid editing original array
        while (startArray.length) {
            let randomIndex = Math.floor(Math.random() * startArray.length);
            let item = startArray.splice(randomIndex, 1)[0];
            scrambled.push(item);
        }
        return scrambled;
    }
    crowd = GetShuffledArray(crowd);

    for (let row = 0; row < 3; row++) {
        let y = row * 100 + 280;
        for (let col = 0; col < 12; col++) {
            let x = (col - 4) * 150 + (row % 2 ? 70 : 0);
            let chair = new StaticImage(images.chair, 4, x, y);
            chair.z = row + 1;
            sprites.push(chair);

            if (x > -500 && x < 450) {
                let viewer = crowd.splice(0, 1)[0];
                if (viewer) {
                    let image = images["shadow" + viewer];
                    if (image) {
                        let sprite = new StaticImage(image, 4, x, y - 20);
                        sprite.z = row + 1;
                        sprite.animated = false;
                        if (viewer === "yosh") {
                            sprite.animated = true;
                            sprite.animationSpeed = 0.05;
                        }
                        sprites.push(sprite);
                        let offsetX = Math.random() * 20;
                        let offsetY = Math.random() * 20;
                        sprite.updateRules.push((frameNum) => {
                            sprite.x += Math.cos(frameNum / 10 + offsetX) / 10
                            sprite.y += Math.cos(frameNum / 10 + offsetY) / 10
                        })
                    }
                    if (viewer == "hudson") {
                        let popcorn = new StaticImage(images.popcorn, 4, x, y + 40);
                        popcorn.z = row + 1;
                        sprites.push(popcorn)
                    }
                }
            }
        }
    }

    for (let sprite of sprites) {
        if (sprite.z) {
            SetInterp(sprite, { x: sprite.z * 40 }, 120, 120, "linear");
        }
    }
    setTimeout(Scene9, 120 * frames);
}

// popcorn
function Scene9() {
    //SetInterp(camera, { zoom: 1, y: 400, x: -400 }, 0, 90, "ease-in-out");

    let hudson = sprites.find(a => a.tileset === images.shadowhudson);
    SetInterp(hudson, { tile: 1 }, 0, 1, "set");

    let popcorn = sprites.find(a => a.tileset === images.popcorn);
    SetInterp(popcorn, { rotation: -0.2, x: -20, y: -40 }, 10, 20, "ease-in-out");

    let gfe = sprites.find(a => a.tileset === images.shadowgfe);
    SetInterp(gfe, { tileset: images.gfelaugh, animated: true }, 40, 1, "set");

    setTimeout(Scene10, 120 * frames)
}

// rotate camera
function Scene10() {
    let staticImages = sprites.filter(a => a instanceof StaticImage);
    sprites = sprites.filter(a => !(a instanceof StaticImage));

    let video = document.getElementById("vid");
    video.playbackRate = 4;
    video.play();
    let videoScreen = new Rect(video, 0, 200, 1920 / 2, 1080 / 2);
    sprites.push(videoScreen);

    while (staticImages.length) {
        let image = staticImages.pop();
        let altImage = images[image.name + "2"];
        if (altImage) image.tileset = altImage;
        let y = -(image.z - 1) * 70 + 450;
        if (image.tileset === images.chair) y += 40;
        image.y = y;
        image.x *= -1;
        image.animated = false;
        image.xScale *= -1;
        SetInterp(image, { x: image.z * 40, y: image.z * 40 }, 0, 120, "ease-in-out");
        sprites.push(image);
    }

    setTimeout(Scene11, 220 * frames);
}

// 1 2 1 2 3 lets go
function Scene11() {

    function CrowdJump() {
        let peeps = sprites.filter(a => a.name && a.name.startsWith("shadow"));
        for (let peep of peeps) {
            let offset = Math.random() * 8;
            let heightOffset = Math.random() * 15
            SetInterp(peep, { y: -10 - heightOffset }, offset, 10, "ease-in-out");
            SetInterp(peep, { y: 10 + heightOffset }, 10 + offset, 10, "ease-in-out");
        }
    }

    function Count(numText, timeStart, duration, scale) {
        let time1 = (musicBeat * 4 * timeStart) + 1;
        let time2 = (musicBeat * 4 * (timeStart + duration)) - 10;
        let text = new StaticText(numText, 0, "white", "black", 0, -800)
        SetInterp(text, { scale: scale, y: 1000 }, time1, 10, "ease-in-out");
        SetInterp(text, { scale: -scale, y: -10000 }, time2, 10, "ease-in-out");
        setTimeout(() => {
            CrowdJump();
        }, time1 * frames);
        sprites.push(text);
    }

    Count("3", 0, 0.9, 100);
    Count("2", 1, 0.9, 120);
    Count("3", 2, 0.6, 140);
    Count("2", 2.5, 0.6, 150);
    Count("1", 3, 0.6, 160);
    Count("Let's go!", 3.3, 0.9, 180);

    let cameraPanTime = (musicBeat * 4 * (3.3 + 0.9)) - 20;

    SetInterp(camera, { y: -1000 }, cameraPanTime, 10, "ease-in-out");
    setTimeout(Scene12, cameraPanTime * frames);
}

// rocket
function Scene12() {
    camera.focus = null;
    camera.x = 0;
    camera.y = 0;
    interps = [];
    sprites = [];
    let song = document.getElementById("theme");
    if (song.currentTime === 0) {
        song.volume = 0.2;
        song.currentTime = 38.7858;
        song.play();
    }

    let night = new Rect("rgba(11,20,50,1)", -100000, 0, 20000, 20000);
    sprites.push(night);

    let skyGradient = ctx.createLinearGradient(0, 1200, 0, -800);
    skyGradient.addColorStop(0.00, "rgba(255,235,98,0)");
    skyGradient.addColorStop(0.12, "rgba(255,235,98,1)");
    skyGradient.addColorStop(0.20, "rgba(255,146,103,1)");
    skyGradient.addColorStop(0.35, "rgba(255,97,97,1)");
    skyGradient.addColorStop(0.60, "rgba(22,39,97,1)");
    skyGradient.addColorStop(0.80, "rgba(11,20,50,1)");

    let sky = new Rect(skyGradient, 0, 150 - 2400, 2800, 4800)
    sprites.push(sky);
    SetInterp(sky, { y: 1000 }, 0, 200, "ease-in-out");
    SetInterp(sky, { y: 2600 }, 0, 800, "ease-in-out");
    SetInterp(sky, { x: 2400 }, 800, 2, "ease-in-out");



    for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < 50; i++) {
            let x = (Math.random() - 0.5) * 2000;
            let y = (Math.random() - 0.5) * 1000 - 1500;
            let cloud = new StaticImage(images.cloud, 4 + Math.random() * 8, x, y);
            SetInterp(cloud, { y: 4000 }, layer * 90, 200, "linear");
            cloud.updateRules.push(() => {
                if (cloud.y >= 3500) cloud.isActive = false;
            })
            sprites.push(cloud);
        }

    }

    for (let i = 0; i < 100; i++) {
        let x = (Math.random() - 0.5) * 2000;
        let y = (Math.random() - 0.5) * 1000 - 1500;
        let duration = (Math.random() - 0.5) * 400 + 900;
        let star = new StaticImage(images.star, 1, x, y);
        star.updateRules.push((frameNum) => {
            star.scale = Math.random() * 2 + 0.2
        });
        SetInterp(star, { y: 2000 }, 200, duration, "linear");
        sprites.push(star);
    }


    let rocket = new StaticImage(images.ship1, 1, 0, 550);
    SetInterp(rocket, { y: -350 }, 0, 210, "ease-in-out");
    SetInterp(camera, { zoom: 1 }, 120, 120, "ease-in-out");
    SetInterp(camera, { zoom: -1.5 }, 270, 120, "ease-in-out");
    rocket.rotation = -Math.PI / 2;
    rocket.updateRules.push((frameNum) => {
        rocket.x += Math.cos(frameNum / 50);
        if (camera.zoom > 2.5) rocket.x *= 0.9;
        rocket.rotation = (Math.random() - 0.5) / 60 - Math.PI / 2;

        if (rocket.x > -1000 && rocket.x < 1000) {
            for (let a = 0; a < 4; a++) {
                let smoke = new StaticImage(images.explosion, 2, rocket.x, rocket.y + 200);

                let dx = (Math.random() - 0.5) * 8;
                let dy = (Math.random() - 0.5) * 3 + 10;
                smoke.updateRules.push((frameNumSmoke) => {
                    smoke.scale *= 1.015;
                    smoke.x += dx;
                    smoke.y += dy;
                    if (smoke.y > 2000) smoke.isActive = false;
                });
                //keep rocket on top
                sprites = sprites.filter(a => a !== rocket);
                sprites.push(smoke, rocket);
            }
        }
    })
    sprites.push(rocket);


    let asteroid = new StaticImage(images.asteroid, 1, -300, -1200);
    SetInterp(asteroid, { y: 2000, rotation: 2 }, 300, 200, "linear");
    SetInterp(asteroid, { isActive: false }, 500, 1, "set");
    asteroid.scale = 2;
    sprites.push(asteroid);

    let kestral = new StaticImage(images.kestral, 1, 400, -1200);
    SetInterp(kestral, { y: 2000 }, 400, 150, "linear");
    SetInterp(kestral, { isActive: false }, 550, 1, "set");
    kestral.rotation = -1.2;
    sprites.push(kestral);

    let lovers = new StaticImage(images.lovers, 1, -400, -1200);
    SetInterp(lovers, { y: 2000 }, 460, 150, "linear");
    SetInterp(lovers, { isActive: false }, 610, 1, "set");
    lovers.rotation = 1.2;
    lovers.scale = 0.5;
    sprites.push(lovers);

    let factorio = new StaticImage(images.factorio, 1, 500, -1200);
    SetInterp(factorio, { y: 2000 }, 480, 150, "linear");
    SetInterp(factorio, { isActive: false }, 630, 1, "set");
    factorio.rotation = 0.05;
    factorio.scale = 0.5;
    sprites.push(factorio);


    let moon = new StaticImage(images.moon, 1, 0, -250);
    SetInterp(moon, { y: 150 }, 460, 200, "linear");
    moon.rotation = Math.PI;
    moon.scale = 5;
    sprites.push(moon);


    SetInterp(night, { x: 0 }, 600, 1, "set");
    SetInterp(sky, { isActive: false }, 610, 1, "set");
    SetInterp(camera, { zoom: 0.5 }, 600, 90, "ease-in-out");
    SetInterp(camera, { y: 3600, zoom: 3 }, 720, 30, "ease-in-out");
    setTimeout(Scene13, 820 * frames);
}

//transition, title
function Scene13() {
    sprites = sprites.filter(a => a.name === "explosion");
    sprites.forEach(a => {
        a.updateRules.push((frameNum) => {
            a.x *= 1.05;
            if (Math.abs(a.x > 1000)) a.isActive = false;
        });
    });

    SetInterp(camera, { y: -camera.y, zoom: 1 - camera.zoom }, 60, 30, "ease-in-out");

    let ground = new StaticImage(images.ground, 5, 0, 4300);
    sprites.push(ground);
    SetInterp(ground, { y: -4050 }, 60, 30, "ease-in-out");


    let logo = new StaticImage(images.logo, 5, 0, 0);
    logo.animated = false; //manually animated
    logo.updateRules.push((frameNum) => {
        let anim = Math.floor(frameNum / musicBeat * 4) % 16;
        logo.tile = [0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0][anim];
    });
    sprites.push(logo);
    
    let title = CreateTitle();
    let num = (Math.random() * 999 + 1).toFixed(0);
    let color = Rand(["#f6c729", "#03c802", "#04d8f7", "#f73738"])
    let episodeNumber = new StaticText(`Episode ${num}:`, 30, color, "black", 0, 190);
    let episodeTitle = new StaticText(title, 30, color, "black", 0, 230);
    sprites.push(episodeNumber, episodeTitle);

    setTimeout(Scene14, 310 * frames)
}

// fade out
function Scene14() {
    for (let i = 1, j = 0; i >= -0.02; i -= 0.05, j++) {
        setTimeout(() => {
            canvas.style.opacity = i;
        }, j * 30);
    }
}

// ending card https://www.beepbox.co/#9n31sbk0l00e03t1Da7g0fj07r0i0o432T1v3ue1f0q0y10n73d4aA0F0B7Q0000Pe600E2bb619T1v1u30f0qwx10r511d08A9F4B0Q19e4Pb631E3b7626637T1v1u30f0qwx10r511d08A9F4B0Q19e4Pb631E3b7626637T4v1uf0f0q011z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b4x800000000i4M000000018i0000000000000000000p21PFKDUiegig5dfAEuh7Fw1XxQPYp8ZgZo-Uf83QR3M0-hAzR3O8-Afofjmf0zV683O8ZoUaq_Fn9kOQ98QVdrtjbllQwkPD2uwuywDE7EE9W1Wa2uwuw0
// https://www.beepbox.co/#8n31sbk0l00e0jt2wm0a7g0oj07i0r1o3210T0v2L4u12q1d1f7y1z1C0w2c0h2T0v0L4u11q0d0f8y0z1C2w1c0h0T0v1L4u10q0d0f8y0z1C2w2c0h0T2v2L4u15q0d1f8y0z1C2w0b4z9000000z91k00000004xc0018j1000018Ocz8Ocz8Ock00000h4h4h8ych4g00000p25XFBQHGo6KCC1wqqo2-CCKGOC2IIFwF6hFwp2hFwqqfj8V0zFI8QR-3AkAth7mhV4zA2eCEzM38F8WieQzRAtx7johU3AnAtF7mhSrQs4Iidd7P3O97ohGufbF02FE-yeAzJbVuPq_kBeU1IAtp7onTjZfH_SeUbTjTW_8pIzIBZlir5ns6MIDjyb05cK8bgbkbgb0yQ2M8J0JoJ0JoJ0I0bgb02Q2XNq1q1q1q1q1q1q1qhq1q1q1q1q1q1q1tMJ0J0J0J0J0J0J0JEJ0J0J0J0J0J0J0JjteKDf2PhD1FEOc-syzaCGszaD8OFOacGqFOaqYELGduCALQBZ9uPnBlhbCzaCCqcCqpFA9uEBl9B52ylahhhhhhgERiCO
// new years https://www.beepbox.co/#9n51sbk0l00e0jt2wa7g0oj08r0i0o44234T1v2ub5f0q0x10o51d23A5F4B6Q0001PecaaE4b262963979T1v0ub4f20o72laqw131d23A5F4B3Q0001Pfca8E362963479T5v1u51f0qwx10n511d08H-IHyiih9999998h0E1b6T1v4u97f0q0z10t231d4aA9F3B6Q5428Paa74E3ba63975T5v1uc9f10j5q011d23HXQRRJJHJAAArq8h0E0T4v2uf0f0q011z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b4z97w6000z99k0001mu04x002h8j1000018Ocz8Ocz8Ock00000i4x8i4x8000c000018ik0oQdN8iyg00004h4h4i8z4h400000p2bPFDQwZRgYx1zOdMYzgfrkfn13Oc4ftpF__3TazRSPfVxePnUepcXtzRofkyfGh3RufnupxfE6pcXq8ZtzM63WK3TufnupxfEvVcWxwYzUZnzSrQs5RtfQ-LSxzW1uWu_n-jp7fbQQ-O9D-DB-rBmrfZju22rdfToXdvxRMzL2275TrI5ADjfOCDNYh9X2tjLDQw1YEDF9Xi-nISLR9vK0r9fmjS5ZQ_jW_qCcKwnKDLR_ASgSi-GAENlT1Ib9QUyMjnjfWfhkf1IPUyEZcQijSjof03T3M8Y4fpHYxn7BYWtdfMoZ0YzUZO9VLbWxYQuALwxU4DwrNRc_LUCCn42Q2R2Q2M8J0I2bgbmbgbmbgb02Q2M0J0Jd7-3j7M7A1V0ug7A1V0ug7AxV0ug7A1V0ug7A1V0ve1V0ug7A1V0ug7A1V0uq7A1V0ug7A1V0ug7A1RdQWWsY2VKDU3F8x0V3KitS0FFYcCvD0sEDwcP0sAuEuKEvdV74yv9ctjLDNg1Wp7jnUn22qvH4pHFI_j7AhQR_YBFkQFF-ASfwrdmTOze_TZhN3kuYPY1M3cPsX0d0efOyRcvk3jjjjjjjjjiCR-jnViWCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCPtelgWuVD0gc4WpOxWa2v8GxYH8Gyva7EE9YyGOqGqYi5Y4qZd9vSHMjXgZ51fAlg-lAlhfB3Qk4-hlpdgiZhaGjGa54GkyyyyyyxhGBbA