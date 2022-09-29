var interps = [];

function SetInterp(object, changeMap, delay, durationFrames, style) {
    delay = Math.floor(delay);
    durationFrames = Math.floor(durationFrames);
    if (durationFrames <= 0) console.error("Interp over 0 frames")

    for (let property of Object.keys(changeMap)) {
        let change = changeMap[property];

        let deltas = [];
        for (let i = 0; i < durationFrames; i++) {
            if (style === "set") {
                deltas.push(change);
            }
            if (style === "linear") {
                deltas.push(change / durationFrames);
            }
            if (style === "ease-in-out") {
                let t = i / durationFrames;
                let total = t * t * (3 - 2 * t) * change;
                let delta = total - deltas.reduce((a, b) => a + b, 0)
                deltas.push(delta);
            }
        }

        for (let frame = frameNum + 1; frame <= frameNum + durationFrames; frame++) {

            let interp = {
                frame: frame + delay,
                object: object,
                property: property,
                delta: deltas.splice(0, 1)[0],
                style: style
            }
            interps.push(interp);
        }
    }
}

function ProcessInterps(frameNum) {
    for (let interp of interps.filter(a => a.frame === frameNum)) {
        if (interp.style === "set") {
            interp.object[interp.property] = interp.delta;
        } else {
            interp.object[interp.property] += interp.delta;
        }
    }
    interps = interps.filter(a => a.frame !== frameNum)
}