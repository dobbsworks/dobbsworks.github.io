class EditorButtonBackgroundLoad extends EditorButton {

    constructor(name: string, number: number, public backgroundPreload: string) {
        super(EditorButtonBackgroundLoad.CreateBgThumb(backgroundPreload, number), "Use preset background");
        this.onClickEvents.push(() => {
            currentMap.LoadBackgroundsFromImportString(this.backgroundPreload)
        })
    }

    Update(): void {
        super.Update();
    }

    static CreateBgThumb(importStr: string, number: number): ImageTile {
        let row = Math.floor(number / 4);
        let col = number % 4;
        return tiles["bgThumbs"][col][row];
        let importedSections = importStr.split(";");
        let skyData = importedSections.shift();
        let skyElements = skyData?.split(",") || [];
        let canvas = document.createElement("canvas");
        canvas.width = camera.canvas.height;
        canvas.height = camera.canvas.height;
        let dummyCamera = new Camera(canvas);
        dummyCamera.y = 0;

        let grd = dummyCamera.ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(parseFloat(skyElements[2] || "0"), skyElements[0]);
        grd.addColorStop(parseFloat(skyElements[3] || "0"), skyElements[1]);
        dummyCamera.ctx.fillStyle = grd;
        dummyCamera.ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i=0; i<importedSections.length; i++) {
            let bgLayer = BackgroundLayer.FromImportString(i, importedSections[i]);
            bgLayer.Draw(dummyCamera, 0, true);
        }

        let opacityHex = parseFloat(skyElements[4] || "0").toString(16).substring(2, 4).padEnd(2, "0");
        let grd2 = dummyCamera.ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd2.addColorStop(parseFloat(skyElements[2] || "0"), skyElements[0] + opacityHex);
        grd2.addColorStop(parseFloat(skyElements[3] || "0"), skyElements[1] + opacityHex);
        dummyCamera.ctx.fillStyle = grd2;
        dummyCamera.ctx.fillRect(0, 0, canvas.width, canvas.height);
//document.body.appendChild(canvas)
        return new ImageTile(<any>canvas, 0, 0, canvas.width, canvas.height).Scale(50 / canvas.width / 4, false, false);
    }
}