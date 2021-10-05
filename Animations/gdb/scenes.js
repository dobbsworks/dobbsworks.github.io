function Scene1() {

    let subtitleDelay = 60;

    function CreateTextBlock(textContent, side, bgColor) {
        let ret = document.createElement("div");
        let span1 = document.createElement("span");
        let span2 = document.createElement("span");
        span1.innerHTML = textContent;
        span2.innerHTML = textContent;
        if (bgColor) {
            span2.style.color = bgColor;
        }
        let classes = ("persp" + side).split(" ");
        span1.classList.add("text", ...classes);
        span2.classList.add("text", ...classes, "overlay");
        ret.appendChild(span1);
        ret.appendChild(span2);
        ret.classList.add("slam-in");
        return ret;
    }

    function AddSplotchAndText(titleText, subtitleText, side, bgColor) {
        let container = document.getElementById("perspective");
        let title = document.createElement("div");
        title.appendChild(CreateTextBlock(titleText, side + " title"));
        container.appendChild(title);

        setTimeout(() => {
            title.classList.add("drift-left");
        }, 550);

        setTimeout(() => {
            let subtitle = document.createElement("div");
            subtitle.appendChild(CreateTextBlock(subtitleText, side + " sub", bgColor));
            container.appendChild(subtitle);

            setTimeout(() => {
                subtitle.classList.add("drift-right");
            }, 550);
        }, subtitleDelay * frames - 300)
        
        let splotch = new StaticImage(images.splotch, 11, 460, 0);
        if (side === "Left") {
            splotch.x -= 930;
            splotch.y -= 140;
        }
        let xScale = (side === "Left") ? -1 : 1;
        SetInterp(splotch, { scale: -10.5 }, 10, 20, "ease-in-out");
        SetInterp(splotch, { x: 50*xScale }, 30, 180, "linear");
        sprites.push(splotch);
    }

    function Cleanup() {
        sprites = [];
        let container = document.getElementById("perspective");
        container.innerHTML = "";
    }

    function ColorLayer(color) {
        let rect = new Rect(color, 0, 0, 2000, 2000);
        sprites.push(rect);
    }

    function Dobbs() {
        Cleanup();
        let dobbsback = new StaticImage(images.dobbsback, 1, 0, 0);
        SetInterp(dobbsback, { x: 50 }, 0, 240, "linear");
        sprites.push(dobbsback);

        ColorLayer("#92cddb22");

        let dobbs = new StaticImage(images.dobbs, 1, -270, 170);
        dobbs.animated = false;
        sprites.push(dobbs);
        SetInterp(dobbs, { scale: 1, rotation: -0.05, x: 50, y: -70 }, subtitleDelay, 20, "ease-in-out");
        SetInterp(dobbs, { x: -100 }, 0, 240, "linear");
        AddSplotchAndText("Dobbs", "Spaces out!", "Right", "#92cddb");
    }

    function Germdove() {
        Cleanup();
        let germback = new StaticImage(images.germback, 2, 0, 0);
        SetInterp(germback, { x: 50 }, 0, 240, "linear");
        sprites.push(germback);

        ColorLayer("#38926e22");

        let germ = new StaticImage(images.germdove, 1, 270, 100);
        sprites.push(germ);
        SetInterp(germ, { scale: 0.2, rotation: 0.05, x: -50 }, subtitleDelay, 20, "ease-in-out");
        SetInterp(germ, { x: -100 }, 0, 240, "linear");
        AddSplotchAndText("germdove", "Takes flight!", "Left", "#38926e");
        Array.from(document.getElementsByClassName("title")).forEach(a => a.style.left = "-50px")
    }

    function GQ() {
        Cleanup();
        let gqback = new StaticImage(images.gqback, 2, 0, 0);
        SetInterp(gqback, { x: 50 }, 0, 240, "linear");
        sprites.push(gqback);

        ColorLayer("#fff14722");

        let gq = new StaticImage(images.gq, 1, -170, 100);
        sprites.push(gq);
        SetInterp(gq, { scale: 1, rotation: 0.05, x: -50 }, subtitleDelay, 20, "ease-in-out");
        SetInterp(gq, { x: -100 }, 0, 240, "linear");
        AddSplotchAndText("GameQueued", "Takes the dev exit!", "Right", "#fff147");
        Array.from(document.getElementsByClassName("title")).forEach(a => a.style.left = "-100px")
    }

    function Turtle() {
        Cleanup();
        let turtleback = new StaticImage(images.turtleback, 2, 0, 0);
        SetInterp(turtleback, { x: 50 }, 0, 240, "linear");
        sprites.push(turtleback);

        ColorLayer("#fff14722");

        let turtle = new StaticImage(images.turtle, 1, 270, 100);
        sprites.push(turtle);
        SetInterp(turtle, { scale: 0.2, rotation: 0.05, x: -50 }, subtitleDelay, 20, "ease-in-out");
        SetInterp(turtle, { x: -100 }, 0, 240, "linear");
        AddSplotchAndText("Lurking Turtle", "Raises shell!", "Left", "teal");
        Array.from(document.getElementsByClassName("title")).forEach(a => a.style.left = "-50px")
    }

    function Panda() {
        Cleanup();
        let pandaback = new StaticImage(images.pandaback, 2, 0, 0);
        SetInterp(pandaback, { x: 50 }, 0, 240, "linear");
        sprites.push(pandaback);

        ColorLayer("#fff14722");

        let panda = new StaticImage(images.panda, 1, 270, 100);
        sprites.push(panda);
        SetInterp(panda, { scale: 0.2, rotation: 0.05, x: -50 }, subtitleDelay, 20, "ease-in-out");
        SetInterp(panda, { x: -100 }, 0, 240, "linear");
        AddSplotchAndText("Bardic Panda", "Eats Shoots and Leaves!", "Left", "#626945");
        Array.from(document.getElementsByClassName("title")).forEach(a => a.style.left = "-50px")
        setTimeout(() => {
            Array.from(document.getElementsByClassName("sub")).forEach(a => a.style.left = "-100px")
        }, 1000)
    }

    function Dae() {
        Cleanup();
        let snekback = new StaticImage(images.snekback, 2, 0, 0);
        SetInterp(snekback, { x: 50 }, 0, 240, "linear");
        sprites.push(snekback);

        ColorLayer("#fff14722");

        let snek = new StaticImage(images.snek, 1, -270, 100);
        sprites.push(snek);
        SetInterp(snek, { scale: 1, rotation: 0.05, x: 150, y: 150 }, subtitleDelay, 20, "ease-in-out");
        SetInterp(snek, { x: -100 }, 0, 240, "linear");
        AddSplotchAndText("DaeSnek", "Readies the banhammer!", "Right", "#b5866c");
        Array.from(document.getElementsByClassName("title")).forEach(a => a.style.left = "10px")
        setTimeout(() => {
            Array.from(document.getElementsByClassName("sub")).forEach(a => a.style.left = "-200px")
        }, 1000)
    }

    function Duffy() {
        Cleanup();
        let duffyback = new StaticImage(images.duffyback, 1.2, 0, 0);
        SetInterp(duffyback, { x: 50 }, 0, 240, "linear");
        sprites.push(duffyback);

        ColorLayer("#fff14722");

        let duffy = new StaticImage(images.duffy, 0.5, -270, 120);
        sprites.push(duffy);
        SetInterp(duffy, { scale: 0.5, rotation: 0.05, x: 50, y: 0 }, subtitleDelay, 20, "ease-in-out");
        SetInterp(duffy, { x: -100 }, 0, 240, "linear");
        AddSplotchAndText("Duffy", "Has a knife!", "Right", "#b5866c");
        Array.from(document.getElementsByClassName("title")).forEach(a => a.style.left = "10px")
        // setTimeout(() => {
        //     Array.from(document.getElementsByClassName("sub")).forEach(a => a.style.left = "-200px")
        // }, 1000)
    }

    function Shiner() {
        Cleanup();
        let shinerback = new StaticImage(images.shinerback, 1.5, 0, 0);
        SetInterp(shinerback, { x: 50 }, 0, 240, "linear");
        sprites.push(shinerback);

        ColorLayer("#61000033");

        let shiner = new StaticImage(images.shiner, 0.5, 270, 120);
        sprites.push(shiner);
        SetInterp(shiner, { scale: 0.5, rotation: 0.05, x: -50, y: 0 }, subtitleDelay, 20, "ease-in-out");
        SetInterp(shiner, { x: -100 }, 0, 240, "linear");
        AddSplotchAndText("Shiner", "Circles the wagons!", "Left", "#8a1700");
        Array.from(document.getElementsByClassName("title")).forEach(a => a.style.left = "-80px")
        setTimeout(() => {
            Array.from(document.getElementsByClassName("sub")).forEach(a => {a.style.left = "-100px"; a.style.top = "20px"})
        }, 900)
    }



    function Go() {
        let scenes = [Germdove, GQ, Shiner, Duffy, Panda, Dae, Turtle, Dobbs ];
        //scenes = []
        for (let i=0; i<scenes.length; i++) {
            setTimeout(scenes[i], 1650 * i);
        }
        setTimeout(Scene2, 1650 * scenes.length + 50);
    }
    Go();
}


function Scene2() {
    sprites = [];
    interps = [];
    document.getElementById("perspective").innerHTML = "";
    let rect = new Rect("#000", 0, 0, 2000, 2000);
    sprites.push(rect);
    let logo = new StaticImage(images.logo, 2, 0, 1200);
    sprites.push(logo);
    
    SetInterp(logo, { y: -1200, rotation: Math.PI*2, scale: -1 }, 0, 30, "ease-in-out");
    SetInterp(logo, { scale: 0.25 }, 30, 240, "ease-in-out");
}