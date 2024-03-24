class Dragon extends Enemy {

    public height: number = 48;
    public width: number = 18;
    respectsSolidTiles = true;
    canBeBouncedOn = false;
    anchor = Direction.Down;


    // health bar?
    // limit 1 per map?

    // script:
        // preview for direct:
            // slow pan across watery scene, shipwreck
            // dabble emerges from water
            // "You've been asking..."
            // rain sounds, dark sky
            // "Be careful what you wish for"
            // lightning illuminates dragon shape
            // Roar as cut to black
            // quick show-off of several smaller new features
                // minecart jumping/ducking
                // spring ring vertical climb
                // nimby
                // flip platform run
                // giant snowman chase
                // jumbo jelly swim
                //
                // 3d rendered dabble falling from balloon, explosions

                // enemy walking by, then peek out of barrel

                // avatars

                // pig snake
                // giant octopus? 
                    // tentacle trigger
                // massive wallop

                // jellyfish
                // school of fish in the shape of a big fish
                // net to capture enemies and release them elsewhere?
                // seesaw platforms
                    // throw bowling ball on other side, fling up
                // bathysphere-style air bubble
                // apple to eat?
                // bouncy flower platform - makes you spin jump

        // phase 1
        // dragon screams from off-screen
        // large fire pillars in auto-scroll
        // have to navigate cave while dodging fire blasts from top and bottom, maybe also from sides?

        // phase 2, climbing the mountain, autoscroll
        // dragon swoops from sides
        // target player but limit based on camera
        // dots indicate path?
        // you can use dragon as platform for some jumps, but damages if you direct hit

        // phase 3, top of the mountain
        // dragon lands on arena, screenshake
        // particle fire blasts, leaves fading fire terrain
        // dragon occasionally takes flight, leaves from top of screen, then does either a swoop or fire attack pattern
        
        // Dragon picks up an enemy with its tail and throws it
        // player has to watch for usable ammo enemies (snails)
        // (need a new enemy that can become ammo after being stomped)

        // After first hit, small dragons summoned, maybe a heart from a hot-air balloon?

        // After second hit, loud roar shatters all breakable blocks on screen, reducing arena size

        // Third hit, falls off screen, death cry, player gets a key bubble

        // door, checkpoint

        // Ride dragon out of caves
        // Large platform, you can maneuver it up and down while standing on it, or you can jump
        // coin indicators

        // trigger for end of dragon ride, crash to ground
        // trigger final phase: big hands and head boss
        // falling rocks, 1 breaks into heavy stone
        // need to jump on hand, hit head with stone


        // new things
            // fire pillar trigger
            // baby dragons
            // dragon swoop trigger
            // background changer



    Update(): void {
        if (!this.WaitForOnScreen()) return;
        
        if (player) {
            this.direction = (player.xMid < this.xMid ? -1 : 1);
        }

        this.ApplyInertia();
        this.ReactToWater();
        this.ReactToVerticalWind();
    }


    GetThumbnail(): ImageTile {
        return tiles["body"][0][0];
    }

    GetFrameData(frameNum: number): FrameData[] {
        var flapFrames = [0, 1, 2, 3, 4, 5, 5, 5, 5, 4, 4, 4, 3, 3, 2, 2, 1, 1]
        var flapFrame = flapFrames[(Math.floor(this.age / 4)) % flapFrames.length];
        return [
            {
                imageTile: tiles["wings"][0][3],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? 48 : 60,
                yOffset: 35
            },
            {
                imageTile: tiles["legs"][0][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? -10 : 3,
                yOffset: -30
            },
            {
                imageTile: tiles["arms"][0][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? -13 : 6,
                yOffset: -18
            },
            {
                imageTile: tiles["body"][0][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? 15 : 10,
                yOffset: 0
            },
            {
                imageTile: tiles["legs"][1][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? -1 : -8,
                yOffset: -30
            },
            {
                imageTile: tiles["arms"][1][0],
                xFlip: this.direction == 1,
                yFlip: false,
                xOffset: this.direction == 1 ? 0 : -2,
                yOffset: -18
            },
        ];
    }
}


class SingleFireBreath extends Hazard {
    public height: number = 6;
    public width: number = 6;
    public respectsSolidTiles: boolean = true;

    flip1 = Math.floor(Math.random() * 4);
    flip2 = Math.floor(Math.random() * 4);

    maxAge = Math.random() * 8 + 30;

    Update(): void {
        super.Update();

        if (this.age > this.maxAge) this.isActive = false;

        this.ApplyInertia();
        this.ReactToPlatformsAndSolids();
        this.MoveByVelocity();
    }
    
    IsHazardActive(): boolean {
        return true;
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = Math.floor(10 * this.age / this.maxAge);
        if (frame >= 10) frame = 9;
        return {
            imageTile: tiles["fireBreath"][frame][0],
            xFlip: this.age % this.flip1 == 0,
            yFlip: this.age % this.flip2 == 0,
            xOffset: 3,
            yOffset: 3
        };
    }

}