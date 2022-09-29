var camera = {
    x: 0,
    y: 0,
    zoom: 1,
    rotation: 0,
    focus: null,
    speed: 100 // closer to 1 for faster
}

function onBeforeDraw(ctx) {
    if (camera.focus) {
        camera.x += (camera.focus.x - camera.x) / camera.speed;
        camera.y += (camera.focus.y - camera.y) / camera.speed;
    }

    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    ctx.save();
    //ctx.rotate(camera.rotation);
    ctx.transform(1, 0, 0, 1, -camera.x * camera.zoom + width/2, -camera.y * camera.zoom + height/2);
    ctx.transform(camera.zoom, 0, 0, camera.zoom, 0, 0);
}

function onAfterDraw(ctx) {
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;

    ctx.restore();
    
    // temp crosshair, remove for capture
    // ctx.strokeStyle = "black";
    // ctx.moveTo(width/2 + 5, height/2 + 5);
    // ctx.lineTo(width/2 - 5, height/2 - 5);
    // ctx.stroke();
    // ctx.moveTo(width/2 - 5, height/2 + 5);
    // ctx.lineTo(width/2 + 5, height/2 - 5);
    // ctx.stroke();
}