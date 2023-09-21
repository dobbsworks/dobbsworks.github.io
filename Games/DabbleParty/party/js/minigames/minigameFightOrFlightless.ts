class MinigameFightOrFlightless extends MinigameBase {
    title = "Fight Or Flightless";
    instructions = [
        "Defend yourself from the endless horde of penguins!",
        "Keep an eye on your snowball meter, it takes some",
        "time to build up more snowballs."
    ];
    backdropTile: ImageTile = tiles["bgGraph"][0][0];
    thumbnail: ImageTile = tiles["thumbnails"][3][0];
    controls: InstructionControl[] = [
        new InstructionControl(Control.Button, "Throw snowball"),
    ];
    songId = "overdue";

    snowman!: Sprite;
    facing = 0;
    charge = 0;
    chargeNeeded = 40;
    maxCharges = 5;

    Initialize(): void {
        this.score = 99;
        this.snowman = new SimpleSprite(0, 0, tiles["penguin"][1][0]).Scale(0.5);
        this.sprites.push(this.snowman);

        let penguins: Sprite[] = [];
        for (let i = 0; i < 100; i++) {
            let theta = Random.GetRand() * Math.PI * 2;
            let r = i * 50 + 300 + Random.GetRandIntFrom1ToNum(100);
            let penguin = new SimpleSprite(r * Math.cos(theta), r * Math.sin(theta), tiles["penguin"][0][0]).Scale(0.5);
            penguin.name = "penguin";
            let penguinSpeed = 0.4;
            penguin.dx = -Math.cos(theta) * penguinSpeed;
            penguin.dy = -Math.sin(theta) * penguinSpeed;
            penguins.push(penguin);
        }
        this.sprites.push(...penguins);
    }

    ThrowSnowball(): void {
        let snowball = new SimpleSprite(0, -1, tiles["penguin"][2][0]).Scale(0.5);
        let speed = 4;
        snowball.dx = speed * Math.cos(this.facing);
        snowball.dy = speed * Math.sin(this.facing);
        snowball.x += snowball.dx * 10;
        snowball.y += snowball.dy * 10;
        snowball.name = "snowball";
        this.sprites.push(snowball);
    }

    Update(): void {
        let rotationSpeed = 0.05;
        this.charge += 0.7;
        if (this.charge > this.maxCharges * this.chargeNeeded) {
            this.charge = this.maxCharges * this.chargeNeeded;
        }
        
        this.facing += rotationSpeed;
        
        if (!this.isEnded && this.timer >= 0) {
            let speedMultiplier = Math.pow(this.timer / 60, 0.25);
            for (let penguin of this.sprites.filter(a => a.name == "penguin")) {
                penguin.x += penguin.dx * speedMultiplier;
                penguin.y += penguin.dy * speedMultiplier;
                if (penguin.x**2 + penguin.y**2 < 30**2) {
                    penguin.isActive = false;
                    // hit snowman
                    this.score--;
                    audioHandler.PlaySound("hurt", false);
                } else {
                    for (let snowball of this.sprites.filter(a => a.name == "snowball")) {
                        let dist = Math.sqrt((penguin.x - snowball.x)**2 + (penguin.y - snowball.y)**2);
                        if (dist < 50) {
                            snowball.isActive = false;
                            penguin.isActive = false;

                            let anim = new SimpleSprite(penguin.x, penguin.y, tiles["penguin"][0][0], (spr) => { 
                                spr.x += spr.dx * 15;
                                spr.y += spr.dy * 15;
                                spr.rotation += 0.2;
                            }).Scale(0.5);
                            anim.dx = -penguin.dx;
                            anim.dy = -penguin.dy;
                            this.sprites.push(anim);
                            audioHandler.PlaySound("baa-dead", false);
                        }
                    }
                }
            }
            for (let snowball of this.sprites.filter(a => a.name == "snowball")) {
                snowball.x += snowball.dx;
                snowball.y += snowball.dy;
            }

            if (KeyboardHandler.IsKeyPressed(KeyAction.Action1, true) && this.charge > this.chargeNeeded) {
                this.charge -= this.chargeNeeded;
                this.ThrowSnowball();
                audioHandler.PlaySound("throw", false);
            }
            
        }



        let isGameOver = this.timer == 60 * 60;
        if (isGameOver) {
            this.SubmitScore(Math.floor(this.score));
        }

        this.sprites = this.sprites.sort((a,b) => a.y - b.y);
    }

    OnBeforeDrawSprites(camera: Camera): void {
        camera.ctx.save();

        camera.ctx.scale(1, 0.5);
        camera.ctx.strokeStyle = "red";
        camera.ctx.lineWidth = 8;
        camera.ctx.beginPath();
        let x = camera.canvas.width/2;
        let y = camera.canvas.height;
        let r = 200;
        let r2 = 180;
        camera.ctx.moveTo(x, y);
        camera.ctx.lineTo(x + r * Math.cos(this.facing), y + r * Math.sin(this.facing));
        camera.ctx.lineTo(x + r2 * Math.cos(this.facing + 0.1), y + r2 * Math.sin(this.facing + 0.1));
        camera.ctx.moveTo(x + r * Math.cos(this.facing), y + r * Math.sin(this.facing));
        camera.ctx.lineTo(x + r2 * Math.cos(this.facing - 0.1), y + r2 * Math.sin(this.facing - 0.1));
        camera.ctx.stroke();

        camera.ctx.restore();
    }

    OnAfterDraw(camera: Camera): void {
        if (!this.isEnded) {
            camera.ctx.fillStyle = "#0088";
            //camera.ctx.fillRect( 30, 510, 40, -204);
            let y = 508;
            for (let i=0; i<this.maxCharges; i++) {
                camera.ctx.fillRect( 30, y, 40, -39);
                y -= 40;
            }
            camera.ctx.fillStyle = "#FFFB";
            camera.ctx.fillRect( 34, 508, 32, -this.charge + 1);

        }
    }
}