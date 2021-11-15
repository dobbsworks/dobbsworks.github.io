

// fade out
function FadeOut() {
    for (let i = 1, j = 0; i >= -0.02; i -= 0.05, j++) {
        setTimeout(() => {
            canvas.style.opacity = i;
        }, j * 30);
    }
}


function LoopingLogo() {

    let song = document.getElementById("theme");
    song.volume = 1;
    song.play();

    let skyGradient = ctx.createLinearGradient(0, 400, 0, -400);
    skyGradient.addColorStop(0.00, "rgba(255,235,98,0)");
    skyGradient.addColorStop(0.52, "rgba(255,235,98,1)");
    skyGradient.addColorStop(0.66, "rgba(255,146,103,1)");
    skyGradient.addColorStop(0.75, "rgba(255,97,97,1)");
    skyGradient.addColorStop(1.00, "rgba(22,39,97,1)");
    let sky = new Rect(skyGradient, 0, 150 - 2400, 1800, 1200)
    sprites.push(sky);   


    let ground = new StaticImage(images.ground, 5, 0, 250);
    sprites.push(ground);

    let groundShadow = new Rect("#00000000", 0, 250, 1000, 78*5);
    sprites.push(groundShadow);
    groundShadow.timer = 0; 
    groundShadow.timer2 = 0; 

    setInterval( () => {
        if (groundShadow.timer < 1085) groundShadow.timer++;
        if (groundShadow.timer2 < 1085*2) groundShadow.timer2++;

        // a in [0, 1]
        let a = (-Math.cos(groundShadow.timer / 360) + 1) / 2;
        let b = Math.floor(a * 256 * 0.8);
        let c = b.toString("16");
        if (c.length < 2) c = "0" + c;

        let volume = 1-(-Math.cos(groundShadow.timer2 / 720) + 1) / 2;
        song.volume = volume;

        let color = "#000000" + c;
        groundShadow.color = color;

        sky.y = -2250 + a * 2560 * 1;
    }, frames) 

    let logo = new StaticImage(images.logo, 5, 0, 0);
    logo.animated = false; //manually animated
    logo.updateRules.push((frameNum) => {
        let anim = Math.floor(frameNum / musicBeat * 4) % 16;
        logo.tile = [0, 0, 1, 1, 2, 2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0][anim];
    });
    sprites.push(logo);
}

// ending card https://www.beepbox.co/#9n31sbk0l00e03t1Da7g0fj07r0i0o432T1v3ue1f0q0y10n73d4aA0F0B7Q0000Pe600E2bb619T1v1u30f0qwx10r511d08A9F4B0Q19e4Pb631E3b7626637T1v1u30f0qwx10r511d08A9F4B0Q19e4Pb631E3b7626637T4v1uf0f0q011z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b4x800000000i4M000000018i0000000000000000000p21PFKDUiegig5dfAEuh7Fw1XxQPYp8ZgZo-Uf83QR3M0-hAzR3O8-Afofjmf0zV683O8ZoUaq_Fn9kOQ98QVdrtjbllQwkPD2uwuywDE7EE9W1Wa2uwuw0
// https://www.beepbox.co/#8n31sbk0l00e0jt2wm0a7g0oj07i0r1o3210T0v2L4u12q1d1f7y1z1C0w2c0h2T0v0L4u11q0d0f8y0z1C2w1c0h0T0v1L4u10q0d0f8y0z1C2w2c0h0T2v2L4u15q0d1f8y0z1C2w0b4z9000000z91k00000004xc0018j1000018Ocz8Ocz8Ock00000h4h4h8ych4g00000p25XFBQHGo6KCC1wqqo2-CCKGOC2IIFwF6hFwp2hFwqqfj8V0zFI8QR-3AkAth7mhV4zA2eCEzM38F8WieQzRAtx7johU3AnAtF7mhSrQs4Iidd7P3O97ohGufbF02FE-yeAzJbVuPq_kBeU1IAtp7onTjZfH_SeUbTjTW_8pIzIBZlir5ns6MIDjyb05cK8bgbkbgb0yQ2M8J0JoJ0JoJ0I0bgb02Q2XNq1q1q1q1q1q1q1qhq1q1q1q1q1q1q1tMJ0J0J0J0J0J0J0JEJ0J0J0J0J0J0J0JjteKDf2PhD1FEOc-syzaCGszaD8OFOacGqFOaqYELGduCALQBZ9uPnBlhbCzaCCqcCqpFA9uEBl9B52ylahhhhhhgERiCO
// new years https://www.beepbox.co/#9n51sbk0l00e0jt2wa7g0oj08r0i0o44234T1v2ub5f0q0x10o51d23A5F4B6Q0001PecaaE4b262963979T1v0ub4f20o72laqw131d23A5F4B3Q0001Pfca8E362963479T5v1u51f0qwx10n511d08H-IHyiih9999998h0E1b6T1v4u97f0q0z10t231d4aA9F3B6Q5428Paa74E3ba63975T5v1uc9f10j5q011d23HXQRRJJHJAAArq8h0E0T4v2uf0f0q011z6666ji8k8k3jSBKSJJAArriiiiii07JCABrzrrrrrrr00YrkqHrsrrrrjr005zrAqzrjzrrqr1jRjrqGGrrzsrsA099ijrABJJJIAzrrtirqrqjqixzsrAjrqjiqaqqysttAJqjikikrizrHtBJJAzArzrIsRCITKSS099ijrAJS____Qg99habbCAYrDzh00E0b4z97w6000z99k0001mu04x002h8j1000018Ocz8Ocz8Ock00000i4x8i4x8000c000018ik0oQdN8iyg00004h4h4i8z4h400000p2bPFDQwZRgYx1zOdMYzgfrkfn13Oc4ftpF__3TazRSPfVxePnUepcXtzRofkyfGh3RufnupxfE6pcXq8ZtzM63WK3TufnupxfEvVcWxwYzUZnzSrQs5RtfQ-LSxzW1uWu_n-jp7fbQQ-O9D-DB-rBmrfZju22rdfToXdvxRMzL2275TrI5ADjfOCDNYh9X2tjLDQw1YEDF9Xi-nISLR9vK0r9fmjS5ZQ_jW_qCcKwnKDLR_ASgSi-GAENlT1Ib9QUyMjnjfWfhkf1IPUyEZcQijSjof03T3M8Y4fpHYxn7BYWtdfMoZ0YzUZO9VLbWxYQuALwxU4DwrNRc_LUCCn42Q2R2Q2M8J0I2bgbmbgbmbgb02Q2M0J0Jd7-3j7M7A1V0ug7A1V0ug7AxV0ug7A1V0ug7A1V0ve1V0ug7A1V0ug7A1V0uq7A1V0ug7A1V0ug7A1RdQWWsY2VKDU3F8x0V3KitS0FFYcCvD0sEDwcP0sAuEuKEvdV74yv9ctjLDNg1Wp7jnUn22qvH4pHFI_j7AhQR_YBFkQFF-ASfwrdmTOze_TZhN3kuYPY1M3cPsX0d0efOyRcvk3jjjjjjjjjiCR-jnViWCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCPtelgWuVD0gc4WpOxWa2v8GxYH8Gyva7EE9YyGOqGqYi5Y4qZd9vSHMjXgZ51fAlg-lAlhfB3Qk4-hlpdgiZhaGjGa54GkyyyyyyxhGBbA