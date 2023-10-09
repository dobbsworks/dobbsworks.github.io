window.onload = () => { setTimeout(Initialize, 100) };
let tiles: any = {};
let camera: Camera;
let mouseHandler: MouseHandler;
let audioHandler: AudioHandler;
let playerIndex: number = 0;

let currentMinigame: MinigameBase | null = null;
let board: BoardMap | null = null;
let cutsceneService = new CutsceneService();

let minigames: (new() => MinigameBase)[] = [
    MinigameChip,
    MinigameConveyor,
    MinigameDodgePodge,
    MinigameFightOrFlightless,
    MinigameHoopstersForever,
    MinigameJustPlunkIt,
    MinigameLift,
    MinigameMatch,
    MinigameMushroomBounce,
    MinigamePointAndQuick,
    MinigameSlots,
    MinigameSnowtemPole,
    MinigameSpaceRace,
    MinigameThanksForTheCream,
    MinigameWhenPigsFly
]

function Initialize() {
    LoadImageSources();
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    camera = new Camera(canvas);

    mouseHandler = new MouseHandler(canvas);
    audioHandler = new AudioHandler();
    audioHandler.Initialize();
    new FocusHandler().Initialize();

    UnloadHandler.RegisterUnloadHandler();
    KeyboardHandler.InitKeyHandlers();
    setInterval(MainLoop, 1000 / 60);
    InitializeTwitchSpaceUI(); 
    InitializeItemList();

    cutsceneService.AddScene(new CutscenePreTitle());
    
    // cutsceneService.AddScene(new CutsceneMainMenu());
    
    // setTimeout(() => {
    //     board = new BoardMap(-2);
    //     board.Initialize();
    //     board.FromData({
    //         "boardId":0,
    //         "currentRound":1,
    //         "finalRound":1,
    //         "currentPlayerIndex":-1,
    //         "currentMinigameIndex":-1,
    //         "players":[
    //             {"gears":0,"coins":10,"turnOrder":1,"avatarIndex":0,"spaceIndex":54,"items":[0,1],"userId":1,"userName":"Dobbs","diceBag":[6,6]},
    //             {"gears":0,"coins":10,"turnOrder":2,"avatarIndex":1,"spaceIndex":54,"items":[0,1],"userId":1,"userName":"Dobbs","diceBag":[6,6]}
    //         ]});
        
    //     let hostControls = document.getElementById("inputSection");
    //     if (hostControls) hostControls.style.display = "block";
    //     setTimeout(() => {
    //         audioHandler.SetBackgroundMusic("level1")
    //     }, 7000);
    //     //cutsceneService.AddScene(new BoardCutSceneIntro());
        
    // }, 500)
}

var times: number[] = [];
function MainLoop() {
    let t0 = performance.now();
    Update();
    Draw();
    audioHandler.Update();
    let t1 = performance.now();
    times.push(t1 - t0);
    if (times.length > 60) times.shift();
}
function GetLoopTime() {
    return times.reduce((a, b) => a + b, 0) / times.length;
}

function Update(): void {
    KeyboardHandler.Update();
    if (KeyboardHandler.IsKeyPressed(KeyAction.Fullscreen, true)) document.getElementById("canvas")?.requestFullscreen();

    cutsceneService.Update();
    if (currentMinigame) {
        currentMinigame.BaseUpdate();
    } else if (board) {
        board.Update();
    }

    camera.Update();
    mouseHandler.UpdateMouseChanged();
    KeyboardHandler.AfterUpdate();
}
function Draw(): void {
    if (currentMinigame) {
        camera.ctx.imageSmoothingEnabled = false;
        currentMinigame.Draw(camera);
    } else if (board) {
        camera.ctx.imageSmoothingEnabled = true;
        board.Draw(camera);
    }
    cutsceneService.Draw(camera);
}


function LoadImageSources() {
    let container = document.getElementById("imageResources");
    let images = container?.querySelectorAll("img");
    if (images) for (let img of Array.from(images)) {
        let src = img.src.split(".png")[0];
        let imgName = src.split("/")[src.split("/").length - 1];
        if (src.indexOf("/bg/") > -1) imgName = "bg_" + imgName;
        let tileMap: any = {};
        let rows = +(img.dataset.rows ?? 1) || 1;
        let cols = +(img.dataset.cols ?? 1) || 1;
        let rowHeight = img.height / rows;
        let colWidth = img.width / cols;
        tileMap.rows = rows;
        tileMap.cols = cols;

        for (let col = 0; col < cols; col++) {
            let tileCol: any = {};
            for (let row = 0; row < rows; row++) {
                let imageTile = new ImageTile(
                    img, col * colWidth, row * rowHeight, colWidth, rowHeight, tileMap);
                tileCol[row] = imageTile;
            }
            tileMap[col] = tileCol;
        }
        tiles[imgName] = tileMap;
    }
}