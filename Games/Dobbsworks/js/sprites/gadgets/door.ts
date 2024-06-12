class Door extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    public frame: number = 0;

    originalX = -1;
    originalY = -1;

    GetPairedDoor(): Door|null {
        let allDoors = <Door[]>this.layer.sprites.filter(a => a instanceof Door && a != this);
        if (allDoors.length == 0) return null;
        if (allDoors.length == 1) return allDoors[0];
        let doorHorizontalDistances = allDoors.map(a => Math.abs(a.originalX - this.originalX));
        
        if (Version.DoesCurrentLevelUseOldDoorPairing()) {
            doorHorizontalDistances.sort();
        } else {
            doorHorizontalDistances.sort((a,b) => a - b);
        }
        let minHorizontalDistance = doorHorizontalDistances[0];

        // grab all doors that are tied for closest horizontally
        let closestDoorsHorizontally = allDoors.filter(a => Math.abs(a.originalX - this.originalX) == minHorizontalDistance);
        if (closestDoorsHorizontally.length == 1) return closestDoorsHorizontally[0];

        let doorVerticalDistances = allDoors.map(a => Math.abs(a.originalY - this.originalY));
        
        if (Version.DoesCurrentLevelUseOldDoorPairing()) {
            doorVerticalDistances.sort();
        } else {
            doorVerticalDistances.sort((a,b) => a - b);
        }
        let minVerticalDistance = doorVerticalDistances[0];

        // grab all doors that are tied for closest vertically AND horizontally
        let closestDoors = closestDoorsHorizontally.filter(a => Math.abs(a.originalY - this.originalY) == minVerticalDistance);
        if (closestDoors.length == 1) return closestDoors[0];
        
        closestDoors.sort((a,b)=> (a.originalX - b.originalX) * 100000 + (a.originalY - b.originalY))
        return closestDoors[0];
    }
    

    Update(): void {
        if (this.originalX == -1) {
            this.originalX = this.x;
            this.originalY = this.y;
        }
    }

    GetFrameData(frameNum: number): FrameData {
        return {
            imageTile: tiles["door"][this.frame][0],
            xFlip: false,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}

class ScaredyDoor extends Sprite {
    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    originalX = -1;
    originalY = -1;
    public zIndex: number = -1;

    checksSinceEnemiesNear = 0;

    Update(): void {

        if (!this.WaitForOnScreen()) return;

        if (this.originalX == -1) {
            this.originalX = this.x;
            this.originalY = this.y;
        }

        if (this.age % 10 == 0) {
            // only check every so often
            
            // are enemies around?
            let enemiesNear = this.layer.sprites.some(a => a instanceof Enemy && a.IsOnScreen());
            if (enemiesNear) {
                this.checksSinceEnemiesNear = 0;
            } else {
                this.checksSinceEnemiesNear++;
            }

            if (player && this.checksSinceEnemiesNear > 18) {
                if (Math.abs(player.xMid - this.xMid) + Math.abs(player.yMid - this.yMid) < 24 || this.checksSinceEnemiesNear > 24) {
                    let door = <Door>(this.ReplaceWithSpriteType(Door));
                    door.originalX = this.originalX;
                    door.originalY = this.originalY;
                }
            }
        }
    }

    GetFrameData(frameNum: number): FrameData {
        let frame = 0;
        if (this.checksSinceEnemiesNear > 6) {
            frame = 1;
        }
        if (this.checksSinceEnemiesNear > 12) {
            frame = 2;
        }
        if (this.checksSinceEnemiesNear > 18) {
            frame = 3;
        }
        return {
            imageTile: tiles["door"][frame][2],
            xFlip: frameNum % 60 < 30,
            yFlip: false,
            xOffset: 0,
            yOffset: 0
        };
    }
}