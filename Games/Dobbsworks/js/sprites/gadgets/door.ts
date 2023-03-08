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