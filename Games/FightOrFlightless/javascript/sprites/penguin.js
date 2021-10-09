class Penguin extends Sprite {

    constructor(initialTileX, initialTileY) {
        super(
            initialTileX * cellWidth,
            initialTileY * cellHeight,
            images.art);
        this.tile = 3;
        this.hp = 5;
        this.tileX = initialTileX;
        this.tileY = initialTileY;
        this.oldTileX = null;
        this.oldTileY = null;
    }

    drawOrder = 50;
    blocksBuild = true;


    Update() {
        //eventually: find nearest starting point
        let speed = 0.5;

        let isAtTarget = this.tileX * cellWidth === this.x && this.tileY * cellWidth === this.y;
        if (isAtTarget) {
            let navTile = navMesh.mesh.find(a => a.tileX === this.tileX && a.tileY === this.tileY);
            if (navTile) {
                let routes = navTile.routes.map(a => ({ route: a, tile: navMesh.mesh.find(b => b.tileX === this.tileX + a.x && b.tileY === this.tileY + a.y) }));
                let route = routes[Math.floor(Math.random() * routes.length)];
                if (route) {
                    this.oldTileX = this.tileX;
                    this.oldTileY = this.tileY;
                    this.tileX += route.route.x;
                    this.tileY += route.route.y;
                } else {
                    console.error("Penguin can't find route!");
                }
            } else {
                console.error("Penguin can't nav!");
            }
        }

        let targetX = this.tileX * cellWidth;
        let targetY = this.tileY * cellHeight;

        let distanceToTarget = (this.x - targetX) ** 2 + (this.y - targetY) ** 2;
        if (distanceToTarget < speed ** 2) {
            this.x = targetX;
            this.y = targetY;
        } else {
            let theta = Math.atan2(targetY - this.y, targetX - this.x);
            this.x += speed * Math.cos(theta);
            this.y += speed * Math.sin(theta);
        }

        let isOnGround = sprites.
            filter(a => a instanceof GroundTile).
            some(a => (a.tileX === this.tileX && a.tileY === this.tileY)
                || (a.tileX === this.oldTileX && a.tileY === this.oldTileY));

        if (isOnGround) {
            this.tile = 3;
        } else {
            this.tile = (this.age % 60 < 30) ? 9 : 10;
        }


        if (this.hp <= 0) {
            this.isActive = false;
        }
    }

}