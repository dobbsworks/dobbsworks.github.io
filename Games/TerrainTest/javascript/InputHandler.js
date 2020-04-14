

function SetupCameraInput(camera) {
    camera.MaxSpeed = 0.5;
    camera.Acceleration = 0.01;
    camera.Dampening = 0.9;
    camera.Velocity = new THREE.Vector3(0, 0, 0);
    camera.Inputs = {
        left: false,
        right: false,
        up: false,
        down: false,
        zoomIn: false,
        zoomOut: false
    }

    camera.Update = function () {
        if (camera.Inputs.left) camera.Velocity.x -= camera.Acceleration;
        if (camera.Inputs.right) camera.Velocity.x += camera.Acceleration;
        if (camera.Inputs.up) camera.Velocity.y += camera.Acceleration;
        if (camera.Inputs.down) camera.Velocity.y -= camera.Acceleration;

        if (!camera.Inputs.left && !camera.Inputs.right) camera.Velocity.x *= camera.Dampening;
        if (!camera.Inputs.up && !camera.Inputs.down) camera.Velocity.y *= camera.Dampening;


        if (camera.Inputs.zoomIn) camera.Velocity.z = -camera.MaxSpeed;
        if (camera.Inputs.zoomOut) camera.Velocity.z = camera.MaxSpeed;

        if (!camera.Inputs.zoomIn && !camera.Inputs.zoomOut) camera.Velocity.z *= camera.Dampening;
        camera.Inputs.zoomIn = false;
        camera.Inputs.zoomOut = false;



        if (camera.Velocity.x > camera.MaxSpeed) camera.Velocity.x = camera.MaxSpeed;
        if (camera.Velocity.x < -camera.MaxSpeed) camera.Velocity.x = -camera.MaxSpeed;
        if (camera.Velocity.y > camera.MaxSpeed) camera.Velocity.y = camera.MaxSpeed;
        if (camera.Velocity.y < -camera.MaxSpeed) camera.Velocity.y = -camera.MaxSpeed;

        if (Math.abs(camera.Velocity.x) < camera.Acceleration) camera.Velocity.x = 0;
        if (Math.abs(camera.Velocity.y) < camera.Acceleration) camera.Velocity.y = 0;

        this.position.add(this.Velocity);
    }

    window.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case 87: // W
                camera.Inputs.up = true;
                break;
            case 65: // A
                camera.Inputs.left = true;
                break;
            case 83: // S
                camera.Inputs.down = true;
                break;
            case 68: // D
                camera.Inputs.right = true;
                break;
        }
    }, false);


    window.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
            case 87: // W
                camera.Inputs.up = false;
                break;
            case 65: // A
                camera.Inputs.left = false;
                break;
            case 83: // S
                camera.Inputs.down = false;
                break;
            case 68: // D
                camera.Inputs.right = false;
                break;
        }
    }, false);


    window.addEventListener('mousewheel', function (event) {
        if (event.wheelDelta > 0) camera.Inputs.zoomIn = true;
        if (event.wheelDelta < 0) camera.Inputs.zoomOut = true;
    }, false);

}