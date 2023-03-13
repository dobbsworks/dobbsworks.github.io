class Camera {
    constructor(
        public canvas: HTMLCanvasElement
    ) {
        this.ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }

    public ctx: CanvasRenderingContext2D;
    public x: number = 0;
    public y: number = 9999;
    public prevX: number = 0;
    public prevY: number = 9999;
    public targetX = 0;
    public targetY = 0;
    public maxX: number = 0;
    public maxY: number = 0;
    public minX: number = 0;
    public minY: number = 0;
    public scale: number = 4;
    public target: Sprite | null = null;
    public targetScale: number = 4;
    public defaultScale: number = 4;
    public transitionTimer: number = 0;

    public isAutoscrollingHorizontally: boolean = false;
    public isAutoscrollingVertically: boolean = false;
    public autoscrollX: number = 0;
    public autoscrollY: number = 0;
    public autoscrollTriggers: CameraScrollTrigger[] = [];
    public cameraZoomTriggers: CameraZoomTrigger[] = [];
    public windTriggers: WindTrigger[] = [];

    public leftLockTimer = 0;
    public rightLockTimer = 0;
    public upLockTimer = 0;
    public downLockTimer = 0;

    public Update(): void {
        this.prevX = this.x;
        this.prevY = this.y;
        if (this.transitionTimer > 0) {
            let xChange = (this.targetX - this.x) / this.transitionTimer;
            let yChange = (this.targetY - this.y) / this.transitionTimer;
            this.x += xChange;
            this.y += yChange;

            this.transitionTimer--;
            return;
        }

        let onScreenScrollTriggers = this.autoscrollTriggers.filter(a =>
            a.x >= this.GetLeftCameraEdge() &&
            a.xRight <= this.GetRightCameraEdge() &&
            a.y >= this.GetTopCameraEdge() &&
            a.yBottom <= this.GetBottomCameraEdge()
        );
        if (onScreenScrollTriggers.length) {
            if (onScreenScrollTriggers.some(a => a instanceof CameraScrollLeft || a instanceof CameraScrollRight)) this.isAutoscrollingHorizontally = true;
            if (onScreenScrollTriggers.some(a => a instanceof CameraScrollUp || a instanceof CameraScrollDown)) this.isAutoscrollingVertically = true;
            for (let trigger of onScreenScrollTriggers) {
                if (trigger.direction) {
                    this.autoscrollX += trigger.direction.x * .25;
                    this.autoscrollY += trigger.direction.y * .25;
                    // remove from list of available triggers
                    this.autoscrollTriggers = this.autoscrollTriggers.filter(a => a != trigger);
                } else {
                    this.Reset(false);
                }
            }            
        }

        let onScreenWindTriggers = this.windTriggers.filter(a => 
            a.x >= this.GetLeftCameraEdge() &&
            a.xRight <= this.GetRightCameraEdge() &&
            a.y >= this.GetTopCameraEdge() &&
            a.yBottom <= this.GetBottomCameraEdge()
        );
        for (let trigger of onScreenWindTriggers) {
            if (trigger.direction) {
                currentMap.globalWindX += trigger.direction.x;
                currentMap.globalWindY += trigger.direction.y;
                // remove from list of available triggers
                this.windTriggers = this.windTriggers.filter(a => a != trigger);
            } else {
                this.ResetWind();
            }
        }            

        let onScreenZoomTriggers = this.cameraZoomTriggers.filter(a =>
            a.x >= this.GetLeftCameraEdge() &&
            a.xRight <= this.GetRightCameraEdge() &&
            a.y >= this.GetTopCameraEdge() &&
            a.yBottom <= this.GetBottomCameraEdge()
        );
        if (onScreenZoomTriggers.length) {
            for (let trigger of onScreenZoomTriggers) {
                if (trigger.direction == "in") {
                    this.targetScale *= 1.1892;
                } else {
                    this.targetScale /= 1.1892;
                }
                if (this.targetScale > this.defaultScale * 2) this.targetScale = this.defaultScale * 2;
                if (this.targetScale < this.defaultScale / 4) this.targetScale = this.defaultScale / 4;
                // remove from list of available triggers
                this.cameraZoomTriggers = this.cameraZoomTriggers.filter(a => a != trigger);
            }            
        }

        if (this.isAutoscrollingHorizontally) {
            this.targetX += this.autoscrollX;
        } else {
            if (this.target) {
                this.targetX = this.target.xMid;
            }
        }

        if (this.isAutoscrollingVertically) {
            this.targetY += this.autoscrollY;
        } else {
            if (this.target) {
                this.targetY = this.target.yBottom - 12;
            }
        }


        if (this.targetScale < 1) this.targetScale = 1;
        if (this.targetScale > 8) this.targetScale = 8;
        if (this.scale != this.targetScale) {
            if (Math.abs(this.scale - this.targetScale) < 0.03) this.scale = this.targetScale;
            else {
                if (editorHandler.isInEditMode) {
                    this.scale += (this.targetScale - this.scale) * 0.05;
                } else {
                    this.scale += (this.targetScale - this.scale) * 0.01;
                }
            }
        }

        if (currentMap) {
            this.AdjustCameraTargetForMapBounds();

            let xDelta = Math.abs(this.x - this.targetX);
            let yDelta = Math.abs(this.y - this.targetY);
            let isCameraFar = xDelta > this.canvas.width / 2 / this.scale || yDelta > this.canvas.height / 2 / this.scale;

            if (isCameraFar && !currentMap.doorTransition && !editorHandler.isInEditMode) {
                this.transitionTimer = 90;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
            }
        }
    }

    public AdjustCameraTargetForMapBounds(): void {
        let minScaleForY = camera.canvas.height / currentMap.mainLayer.GetMaxY();
        let minScaleForX = camera.canvas.width / currentMap.mainLayer.GetMaxX();
        let minScale = Math.max(minScaleForX, minScaleForY);
        if (this.targetScale < minScale) this.targetScale = minScale;
        if (this.scale < minScale) this.scale = minScale;

        this.maxX = currentMap.mainLayer.GetMaxX() - this.canvas.width / 2 / this.scale;
        this.maxY = currentMap.mainLayer.GetMaxY() - this.canvas.height / 2 / this.scale;
        if (this.targetX > this.maxX) this.targetX = this.maxX;
        if (this.targetY > this.maxY) this.targetY = this.maxY;

        // Handle horizontal screen locks
        let horizontalLocks = currentMap.cameraLocksHorizontal;
        let hittingLeftLock = false;
        let hittingRightLock = false;
        for (let lock of horizontalLocks) {
            if (this.targetX > lock.xMid && this.GetLeftCameraEdge() < lock.x) {
                this.targetX = lock.x + this.canvas.width / 2 / this.scale;
                hittingLeftLock = true;
            } else {
            }
            if (this.targetX < lock.xMid && this.GetRightCameraEdge() > lock.xRight) {
                this.targetX = lock.xRight - this.canvas.width / 2 / this.scale;
                hittingRightLock = true;
            }
        }
        if (hittingLeftLock) {
            this.leftLockTimer++;
        } else {
            this.leftLockTimer = 0;
        }
        if (hittingRightLock) {
            this.rightLockTimer++;
        } else {
            this.rightLockTimer = 0;
        }
        
        // Handle vertical screen locks
        let verticalLocks = currentMap.cameraLocksVertical;
        let hittingUpLock = false;
        let hittingDownLock = false;
        for (let lock of verticalLocks) {
            if (this.targetY + 7 > lock.yMid && this.GetTopCameraEdge() < lock.y) {
                this.targetY = lock.y + this.canvas.height / 2 / this.scale;
                hittingUpLock = true;
            } else {
            }
            if (this.targetY + 7 < lock.yMid && this.GetBottomCameraEdge() > lock.yBottom) {
                this.targetY = lock.yBottom - this.canvas.height / 2 / this.scale;
                hittingDownLock = true;
            }
        }
        if (hittingUpLock) {
            this.upLockTimer++;
        } else {
            this.upLockTimer = 0;
        }
        if (hittingDownLock) {
            this.downLockTimer++;
        } else {
            this.downLockTimer = 0;
        }

        this.minX = this.canvas.width / 2 / this.scale;
        this.minY = this.canvas.height / 2 / this.scale;
        if (this.targetX < this.minX) this.targetX = this.minX;
        if (this.targetY < this.minY) this.targetY = this.minY;
    }

    public Reset(alsoResetWind = true): void {
        this.autoscrollX = 0;
        this.autoscrollY = 0;
        this.isAutoscrollingHorizontally = false;
        this.isAutoscrollingVertically = false;
        this.targetScale = this.defaultScale;
        if (currentMap) {
            this.autoscrollTriggers = <CameraScrollTrigger[]>currentMap.mainLayer.sprites.filter(a => a instanceof CameraScrollTrigger);
            this.cameraZoomTriggers = <CameraZoomTrigger[]>currentMap.mainLayer.sprites.filter(a => a instanceof CameraZoomTrigger);
            if (alsoResetWind) this.ResetWind();
        }
    }

    private ResetWind(): void {
        this.windTriggers = <WindTrigger[]>currentMap.mainLayer.sprites.filter(a => a instanceof WindTrigger);
        currentMap.globalWindX = 0;
        currentMap.globalWindY = 0;
    }

    public SnapCamera(): void {
        this.x = this.targetX;
        this.y = this.targetY;
    }

    public GetLeftCameraEdge(): number {
        return this.targetX - this.canvas.width / 2 / this.scale;
    }
    public GetRightCameraEdge(): number {
        return this.targetX + this.canvas.width / 2 / this.scale;
    }
    public GetTopCameraEdge(): number {
        return this.targetY - this.canvas.height / 2 / this.scale;
    }
    public GetBottomCameraEdge(): number {
        return this.targetY + this.canvas.height / 2 / this.scale;
    }

    public Clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
