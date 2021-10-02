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
    }

    Update() {
        //eventually: find nearest starting point
        let speed = 0.5;

        let isAtTarget = this.tileX * cellWidth === this.x && this.tileY * cellWidth === this.y;
        if (isAtTarget) {
            let navTile = navMesh.mesh.find(a => a.tileX === this.tileX && a.tileY === this.tileY);
            if (navTile) {
                let routes = navTile.routes;
                let route = routes[Math.floor(Math.random() * routes.length)];
                if (route) {
                    this.tileX += route.x;
                    this.tileY += route.y;
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


        if (this.hp <= 0) {
            this.isActive = false;
        }
    }

}