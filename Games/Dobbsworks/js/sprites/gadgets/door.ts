class Door extends Sprite {

    public height: number = 12;
    public width: number = 12;
    respectsSolidTiles = false;
    public frame: number = 0;

    GetPairedDoor(): Door|null {
        let allDoors = <Door[]>this.layer.sprites.filter(a => a instanceof Door && a != this);
        if (allDoors.length == 0) return null;
        if (allDoors.length == 1) return allDoors[0];
        let doorHorizontalDistances = allDoors.map(a => Math.abs(a.x - this.x));
        doorHorizontalDistances.sort();
        let minHorizontalDistance = doorHorizontalDistances[0];

        // grab all doors that are tied for closest horizontally
        let closestDoorsHorizontally = allDoors.filter(a => Math.abs(a.x - this.x) == minHorizontalDistance);
        if (closestDoorsHorizontally.length == 1) return closestDoorsHorizontally[0];

        let doorVerticalDistances = allDoors.map(a => Math.abs(a.y - this.y));
        let minVerticalDistance = doorVerticalDistances[0];

        // grab all doors that are tied for closest vertically AND horizontally
        let closestDoors = closestDoorsHorizontally.filter(a => Math.abs(a.y - this.y) == minVerticalDistance);
        if (closestDoors.length == 1) return closestDoors[0];
        
        closestDoors.sort((a,b)=> (a.x - b.x) * 100000 + (a.y - b.y))
        return closestDoors[0];
    }
    

    Update(): void {
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