class Wheel {

    constructor() {
        this.sourceCanvas = document.createElement("canvas");
        this.radius = 400
        this.sourceCanvas.width = (this.radius + this.margin) * 2;
        this.sourceCanvas.height = this.sourceCanvas.width;
        this.sourceCtx = this.sourceCanvas.getContext("2d");
        
        this.sourceCtx.translate(this.radius + this.margin, this.radius + this.margin);
        this.sourceCtx.beginPath();
        this.sourceCtx.arc(0, 0, this.radius + 10, 0, Math.PI * 2);
        this.sourceCtx.fillStyle = "silver";
        this.sourceCtx.fill();
        this.sourceCtx.strokeStyle = "#000";
        this.sourceCtx.lineWidth = 2;
        this.sourceCtx.stroke();
        this.slices = [
            this.CreateValueSlice(750, "#f57f13"),
            this.CreateLoseTurnSlice(),
            this.CreateValueSlice(400, "#fef51d"),
            this.CreateValueSlice(300, "#0087df"),
            this.CreateValueSlice(900, "#f57f13"),
            this.CreateBankruptSlice(),
            this.CreateValueSlice(550, "#fef51d"),
            this.CreateValueSlice(200, "#974bdc"),
            this.CreateValueSlice(350, "#ff0000"),
            this.CreateValueSlice(900, "#0087df"),
            this.CreateValueSlice(150, "#299f6d"),
            this.CreateValueSlice(550, "#fef51d"),
            this.CreateValueSlice(600, "#f57f13"),
            this.CreateValueSlice(250, "#299f6d"),
            this.CreateValueSlice(300, "#fef51d"),
            this.CreateValueSlice(700, "#0087df"),
            this.CreateValueSlice(100, "#ff0000"),
            this.CreateValueSlice(450, "#974bdc"),
            this.CreateValueSlice(5000, "#cdcdcd"),
            this.CreateValueSlice(800, "#299f6d"),
            this.CreateValueSlice(250, "#ff0000"),
            this.CreateValueSlice(600, "#974bdc"),
            this.CreateValueSlice(350, "#299f6d"),
            this.CreateBankruptSlice(),
        ];
        this.AddBorders();
        this.sourceCtx.beginPath();
        this.sourceCtx.arc(0, 0, this.radius * 2 / 5, 0, Math.PI * 2);
        this.sourceCtx.fillStyle = "#5dc096";
        this.sourceCtx.fill();
        this.sourceCtx.strokeStyle = "#000";
        this.sourceCtx.lineWidth = 2;
        this.sourceCtx.stroke();

        // used to draw rotated image for later skewing
        this.canvas = document.createElement("canvas");
        this.canvas.width = (this.radius + this.margin) * 2;
        this.canvas.height = this.canvas.width;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.translate(this.radius + this.margin, this.radius + this.margin);
        this.ctx.rotate((0.5 / 72 * Math.PI * 2));
        //document.body.appendChild(this.canvas);

        // used to draw markers
        this.markerCanvas = document.createElement("canvas");
        this.markerCanvas.width = (this.radius + this.margin) * 2;
        this.markerCanvas.height = this.markerCanvas.width;
        this.markerCtx = this.markerCanvas.getContext("2d");
        this.markerCtx.translate(this.radius + this.margin, this.radius + this.margin);
        this.markerCtx.rotate((0.5 / 72 * Math.PI * 2));
        //document.body.appendChild(this.markerCanvas);

        this.Update();

        setInterval(() => {
            this.Update();
        }, 1000 / 60);
    }

    radius = 400;
    margin = 80;
    rotation = 0;
    speed = 0;
    sliceRad = (Math.PI * 2) / 24;
    speedSpinTimer = 0;

    Update() {
        this.ctx.clearRect(-4000, -4000, 8000, 8000);
        let oldSlice = this.GetCurrentPegIndex();
        this.rotation += this.speed;
        let newSlice = this.GetCurrentPegIndex();
        if (oldSlice != newSlice) {
            this.PlayTick()
        }
        this.ctx.save();
        this.ctx.rotate(this.rotation)
        this.ctx.drawImage(this.sourceCanvas, -this.sourceCanvas.width / 2, -this.sourceCanvas.height / 2);
        this.ctx.restore();

        this.DrawMarkers();

        if (this.targetSpeed) {
            this.speed += (this.targetSpeed - this.speed) * 0.03;
            if (Math.abs(this.speed - this.targetSpeed) < 0.005) {
                this.targetSpeed = null;
            }
        } else if (this.speedSpinTimer > 0) {
            this.speedSpinTimer--;
        } else {
            this.speed *= 0.98
        }
        if (this.speed < 0.0003 && this.speed > 0) {
            this.speed = 0;
            console.log(this.GetCurrentSlice(turnIndex))
        }
    }

    DrawMarkers() {
        this.markerCtx.clearRect(-4000, -4000, 8000, 8000);
        for (let rotation of [-1, 0, 1]) {
            this.markerCtx.save();
            this.markerCtx.rotate(rotation * 7 / 72 * Math.PI * 2 - (0.5 / 72 * Math.PI * 2))
            this.markerCtx.translate(0, -this.radius - 50);

            let pegOffset = (1 - this.GetCurrentPegValue() % 1) / 2;
            pegOffset = Math.max(0, pegOffset - 0.1)
            this.markerCtx.rotate(-pegOffset)
            let image = images.marker.image;
            this.markerCtx.drawImage(image, -image.width / 2, -image.height / 2);
            this.markerCtx.restore();
        }

        this.markerCtx.save();
        //this.markerCtx.translate(-this.radius/2, -this.radius/2)
        let pegImage = images.peg.image;
        for (let i = 0; i < 72; i++) {
            let r =  (i + 0.5) * (Math.PI * 2) / 72 + this.rotation;
            let x = (this.radius + 5) * Math.cos(r);
            let y = (this.radius + 5) * Math.sin(r);
            this.markerCtx.drawImage(pegImage, x -pegImage.width / 2, y -pegImage.height / 2);
        }
        this.markerCtx.restore();
    }

    GetCurrentPegValue() {
        let pi2 = Math.PI * 2;
        let targetRad = 2 * pi2 + this.sliceRad / 2 - (this.rotation % pi2);
        let wheelRatio = (targetRad % pi2) / pi2; // [0,1)
        return wheelRatio * this.slices.length * 3;
    }

    GetCurrentPegIndex() {
        let pi2 = Math.PI * 2;
        let targetRad = 2 * pi2 + this.sliceRad / 2 - (this.rotation % pi2);
        let wheelRatio = (targetRad % pi2) / pi2; // [0,1)
        let index = Math.floor(this.GetCurrentPegValue());
        return index;
    }

    GetCurrentSlice(playerIndex) {
        let pi2 = Math.PI * 2;
        let targetRad = (playerIndex - 1) * 7 / 72 * pi2;
        targetRad += 2 * pi2 + this.sliceRad / 2 - (this.rotation % pi2);
        let wheelRatio = (targetRad % pi2) / pi2; // [0,1)
        let sliceIndex = Math.floor(wheelRatio * this.slices.length);
        return this.slices[sliceIndex];
    }

    PlayTick() {
        let tone = document.getElementById("click");
        tone.volume = 0.1;
        tone.pause();
        tone.currentTime = 0;
        tone.play();
    }


    AddBorders() {
        this.sourceCtx.lineWidth = 2;
        this.sourceCtx.strokeStyle = "#000";
        this.sourceCtx.rotate(this.sliceRad / 2);
        for (let i = 0; i < this.slices.length; i++) {
            this.sourceCtx.beginPath();
            this.sourceCtx.moveTo(0, 0);
            this.sourceCtx.lineTo(0, this.radius);
            this.sourceCtx.stroke();
            this.sourceCtx.rotate(this.sliceRad);
        }
        this.sourceCtx.rotate(-this.sliceRad / 2);

        this.sourceCtx.beginPath();
        this.sourceCtx.arc(0, 0, this.radius, 0, Math.PI * 2);
        this.sourceCtx.stroke();
    }

    CreateValueSlice(value, color) {
        let slice = new WheelSlice();
        slice.text = "$" + value;
        slice.activate = () => {
            // add value to current amount, times highlighted
        }
        this.DrawWedge(color);
        let text = value.toFixed(0);
        this.DrawLines(["$", ...text.split("")]);
        this.sourceCtx.rotate(this.sliceRad);
        return slice;
    }

    DrawWedge(color) {
        this.sourceCtx.beginPath();
        this.sourceCtx.moveTo(0, 0);
        let thetaOffset = -Math.PI / 2;
        this.sourceCtx.arc(0, 0, this.radius, -this.sliceRad / 2 + thetaOffset, this.sliceRad / 2 + thetaOffset);
        this.sourceCtx.lineTo(0, 0);
        this.sourceCtx.fillStyle = color;
        this.sourceCtx.fill();
    }

    CreateLoseTurnSlice() {
        let slice = new WheelSlice();
        slice.text = "Lose a turn";
        slice.activate = () => {
            // add value to current amount, times highlighted
        }
        this.DrawWedge("#FFF");
        this.DrawCharacter("LOSE", 0, 365, 30, "#0004", "#AAA0", 1);
        this.DrawCharacter("LOSE", 0, 365, 30, "#000", "#AAA0", 1);

        this.DrawCharacter("A", 0, 325, 20, "#0004", "#AAA0", 1);
        this.DrawCharacter("A", 0, 325, 20, "#000", "#AAA0", 1);

        let y = 280;
        let size = 50;
        for (let c of "TURN".split("")) {
            this.DrawCharacter(c, 0, y, size, "#0004", "#AAA0", 0.7);
            this.DrawCharacter(c, 0, y, size, "#000", "#AAA0", 0.7);
            size *= 0.9;
            y -= size * 0.7;
        }

        this.sourceCtx.rotate(this.sliceRad);
        return slice;
    }

    CreateBankruptSlice() {
        let slice = new WheelSlice();
        slice.text = "Bankrupt";
        slice.activate = () => {
            // add value to current amount, times highlighted
        }
        this.DrawWedge("#000");
        let chars = "BANKRUPT".split('');
        let y = 365;
        let size = 50;
        for (let c of chars) {
            this.DrawCharacter(c, 0, y, size, "#FFF", "#AAA0", 0.7);
            y -= size / 2 + 5;
            size *= 0.94;
        }
        this.sourceCtx.rotate(this.sliceRad);
        return slice;
    }

    DrawLines(lines) {
        let squishRatio = 1;
        if (lines[0] === "$") {
            let dollar = lines.shift();
            this.DrawCharacter(dollar, -5, 355, 40, "#0004", "#AAA0", 0.7);
            this.DrawCharacter(dollar, 0, 360, 40, "#000", "#AAA", 0.7);
            let dy = 100 / (lines.length - 1);
            let y = 210;
            squishRatio = 3 / (lines.length)
            while (lines.length) {
                let c = lines.pop();
                this.DrawCharacter(c, -5, y - 5, 50, "#0004", "#AAA0", squishRatio);
                this.DrawCharacter(c, 0, y, 50, "#000", "#AAA", squishRatio);
                y += dy;
            }
        }

    }

    DrawCharacter(c, x, y, size, color, stroke, squishRatio) {
        this.sourceCtx.fillStyle = color;
        this.sourceCtx.strokeStyle = stroke;
        this.sourceCtx.font = size.toFixed(1) + "px Grobold";
        this.sourceCtx.textBaseline = "middle";

        this.sourceCtx.lineWidth = 2;
        this.sourceCtx.textAlign = "center";
        this.sourceCtx.save();
        this.sourceCtx.transform(1, 0, 0, squishRatio, x, -y);
        this.sourceCtx.strokeText(c, 0, 0);
        this.sourceCtx.fillText(c, 0, 0);
        this.sourceCtx.restore();
    }
}


class WheelSlice {
    constructor() { }
}