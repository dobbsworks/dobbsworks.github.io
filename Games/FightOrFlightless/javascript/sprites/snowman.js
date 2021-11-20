class Snowman extends Sprite {

    constructor(tileX, tileY) {
        super(
            tileX * cellWidth,
            tileY * cellHeight,
            images.art);
        this.tile = 4;
        this.tileX = tileX;
        this.tileY = tileY;
    }

    drawOrder = 40;
    reloadTimer = 0;
    blocksBuild = true;

    Update() {
        if (this.reloadTimer > 0) {
            this.reloadTimer -= 1;
        }
        if (this.reloadTimer <= 0) {
            let range = cellWidth * 5;
            let allPenguins = sprites.filter(a => a instanceof Enemy && !a.isSubmerged);
            let nearPenguins = allPenguins.filter(a => (this.x - a.x) ** 2 + (this.y - a.y) ** 2 < range ** 2);
            if (nearPenguins.length > 0) {
                // TODO: how to find best target?
                let target = nearPenguins[0];
                this.reloadTimer = 45;
                sprites.push(new Snowball(this.x, this.y, target));
            }
        }
    }
}