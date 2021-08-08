
// Player 1 start
function Scene1() {
    let song = document.getElementById("theme");
    song.volume = 0.2;
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

    let trees = [0, 1, 2].flatMap(a => [
        new StaticImage(images.tree, 3, 500 - a * 300, -200),
        new StaticImage(images.tree, 3, 700 - a * 500, -150),
        new StaticImage(images.tree, 2.5, 700 - a * 400, -150),
        new StaticImage(images.tree, 2, 300 - a * 250, -200)
    ]);

    trees.sort((a, b) => a.baseY - b.baseY);
    terrain.push(...trees)

    let dobbs = new Dobbs(0, 0);
    let coins = [0, 1, 2].map(x => new Dobbloon(1000 + x * 100, -180));
    let initialS2s = [
        new Rect(grassGradient, 0, -40, 1800, 50),
        new Rect("#64b87a", 0, 50, 1800, 140),
        ...terrain,
        new Ground(0, 500),
        dobbs,
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
        new StaticImage(images.tank, 10, -600, -100),
        new StaticImage(images.wagon, 12, -850, -80),
        new StaticImage(images.gq, 6, -650, 20),
        new StaticImage(images.kirb, 6, -750, 20),
        new StaticImage(images.turtle, 6, -800, 80),
        new StaticImage(images.snek, 6, -700, 80),
        new StaticImage(images.dove, 6, -700, -100),
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


function Scene4() {
    sprites.forEach(a => {
        SetInterp(a, { y: 800 }, 0, 60, "ease-in-out");
        SetInterp(a, { isActive: false }, 60, 1, "set");
    })
}


// land on balloon
// hc pilot
// clouds
// fire, panic
// land in rocket
// shuffling in theater
// 1 2 1 2 3 lets go
// rocket
// slide down flagpole
// TITLE
// stars above, moon and rocket, rover constellation

// https://www.beepbox.co/#8n31sbk0l00e0jt2wm0a7g0oj07i0r1o3210T0v2L4u12q1d1f7y1z1C0w2c0h2T0v0L4u11q0d0f8y0z1C2w1c0h0T0v1L4u10q0d0f8y0z1C2w2c0h0T2v2L4u15q0d1f8y0z1C2w0b4z9000000z91k00000004xc0018j1000018Ocz8Ocz8Ock00000h4h4h8ych4g00000p25XFBQHGo6KCC1wqqo2-CCKGOC2IIFwF6hFwp2hFwqqfj8V0zFI8QR-3AkAth7mhV4zA2eCEzM38F8WieQzRAtx7johU3AnAtF7mhSrQs4Iidd7P3O97ohGufbF02FE-yeAzJbVuPq_kBeU1IAtp7onTjZfH_SeUbTjTW_8pIzIBZlir5ns6MIDjyb05cK8bgbkbgb0yQ2M8J0JoJ0JoJ0I0bgb02Q2XNq1q1q1q1q1q1q1qhq1q1q1q1q1q1q1tMJ0J0J0J0J0J0J0JEJ0J0J0J0J0J0J0JjteKDf2PhD1FEOc-syzaCGszaD8OFOacGqFOaqYELGduCALQBZ9uPnBlhbCzaCCqcCqpFA9uEBl9B52ylahhhhhhgERiCO
