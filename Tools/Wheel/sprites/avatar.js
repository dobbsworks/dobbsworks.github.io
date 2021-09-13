class Avatar {
    constructor(image, scale, x, y) {
        this.sprite = new StaticImage(image, scale, x, y);
        sprites.push(this.sprite)
    }

    Squish(delay, duration) {
        let each = duration / 3;
        let force = 0.1;
        SetInterp(this.sprite, { xScale: force, yScale: -force }, delay, each, "ease-in-out");
        SetInterp(this.sprite, { xScale: -force*2, yScale: force*2 }, delay + each, each, "ease-in-out");
        SetInterp(this.sprite, { xScale: force, yScale: -force }, delay + each*2, each, "ease-in-out");
    }

    Happy() {
        let oneWayLeapDuration = 20;
        let jumpCount = 2;
        for (let i = 0; i < jumpCount * 2; i++) {
            let direction = i % 2 ? 1 : -1;
            let delay = i * oneWayLeapDuration; 
            SetInterp(this.sprite, { y: 50 * direction }, delay+10, oneWayLeapDuration, "ease-in-out");
            if (i % 2 === 0) {
                this.Squish(delay, 20)
            }
        }
    }

    Sad() {
        let sink = 50;
        SetInterp(this.sprite, { y: sink, yScale: -0.1, xScale: 0.1  }, 0, 120, "ease-in-out");
        
        let offset = 0;
        let wiggleCount = 4;
        for (let i = 0; i < wiggleCount; i++) {
            let targetX = (i + 1) * 10 * (i % 2 ? -1 : 1);
            SetInterp(this.sprite, { x: targetX - offset  }, 20 * i, 30, "ease-in-out");
            offset = targetX;
        }
        SetInterp(this.sprite, { x: -offset}, 20 * wiggleCount, 30, "ease-in-out");
        SetInterp(this.sprite, { y: -sink, yScale: 0.1, xScale: -0.1  }, 20 * wiggleCount + 60, 30, "ease-in-out");
    }
}